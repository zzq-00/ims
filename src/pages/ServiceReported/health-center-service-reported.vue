<template>
  <a-card :bordered="false">

    <a-card>
      <span href="#" slot="title" style="float:left;"><a-icon type="profile" /> 健康中心服务量报送列表</span>
      <a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading"
               :row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
        <a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
      <a-row :gutter="16">
        <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
          <a-button type="" :disabled="selectedRows.length === 0" @click="deleteSelected" class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
          <a-button type="primary" :disabled="selectedRows.length === 0" @click="submitSelected" class="editable-add-btn" style="float:right;margin-right:10px;">提交审核</a-button>
        </a-col>
      </a-row>
    </a-card>

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
          <a-col :span="12">
            <a-form-item label="健管中心名称" :labelCol="{span: 5}">
              <a-input-search :readonly="true" v-decorator="[ 'healthCenterName', {initialValue: '', rules: [ {required: true, message: '请选择健管中心'} ]}]"
							@search="onSearchHealthCenter" enterButton="搜索"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="健康短信">
              <a-input placeholder="当月完成此服务人数" v-decorator="[ 'healthMessage', {initialValue: '', rules: [{pattern:new RegExp(/^[0-9]*$/), message: '只能录入非负整数'} ]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="医疗风险控制">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'medicalRiskControl', {initialValue: '', rules: [{pattern:new RegExp(/^[0-9]*$/), message: '只能录入非负整数'} ]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="健康资讯">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'healthInformation', {initialValue: '', rules: [{pattern:new RegExp(/^[0-9]*$/), message: '只能录入非负整数'} ]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="心理健康服务">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'mentalHealth', {initialValue: '', rules: [{pattern:new RegExp(/^[0-9]*$/), message: '只能录入非负整数'} ]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="疾病管理">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'diseaseControl', {initialValue: '', rules: [{pattern:new RegExp(/^[0-9]*$/), message: '只能录入非负整数'} ]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="其它服务">
              <a-input placeholder="当月完成此服务人次" v-decorator="[ 'otherService', {initialValue: '', rules: [{pattern:new RegExp(/^[0-9]*$/), message: '只能录入非负整数'} ]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="其它服务说明" :labelCol="{span: 5}">
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
            <a-button type="primary" :loading="submitLoading" @click="saveAndSubmit" class="editable-add-btn" style="float:right;margin-right:10px;">保存并提交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-modal v-model="formModal" style="top: 30px;" :width="600" title="提示信息">
      <a-form :form="dataForm1" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
        <a-card style="margin: 24px;">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-row>
                <a-col :span="24">
                  <!--<a-form-item label="请选择审核主管">-->
                  <!--<a-select v-decorator="['assessResult', {initialValue: '', rules: [{ required: true, message: '审核结论不能为空!' }]}]">-->
                  <!--<a-select-option value="Y">通过</a-select-option>-->
                  <!--<a-select-option value="N">不通过</a-select-option>-->
                  <!--</a-select>-->
                  <!--</a-form-item>-->

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
        <a-button :loading="submitLoading" type="primary" @click="submitForm">确定</a-button>
      </div>
    </a-modal>


    <ModalHealtheCenterSelect ref="modalHealtheCenterSelect" @on-update="onSelectItem"/>
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import OrgSelect2 from '@/components/org-select2'
import ModalHealtheCenterSelect from './components/modal-health-center-select2'
import LeaderSelect from '@/components/leader-select'
import moment from 'moment'
import apiCommon from '@/api/api-common'

