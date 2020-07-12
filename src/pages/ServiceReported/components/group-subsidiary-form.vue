<template>
	<div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning" />
				<a-card style="margin: 24px;">
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="报送年月">
                    <a-month-picker style="width: 234.16px" v-decorator="['reportedDate',{initialValue: '', rules: [ {required: true, message: '请选择报送年月'} ]}]" format="YYYY-MM" valueFormat="YYYY-MM" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="管理机构">
										<OrgSelect2 dicType="orgCode_4" :disabled="disabledOrgCode" v-decorator="['orgCode',{initialValue: '', rules: [{ required: true, message: '请选择管理机构!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健康档案">
										<a-input v-decorator="['healthFile', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="健康评估">
										<a-input v-decorator="['healthEvaluate', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健康咨询">
										<a-input v-decorator="['healthConsult', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="就医服务">
										<a-input v-decorator="['medicalService', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="健康干预">
										<a-input v-decorator="['healthIntervention', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="远程医疗及第二次诊疗意见">
										<a-input v-decorator="['telMedicine', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健康体检">
										<a-input v-decorator="['healthCheckup', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="健康资讯">
										<a-input v-decorator="['healthInformation', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="中医服务">
										<a-input v-decorator="['chineseMedicine', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="心理健康服务">
										<a-input v-decorator="['mentalHealth', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="健康讲座">
										<a-input v-decorator="['healthLecture', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="医疗风险控制">
										<a-input v-decorator="['medicalRiskControl', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="药品服务">
										<a-input v-decorator="['drugService', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="口腔齿科服务">
										<a-input v-decorator="['dentalService', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="基因检测">
										<a-input v-decorator="['geneDetection', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="其它服务">
										<a-input v-decorator="['otherService', {initialValue: '', rules:[{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<!-- <a-form-item label="其它服务说明">
										<a-textarea v-decorator="['otherServiceDesc', {initialValue: '',rules: [(dataForm.getFieldsValue().otherService == '')?{required: false, message: ''}:{ required: true, message: '请输入其它服务说明!' }]}]" :autosize="{ minRows: 3, maxRows: 5 }" />
									</a-form-item> -->
									<a-form-item label="其它服务说明">
										<a-textarea
										v-decorator="['otherServiceDesc',{initialValue: '', rules: [(dataForm.getFieldsValue().otherService == null||dataForm.getFieldsValue().otherService == '')?{required: false, message: ''}:{ required: true, message: '请输入其它服务说明!' }]}]"
										 :autosize="{ minRows: 3, maxRows: 5 }" />
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
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
import OrgSelect2 from '@/components/org-select2'
import { Promise } from 'q'
import moment from 'moment'

