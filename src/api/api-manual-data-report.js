import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 社团信息查询 查询
	getSocialInsuranceExtend: (obj) => {
		return axios.request({
			url: `${modalPrefix}/SocialGroupInsuranceExtendAPI/getSocialInsuranceExtend`,
			data: obj,
			method: 'post'
		})
	},
	// 社团信息查询 导出前校验
	queryBeforeExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/SocialGroupInsuranceExtendAPI/queryBeforeExprot`,
			data: obj,
			method: 'post'
		})
	},
	// 社团信息查询 导出
	export: (obj) => {
		return axios.request({
			url: `${modalPrefix}/SocialGroupInsuranceExtendAPI/export`,
			data: obj,
			method: 'post'
		})
	},
	// 获取待修改任务公共池
	getUpdSocialGroupOfAll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/getUpdSocialGroupOfAll`,
			data: obj,
			method: 'post'
		})
	},
	// 获取待修改任务公共池
	getUpdSocialGroupOfUser: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/getUpdSocialGroupOfUser`,
			data: obj,
			method: 'post'
		})
	},
	// 获取修改任务
	getUpdateTask: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/getUpdateTask`,
			data: obj,
			method: 'post'
		})
	},
	// 新增服务信息
	policyServiceAdd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/policyServiceAdd`,
			data: obj,
			method: 'post'
		})
	},
	// 删除服务信息
	policyServiceDelete: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/policyServiceDelete`,
			data: obj,
			method: 'post'
		})
	},
	// 更新服务信息
	policyServiceUpdate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/policyServiceUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询服务清单
	queryAllServices: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/queryAllServices`,
			data: obj,
			method: 'post'
		})
	},
	// 查询附件信息
	queryFiles: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/queryFiles`,
			data: obj,
			method: 'post'
		})
	},
	// 更新状态为待审核
	updateTaskStatus: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ModSocialGroupInsuranceAPI/udpateTaskStatus`,
			data: obj,
			method: 'post'
		})
	},
	// 获取待审核任务公共池
	getSocialGroupOfAll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/getSocialGroupOfAll`,
			data: obj,
			method: 'post'
		})
	},
	// 获取待审核任务个人池
	getSocialGroupOfUser: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/getSocialGroupOfUser`,
			data: obj,
			method: 'post'
		})
	},
	// 获取审核任务
	getAuditingTask: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/getAuditingTask`,
			data: obj,
			method: 'post'
		})
	},
	// 审核查询服务清单
	queryAllServicesForB: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/queryAllServicesForB`,
			data: obj,
			method: 'post'
		})
	},
	// 查询集团协议统计服务单价
	queryAmount: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/queryAmount`,
			data: obj,
			method: 'post'
		})
	},
	// 查询附件信息
	queryFilesAud: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/queryFiles`,
			data: obj,
			method: 'post'
		})
	},
	// 获取审核任务
	queryGroup: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/queryGroup`,
			data: obj,
			method: 'post'
		})
	},
	// 审核提交
	socialInsuranceAuditing: (obj) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/socialInsuranceAuditing`,
			data: obj,
			method: 'post'
		})
	},
	// 获取保单号对应保单信息
	getser: (obj) => {
		return axios.request({
			url: `${modalPrefix}/PolicyServiceListAPI/getser`,
			data: obj,
			method: 'post'
		})
	},
	// 上传服务协议
	importFile: (obj) => {
		return axios.request({
			url: `${modalPrefix}/PolicyServiceListAPI/importFile`,
			data: obj,
			method: 'post'
		})
	},
	// 社团及服务清单添加2
	policyServiceAdd2: (obj) => {
		return axios.request({
			url: `${modalPrefix}/PolicyServiceListAPI/policyServiceAdd`,
			data: obj,
			method: 'post'
		})
	},
	// 社团数据批量导入模板下载
	downloadTemplate: (type) => {
		return axios.request({
			url: `${modalPrefix}/ImportSgInsuranceAPI/download`,
			method: 'post'
		})
	},
	// 社团数据导入失败列表下载
	downloadError: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImportSgInsuranceAPI/downloadError`,
			data: obj,
			method: 'post'
		})
	},
	// 社团数据批量导入
	importBatch: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImportSgInsuranceAPI/import`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 社团录入数据查询导出前校验
	queryBeforeExprot: (obj) => {
		return axios.request({
			url: `${modalPrefix}/SocialGroupInsuranceExtendAPI/queryBeforeExprot`,
			data: obj,
			method: 'post'
		})
	},
	// 社团录入数据导出
	exportSocial: (obj) => {
		return axios.request({
			url: `${modalPrefix}/SocialGroupInsuranceExtendAPI/export`,
			data: obj,
			method: 'post'
		})
	},
	// 社团数据审核的详情 下载文件
	AudSocialGroupInsuranceAPIDownloadFiles: (attachName,busiNo) => {
		return axios.request({
			url: `${modalPrefix}/AudSocialGroupInsuranceAPI/downloadFiles?attachName=${attachName}&busiNo=${busiNo}`,
			method: 'get'
		})
	},
	// 社团数据修改 集团数据删除
	GroupDataremove: (blocProtocol) => {
		return axios.request({
			url: `${modalPrefix}/ImportSgInsuranceAPI/reImport?blocProtocol=${blocProtocol}`,
			method: 'get'
		})
	},

}

export default api
