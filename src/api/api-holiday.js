import axios from '../libs/axios'
import qs from 'qs'

let modalPrefix = '/hmbms-application'
const api = {
	// 休假查询
	holidayselect: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/holidayselect`,
			data: obj,
			method: 'post'
		})
	},

	// 休假管理
	holidayManager: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/holidayManager`,
			data: obj,
			method: 'post'
		})
	},
	// 休假管理-点击表格
	holidayRecord: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/holidayRecord`,
			data: obj,
			method: 'post'
		})
	},
	// 休假管理-保存前验证该请假阶段是否在请假
	holidayIsLegal: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/holidayIsLegal`,
			data: obj,
			method: 'post'
		})
	},
	// 休假管理-保存前薪资试算
	isCaculated: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/isCaculated`,
			data: obj,
			method: 'post'
		})
	},
	// 休假管理-保存
	saveHoliday: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/saveHoliday`,
			data: obj,
			method: 'post'
		})
	},
	// 休假管理-删除前查看薪资试算状态
	calStatus: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/calStatus`,
			data: obj,
			method: 'post'
		})
	},
	// 休假管理-删除前查看录入机构
	updateOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/updateOrg`,
			data: obj,
			method: 'post'
		})
	},
	// 休假管理-删除
	deleteHolidayRecord: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/deleteHolidayRecord`,
			data: obj,
			method: 'post'
		})
	},

	// 休假系数维护-查询
	ratioQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/ratio`,
			data: obj,
			method: 'post'
		})
	},
	// 休假系数维护-新增和修改前查询验证
	isRatio: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/isRatio`,
			data: obj,
			method: 'post'
		})
	},
	// 休假系数维护-修改
	updateRatio: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/updateRatio`,
			data: obj,
			method: 'post'
		})
	},
	// 休假系数维护-新增
	addRatio: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dailyManage/addRatio`,
			data: obj,
			method: 'post'
		})
	}

}

export default api
