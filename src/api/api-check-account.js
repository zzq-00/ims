import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 对账管理分页查询
	checkData: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ConfirmDataRecordAPI/checkData`,
			data: obj,
			method: 'post'
		})
	},
	// 对账管理-退费/消费计算
	checkData1: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ConfirmDataRecordAPI/checkData1`,
			data: obj,
			method: 'post'
		})
	},
	getAllListApi: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ConfirmDataRecordAPI/getAllList`,
			data: obj,
			method: 'post'
		})
	},
	// 确认支付
	confirmPay: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ConfirmDataRecordAPI/confirmPay`,
			data: obj,
			method: 'post'
		})
	},
	// importAccountBo
	importAccountBo: (type) => {
		return axios.request({
			url: `${modalPrefix}/ImportAccountAPI/importBo`,
			method: 'post'
		})
	},
	// 数据导入
	importBo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImportAccountAPI/importBo`,
			method: 'post',
			data: obj,
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 下载失败清单
	downloadError: (type) => {
		return axios.request({
			url: `${modalPrefix}/ImportAccountAPI/exportError`,
			method: 'post'
		})
	},
	// 查询条件 -> 根据批次号查询 对账
	ReconciliationApi: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DataApprovalAPI/checkAccount`,
			data: obj,
			method: 'post'
		})
	},
	// 查询条件 -> 根据批次号查询 确认
	confirmUpdateApi: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DataApprovalAPI/confirmUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 查询条件 -> 根据批次号查询 撤销
	revokeBtnApi: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DataApprovalAPI/revokeBtn`,
			data: obj,
			method: 'post'
		})
	},
	// 查询条件 -> 根据批次号查询 下载
	exportErrorListApi: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DataApprovalAPI/exportErrorList`,
			data: obj,
			method: 'post'
		})
	}


}

export default api
