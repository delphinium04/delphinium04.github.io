/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Pretendard Variable"',
					'Pretendard',
					'-apple-system',
					'BlinkMacSystemFont',
					'system-ui',
					'Roboto',
					'"Helvetica Neue"',
					'"Segoe UI"',
					'"Apple SD Gothic Neo"',
					'"Noto Sans KR"',
					'"Malgun Gothic"',
					'sans-serif',
				],
				mono: [
					'"JetBrains Mono"',
					'"Pretendard Variable"',
					'Pretendard',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'monospace',
				],
			},
			lineHeight: {
				relaxed: '1.85',
				loose: '2.0',
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		themes: ["lofi"],
		darkTheme: false,
		logs: false,
	},
}
