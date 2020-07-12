<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="健管卡代码">
							<HealthCardSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docCode', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="产品代码">
							<HealthProductSelect ref="healthProductSelect" :allowClear="true" @change="searchHandle" v-decorator="['productCode', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="发放机构">
							<OrgSelect2   @change="searchHandle" v-decorator="['thirdOrgCode',{initialValue: ''}]" placeholder="请选择发放机构" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="健管卡状态">
							<DicSelect dicType="DOC_STATUS" @change="searchHandle" placeholder="请选择" v-decorator="['status']" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="起始号码">
							<a-input v-decorator="['startNo', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="终止号码">
							<a-input  v-decorator="['endNo', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="开始日期">
							<a-date-picker v-decorator="['receptDate', {initialValue: null}]" format="YYYY-MM-DD"/>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="结束日期">
							<a-date-picker v-decorator="['endReceptDate', {initialValue: null}]" format="YYYY-MM-DD"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" class="editable-add-btn" :disabled="selectedRows.length === 0" :loading="submitLoading" @click="exportCardNoPass" style="float:right;margin-right:10px;">导出卡号卡密</a-button>
						<a-button type="" class="editable-add-btn" :loading="submitLoading2" @click="exportAll" style="float:right;margin-right:10px;">导出查询结果</a-button>
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">
				<a-icon type="bank" /> 健管卡发放查询</span>
			<a href="#" slot="extra">
				<a-icon :type="iconType" @click="swithTableShow" />
			</a>
			<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== '是' ? 'green' : 'orange'">{{text === '是' ? '是' : '否'}}</a-tag>
			</a-table>
		</a-card>
	</a-card>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select2'
import HealthProductSelect from '@/components/health-product-select'
import OrgSelect2 from '@/components/health-card-org-select'
import { Promise } from 'q'
export default {
	name: 'health-sell-query',
	components: { DicSelect, HealthCardSelect, HealthProductSelect, OrgSelect2 },
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
					title: "序号",
					dataIndex: "recordIndex"
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
					title: "健管卡类型",
					dataIndex: "docCatName"
				},
				{
					align: "left",
					title: "是否虚拟卡",
					dataIndex: "isValuedName",
					scopedSlots: { customRender: 'yesNo' }
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
					title: "发放机构",
					dataIndex: "thirdOrgCode"
				},
				{
					align: "left",
					title: "经办人",
					dataIndex: "updateOper"
				},
				{
					align: "left",
					title: "起始号码",
					dataIndex: "startNo"
				},
				{
					align: "left",
					title: "终止号码",
					dataIndex: "endNo"
				},
				{
					align: "left",
					title: "健管卡状态",
					dataIndex: "statusName"
				},
				{
					align: "left",
					title: "数量",
					dataIndex: "docNum"
				},
				{
					align: "left",
					title: "票面价格",
					dataIndex: "faceAmount"
				},
				{
					align: "left",
					title: "合计金额",
					dataIndex: "totalPrice"
				},
				{
					align: "left",
					title: "发放日期",
					dataIndex: "updateTime"
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
				limit: this.pagination.pageSize,
				status: '05'
			}
			Object.assign(data, query)
			this.loading = true
			api.querySellCard(data).then(res => {
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
		exportCardNoPass () {
			if (this.selectedRows.length) {
				this.submitLoading = true
				api.exportSellCardPass(this.selectedRows[0]).then(res => {
					if (res.status === undefined) {
						// base64内容，文件名
						this.$downloadFileByBase64(res, `健管卡发放.xls`)
					} else {
						this.$message.error('文件下载失败,请重试')
					}
				}).finally(() => {
					this.submitLoading = false
				})
			}
		},
		exportAll () {
			let query = this.filterForm.getFieldsValue()
			this.submitLoading2 = true
			api.exportSellCardQuery(query).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `健管卡发放查询结果.xlsx`)
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
