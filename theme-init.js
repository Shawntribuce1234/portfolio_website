// Apply the saved theme before the stylesheet loads to prevent a flash.
try {
  const theme = localStorage.getItem('shawn-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch { /* Storage may be unavailable in private browsing or file previews. */ }
