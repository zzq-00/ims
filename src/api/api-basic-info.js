import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 分页查询产品配置
	queryAllProducts: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ExclusiverProductAPI/queryAllProducts`,
			data: obj,
			method: 'post'
		})
	},
	// 新增产品配置
	addProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ExclusiverProductAPI/addProduct`,
			data: obj,
			method: 'post'
		})
	},
	// 更新产品配置
	updateProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ExclusiverProductAPI/updateProduct`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询主险附件算法配置
	queryRecomeMethodBy: (obj) => {
		return axios.request({
			url: `${modalPrefix}/RecomeMethodAPI/queryRecomeMethodBy`,
			data: obj,
			method: 'post'
		})
	},
	// 新增主险附加及其算法信息
	addRecomeMethod: (obj) => {
		return axios.request({
			url: `${modalPrefix}/RecomeMethodAPI/addRecomeMethod`,
			data: obj,
			method: 'post'
		})
	},
	// 修改主险附加及其算法信息
	updateRecomeMethod: (obj) => {
		return axios.request({
			url: `${modalPrefix}/RecomeMethodAPI/updateRecomeMethod`,
			data: obj,
			method: 'post'
		})
	},
	// 导入文件
	import: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImportAnnuPlanAPI/import`,
			data: obj,
			method: 'post'
		})
	},
	// 板块收入年度计划导入模版下载
	download: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImportAnnuPlanAPI/download`,
			method: 'post'
		})
	}
}

export default api
