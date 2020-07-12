import axios from '../libs/axios'
import qs from 'qs'

let modalPrefix = '/hmbms-application'
const api = {
	// 日常考核--查询
	dailyAssessment: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Achievements/dailyAssessment`,
			data: obj,
			method: 'post'
		})
	},
	// 日常考核--导出
	export: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Achievements/export`,
			data: obj,
			method: 'post'
		})
	},
	// 标准绩效系数维护--查询
	standardPerformance: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Achievements/standardPerformance`,
			data: obj,
			method: 'post'
		})
	},
	// 标准绩效系数维护--修改
	updateRatio: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Achievements/updateRatio`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资查询
	salaryDetails: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Achievements/salaryDetails`,
			data: obj,
			method: 'post'
		})
	}
}
export default api

