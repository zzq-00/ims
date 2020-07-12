<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="8">
						<a-form-item label="健管卡代码">
							<HealthCardSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docDefId', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="产品代码">
							<HealthProductSelect ref="healthProductSelect" :allowClear="true" @change="searchHandle" v-decorator="['productCode', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" class="editable-add-btn" :disabled="selectedRows.length === 0" @click="approveBatch" style="float:right;margin-right:10px;">审核选中</a-button>
						<a-button type="" class="editable-add-btn" @click="approveAll" style="float:right;margin-right:10px;">审核所有</a-button>
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">
				<a-icon type="bank" /> 健管卡发放审核</span>
			<a href="#" slot="extra">
				<a-icon :type="iconType" @click="swithTableShow" />
			</a>
			<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== '是' ? 'green' : 'orange'">{{text === '是' ? '是' : '否'}}</a-tag>
			</a-table>
		</a-card>

		<a-modal v-model="formModal" style="top: 30px;" :width="600" title="健管卡发放审核">
			<a-form :form="dataForm" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
				<a-card style="margin: 24px;">
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="24">
									<a-form-item label="审核结论">
										<a-select v-decorator="['assessResult', {initialValue: '', rules: [{ required: true, message: '审核结论不能为空!' }]}]">
											<a-select-option value="Y">通过</a-select-option>
											<a-select-option value="N">不通过</a-select-option>
										</a-select>
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="24">
									<a-form-item label="审核意见">
										<a-textarea v-decorator="['conclusion']" :autosize="{ minRows: 4, maxRows: 8 }"/>
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
	</a-card>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select'
import HealthProductSelect from '@/components/health-product-select'
import OrgSelect2 from '@/components/org-select2'
import { Promise } from 'q'
export default {
	name: 'health-card-sell-approve',
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
			formModal: false,
			dataForm: this.$form.createForm(this),
			approveWay: 'batch',
			selectedRows: [],
			loading: false,
			submitLoading: false,
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
					dataIndex: "docCatCode"
				},
				{
					align: "left",
					title: "是否虚拟卡",
					dataIndex: "isVirtual",
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
					title: "管理机构",
					dataIndex: "orgCode"
				},
				{
					align: "left",
					title: "发放机构",
					dataIndex: "updateOrgCode"
				},
				{
					align: "left",
					title: "领用人类型",
					dataIndex: "receiveTypeStr"
				},
        {
          align: "left",
          title: "领用人代码",
          dataIndex: "receiveCode"
        },
				{
					align: "left",
					title: "领用人姓名",
					dataIndex: "receiver"
				},
				{
					align: "left",
					title: "申请日期",
					dataIndex: "inputDate"
				}
			],
			rowSelection: {
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
			api.sendCardApproveQuery(data).then(res => {
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
		approveBatch () {
			this.approveWay = 'batch'
			this.dataForm.resetFields()
			this.formModal = true
		},
		approveAll () {
			this.approveWay = 'all'
			this.dataForm.resetFields()
			this.formModal = true
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let param = {
					data : this.selectedRows,
				}
				Object.assign(param, values)
				console.log(param)
				this.submitLoading = true
				if (this.approveWay === 'batch') {
					api.sendCardApprove(param).then(res => {
						this.formModal = false
						this.loadPageData()
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					let query = this.filterForm.getFieldsValue()
					let data = {
						page: this.pagination.current,
						limit: this.pagination.pageSize,
						status: '05'
					}
					Object.assign(data, query)
					let param = Object.assign({}, data)
					Object.assign(param, values)

					api.sendCardAllApprove(param).then(res => {
						this.formModal = false
						this.loadPageData()
					}).finally(() => {
						this.submitLoading = false
					})
				}
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		}
	}
}
</script>
