<template>
	<a-locale-provider :locale="locale">
		<div id="app">
			<router-view />
		</div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import api from '@/api/api-commission'
export default {
	name: 'App',
	data () {
		return {
			userOrgCode: '',
			locale: zhCN
		}
	},
	created () {
		this.getUserInfo()
	},
	methods: {
		// 获取用户所属管理机构
		getUserInfo () {
			api.getLoginInfo({}).then(res => {
				if (res.status == 0) {
					console.log(res, '获取用户信息')
					this.$store.commit('userOrgCode', res.data.orgCode)
				}
			})
			// .catch(err => {
			// 	console.log(err, 'err')
			// 	this.$store.commit('userOrgCode', err.orgCode)
			// }).finally(() => {
			// 	console.log(this.$store.state.userOrgCode, 'finally-')
			// 	if (!this.$store.state.userOrgCode) {
			// 		this.$store.commit('userOrgCode', '86')
			// 	}
			// })
		}
	}
}
</script>

<style>
	/* html,body,#app{height: 100%;} */
	#app {
		height: 100%;
		background-color: #fff;
	}
</style>
