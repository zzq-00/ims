// import { getUserInfo } from '../../network'

export default {
	state: {
		menuCollapsed: true,
		userInfo: {},
		sysPermission: true,
		permissions: {},
		menu: []
	},
	mutations: {
		toggleMenu (state) {
			state.menuCollapsed = !state.menuCollapsed;
		},
		updateMenu (state, data) {
			let hasProblem = false;
			let hasStatics = false;
			let menus = [];
			data.forEach((ele) => {
				if (ele.menuCode == 'problems_all' || ele.menuCode == 'problems_todo' || ele.menuCode == 'problems_done') {
					hasProblem = true;
				}
				if (ele.menuCode == 'problems_deptCount' || ele.menuCode == 'problems_deptstate' || ele.menuCode == 'problems_count' || ele.menuCode == 'problems_state') {
					hasStatics = true;
				}
			});
			console.log(hasProblem, hasStatics);
			if (hasProblem) {
				menus.push({
					text: '问题管理',
					icon: 'el-icon-menu',
					children: []
				});
			}
			if (hasStatics) {
				menus.push({
					text: '数据报告',
					icon: 'el-icon-menu',
					children: []
				});
			}
			data.forEach((ele) => {
				if (ele.menuCode == 'problems_all') {
					menus[0].children.push({
						text: '问题池',
						icon: '',
						route: {
							name: 'problem-pool'
						}
					});
				} else if (ele.menuCode == 'problems_todo') {
					menus[0].children.push({
						text: '待我处理',
						icon: '',
						route: {
							name: 'problem-todo'
						}
					});
				} else if (ele.menuCode == 'problems_done') {
					menus[0].children.push({
						text: '我已处理',
						icon: '',
						route: {
							name: 'problem-done'
						}
					});
				} else if (ele.menuCode == 'problems_deptCount' || ele.menuCode == 'problems_count') {
					let index = menus.length - 1;
					menus[index].children.push({
						text: '数据统计',
						icon: '',
						route: {
							name: 'data-statistics'
						}
					});
				} else if (ele.menuCode == 'problems_deptstate' || ele.menuCode == 'problems_state') {
					let index = menus.length - 1;
					menus[index].children.push({
						text: '部门情况',
						icon: '',
						route: {
							name: 'dept-statistics'
						}
					});
				}
			});
			// if()
			state.menu = menus;
		},
		updateUserInfo (state, data) {
			state.userInfo = {
				deptId: data.deptId,
				roles: data.roles,
				roleNames: data.roleNames,
				userName: data.userName,
				email: data.email
			};
			let permissions = {};
			(data.menus || []).forEach((x) => {
				x.menuCode && (permissions[x.menuCode] = x);
			});
			state.permissions = permissions;
		}
	},
	actions: {
		toggleMenu ({ commit }) {
			commit('toggleMenu');
		}
		// loadUserInfo({ commit }) {
		//     return getUserInfo().then((response) => {
		//         commit('updateUserInfo', response.data.data || {})
		//         commit('updateMenu', response.data.data.menus || {})
		//     })
		// },
	},
	getters: {
		menuCollapsed: state => state.menuCollapsed,
		userInfo: state => state.userInfo,
		sysPermission: state => state.sysPermission,
		permissions: state => state.permissions,
		menu: state => state.menu
	}

};
