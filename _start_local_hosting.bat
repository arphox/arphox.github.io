@echo off
setlocal
pushd "%~dp0" || exit /b 1

where ruby.exe >nul 2>&1
if errorlevel 1 (
  echo ERROR: Install Ruby with DevKit from https://rubyinstaller.org/ and reopen the terminal.
  goto failed
)

call bundle --version >nul 2>&1
if not errorlevel 1 goto check_bundle
echo Installing Bundler...
call gem install bundler --no-document
if errorlevel 1 goto failed
for /f "delims=" %%G in ('ruby -e "puts Gem.bindir"') do set "PATH=%%G;%PATH%"

:check_bundle
call bundle check >nul 2>&1
if not errorlevel 1 goto serve

echo Installing missing project gems...
where ridk.cmd >nul 2>&1
if errorlevel 1 goto install_without_devkit

call ridk exec gcc --version >nul 2>&1
if errorlevel 1 goto install_devkit
call ridk exec make --version >nul 2>&1
if not errorlevel 1 goto install_with_devkit

:install_devkit
echo Installing Ruby native-extension build tools. The first run may take a few minutes.
call ridk install 1
if errorlevel 1 goto failed
REM Scoop's MSYS2 package may have an uninitialized signing keyring.
call ridk exec bash /usr/bin/pacman-key --init
if errorlevel 1 goto failed
call ridk exec bash /usr/bin/pacman-key --populate msys2
if errorlevel 1 goto failed
call ridk install 3
if errorlevel 1 goto failed

:install_with_devkit
call ridk exec bundle install
if errorlevel 1 goto failed
goto serve

:install_without_devkit
call bundle install
if errorlevel 1 goto failed

:serve
REM Full-page refresh avoids injecting a LiveReload connection into Local Tools.
echo Starting local hosting at http://localhost:4000/ - press Ctrl+C to stop.
call bundle exec jekyll serve %*
if errorlevel 1 goto failed
popd
exit /b 0

:failed
set "hosting_exit_code=%errorlevel%"
if "%hosting_exit_code%"=="0" set "hosting_exit_code=1"
echo ERROR: Local hosting failed. See the error above.
popd
exit /b %hosting_exit_code%
