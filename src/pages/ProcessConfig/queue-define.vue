<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="管理机构">
              <OrgSelect dicType="4" v-decorator="['orgCode',{initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" placeholder="请选择" />
            </a-form-item>
          </a-col>
					<a-col :span="8">
						<a-form-item label="队列名称">
							<a-input :allowClear="true" v-decorator="['queueNameQ', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" :disabled="selectedRows.length === 0" @click="subscribeUser" class="editable-add-btn"  style="float:right;margin-right:10px;">用户订阅</a-button>
						<a-button type="" :disabled="selectedRows.length === 0" @click="editRecord" class="editable-add-btn"  style="float:right;margin-right:10px;">修改</a-button>
						<a-button type="primary" class="editable-add-btn" @click="addRecord" style="float:right;margin-right:10px;">新增</a-button>
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 队列维护列表</span>
			<a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.queueId" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
				<a slot="queueId" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
			</a-table>
		</a-card>

		<QueueDefineForm ref="QueueDefineForm" @on-update="loadPageData" />
		<QueueSubscriptionForm ref="queueSubscriptionForm" />
	</a-card>
</template>
<script>
import api from "@/api/api-process-config"
import DicSelect from "@/components/dic-select"
import OrgSelect from "@/components/org-select"
import QueueDefineForm from "./components/queue-define-form"
import QueueSubscriptionForm from "./components/queue-subscription-form"

export default {
	name: "queue-define",
	components: { DicSelect, OrgSelect, QueueDefineForm, QueueSubscriptionForm },
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
			selectedRowKeys: [],
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{
					align: "left",
					title: "序号",
					dataIndex: "recordIndex",
					scopedSlots: { customRender: "recordIndex" }
				},
				{
					align: "left",
					title: "队列ID",
					dataIndex: "queueId",
					scopedSlots: { customRender: "queueId" }
				},
				{
					align: "left",
					title: "管理机构",
					dataIndex: "orgName"
				},
				{
					align: "left",
					title: "队列名称",
					dataIndex: "queueName"
				},
				{
					align: "left",
					title: "是否允许订阅",
					dataIndex: "isOrderDesc"
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
			this.selectedRows = []
			this.selectedRowKeys = []

			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.getQueueInfo(data).then(res => {
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
			this.searchHandle()
		},
		addRecord () {
			this.$refs.QueueDefineForm.addForm()
		},
		editRecord () {
			let obj = this.selectedRows[0]
			this.$refs.QueueDefineForm.editForm(obj)
		},
		showRecordInfo (obj) {
			this.$refs.QueueDefineForm.editForm(obj, true)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		subscribeUser () {
			let obj = this.selectedRows[0]
			this.$refs.queueSubscriptionForm.show(obj)
		}
	}
}
</script>
