let modalPrefix = '/hmims-application'

export const apiList = {
	// 下拉项接口
	getSelectOptions: (codeName) => `${modalPrefix}/dict/getValue/${codeName}`, // 根据编码查询码表

	// 预约查询
	getAppointCustInfo: `${modalPrefix}/getAppointCustInfo`, // 查询
	getAppointByService: `${modalPrefix}/getHsAppointPages`, // 项目列表
	getTimeWorkPlanByServItem: `${modalPrefix}/getTimeWorkPlanByServItem`, // 时间段列表
	updateWorkPlan: `${modalPrefix}/updateWorkPlan`, // 选择预约时间段
	confirmHsAppointList: `${modalPrefix}/confirmHsAppointList`, // 预约确认接口
	submitAppointCustInfo: `${modalPrefix}/submitAppointCustInfo`, // 确认客户信息接口
	checkAppointCustInfo: `${modalPrefix}/checkAppointCustInfo`, // 获取确认客户信息接口
	printInfo: `${modalPrefix}/printInfo`, // 预约确认打印

	// 医师/技师服务
	getCustHsItemList: `${modalPrefix}/getCustHsItemList`, // 医师/技师服务列表查询
	queryHinsDocList: `${modalPrefix}/queryHinsDocList`, // 查询医师列表
	getHinsHsItems: `${modalPrefix}/getHinsHsItems`, // 查询医师结论列表
	saveDocConclusion: `${modalPrefix}/saveDocConclusion`, // 保存医师结论

	// 客户管理
	getCustomerListService: `${modalPrefix}/getCustomerListService`, // 查询客户信息列表
	getCheckUpInformation: `${modalPrefix}/downloadCheckUpInformation`, // 查询既往体检信息
	getCheckUpItemsInformation: `${modalPrefix}/getCheckUpItemsInformation`, // 查询既往体检项目信息

	downloadCheckUpInformation: `${modalPrefix}/downloadCheckUpInformation`, // 打印选中既往体检信息
	printCheckUpInformation: `${modalPrefix}/printCheckUpInformation`, // 打印既往体检信息

	// 客户维护
	/* 查询同客户管理查询 */
	saveOrUpdateCustListByInfo: `${modalPrefix}/saveOrUpdateCustListByInfo`, // 新增、修改客户信息
	deleteHinsCustInfo: `${modalPrefix}/deleteHinsCustInfo`, // 删除客户信息

	// 体检分部管理
	getMecInfo: `${modalPrefix}/getMecInfo`, // 获取体检分部分页列表
	saveMecInfo: `${modalPrefix}/saveMecInfo`, // 新增
	updateMecInfo: `${modalPrefix}/updateMecInfo`, // 修改
	getHinsServItemListByMecno: `${modalPrefix}/getHinsServItemListByMecno`, // 删除前查询医院下时候有服务项目配置
	delById: `${modalPrefix}/delById`, // 删除

	// 设备管理
	getEquipmentInfoList: `${modalPrefix}/getEquipmentInfoList`, // 分页列表
	saveEquipmentInfo: `${modalPrefix}/saveEquipmentInfo`, // 新增
	updateEquipmentInfo: `${modalPrefix}/updateEquipmentInfo`, // 修改
	delEquipmentById: `${modalPrefix}/delEquipmentById`, // 删除

	// 设备检测
	queryDeviceHsItem: `${modalPrefix}/queryDeviceHsItem`, // 列表查询
	getGMDDetailInfo: `${modalPrefix}/getGMDDetailInfo`, // 骨密度详情
	getPulseDetailInfo: `${modalPrefix}/getPulseDetailInfo`, // 脉象仪详情
	getZwcheckoneDetailInfo: `${modalPrefix}/getZwcheckoneDetailInfo`, // 中卫一体机详情
	getSjcheckoneDetailInfo: `${modalPrefix}/getSjcheckoneDetailInfo`, // 双佳一体机详情
	saveHinsGmdExamination: `${modalPrefix}/saveHinsGmdExamination`, // 骨密度确认
	saveHinsPulseExamination: `${modalPrefix}/saveHinsPulseExamination`, // 脉象仪确认
	saveHinsZwcheckoneExamination: `${modalPrefix}/saveHinsZwcheckoneExamination`, // 中卫一体机确认
	saveHinsSjcheckoneExamination: `${modalPrefix}/saveHinsSjcheckoneExamination`, // 双佳一体机确认
	getHinsHsAppointByPhysicalno: `${modalPrefix}/getHinsHsAppointByPhysicalno`, // 手动添加体检号前校验
	setGmdChart: `${modalPrefix}/setGmdChart`, // 上传图片

	// 服务项目配置
	queryMecName: `${modalPrefix}/queryMecName`, // 查询健管中心
	loadPage: `${modalPrefix}/loadPage`, // 查询
	addHinsServItem: `${modalPrefix}/addHinsServItem`, // 新增
	updateHinsServItem: `${modalPrefix}/updateHinsServItem`, // 修改
	getServItemNameAndServItemSubName: `${modalPrefix}/getServItemNameAndServItemSubName`, // 服务项目明细
	delHinsServItem: `${modalPrefix}/delHinsServItem`, // 删除

	// 医师、技师管理
	getDoctorByService: `${modalPrefix}/getDoctorByService`, // 查询列表
	delDocInfoById: `${modalPrefix}/delDocInfoById`, // 删除
	getDocInfoByID: `${modalPrefix}/getDocInfoByID`, // 根据id查询
	saveDocInfo: `${modalPrefix}/saveDocInfo`, // 新增
	updateDocInfo: `${modalPrefix}/updateDocInfo`, // 编辑

	// 检测服务结算
	getHsConclusionList: `${modalPrefix}/getHsConclusionList`, // 查询
	getServiceInfoByPhysicalNo: `${modalPrefix}/getServiceInfoByPhysicalNo`, // 信息一览
	getHsConclusionById: `${modalPrefix}/getHsConclusionById`, // 体检信息
	saveCheckResult: `${modalPrefix}/saveCheckResult`, // 保存
	confirmCheckFinish: `${modalPrefix}/confirmCheckFinish`, // 确认
	getGMDInfo: `${modalPrefix}/getGMDInfo`, // 打印前获取信息
	saveGMDImg: `${modalPrefix}/saveGMDImg`, // 上传图片
	printPhysicalReportInfo: `${modalPrefix}/printPhysicalReportInfo`, // 打印

	// 排班管理
	getServiceInfoByMecNo: `${modalPrefix}/getServiceInfoByMecNo`, // 查询健管中心下的服务项目
	getWorkplanList: `${modalPrefix}/getWorkplanList`, // 添加排班保存
	saveWorkPlans: `${modalPrefix}/saveWorkPlans`, // 添加排班保存
	delWorkPlan: `${modalPrefix}/delWorkPlan`, // 添加排班删除

	// 排班详情
	getWorkplanDataList: `${modalPrefix}/getWorkplanDataList`, // 查询
	deleteWorkPlan: `${modalPrefix}/deleteWorkPlan`, // 删除

	// 检测报告-打印报告
	getPhysicalReportList: `${modalPrefix}/getPhysicalReportList`, // 查询
	getPhysicalInfoDetailByPhyNo: `${modalPrefix}/getPhysicalInfoDetailByPhyNo`, // 项目详情
	getPhysicalReportInfo: `${modalPrefix}/getPhysicalReportInfo`, // 打印
	getPhysicalItemInfo: `${modalPrefix}/getPhysicalItemInfo`, // 打印报告单

	// 设置健管中心
	geCustInfoList: `${modalPrefix}/geCustInfoList`, // 用户列表
	getMecInfoList: `${modalPrefix}/getMecInfoList`, // 健管中心列表
	saveCapUsersHospital: `${modalPrefix}/saveCapUsersHospital` // 设置健管中心


}
