import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 导出第三方预约信息明细
	export: (obj) => {
		return axios.request({
			url: `${modalPrefix}/thirdApplyQuery/export`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询第三方预约信息
	list: (obj) => {
		return axios.request({
			url: `${modalPrefix}/thirdApplyQuery/list`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询第三方预约申请轨迹
	listInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/thirdApplyQuery/listInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 获取产品名称列表
	getProductName (obj) {
		return axios.request({
			url: `${modalPrefix}/thirdApplyQuery/queryProductName`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
