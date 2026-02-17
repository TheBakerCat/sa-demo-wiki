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
          { text: 'Задание 1', link: '/module1/task1-1' },
          { text: 'Задание 2', link: '/module1/task1-2' },
          { text: 'Задание 3', link: '/module1/task1-3' },
          { text: 'Задание 4', link: '/module1/task1-4' },
          { text: 'Задание 5', link: '/module1/task1-5' },
          { text: 'Задание 6', link: '/module1/task1-6' },
          { text: 'Задание 7', link: '/module1/task1-7' },
          { text: 'Задание 8', link: '/module1/task1-8' },
          { text: 'Задание 9', link: '/module1/task1-9' },
          { text: 'Задание 10', link: '/module1/task1-10' },
          { text: 'Задание 11', link: '/module1/task1-11' },
        ]
      },
      {
        text: 'Модуль 2',
        items: [
          { text: 'Задание 1', link: '/module2/task2-1' },
          { text: 'Задание 2', link: '/module2/task2-2' },
          { text: 'Задание 3', link: '/module2/task2-3' },
          { text: 'Задание 4', link: '/module2/task2-4' },
          { text: 'Задание 5', link: '/module2/task2-5' },
          { text: 'Задание 6', link: '/module2/task2-6' },
          { text: 'Задание 7', link: '/module2/task2-7' },
          { text: 'Задание 8', link: '/module2/task2-8' },
          { text: 'Задание 9', link: '/module2/task2-9' },
          { text: 'Задание 10', link: '/module2/task2-10' },
          { text: 'Задание 11', link: '/module2/task2-11' },
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
