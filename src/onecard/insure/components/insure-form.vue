<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px; left: 30px" width="1240px" :title="title" footer="" >
      <VipInsureAdd ref="vipInsureAdd"/>
    </a-modal>
  </div>
</template>
<script>
import VipInsureAdd from "../vip-insure-add"
export default {
	name: 'insure-form',
	components: { VipInsureAdd },
	data () {
		return {
			formModal: false,
			title: ''
		}
	},
	mounted () {

	},
	methods: {
		show (obj) {
			this.formModal = true
			this.title = obj.title || '编辑'
			this.$nextTick(() => {
				this.$refs.vipInsureAdd.initFormValue(obj)
			})
		},
		hidden () {
			this.formModal = false
		}
	}
}
</script>
<style>

</style>
