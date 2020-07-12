<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="模板名称">
							<a-input :allowClear="true" v-decorator="['templateName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务节点">
							<DicSelect dicType="ACTUALIZED_STATUS" :removeList="removeListState" :allowClear="true" @change="searchHandle" v-decorator="['templateType', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="发送对象">
							<DicSelect dicType="SEND_OBJECTS" :allowClear="true" @change="searchHandle" v-decorator="['sendingObjects', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="服务类别">
							<DicSelect dicType="SERVICE_BASE_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['serviceType', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="是否有效">
							<DicSelect dicType="EFFECT_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['isEffective', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" :disabled="selectedRows.length === 0" @click="editRecord" class="editable-add-btn"  style="float:right;margin-right:10px;">修改</a-button>
						<a-button type="primary" @click="addRecord" class="editable-add-btn" style="float:right;margin-right:10px;">新增</a-button>
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 短信及邮件配置列表</span>
			<a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.templateId" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
				<a slot="templateName" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
			</a-table>
		</a-card>
		<MessControlForm ref="messControlForm" @on-update="loadPageData" />
	</a-card>
</template>
<script>
import api from "@/api/api-process-config"
import DicSelect from "@/components/dic-select"
import MessControlForm from "./components/mess-control-form"
import { Promise } from "q"
import qs from "qs"
export default {
	name: "mess-controll",
	components: { DicSelect, MessControlForm },
	data () {
		return {
			removeListState: ['07', '09', '10', '12'],
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
					title: "序号",
					dataIndex: "recordIndex",
					scopedSlots: { customRender: "recordIndex" }
				},
				{
					title: "模板名称",
					dataIndex: "templateName",
					scopedSlots: { customRender: "templateName" },
					width: 260
				},
				{
					title: "服务节点",
					dataIndex: "templateTypeName"
				},
				{
					title: "发送对象",
					dataIndex: "sendingObjectsName"
				},
				{
					title: "服务类别",
					dataIndex: "serviceTypeDesc"
				},
				{
					title: "是否有效",
					dataIndex: "isEffectiveName"
				},
				{
					title: "发送内容",
					dataIndex: "sendingInfoDesc",
					width: 400
				}
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
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.listMessageModel(data).then(res => {
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
			this.$refs.messControlForm.addForm()
		},
		editRecord () {
			let obj = this.selectedRows[0]
			this.$refs.messControlForm.editForm(obj)
		},
		showRecordInfo (obj) {
			this.$refs.messControlForm.editForm(obj, true)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		}
	}
}
</script>
