// 佣金管理

import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	getLoginInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/loginUser/getLoginInfo`,
			data: obj,
			method: 'post'
		})
	},
	/* 用户基本信息-所属管理机构 */
	getUserInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/user/getUserInfo`,
			data: obj,
			method: 'post'
		})
	},
	/* 佣金比例配置 */
	// 产品列表
	productDropDown: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissionrateconfig/getisable`,
			data: obj,
			method: 'get'
		})
	},
	// 佣金比例查询
	queryRate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissionrateconfig/query`,
			data: obj,
			method: 'post'
		})
	},
	// 佣金比例详细
	queryByCode: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissionrateconfig/querybycode`,
			data: obj,
			method: 'post'
		})
	},
	// 佣金比例新增
	rateAdd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissionrateconfig/add`,
			data: obj,
			method: 'post'
		})
	},
	// 佣金比例修改
	rateUpdate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissionrateconfig/update`,
			data: obj,
			method: 'post'
		})
	},
	// 佣金比例删除
	rateDelete: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissionrateconfig/delete`,
			data: obj,
			method: 'post'
		})
	},

	/* 佣金数据管理 */
	// 佣金数据查询
	dataQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/query`,
			data: obj,
			method: 'post'
		})
	},
	// 佣金详细信息
	queryCommissionDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/queryommissiondetail`,
			data: obj,
			method: 'post'
		})
	},
	// 加扣款详细信息
	queryDeductionsDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/deductionsdetail`,
			data: obj,
			method: 'post'
		})
	},
	// 分公司确认通过
	confirm: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/confirm`,
			data: obj,
			method: 'post'
		})
	},
	// 分公司确认全部通过
	completeConfirm: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/completeconfirm`,
			data: obj,
			method: 'post'
		})
	},
	// 数据上报
	errorData: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/errorData`,
			data: obj,
			method: 'post'
		})
	},
	// 总公司审核通过
	approve: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/approve`,
			data: obj,
			method: 'post'
		})
	},
	// 总公司审核不通过
	notapproved: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/notapproved`,
			data: obj,
			method: 'post'
		})
	},
	// 总公司审核全部通过
	completeapprove: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondatamanage/completeapprove`,
			data: obj,
			method: 'post'
		})
	},

	/* 佣金加扣款 */
	// 查询
	deductionQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondeductedapi/deductionquery`,
			data: obj,
			method: 'post'
		})
	},
	// 详情
	deductionDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondeductedapi/ductionsdetail`,
			data: obj,
			method: 'post'
		})
	},
	// 确认
	deductionAdd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/commissiondeductedapi/add`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
