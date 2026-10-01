import { i18n } from '../locales/schema'

/** Resolve supported tags without guessing between Chinese scripts. */
export function resolveLocale(requested: string | null | undefined): string | undefined {
  const tag = requested?.toLowerCase()
  const available = i18n.global.availableLocales
  const exact = available.find(locale => locale.toLowerCase() === tag)
  if (exact) {
    return exact
  }

  // Explicit Hans, or a scriptless region conventionally using Simplified.
  // Match whole subtags; an explicit Hant script must outrank the region.
  if (tag && /^(?:zh-hans|zh-(?:cn|sg|my))(?:-|$)/.test(tag)) {
    return available.find(locale => locale.toLowerCase() === 'zh-hans')
  }

  return undefined
}

/**
 * Set the active locale.
 * vue-i18n is configured in LEGACY mode, where i18n.global.locale
 * is a plain string — NOT a ref. Never write .locale.value.
 */
export function setLocale(locale: string): void {
  ;(i18n.global as any).locale = locale
}
