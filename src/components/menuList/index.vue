<template>
  <div>
    <a-menu mode="inline" style="width: 256px;height: 850px;" @click="menuClickEvent">
      <a-sub-menu :key="index" v-for="(item, index) in menuList">
        <span slot="title">
          <a-icon :type="item.icon" /><span>{{item.title}}</span>
        </span>
        <a-menu-item v-for="(subItem) in item.children" :key="`${subItem.routerName}`">{{subItem.title}}</a-menu-item>
        <a-menu-item-group :key=index2 v-for="(item2,index2) in item.menuGroup" :title="item2.groupName">
          <span slot="title">
            <a-icon :type="item2.icon" /><span>{{item2.title}}</span>
          </span>
          <a-menu-item v-for="(subItem) in item2.children" :key="`${subItem.routerName}`">{{subItem.title}}</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
export default {
	data () {
		return {
			menuList: [
				// 一卡通
				{
					title: '一卡通',
					icon: 'credit-card',
					menuGroup: [
						{
							groupName: '消费管理',
							children: [
								{ title: '影像件上传管理', routerName: 'VipImageUploadList' }
							]
						},
						{
							groupName: '卡管理',
							children: [
								{title: '修改一卡通支付密码', routerName: 'VipAccountUpdatePwd'},
								{title: '人卡绑定管理', routerName: 'VipSendCardMain'},
								{title: '附属人批量导入及管理', routerName: 'VipAccountRelatedList'},
								{title: '试销计划套餐退款', routerName: 'VipRefundList'},
								{title: '待邮寄卡管理', routerName: 'VipSendCardPost'},
								{ title: '产品配套发卡', routerName: 'vipSendCardMainForWork' }
								// {title: '部分领取管理', routerName: 'VipWithdrawapplyList'},
								// {title: '团险管理--团单部分领取申请', routerName: 'VipWithdrawapplyAdd'}
							]
						},
						{
							groupName: '综合查询',
							children: [
								{ title: '会员信息变更', routerName: 'VipInfoList' },
								{ title: '管理式保单状态查询', routerName: 'VipCommonSelect' },
								{ title: '送万家销售查询', routerName: 'VipDirectSalesCard' },
								{ title: '送万家保单查询', routerName: 'VipDirectSales' },
								{ title: '会员账户信息查询', routerName: 'VipAccountList' }
								// { title: '会员账户信息查询(新)', routerName: 'VipAccountRelatedNewList' },
								// { title: '会员消费记录查询', routerName: 'VipMoneyFlowSelect' }
							]
						},
						{
							groupName: '产品购买',
							children: [
								{ title: '产品购买申请', routerName: 'VipInsureAdd' },
								{ title: '产品缴费管理', routerName: 'VipInsureList' },
								{ title: '团体产品购买申请', routerName: 'VipInsureAddForCom' },
								{ title: '产品缴费管理分公司', routerName: 'VipInsureListBranch' }
							]
						},
						{
							groupName: '基础数据',
							children: [
								{ title: '产品定义', routerName: 'VipProductList' }
							]
						}
					]
				},
				// 供应商管理
				{
					title: '供应商管理',
					icon: 'mail',
					menuGroup: [
						{
							groupName: '产品网络管理',
							children: [
								{ title: '供应商服务关系维护', routerName: 'SupplierService' },
								{ title: '服务网络查询', routerName: 'NetworkQuery' },
								{ title: '服务网络添加', routerName: 'NetworkAdd' },
								{ title: '服务网络导入', routerName: 'NetworkImport' },
								{ title: '产品网络模板维护', routerName: 'ProductTemplate' }
							]
						},
						{
							groupName: '供应商信息查询',
							children: [
								{ title: '信息查询', routerName: 'SupplierQuery' }
							]
						},
						{
							groupName: '供应商维护管理',
							children: [
								{ title: '代理关系维护', routerName: 'AgentRelation' },
								{ title: '供应商维护', routerName: 'SupplierTabs' },
								{ title: '供应商审核', routerName: 'SupplierVerify' },
								{ title: '供应商合并', routerName: 'SupplierMerges' }
							]
						},
						{
							groupName: '供应商导入管理',
							children: [
								{ title: '供应商导入', routerName: 'SupplierImport' }
							]
						}
					]
				},
				// 健管卡管理
				{
					title: '健管卡管理',
					icon: 'credit-card',
					menuGroup: [
						{ groupName: '健管卡设置',
							children: [
								{ title: '健管卡定义', routerName: 'HealthCard' },
								{ title: '健管卡定义查询', routerName: 'healthCardSttingPage' },
								{ title: '健管卡库存预警', routerName: 'HealthWarning' },
								{ title: '健管卡管理人员联系信息', routerName: 'HealthPersonMail' }
							]
						},
						{ groupName: '健管卡产品配置',
							children: [
								{ title: '健管卡产品关联', routerName: 'HealthCardProduct' },
								{ title: '健管卡产品关联查询', routerName: 'HalthCardUnionSttingPage' }
							]
						},
						{ groupName: '库存管理',
							children: [
								{ title: '健管卡导入入库', routerName: 'HealthImport3rd' },

								{ title: '自定义健管卡生成卡号密码', routerName: 'HealthCardStockGenerate' },
								{ title: '第三方健管卡导入入库', routerName: 'HealthThirdImport' },
								{ title: '健管卡库存查询及领用申请', routerName: 'HealthCardStockQuery' },
								{ title: '健管卡领用审核', routerName: 'HealthCardReceiveApprove' },
								{ title: '健管卡领用查询', routerName: 'HealthCardReceiveQuery' },
								{ title: '健管卡延期', routerName: 'HealthCardContinuePage' },
								{ title: '作废健管卡导入(批量)', routerName: 'HealthImportInvalid' }
							]
						},
						{ groupName: '健管卡查询',
							children: [
								{ title: '健管卡状态查询', routerName: 'HealthCardStatusQuery' },
								{ title: '健管卡明细查询', routerName: 'HealthCardDetailQuery' }
							]
						},
						{ groupName: '健管卡发放(后结算)',
							children: [
								{ title: '健管卡发放', routerName: 'HealthCardSend' },
								{ title: '健管卡售出登记', routerName: 'HealthCardSellRegister' },
								{ title: '健管卡发放审核', routerName: 'HealthCardSellApprove' },
								{ title: '健管卡发放查询', routerName: 'HealthCardSellQuery' }
							]
						}
					]
				},
				// 产品管理
				{
					title: '产品管理',
					icon: 'appstore',
					menuGroup: [
						{
							groupName: '产品信息维护',
							children: [
								{ title: '产品维护查询', routerName: 'ProductMaintain' },
								{ title: '产品审核', routerName: 'ProductExamine' },
								{ title: '产品审批', routerName: 'ProductApproval' }
							]
						},
						// {
						//   groupName: '产品停售管理',
						//   children: [
						//     { title: '产品停售申请', routerName: 'HolidayCheck' },
						//     { title: '产品停售审核', routerName: 'Holiday' },
						//     { title: '产品停售轨迹', routerName: 'HolidayRadio' }
						//   ]
						// },
						{
							groupName: '服务信息维护',
							children: [
								{ title: '服务查询', routerName: 'ServiceQuery' },
								{ title: '服务维护', routerName: 'ServiceMaintain' }
								// { title: '服务组维护', routerName: 'ServicegroupMaintain' },
							]
						}
					]
				},
				// 协议管理
				{
					title: '协议管理',
					icon: 'user',
					menuGroup: [
						{
							groupName: '协议查询',
							children: [
								{ title: '协议查询', routerName: 'serviceAgreementQuery' }
							]
						}
					]
				},
				// 服务实施
				{
					title: '服务实施',
					icon: 'customer-service',
					menuGroup: [
						{ groupName: '标准服务（服务处理及查询）',
							children: [
								{ title: '服务处理及查询', routerName: 'ServeApplyInfo' },
								// { title: '服务处理及查询详情', routerName: 'ServeApplyInfoDetails' },
								{ title: '综合查询', routerName: 'ServeApplyGeneralQuery' },
								{ title: '疑难工单查询', routerName: 'ServeApplyDifQuery' },
								{ title: '标准服务批量导入', routerName: 'ServeApplyNonBatchImport' },
								{ title: '群发短信', routerName: 'ServeApplyMassTextMessage' }
								// { title: '服务协议查询', routerName: 'serviceAgreementQuery' }
							]
						},
						{ groupName: '分公司自营服务录入及查询',
							children: [
								{ title: '自营服务录入', routerName: 'SalaryPerformance' },
								{ title: '自营服务批量导入', routerName: 'SalaryPerformanceImportBranchSelf' },
								{ title: '管家自营服务审核', routerName: 'SalaryPerformancePerformanceAudit' },
								{ title: '自营服务查询', routerName: 'SalaryPerformanceQuery' },
								{ title: '管家自营服务统计', routerName: 'SalaryPerformanceDetails' }
							]
						},
						{ groupName: '分公司每月报送工作量',
							children: [
								{ title: '分公司总服务量报送', routerName: 'ServiceReportedBranch' },
								{ title: '健管中心服务量报送', routerName: 'ServiceReportedHealthCenter' },
								{ title: 'VIP诊疗室服务量报送', routerName: 'ServiceReportedVipConsult' },
								{ title: '集团子公司服务量报送', routerName: 'ServiceReportedGroupSubsidiary' },
								{ title: '分公司报送工作量审核', routerName: 'ServiceReportedBranchWorkloadAudit' },
								{ title: '分公司工作量上报查询', routerName: 'ServiceReportedBranchWorkloadQuery' }
							]
						},
						{ groupName: '健康咨询',
							children: [
								{ title: '健康咨询查询', routerName: 'HealthConsultQuery' },
								{ title: '健康咨询列表', routerName: 'HealthConsultList' }
							]
						},
						// { groupName: '报表管理',
						// 	children: [
						// 		{ title: '服务明细表', routerName: 'ServeApplyReportTrace' },
						// 		{ title: '分公司自营服务统计汇总表', routerName: 'ServeApplyReportServiceStats' },
						// 		{ title: '分公司自营服务工作量统计', routerName: 'ServeApplyReportDayServe' },
						// 		{ title: '分公司自营服务实施机构统计', routerName: 'ServeApplyReportDayPropietary' },
						// 		{ title: '标准服务回访统计', routerName: 'ServeApplyReportReturnVisit' },
						// 		{ title: '第三方询价记录汇总', routerName: 'ServeApplyReportThirdEnquiry' },
						// 		{ title: '第三方询价明细', routerName: 'ServeApplyReportThirdPartyEnquiry' },
						// 		{ title: '健康咨询服务月度统计', routerName: 'ServeApplyReportHealthMonthStats' },
						// 		{ title: '好医保绿通服务实施明细表', routerName: 'ServeApplyReportServiceImplList' }
						// 	]
						// },
						{ groupName: '日常管理',
							children: [
								{ title: '公共问题维护', routerName: 'QuestionnaireManage' },
								{ title: '回访问卷维护', routerName: 'QuestionnaireInfo' }
							]
						},
						{ groupName: '配置管理',
							children: [
								{ title: '短信及邮件配置', routerName: 'ProcessConfigMessControll' },
								{ title: '队列维护', routerName: 'ProcessConfigQueueDefine' },
								{ title: '队列订阅', routerName: 'ProcessConfigQueueOrder' },
								{ title: '服务流程', routerName: 'ProcessConfigServiceProcessConfig' },
								{ title: '管家维护', routerName: 'ProcessConfigBulterStaffManager' },
								{ title: '管家访问第三方预约配置', routerName: 'ProcessConfigBulterAccessConfig' }
							]
						},
						{ groupName: '第三方预约信息查询',
							children: [
								{ title: '第三方预约信息查询', routerName: 'ThirdAppointQuery' }
							]
						}
					]
				},
				// 服务管理-健管中心
				{
					title: '【中心】服务管理',
					icon: 'build',
					menuGroup: [
						{
							groupName: '服务登记',
							children: [
								{ title: '预约查询', routerName: 'yuyue' }
							]
						},
						{
							groupName: '检测/服务',
							children: [
								{ title: '医师|技师服务', routerName: 'yishiservice' },
								{ title: '设备检测', routerName: 'devicedection' },
								{ title: '检测|服务结算', routerName: 'servicesettlement' }
							]
						},
						{
							groupName: '检测报告',
							children: [
								{ title: '打印报告', routerName: 'printreport' }
							]
						}
					]

				},
				// 系统管理-健管中心
				{
					title: '【中心】系统管理',
					icon: 'container',
					menuGroup: [
						{
							groupName: '项目管理',
							children: [
								{ title: '医师|技师管理', routerName: 'doctormanagement' },
								{ title: '体检分部管理', routerName: 'mecinfo' },
								{ title: '服务项目配置', routerName: 'serviceitemconf' },
								{ title: '设备管理', routerName: 'equipment' },
								{ title: '服务项目查询', routerName: 'servicelineenquiry' }
							]
						},
						{
							groupName: '工作计划',
							children: [
								{ title: '排班管理', routerName: 'schedulemanagement' },
								{ title: '排班详情', routerName: 'scheduledetail' }
							]
						}
					]
				},
				// 配置管理-健管中心
				{
					title: '【中心】配置管理',
					icon: 'user',
					menuGroup: [
						{
							groupName: '业务用户管理',
							children: [
								{ title: '设置健管中心', routerName: 'busiusermanage' }
							]
						}
					]
				}
				// 日志管理
				// {
				// 	title: '日志管理',
				// 	icon: 'diff',
				// 	menuGroup: [
				// 		{
				// 			groupName: '日志查询',
				// 			children: [
				// 				{title: '批处理日志查询', routerName: 'logQurey'}
				// 			]
				// 		}
				// 	]
				// }


				// 结算管理
				// {
				// 	title: '结算管理',
				// 	icon: 'user',
				// 	menuGroup: [
				// 		{
				// 			groupName: '供应商结算',
				// 			children: [
				// 				{ title: '结算确认', routerName: 'AccountSure' },
				// 				{ title: '手工结算', routerName: 'AccountHand' }
				// 			]
				// 		}
				// 	]
				// }
			]
		}
	},
	mounted () {
		console.log("router===", this.$router)
	},
	methods: {
		getMenuItem (key) {
		},
		menuClickEvent ({ item, key }) {
			if (isNaN(key)) {
				this.$router.push({
					name: key
				})
			}
		}
	}
}
</script>
