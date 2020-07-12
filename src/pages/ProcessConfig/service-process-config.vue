<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="服务类型">
							<DicSelect dicType="SI_SERVICE_TYPE" @change="searchHandle" v-decorator="['serviceType',{initialValue: ''}]" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务名称">
							<a-input :allowClear="true" v-decorator="['serviceName', {initialValue: ''}]" />
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
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">
				<a-icon type="bank" /> 服务流程列表</span>
			<a href="#" slot="extra">
				<a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading" :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
				<span slot="textVal" slot-scope="text, record">{{text || '-'}}</span>
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== '是' ? 'green' : 'orange'">{{text}}</a-tag>
			</a-table>

			<a-row style="margin-top: 20px;">
				<a-col :span="12" :offset="11">
					<a-button type="" :disabled="!selectedRows.length" @click="cancel" class="editable-add-btn" style="float:right;margin-right:10px;">禁用</a-button>
					<a-button type="" :disabled="!selectedRows.length" @click="publish" class="editable-add-btn" style="float:right;margin-right:10px;">发布</a-button>
					<a-button type="" :disabled="!selectedRows.length" @click="queueConfig" class="editable-add-btn" style="float:right;margin-right:10px;">服务队列配置</a-button>
					<a-button type="" :disabled="!selectedRows.length" @click="processConfig" class="editable-add-btn" style="float:right;margin-right:10px;">服务流程配置</a-button>
				</a-col>
			</a-row>
		</a-card>

		<ProcessConfigForm ref="processConfigForm" @on-update="loadPageData" />
		<QueueConfigForm ref="queueConfigForm" @on-update="loadPageData" />
	</a-card>
</template>
<script>
import api from "@/api/api-process-config"
import DicSelect from "@/components/dic-select"
import ProcessConfigForm from "./components/process-config-form"
import QueueConfigForm from "./components/queue-config-form"

export default {
	name: "service-process-config",
	components: { DicSelect, ProcessConfigForm, QueueConfigForm },
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
				{ title: "服务代码", dataIndex: "serviceCode", scopedSlots: { customRender: "serviceCode" } },
				{ title: "服务名称", dataIndex: "serviceName" },
				{ title: "服务类别", dataIndex: "serviceTypeDesc" },
				{ title: "是否配置服务流程", dataIndex: "haveFlowDesc" },
				{ title: "是否配置服务队列", dataIndex: "haveQueueDesc" },
				{ title: "当前状态", dataIndex: "statusDesc" }
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
			this.selectedRows = []
			this.selectedRowKeys = []
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				ServiceFlowBo: query
			}
			this.loading = true
			api.getServiceListServiceFlow(data).then(res => {
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
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		cancel () {
			let obj = this.selectedRows[0]
			if (obj.status !== '01') {
				this.$Message.warning("此流程已禁用！")
				return
			}
			let params = {
				serviceCode: obj.serviceCode,
				status: '00'
			}
			api.changeStatusServiceFlow(params).then(res => {
				this.loadPageData()
				this.$Message.success('禁用成功！')
			})
		},
		publish () {
			let obj = this.selectedRows[0]
			if (obj.haveFlow !== 'Y' || obj.haveQueue !== 'Y') {
				this.$Message.warning("请确认此服务已配置了服务流程和服务队列再发布！！")
				return
			}
			let params = {
				serviceCode: obj.serviceCode,
				status: '01'
			}
			api.changeStatusServiceFlow(params).then(res => {
				this.loadPageData()
				this.$Message.success('发布成功！')
			})
		},
		queueConfig () {
			let obj = this.selectedRows[0]
			this.$refs.queueConfigForm.editForm(obj)
		},
		processConfig () {
			let obj = this.selectedRows[0]
			this.$refs.processConfigForm.editForm(obj)
		}
	}
}
</script>
