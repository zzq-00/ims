import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
// 新建预算 新建预算项目
	addBudget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/addBudget`,
			data: obj,
			method: 'post'
		})
	},
	// 新建预算 点击确定之后再次查询预算
	newbudgetShow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/newbudgetShow`,
			data: obj,
			method: 'post'
		})
	},
	// 新建项目 查询预算编码名称
	initbudgetVal: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/initbudgetVal`,
			data: obj,
			method: 'post'
		})
	},
	// 预算维护、追加预算 查询
	budgetMaintenanceShow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/budgetMaintenanceShow`,
			data: obj,
			method: 'post'
		})
	},
	// 预算维护 选中预算基本信息列表中的一条记录，查询预算项目信息列表
	budgetItemShow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/budgetItemShow`,
			data: obj,
			method: 'post'
		})
	},
	// 预算维护 查询预算轨迹
	budgetTraceShow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/budgetTraceShow`,
			data: obj,
			method: 'post'
		})
	},
	// 预算维护 停用
	stopBudget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/stopBudget`,
			data: obj,
			method: 'post'
		})
	},
	// 预算维护，追加预算 修改预算/追加预算
	updateBudget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/updateBudget`,
			data: obj,
			method: 'post'
		})
	},
	// 追加预算 查询预算
	addBudgetQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/addBudgetQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 预算审核 查询预算
	budgetAuditQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/budgetAuditQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 预算审核 提交
	budgetTrace: (obj) => {
		return axios.request({
			url: `${modalPrefix}/budget/budgetTrace`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