export default {
	name: 'serve-apply-group-subsidiary-form',
	components: { DicSelect, OrgSelect2 },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 1270,
			modalTitle: '',
			defultuserOrgCode: '',
			submitLoading: false,
			formModal: false,
			disabledOrgCode: false,
			dataForm: this.$form.createForm(this),
			reportDateList: []
		}
	},
	mounted () {

	},
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建集团子公司服务量'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
				let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
				this.initTable()
			})
		},
		editForm (serviceTimeId, extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑集团子公司服务量'
			this.isAdd = false
			this.formModal = true
			this.spinning = false
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.extraParam)
				let orgCode = this.dataForm.getFieldValue('orgCode')
				if (orgCode !== '86') {
					this.disabledOrgCode = true
				} else {
					this.disabledOrgCode = false
				}
			})
		},
		validateData (formData) {
		   formData.reportedDate = moment(formData.reportedDate).format('YYYY-MM')
			let data = {
				timesSourece: '02',
				serviceTimesBoList: [formData]
			}
			return new Promise((resolve, reject) => {
				api.saveValidateGroupSubsidiaryServiceReported(data).then(res => {
					resolve(res)
				}).catch((e) => {
					reject(e)
				})
			})
		},
		doSubmit () {

		},
		initTable () {
			let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
			api.getLoginInfo().then(res => {
				if (res.data.orgCode == null) {
					this.$message.error('该用户未配置管理机构,不能进行报送')
				}
				if (res.data.orgCode !== '86') {
					this.defultuserOrgCode = res.data.orgCode
					this.disabledOrgCode = true
				} else {
					this.defultuserOrgCode = res.data.orgCode.substr(0, 4)
					this.disabledOrgCode = false
				}
				this.dataForm.setFieldsValue({reportedDate: moment(date), orgCode: res.data.orgCode.substr(0, 4)})
			})
		},
		checkData (orgCode) {
			let dataFormValues = this.dataForm.getFieldsValue()
			let reportedDate = dataFormValues.reportedDate
			let orgCodeDesc = dataFormValues.orgCodeDesc
			let healthFile = dataFormValues.healthFile
			let healthEvaluate = dataFormValues.healthEvaluate
			let healthConsult = dataFormValues.healthConsult
			let medicalService = dataFormValues.medicalService
			let healthIntervention = dataFormValues.healthIntervention
			let telMedicine = dataFormValues.telMedicine
			let healthCheckup = dataFormValues.healthCheckup
			let healthInformation = dataFormValues.healthInformation
			let chineseMedicine = dataFormValues.chineseMedicine
			let mentalHealth = dataFormValues.mentalHealth
			let healthLecture = dataFormValues.healthLecture
			let medicalRiskControl = dataFormValues.medicalRiskControl
			let drugService = dataFormValues.drugService
			let dentalService = dataFormValues.dentalService
			let geneDetection = dataFormValues.geneDetection
			let otherService = dataFormValues.otherService
			let otherServiceDesc = dataFormValues.otherServiceDesc

			  if ((healthFile == null || healthFile === '') && (healthEvaluate == null || healthEvaluate === '') &&
			(healthConsult == null || healthConsult === '') && (medicalService == null || medicalService === '') &&
			(healthIntervention == null || healthIntervention === '') && (telMedicine == null || telMedicine === '') &&
			(healthCheckup == null || healthCheckup === '') && (healthInformation == null || healthInformation === '') &&
			(chineseMedicine == null || chineseMedicine === '') && (mentalHealth == null || mentalHealth === '') &&
			(healthLecture == null || healthLecture === '') && (medicalRiskControl == null || medicalRiskControl === '') &&
			(drugService == null || drugService === '') && (dentalService == null || dentalService === '') &&
			(geneDetection == null || geneDetection === '') && (otherService == null || otherService === '')) {
				this.$message.error("请至少录入一个服务人次数据!")
				return false
			}

			console.log(orgCode, '管理机构编码')
			console.log(this.defultuserOrgCode, '管理机构编码')
			if (this.defultuserOrgCode === '86' && this.defultuserOrgCode !== orgCode) {
				this.$message.error("总公司不能报送分公司的服务")
				return false
			}
			 return true
		},
		// 提交
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let orgCode = values.orgCode
				if (!this.checkData(orgCode)) {
					return
				}
				let formData = Object.assign(this.extraParam, values)
				let data = {
					auditOper: '',
					orgCodeDataId: [],
					timesSourece: '02',
					type: '0201',
					serviceTimesBoList: [formData]
				}

				let self = this
				let doSubmitFunc = function (orgCodeDateIdData) {
					self.submitLoading = true
					data.orgCodeDataId = orgCodeDateIdData
					api.saveGroupSubsidiaryServiceReported(data).then(res => {
						if (res.status === 0) {
							self.$message.success('操作成功!')
							self.$emit('on-update')
						} else {
							self.$message.error(res.data.message)
						}
						self.formModal = false
					}).finally(() => {
						self.submitLoading = false
					})
				}
				let formData1 = Object.assign(this.extraParam, values)
				this.validateData(formData1).then(res => {
					let validateData = res.data
					if (validateData.flag) {
						doSubmitFunc()
					} else {
						if (validateData.message) {
							self.$message.error(res.data.message)
						} else {
							let orgCodeDateIdData = validateData.orgCodeDateIdData
							self.$confirm({
								title: '确认提示',
								content: validateData.changeData,
								okType: 'danger',
								onOk () {
									doSubmitFunc(orgCodeDateIdData)
								}
							})
						}
					}
				})
			})
		}
	}
}
</script>
<style>
</style>
