<template>
  <div>
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
				<a-card style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="home"/> 健管卡信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="健管卡代码">
										<a-input v-decorator="['docCode', {rules: [{ required: true, message: '健管卡代码不能为空!' },{validator: checkCHN}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡名称">
										<a-input v-decorator="['docName', {rules: [{ required: true, message: '健管卡名称不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡类型">
										<DicSelect dicType="DOC_CAT_CODE" placeholder="请选择"
										    v-decorator="['docCatCode', {rules: [{ required: true, message: '请选择!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="健管卡类型码">
										<a-input v-decorator="['docTypeCode',{rules: [{validator: checkCHN}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡号码长度">
										<a-input-number :min="1" :precision="0"  v-decorator="['docNoLen', {rules: [{ required: true, message: '健管卡号码长度不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否有价">
										<DicSelect dicType="YES_NO" placeholder="请选择"
										    v-decorator="['isValued', {rules: [{ required: true, message: '请选择!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="是否虚拟卡">
										<DicSelect dicType="YES_NO" placeholder="请选择"
										    v-decorator="['isVirtual', {rules: [{ required: true, message: '请选择!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否有效">
										<DicSelect dicType="YES_NO" placeholder="请选择"
										    v-decorator="['isValid', {rules: [{ required: true, message: '请选择!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="有效截止日期">
										<a-date-picker v-decorator="['invalidDate', {initialValue: null}]" format="YYYY-MM-DD"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="票面金额">
										<a-input-number :min="1" :precision="0" v-decorator="['faceAmount', {rules: [{ required: true, message: '票面金额不能为空!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
				                 <a-button :loading="submitLoading" type="primary" @click="submitForm" style="float:right">保存</a-button>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
			</a-form>
			<div slot="footer">

			</div>
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import moment from 'moment'
export default {
	name: 'card-form',
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
			modalWidth: 1170,
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
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (docDefId, extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑健管卡'
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
				if (values.invalidDate === null) {
					values.invalidDate = '9999-12-30'
				}
				values.invalidDate = moment(values.invalidDate).format('YYYY-MM-DD HH:mm:ss')
				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				this.submitLoading = true
				if (data.docDefId) {
					api.updateCard([data]).then(res => {
						this.$message.success('保存成功!')
	                 this.$nextTick(() => {
				     this.dataForm.resetFields()
						})
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					api.saveCard(data).then(res => {
						this.$message.success('保存成功!')
						  this.$nextTick(() => {
				      this.dataForm.resetFields()
						})
					}).finally(() => {
						this.submitLoading = false
					})
				}
			})
		},
		checkCHN (rule, value, callback) {
			const chnRegex = new RegExp("[\\u4E00-\\u9FFF]+", "g")
			if (chnRegex.test(value)) {
				callback('不能为中文！')
			}
			// Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
			callback()
		}
	}
}
</script>
<style>

</style>
