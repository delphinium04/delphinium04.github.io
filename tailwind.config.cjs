/** @type {import('tailwindcss').Config} */
module.exports = {
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
	plugins: [require("@tailwindcss/typography"),require("daisyui")],
	daisyui: {
		themes: true, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: "dark", // name of one of the included themes for dark mode
		logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
	  }
}
