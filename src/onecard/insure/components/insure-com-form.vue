<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px; left: 30px" width="1290px" :title="title" footer="">
      <VipInsureAddForCom ref="vipInsureAddForCom"/>
    </a-modal>
  </div>
</template>
<script>
import VipInsureAddForCom from "../vip-insure-add-for-com"
export default {
	name: 'insure-com-form',
	components: { VipInsureAddForCom },
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
				this.$refs.vipInsureAddForCom.initFormValue(obj)
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
