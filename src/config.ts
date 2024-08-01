import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'ab2m.link',
  subtitle: "Alliana's Blog",
  lang: 'ja', // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko'
  themeColor: {
    hue: 280, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: true, // Hide the theme color picker for visitors
  },
  banner: {
    enable: false,
    src: 'https://avatars.githubusercontent.com/u/56180684', // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    position: 'center', // Equivalent to object-position, defaults center
    credit: {
      enable: false, // Display the credit text of the banner image
      text: '', // Credit text to be displayed
      url: '', // (Optional) URL link to the original artwork or artist's page
    },
  },
  favicon: [
    // Leave this array empty to use the default favicon
    // {
    //   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
    //   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
    //   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
    // }
  ],
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: 'GitHub',
      url: 'https://github.com/Allianaab2m/ab2m.link', // Internal links should not include the base path, as it is automatically added
      external: true, // Show an external link icon and will open in a new tab
    },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'https://avatars.githubusercontent.com/u/56180684', // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: 'Alliana',
  bio: 'TypeScriptとNeovimとLinuxが好きな人です．',
  links: [
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/Allianaab2m',
    },
    {
      name: 'Discord',
      icon: 'fa6-brands:discord',
      url: 'https://discord.com/users/271922478182301696',
    },
    {
      name: 'Bluesky',
      icon: 'fa6-brands:bluesky',
      url: 'https://bsky.app/profile/ab2m.link',
    },
    {
      name: 'Zenn',
      icon: 'simple-icons:zenn',
      url: 'https://zenn.dev/alliana_ab2m',
    },
    {
      name: 'SSH Key',
      icon: 'fa6-solid:key',
      url: 'https://github.com/Allianaab2m.keys',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: false,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
