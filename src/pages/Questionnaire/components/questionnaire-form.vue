<template>
	<div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" style="margin: 10px;" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning" />
				<a-row :gutter="8">
					<a-col :span="12">
						<a-form-item label="问卷名称">
							<a-input v-decorator="['qnrName', {initialValue: '', rules: [{ required: true, message: '问卷名称不能为空!' }]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="问卷编码">
							<a-input v-decorator="['qnrCode', {initialValue: '', rules: [{ required: true, message: '问卷编码不能为空!' }]}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="24">
						<a-form-item label="问卷描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
							<a-textarea v-decorator="['qnrDesc', {initialValue: '', rules: [{ required: true, message: '问卷描述不能为空!' }]}]" :autosize="{ minRows: 4, maxRows: 8 }" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="24">
						<a-form-item label="是否显示客户" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
							<a-radio-group :options="[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]" v-decorator="['displayCustFlag',{initialValue:'Y'}]"/>
						</a-form-item>
					</a-col>
				</a-row>

				<a-row :gutter="8">
					<a-col :span="24">
						<a-form-item label="应用的产品" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
							<ProductSelect ref="productSelect" :allowClear="true" :showSearch="true" @change="onChangeUseProducts" mode="multiple" v-decorator="['useProducts', {initialValue: [], rules: [{ required: true, message: '请选择!' }]}]" />
							<a-input v-show="false"  v-decorator="['useProductsDesc']" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="24">
						<a-form-item label="应用的服务" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
							<ServiceSelect ref="serviceSelect" :allowClear="true" :showSearch="true" @change="onChangeUseServices" mode="multiple" v-decorator="['useServices', {initialValue: [], rules: [{ required: true, message: '请选择!' }]}]" />
							<a-input v-show="false"  v-decorator="['useServicesDesc']" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="12">
						<a-form-item label="所在省">
              <AddressSelect ref="addressSelect0" @change="onChangeProvince" :allowClear="true" dicType="0" v-decorator="['sorgProvinces',{initialValue: ''}]" />
							<a-input v-show="false"  v-decorator="['sorgProvincesDesc']" />
            </a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="所在市">
              <AddressSelect ref="addressSelect1" @change="onChangeCity" :allowClear="true" mode="multiple" :dicType="dataForm.getFieldsValue(['sorgProvinces']).sorgProvinces" v-decorator="['sorgCitys',{initialValue: []}]" />
							<a-input v-show="false"  v-decorator="['sorgCitysDesc']" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="24">
						<a-form-item label="服务机构" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
							<a-input-search :readonly="true" :allowClear="true" v-decorator="['orgCodesDesc', {initialValue: ''}]" enter-button @search="onSearchProvider" />
							<a-input v-show="false"  v-decorator="['orgCodes']" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="24">
						<a-form-item label="供应商机构" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
							<a-input-search :readonly="true" :allowClear="true" v-decorator="['supplierCodesDesc', {initialValue: ''}]" enter-button @search="onSearchSupplier" />
							<a-input v-show="false"  v-decorator="['supplierCodes']" />
						</a-form-item>
					</a-col>
				</a-row>

			</a-form>

			<div slot="footer">
				<a-button :loading="submitLoading" type="primary" @click="editQuestion" >编辑问题</a-button>
				<a-button :loading="submitLoading" type="primary" @click="saveAsDraft">保存为草稿</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">保存并发布</a-button>
				<a-button type="" @click="formModal=false">取消</a-button>
			</div>
		</a-modal>

		<ProviderSelectModal ref="providerSelectModal" selectType="checkbox" @on-update="searchProviderHandle"/>
		<SupplierSelectModal ref="supplierSelectModal" selectType="checkbox" @on-update="searchSupplierHandle"/>
		<QuestionnaireDesignForm ref="questionnaireDesignForm" />
	</div>
