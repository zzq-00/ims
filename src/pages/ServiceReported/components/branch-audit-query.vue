<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="报送年月">
              <a-month-picker v-decorator="['reportedDate',{initialValue: null, rules: [ {required: true, message: '请选择报送年月'} ]}]" format="YYYY-MM" valueFormat="YYYY-MM" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
              <OrgSelect2 dicType="orgCode_4" :disabled="disabledOrgCode" v-decorator="['orgCode',{initialValue: null, rules: [ {required: true, message: '请选择管理机构'}]} ]" :allowClear="true" placeholder="请选择管理机构" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="状态">
							<a-select v-decorator="['status', {initialValue: ''}]" :allowClear="true" @change="searchHandle">
								<a-select-option value="02">待审核</a-select-option>
								<a-select-option value="03">审核通过</a-select-option>
							</a-select>
						</a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
			<a-button :loading="submitLoading" class="editable-add-btn" @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;" @click="resetFilterForm">重置</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="searchHandle">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="profile" /> 查询结果</span>
      <a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
				:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
<!--        <span slot="textVal" slot-scope="text, record">{{text || '-'}}</span>-->
        <template slot="operation" slot-scope="text, record">
        <span v-if="record.status == '03'" style="color:#1890ff;cursor:pointer" @click="deleteRowData(record)">删除</span>
      </template>
      </a-table>

			<a-row :gutter="16">
        <a-col :span="24">
          <a-button type="primary" @click="jump2BranchReport" class="editable-add-btn" style="float:right;margin:10px 0 0 0">添加分公司报送</a-button>
        </a-col>
      </a-row>
    </a-card>

  </a-card>
</template>
<script>
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
import OrgSelect2 from '@/components/org-select2'
import moment from 'moment'
export default {
	components: { DicSelect, OrgSelect2 },
	data () {
		return {
			timesSourece: '01',
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
			submitLoading: false,
			showTable: true,
			disabledOrgCode: false,
			iconType: 'down',
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "报送年月", dataIndex: "reportedDateStr" },
				{ title: "管理机构", dataIndex: "orgCodeDesc", scopedSlots: { customRender: "orgCodeDesc" } },
				{ title: "健康短信", dataIndex: "healthMessage" },
				{ title: "健康咨询", dataIndex: "healthInformation" },
				{ title: "疾病管理", dataIndex: "diseaseControl" },
				{ title: "医疗风险控制", dataIndex: "medicalRiskControl" },
				{ title: "心理健康服务", dataIndex: "mentalHealth" },
				{ title: "其它服务", dataIndex: "otherService" },
				{ title: "其它服务说明", dataIndex: "thumOtherServiceDesc", width: 200 },
				{ title: "状态", dataIndex: "statusDesc" },
				{title: "操作", dataIndex: "operation", scopedSlots: { customRender: 'operation' }}
			],
			pagination: {
				pageSize: 100000,
				current: 1,
				total: 0,
				disabled: true,
				hideOnSinglePage: true,
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
				this.$nextTick(() => {
					this.pagination.current = 1
					this.loadPageData()
				})
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
			query.timesSourece = this.timesSourece
			query.reportedDate = moment(query.reportedDate).format('YYYY-MM')
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)

			this.loading = true
			api.queryBranchWork(data).then(res => {
				console.log(res, "result")
				this.pageData.data = res.data || []
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
			}).finally(() => {
				this.loading = false
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		jump2BranchReport () {
			this.$router.push({
				path: '/ServiceReportedBranch'
			})
		},
		exportRecord () {
			this.submitLoading = true
			this.filterForm.validateFields((error, values) => {
				if (error) {
					this.submitLoading = false
					return
				}
				let query = this.filterForm.getFieldsValue()
				query.timesSourece = this.timesSourece
				query.reportedDate = moment(query.reportedDate).format('YYYY-MM')
				api.exportBranchWork(query).then(res => {
					if (res !== (undefined || '')) {
						this.$downloadFileByBase64(res, `分公司服务人次信息.xlsx`)
					} else {
						this.$message.error('文件下载失败,请重试')
					}
				}).finally(() => {
					this.submitLoading = false
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
					this.disabledOrgCode = true
				} else {
					this.disabledOrgCode = false
				}
				this.filterForm.setFieldsValue({reportedDate: moment(date), orgCode: res.data.orgCode.substr(0, 4)})
			})
		},
		deleteRowData (record) {
			let data = record
			let self = this
			self.$confirm({
				title: '确认提示',
				content: `您确认要删除吗？`,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						api.deleteApprovalBranchServiceReported(data).then(res => {
							if (res.data.flag) {
								self.$message.success('删除成功！')
								self.loadPageData()
							} else {
								self.$message.error('删除失败！')
							}
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		}

	}
}
</script>
