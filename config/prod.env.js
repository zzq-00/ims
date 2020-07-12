'use strict'

const ENV = process.argv[2] && process.argv[2] || ''
console.log('config-prod-env-env', ENV, process.argv, JSON.stringify(ENV))

module.exports = {
	NODE_ENV: '"production"',
	ENV: JSON.stringify(ENV)
}
