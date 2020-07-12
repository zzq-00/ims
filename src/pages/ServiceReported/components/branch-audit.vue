<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="报送年月">
              <a-month-picker v-decorator="['reportedDate',{initialValue: null, rules: [ {required: true, message: '请选择报送年月'} ]}]" format="YYYY-MM" valueFormat="YYYY-MM" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="管理机构">
							<OrgSelect2 dicType="orgCode_4"  :disabled="disabledOrgCode" v-decorator="['orgCode',{initialValue: null} ]" placeholder="请选择管理机构" />
						</a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
						<a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" :disabled="!selectedRows.length" @click="auditRecord">审核</a-button>
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;" @click="resetFilterForm">重置</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="searchHandle">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="profile" /> 待审核任务列表</span>
      <a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
				:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
        <span slot="textVal" slot-scope="text, record">{{text || '-'}}</span>
      </a-table>
    </a-card>

		<WorkAuditModal ref="workAuditModal" :timesSourece="timesSourece" @on-update="loadPageData" />
  </a-card>
</template>
<script>
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
import OrgSelect2 from '@/components/org-select2'
import WorkAuditModal from './work-audit-modal'
import moment from 'moment'

export default {
	components: { DicSelect, OrgSelect2, WorkAuditModal },
	data () {
		return {
			timesSourece: '01',
			curRow: null,
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
			selectedRowKeys: [],
			selectedRows: [],
			loading: false,
			showTable: true,
			disabledOrgCode: false,
			iconType: 'down',
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "报送年月", dataIndex: "reportedDate" },
				{ title: "管理机构", dataIndex: "orgCodeDesc" },
				{ title: "健康短信", dataIndex: "healthMessage" },
				{ title: "健康咨询", dataIndex: "healthInformation" },
				{ title: "疾病管理", dataIndex: "diseaseControl" },
				{ title: "医疗风险控制", dataIndex: "medicalRiskControl" },
				{ title: "心理健康服务", dataIndex: "mentalHealth" },
				{ title: "其它服务", dataIndex: "otherService", scopedSlots: { customRender: "textVal" } },
				{ title: "其它服务说明", dataIndex: "thumOtherServiceDesc", width: 200 }
			],
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
		}
	},
	mounted () {
		this.$nextTick(() => {
			// let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
			// let userOrgCode = this.$store.state.userOrgCode
			// this.filterForm.setFieldsValue({reportedDate: date})
			// this.filterForm.setFieldsValue({orgCode: userOrgCode})
			this.initTable()
			this.searchHandle()
		})
	},
	methods: {
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
		},
		searchHandle () {
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}
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
			this.loadPageData()
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			// let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
			// let userOrgCode = this.$store.state.userOrgCode
			// this.filterForm.setFieldsValue({reportedDate: date})
			// this.filterForm.setFieldsValue({orgCode: userOrgCode})
			this.initTable()
		},
		loadPageData () {
			this.selectedRows = []
			this.selectedRows = []

			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				dataType: 'audit'
			}
			query.timesSourece = this.timesSourece
			query.status = '02'
			query.auditOper = ''
			query.reportedDate = moment(query.reportedDate).format('YYYY-MM')
			data.serviceTimes = JSON.stringify(query)

			this.loading = true
			api.queryGroupSubsidiaryAudit(data).then(res => {
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
		auditRecord () {
			this.$refs.workAuditModal.show({list: this.selectedRows})
		},
		initTable () {
			let date = moment(new Date()).subtract(1, 'months').format('YYYY-MM')
			api.getLoginInfo().then(res => {
				if (res.data.orgCode == null) {
					this.$message.error('该用户未配置管理机构,不能进行报送')
				}
				if (res.data.orgCode !== '86') {
					this.disabledOrgCode = true
				} else {
					this.disabledOrgCode = false
				}
				this.filterForm.setFieldsValue({reportedDate: moment(date), orgCode: res.data.orgCode.substr(0, 4)})
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		}

	}
}
</script>
