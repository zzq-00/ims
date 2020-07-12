import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 服务实施-标准服务-综合查询-查询
	queryGeneralQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyQuery/list`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-标准服务-综合查询-导出
	exportGeneralQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyQuery/export`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-标准服务-疑难工单查询-查询
	queryDiffQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyQuery/difList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-标准服务-群发短信
	sendMassSms: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messManager/sendMess`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-标准服务-群发短信-发送历史查询
	queryMessages: (obj) => {
		return axios.request({
			url: `${modalPrefix}/queryMess/queryMessages`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-管家自营服务审核-查询
	queryPerformanceAudit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/serveAuditQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-管家自营服务审核-提交
	submitPerformanceAudit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/servextend/commit`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务录入 查询服务项
	addserveItemse: (obj) => {
		return axios.request({
			url: `${modalPrefix}/servextend/addserveItemse`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务录入 查询服务细类项
	addserveds: (obj) => {
		return axios.request({
			url: `${modalPrefix}/servextend/addserveds`,
			data: obj,
			method: 'post'
		})
	},
	serverunit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/servextend/addserveds`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务录入 全部提交审核
	submitPerformanceAuditAll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/servextend/commitAll`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务录入  根据用户获取用户的审批主管
	getuserupoperlist: (obj) => {
		return axios.request({
			url: `${modalPrefix}/servextend/getuserupoperlist`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务批量导入-提交审核  根据用户获取用户的审批主管
	getuserupoperlist2: (obj) => {
		return axios.request({
			url: `${modalPrefix}/servextend/getuserupoperlist2`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询 自营服务录入 根据用户查询相关的管家信息
	getuserinfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/getuserinfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询 自营服务录入 加载供应商事件
	supplierQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/supplierQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询 自营服务录入 默认服务数量为1的细类id
	queryDefault: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/queryDefault`,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询 自营服务录入
	qureyServereListStr: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/qureyServereListStr`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务录入-保存
	serveAdd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/serveAdd`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务录入-保存
	serveEdit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/serveEdit`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-管家自营服务查询-查询
	queryPerformanceQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/serveQuerys`,
			data: obj,
			method: 'post'
		})
	},
	// 务实施- 自营服务录入 - 查询
	queryInput: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/serveQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-管家自营服务查询-导出
	exportPerformanceQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/exportServe`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-管家自营服务统计-查询
	queryPerformanceDetails: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/serveCountQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-管家自营服务统计-导出
	exportPerformanceDetails: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serve/exportServe2`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务批量导入 加载页面表格表头部分
	qureyList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/branchSelf/qureyList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务批量导入 下载导入模板
	export: (obj) => {
		return axios.request({
			url: `${modalPrefix}/branchSelf/export`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务批量导入 错误清单下载
	exportError: (obj) => {
		return axios.request({
			url: `${modalPrefix}/branchSelf/exportError`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司自营服务录入及查询-自营服务批量导入 导入
	importPerformance: (obj) => {
		return axios.request({
			url: `${modalPrefix}/branchSelf/importPerformance`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司总服务量报送-查询
	queryBranchServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/query`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司总服务量报送-删除
	deleteBranchServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/delete`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司工作量上报查询-删除
	deleteApprovalBranchServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/delete2`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司总服务量报送-保存
	saveBranchServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/save`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司总服务量报送-提交前查询
	verifyBranchServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryOneTy`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司总服务量报送-保存并提交
	saveAndSubmitBranchServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/submit`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司总服务量报送-提交审核
	submitBranchServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/handle`,
			data: obj,
			method: 'post'
		})
	},

	// 服务实施-分公司每月报送工作量-健管中心服务量报送-查询
	queryHealthCenterServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryHealth`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-健管中心服务量报送-删除
	deleteHealthCenterServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/deleteHealth`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-健管中心服务量报送-保存
	saveHealthCenterServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/saveHealth`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-健管中心服务量报送-提交前查询
	verifyHealthCenterServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryOneTyHealth`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-健管中心服务量报送-保存并提交
	saveAndSubmitHealthCenterServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/submitHealth`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-健管中心服务量报送-提交审核
	submitHealthCenterServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/handleHealth`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-健管中心服务量报送-查询健管中心名称
	queryHealthCenterName4Select: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/qureyServereList`,
			data: obj,
			method: 'post'
		})
	},

	// 服务实施-分公司每月报送工作量-VIP诊疗室服务量报送-查询
	queryVipConsultServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryVIP`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-VIP诊疗室服务量报送-删除
	deleteVipConsultServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/deleteVIP`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-VIP诊疗室服务量报送-保存
	saveVipConsultServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/saveVIP`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-VIP诊疗室服务量报送-提交前查询
	verifyVipConsultServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryOneTyVIP`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-VIP诊疗室服务量报送-保存并提交
	saveAndSubmitVipConsultCenterServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/submitVIP`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-VIP诊疗室服务量报送-提交审核
	submitVipConsultServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/handleVIP`,
			data: obj,
			method: 'post'
		})
	},

	// 服务实施-分公司每月报送工作量-集团子公司服务量报送-查询
	queryGroupSubsidiaryServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/querygroup`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-集团子公司服务量报送-保存前校验
	saveValidateGroupSubsidiaryServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryOneGoup`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-集团子公司服务量报送-保存
	saveGroupSubsidiaryServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/groupSave`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-集团子公司服务量报送-删除
	deleteGroupSubsidiaryServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/groupDelete`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-集团子公司服务量报送-提交审核
	submitGroupSubsidiaryServiceReported: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/groupCommit`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-集团子公司服务量报送-提交审核
	queryYearMonthList4GroupSubsidiary: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/yearmonth`,
			data: obj,
			method: 'post'
		})
	},

	// 服务实施-分公司每月报送工作量-分公司报送工作量审核-查询
	queryGroupSubsidiaryAudit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryAudit`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司报送工作量审核-提交
	submitGroupSubsidiaryAudit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/audit`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司上报工作量查询-查询
	queryBranchWork: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryAll`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-分公司每月报送工作量-分公司上报工作量查询-导出
	exportBranchWork: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReported/queryAllExport`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 获取每个节点的操作轨迹
	getApplyTrace: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/getApplyTrace`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 任务指派权限查询
	getBulterCompetence: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/getBulterCompetence`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 获取任务
	gettingTasksTo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/gettingTasksTo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 查询公共池服务实施信息
	queryApplyInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/queryApplyInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 查询服务实施轨迹
	queryServiceTrack: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/queryServiceTrack`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 服务状态查询
	queryStatus: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/queryStatus`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 查询个人池服务实施信息
	queryTaskInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/queryTaskInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 任务指派操作
	taskAssign: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/taskAssign`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理及查询 任务释放
	taskRelease: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serveApplyQuery/taskRelease`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 增加服务实施结果记录
	addImplementInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/addImplementInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 获取时间信息
	amountTime: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/amountTime`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 撤销预约申请
	cancelApplyInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/cancelApplyInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 判断是否需要推送健管中心
	checkHinsService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/checkHinsService`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 商保校验被保人
	checkPolicyMan: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/checkPolicyMan`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 判断是否允许此服务进行预约
	checkServiceConfigStatus: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/checkServiceConfigStatus`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 获取医疗机构所属科室信息
	findOrgDept: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/findOrgDept`,
			data: obj,
			method: 'post'
		})
	}, // 服务处理 获取医疗机构信息
	findServiceOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/findServiceOrg`,
			data: obj,
			method: 'post'
		})
	}, // 标准服务 管家查询
	findStaffUserList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/staffUser`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 查询卡下包含服务
	getAgreementService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/getAgreementService`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 获取健管中心排班信息
	getHinsWorkPlan: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/getHinsWorkPlan`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 查询销售机构
	getSaleOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/getSaleOrg`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 卡号卡密方式服务申请
	makdoc: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/makdoc`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 保单号方式服务申请
	makeAgree: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/makeAgree`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 提交预约申请
	newApplyInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/newApplyInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 查询自建供应商所属管理机构
	queryOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/queryOrg`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 查询服务实施结果记录
	queryResult: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/queryResult`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 获取当前日期之后三十天的日期
	queryTime: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/queryTime`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 查询既往使用人
	queryUsedMan: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/queryUsedMan`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 服务分诊提交
	triageApplyInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/applyTotal/triageApplyInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 获取操作人手机号
	getHandleTel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/getHandleTel`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 服务预约提交
	insertThree: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/insertThree`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 添加号源-健管中心机构查询
	queryHinsSorg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/queryHinsSorg`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 添加第三方询价-查询
	selEnquiry: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selEnquiry`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 添加第三方询价-下一步-确定
	selThreeMod: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selThreeMod`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 添加第三方询价-下一步
	selThreeMods: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selThreeMods`,
			data: obj,
			method: 'post'
		})
	},	// 服务预约 页面初始化-查询已选询价机构
	selThreeModshow: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selThreeModshow`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 历史服务查询
	serOldApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/serOldApply`,
			data: obj,
			method: 'post'
		})
	},
	// 服务预约 添加号源-数据反显
	updateHinsTable: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/updateHinsTable`,
			data: obj,
			method: 'post'
		})
	},
	// 服务回访 匹配问卷内容
	serviceReturnVitis: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReturn/buildHtml/qnrInfo/serviceReturnVitis`,
			data: obj,
			method: 'post'
		})
	},
	// 服务回访 疑难工单处理
	dealDifficult: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReturn/dealDifficult`,
			data: obj,
			method: 'post'
		})
	},
	// 服务回访 疑难工单上报
	describeReport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReturn/describeReport`,
			data: obj,
			method: 'post'
		})
	},
	// 服务回访 问卷回访保存
	saveServiceDescribe: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReturn/saveServiceDescribe`,
			data: obj,
			method: 'post'
		})
	},
	// 服务回访 回显回访问卷信息
	showQuInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceReturn/showQuInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 标准服务批量导入 就医服务模板下载
	HealthServiceDownload: () => {
		return axios.request({
			url: `${modalPrefix}/importAndExoprt/HealthServiceDownload`,
			method: 'post'
		})
	},
	// 标准服务批量导入 其他服务模板下载
	OtherServiceDownload: () => {
		return axios.request({
			url: `${modalPrefix}/importAndExoprt/OtherServiceDownload`,
			method: 'post'
		})
	},
	// 标准服务批量导入 导入错误下载
	errorDownload: (obj) => {
		return axios.request({
			url: `${modalPrefix}/importAndExoprt/error`,
			data: obj,
			method: 'post'
		})
	},
	// 标准服务批量导入 标准服务导入
	templateImport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/importAndExoprt/templateImport`,
			data: obj,
			method: 'post'
		})
	},
	// 服务处理 陪诊人查询
	staffUser: (obj) => {
		return axios.request({
			url: `${modalPrefix}/housekeeperInfo/staffUser`,
			data: obj,
			method: 'post'
		})
	},
	selectSMInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/messageModel/selectSMInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 获取当前流程预约时间
	getPayDate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceWebShowHelp/getPayDate`,
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
	// 获取当前登录用户相关信息
	getLoginInfo: () => {
		return axios.request({
			url: `${modalPrefix}/serviceWebShowHelp/getLoginInfo`,
			method: 'post'
		})
	},
	selEnquiryInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serApply/selEnquiryInfo`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
