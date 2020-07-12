<template>
  <div>
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
				<a-card style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="home"/> 关联信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="12">
									<a-form-item label="关联编码">
										<a-input :disabled="true" v-decorator="['docProductId', {initialValue: ''}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="12">
									<a-form-item label="健管卡代码">
										<HealthCardSelect @change="changeCard" ref="healthCardSelect" :allowClear="true" :disabled="!isAdd" placeholder="请选择"v-decorator="['docDefId', {rules: [{ required: true, message: '健管卡代码不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="12">
									<a-form-item label="产品代码">
										<HealthProductSelect ref="healthProductSelect" :allowClear="true" :disabled="!isAdd" placeholder="请选择" v-decorator="['productCode', {rules: [{ required: true, message: '产品代码不能为空!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="12">
									<a-form-item label="有效起期">
										<a-date-picker :disabledDate="disabledStartDate" v-decorator="['startDate', {initialValue: null}]" format="YYYY-MM-DD"/>
									</a-form-item>
								</a-col>
								<a-col :span="12">
									<a-form-item label="有效止期">
										<a-date-picker :disabledDate="disabledEndDate" v-decorator="['endDate', {initialValue: null}]" format="YYYY-MM-DD"/>
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
					<a-row>
						<!-- <a-button type="" @click="formModal=false">取消</a-button> -->
						<a-button style="float:right" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
					</a-row>
				</a-card>
			</a-form>
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select'
import HealthProductSelect from '@/components/health-product-select'
import moment from 'moment'
export default {
	name: 'card-product-form',
	components: { DicSelect, HealthCardSelect, HealthProductSelect },
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
			this.modalTitle = '新建健管卡产品关联'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({docDefId: ''})
			})
		},
		editForm (docProductId, extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑健管卡产品关联'
			this.isAdd = false
			this.formModal = true
			this.spinning = false
			this.dataForm.resetFields()
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(this.extraParam)
				if (this.extraParam.startDate) {
					this.dataForm.setFieldsValue({'startDate': moment(this.extraParam.startDate, 'YYYY-MM-DD')})
				}
				if (this.extraParam.endDate) {
					this.dataForm.setFieldsValue({'endDate': moment(this.extraParam.endDate, 'YYYY-MM-DD')})
				}
			})
		},
		getProductName (code) {
			return this.$refs.healthProductSelect.getName(code)
		},
		getProductTitle (code) {
			return code + '-' + this.getProductName(code)
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				data.productName = this.getProductName(data.productCode)
				this.submitLoading = true
				/*if (data.docProductId) {
					api.updateCardProduct([data]).then(res => {
						this.$message.success('保存成功!')
						this.formModal = false
						this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					data.productCode = this.getProductTitle(data.productCode)
					api.saveCardProduct(data).then(res => {
						this.$message.success('保存成功!')
						this.dataForm.setFieldsValue({docProductId: res.data})
						// this.formModal = false
						// this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				}*/
				data.productCode = this.getProductTitle(data.productCode)
				api.saveCardProduct(data).then(res => {
					if(res.status === 0){
						this.$message.success('保存成功!')
						this.dataForm.setFieldsValue({docProductId: res.data})
					}
					// this.formModal = false
					// this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		},
		//不可选日期
		disabledEndDate(current) {
			let startDate = this.dataForm.getFieldValue('startDate')
			if (startDate != null) {
				return current < startDate + 8.64e7;
			}
		},
		//不可选日期
		disabledStartDate(current) {
			let endDate = this.dataForm.getFieldValue('endDate')
			if (endDate != null) {
				return current > endDate - 8.64e7;
			}
		},
		changeCard(){
			this.dataForm.setFieldsValue({docProductId: ''})
		}
	}
}
</script>
<style>

</style>
