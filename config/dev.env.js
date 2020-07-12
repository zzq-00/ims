'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const ENV = process.argv[6] && process.argv[6].slice(2) || ''
console.log('config-dev-env', ENV, JSON.stringify(ENV))

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	ENV: JSON.stringify(ENV)
})
