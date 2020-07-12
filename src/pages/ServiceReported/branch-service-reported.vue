<template>
  <a-card :bordered="false">

    <a-card>
      <span href="#" slot="title" style="float:left;">
        <a-icon type="profile" /> 分公司总服务量报送列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading"
			:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
        <a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
      <a-row :gutter="16">
        <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
          <a-button type="" :disabled="selectedRows.length === 0" @click="deleteSelected" class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
          <a-button type="primary" :disabled="selectedRows.length === 0" @click="approveBatch" class="editable-add-btn" style="float:right;margin-right:10px;">提交审核</a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-modal v-model="formModal" style="top: 30px;" :width="600" title="选择审批主管">
      <a-form :form="dataForm1" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
        <a-card style="margin: 24px;">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-row>
                <a-col :span="24">
                  <a-form-item label="审批主管">
                    <LeaderSelect dicType="86" :defaultDisplayFirst="true" v-decorator="['auditOper',{initialValue: '', rules: [ {required: true, message: '请选择审批主管'}]} ]" placeholder="请选择审批主管" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
<!--        <a-button v-if="this.button_Flag == 'approve'" :loading="submitLoading" type="primary" @click="submitForm">确定</a-button>-->
<!--        <a-button v-if="this.button_Flag == 'saveAndSubmit'" :loading="submitLoading" type="primary" @click="saveAndSubmit">确定</a-button>-->

        <a-button :loading="submitLoading" type="primary" @click="submitForm">确定</a-button>

      </div>
    </a-modal>
    <a-card style="margin-top:24px;">
      <a-divider orientation="left"><a-icon type="file-search" /> 基本信息</a-divider>
      <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="报送年月">
							<a-month-picker v-decorator="['reportedDate',{initialValue: null, rules: [ {required: true, message: '请选择报送年月'} ]}]" format="YYYY-MM" valueFormat="YYYY-MM" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
							<OrgSelect2 dicType="orgCode_4" :disabled="disabledOrgCode" v-decorator="['orgCode',{initialValue: null, rules: [ {required: true, message: '请选择管理机构'}]} ]" placeholder="请选择管理机构" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="健康短信">
              <a-input placeholder="当月完成此服务人数" v-decorator="[ 'healthMessage', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="医疗风险控制">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'medicalRiskControl', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="健康资讯">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'healthInformation', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="心理健康服务">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'mentalHealth', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="疾病管理">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'diseaseControl', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数!'}]}]"/>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="其他服务">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'otherService', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入非负整数! '}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
				<a-row :gutter="16">
          <a-col :span="20">
            <a-form-item label="其他服务说明" :labelCol="{span: 3}">
              <a-input placeholder="" v-decorator="[ 'otherServiceDesc', {initialValue: '',rules: [(dataForm.getFieldsValue().otherService == '')?{required: false, message: ''}:{ required: true, message: '请输入其它服务说明!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="0">
            <a-form-item label="serviceTimeId" :labelCol="{span: 3}">
              <a-input placeholder="" v-decorator="[ 'serviceTimeId', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="" @click="resetDataForm" class="editable-add-btn" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" :loading="submitLoading" @click="save" class="editable-add-btn" style="float:right;margin-right:10px;">保存</a-button>
            <a-button type="primary" :loading="submitLoading" @click="saveAndSubmitBatch" class="editable-add-btn" style="float:right;margin-right:10px;">保存并提交</a-button>
          </a-col>
        </a-row>
      </a-form>

    </a-card>
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import OrgSelect2 from '@/components/org-select2'
import LeaderSelect from '@/components/leader-select'
import moment from 'moment'
import apiCommon from '@/api/api-common'

