<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
					<a-divider orientation="left"><a-icon type="home"/> 健管卡预警信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="库存预警数">
										<a-input-number :precision="0" :min="0" v-decorator="['warningQuantity', {rules: [{ required: true, message: '库存预警数不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否预警提示">
										<DicSelect dicType="YES_NO" placeholder="请选择"
										    v-decorator="['isWarning', {rules: [{ required: true, message: '请选择是否预警提示!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'

export default {
	name: 'warning-form',
	components: { DicSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 970,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {

	 },
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建健管卡'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
			})
		},
		editForm (docDefid, extraParam) {
			this.extraParam = extraParam || {}
			this.extraParam.isWarning = this.extraParam.isWarning === '是' ? 'Y' : 'N'
			this.modalTitle = '设置健管卡预警信息'
			this.isAdd = false
			this.formModal = true
			this.spinning = false
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.extraParam)
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign({}, values)
				let data = this.extraParam
				Object.assign(data, formData)
				this.submitLoading = true
				api.saveWarning([data]).then(res => {
					this.$message.success('保存成功!')
					this.formModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		}
	}
}
</script>
<style>

</style>
