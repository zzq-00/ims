
const payRoutes = [
	// 财务收费
	{
		path: '/received',
		name: 'received',
		meta: {
			title: '财务收费'
		},
		component: () => import('@/pages/PayAndReceiving/received')
	},
	// 财务付费
	{
		path: '/pay',
		name: 'pay',
		meta: {
			title: '财务付费'
		},
		component: () => import('@/pages/PayAndReceiving/pay')
	},
	// 查询
	{
		path: '/select',
		name: 'select',
		meta: {
			title: '收付费信息查询'
		},
		component: () => import('@/pages/PayAndReceiving/select')
	}
]

export default payRoutes
