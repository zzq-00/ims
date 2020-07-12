import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 新建项目 确定
	initItemcodeVal: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/initItemcodeVal`,
			data: obj,
			method: 'post'
		})
	},
	// 新建项目 剩余预算额度
	residualAmount: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/residualAmount`,
			params: obj,
			method: 'get'
		})
	},
	// 新建项目(确定) 查询项目详细信息
	getProductName: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/getProductName`,
			data: obj,
			method: 'post'
		})
	},
	// 新建项目 确定
	insertBudgetItem: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/insertBudgetItem`,
			data: obj,
			method: 'post'
		})
	},

	// 项目审核 页面初始化查询方法
	initbudgetItemVal2: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/initbudgetItemVal2`,
			data: obj,
			method: 'post'
		})
	},
	// 项目审核 查询
	checkData: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/checkData`,
			data: obj,
			method: 'post'
		})
	},
	// 项目审核 确认
	auditData: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/aduitData`,
			data: obj,
			method: 'post'
		})
	},

	// 项目维护 查询项目编码名称
	initbudgetItemVal: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/initbudgetItemVal`,
			data: obj,
			method: 'post'
		})
	},
	// 项目维护 查询
	budgetItemShow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/budgetItemShow`,
			data: obj,
			method: 'post'
		})
	},
	// 查询项目-单证领用
	budgetItemShowForDoc: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/budgetItemShowForDoc`,
			data: obj,
			method: 'post'
		})
	},
	//  选中列表中的一条查询项目的执行信息
	projectInformation: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/projectInformation`,
			data: obj,
			method: 'post'
		})
	},
	//  项目维护 查询项目轨迹
	projectTraInformation: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/projectTraInformation`,
			data: obj,
			method: 'post'
		})
	},
	//  项目维护 查询项目轨迹
	selectSum: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/selectSum`,
			params: obj,
			method: 'get'
		})
	},
	//  项目维护 停用项目
	stop: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/stop`,
			params: obj,
			method: 'get'
		})
	},
	//  项目维护 修改确认
	upDate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Project/upDate`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
