// https://eslint.org/docs/user-guide/configuring

module.exports = {
  	root: true,
  	parserOptions: {
    	parser: 'babel-eslint'
  	},
  	env: {
    	browser: true,
  	},
  	extends: [
		// https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
		// consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
		'plugin:vue/essential', 
		// https://github.com/standard/standard/blob/master/docs/RULES-en.md
		'standard'
  	],
  	// required to lint *.vue files
  	plugins: [
    	'vue'
  	],
	// add your custom rules here
	rules: {
		"vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
		"no-extra-boolean-cast": "off",
		"no-unused-vars": "off",
		// no-multiple-empty-lines
		"indent": ["error", "tab"],
		// "indent": [1, 2],//缩进风格
		"no-tabs": "off",
		"no-debugger": 2,
		"no-mixed-spaces-and-tabs": "off",
		//不能有不规则的空格
		"no-irregular-whitespace": 2,
		// 禁用行尾空格
		"no-trailing-spaces": 2,
		//空行最多不能超过2行
		"no-multiple-empty-lines": [1, {"max": 2}],
		//强制使用一致的换行符风格
		"linebreak-style": 'off',
		//语句强制分号结尾
		"semi": [2, "never"],
		//禁用alert
		"no-alert": 0,
		//引号忽略
		"quotes": "off",
		"brace-style": [2, "1tbs", { "allowSingleLine": true }],  
		// 双峰驼命名格式  
		"camelcase": 2,  
		// 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，  
		// always-multiline：多行模式必须带逗号，单行模式不能带逗号  
		"comma-dangle": [2, "never"],  
		// 控制逗号前后的空格  
		"comma-spacing": [2, { "before": false, "after": true }],
		// 禁止修改 const 声明的变量
		"no-const-assign": 2,
		// allow async-await
		'generator-star-spacing': 'off',
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  	}
}
