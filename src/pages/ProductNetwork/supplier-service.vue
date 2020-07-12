<template>
  <a-card style="padding: 0px;">
    <a-tabs defaultActiveKey="1" v-model="activeKey" tabPosition="top">
      <a-tab-pane tab="关系查询" key="1">
        <RelationQuery @showMaintain="showMaintain" ref="relationQuery"/>
      </a-tab-pane>
      <a-tab-pane tab="关系维护" key="2">
        <RelationMaintain ref="relationMaintain" @on-update="relationQuery"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import RelationMaintain from './components/relation-maintain'
import RelationQuery from './components/relation-query'
export default {
	name: 'supplierService',
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
			pharmacyCode: undefined,
		}
	},
	created () {

	},
	methods: {
	  showMaintain (obj) {
      let data = {
        supplierServiceCode : obj.supplierServiceCode,
        supplierServiceName : obj.supplierServiceName
      }
	    this.activeKey = '2'
      this.$nextTick(() => {
        this.$refs.relationMaintain.loadRelationData(data)
      })
    },
    relationQuery () {
      this.$nextTick(() => {
        this.$refs.relationQuery.searchHandle()
      })
    }
	}
}
</script>
<style>
</style>
