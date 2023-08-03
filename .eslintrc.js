// eslint-disable-next-line no-undef
module.exports = {
	parser: 'vue-eslint-parser',
	env: {
		node: true,
		browser: true,
	},
	extends: ['plugin:@typescript-eslint/recommended', 'eslint:recommended', 'prettier'],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		quotes: [1, 'single'],
		'no-useless-escape': 0,
		'@typescript-eslint/ban-ts-comment': 0,
		'@typescript-eslint/no-non-null-assertion': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/ban-types': 0,
		'@typescript-eslint/adjacent-overload-signatures': 0,
		'@typescript-eslint/no-empty-interface': 0,
		'@typescript-eslint/no-namespace': 0,
		'vue/no-mutating-props': 0,
		'no-unused-vars': 0,
		'prefer-spread': 0,
		'no-undef': 1,
		'vue/multi-word-component-names': 0,
		'@typescript-eslint/no-this-alias': 0,
		'vue/no-setup-props-destructure': 0
	}
};
