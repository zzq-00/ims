import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 确认延期选中的卡
	submit1: (obj) => {
		return axios.request({
			url: `${modalPrefix}/delay/submit1`,
			method: 'post',
			data: obj
		})
	},
	// 全部确认延期
	submitAll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/delay/submit`,
			method: 'post',
			data: obj
		})
	},
	//
	updateDocProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocProductAPI/updateDocProduct`,
			method: 'post',
			data: obj
		})
	}

}

export default api