</template>
<script>
import api from '@/api/api-questionnaire'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
import ProductSelect from "./product-select"
import ServiceSelect from "./service-select"
import ProviderSelectModal from "./provider-select-modal"
import SupplierSelectModal from "./supplier-select-modal"
import QuestionnaireDesignForm from './questionnaire-design-form'
export default {
	name: 'questionnaire-form',
	components: { DicSelect, AddressSelect, ProductSelect, ServiceSelect, ProviderSelectModal, SupplierSelectModal, QuestionnaireDesignForm },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
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
		onSearchProvider () {
			this.$refs.providerSelectModal.show()
		},
		searchProviderHandle (arr) {
			this.dataForm.setFieldsValue({
				orgCodes: arr.map(item => item.sorgCode).join(','),
				orgCodesDesc: arr.map(item => item.sorgName).join(',')
			})
		},
		onSearchSupplier () {
			this.$refs.supplierSelectModal.show()
		},
		searchSupplierHandle (arr) {
			this.dataForm.setFieldsValue({
				supplierCodesDesc: arr.map(item => item.supplierName).join(','),
				supplierCodes: arr.map(item => item.supplierCode).join(',')
			})
		},
		onChangeUseProducts (val) {
			let arr = this.$refs.productSelect.getNameList(val)
			let name = ''
			if (arr && arr.length) {
				name = arr.map(item => item.name).join(',')
			}
			this.dataForm.setFieldsValue({
				useProductsDesc: name
			})
		},
		onChangeUseServices (val) {
			let arr = this.$refs.serviceSelect.getNameList(val)
			let name = ''
			if (arr && arr.length) {
				name = arr.map(item => item.name).join(',')
			}

			this.dataForm.setFieldsValue({
				useServicesDesc: name
			})
			console.log('dataForm===', this.dataForm.getFieldsValue())
		},
		onChangeProvince (val) {
			let arr = this.$refs.addressSelect0.getNameList(val)
			let name = ''
			if (arr && arr.length) {
				name = arr.map(item => item.label).join(',')
			}

			this.dataForm.setFieldsValue({
				sorgProvincesDesc: name
			})
		},
		onChangeCity (val) {
			let arr = this.$refs.addressSelect1.getNameList(val)
			let name = ''
			if (arr && arr.length) {
				name = arr.map(item => item.label).join(',')
			}

			this.dataForm.setFieldsValue({
				sorgCitysDesc: name
			})
		},
		generateCode () {
			let qnrCode = this.dataForm.getFieldValue('qnrCode')
			if (qnrCode) return
			api.markCodeQnrInfo({}).then(res => {
				this.dataForm.setFieldsValue({
					qnrCode: res.data
				})
			})
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建公共问题'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.generateCode()
			})
		},
		editForm (extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑公共问题'
			this.isAdd = false
			this.formModal = true
			this.dataForm.resetFields()

			this.spinning = true
			let params = {
				id: this.extraParam.qnrInfoId
			}
			api.queryOneQnrInfo(params).then(res => {
				Object.assign(this.extraParam, res.data)
				this.prcessObjectData(this.extraParam)

				this.$nextTick(() => {
					this.dataForm.setFieldsValue(this.extraParam)
				})
			}).finally(() => {
				this.spinning = false
			})
		},
		editQuestion () {
			if (this.extraParam.qnrInfoId) {
				// 直接弹出问题编辑框
				this.$refs.questionnaireDesignForm.show(this.extraParam)
			} else {
				let code = this.dataForm.getFieldValue('qnrCode')
				let self = this
				this.saveAsDraft(false, function () {
					if (!code) return
					api.findOneByCode({code: code}).then(res => {
						let obj = res.data
						self.editForm(obj)

						// 直接弹出问题编辑框
						self.$refs.questionnaireDesignForm.show(obj)
					})
				})
			}
		},
		prcessObjectData (obj) {
			obj.sorgCitys = obj.sorgCitys ? obj.sorgCitys.split(',') : []
			obj.useProducts = obj.useProducts ? obj.useProducts.split(',') : []
			obj.useServices = obj.useServices ? obj.useServices.split(',') : []
		},
		prcessFormData (formData) {
			if (formData.sorgCitys) {
				formData.sorgCitys = formData.sorgCitys.join(',')
			}
			if (formData.useProducts) {
				formData.useProducts = formData.useProducts.join(',')
			}
			if (formData.useServices) {
				formData.useServices = formData.useServices.join(',')
			}
		},
		saveAsDraft (closeModal, callback) {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign(this.extraParam, values)
				formData.status = '02'
				this.prcessFormData(formData)

				let self = this
				self.submitLoading = true
				api.addOrUpdateQnrInfo(formData).then(res => {
					self.$message.success('保存成功!')
					self.formModal = !closeModal
					self.$emit('on-update')

					callback && callback()
				}).finally(() => {
					self.submitLoading = false
				})
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}

				let formData = Object.assign(this.extraParam, values)
				formData.status = '01'
				this.prcessFormData(formData)
				let self = this

				api.checkRepeatTerm(formData).then(res => {
					let arr = res.data

					if (arr && arr.length) {
						self.$confirm({
							title: '确认提示',
							content: `此问卷的匹配条件与 ${arr.join(' ')} 存在冲突，是否继续？`,
							okType: 'danger',
							onOk () {
								self.$confirm({
									title: '确认提示',
									content: `发布后问卷将不能进行编辑，确认发布吗？`,
									okType: 'danger',
									onOk () {
										return new Promise((resolve, reject) => {
											api.addOrUpdateQnrInfo(formData).then(res => {
												self.$message.success('保存成功!')
												self.formModal = false
												self.$emit('on-update')
											}).finally(() => {
												resolve()
											})
										})
									}
								})
							}
						})
					} else {
						self.submitLoading = true
						api.addOrUpdateQnrInfo(formData).then(res => {
							self.$message.success('保存成功!')
							self.formModal = false
							self.$emit('on-update')
						}).finally(() => {
							self.submitLoading = false
						})
					}
				})
			})
		}
	}
}
</script>

