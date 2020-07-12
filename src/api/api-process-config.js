import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 服务队列配置-新增
	addInfoServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/addInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 修改服务流程状态
	changeStatusServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/changeStatus`,
			data: obj,
			method: 'post'
		})
	},
	// 服务队列配置-查询医疗机构信息
	findServiceOrgServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/findServiceOrg`,
			data: obj,
			method: 'post'
		})
	},
	// 查询服务流程列表
	getServiceListServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/getServiceList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务队列配置-初始化（项目名称）
	initItemServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/initItem`,
			data: obj,
			method: 'post'
		})
	},
	// 服务队列配置-初始化（产品信息）
	initProductServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/initProduct`,
			data: obj,
			method: 'post'
		})
	},
	// 服务队列配置-初始化（队列信息）
	initQueueServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/initQueue`,
			data: obj,
			method: 'post'
		})
	},
	// 服务队列配置-初始化（供应商信息）
	initSupSerServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/initSupSer`,
			data: obj,
			method: 'post'
		})
	},
	// 服务队列配置-查询队列信息
	queryAllQueueServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/queryAllQueue`,
			data: obj,
			method: 'post'
		})
	},
	// 查询服务流程配置明细
	queryFlowDeServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/queryFlowDe`,
			data: obj,
			method: 'post'
		})
	},
	// 保存服务流程配置
	saveFlowServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/saveFlow`,
			data: obj,
			method: 'post'
		})
	},
	// 服务队列配置-更新
	updOrderInfoServiceFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/updOrderInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 获取供应商对应自建签约机构
	queryOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/queryOrg`,
			data: obj,
			method: 'post'
		})
	},
	// 获取操作人手机号
	getHandleTelSerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/getHandleTel`,
			data: obj,
			method: 'post'
		})
	},
	// 获取操作人手机号
	querySerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocStatusAPI/query`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约提交
	insertThreeSerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/insertThree`,
			data: obj,
			method: 'post'
		})
	},
	// 添加号源-健管中心机构查询
	queryHinsSorgSerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/queryHinsSorg`,
			data: obj,
			method: 'post'
		})
	},
	// 添加第三方询价-查询
	selEnquirySerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selEnquiry`,
			data: obj,
			method: 'post'
		})
	},
	// 添加第三方询价-下一步-确定
	selThreeModSerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selThreeMod`,
			data: obj,
			method: 'post'
		})
	},
	// 添加第三方询价-下一步
	selThreeModsSerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selThreeMods`,
			data: obj,
			method: 'post'
		})
	},
	// 页面初始化-查询已选询价机构
	selThreeModshowSerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selThreeModshow`,
			data: obj,
			method: 'post'
		})
	},
	// 历史服务查询
	serOldApplySerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/serOldApply`,
			data: obj,
			method: 'post'
		})
	},
	// 添加号源-数据反显
	updateHinsTableSerApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/updateHinsTable`,
			data: obj,
			method: 'post'
		})
	},
	// 查询产品代码名称
	initProductMessageModel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messageModel/initProduct`,
			data: obj,
			method: 'post'
		})
	},
	// 新增短信/邮件模板
	insertMessageTemplateMessageModel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messageModel/insertMessageTemplate`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询短信/邮件模板
	listMessageModel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messageModel/list`,
			data: obj,
			method: 'post'
		})
	},
	// 查询短信内容配置表
	queryFillMessMessageModel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messageModel/queryFillMess`,
			data: obj,
			method: 'post'
		})
	},
	// 查询服务类别
	selectServiceTypeMessageModel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messageModel/selectServiceType`,
			data: obj,
			method: 'post'
		})
	},
	// 更新短信/邮件模板
	updateMessageTemplateMessageModel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messageModel/updateMessageTemplate`,
			data: obj,
			method: 'post'
		})
	},
	// 新增序列外管家
	addHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/addInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 开通账号
	createUserHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/createUser`,
			data: obj,
			method: 'post'
		})
	},
	// 导出管家信息
	exportStaffAllHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/exportStaffAll`,
			data: obj,
			method: 'post'
		})
	},
	// 重置密码
	passReloadHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/passReload`,
			data: obj,
			method: 'post'
		})
	},
	// 查询所有管家信息
	staffAllQHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/staffAllQ`,
			data: obj,
			method: 'post'
		})
	},
	// 查询在职管家列表
	staffUserHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/staffUser`,
			data: obj,
			method: 'post'
		})
	},
	// 更新管家信息
	updInfoHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/updInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 账号注销
	userCancelHousekeeperInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/userCancel`,
			data: obj,
			method: 'post'
		})
	},
	// 查询系统来源下拉框
	queryOrderSourceBulterAccessCfg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/bulterAccessConfiguration/queryOrderSource`,
			data: obj,
			method: 'post'
		})
	},
	// 查询化产品下拉框
	queryProductSelectBulterAccessCfg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/bulterAccessConfiguration/queryProductSelect`,
			data: obj,
			method: 'post'
		})
	},
	// 查询第三方名称下拉框
	queryThirdNameBulterAccessCfg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/bulterAccessConfiguration/queryThirdName`,
			data: obj,
			method: 'post'
		})
	},
	// 新增管家配置信息
	saveBulterOrderBoBulterAccessCfg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/bulterAccessConfiguration/saveBulterOrderBo`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询
	selectBulterOrderInfoBulterAccessCfg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/bulterAccessConfiguration/selectBulterOrderInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 新增队列信息
	addQueueInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueInfo/addQueueInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 查询队列信息
	getQueueInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueInfo/getQueueInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 修改队列信息
	updateQueueInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueInfo/updateQueueInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 新增订阅信息
	addQueueOrder: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueOrder/addQueueOrder`,
			data: obj,
			method: 'post'
		})
	},
	// 判断该用户是否订阅该队列
	checkOrder: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueOrder/checkOrder`,
			data: obj,
			method: 'post'
		})
	},
	// 判断此服务流程配置中陪诊节点是否有效
	checkSerFlow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueOrder/checkSerFlow`,
			data: obj,
			method: 'post'
		})
	},
	// 删除订阅信息
	delQueueOrder: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueOrder/delQueueOrder`,
			data: obj,
			method: 'post'
		})
	},
	// 查询订阅信息
	getQueueOrder: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueOrder/getQueueOrder`,
			data: obj,
			method: 'post'
		})
	},
	// 查询特定队列下订阅信息
	getQueueOrderSub: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueOrder/getQueueOrderSub`,
			data: obj,
			method: 'post'
		})
	},
	// 产品服务实施类型
	queueQueryImplType: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceFlow/queryImplType`,
			data: obj,
			method: 'post'
		})
	},
	// 修改订阅信息
	updateQueueOrder: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queueOrder/updateQueueOrder`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
