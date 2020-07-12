// 健管交易
const bmsRoutes = [
	// 人员薪酬
	// 人员管理
	{
	// 人员信息查询
		path: "/StaffQuery",
		name: "StaffQuery",
		meta: {
			pathName: "/StaffQuery"
		},
		component: () => import("@/pages/Staff/staff-query")
	}, {
		path: "/StaffEntry",
		name: "StaffEntry",
		meta: {
			pathName: "/StaffEntry"
		},
		component: () => import("@/pages/Staff/staff-entry")
	}, {
		path: "/StaffTrail",
		name: "StaffTrail",
		meta: {
			pathName: "/StaffTrail"
		},
		component: () => import("@/pages/Staff/staff-trail")
	}, {
		path: "/StaffFiles",
		name: "StaffFiles",
		meta: {
			pathName: "/StaffFiles"
		},
		component: () => import("@/pages/Staff/staff-files")
	}, {
		path: "/StaffQuitResume",
		name: "StaffQuitResume",
		meta: {
			pathName: "/StaffQuitResume"
		},
		component: () => import("@/pages/Staff/staff-quit-resume")
	}, {
		path: "/StaffQuit",
		name: "StaffQuit",
		meta: {
			pathName: "/StaffQuit"
		},
		component: () => import("@/pages/Staff/staff-quit")
	}, {
		path: "/StaffAdjust",
		name: "StaffAdjust",
		meta: {
			pathName: "/StaffAdjust"
		},
		component: () => import("@/pages/Staff/staff-adjust")
	},
	// 日常管理
	{
		path: "/Holiday",
		name: "Holiday",
		meta: {
			pathName: "/Holiday"
		},
		component: () => import("@/pages/Holiday/holiday")
	}, {
		path: "/HolidayCheck",
		name: "HolidayCheck",
		meta: {
			pathName: "/HolidayCheck"
		},
		component: () => import("@/pages/Holiday/holiday-check")
	}, {
		path: "/HolidayRadio",
		name: "HolidayRadio",
		meta: {
			pathName: "/HolidayRadio"
		},
		component: () => import("@/pages/Holiday/holiday-radio")
	},
	// 日常考核
	{
	// 日常考核查询
		path: '/Assessment',
		name: 'Assessment',
		meta: { pathName: '/Assessment' },
		component: () => import('@/pages/RoutineAssessment/assessment')
	}, {
	// 标准绩效系数维护
		path: '/StandardPerformance',
		name: 'StandardPerformance',
		meta: { pathName: '/StandardPerformance' },
		component: () => import('@/pages/RoutineAssessment/standard-performance')
	},
	// 年终考核
	{
	// 健康管家评分导入
		path: '/ImportExcel',
		name: 'ImportExcel',
		meta: { pathName: '/ImportExcel' },
		component: () => import('../pages/YearEnd/ImportExcel')
	}, {
	// 健康管家评分审核
		path: '/ExamineSalary',
		name: 'ExamineSalary',
		meta: { pathName: '/ExamineSalary' },
		component: () => import('../pages/YearEnd/ExamineSalary')
	}, {
	// 健康管家绩效统计查询
		path: '/CensusSalary',
		name: 'CensusSalary',
		meta: { pathName: '/CensusSalary' },
		component: () => import('../pages/YearEnd/CensusSalary')
	}, {
	// 中心主任考核目标配置
		path: '/AssessTargetConfig',
		name: 'AssessTargetConfig',
		meta: { pathName: '/AssessTargetConfig' },
		component: () => import('../pages/YearEnd/AssessTargetConfig')
	}, {
	// 中心主任考核导入（固定薪酬）
		path: '/AssessImport',
		name: 'AssessImport',
		meta: { pathName: '/AssessImport' },
		component: () => import('../pages/YearEnd/AssessImport')
	},
	// 薪酬管理
	{
	// 薪资计算
		path: "/SalaryCalculate",
		name: "SalaryCalculate",
		meta: {
			pathName: "/SalaryCalculate"
		},
		component: () => import("@/pages/StaffSalary/salary-calculate")
	}, {
	// 薪资明细查询
		path: "/SalaryDetail",
		name: "SalaryDetail",
		meta: {
			pathName: "/SalaryDetail"
		},
		component: () => import("@/pages/StaffSalary/salary-detail")
	}, {
	// 薪资计算状态修改
		path: "/SalaryStatusCheck",
		name: "SalaryStatusCheck",
		meta: {
			pathName: "/SalaryStatusCheck"
		},
		component: () => import("@/pages/StaffSalary/salary-status-check")
	}, {
	// 固定薪资修改
		path: "/StaffSalaryFixed",
		name: "StaffSalaryFixed",
		meta: {
			pathName: "/StaffSalaryFixed"
		},
		component: () => import("@/pages/StaffSalary/fixed-salary")
	},
	{
	// 薪资指标配置
		path: "/StaffSalaryTarget",
		name: "StaffSalaryTarget",
		meta: {
			pathName: "/StaffSalaryTarget"
		},
		component: () => import("@/pages/StaffSalary/salary-target")
	}, {
	// 薪资导入管理
		path: "/StaffSalaryImport",
		name: "StaffSalaryImport",
		meta: {
			pathName: "/StaffSalaryImport"
		},
		component: () => import("@/pages/StaffSalary/import-salary")
	}, {
	// 导入查询及修改
		path: "/StaffSalaryImportQuery",
		name: "StaffSalaryImportQuery",
		meta: {
			pathName: "/StaffSalaryImportQuery"
		},
		component: () => import("@/pages/StaffSalary/salary-import-query")
	}, {
	// 工资单导出
		path: "/StaffSalaryPayrollExport",
		name: "StaffSalaryPayrollExport",
		meta: {
			pathName: "/StaffSalaryPayrollExport"
		},
		component: () => import("@/pages/StaffSalary/payroll-export")
	}, {
	// 群发工资单邮件
		path: "/StaffSalarySendPayroll",
		name: "StaffSalarySendPayroll",
		meta: {
			pathName: "/StaffSalarySendPayroll"
		},
		component: () => import("@/pages/StaffSalary/send-payroll")
	}, {
	// 管家薪资统计
		path: "/StaffSalaryPersonalDetail",
		name: "StaffSalaryPersonalDetail",
		meta: {
			pathName: "/StaffSalaryPersonalDetail"
		},
		component: () => import("@/pages/StaffSalary/personal-salary-detail")
	},


	// 统计核算
	// 基础配置
	{
		// 专属产品配置
		path: "/BasicInfoProductConf",
		name: "BasicInfoProductConf",
		meta: {pathName: "/BasicInfoProductConf"},
		component: () => import("@/pages/BasicInfo/product-conf")
	}, {
		// 主险附加服务算法配置
		path: "/BasicInfoRecomeMethod",
		name: "BasicInfoRecomeMethod",
		meta: { pathName: "/BasicInfoRecomeMethod" },
		component: () => import("@/pages/BasicInfo/recome-method")
	},
	// 现金收入明细查询及导出
	{
		// 保额收入明细查询及导出
		path: "/InsuredQueryAndExport",
		name: "InsuredQueryAndExport",
		meta: { pathName: "/InsuredQueryAndExport" },
		component: () => import("@/pages/cashincome/InsuredQueryAndExport")
	}, {
		// 现金收入明细查询及导出
		path: "/CashincomeQueryAndExport",
		name: "CashincomeQueryAndExport",
		meta: { pathName: "/CashincomeQueryAndExport" },
		component: () => import("@/pages/cashincome/CashincomeQueryAndExport")
	},
	// 手工数据上报
	{
		// 社团录入查询
		path: "/ManualDataReportQuery",
		name: "ManualDataReportQuery",
		meta: {	pathName: "/ManualDataReportQuery" },
		component: () => import("@/pages/ManualDataReport/social-group-insurance-query")
	}, {
	  // 社团数据修改
		path: "/ManualDataReportUpdate",
		name: "ManualDataReportUpdate",
		meta: {	pathName: "/ManualDataReportUpdate" },
		component: () => import("@/pages/ManualDataReport/social-group-insurance-update")
	}, {
	// 社团录入审核
		path: "/ManualDataReportAssess",
		name: "ManualDataReportAssess",
		meta: {	pathName: "/ManualDataReportAssess" },
		component: () => import("@/pages/ManualDataReport/social-group-insurance-assess")
	}, {
	// 社团数据录入
		path: "/ManualDataReportInput",
		name: "ManualDataReportInput",
		meta: { pathName: "/ManualDataReportInput" },
		component: () => import("@/pages/ManualDataReport/social-group-insurance-input")
	}, {
	// 社团数据批量导入
		path: "/ManualDataReportImport",
		name: "ManualDataReportImport",
		meta: { pathName: "/ManualDataReportImport" },
		component: () => import("@/pages/ManualDataReport/social-group-insurance-import")
	}, {
	// 社团数据修改 详情
		path: "/socialGroupInsuranceDetails",
		name: "socialGroupInsuranceDetails",
		meta: { pathName: "/socialGroupInsuranceDetails" },
		component: () => import("@/pages/ManualDataReport/social-group-insurance-details")
	}, {
	// 社团数据审核 详情
		path: "/socialGroupInsuranceDetailsExamine",
		name: "socialGroupInsuranceDetailsExamine",
		meta: { pathName: "/socialGroupInsuranceDetailsExamine" },
		component: () => import("@/pages/ManualDataReport/social-group-insurance-examineDetails")
	},
	// 数据对账管理
	{
		// 数据导入
		path: "/AccountImport",
		name: "AccountImport",
		meta: {	pathName: "/AccountImport" },
		component: () => import("@/pages/CheckAccount/import-account")
	},
	{
		// 数据对账及审批
		path: "/AccountDataRecord",
		name: "AccountDataRecord",
		meta: { pathName: "/AccountDataRecord" },
		component: () => import("@/pages/CheckAccount/data-record")
	}, {
		// 确认支付
		path: "/AccountPayConfirm",
		name: "AccountPayConfirm",
		meta: { pathName: "/AccountPayConfirm" },
		component: () => import("@/pages/CheckAccount/pay-confirm")
	},
	// 预算管理
	{
		// 预算维护
		path: "/BudgetMaintain",
		name: "BudgetMaintain",
		meta: { pathName: "/BudgetMaintain" },
		component: () => import("@/pages/Budget/budget-maintain")
	},
	{
		// 新建预算
		path: "/BudgetNew",
		name: "BudgetNew",
		meta: { pathName: "/BudgetNew" },
		component: () => import("@/pages/Budget/budget-new")
	}, {
		// 追加预算
		path: "/BudgetAdd",
		name: "BudgetAdd",
		meta: { pathName: "/BudgetAdd" },
		component: () => import("@/pages/Budget/budget-add")
	}, {
		// 预算审核
		path: "/BudgetCheck",
		name: "BudgetCheck",
		meta: { pathName: "/BudgetCheck" },
		component: () => import("@/pages/Budget/budget-check")
	},
	// 项目管理
	{
		// 新建项目
		path: "/BudgetItemAdd",
		name: "BudgetItemAdd",
		meta: { pathName: "/BudgetItemAdd" },
		component: () => import("@/pages/BudgetItem/budget-item-add")
	}, {
		// 项目维护
		path: "/BudgetItemMaintain",
		name: "BudgetItemMaintain",
		meta: { pathName: "/BudgetItemMaintain" },
		component: () => import("@/pages/BudgetItem/budget-item-maintain")
	}, {
		// 项目审核
		path: "/BudgetItemExamine",
		name: "BudgetItemExamine",
		meta: { pathName: "/BudgetItemExamine" },
		component: () => import("@/pages/BudgetItem/budget-item-examine")
	},

	// 会员管理
	// 积分管理

	// 佣金管理
	// 佣金比例配置
	{
		path: '/commissionrate',
		name: 'CommissionRate',
		meta: { title: '产品佣金比例配置' },
		component: () => import('@/pages/CommissionManagement/CommissionRate'),
		children: [{
			path: 'add',
			name: 'CommissionRateAdd',
			component: () => import('@/pages/CommissionManagement/CommissionRateDia/RateAdd')
		}, {
			path: 'edit',
			name: 'CommissionRateEdit',
			component: () => import('@/pages/CommissionManagement/CommissionRateDia/RateEdit'),
			props: (route) => ({
				k: route.query.k
			})
		}]
	},
	// 佣金管理-佣金数据管理
	{
		path: '/commissiondata',
		name: 'CommissionData',
		meta: { title: '佣金数据管理' },
		component: () => import('@/pages/CommissionManagement/CommissionData')
	},
	// 佣金管理-加扣款管理
	{
		path: '/plusdeduction',
		name: 'PlusDeduction',
		meta: { title: '加扣款管理' },
		component: () => import('@/pages/CommissionManagement/PlusDeduction')
	},

	// 财务收付


	// 一卡通（健管交易）
	{
		// 团体购买
		path: "/vipShoppingOrderImport",
		name: "vipShoppingOrderImport",
		meta: {
			pathName: "/vipShoppingOrderImport"
		},
		component: () =>
                      import("@/onecard/consumer/vip-shopping-order-import")
	},
	{
		//  已购买服务管理
		path: "/vipShoppingOrderList",
		name: "vipShoppingOrderList",
		meta: {
			pathName: "/vipShoppingOrderList"
		},
		component: () =>
                      import("@/onecard/consumer/vip-shopping-order-list")
	},
	{
		//    购买健管服务
		path: "/vipShoppingOrderAdd",
		name: "vipShoppingOrderAdd",
		meta: {
			pathName: "/vipShoppingOrderAdd"
		},
		component: () =>
                      import("@/onecard/consumer/vip-shopping-order-add")
	},
	{
		// 账户储值确认
		path: "/vipAccountStoreValueConfirm",
		name: "vipAccountStoreValueConfirm",
		meta: {
			pathName: "/vipAccountStoreValueConfirm"
		},
		component: () =>
                      import("@/onecard/manager/vip-account-store-value-confirm")
	},
	{
		// 账户储值申请
		path: "/vipAccountStoreValue",
		name: "vipAccountStoreValue",
		meta: {
			pathName: "/vipAccountStoreValue"
		},
		component: () =>
                      import("@/onecard/manager/vip-account-store-value")
	},
	{
		// 部分领取管理
		path: "/VipWithdrawapplyList",
		name: "VipWithdrawapplyList",
		meta: {
			pathName: "/VipWithdrawapplyList"
		},
		component: () =>
                      import("@/onecard/manager/vip-withdraw-apply-list")
	},
	{
		// 部分领取管理
		path: "/AccountPayConfirm",
		name: "AccountPayConfirm",
		meta: {
			pathName: "/AccountPayConfirm"
		},
		component: () =>
                      import("@/onecard/manager/account-pay-confirm")
	},
	{
		// 团体订单部分领取
		path: "/VipWithdrawapplyAdd",
		name: "VipWithdrawapplyAdd",
		meta: {
			pathName: "/VipWithdrawapplyAdd"
		},
		component: () =>
        import("@/onecard/manager/vip-withdraw-apply-add")
	},
	{
		// 会员账户信息查询（新）
		path: "/VipAccountRelatedNewList",
		name: "VipAccountRelatedNewList",
		meta: {
			pathName: "/VipAccountRelatedNewList"
		},
		component: () =>
        import("@/onecard/search/vip-account-related-new-list")
	},
	{
		// 会员消费记录查询
		path: "/VipMoneyFlowSelect",
		name: "VipMoneyFlowSelect",
		meta: {
			pathName: "/VipMoneyFlowSelect"
		},
		component: () =>
        import("@/onecard/search/vip-money-flow-select")
	}
]

export default bmsRoutes
