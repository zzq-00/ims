import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 收费查询
	queryReceived: (obj) => {
		return axios.request({
			url: `${modalPrefix}/financeCharge/queryReceivableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 付费查询
	queryPayInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/financePay/queryPayableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 付费确认查询
	queryPay: (obj) => {
		return axios.request({
			url: `${modalPrefix}/financePay/queryPayableForConfirm`,
			data: obj,
			method: 'post'
		})
	},


	// 收费确认
	saveReceived: (obj) => {
		return axios.request({
			url: `${modalPrefix}/financeCharge/confirmReceiveInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 付费确认
	savePay: (obj) => {
		return axios.request({
			url: `${modalPrefix}/financePay/confirmPayInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 获取下拉lable
	queryDicName: (obj) => {
		return axios.request({
			url: `${modalPrefix}/financePay/queryDicName`,
			data: obj,
			method: 'post'
		})
	},
	// 获取下拉列表
	queryDicList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/financePay/queryDicList`,
			data: obj,
			method: 'post'
		})
	},


}

export default api
