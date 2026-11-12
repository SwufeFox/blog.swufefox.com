/**
 * Site configuration.
 *
 * Everything a user of this template is expected to change lives here: identity,
 * addresses, languages and the few knobs that shape the layout.
 */

export const locales = ['zh', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'zh'

/** UI strings. Keep one entry per locale; the type enforces exhaustiveness. */
export interface UiStrings {
  skip: string
  home: string
  navMenu: string
  close: string
  switchLanguage: string
  themeToggle: string
  allPosts: string
  categories: string
  tags: string
  category: string
  readMinutes: (minutes: number) => string
  updated: (date: string) => string
  breadcrumb: string
  postNavigation: string
  toc: string
  colophon: string
  licenseText: string
  source: string
  previous: string
  next: string
  backToTop: string
  empty: string
  notFoundTitle: string
  notFoundText: string
  notFoundAction: string
  searchLabel: string
  searchPlaceholder: string
  searchFoundOne: string
  searchFoundMany: string
  searchNone: string
  searchClear: string
  searchHint: string
  postsCount: (count: number) => string
  tagsCount: (count: number) => string
  postsLabel: string
  latestPosts: string
  categoriesLabel: string
  tagsLabel: string
  typeLabel: string
  termLabel: string
  copyCode: string
  copied: string
}

export interface SiteConfig {
  /** Display name, shown in the header and in <title>. */
  title: string
  /** Small latin label printed next to the title. */
  suffix: string
  /** One-liner used on the home page and in meta descriptions. */
  description: Record<Locale, string>
  /** Absolute origin of the deployed site, no trailing slash. */
  url: string
  author: string
  email?: string
  /** External "about me" page. */
  about?: string
  repo?: string
  /** Profiles shown in the footer. */
  sameAs?: string[]
  /** Locale used when the visitor did not ask for another one. */
  defaultLocale: Locale
  /** Every locale the site is published in. */
  locales: Locale[]
  /** Endonyms, shown in the language switcher. */
  localeNames: Record<Locale, string>
  /** Labels for the header navigation. */
  nav: Record<Locale, { tags: string; search: string; about: string }>
  /** Posts shown per page on the home page. 0 means "all of them". */
  postsOnHome: number
  /** Short English kicker above the hero title. */
  heroKicker?: string
  /** Brand motto shown in the footer. */
  motto?: string
  /** Content licence shown in the article colophon. */
  license: {
    name: string
    url: string
  }
}

export const siteConfig: SiteConfig = {
  title: 'SwufeFox',
  suffix: '/ notes',
  description: {
    zh: '西南财经大学的学生开源社区。我们写代码、做量化，也把学到的东西开源。',
    en: 'A student-led open-source community at SWUFE. We build software, research markets, and open-source what we learn.',
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.swufefox.com',
  author: 'Magixyne',
  email: 'magi0@swufefox.com',
  about: 'https://github.com/SwufeFox',
  repo: 'https://github.com/SwufeFox/blog.swufefox.com',
  sameAs: ['https://github.com/SwufeFox'],
  heroKicker: 'SWUFE // OPEN SOURCE',
  motto: 'The final variable is yours to change.',
  defaultLocale,
  locales: [...locales],
  localeNames: {
    zh: '中文',
    en: 'English',
  },
  nav: {
    zh: { tags: '归档', search: '搜索', about: '关于' },
    en: { tags: 'Archive', search: 'Search', about: 'About' },
  },
  postsOnHome: 6,
  license: {
    name: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  },
}

export function isLocale(value: string): value is Locale {
  return (siteConfig.locales as string[]).includes(value)
}
