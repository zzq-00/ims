// 健康管理中心系统
const hinsRoutes = [
	// // 佣金管理-佣金比例配置
	// {
	// 	path: '/commissionrate',
	// 	name: 'CommissionRate',
	// 	meta: {
	// 		title: '产品佣金比例配置'
	// 	},
	// 	component: () => import('@/pages/CommissionManagement/CommissionRate'),
	// 	children: [{
	// 		path: 'add',
	// 		name: 'CommissionRateAdd',
	// 		component: () => import('@/pages/CommissionManagement/CommissionRateDia/RateAdd')
	// 	},
	// 	{
	// 		path: 'edit',
	// 		name: 'CommissionRateEdit',
	// 		component: () => import('@/pages/CommissionManagement/CommissionRateDia/RateEdit'),
	// 		props: (route) => ({
	// 			k: route.query.k
	// 		})
	// 	}
	// 	]
	// },
	// // 佣金管理-佣金数据管理
	// {
	// 	path: '/commissiondata',
	// 	name: 'CommissionData',
	// 	meta: {
	// 		title: '佣金数据管理'
	// 	},
	// 	component: () => import('@/pages/CommissionManagement/CommissionData')
	// },
	// // 佣金管理-加扣款管理
	// {
	// 	path: '/plusdeduction',
	// 	name: 'PlusDeduction',
	// 	meta: {
	// 		title: '加扣款管理'
	// 	},
	// 	component: () => import('@/pages/CommissionManagement/PlusDeduction')
	// },
	// 预约查询
	{
		path: '/yuyue',
		name: 'yuyue',
		meta: {
			title: '预约查询'
		},
		component: () => import('@/pages/YuYue/index')
	},
	// 医师/技师服务
	{
		path: '/yishiservice',
		name: 'yishiservice',
		meta: {
			title: '医师|技师服务'
		},
		component: () => import('@/pages/YishiService/')
	},
	// 客户管理
	{
		path: '/customermanagement',
		name: 'customermanagement',
		meta: {
			title: '客户管理'
		},
		component: () => import('@/pages/CustomerManagement/')
	},
	// 客户维护
	{
		path: '/customermaintain',
		name: 'customermaintain',
		meta: {
			title: '客户维护'
		},
		component: () => import('@/pages/CustomerMaintain/')
	},
	// 体检分部管理
	{
		path: '/mecinfo',
		name: 'mecinfo',
		meta: {
			title: '体检分部管理'
		},
		component: () => import('@/pages/MecInfo/')
	},
	// 设备管理
	{
		path: '/equipment',
		name: 'equipment',
		meta: {
			title: '设备管理'
		},
		component: () => import('@/pages/Equipment/')
	},
	// 设备检测
	{
		path: '/devicedection/',
		name: 'devicedection',
		meta: {
			title: '设备检测'
		},
		component: () => import('@/pages/DeviceDection/'),
		children: [{
			// 骨密度
			path: 'gmd',
			name: 'gmd',
			component: () => import('@/pages/DeviceDection/GmdModal'),
			props: (route) => ({
				k: route.query.k,
				name: route.query.name,
				sexcode: route.query.sexcode,
				sex: route.query.sex,
				birthday: route.query.birthday,
				idno: route.query.idno,
				phone: route.query.phone,
				physicalno: route.query.physicalno,
				doctor: route.query.doctor,
				conclusion: route.query.conclusion,
				imgname: route.query.imgname
			})
		},
		{
			// 脉象仪器
			path: 'pulse',
			name: 'pulse',
			component: () => import('@/pages/DeviceDection/PulseModal'),
			props: (route) => ({
				k: route.query.k,
				name: route.query.name,
				sexcode: route.query.sexcode,
				sex: route.query.sex,
				birthday: route.query.birthday,
				idno: route.query.idno,
				phone: route.query.phone,
				physicalno: route.query.physicalno,
				doctor: route.query.doctor,
				conclusion: route.query.conclusion
			})
		},
		{
			// 中卫一体机
			path: 'zw',
			name: 'zw',
			component: () => import('@/pages/DeviceDection/ZwModal'),
			props: (route) => ({
				k: route.query.k,
				name: route.query.name,
				sexcode: route.query.sexcode,
				sex: route.query.sex,
				birthday: route.query.birthday,
				idno: route.query.idno,
				phone: route.query.phone,
				physicalno: route.query.physicalno,
				doctor: route.query.doctor,
				conclusion: route.query.conclusion
			})
		},
		{
			// 双佳一体机
			path: 'sj',
			name: 'sj',
			component: () => import('@/pages/DeviceDection/SjModal'),
			props: (route) => ({
				k: route.query.k,
				name: route.query.name,
				sexcode: route.query.sexcode,
				sex: route.query.sex,
				birthday: route.query.birthday,
				idno: route.query.idno,
				phone: route.query.phone,
				physicalno: route.query.physicalno,
				doctor: route.query.doctor,
				conclusion: route.query.conclusion
			})
		}
		]
	},
	// 检测\服务结算
	{
		path: '/servicesettlement',
		name: 'servicesettlement',
		meta: {
			title: '检测|服务结算'
		},
		component: () => import('@/pages/ServiceSettlement/'),
		children: [{
			path: 'infoglance',
			name: 'infoglance',
			component: () => import('@/pages/ServiceSettlement/DetailModal'),
			props: (route) => ({
				k: route.query.k,
				no: route.query.no,
				uname: route.query.uname,
				status: route.query.status,
				bir: route.query.bir
			})
		}]
	},
	// 医师、技师管理
	{
		path: '/doctormanagement',
		name: 'doctormanagement',
		meta: {
			title: '医师|技师管理'
		},
		component: () => import('@/pages/DcotorManagement/'),
		children: [{
			path: 'docbaseinfo',
			name: 'docbaseinfo',
			component: () => import('@/pages/DcotorManagement/AddModal'),
			props: (route) => ({
				k: route.query.k,
				t: route.query.t
			})
		}]
	},
	// 服务项目配置
	{
		path: '/serviceitemconf',
		name: 'serviceitemconf',
		meta: {
			title: '服务项目配置'
		},
		component: () => import('@/pages/ServiceItemConf/')
	},
	// 服务项目查询
	{
		path: '/servicelineenquiry',
		name: 'servicelineenquiry',
		meta: {
			title: '服务项目查询'
		},
		component: () => import('@/pages/ServiceLineEnquiry/')
	},
	// 排班管理
	{
		path: '/schedulemanagement',
		name: 'schedulemanagement',
		meta: {
			title: '排班管理'
		},
		component: () => import('@/pages/ScheduleManagement/')
	},
	// 排班详情
	{
		path: '/scheduledetail',
		name: 'scheduledetail',
		meta: {
			title: '排班详情'
		},
		component: () => import('@/pages/ScheduleDetail/')
	},
	// 打印报告
	{
		path: '/printreport',
		name: 'printreport',
		meta: {
			title: '打印报告'
		},
		component: () => import('@/pages/PrintReport/'),
		children: [{
			path: 'prdetail',
			name: 'prdetail',
			component: () => import('@/pages/PrintReport/DetailModal'),
			props: (route) => ({
				k: route.query.k,
				bir: route.query.bir,
				cus: route.query.cus,
				mec: route.query.mec,
				nam: route.query.name
			})
		}]
	},
	// 登录权限配置-业务用户管理-设置健管中心
	{
		path: '/busiusermanage',
		name: 'busiusermanage',
		meta: {
			title: '业务用户管理'
		},
		component: () => import('@/pages/BusinessUserManagement/'),
		children: [{
			path: 'busiusermec',
			name: 'busiusermec',
			component: () => import('@/pages/BusinessUserManagement/MecModal')
		}]
	}
]

export default hinsRoutes
