<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="报送年月起">
              <a-month-picker v-decorator="['groupReportedStartDate',{initialValue: null, rules: [ {required: true, message: '请选择报送年月'} ]}]" format="YYYY-MM" valueFormat="YYYY-MM" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="报送年月止">
              <a-month-picker v-decorator="['groupReportedEndDate',{initialValue: null, rules: [ {required: true, message: '请选择报送年月'} ]}]" format="YYYY-MM" valueFormat="YYYY-MM" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
							<OrgSelect2 dicType="orgCode_4" :disabled="disabledOrgCode" ref="orgSelect" v-decorator="['orgCode',{initialValue: null} ]" :allowClear="true" @change="searchHandle" placeholder="请选择管理机构" />
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
			<a-button :loading="aloading" type="" class="editable-add-btn" @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;" @click="resetFilterForm">重置</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="searchHandle">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="profile" /> 查询结果</span>
      <a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
				:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
<!--        <span slot="textVal" slot-scope="text, record">{{text || '-'}}</span>-->
        <template slot="operation" slot-scope="text, record">
          <span v-if="record.status == '03'" style="color:#1890ff;cursor:pointer" @click="deleteRowData(record)">删除</span>
        </template>
      </a-table>

			<a-row :gutter="16">
        <a-col :span="24">
          <a-button type="primary" @click="jump2BranchReport" class="editable-add-btn" style="float:right;margin:10px 0 0 0">添加集团内部报送</a-button>
        </a-col>
      </a-row>
    </a-card>
    <DicSelect ref="disselect" v-show="false"/>
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
			timesSourece: '02',
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
			aloading: false,
			showTable: true,
			disabledOrgCode: false,
			iconType: 'down',
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				// { title: "报送年月", dataIndex: "reportedDateStr" },
				{ title: "管理机构", dataIndex: "orgCodeDesc", scopedSlots: { customRender: "orgCodeDesc" } },
				{ title: "合计", dataIndex: "branchTotal" },
				{ title: "健康档案", dataIndex: "healthFile" },
				{ title: "健康评估", dataIndex: "healthEvaluate" },
				{ title: "健康咨询", dataIndex: "healthConsult" },
				{ title: "就医服务", dataIndex: "medicalService" },
				{ title: "健康干预", dataIndex: "healthIntervention" },
				{ title: "远程医疗及第二次诊疗意见", dataIndex: "telMedicine" },
				{ title: "健康体检", dataIndex: "healthCheckup" },
				{ title: "健康资讯", dataIndex: "healthInformation" },
				{ title: "中医服务", dataIndex: "chineseMedicine" },
				{ title: "心理健康服务", dataIndex: "mentalHealth" },
				{ title: "健康讲座", dataIndex: "healthLecture" },
				{ title: "医疗风险控制", dataIndex: "medicalRiskControl" },
				{ title: "药品服务", dataIndex: "drugService" },
				{ title: "口腔齿科服务", dataIndex: "dentalService" },
				{ title: "基因检测", dataIndex: "geneDetection" },
				{ title: "其它服务", dataIndex: "otherService" },
				{ title: "其它服务说明", dataIndex: "thumOtherServiceDesc", width: 150 },
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
			// this.filterForm.setFieldsValue({groupReportedStartDate: date})
			// this.filterForm.setFieldsValue({groupReportedEndDate: date})
			// this.filterForm.setFieldsValue({orgCode: userOrgCode})
			this.initTable()
			let query = this.filterForm.getFieldsValue()
			console.log('query', query)
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
			// this.filterForm.setFieldsValue({groupReportedStartDate: date})
			// this.filterForm.setFieldsValue({groupReportedEndDate: date})
			// this.filterForm.setFieldsValue({orgCode: userOrgCode})
			this.initTable()
		},
		loadPageData () {
			this.selectedRows = []
			this.selectedRows = []

			let query = this.filterForm.getFieldsValue()
			query.timesSourece = this.timesSourece
			query.reportedDate = moment(query.reportedDate).format('YYYY-MM')
			query.groupReportedStartDate = moment(query.groupReportedStartDate).format('YYYY-MM')
			query.groupReportedEndDate = moment(query.groupReportedEndDate).format('YYYY-MM')
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
				path: '/ServiceReportedGroupSubsidiary'
			})
		},
		exportRecord () {
			this.aloading = true
			this.filterForm.validateFields((error, values) => {
				if (error) {
					this.aloading = false
					return
				}
				let query = this.filterForm.getFieldsValue()
				query.reportedDate = moment(query.reportedDate).format('YYYY-MM')
				query.groupReportedStartDate = moment(query.groupReportedStartDate).format('YYYY-MM')
				query.groupReportedEndDate = moment(query.groupReportedEndDate).format('YYYY-MM')
				query.timesSourece = this.timesSourece
       			 console.log(query.orgCode,this.$refs.orgSelect,'-'+this.$refs.orgSelect.getName(query.orgCode),'test')
      			  // debugger
				let startDate = this.$refs.orgSelect.getName(query.orgCode) + query.groupReportedStartDate.split('-').join('.')
				startDate +=query.groupReportedEndDate.substring(4)

				api.exportBranchWork(query).then(res => {
					if (res !== (undefined || '')) {
					    let filename = values.org
						this.$downloadFileByBase64(res, startDate + `集团内部提供服务信息.xlsx`)
					} else {
						this.$message.error('文件下载失败,请重试')
					}
				}).finally(() => {
					this.aloading = false
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
				this.filterForm.setFieldsValue({groupReportedStartDate: moment(date), groupReportedEndDate: moment(date), orgCode: res.data.orgCode.substr(0, 4)})
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
