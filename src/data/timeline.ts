export interface TimelineEntry {
  /** 表示用の日付文字列。例: "2024-03", "2024年3月", "2020". 配列の並び順がそのまま表示順になる */
  date: string
  title: string
  description?: string
  /** astro-icon 名 (例: "fa6-brands:github", "material-symbols:school") */
  icon?: string
  link?: { url: string; label?: string }
}

/**
 * 年表のエントリ。新しいものを先頭に追加する。
 * 利用可能なアイコンは src/constants/icon.ts や iconify のコレクションを参照。
 */
export const timeline: TimelineEntry[] = [
  {
    date: '2024-03',
    title: 'pulsate-dev/pulsate にコミット開始',
    description: '分散SNSのバックエンド開発に参加',
    icon: 'fa6-brands:github',
    link: {
      url: 'https://github.com/pulsate-dev/pulsate',
      label: 'pulsate-dev/pulsate',
    },
  },
  {
    date: '高校生',
    title: 'プログラミングを始める',
    description: 'Discord Bot や Minecraft Mod を作ったのがきっかけ',
    icon: 'material-symbols:code',
  },
]
