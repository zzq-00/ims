<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="管理机构">
							<OrgSelect2 dicType="86"  @change="searchHandle" v-decorator="['orgCode',{initialValue: ''}]" placeholder="请选择管理机构" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="部门">
							<a-input v-decorator="['budgetDeptCode', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="健管卡代码">
							<HealthCardSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docDefId', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="产品代码">
							<HealthProductSelect ref="healthProductSelect" :allowClear="true" @change="searchHandle" v-decorator="['productCode', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="申请日期起期">
							<a-date-picker v-decorator="['startDate', {initialValue: null}]" format="YYYY-MM-DD"/>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="申请日期止期">
							<a-date-picker v-decorator="['endDate', {initialValue: null}]" format="YYYY-MM-DD"/>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="审核状态">
							<DicSelect dicType="DOC_APPLY_STATUS" @change="searchHandle" placeholder="请选择" v-decorator="['status']" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="项目名称">
							<BudgetItemSelect ref="budgetItemSelect" :allowClear="true" @change="searchHandle" v-decorator="['budgetItemCode', {initialValue: ''}]" />
						</a-form-item>
					</a-col>

				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button
							type=""
							class="editable-add-btn"
							:loading="submitLoading2"
							@click="exportAll(selectedRows[0])"
							:disabled="disabledExport"
							style="float:right;margin-right:10px;">导出</a-button>
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">
				<a-icon type="bank" /> 健管卡领用查询</span>
			<a href="#" slot="extra">
				<a-icon :type="iconType" @click="swithTableShow" />
			</a>
			<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
				<span slot="text" slot-scope="text, record" >{{text || '-'}}</span>
			</a-table>
		</a-card>
	</a-card>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select'
import HealthProductSelect from '@/components/health-product-select'
import BudgetItemSelect from '@/components/budget-item-select'
import OrgSelect2 from '@/components/org-select2'
import { Promise } from 'q'
export default {
	name: 'health-receive-query',
	components: { DicSelect, HealthCardSelect, HealthProductSelect, OrgSelect2, BudgetItemSelect },
	data () {
		return {
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
			loading: false,
			submitLoading: false,
			submitLoading2: false,
			showTable: true,
			iconType: 'down',
			columns: [
				{
					align: "left",
					title: "管理机构",
					dataIndex: "orgCode"
				},
				{
					align: "left",
					title: "部门",
					dataIndex: "deptCode"
				},
				{
					align: "left",
					title: "健管卡代码",
					dataIndex: "docCode"
				},
				{
					align: "left",
					title: "健管卡名称",
					dataIndex: "docName"
				},
				{
					align: "left",
					title: "产品代码",
					dataIndex: "productCode"
				},
				{
					align: "left",
					title: "产品名称",
					dataIndex: "productName"
				},
				{
					align: "left",
					title: "项目名称",
					dataIndex: "budgetItemName"
				},
				{
					align: "left",
					title: "申请数量",
					dataIndex: "applyQuantity"
				},
				{
					align: "left",
					title: "实际金额",
					dataIndex: "actualAmount",
					scopedSlots: { customRender: 'text' }
				},
				{
					align: "left",
					title: "申请日期",
					dataIndex: "inputDate"
				},
				{
					align: "left",
					title: "领用人姓名",
					dataIndex: "receiver"
				},
				{
					align: "left",
					title: "领用人类型",
					dataIndex: "receiveTypeStr",
					scopedSlots: { customRender: 'text' }
				},
				{
					align: "left",
					title: "领用人代码",
					dataIndex: "receiveCode",
					scopedSlots: { customRender: 'text' }
				},
				{
					align: "left",
					title: "审核结论",
					dataIndex: "status"
				},
				{
					align: "left",
					title: "结论说明",
					dataIndex: "conclusion",
					scopedSlots: { customRender: 'text' }
				},
				{
					align: "left",
					title: "健管卡起始号",
					dataIndex: "startCardNo"
				},
				{
					align: "left",
					title: "健管卡终止号",
					dataIndex: "endCardNo"
				}
			],
			rowSelection: {
				type: 'radio',
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
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
	computed: {
		disabledExport () {
			return this.selectedRows.length === 0 || this.selectedRows[0].status !== '审核通过'
		}
	},
	mounted () {
		this.searchHandle()
	},
	methods: {
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
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.receiveCardQuery(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		exportAll (selected) {
			let {docDefId, startNo, endNo} = selected
			this.submitLoading2 = true
			api.receiveCardQueryExport({
				docDefId,
				startNo,
				endNo
			}).then(res => {
				 if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `激活码信息.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			}).finally(() => {
				this.submitLoading2 = false
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		}
	}
}
</script>
