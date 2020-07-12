<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
					<a-divider orientation="left"><a-icon type="home"/> 健管卡申请信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="健管卡代码">
										<a-input :disabled="true" v-decorator="['docCode']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡名称">
										<a-input :disabled="true" v-decorator="['docName']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="产品代码">
										<a-input :disabled="true" v-decorator="['productCode']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="产品名称">
										<a-input :disabled="true" v-decorator="['productName']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否虚拟卡">
										<a-input :disabled="true" v-decorator="['isVirtual']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="申请数量">
										<a-input-number :min="0" :max="maxCount()" v-decorator="['applyQuantity', {initialValue: 0, rules: [{ required: true, message: '申请数量不能为空!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="发放机构">
										<HealthCardOrgSelect dicType="healthCardOrgSelect" v-decorator="['thirdOrgCode',{initialValue: '', rules: [{ required: true, message: '请选择发放机构!' }]}]" placeholder="请选择发放机构" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="票面金额">
										<a-input :disabled="true" v-decorator="['price']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="合计金额">
										<a-input :disabled="true" :value="comTotalPrice()" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="14">
									<a-form-item label="领用人代码" :labelCol="{span: 5}">
										<a-input-search placeholder="请输入领用人代码" @search="onSearchReceiver" enterButton="查询" size="default" v-decorator="['receiveCode', {rules: [{ required: true, message: '领用人代码不能为空!' }]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="领用人类型">
										<a-input :disabled="true" v-decorator="['receiveTypeDesc', {rules: [{ required: true, message: '领用人类型不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人姓名">
										<a-input :disabled="true" v-decorator="['receiveName', {rules: [{ required: true, message: '领用人姓名不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人证件类型">
										<a-input :disabled="true" v-decorator="['receiveIdTypeName']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="领用人证件号码">
										<a-input :disabled="true" v-decorator="['receiveIdNo']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人性别">
										<a-input :disabled="true" v-decorator="['receiveGenderName']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人出生日期">
										<a-input :disabled="true" v-decorator="['receiveBirthday']" />
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
		<ModalReceiverSelect ref="modalReceiverSelect" @on-update="updateReceiver" />
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import OrgSelect2 from '@/components/org-select2'
import ModalReceiverSelect from './modal-receiver-select'
import HealthCardOrgSelect from '@/components/health-card-org-select'

export default {
	name: 'card-send-form',
	components: { DicSelect, OrgSelect2, ModalReceiverSelect,HealthCardOrgSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {
				yCount: 0
			},
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
		comTotalPrice () {
			let applyQuantity = this.dataForm.getFieldsValue().applyQuantity
			let price = this.dataForm.getFieldsValue().price
			if (applyQuantity) {
				return parseInt(price) * parseInt(applyQuantity)
			}
			return 0
		},
		maxCount () {
			if (this.extraParam && this.extraParam.yCount) {
				return parseInt(this.extraParam.yCount) + 1
			}

			return 10
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建健管卡申请'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (docCode, extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑健管卡申请'
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
        if (this.extraParam.yCount<values.applyQuantity){
          this.$message.warn('有效库存数小于申请数量，不能保存!')
				  return
        }
        // applyQuantity
        let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				data.totalPrice = this.comTotalPrice()
				this.submitLoading = true
				api.saveCardGrant(data).then(res => {
					this.$message.success('保存成功!')
					this.formModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		},
		onSearchReceiver (keyword) {
			this.$refs.modalReceiverSelect.show(keyword)
		},
		updateReceiver (obj) {
			obj.receiver = obj.receiveName
			Object.assign(this.extraParam, obj)
			delete obj.applyQuantity
			this.dataForm.setFieldsValue(obj)
		}
	}
}
</script>
<style>

</style>
