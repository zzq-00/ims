import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 通过服务编码获取产品
	getProductByService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/productService/getProductByService`,
			method: 'post',
			data: obj
		})
	},
	// 根据产品ID查询产品的相关信息
	queryServiceById: (obj) => {
		return axios.request({
			url: `${modalPrefix}/productService/queryServiceById`,
			method: 'post',
			data: obj
		})
	},
	// 服务列表下拉
	getAllService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/service/getAll`,
			method: 'post'
		})
	},
	// 查询服务列表
	getServicelist: (obj) => {
		return axios.request({
			url: `${modalPrefix}/service/getServicelist`,
			method: 'post',
			data: obj
		})
	},
	// 新增服务
	addService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/service/addService`,
			method: 'post',
			data: obj
		})
	},
	// 更新服务
	updateService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/service/updateService`,
			method: 'post',
			data: obj
		})
	}
}

export default api
