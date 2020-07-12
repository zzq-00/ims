<template>
	<a-card style="padding: 0px;">
		<a-tabs defaultActiveKey="1" v-model="activeKey" tabPosition="top">
			<a-tab-pane tab="分公司服务审核" key="1">
				<BranchAudit />
			</a-tab-pane>
			<a-tab-pane tab="健管中心服务审核" key="2">
				<HealthCenter />
			</a-tab-pane>
			<a-tab-pane tab="VIP诊疗室服务审核" key="3">
				<TreatmentRoom />
			</a-tab-pane>
			<a-tab-pane tab="集团子公司服务审核" key="4">
				<GroupSubsidiary />
			</a-tab-pane>
		</a-tabs>
	</a-card>
</template>
<script>
import BranchAudit from './components/branch-audit'
import HealthCenter from './components/health-center'
import TreatmentRoom from './components/treatment-room'
import GroupSubsidiary from './components/group-subsidiary'
export default {
	name: 'serve-apply-branch-workload-audit',
	components: { BranchAudit, HealthCenter, TreatmentRoom, GroupSubsidiary },
	data () {
		return {
			activeKey: '1'
		}
	},
	mounted () {

	},
	methods: {

	}
}
</script>
<style>
</style>
