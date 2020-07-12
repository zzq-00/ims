<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="管理机构">
              <OrgSelect dicType="4" v-decorator="[ 'orgCode',  {initialValue: ''} ]" placeholder="请选择">></OrgSelect>
            </a-form-item>
          </a-col>
					<a-col :span="6">
						<a-form-item label="队列名称">
							<a-input :allowClear="true" v-decorator="['queueName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
          <a-col :span="6">
						<a-form-item label="用户姓名">
							<a-input :allowClear="true" v-decorator="['realName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
          <a-col :span="6">
						<a-form-item label="系统用户">
							<a-input :allowClear="true" v-decorator="['userName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" :disabled="!selectedRows.length" @click="deleteRecords" class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
						<a-button type="" :disabled="!selectedRows.length" @click="editRecord" class="editable-add-btn" style="float:right;margin-right:10px;">修改</a-button>
						<a-button type="" :disabled="!selectedRows.length" @click="subscribeUser" class="editable-add-btn" style="float:right;margin-right:10px;">队列订阅</a-button>
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 队列订阅列表</span>
			<a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
				<a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				<span slot="textVal" slot-scope="text, record">{{(text)}}</span>
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== '是' ? 'green' : 'orange'">{{text || '-'}}</a-tag>
			</a-table>
		</a-card>

		<QueueOrderForm ref="queueOrderForm" @on-update="loadPageData" />
		<QueueSubscriptionForm ref="queueSubscriptionForm" />
	</a-card>
</template>
<script>

import api from "@/api/api-process-config"
import OrgSelect from "@/components/org-select"
import QueueOrderForm from "./components/queue-order-form"
import QueueSubscriptionForm from "./components/queue-subscription-form"
import { Promise } from "q"
export default {
	name: "queue-order",
	components: { OrgSelect, QueueOrderForm, QueueSubscriptionForm },
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
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "系统用户", dataIndex: "userName", scopedSlots: { customRender: "textVal" } },
				{ title: "用户姓名", dataIndex: "realName" },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "队列名称", dataIndex: "queueName" },
				{ title: "订阅日期", dataIndex: "insertTime" },
				{ title: "是否接收短信", dataIndex: "isMessDesc", scopedSlots: { customRender: "yesNo" } },
				{ title: "是否接收邮件", dataIndex: "isMailDesc", scopedSlots: { customRender: "yesNo" } }
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
			this.selectedRowKeys = []
			this.selectedRows = []
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				QueueOrder: query
			}

			this.loading = true
			api.getQueueOrder(data).then(res => {
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
			this.$refs.queueOrderForm.addForm()
		},
		editRecord () {
			let obj = this.selectedRows[0]
			this.$refs.queueOrderForm.editForm(obj)
		},
		showRecordInfo (obj) {
			this.$refs.queueOrderForm.editForm(obj, true)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		subscribeUser () {
			let obj = this.selectedRows[0]
			this.$refs.queueSubscriptionForm.show(obj)
		},
		deleteRecords () {
			if (!this.selectedRows.length) {
				this.$message.warning('请选择记录')
			}

			let self = this
			this.$confirm({
				title: '确认提示',
				content: '数据将直接解除订阅，是否确认?',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						let data = {
							delL: self.selectedRows.map(item => item.workQueueSubScriptionId)
						}
						api.delQueueOrder(data).then(res => {
							self.$message.success('删除成功')

							self.selectedRowKeys = []
							self.selectedRows = []
							self.loadPageData()
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
