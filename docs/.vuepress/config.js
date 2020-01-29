module.exports = {
  title: "nicolv的前端日志",
  description: "欢迎访问我的前端日志",
  base: "/",
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/nicolv.jpg' }]
  ],
  themeConfig: {
    repo: "nicolv/blog",
    nav: [
      {
        text: "博客",
        link: "/blog/"
      },
    ],
    sidebar: {
      "/blog/": [
        {
          title: 'JS 基础',
          collapsable: false,
          children: [
            "js-compiling-running.html",
          ]
        },
      ],
    },
    lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "本文源码地址"
  },
  plugins: {
    '@vuepress/medium-zoom': {
      selector: 'img',
      options: {
          margin: 16
      }
    },
    '@vuepress/back-to-top':true
  }
};
