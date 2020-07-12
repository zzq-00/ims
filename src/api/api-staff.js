import axios from '../libs/axios'
import qs from 'qs'

let modalPrefix = '/hmbms-application'
const api = {
	// 人员入司
	staffEntry: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/staffEntry`,
			data: obj,
			method: 'post'
		})
	},
	// 人员信息修改
	upStaffEntry: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/upStaffEntry`,
			data: obj,
			method: 'post'
		})
	},
	// 人员轨迹查询
	staffTravelQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/staffTravelQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 人员轨迹详情
	showHealthStaffAndTarce: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/showHealthStaffAndTarce`,
			data: obj,
			method: 'post'
		})
	},
	// 人员附件信息查询##
	staffFilesQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffFiles/staffFilesQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 附件上载
	importAttach: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffFiles/importAttach`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 人员详情信息-导出
	staffQueryderive: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/staffQueryderive`,
			data: obj,
			method: 'post'
		})
	},
	// 职级调整-点击表格查询
	getHealthStaffAndTarce: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/getHealthStaffAndTarce`,
			data: obj,
			method: 'post'
		})
	},
	// 职级调整-保存
	staffUpdate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/staffUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 职级调整
	staffQueryForAdjust: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/staffQueryForAdjust`,
			data: obj,
			method: 'post'
		})
	},
	// 离职管理
	staffLeaveQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/staffLeaveQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 离职管理-保存
	leavefUpdate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/leavefUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 离职恢复
	staffQueryBUff: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/staffQueryBUff`,
			data: obj,
			method: 'post'
		})
	},
	// 离职恢复-保存
	recoverUpdate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffManage/recoverUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 离职恢复-保存
	staffFileQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffFiles/staffQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 人员附件信息 --下载
	downloadFiles: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffFiles/downloadFiles`,
			data: obj,
			method: 'post'
		})
	},
	// 人员附件信息 --预览
	previewFiles: (obj) => {
		return axios.request({
			url: `${modalPrefix}/staffFiles/seeFiles`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
