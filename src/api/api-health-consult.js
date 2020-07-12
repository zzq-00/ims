import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 健康咨询查询 查询健康咨询历史回复记录
	QueryReplyHistoryList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/QueryReplyHistoryList`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询查询 详细查询健康咨询记录
	healthConsultationDetailQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/healthConsultationDetailQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询-健康咨询查询 查询
	healthConsultationQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/healthConsultationQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询查询 答复历史查询
	queryConsultationHistory: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/queryConsultationHistory`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询查询 查询提问者信息
	questionerInfoQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/questionerInfoQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询查询 保存健康咨询历史回复记录并发送
	saveReplyHistoryAndSendToInterface: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/saveReplyHistoryAndSendToInterface`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询列表 查询健康咨询历史回复记录
	QueryReplyHistoryListed: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/QueryReplyHistoryListed`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询列表 详细查询健康咨询记录
	healthConsultationDetailQueryListed: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/healthConsultationDetailQueryListed`,
			data: obj,
			method: 'post',
			responseType: 'arraybuffer'
		})
	},
	// 健康咨询列表 答复历史查询
	queryConsultationHistoryListed: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/queryConsultationHistoryListed`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询列表 查询健康咨询列表
	queryhealthConsultationListed: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/queryhealthConsultationListed`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询列表 查询提问者信息
	questionerInfoQueryListed: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/questionerInfoQueryListed`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询列表 保存健康咨询历史回复记录并发送
	saveReplyHistoryAndSendToInterfaceListed: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/saveReplyHistoryAndSendToInterfaceListed`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询列表 导出
	exportRecord: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/export`,
			data: obj,
			method: 'post'
		})
	},
	// 健康咨询列表 导出
	listInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/thirdApplyQuery/listInfo`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
