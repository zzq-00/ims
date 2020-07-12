import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 服务协议-客户查询
	queryAgreementQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/agreementInfoSearch/getAgreementList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务协议-综合查询
	customerListQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/customerSearch/getCustomerList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-费用信息
	getCostTableInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/agreementInfoSearch/getCostTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-协议轨迹信息
	getAgreementTraceTableInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/agreementInfoSearch/getAgreementTraceTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-产品信息
	getInsuranceProductTableInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/agreementInfoSearch/getInsuranceProductTableInfo`,
			data: obj,
			method: 'post'
		})
	},

	// 服务实施-服务实施信息
	getServiceImplementTableInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/agreementInfoSearch/getServiceImplementTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-服务包信息
	getServicePackgeTableInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/agreementInfoSearch/getServicePackgeTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-服务信息
	getServiceTableInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/agreementInfoSearch/getServiceTableInfo`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
