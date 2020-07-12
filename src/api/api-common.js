import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 获取码表
	getDicValues: (type) => {
		return axios.request({
			url: `${modalPrefix}/dict/getValue/${type}`,
			method: 'post'
		})
	},
	getDicList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/qureyServereListStr`,
			data: obj,
			method: 'post'
		})
	},
	// getDicValues: (type) => {
	// 		return axios.request({
	// 			url: `${modalPrefix}serve/qureyServereListStr`,
	// 			method: 'post'
	// 		})
	// 	},
	// 获取机构列表
	getOrgValues: (type) => {
		return axios.request({
			url: `${modalPrefix}/getOrgInfoList/${type}`,
			method: 'post'
		})
	},
	// 获取机构列表2
	getAllQueryAble: (type) => {
		return axios.request({
			url: `${modalPrefix}/getAllQueryAble/${type}`,
			method: 'post'
		})
	},

	// 获取机构列表,指定长度
	getorgCode: (type) => {
		return axios.request({
			url: `${modalPrefix}/getOrgList/${type}`,
			method: 'post'
		})
	},

	// 获取地址列表
	getAddressValues: (type) => {
		return axios.request({
			url: `${modalPrefix}/address/queryChildAddress/${type}`,
			method: 'post'
		})
	},
	// 获取主管信息
	getLeaderInfo: (type) => {
		return axios.request({
			url: `${modalPrefix}/servextend/getuserupoperlist/`,
			method: 'post'
		})
	}


}

export default api
