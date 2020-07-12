import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 卡定义查询
	queryDocDefList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/queryDocDefList`,
			data: obj,
			method: 'post'
		})
	},
	docProductQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocProductAPI/docProductQuery`,
			data: obj,
			method: 'post'
		})
	},
	checkData: (obj) => {
		return axios.request({
			url: `${modalPrefix}/delay/checkData`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
