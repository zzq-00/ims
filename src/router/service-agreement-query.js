const arr = [
	{
		path: '/serviceAgreementQuery',
		name: 'serviceAgreementQuery',
		meta: {
			title: '服务协议查询'
		},
		component: () => import('@/pages/service-agreement-query/index')
	},
	{
		path: '/serviceAgreement',
		name: 'serviceAgreement',
		meta: {
			title: '服务协议'
		},
		component: () => import('@/pages/service-agreement-query/service-agreement/service-agreement.vue')
	},
	{
		path: '/healthCardSttingPage',
		name: 'healthCardSttingPage',
		meta: {
			title: '健管卡定义查询'
		},
		component: () => import('@/pages/healthCardSttingPage/healthSet.vue')
	},

	{
		path: '/healthCardContinuePage',
		name: 'HealthCardContinuePage',
		meta: {
			title: '健管卡延期'
		},
		component: () => import('@/pages/HealthCard/card-continue-data.vue')
	},
	{
		path: '/healthCardUnionSttingPage',
		name: 'HalthCardUnionSttingPage',
		meta: {
			title: '健管卡产品关联查询'
		},
		component: () => import('@/pages/HealthCard/card-union-query.vue')
	},
	{
		path: '/HalthCardInfoPage',
		name: 'HalthCardInfoPage',
		meta: {
			title: '健管卡详情页面'
		},
		component: () => import('@/pages/HealthCard/cardSetting.vue')
	},
	{
		path: '/HealthConsultInfoPage/:id',
		name: 'HealthConsultInfoPage',
		meta: {
			title: '健康咨询明细查询'
		},
		component: () => import('@/pages/HealthConsult/consult-query-info.vue')
	},
	{
		path: '/HealthConsultInfoPage/HealthConsultResponesPage/:id',
		name: 'HealthConsultResponesPage',
		meta: {
			title: '健康咨询明细查询'
		},
		component: () => import('@/pages/HealthConsult/consult-query-respones.vue')
	},
	{
		path: '/HealthConsultHistory/:id',
		name: 'HealthConsultHistory',
		meta: {
			title: '健康咨询明细查询'
		},
		props: (route) => ({
			thirdNameDesc: route.query.thirdNameDesc
		}),
		component: () => import('@/pages/ThirdAppointment/consult-history.vue')
	}
]
export default arr
