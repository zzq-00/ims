import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 服务实施-报表管理- 第三方询价明细 查询
	getThirdPartyEnquiryData: (obj) => {
		return axios.request({
			url: `${modalPrefix}/HealthConsultationQuery/getThirdPartyEnquiryData`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-报表管理- 第三方询价明细 导出
	ExportThirdPartyEnquiryQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/HealthConsultationQuery/ExportThirdPartyEnquiryQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-报表管理-第三方询价记录汇总 查询
	thirdCollectQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/thirdCollect/thirdCollectQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-报表管理-第三方询价记录汇总 导出
	exportThird: (obj) => {
		return axios.request({
			url: `${modalPrefix}/thirdCollect/exportThird`,
			data: obj,
			method: 'post',
			responseType: 'arraybuffer'
		})
	},
	// 服务实施-报表管理- 好医保绿通服务实施明细表
	queryList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ghSettleServiceImpl/queryList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-报表管理- 好医保绿通服务实施明细表
	exportList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ghSettleServiceImpl/exportList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-报表管理- 健康咨询服务月度统计
	serviceMonthlyStatistics: (obj) => {
		return axios.request({
			url: `${modalPrefix}/HealthMonthlyStatisticsQuery/serviceMonthlyStatistics`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-报表管理- 健康咨询服务月度统计
	exportServiceMonthlyStatistics: (obj) => {
		return axios.request({
			url: `${modalPrefix}/HealthMonthlyStatisticsQuery/exportServiceMonthlyStatistics`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