export default {
	name: "serve-apply-branch-service",
	components: { DicSelect, OrgSelect2, LeaderSelect },
	data () {
		return {
			value: '',
			form: this.$form.createForm(this, { name: 'coordinated' }),
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			formModal: false,
			button_Flag: '',
			saveAndSubmitData: {},
			filterForm: this.$form.createForm(this),
			dataFormLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			dataForm: this.$form.createForm(this),
			dataForm1: this.$form.createForm(this),
			saveAndSubmitFlag: '0',
			serviceTimeId: '',
			defultuserOrgCode: '',
			submitLoading: false,
			selectedRowKeys: [],
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			disabledOrgCode: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "报送年月", dataIndex: "reportedDateStr" },
				{ title: "机构编码", dataIndex: "orgCodeDesc" },
				{ title: "健康短信", dataIndex: "healthMessage" },
				{ title: "健康资讯", dataIndex: "healthInformation" },
				{ title: "疾病管理", dataIndex: "diseaseControl" },
				{ title: "医疗风险控制", dataIndex: "medicalRiskControl" },
				{ title: "心理健康服务", dataIndex: "mentalHealth" },
				{ title: "其它服务", dataIndex: "otherService" },
				{ title: "其它服务说明", dataIndex: "otherServiceDesc", ellipsis: true, width: 300 },
				{ title: "状态", dataIndex: "statusDesc" },
				{ title: "审核意见", dataIndex: "auditContent" }
			],
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
		}
	},
	mounted () {
		// let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
		// let userOrgCode = this.$store.state.userOrgCode
		// this.dataForm.setFieldsValue({reportedDate: date})
		// this.dataForm.setFieldsValue({orgCode: userOrgCode})
		this.searchHandle()
		this.initTable()
	},
	methods: {
		handleCancel (e) {
			console.log('Clicked cancel button')
			this.visible = false
		},
		submitForm () {
			this.dataForm1.validateFields((error, values) => {
				if (error) {
					return
				}
				if (this.saveAndSubmitFlag === '0') {
					let data = {
						serviceTimes: JSON.stringify({'timesSourece': '01'}),
						type: '02'
					}
					data.serviceTimesBoList = this.selectedRows
					for (var i = 0; i < this.selectedRows.length; i++) {
						data.serviceTimesBoList[i].auditOper = values.auditOper
					}
					data.timesSourece = '01'

					api.submitBranchServiceReported(data).then(res => {
						this.$message.success('提交审核成功')
						this.formModal = false
						this.resetDataForm()
						this.loadPageData()
					})
				} else {
					let dataFormValues = this.dataForm.getFieldsValue()
					let serviceTimeId2 = dataFormValues.serviceTimeId // 点击选中以后 serviceTimeId  不选中为空
					let auditOper = values.auditOper
					let self = this
					let data = Object.assign({}, dataFormValues)
					data.timesSourece = '01'
					data.auditOper = auditOper
					if (self.serviceTimeId) {
						data.serviceTimeId = self.serviceTimeId
					} else {
						data.serviceTimeId = serviceTimeId2
					}
					data.reportedDate = moment(data.reportedDate).format('YYYY-MM')
					api.saveAndSubmitBranchServiceReported(data).then(res => {
						self.$message.success('保存并提交成功')
						this.formModal = false
						self.resetDataForm()
						self.loadPageData()
					})
				}
			})
		},
		approveBatch () {
			this.saveAndSubmitFlag = '0'
			this.dataForm1.resetFields()
			apiCommon.getLeaderInfo().then(res => {
				if (res.data.length > 0) {
					this.formModal = true
				} else {
					this.$message.error('未配置审核主管信息或查询审批主管失败')
					this.formModal = false
				}
			})
		},

		saveAndSubmitBatch () {
			let dataFormValues = this.dataForm.getFieldsValue()
			console.log(dataFormValues.orgCode, '管理机构编码')
			let orgCode = dataFormValues.orgCode
			if (!this.checkData(orgCode)) {
				return
			}
			this.saveAndSubmitFlag = '1'
			this.verifyForm(dataFormValues).then(() => {
				apiCommon.getLeaderInfo().then(res => {
					if (res.data.length > 0) {
						this.formModal = true
					} else {
						this.$message.error('未配置审核主管信息或查询审批主管失败')
						this.formModal = false
					}
				})
			})
		},
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
			let length = selectedRows.length
			if (length >= 1) {
				let recordIndex = selectedRowKeys[length - 1]
				selectedRows.map((item, index) => {
					let json = JSON.parse(JSON.stringify(item))
					if (item.recordIndex === recordIndex) {
						this.dataForm.setFieldsValue(json)
						// 选中后回显默认值(null->'')
						if (json.otherService == null) {
							this.dataForm.setFieldsValue({otherService: ''})
						}
					}
				})
			} else {
				this.resetDataForm()
			}
		},
		searchHandle () {
			this.$nextTick(() => {
				let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
				let userOrgCode = this.$store.state.userOrgCode
				this.dataForm.setFieldsValue({reportedDate: date})
				this.dataForm.setFieldsValue({orgCode: userOrgCode})
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		},
		loadPageData () {
			this.selectedRowKeys = []
			this.selectedRows = []
			this.saveAndSubmitFlag = '0'
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				serviceTimes: JSON.stringify({'timesSourece': '01'}),
				type: '01'
			}
			Object.assign(data, query)
			this.loading = true
			api.queryBranchServiceReported(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.dataForm1. resetFields() 
			this.searchHandle()
		},
		resetDataForm () {
		    let reportedDate = this.dataForm.getFieldValue('reportedDate')
			let orgCode = this.dataForm.getFieldValue('orgCode')
			this.dataForm.resetFields()
			this.dataForm1.resetFields()
			this.dataForm.setFieldsValue({reportedDate: reportedDate})
			this.dataForm.setFieldsValue({orgCode: orgCode})
			this.serviceTimeId = ''
		},
		addRecord () {

		},
		showRecordInfo (obj) {

		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		deleteSelected () {
			let self = this
			this.$confirm({
				title: '确认提示',
				content: `确定删除当前选中的${self.selectedRows.length}项记录吗？`,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						let data = {
							serviceTimes: JSON.stringify({'timesSourece': '01'}),
							type: '01'
						}
						data.serviceTimesBoList = self.selectedRows
						api.deleteBranchServiceReported(data).then(res => {
							self.$message.success('删除成功')
							self.loadPageData()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		verifyForm (formData) {
			let data = {
				serviceTimeId: this.dataForm.getFieldValue('serviceTimeId'),
				timesSourece: '01',
				orgCode: formData.orgCode,
				reportedDate: formData.reportedDate
			}
			// 格式化时间
			data.reportedDate = moment(data.reportedDate).subtract('months').format('YYYY-MM')
			let self = this
			return new Promise((resolve, reject) => {
				api.verifyBranchServiceReported(data).then(res => {
					if (res.data.flag) {
						resolve()
					} else {
						if (res.data.message) {
							self.formModal = false
							self.$message.error(res.data.message)
							reject(res)
						} else {
							let changeDataId = res.data.changeDataId
							let changeData = res.data.changeData
							self.$confirm({
								title: '确认提示',
								content: changeData,
								okType: 'danger',
								onOk () {
									if (self.saveAndSubmitFlag === '1') {
										apiCommon.getLeaderInfo().then(res => {
											if (res.data.length > 0) {
												self.formModal = true
											} else {
												self.$message.error('未配置审核主管信息或查询审批主管失败')
												self.formModal = false
											}
										})
										self.serviceTimeId = changeDataId
									} else {
										let data = Object.assign({}, formData)
										data.timesSourece = '01'
										data.serviceTimeId = changeDataId
										data.reportedDate = moment(data.reportedDate).format('YYYY-MM')
										api.saveBranchServiceReported(data).then(res => {
											if (res.data.flag) {
												self.$message.success('保存成功')
												self.loadPageData()
												self.resetDataForm()
											} else {
												self.$message.error(res.data.message)
											}
										})
									}
								}
							})
						}
					}
				})
			})
		},
		save () {
			this.saveAndSubmitFlag = '0'
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				if (!this.checkData(values.orgCode)) {
					return
				}
				let data = Object.assign({}, values)
				data.timesSourece = '01'
				data.reportedDate = moment(data.reportedDate).format('YYYY-MM')
				let self = this
				this.verifyForm(values).then(() => {
					api.saveBranchServiceReported(data).then(res => {
						self.$message.success('保存成功')
						self.resetDataForm()
						self.loadPageData()
					})
				})
			})
		},
		saveAndSubmit () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let data = Object.assign({}, values)
				data.timesSourece = '01'
				let self = this
				this.verifyForm(values).then(() => {
					api.saveAndSubmitBranchServiceReported(data).then(res => {
						self.$message.success('保存并提交成功')
						self.resetDataForm()
						self.loadPageData()
					})
				})
			})
		},
		initTable () {
			let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
			api.getLoginInfo().then(res => {
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
		// 检验保存或者保存并提交时的数据  orgCode是框的选择的数据
		checkData (orgCode) {
			let dataFormValues = this.dataForm.getFieldsValue()
			let healthMessage = dataFormValues.healthMessage
			let medicalRiskControl = dataFormValues.medicalRiskControl
			let healthInformation = dataFormValues.healthInformation
			let mentalHealth = dataFormValues.mentalHealth
			let diseaseControl = dataFormValues.diseaseControl
			let otherService = dataFormValues.otherService

			 if (healthMessage === '' && medicalRiskControl === '' && healthInformation === '' &&
				mentalHealth === '' && diseaseControl === '' && otherService === '') {
				this.$message.error("请至少录入一个服务人次数据!")
				return false
			}

			console.log(orgCode, '管理机构编码')
			if (this.defultuserOrgCode === '86' && this.defultuserOrgCode !== orgCode) {
				this.$message.error("总公司不能报送分公司的服务")
				return false
			}
			 return true
		}
	}
}
</script>

