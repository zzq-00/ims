<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="800" title="确认缴费">
      <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-spin :spinning="spinning"/>
        <a-row>
          <a-col :span="24">
            <a-form-item label="储值科目">
              <a-select :showSearch="true" v-decorator="['accountCode', {rules: [{ required: true, message: '储值科目不能为空!' }], initialValue: ''}]">
                <a-select-option :disabled="item.disabled" :key="index" :value="item.value" class="spical-disabled-select" v-for="(item, index) in accountCodeList">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-input type="hidden" v-decorator="['id']"/>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-vip'

export default {
	name: 'confirm-form',
	data () {
		return {
			dataFormLayout: {
				labelCol: {span: 5},
				wrapperCol: {span: 15}
			},
			submitLoading: false,
			spinning: false,
			formModal: false,
			accountCodeList: [],
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {
		this.loadAccountCodeList()
	},
	methods: {
		show (obj) {
			this.formModal = true
			this.$nextTick(() => {
				this.dataForm.setFieldsValue({id: obj.id})
			})
		},
		loadAccountCodeList () {
			let self = this
			api.queryAccountCodeList().then(res => {
				self.accountCodeList = []
				if (res.data.length > 0) {
					self.accountCodeList.push({ value: '1', label: '储值科目-开户行名称-收款账户', disabled: true })
					res.data.map(item => {
						self.accountCodeList.push({ value: item.accountcode + '-' + item.bankname + "-" + item.bankaccno, label: item.accountcode + '-' + item.bankname + "-" + item.bankaccno })
					})
				}
			})
		},
		submitForm () {
			let self = this
			self.submitLoading = true
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.submitLoading = false
					self.$message.error('您填写的数据有误或者必填项没填！')
					return
				}
				let formData = Object.assign({}, values)
				let accountCode = this.dataForm.getFieldsValue(['accountCode']).accountCode
				let index = accountCode.indexOf('-')
				formData.accountCode = accountCode.substring(0, index)
				api.StoreValueConfirm(formData).then(res => {
					if (res.status === 0) {
						self.$message.success('缴费确认成功')
						self.$emit('callback')
					} else {
						self.$message.error(res.statusText)
					}
				}).finally(() => {
					self.formModal = false
					self.submitLoading = false
				})
			})
		}
	}
}
</script>
<style>

</style>
