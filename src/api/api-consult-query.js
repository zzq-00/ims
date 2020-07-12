import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 获取咨询者信息
	questionerInfoQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/questionerInfoQuery`,
			method: 'post',
			data: obj
		})
	},
	// 获取咨询者咨询列表
	healthConsultationDetailQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/healthConsultationDetailQuery`,
			method: 'post',
			data: obj
		})
	},
	// 获取选中的信息
	QueryReplyHistoryList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/questionerInfoQuery`,
			method: 'post',
			data: obj
		})
	},
	// 提交答复内容
	saveReplyHistoryAndSendToInterface: (obj) => {
		return axios.request({
			url: `${modalPrefix}/healthConsultation/saveReplyHistoryAndSendToInterface`,
			method: 'post',
			data: obj
		})
	},
	// 查询已答复历史信息
	queryConsultationHistory: (obj) => {
		return axios.request({
			url: `${modalPrefix}HealthConsultationQuery/queryConsultationHistory`,
			method: 'post',
			data: obj
		})
	}

}

export default api
