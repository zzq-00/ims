import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 根据积分类型获取积分项目
	getscoreprojectByScore: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantquery/getscoreproject`,
			data: obj,
			method: 'post'
		})
	},
	// 积分发放查询
	// 根据积分类型获取积分项目
	getscoreproject: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantquery/getscoreproject`,
			data: obj,
			method: 'get'
		})
	},
	scoregrantquery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantquery/query`,
			data: obj,
			method: 'post'
		})
	},
	// 积分发放-查询
	scoregrantimport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/query`,
			data: obj,
			method: 'post'
		})
	},
	// 积分状态更新
	changestate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/changestate`,
			data: obj,
			method: 'post'
		})
	},
	query2: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/query2`,
			data: obj,
			method: 'post'
		})
	},
	// 积分类型下拉
	getvalue: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantquery/getvalue`,
			data: obj,
			method: 'get'
		})
	},
	// 积分发放的积分类型下拉动作
	scoreitem: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/scoreitem`,
			data: obj,
			method: 'post'
		})
	},
	// 积分发放获取项目名称
	getitemname: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/getitemname`,
			data: obj,
			method: 'post'
		})
	},
	// 积分发放获取预算名称
	getbudget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/getbudget`,
			data: obj,
			method: 'post'
		})
	},
	// 积分发放
	scoregrantimportGrant: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/grant`,
			data: obj,
			method: 'post'
		})
	},
	// 积分执行查询项目名称下拉
	queryItemList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/projectexecute/queryItemList`,
			data: obj,
			method: 'post'
		})
	},
	// 积分执行查询预算名称下拉
	queryBudgetList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/projectexecute/queryBudgetList`,
			data: obj,
			method: 'post'
		})
	},
	// 项目/预算积分执行情况
	projectexecutequery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/projectexecute/query`,
			data: obj,
			method: 'post'
		})
	},
	// 积分核销信息
	scoreVeri: (obj) => {
		return axios.request({
			url: `${modalPrefix}/projectexecute/scoreVeri`,
			data: obj,
			method: 'post'
		})
	},
	// 积分发放明细
	detail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/projectexecute/scoreGrent/detail`,
			data: obj,
			method: 'post'
		})
	},
	// 积分项目维护查询
	queryProjectMainten: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoreitem/query`,
			data: obj,
			method: 'post'
		})
	},
	// 根据积分类型获取积分项目
	scoreitemgetscoreproject: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoreitem/getscoreproject`,
			data: obj,
			method: 'post'
		})
	},
	// 积分项目新增
	projectAdd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoreitem/add`,
			data: obj,
			method: 'post'
		})
	},
	// 积分项目更新
	projectUpdate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoreitem/update`,
			data: obj,
			method: 'post'
		})
	},
	// 积分核销列表查询
	queryWriteOfPoints: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantfinish/query`,
			data: obj,
			method: 'post'
		})
	},
	// 待核销列表查询
	queryToBeWriteOfPoints: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantquery/query`,
			data: obj,
			method: 'post'
		})
	},
	// 积分核销状态更新
	updatePointsStatus: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantfinish/changestate`,
			data: obj,
			method: 'post'
		})
	},
	// 积分核销
	writtenOff: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregrantfinish/finish`,
			data: obj,
			method: 'post'
		})
	},
	// 积分发放导入
	import: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregranbatchtimport/import`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	download: (obj) => {
		return axios.request({
			url: `${modalPrefix}/scoregranbatchtimport/download`,
			method: 'post'
		})
	},
	// 积分批量发放错误清单下载
	downloadErr: (obj) => {
		/* let url = str ? `${modalPrefix}/scoregranbatchtimport/error?input=${str}` : `${modalPrefix}/scoregranbatchtimport/error`
		return axios.request({
			url,
			method: 'get'
		}) */
		return axios.request({
			url: `${modalPrefix}/scoregranbatchtimport/error`,
			data: obj,
			method: 'post'
		})
	},
	// 项目管理机构
	getAllQueryAble () {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/getAllQueryAble/86`,
			method: 'post'
		})
	},
	// 获取项目名称
	getItemNameValue (orgCode) {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/getitemname`,
			data: orgCode,
			method: 'post'
		})
	},
	// 预算名称
	getbudgetValue (itemName) {
		return axios.request({
			url: `${modalPrefix}/scoregrantimport/getbudget`,
			data: itemName,
			method: 'post'
		})
	}

}


export default api
