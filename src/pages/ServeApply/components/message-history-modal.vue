<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="发送历史查询">
			<a-card title="查询条件">
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="发送手机号">
								<a-input v-decorator="['sendNo', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="短信内容">
								<a-input v-decorator="['sendMessage', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="发送时间" :labelCol="{span: 5}" :wrapperCol="{span: 19}">
								<a-range-picker :allowClear="true" v-decorator="['dateRange', {initialValue: defaultDateRange,  rules: [{ required: true, message: '发送时间不能为空!' }]}]" format="YYYY-MM-DD" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="发送处理人">
								<a-input v-decorator="['insertOper', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12" :offset="11">
							<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
							<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
						</a-col>
					</a-row>
				</a-form>
			</a-card>

			<a-card title="查询结果">
				<a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
					<span slot="sendNo" slot-scope="text, record">
						<span class="send-no" :title="record.sendNo">{{ record.sendNo }}</span>
					</span>
				</a-table>
			</a-card>

			<a-card title="查询条件">
				<a-row :gutter="16">
					<a-col :span="24">
						<a-form-item label="发送手机号">
							<a-input :disabled="true" :value="curRow.sendNo" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="24">
						<a-form-item label="短信内容">
							<a-textarea :disabled="true" :value="curRow.sendMessage" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-card>

			<div slot="footer">
				<a-button type="" @click="formModal=false">关闭</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import moment from 'moment'
export default {
	name: 'message-history-modal',
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			extraParams: {},
			formModal: false,
			modalWidth: 1170,
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			defaultDateRange: [],
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex", width: 50 },
				{
					title: "手机号",
					dataIndex: "sendNo",
					width: 210,
					align: 'center',
    			scopedSlots: {customRender: 'sendNo'}
				},
				{ title: "短信内容", dataIndex: "sendMessage" },
				{ title: "发送时间", dataIndex: "sendDateStr", width: 100 },
				{ title: "发送处理人", dataIndex: "operName", width: 150, scopedSlots: { customRender: 'textVal' } }
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
	computed: {
		curRow () {
			if (this.selectedRows.length) {
				return this.selectedRows[0]
			}
			return {}
		}
	},
	mounted () {

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
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}

				this.selectedRows = []
				this.selectedRowKeys = []
				let query = Object.assign({}, values)
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}
				query.sendStartDate = moment(query.dateRange[0]).format('YYYY-MM-DD')
				query.sendEndDate = moment(query.dateRange[1]).format('YYYY-MM-DD')
				delete query.dateRange

				data.messTrace = query

				this.loading = true
				api.queryMessages(data).then(res => {
					console.log(res, 'result')
					let pageData = {
						totalCount: res.data.totalCount,
						data: res.data.data
					}
					this.pageData = pageData || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
					// let arrList = [] // 对象
					// let phoneArr = [] // 电话号码数组
					// this.pageData.data.map(item => {
					// 	phoneArr = item.sendNo.split(',')
					// 	phoneArr.map((list, i) => {
					// 		arrList.push(
					// 			{
					// 				sendNo: list,
					// 				sendMessage: item.sendMessage,
					// 				insertOper: item.insertOper,
					// 				sendDateStr: item.sendDateStr,
					// 				sendNoMini: item.sendNoMini,
					// 				sendMessageMini: item.sendMessageMini,
					// 				operName: item.operName
					// 			}
					// 		)
					// 	})
					// })
					// this.pageData.data = arrList
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		show (extraParams) {
			this.extraParams = extraParams || {}
			this.filterForm.resetFields()

			this.defaultDateRange = []
			this.defaultDateRange.push(moment().add(-7, 'days'))
			this.defaultDateRange.push(moment())

			this.$nextTick(() => {
				this.formModal = true
				this.searchHandle()
			})
		}
	}
}
</script>
<style scoped>
.send-no {
	display: inline-block;
	width: 200px;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
</style>
