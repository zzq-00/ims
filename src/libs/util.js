import qs from 'qs'
import host from '@/api/url'

let urlPrefix = ''
if (process.env.NODE_ENV === 'development') urlPrefix = 'apis'

export const turn2NewPage = (pageUrl, params = {}) => {
	params = Object.assign({}, params)
	params.token = ''
	params = qs.stringify(params, { arrayFormat: 'repeat' })
	if (pageUrl.indexOf('?') < 0) {
		pageUrl += '?' + params
	} else {
		pageUrl += '&' + params
	}
	let url = host + urlPrefix
	pageUrl = url + pageUrl
	console.log('pageUrl===', pageUrl)
	window.open(pageUrl, '_blank')
}

/**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认0位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
export const formatMoney = (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
	number = (number + '').replace(/[^0-9+-Ee.]/g, '')
	let n = !isFinite(+number) ? 0 : +number
	let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
	let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
	let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
	let s = ''
	let toFixedFix = function (n, prec) {
		let k = Math.pow(10, prec)
		return '' + Math.ceil(n * k) / k
	}
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
	let re = /(-?\d+)(\d{3})/
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, '$1' + sep + '$2')
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || ''
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}
	return s.join(dec)
}
