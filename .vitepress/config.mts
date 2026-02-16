import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "wiki",
  
  title: "09.02.06 Демо Wiki",
  description: "Простенькая wiki по выполнению БУ/ПУ ДЭ 09.02.06",
  base: "/sa-demo-wiki/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Модуль 1',
        items: 
        [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'godia', link: '/godia' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Модуль 1',
        items: 
        [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'godia', link: '/godia' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
