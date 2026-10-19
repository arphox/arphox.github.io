(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  let override = null;
  try {
    const saved = localStorage.getItem('rental-page-theme');
    if (saved === 'light' || saved === 'dark') override = saved;
  } catch { /* Follow the device when storage is unavailable. */ }

  function apply() {
    if (override) root.dataset.theme = override;
    else root.removeAttribute('data-theme');
  }
  function isDark() {
    return override ? override === 'dark' : system.matches;
  }
  apply();

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    function refresh() {
      apply();
      const dark = isDark();
      const label = dark ? 'Világos témára váltás' : 'Sötét témára váltás';
      button.setAttribute('aria-label', label);
      button.title = label;
      themeColor.content = dark ? '#171d1b' : '#f5f6f7';
    }
    button.addEventListener('click', () => {
      override = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('rental-page-theme', override); } catch { /* Optional persistence. */ }
      refresh();
    });
    system.addEventListener('change', refresh);
    refresh();
  });
})();
