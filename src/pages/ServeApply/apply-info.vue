<template>
	<div>
		<a-tabs :defaultActiveKey="1" v-model="activeTab" tabPosition="top">
			<a-tab-pane tab="公共池服务" :key="1">
				<ApplyInfoPublic v-if="activeTab === 1" />
			</a-tab-pane>
			<a-tab-pane tab="个人池服务" :key="2">
				<ApplyInfoSelf v-if="activeTab === 2" />
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script>
import ApplyInfoPublic from "./components/apply-info-public"
import ApplyInfoSelf from "./components/apply-info-self"
export default {
	name: "apply-info",
	components: { ApplyInfoPublic, ApplyInfoSelf },
	data () {
		return {
			activeTab: 1
		}
	},
	mounted () {

	},
	methods: {

	}
}
</script>


