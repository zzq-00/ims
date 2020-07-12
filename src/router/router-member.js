const memberRoutes = [{
	path: "/userManage",
	name: "userManage",
	meta: {
		pathName: "/userManage"
	},
	component: () =>
            import("@/pages/User/UserManage")
},
	// 积分项目管理
{
	path: '/manage',
	name: 'manage',
	meta: {
		title: '积分项目管理'
	},
	component: () =>
            import('@/pages/Member/manage')
},
	// 积分发放批量导入
{
	path: '/bulkImport',
	name: 'bulkImport',
	meta: {
		title: '积分发放批量导入'
	},
	component: () =>
            import('@/pages/Member/bulkImport')
},

	// 积分发放
{
	path: '/grant',
	name: 'grant',
	meta: {
		title: '积分发放'
	},
	component: () =>
            import('@/pages/Member/grant')
},
	// 积分核销
{
	path: '/cancel',
	name: 'cancel',
	meta: {
		title: '积分核销'
	},
	component: () =>
            import('@/pages/Member/cancel')
},
	// 积分发放查询
{
	path: '/queryQuery',
	name: 'queryQuery',
	meta: {
		title: '积分发放查询'
	},
	component: () =>
            import('@/pages/Member/queryQuery')
},
	// 积分执行情况查询
{
	path: '/executeQuery',
	name: 'executeQuery',
	meta: {
		title: '积分执行情况查询'
	},
	component: () =>
            import('@/pages/Member/executeQuery')
}

]
export default memberRoutes
