<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="管理机构">
							<OrgSelect2 dicType="orgCode_4" v-decorator="['orgCode',{initialValue: ''}]" @change="searchHandle" placeholder="请选择机构" />
						</a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管家工号">
              <a-input placeholder="" v-decorator="['staffNo', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管家姓名">
              <a-input placeholder="" v-decorator="['staffName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="客户类型">
							<a-select :allowClear="true" @change="searchHandle" v-decorator="['customerType', {initialValue: ''}]">
								<a-select-option value="01">个人</a-select-option>
								<a-select-option value="02">团体</a-select-option>
							</a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务起期">
              <a-date-picker v-decorator="['serveBeginTime', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务止期">
              <a-date-picker  v-decorator="['serveEndDate', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
						<a-button type="" class="editable-add-btn" :disabled="selectedRows.length === 0" @click="approveBatch" style="float:right;margin-right:10px;">审核</a-button>
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="search" /> 待审核任务公共池</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'calc(2400px + 50%)'}" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading"
               :row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
<!--        <a slot="textVal" slot-scope="text, record">{{ text || '-' }}</a>-->
        <a slot="staffName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
    </a-card>

		<a-modal v-model="formModal" style="top: 30px;" :width="600" title="审核信息">
			<a-form :form="dataForm" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
				<a-card style="margin-top:24px;">
				<a-divider orientation="left"><a-icon type="audit" /> 审核信息</a-divider>
					<a-form-item label="审核结论">
						<a-select v-decorator="['status', {initialValue: '', rules: [{ required: true, message: '审核结论不能为空!' }]}]">
							<a-select-option value="03">通过</a-select-option>
							<a-select-option value="04">不通过</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="审核意见">
						<a-textarea placeholder="审核退回，审批意见必录	" v-decorator="['auditContent']" :autoSize="{ minRows: 3, maxRows: 5 }" />
					</a-form-item>
					<!--<a-form-item :wrapper-col="{ span: 11, offset: 5 }">-->
						<!--<a-row :gutter="16">-->
							<!--<a-col :span="24" style="margin:10px 0 0 0;text-align:right">-->
								<!--<a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;">提交</a-button>-->
							<!--</a-col>-->
						<!--</a-row>-->
					<!--</a-form-item>-->
				</a-card>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">确定</a-button>
			</div>
    </a-modal>
    <PerformanceAuditForm ref="performanceAuditForm"/>
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import OrgSelect2 from '@/components/org-select2'
import PerformanceAuditForm from '@/pages/SalaryPerformance/components/performance-audit-form'
import moment from 'moment'
export default {
	name: "serve-apply-performance-audit",
	components: { DicSelect, OrgSelect2, PerformanceAuditForm },
	data () {
		return {
			value: '',
			form: this.$form.createForm(this, { name: 'coordinated' }),
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			showTable: true,
			iconType: "down",
			formModal: false,
			dataForm: this.$form.createForm(this),
			submitLoading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "服务日期", dataIndex: "serveTime" },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "管家工号", dataIndex: "staffNo" },
				{ title: "管家姓名", dataIndex: "staffName", scopedSlots: { customRender: "staffName" }	},
				{ title: "服务实施机构", dataIndex: "serviceExecuteOrgStr" },
				{ title: "健管中心/VIP诊疗室名称", dataIndex: "vipSeverName" },
				{ title: "客户类型", dataIndex: "customerTypeStr" },
				{ title: "客户姓名", dataIndex: "customeName" },
				{ title: "客户性别", dataIndex: "customeSexStr" },
				{ title: "客户证件类型", dataIndex: "customeCertTypeDesc" },
				{ title: "客户证件号码", dataIndex: "customeCertNum" },
				{ title: "出生日期", dataIndex: "borthTimeStr" },
				{ title: "团体客户名称", dataIndex: "teamName" },
				{ title: "团体客户人数", dataIndex: "teamNum" },
				{ title: "服务项目", dataIndex: "serveItemDesc" },
				{ title: "服务细类", dataIndex: "serveItemSub" },
				{ title: "服务数量", dataIndex: "serveCount" },
				{ title: "服务单位", dataIndex: "serveUnitDesc" },
				{ title: "客户人数", dataIndex: "customerNum" },
				{ title: "联系电话", dataIndex: "custTel" },
				{ title: "客户来源", dataIndex: "custChannelDesc" },
				{ title: "服务机构/预约医院", dataIndex: "serviceProvider" },
				{ title: "操作日期", dataIndex: "updateTime" },
				{ title: "状态", dataIndex: "statusStr" },
				{ title: "备注", dataIndex: "remarkdesc" }

			],
			// rowSelection: {
			// 	type: 'radio',
			// 	onChange: (selectedRowKeys, selectedRows) => {
			// 		this.selectedRows = selectedRows
			// 	}
			// },
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
	},
	methods: {
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
		},
		onChange (date, dateString) {
			console.log(date, dateString)
		},
		searchHandle () {
			this.$nextTick(() => {
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
			let query = this.filterForm.getFieldsValue()
			query.serveBeginTime = query.serveBeginTime ? moment(query.serveBeginTime).format("YYYY-MM-DD"):null
			query.serveEndDate = query.serveEndDate ? moment(query.serveEndDate).format("YYYY-MM-DD") : null
			var data1 = {status: '02'}
			Object.assign(query, data1)
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				statusType: '02'
			}

			data.ServeSearchBo = JSON.stringify(query)
			this.loading = true
			api.queryPerformanceAudit(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
					item.updateTime = moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss")
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
		addRecord () {

		},
		showRecordInfo (obj) {
		  this.$refs.performanceAuditForm.initForm(obj)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		approveBatch () {
			this.dataForm.resetFields()
			this.formModal = true
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				if (values.status === '04' && (values.auditContent === null || values.auditContent === '' || values.auditContent === undefined)) {
					this.$message.error("审核退回时,请输入审核意见!")
					return
				}
				let customerList = []
				this.selectedRows.forEach((item, index) => {
					let customer = {}
					customer.customeNo = item.customeNo
					customerList.push(customer)
				})
				let param = {
					customerList: customerList,
					status: values.status,
					auditContent: values.auditContent,
					hadleType: '03'
				}
				Object.assign(param, values)
				console.log(param, 'param')
				this.submitLoading = true
				api.submitPerformanceAudit(param).then(res => {
				  console.log(res, 'res')
					let code = res.data.code
					if (code === '00') {
						this.$message.success("审核成功！")
						this.formModal = false
						this.searchHandle()
					} else if (code === '01') {
						this.$message.error(res.msg)
					} else {
						this.$message.error('审核失败')
					}
				}).finally(() => {
					this.submitLoading = false
				})
			})
		}
	}
}
</script>