export default {
	name: "serve-apply-center-service",
	components: { DicSelect, OrgSelect2, ModalHealtheCenterSelect, LeaderSelect },
	data () {
		return {
			initFlag: true, //
			timesSourece: '03',
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
			filterForm: this.$form.createForm(this),
			formModal: false,
			dataFormLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			dataForm: this.$form.createForm(this),
			dataForm1: this.$form.createForm(this),
			saveAndSubmitFlag: '0',
			serviceTimeId: '',
			defultuserOrgCode: '',
			healthCenterOrHospitalCode: '',
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
				{ title: "健管中心名称", dataIndex: "healthCenterName" },
				{ title: "健康短信", dataIndex: "healthMessage" },
				{ title: "健康资讯", dataIndex: "healthInformation" },
				{ title: "疾病管理", dataIndex: "diseaseControl" },
				{ title: "医疗风险控制", dataIndex: "medicalRiskControl" },
				{ title: "心理健康服务", dataIndex: "mentalHealth" },
				{ title: "其它服务", dataIndex: "otherService" },
				{ title: "其它服务说明", dataIndex: "otherServiceDesc", width: 300 },
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
		this.searchHandle()
		this.initTable()
	},
	methods: {
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
				// if(this.initFlag) {
				// 	this.dataForm.setFieldsValue({orgCode: userOrgCode})
				// 	this.initFlag = false
				// }
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
				serviceTimes: JSON.stringify({'timesSourece': this.timesSourece}),
				type: '01'
			}
			Object.assign(data, query)
			this.loading = true
			api.queryHealthCenterServiceReported(data).then(res => {
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
		getDocCatName (code) {
			return this.$refs.dicCatCode.getName(code)
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		resetDataForm () {
			let reportedDate = this.dataForm.getFieldValue('reportedDate')
			let orgCode = this.dataForm.getFieldValue('orgCode')
			this.dataForm.resetFields()
			this.dataForm1.resetFields()
			this.serviceTimeId = ''
			this.dataForm.setFieldsValue({reportedDate: reportedDate})
			this.dataForm.setFieldsValue({orgCode: orgCode})
		},
		addRecord () {

		},
		showRecordInfo (obj) {

		},
		onSearchHealthCenter () {
			this.healthCenterOrHospitalCode = ''
			this.$refs.modalHealtheCenterSelect.show()
		},
		onSelectItem (obj) {
			this.dataForm.setFieldsValue({healthCenterName: obj.serverName})
			this.healthCenterOrHospitalCode = obj.serverCode
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
							serviceTimes: JSON.stringify({'timesSourece': '03'}),
							type: '01'
						}
						data.serviceTimesBoList = self.selectedRows
						api.deleteHealthCenterServiceReported(data).then(res => {
							self.$message.success('删除成功')
							self.loadPageData()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		submitSelected () {
			this.saveAndSubmitFlag = '0'
			this.dataForm1.resetFields()
			apiCommon.getLeaderInfo().then(res => {
				console.log(222)
				if (res.data.length > 0) {
					this.formModal = true
				} else {
					this.$message.error('未配置审核主管信息或查询审批主管失败')
					this.formModal = false
				}
			})
		},

		submitForm () {
			this.dataForm1.validateFields((error, values) => {
				if (error) {
					return
				}
				let orgCode = values.orgCode
				if (this.saveAndSubmitFlag === '0') {
					let data = {
						serviceTimes: JSON.stringify({'timesSourece': this.timesSourece}),
						type: '02'
					}
					data.serviceTimesBoList = this.selectedRows
					for (var i = 0; i < this.selectedRows.length; i++) {
						data.serviceTimesBoList[i].auditOper = values.auditOper
					}
					data.timesSourece = '03'

					this.submitLoading = true
					api.submitHealthCenterServiceReported(data).then(res => {
						this.formModal = false
						this.$message.success('提交审核成功')
						this.loadPageData()
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					let auditOper = values.auditOper
					this.dataForm.validateFields((error, dataFormValues) => {
						if (error) {
							return
						}
						let serviceTimeId2 = dataFormValues.serviceTimeId // 点击选中以后 serviceTimeId  不选中为空
						let data = Object.assign({}, dataFormValues)
						data.auditOper = auditOper
						data.timesSourece = '03'
						data.healthCenterOrHospitalCode = this.healthCenterOrHospitalCode
						let self = this
						data.reportedDate = moment(data.reportedDate).format('YYYY-MM')
						// data.serviceTimeId = self.serviceTimeId
						if (self.serviceTimeId) {
							data.serviceTimeId = self.serviceTimeId
						} else {
							data.serviceTimeId = serviceTimeId2
						}
						api.saveAndSubmitHealthCenterServiceReported(data).then(res => {
							this.formModal = false
							self.$message.success('保存并提交成功')
							self.resetDataForm()
							self.loadPageData()
						})
					})
				}
			})
		},

		verifyForm (formData) {
			let data = {
				serviceTimeId: this.dataForm.getFieldValue('serviceTimeId'),
				timesSourece: this.timesSourece,
				orgCode: formData.orgCode,
				reportedDate: moment(formData.reportedDate).format('YYYY-MM'),
				reportedDateStr: moment(formData.reportedDate).format('YYYY-MM'),
				healthCenterName: formData.healthCenterName
			}
			let self = this
			return new Promise((resolve, reject) => {
				api.verifyHealthCenterServiceReported(data).then(res => {
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
											console.log(111)
											if (res.data.length > 0) {
												self.formModal = true
											} else {
												self.$message.error('未配置审核主管信息或查询审批主管失败')
												self.formModal = false
											}
										})
										self.serviceTimeId = ''
										self.serviceTimeId = changeDataId
										console.log(self.serviceTimeId, 'self.serviceTimeId')
									} else {
										let data = Object.assign({}, formData)
										data.timesSourece = '03'
										data.serviceTimeId = changeDataId
										data.healthCenterOrHospitalCode = self.healthCenterOrHospitalCode
										data.reportedDate = moment(data.reportedDate).format('YYYY-MM')
										api.saveHealthCenterServiceReported(data).then(res => {
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
				let orgCode = values.orgCode
				if (!this.checkData(orgCode)) {
					return
				}
				let data = Object.assign({}, values)
				data.timesSourece = '03'
				data.healthCenterOrHospitalCode = this.healthCenterOrHospitalCode
				let self = this
				data.reportedDate = moment(data.reportedDate).format('YYYY-MM')
				this.verifyForm(values).then(() => {
					api.saveHealthCenterServiceReported(data).then(res => {
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
				let orgCode = values.orgCode
				if (!this.checkData(orgCode)) {
					return
				}
				let data = Object.assign({}, values)
				data.timesSourece = '03'
				this.saveAndSubmitFlag = '1'
				data.reportedDate = moment(data.reportedDate).format('YYYY-MM')
				this.verifyForm(values).then(() => {
					apiCommon.getLeaderInfo().then(res => {
						if (res.data.length > 0) {
							this.formModal = true
						} else {
							this.$message.error('未配置审核主管信息或查询审批主管失败')
							this.formModal = false
						}
					})
				})
			})
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
			console.log(this.defultuserOrgCode, '管理机构编码')
			if (this.defultuserOrgCode === '86' && this.defultuserOrgCode !== orgCode) {
				this.$message.error("总公司不能报送分公司的服务")
				return false
			}
			 return true
		}

	}
}
</script>

