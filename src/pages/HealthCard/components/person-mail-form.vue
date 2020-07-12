<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
				<a-card style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="home"/> 健管卡管理人联系信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="姓名">
										<a-input v-decorator="['name', {rules: [{ required: true, message: '姓名不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="工号">
										<a-input v-decorator="['staffNo', {initialValue: ''}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="邮箱">
										<a-input v-decorator="['email', {rules: [{ required: true, message: '邮箱不能为空!' },{ type: 'email', message: '邮箱格式不正确!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="手机号">
										<a-input v-decorator="['mobile', {rules: [{ required: true, message: '手机号不能为空!' },{pattern:/^1[3456789]\d{9}$/,  message: '手机号格式不正确!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="有效标志">
										<DicSelect dicType="IS_VALID" placeholder="请选择"
										    v-decorator="['isValid', {rules: [{ required: true, message: '请选择!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
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
	name: 'person-mail-form',
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
			this.modalTitle = '新建信息'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
			})
		},
		editForm (personMailId, extraParam) {
			this.extraParam = JSON.parse(JSON.stringify(extraParam)) || {}
			this.modalTitle = '编辑信息'
			// this.extraParam.isValid = this.extraParam.isValid === '是' ? 'Y' : 'N'
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
				let data = Object.assign(this.extraParam, formData)
				// data.isValid = data.isValid === 'Y' ? '01' : '02'
				this.submitLoading = true
				api.savePersonMail(data).then(res => {
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
