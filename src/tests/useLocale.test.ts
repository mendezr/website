import { afterEach, describe, expect, it } from 'vitest'
import { resolveLocale, setLocale } from '../composables/useLocale'
import { i18n } from '../locales/schema'

const DEFAULT_LOCALE = 'en-US'
const SUPPORTED_LOCALES = [
  'ar',
  'cs',
  'de-DE',
  'en-US',
  'eo',
  'es',
  'fr-FR',
  'hi',
  'id',
  'it',
  'ja-JP',
  'ko-KR',
  'nl-NL',
  'pl',
  'pt-BR',
  'ru-RU',
  'sk-SK',
  'sv',
  'tr',
  'vi-VN',
  'zh-HK',
  'zh-Hans',
  'zh-TW',
]

describe('useLocale', () => {
  afterEach(() => {
    setLocale(DEFAULT_LOCALE)
  })

  it('bundles the supported locales', () => {
    // 'uk' is added by this branch; keep it out of the list above so the
    // literal stays mergeable with locales added on main.
    const expected = [...SUPPORTED_LOCALES, 'uk'].sort()
    expect(Object.keys(i18n.global.messages).sort()).toEqual(expected)
  })

  it('uses en-US as the default locale', () => {
    expect((i18n.global as any).locale).toBe(DEFAULT_LOCALE)
  })

  it.each(['zh-SG', 'zh-MY', 'ZH-sg', 'zh-my', 'zh-SG-u-nu-latn', 'zh-MY-u-nu-latn', 'zh-CN', 'zh-Hans-CN', 'zh-Hans', 'ZH-hAnS-cn', 'zh-Hans-SG', 'zh-Hans-MY'])('resolves Simplified Chinese %s', (tag) => {
    expect(resolveLocale(tag)).toBe('zh-Hans')
    setLocale(resolveLocale(tag)!)
    expect((i18n.global as any).locale).toBe('zh-Hans')
  })

  it.each(['zh-HK', 'zh-TW', 'de-DE', 'uk'])('preserves supported locale %s', (tag) => {
    expect(resolveLocale(tag)).toBe(tag)
  })

  it.each(['zh', 'zh-Hant', 'zh-Hant-SG', 'zh-Hant-MY', 'zh-Hant-CN', 'zh-SGfoo', 'zh-MYfoo', 'zh-Hansfoo', 'zh-CNfoo', 'xx-XX', '', null, undefined])('does not guess unsupported locale %s', (tag) => {
    expect(resolveLocale(tag)).toBeUndefined()
  })

  it('switches the active locale', () => {
    setLocale('ja-JP')
    expect((i18n.global as any).locale).toBe('ja-JP')

    setLocale('de-DE')
    expect((i18n.global as any).locale).toBe('de-DE')
  })
})
