<template>
  <a-card>
    <CardForm ref="cardForm" />
  </a-card>
</template>
<script>
import CardForm from '@/pages/HealthCard/components/card-form1'
export default {
	name: 'health-card',
	components: {CardForm},
	data () {
		return {
		}
	},
	mounted () {
		let query = this.$route.params
		this.showRecordInfo(query)
	},
	methods: {
		showRecordInfo (obj) {
			this.$nextTick(() => {
				this.$refs.cardForm.editForm(obj)
			})
		}
	},
	created () {

	}
}
</script>
