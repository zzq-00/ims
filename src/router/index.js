import Vue from "vue"
import Router from "vue-router"
import routeArr from './router-item'
import routeHins from './router-hins'
import routeServiceAgreement from './service-agreement-query.js'
import routerIms from './router-ims' // 服务实施
// import logQureyRoutes from './log'
// import routePay from './router-pay' // 财务收付
// import member from './router-member' // 健管交易-会员管理
// import routerBms from './router-bms' // 健管交易

Vue.use(Router)

let tempObj = {}
let combineRoutes = [...routeArr,...routeHins,...routeServiceAgreement, ...routerIms]

// 按path去重
combineRoutes = combineRoutes.reduce((item, next) => {
	if (!tempObj[next.path]) {
		tempObj[next.path] = true
		item.push(next)
	}
	return item
}, [])


if (process.env.NODE_ENV === 'development') {
	combineRoutes = [
		{
			path: "/",
			name: "_index",
			redirect: "/home"
		},
		{
			path: "/home",
			name: "home",
			component: () => import("@/pages/Home"),
			children: combineRoutes
		}
	]
}

const router = new Router({
	mode: "hash",
	routes: [
		...combineRoutes,
		// 404
		{
			path: '*',
			component: () => import('@/pages/404')
		}
	]
})

router.beforeEach((to, from, next) => {
	document.title = to.meta.title || 'PICCHealth'
	next()
})

export default router
