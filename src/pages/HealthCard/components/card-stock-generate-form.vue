<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
				<a-card style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="home"/> 健管卡生成信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="12">
									<a-form-item label="健管卡代码">
										<HealthCardSelect ref="healthCardSelect" @change="clearProductCode" :allowClear="true" v-decorator="['docDefId', {initialValue: '', rules: [{ required: true, message: '请选择健管卡代码!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="12">
									<a-form-item label="产品代码">
										<HealthProductSelect ref="healthProductSelect" :allowClear="true" :docDefId="dataForm.getFieldValue('docDefId')" v-decorator="['productCode', {initialValue: '', rules: [{ required: true, message: '请选择产品代码!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="12">
									<a-form-item label="生成数量">
										<a-input-number :min="1" :max="999999" v-decorator="['amount', {initialValue: '', rules: [{ required: true, message: '请输入数量!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="12">
									<a-form-item label="生效日期">
										<a-date-picker :disabledDate="disabledStartDate" v-decorator="['statusDate', {initialValue: null, rules: [{ required: true, message: '请选择生效日期!' }]}]" format="YYYY-MM-DD"/>
									</a-form-item>
								</a-col>
								<a-col :span="12">
									<a-form-item label="失效日期">
										<a-date-picker :disabledDate="disabledEndDate" v-decorator="['invalidDate', {initialValue: null, rules: [{ required: true, message: '请选择失效日期!' }]}]" format="YYYY-MM-DD"/>
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">{{submitLoading ? '正在处理···':'保存'}}</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select'
import HealthProductSelect from '@/components/health-card-product-select'
import moment from 'moment'
export default {
	name: 'card-stock-generate-form',
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
		clearProductCode () {
			this.dataForm.resetFields(['productCode'])
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '自定义健管卡生成卡号密码'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({docDefId: ''})
			})
		},
		editForm (docProductId, extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '自定义健管卡生成卡号密码'
			this.isAdd = false
			this.formModal = true
			this.spinning = false
			this.dataForm.resetFields()
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(this.extraParam)
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				if (moment(values.invalidDate).isBefore(values.statusDate)) {
					this.$message.error("失效日期不能早于生效日期")
					return
				}
				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				this.submitLoading = true
				api.custCardGenerateNoPass(data).then(res => {
					if (res === true) {
						this.$message.success('导入成功!')
					} else {
						this.$message.error('导入失败!')
					}
					this.formModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		},
		//不可选日期
		disabledEndDate(current) {
			let startDate = this.dataForm.getFieldValue('statusDate')
			if (startDate != null) {
				return current < startDate + 8.64e7;
			}
		},
		//不可选日期
		disabledStartDate(current) {
			let endDate = this.dataForm.getFieldValue('invalidDate')
			if (endDate != null) {
				return current > endDate - 8.64e7;
			}
		}
	}
}
</script>
<style>

</style>
