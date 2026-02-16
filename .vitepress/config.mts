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
     // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: 
      [
      {
        text: 'Модуль 1',
        items: 
        [
          { text: 'task1-1', link: '/task1-1' },
          { text: 'task1-2', link: '/task1-2' },
          { text: 'task1-3', link: '/task1-3' },
          { text: 'task1-4', link: '/task1-4' },
          { text: 'task1-5', link: '/task1-5' },
          { text: 'task1-6', link: '/task1-6' },
          { text: 'task1-7', link: '/task1-7' },
          { text: 'task1-8', link: '/task1-8' },
          { text: 'task1-9', link: '/task1-9' },
          { text: 'task1-10', link: '/task1-10' },
          { text: 'task1-11', link: '/task1-11' },
        ]
      },
      {
        text: 'Модуль 2',
        items: 
        [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Модуль 3',
        items: 
        [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
