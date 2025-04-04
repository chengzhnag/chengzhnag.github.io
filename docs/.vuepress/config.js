const path = require('path');

const autometa_options = {
	site: {
		name: "chengzhnag",
		twitter: "chengzhnag",
	},
	canonical_base: "https://chengzhnag.github.io/",
};

module.exports = {
	title: '记沉',
	description: '当我买得起十几块钱一个的冰淇淋的时候，我已经不再天天想吃了。当我可以随便玩电脑而没人管的时候，我已经懒得打开电脑了',
	theme: 'reco',
	themeConfig: {
		// 博客配置
		logo: '/avatar.jpg',
		authorAvatar: '/avatar.jpg',
		author: '张沉',
		type: 'blog',
		blogConfig: {
			category: {
				location: 2, // 在导航栏菜单中所占的位置，默认2
				text: '分类' // 默认文案 “分类”
			},
			tag: {
				location: 3, // 在导航栏菜单中所占的位置，默认3
				text: '标签' // 默认文案 “标签”
			}
		},
		nav: [{
			text: '首页',
			link: '/',
			icon: 'reco-home'
		}, {
			text: '时间轴',
			link: '/timeline/',
			icon: 'reco-date'
		}, {
			text: 'GitHub',
			link: 'https://github.com/chengzhnag',
			icon: 'reco-github'
		}],
		valineConfig: {
			appId: 'VYEki932OAJDyS1BBJdZD6g1-gzGzoHsz',// your appId
      		appKey: 'eA6lxTbX7jYlLmItrOSgz9mh', // your appKey
		}
	},
	head: [
		['meta', {
			name: 'viewport',
			content: 'width=device-width,initial-scale=1,user-scalable=no'
		}],
		['meta', {
			name: 'google-site-verification',
			content: 'ZMQqk7u0muxaqtq60ZUDzCg8S7s01pVy-IWEKH6TT-8'
		}],
		['meta', { name: 'keywords', content: '记沉, 记沉博客, chengzhnag, @chengzhnag, chengzhnag blog' }],
	],
  "plugins": [
    ["autometa", autometa_options],
    [
      "vuepress-plugin-sitemap",
      {
        hostname: "https://chengzhnag.github.io/",
        // 排除无实际内容的页面
        exclude: ["/404.html"],
      },
    ],
    "vuepress-plugin-baidu-autopush", // 百度自动推送
  ]
}
