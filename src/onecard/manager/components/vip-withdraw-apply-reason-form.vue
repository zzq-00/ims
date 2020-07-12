<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="800" title="部分领取失败"  :destroyOnClose=true>
      <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-spin :spinning="spinning"/>
        <a-row>
          <a-col :span="24">
            <a-form-item label="失败原因">
              <DicSelect dicType="VIP_FAIL_REASON"  v-decorator="[ 'failreasoncode',{initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item :wrapperCol="{span: 15, offset: 5}">
              <a-input  :disabled="parseInt(dataForm.getFieldValue('failreasoncode')) === 2" type="textarea" v-decorator="['failreason',{initialValue: ''}]"  />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitForm">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'

export default {
	name: 'vip-withdraw-apply-reason-form',
	components: {DicSelect},
	data () {
		return {
			dataFormLayout: {
				labelCol: {span: 5},
				wrapperCol: {span: 15}
			},
			submitLoading: false,
			spinning: false,
			formModal: false,
			importData: [],
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {

	},
	methods: {
		show (obj) {
			this.formModal = true
			this.importData = obj
		},
		submitForm () {
			this.submitLoading = true
			let self = this
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.submitLoading = false
					return
				}
				let data = {}
				data.status = 3
				data.failreasoncode = self.dataForm.getFieldValue('failreasoncode')
				data.failreason = self.dataForm.getFieldValue('failreason')
				data.list = self.importData
				api.updateStatusVipWithDrawApply(data).then(res => {
					if (res.status === 0) {
						self.$message.success('保存成功')
						self.$emit('callback')
					} else {
						self.$message.error(res.statusText)
					}
				}).finally(() => {
					self.formModal = false
					this.submitLoading = false
				})
			})
		}
	}
}
</script>
<style>

</style>
