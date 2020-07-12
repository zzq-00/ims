const arr = [{
	path: "/userManage",
	name: "userManage",
	meta: {
		pathName: "/userManage"
	},
	component: () =>
                    import("@/pages/User/UserManage")
},
	// 供应商查询
{
	path: "/SupplierQuery",
	name: "SupplierQuery",
	meta: {
		pathName: "/SupplierQuery"
	},
	component: () =>
                    import("@/pages/Supplier/supplier-query")
},
	// 代理关系维护
{
	path: "/AgentRelation",
	name: "AgentRelation",
	meta: {
		pathName: "/AgentRelation"
	},
	component: () =>
		import("@/pages/Supplier/agent-relation")
},
	// 供应商维护
{
	path: "/SupplierTabs",
	name: "SupplierTabs",
	meta: {
		pathName: "/SupplierTabs"
	},
	component: () =>
										import("@/pages/Supplier/supplier-tabs")
},
	// 供应商审核
{
	path: "/SupplierVerify",
	name: "SupplierVerify",
	meta: {
		pathName: "/SupplierVerify"
	},
	component: () =>
										import("@/pages/Supplier/supplier-verify")
},
	// 供应商合并
{
	path: "/SupplierMerges",
	name: "SupplierMerges",
	meta: {
		pathName: "/SupplierMerges"
	},
	component: () =>
                    import("@/pages/Supplier/supplier-merges")
},
	// 供应商导入
{
	path: "/SupplierImport",
	name: "SupplierImport",
	meta: {
		pathName: "/SupplierImport"
	},
	component: () =>
                    import("@/pages/Supplier/supplier-import")
},

{
	path: "/RelationQuery",
	name: "RelationQuery",
	meta: {
		pathName: "/RelationQuery"
	},
	component: () =>
                    import("@/pages/Supplier/components/relation-query")
},
{
	path: "/RelationMaintain",
	name: "RelationMaintain",
	meta: {
		pathName: "/RelationMaintain"
	},
	component: () =>
                    import("@/pages/Supplier/components/relation-maintain")
},
{
	path: "/NetworkQuery",
	name: "NetworkQuery",
	meta: {
		pathName: "/NetworkQuery"
	},
	component: () =>
                    import("@/pages/ProductNetwork/network-query")
},
{
	path: "/NetworkAdd",
	name: "NetworkAdd",
	meta: {
		pathName: "/NetworkAdd"
	},
	component: () =>
                    import("@/pages/ProductNetwork/network-add")
},
{
	path: "/NetworkImport",
	name: "NetworkImport",
	meta: {
		pathName: "/NetworkImport"
	},
	component: () =>
                    import("@/pages/ProductNetwork/network-import")
},
{
	path: "/ProductTemplate",
	name: "ProductTemplate",
	meta: {
		pathName: "/ProductTemplate"
	},
	component: () =>
                    import("@/pages/ProductNetwork/product-template")
},
{
	  path: "/ProductTemplateDetail",
	  name: "ProductTemplateDetail",
	  meta: {
	    pathName: "/ProductTemplateDetail"
	  },
	  component: () =>
	    import("@/pages/ProductNetwork/product-template-detail")
},


{
	path: "/ServiceMaintain",
	name: "ServiceMaintain",
	meta: {
		pathName: "/ServiceMaintainn"
	},
	component: () =>
                    import("@/pages/ProductService/service-maintain")
},
{
	path: "/ServicegroupMaintain",
	name: "ServicegroupMaintain",
	meta: {
		pathName: "/ServicegroupMaintain"
	},
	component: () =>
                    import("@/pages/ProductService/servicegroup-maintain")
},
{
	path: "/ServiceQuery",
	name: "ServiceQuery",
	meta: {
		pathName: "/ServiceQuery"
	},
	component: () => import("@/pages/ProductService/service-query")
},
{
	path: "/ProductMaintain",
	name: "ProductMaintain",
	meta: {
		pathName: "/ProductMaintain"
	},
	component: () => import("@/pages/Product/product-maintain")
},
{
	path: "/ProductAdd",
	name: "ProductAdd",
	meta: {
		pathName: "/ProductAdd"
	},
	component: () => import("@/pages/Product/product-add")
},
{
	path: "/ProductExamineDetail",
	name: "ProductExamineDetail",
	meta: {
		pathName: "/ProductExamineDetail"
	},
	component: () => import("@/pages/Product/product-examine-detail")
},
{
	path: "/ProductApprovalDetail",
	name: "ProductApprovalDetail",
	meta: {
		pathName: "/ProductApprovalDetail"
	},
	component: () => import("@/pages/Product/product-approval-detail")
},
{
	path: "/ProductDetail",
	name: "ProductDetail",
	meta: {
		pathName: "/ProductDetail"
	},
	component: () => import("@/pages/Product/product-detail")
},
{
	path: "/ProductCopy",
	name: "ProductCopy",
	meta: {
		pathName: "/ProductCopy"
	},
	component: () => import("@/pages/Product/product-copy")
},
{
	path: "/RelationQuery",
	name: "RelationQuery",
	meta: {
		pathName: "/RelationQuery"
	},
	component: () =>
                    import("@/pages/Supplier/components/relation-query")
},
{
	path: "/RelationMaintain",
	name: "RelationMaintain",
	meta: {
		pathName: "/RelationMaintain"
	},
	component: () =>
                    import("@/pages/Supplier/components/relation-maintain")
},
{
	path: "/SupplierService",
	name: "SupplierService",
	meta: {
		pathName: "/SupplierService"
	},
	component: () =>
                    import("@/pages/ProductNetwork/supplier-service")
},
{
	path: "/NetworkQuery",
	name: "NetworkQuery",
	meta: {
		pathName: "/NetworkQuery"
	},
	component: () =>
                    import("@/pages/ProductNetwork/network-query")
},
{
	path: "/NetworkAdd",
	name: "NetworkAdd",
	meta: {
		pathName: "/NetworkAdd"
	},
	component: () =>
                    import("@/pages/ProductNetwork/network-add")
},
{
	path: "/NetworkImport",
	name: "NetworkImport",
	meta: {
		pathName: "/NetworkImport"
	},
	component: () =>
                    import("@/pages/ProductNetwork/network-import")
},
{
	path: "/ProductTemplate",
	name: "ProductTemplate",
	meta: {
		pathName: "/ProductTemplate"
	},
	component: () =>
                    import("@/pages/ProductNetwork/product-template")
},
// {
// 	path: "/StaffQuery",
// 	name: "StaffQuery",
// 	meta: {
// 		pathName: "/StaffQuery"
// 	},
// 	component: () =>
//                     import("@/pages/Staff/staff-query")
// },
// {
// 	path: "/StaffEntry",
// 	name: "StaffEntry",
// 	meta: {
// 		pathName: "/StaffEntry"
// 	},
// 	component: () =>
//                     import("@/pages/Staff/staff-entry")
// },
// {
// 	path: "/StaffTrail",
// 	name: "StaffTrail",
// 	meta: {
// 		pathName: "/StaffTrail"
// 	},
// 	component: () =>
//                     import("@/pages/Staff/staff-trail")
// },
// {
// 	path: "/StaffFiles",
// 	name: "StaffFiles",
// 	meta: {
// 		pathName: "/StaffFiles"
// 	},
// 	component: () =>
//                     import("@/pages/Staff/staff-files")
// },
// {
// 	path: "/StaffQuitResume",
// 	name: "StaffQuitResume",
// 	meta: {
// 		pathName: "/StaffQuitResume"
// 	},
// 	component: () =>
//                     import("@/pages/Staff/staff-quit-resume")
// },
// {
// 	path: "/StaffQuit",
// 	name: "StaffQuit",
// 	meta: {
// 		pathName: "/StaffQuit"
// 	},
// 	component: () =>
//                     import("@/pages/Staff/staff-quit")
// },
// {
// 	path: "/StaffAdjust",
// 	name: "StaffAdjust",
// 	meta: {
// 		pathName: "/StaffAdjust"
// 	},
// 	component: () =>
//                     import("@/pages/Staff/staff-adjust")
// },
// {
// 	path: "/Holiday",
// 	name: "Holiday",
// 	meta: {
// 		pathName: "/Holiday"
// 	},
// 	component: () =>
//                     import("@/pages/Holiday/holiday")
// },
// {
// 	path: "/HolidayCheck",
// 	name: "HolidayCheck",
// 	meta: {
// 		pathName: "/HolidayCheck"
// 	},
// 	component: () =>
//                     import("@/pages/Holiday/holiday-check")
// },
// {
// 	path: "/HolidayRadio",
// 	name: "HolidayRadio",
// 	meta: {
// 		pathName: "/HolidayRadio"
// 	},
// 	component: () =>
//                     import("@/pages/Holiday/holiday-radio")
// },
{
	path: "/ServiceMaintain",
	name: "ServiceMaintain",
	meta: {
		pathName: "/ServiceMaintainn"
	},
	component: () =>
                    import("@/pages/ProductService/service-maintain")
},
{
	path: "/ServicegroupMaintain",
	name: "ServicegroupMaintain",
	meta: {
		pathName: "/ServicegroupMaintain"
	},
	component: () =>
                    import("@/pages/ProductService/servicegroup-maintain")
},
{
	path: "/ServiceQuery",
	name: "ServiceQuery",
	meta: {
		pathName: "/ServiceQuery"
	},
	component: () =>
                    import("@/pages/ProductService/service-query")
},
{
	path: "/ProductMaintain",
	name: "ProductMaintain",
	meta: {
		pathName: "/ProductMaintain"
	},
	component: () =>
                    import("@/pages/Product/product-maintain")
},
{
	path: "/ProductExamine",
	name: "ProductExamine",
	meta: {
		pathName: "/ProductExamine"
	},
	component: () =>
                    import("@/pages/Product/product-examine")
},
{
	path: "/ProductApproval",
	name: "ProductApproval",
	meta: {
		pathName: "/ProductApproval"
	},
	component: () =>
                    import("@/pages/Product/product-approval")
},
{
	path: "/HealthCard",
	name: "HealthCard",
	meta: {
		pathName: "/HealthCard"
	},
	component: () =>
                    import("@/pages/HealthCard/card")
},
{
	path: "/HealthWarning",
	name: "HealthWarning",
	meta: {
		pathName: "/HealthWarning"
	},
	component: () =>
                    import("@/pages/HealthCard/warning")
},
{
	path: "/HealthPersonMail",
	name: "HealthPersonMail",
	meta: {
		pathName: "/HealthPersonMail"
	},
	component: () =>
                    import("@/pages/HealthCard/person-mail")
},
{
	path: "/HealthImport3rd",
	name: "HealthImport3rd",
	meta: {
		pathName: "/HealthImport3rd"
	},
	component: () =>
                    import("@/pages/HealthCard/card-import-3rd")
},
{
	path: "/HealthImportInvalid",
	name: "HealthImportInvalid",
	meta: {
		pathName: "/HealthImportInvalid"
	},
	component: () =>
                    import("@/pages/HealthCard/card-import-invalid")
}, // 第三方健管卡生成入库
{
	path: "/HealthThirdImport",
	name: "HealthThirdImport",
	meta: {
		pathName: "/HealthThirdImport"
	},
	component: () =>
    import("@/pages/HealthCard/card-third-import")
},
{
	path: "/HealthCardProduct",
	name: "HealthCardProduct",
	meta: {
		pathName: "/HealthCardProduct"
	},
	component: () =>
                    import("@/pages/HealthCard/components/card-product-form")
},
{
	path: "/HealthCardStatusQuery",
	name: "HealthCardStatusQuery",
	meta: {
		pathName: "/HealthCardStatusQuery"
	},
	component: () =>
                    import("@/pages/HealthCard/card-status-query")
},
{
	path: "/HealthCardDetailQuery",
	name: "HealthCardDetailQuery",
	meta: {
		pathName: "/HealthCardDetailQuery"
	},
	component: () =>
                    import("@/pages/HealthCard/card-detail-query")
},
{
	path: "/HealthCardSend",
	name: "HealthCardSend",
	meta: {
		pathName: "/HealthCardSend"
	},
	component: () =>
                    import("@/pages/HealthCard/card-send")
},
{
	path: "/HealthCardSellRegister",
	name: "HealthCardSellRegister",
	meta: {
		pathName: "/HealthCardSellRegister"
	},
	component: () =>
                    import("@/pages/HealthCard/card-sell-register")
},
{
	path: "/HealthCardSellApprove",
	name: "HealthCardSellApprove",
	meta: {
		pathName: "/HealthCardSellApprove"
	},
	component: () =>
                    import("@/pages/HealthCard/card-sell-approve")
},
{
	path: "/HealthCardSellQuery",
	name: "HealthCardSellQuery",
	meta: {
		pathName: "/HealthCardSellQuery"
	},
	component: () =>
                    import("@/pages/HealthCard/card-sell-query")
},
{
	path: "/HealthCardReceiveApprove",
	name: "HealthCardReceiveApprove",
	meta: {
		pathName: "/HealthCardReceiveApprove"
	},
	component: () =>
                    import("@/pages/HealthCard/card-receive-approve")
},
{
	path: "/HealthCardReceiveQuery",
	name: "HealthCardReceiveQuery",
	meta: {
		pathName: "/HealthCardReceiveQuery"
	},
	component: () =>
                    import("@/pages/HealthCard/card-receive-query")
},
{
	path: "/HealthCardStockQuery",
	name: "HealthCardStockQuery",
	meta: {
		pathName: "/HealthCardStockQuery"
	},
	component: () =>
                    import("@/pages/HealthCard/card-stock-query")
},
{
	path: "/HealthCardStockGenerate",
	name: "HealthCardStockGenerate",
	meta: {
		pathName: "/HealthCardStockGenerate"
	},
	component: () =>
                    import("@/pages/HealthCard/card-stock-generate")
},
{
	// 服务处理及查询
	path: "/ServeApplyInfo",
	name: "ServeApplyInfo",
	meta: {
		pathName: "/ServeApplyInfo"
	},
	component: () =>
                    import("@/pages/ServeApply/apply-info")
},
{
	// 服务处理及查询详情
	path: "/ServeApplyInfoDetails",
	name: "ServeApplyInfoDetails",
	meta: {
		pathName: "/ServeApplyInfoDetails"
	},
	component: () =>
                    import("@/pages/ServeApply/apply-info-details")
},
{
	// 综合查询
	path: "/ServeApplyGeneralQuery",
	name: "ServeApplyGeneralQuery",
	meta: {
		pathName: "/ServeApplyGeneralQuery"
	},
	component: () =>
                    import("@/pages/ServeApply/general-query")
},
{
	// 疑难工单查询
	path: "/ServeApplyDifQuery",
	name: "ServeApplyDifQuery",
	meta: {
		pathName: "/ServeApplyDifQuery"
	},
	component: () =>
                    import("@/pages/ServeApply/dif-query")
},
{
	// 标准服务批量导入
	path: "/ServeApplyNonBatchImport",
	name: "ServeApplyNonBatchImport",
	meta: {
		pathName: "/ServeApplyNonBatchImport"
	},
	component: () =>
                    import("@/pages/ServeApply/non-proprietary-batch-import")
},
{
	// 群发短信
	path: "/ServeApplyMassTextMessage",
	name: "ServeApplyMassTextMessage",
	meta: {
		pathName: "/ServeApplyMassTextMessage"
	},
	component: () =>
                    import("@/pages/ServeApply/mass-text-message")
},
{
	// 自营服务录入
	path: "/SalaryPerformance",
	name: "SalaryPerformance",
	meta: {
		pathName: "/SalaryPerformance"
	},
	component: () =>
                    import("@/pages/SalaryPerformance/salary-performance")
},
{
	// 自营服务批量导入
	path: "/SalaryPerformanceImportBranchSelf",
	name: "SalaryPerformanceImportBranchSelf",
	meta: {
		pathName: "/SalaryPerformanceImportBranchSelf"
	},
	component: () =>
                    import("@/pages/SalaryPerformance/import-branchself-performance")
},
{
	// 管家自营服务审核
	path: "/SalaryPerformancePerformanceAudit",
	name: "SalaryPerformancePerformanceAudit",
	meta: {
		pathName: "/SalaryPerformancePerformanceAudit"
	},
	component: () =>
                    import("@/pages/SalaryPerformance/performance-audit")
},
{
	// 自营服务查询
	path: "/SalaryPerformanceQuery",
	name: "SalaryPerformanceQuery",
	meta: {
		pathName: "/SalaryPerformanceQuery"
	},
	component: () =>
                    import("@/pages/SalaryPerformance/performance-query")
},
{
	// 管家自营服务统计
	path: "/SalaryPerformanceDetails",
	name: "SalaryPerformanceDetails",
	meta: {
		pathName: "/SalaryPerformanceDetails"
	},
	component: () =>
                    import("@/pages/SalaryPerformance/performance-details")
},
{
	// 分公司总服务量报送
	path: "/ServiceReportedBranch",
	name: "ServiceReportedBranch",
	meta: {
		pathName: "/ServiceReportedBranch"
	},
	component: () =>
                    import("@/pages/ServiceReported/branch-service-reported")
},
{
	// 健管中心服务量报送
	path: "/ServiceReportedHealthCenter",
	name: "ServiceReportedHealthCenter",
	meta: {
		pathName: "/ServiceReportedHealthCenter"
	},
	component: () =>
                    import("@/pages/ServiceReported/health-center-service-reported")
},
{
	// VIP诊疗室服务量报送
	path: "/ServiceReportedVipConsult",
	name: "ServiceReportedVipConsult",
	meta: {
		pathName: "/ServiceReportedVipConsult"
	},
	component: () =>
                    import("@/pages/ServiceReported/vip-consult-service-reported")
},
{
	// 集团子公司服务量报送
	path: "/ServiceReportedGroupSubsidiary",
	name: "ServiceReportedGroupSubsidiary",
	meta: {
		pathName: "/ServiceReportedGroupSubsidiary"
	},
	component: () =>
                    import("@/pages/ServiceReported/group-subsidiary-service-reported")
},
{
	// 分公司报送工作量审核
	path: "/ServiceReportedBranchWorkloadAudit",
	name: "ServiceReportedBranchWorkloadAudit",
	meta: {
		pathName: "/ServiceReportedBranchWorkloadAudit"
	},
	component: () =>
                    import("@/pages/ServiceReported/branch-workload-audit")
},
{
	// 分公司工作量上报查询
	path: "/ServiceReportedBranchWorkloadQuery",
	name: "ServiceReportedBranchWorkloadQuery",
	meta: {
		pathName: "/ServiceReportedBranchWorkloadQuery"
	},
	component: () =>
                    import("@/pages/ServiceReported/branch-workload-query")
},
{
	// 健康咨询查询
	path: "/HealthConsultQuery",
	name: "HealthConsultQuery",
	meta: {
		pathName: "/HealthConsultQuery"
	},
	component: () =>
                    import("@/pages/HealthConsult/consult-query")
},
{
	// 健康咨询列表
	path: "/HealthConsultList",
	name: "HealthConsultList",
	meta: {
		pathName: "/HealthConsultList"
	},
	component: () =>
                    import("@/pages/HealthConsult/consult-list")
},
{
	// 服务明细表
	path: "/ServeApplyReportTrace",
	name: "ServeApplyReportTrace",
	meta: {
		pathName: "/ServeApplyReportTrace"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/serve-trace")
},
{
	// 分公司自营服务统计汇总表
	path: "/ServeApplyReportServiceStats",
	name: "ServeApplyReportServiceStats",
	meta: {
		pathName: "/ServeApplyReportServiceStats"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/service-stats-collect")
},
{
	// 分公司自营服务工作量统计
	path: "/ServeApplyReportDayServe",
	name: "ServeApplyReportDayServe",
	meta: {
		pathName: "/ServeApplyReportDayServe"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/day-serve-asse")
},
{
	// 分公司自营服务实施机构统计
	path: "/ServeApplyReportDayPropietary",
	name: "ServeApplyReportDayPropietary",
	meta: {
		pathName: "/ServeApplyReportDayPropietary"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/day-propietary-service-asse")
},
{
	// 标准服务回访统计
	path: "/ServeApplyReportReturnVisit",
	name: "ServeApplyReportReturnVisit",
	meta: {
		pathName: "/ServeApplyReportReturnVisit"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/service-return-visit-collection")
},
{
	// 第三方询价记录汇总
	path: "/ServeApplyReportThirdEnquiry",
	name: "ServeApplyReportThirdEnquiry",
	meta: {
		pathName: "/ServeApplyReportThirdEnquiry"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/third-enquiry-collect")
},
{
	// 第三方询价明细
	path: "/ServeApplyReportThirdPartyEnquiry",
	name: "ServeApplyReportThirdPartyEnquiry",
	meta: {
		pathName: "/ServeApplyReportThirdPartyEnquiry"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/third-party-enquiry")
},
{
	// 健康咨询服务月度统计
	path: "/ServeApplyReportHealthMonthStats",
	name: "ServeApplyReportHealthMonthStats",
	meta: {
		pathName: "/ServeApplyReportHealthMonthStats"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/health-consult-service-month-stats")
},
{
	// 好医保绿通服务实施明细表
	path: "/ServeApplyReportServiceImplList",
	name: "ServeApplyReportServiceImplList",
	meta: {
		pathName: "/ServeApplyReportServiceImplList"
	},
	component: () =>
                    import("@/pages/ServeApplyReport/service-impl-list")
},
{
	// 公共问题维护
	path: "/QuestionnaireManage",
	name: "QuestionnaireManage",
	meta: {
		pathName: "/QuestionnaireManage"
	},
	component: () =>
                    import("@/pages/Questionnaire/public-question")
},
{
	// 回访问卷维护
	path: "/QuestionnaireInfo",
	name: "QuestionnaireInfo",
	meta: {
		pathName: "/QuestionnaireInfo"
	},
	component: () =>
                    import("@/pages/Questionnaire/questionnaire-info")
},
{
	// 短信及邮件配置
	path: "/ProcessConfigMessControll",
	name: "ProcessConfigMessControll",
	meta: {
		pathName: "/ProcessConfigMessControll"
	},
	component: () =>
                    import("@/pages/ProcessConfig/mess-controll")
},
{
	// 队列维护
	path: "/ProcessConfigQueueDefine",
	name: "ProcessConfigQueueDefine",
	meta: {
		pathName: "/ProcessConfigQueueDefine"
	},
	component: () =>
                    import("@/pages/ProcessConfig/queue-define")
},
{
	// 队列订阅
	path: "/ProcessConfigQueueOrder",
	name: "ProcessConfigQueueOrder",
	meta: {
		pathName: "/ProcessConfigQueueOrder"
	},
	component: () =>
                    import("@/pages/ProcessConfig/queue-order")
},
{
	// 服务流程
	path: "/ProcessConfigServiceProcessConfig",
	name: "ProcessConfigServiceProcessConfig",
	meta: {
		pathName: "/ProcessConfigServiceProcessConfig"
	},
	component: () =>
                    import("@/pages/ProcessConfig/service-process-config")
},
{
	// 管家维护
	path: "/ProcessConfigBulterStaffManager",
	name: "ProcessConfigBulterStaffManager",
	meta: {
		pathName: "/ProcessConfigBulterStaffManager"
	},
	component: () =>
                    import("@/pages/ProcessConfig/staff-manager")
},
{
	// 管家访问第三方预约配置
	path: "/ProcessConfigBulterAccessConfig",
	name: "ProcessConfigBulterAccessConfig",
	meta: {
		pathName: "/ProcessConfigBulterAccessConfig"
	},
	component: () =>
                    import("@/pages/ProcessConfig/bulter-access-config")
},
{
	// 第三方预约信息查询
	path: "/ThirdAppointQuery",
	name: "ThirdAppointQuery",
	meta: {
		pathName: "/ThirdAppointQuery"
	},
	component: () =>
                    import("@/pages/ThirdAppointment/query-third-appointment")
},


{
	// 产品购买申请
	path: "/VipInsureAdd",
	name: "VipInsureAdd",
	meta: {
		pathName: "/VipInsureAdd"
	},
	component: () =>
                    import("@/onecard/insure/vip-insure-add")
},
{
	// 团体产品购买申请
	path: "/VipInsureAddForCom",
	name: "VipInsureAddForCom",
	meta: {
		pathName: "/VipInsureAddForCom"
	},
	component: () =>
                    import("@/onecard/insure/vip-insure-add-for-com")
},
{
	// 产品缴费管理分公司
	path: "/VipInsureListBranch",
	name: "VipInsureListBranch",
	meta: {
		pathName: "/VipInsureListBranch"
	},
	component: () =>
                    import("@/onecard/insure/vip-insure-list-branch")
},
{
	// 产品缴费管理
	path: "/VipInsureList",
	name: "VipInsureList",
	meta: {
		pathName: "/VipInsureList"
	},
	component: () =>
                    import("@/onecard/insure/vip-insure-list")
},
{
	// 产品定义
	path: "/VipProductList",
	name: "VipProductList",
	meta: {
		pathName: "/VipProductList"
	},
	component: () =>
                    import("@/onecard/base/vip-product-list")
},
{
	// 待邮寄卡管理
	path: "/VipSendCardPost",
	name: "VipSendCardPost",
	meta: {
		pathName: "/VipSendCardPost"
	},
	component: () =>
                    import("@/onecard/manager/vip-sendcard-post")
},
{
	// 人卡绑定管理
	path: "/VipSendCardMain",
	name: "VipSendCardMain",
	meta: {
		pathName: "/VipSendCardMain"
	},
	component: () =>
                    import("@/onecard/manager/vip-sendcard-post-main")
},
{
	// 管理式医疗绑卡
	path: "/vipSendCardMainForWork",
	name: "vipSendCardMainForWork",
	meta: {
		pathName: "/vipSendCardMainForWork"
	},
	component: () =>
      import("@/onecard/manager/vip-sendcard-main-forwork")
},
{
	// 试销计划套餐退款
	path: "/VipRefundList",
	name: "VipRefundList",
	meta: {
		pathName: "/VipRefundList"
	},
	component: () =>
                    import("@/onecard/manager/vip-refund-list")
},
{
	// 附属人批量导入及管理
	path: "/VipAccountRelatedList",
	name: "VipAccountRelatedList",
	meta: {
		pathName: "/VipAccountRelatedList"
	},
	component: () =>
                    import("@/onecard/manager/vip-account-related-list")
},
{
	// 修改一卡通支付密码
	path: "/VipAccountUpdatePwd",
	name: "VipAccountUpdatePwd",
	meta: {
		pathName: "/VipAccountUpdatePwd"
	},
	component: () =>
                    import("@/onecard/manager/vip-account-update-pwd")
},

{
	// 影像件上传管理
	path: "/VipImageUploadList",
	name: "VipImageUploadList",
	meta: {
		pathName: "/VipImageUploadList"
	},
	component: () =>
                    import("@/onecard/consumer/vip-image-upload-list")
},


{
	// 批量支付导入
	path: "/vipBatchpayImport",
	name: "vipBatchpayImport",
	meta: {
		pathName: "/vipBatchpayImport"
	},
	component: () =>
      import("@/onecard/consumer/vip-batchpay-import")
},
{
	// 批量支付结果查询
	path: "/vipBatchpayResultList",
	name: "vipBatchpayResultList",
	meta: {
		pathName: "/vipBatchpayResultList"
	},
	component: () =>
      import("@/onecard/consumer/vip-batchpay-result-list")
},
{
	// 管理式保单状态查询
	path: "/VipCommonSelect",
	name: "VipCommonSelect",
	meta: {
		pathName: "/VipCommonSelect"
	},
	component: () => import("@/onecard/search/vip-common-select")
},
{
	// 送万家保单查询
	path: "/VipDirectSales",
	name: "VipDirectSales",
	meta: {
		pathName: "/VipDirectSales"
	},
	component: () =>
                    import("@/onecard/search/vip-direct-sales")
},
	// 送万家销售查询
{ path: "/VipDirectSalesCard",
	name: "VipDirectSalesCard",
	meta: {
		pathName: "/VipDirectSalesCard"
	},
	component: () =>
  import("@/onecard/search/vip-direct-sales-card")
},
{
	// 会员账户信息查询
	path: "/VipAccountList",
	name: "VipAccountList",
	meta: {
		pathName: "/VipAccountList"
	},
	component: () =>
                    import("@/onecard/search/vip-account-list")
},

{
	// 会员信息变更
	path: "/VipInfoList",
	name: "VipInfoList",
	meta: {
		pathName: "/VipInfoList"
	},
	component: () =>
                    import("@/onecard/search/vip-info-list")
},


// 结算管理--结算确认--------------------------------
{
	path: "/AccountHand",
	name: "AccountHand",
	meta: {
		pathName: "/AccountHand"
	},
	component: () =>
                    import("@/pages/FinalAccount/AccountHand")
},
// 结算管理--人工结算
{
	path: "/AccountSure",
	name: "AccountSure",
	meta: {
		pathName: "/AccountSure"
	},
	component: () =>
                    import("@/pages/FinalAccount/AccountSure")
}


]

export default arr
