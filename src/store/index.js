/**
 * store of vuex
 */

import Vue from "vue"
import Vuex from "vuex"
import menu from "./modules/menu"
import hinsSelect from './hins/hinsSelect'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)

// use modules
const store = new Vuex.Store({
	modules: {
		menu,
		hins: hinsSelect
	},
	state: {
		userOrgCode: '',
		pageUrl: "http://www.baidu.com",
		showType: "router",
		ActionStr: [],
		token: '',
		systemData: [
			{
				module_name: '模块管理',
				toUrl: '/module'
			},
			{
				module_name: '角色管理',
				toUrl: '/role'
			},
			{
				module_name: '机构管理',
				toUrl: '/organManage'
			},
			{
				module_name: '用户管理',
				toUrl: '/userManage'
			}, {
				module_name: '职位管理',
				toUrl: '/postManage'
			}
		],
		menuData: [
			{
				module_name: "指标1",
				id: "asacdfdtg",
				children: [
					{
						parentID: 'asacdfdtg',
						module_name: "指标机构维护1",
						childrenID: "7841",
						toUrl: "http://www.baidu.com"
					}
				]
			},
			{
				module_name: "指标2",
				id: "cxcxcxc",
				children: [
					{
						parentID: 'cxcxcxc',
						module_name: "指标机构维护2",
						childrenID: "5632",
						toUrl: "http://fanyi.baidu.com/"
					}
				]
			},
			{
				module_name: "指标3",
				id: "vcvcvcvc",
				children: [
					{
						parentID: 'vcvcvcvc',
						module_name: "指标机构维护3",
						childrenID: "1215",
						toUrl: "https://www.zhihu.com/"
					},
					{
						parentID: 'vcvcvcvc',
						module_name: "指标机构维护33",
						childrenID: "9872",
						toUrl: "https://www.zhihu.com/"
					},
					{
						parentID: 'vcvcvcvc',
						module_name: "指标机构维护333",
						childrenID: "766",
						toUrl: "https://www.zhihu.com/"
					},
					{
						parentID: 'vcvcvcvc',
						module_name: "指标机构维护3333",
						childrenID: "2345",
						toUrl: "https://www.zhihu.com/"
					}

				]
			},
			{
				module_name: "指标4",
				id: "asadxcx",
				toUrl: "https://www.zhihu.com/"
			}
		],
		selectData: [],
		systemClassB: {
			module_name: "模块管理",
			toUrl: "/module"
		}
	},
	mutations: {
		userOrgCode (state, OrgCode) {
			state.userOrgCode = OrgCode
		},
		updateState (state, pageUrl) {
			state.pageUrl = pageUrl
		},
		updateShowType (state, showType) {
			state.showType = showType
		},
		updateMenu (modules, newMenu) {
		  console.log(modules, 'modules')
			modules.menuData = newMenu
		},
		updateToken (state, token) {
			state.token = token
		},
		updateActionStr (state, ActionStr) {
			state.ActionStr = ActionStr
		},
		updateSelectData (state, selectData) {
			state.selectData = selectData
		},
		updateSystemClassB (state, systemClassB) {
			state.systemClassB = systemClassB
		}
	},
	plugins: [createPersistedState({
	  storage: window.sessionStorage
	})]
})

export default store
