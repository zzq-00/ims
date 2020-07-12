// 统计核算--现金收入
import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 保额收入--查询
	insureQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/insuredqueryandexport/query`,
			data: obj,
			method: 'post'
		})
	},
	// 保额收入--导出
	insureExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/insuredqueryandexport/export`,
			data: obj,
			method: 'post'
		})
	},
	// 现金收入--查询
	cashQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/cashincomequeryandexport/query`,
			data: obj,
			method: 'post'
		})
	},
	// 现金收入--导出
	cashExprot: (obj) => {
		return axios.request({
			url: `${modalPrefix}/cashincomequeryandexport/exprot`,
			data: obj,
			method: 'post'
		})
	},
	// 现金收入--导出记账申请
	cashExportPdf: (obj) => {
		return axios.request({
			url: `${modalPrefix}/cashincomequeryandexport/exportPdf`,
			data: obj,
			method: 'post'
		})
	}
}
export default api

