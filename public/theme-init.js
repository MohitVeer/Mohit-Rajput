(function () {
  var theme = 'dark'
  try {
    var stored = window.localStorage.getItem('portfolio-theme')
    if (stored === 'light' || stored === 'dark' || stored === 'system') theme = stored
  } catch (e) {}
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') theme = 'dark'
  var resolved = theme
  if (theme === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  var root = document.documentElement
  if (resolved === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  root.style.colorScheme = resolved
})()
