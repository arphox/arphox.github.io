require "digest"
require "fileutils"
require "open-uri"
require "openssl"
require "socket"
require "timeout"

# Precompiled upstream release: no TypeScript toolchain or runtime CDN needed.
# The distributed file includes Project Nayuki's full MIT license notice.
module LocalToolsDependencies
  DEPENDENCIES = [{
    url: "https://github.com/nayuki/QR-Code-generator/releases/download/v1.8.0/qrcodegen-v1.8.0-es6.js",
    sha256: "6a1116192ed1dd67fa1bf31e77f5817103d71c23bbac24c382e698b7668bdd01",
    path: "local-tools/qr-generator/vendor/qrcodegen.js"
  }].freeze

  def self.prepare(site)
    cache = File.join(site.cache_dir, "local-tools-dependencies")
    FileUtils.mkdir_p(cache)
    DEPENDENCIES.each do |dependency|
      cached = File.join(cache, dependency[:sha256])
      bytes = if File.file?(cached)
        File.binread(cached)
      else
        Jekyll.logger.info "Local Tools:", "Downloading pinned QR library"
        URI.open(dependency[:url], open_timeout: 15, read_timeout: 30, &:read)
      end
      unless Digest::SHA256.hexdigest(bytes) == dependency[:sha256]
        raise Jekyll::Errors::FatalException, "Local Tools dependency hash mismatch: #{dependency[:url]}"
      end
      File.binwrite(cached, bytes)
      target = File.join(site.dest, dependency[:path])
      FileUtils.mkdir_p(File.dirname(target))
      File.binwrite(target, bytes)
    end
  rescue OpenURI::HTTPError, SocketError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError => error
    raise Jekyll::Errors::FatalException, "Local Tools dependency preparation failed: #{error.message}"
  end
end

# Runs for both `jekyll build` and `jekyll serve`, including rebuilds. Downloads
# stay in Jekyll's ignored cache; only verified assets reach the published site.
Jekyll::Hooks.register :site, :post_write do |site|
  LocalToolsDependencies.prepare(site)
end
