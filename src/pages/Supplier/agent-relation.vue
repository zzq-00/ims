<template>
  <a-card style="padding: 0px;">
    <a-tabs defaultActiveKey="1" v-model="activeKey" tabPosition="top">
      <a-tab-pane tab="关系查询" key="1">
        <RelationQuery @showOrgInfo="showOrgInfo" @getCode="getCode" />
      </a-tab-pane>
      <a-tab-pane tab="关系维护" key="2">
        <RelationMaintain @showOrgInfo="showOrgInfo" @getCode="getCode" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import RelationMaintain from './components/relation-maintain'
import RelationQuery from './components/relation-query'
export default {
	name: 'agent-relation',
	components: { RelationQuery, RelationMaintain },
	data () {
		return {
			activeKey: '1',
			formLayout: 'horizontal',
			pageSize: 20, // 每页显示多少条
			dataCount: 0, // 总条数
			page: 1, // 当前页
			serviceOrg: {},
			supplierData: {},
			showTabSupplier: false,
			showTabRelationalQuery: false,
			sorgCode: undefined,
			pharmacyCode: undefined
		}
	},
	created () {
		// 取出权限串和token，存入data
		console.log(this.$route.query, "============")
		if (this.$route.query.power) this.power = JSON.parse(this.$route.query.power)
		if (this.$route.query.token) this.token = this.$route.query.token
	},
	mounted () { },
	methods: {
		showOrgInfo (param) {
			if (param && param.sorgCode) {
				supApi.queryBaseInfo(param).then(res => {
					this.serviceOrg = res.data.serviceOrg
					if (res.data.isOneselfFlag === 'Y') {
						this.showTabRelationalQuery = true
						this.supplierData = res.data.supplier
					}
					// 根据数据决定展示哪些tab...
					this.showTabRelationalQuery = true
					this.showTabSupplier = true
					this.activeKey = '2'
				})
			} else {
				this.showTabSupplier = true
				this.activeKey = '2'
			}
		},
		// 直接打开或者关闭相关的tab
		showTabs (tabnames, flag, activeTab) {
			tabnames.map(item => {
				this[item] = flag
			})
			if (activeTab) this.activeKey = activeTab
		},
		getCode (obj) {
			if (obj.type === 'sorg') {
				this.sorgCode = obj.code
				this.activeKey = '2'
				console.log(obj, 'getCode', this.activeKey)
			} else {
				this.pharmacyCode = obj.code
			}
		}
	}
}
</script>
<style>
</style>
