const AUTOMATED = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|whatsapp|pinterest|quora|linkedinbot|twitterbot|duckduckbot|yandex|baidu|lighthouse|pagespeed|gtmetrix|headless/i

export function isAutomatedBrowser() {
  if (typeof window === 'undefined') return false
  return AUTOMATED.test(window.navigator.userAgent) || Boolean(window.navigator.webdriver)
}
