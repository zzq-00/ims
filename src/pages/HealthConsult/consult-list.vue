<template>
	<a-card :bordered="false">
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">
				<a-icon type="bank" /> 未答复咨询</span>
			<a href="#" slot="extra">
				<a-icon :type="iconType" @click="swithTableShow" />
			</a>
			<a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize=0 :loading="loading">
				<a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				<a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				<span slot="docCatCode" slot-scope="text">{{getDocCatName(text)}}</span>
				<a-tag slot="yesNo" slot-scope="text" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
			</a-table>
		</a-card>
		<WarningForm ref="warningForm" @on-update="loadPageData" />
	</a-card>
</template>
<script>
import api from "@/api/api-health-consult"
import DicSelect from "@/components/dic-select"
import HealthCardSelect from "@/components/health-card-select"
import WarningForm from "@/pages/HealthCard/components/warning-form"
import { Promise } from "q"
import qs from "qs"
export default {
	name: "health-warning",
	components: { DicSelect, HealthCardSelect, WarningForm },
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
			showTable: true,
			iconType: "down",
			columns: [
				{
					align: "left",
					title: "健康咨询编号",
					dataIndex: "healthConsultationCode",
					scopedSlots: { customRender: "healthConsultationCode" }
				},
				{
					align: "left",
					title: "咨询内容",
					dataIndex: "healthConsultationContentMiNi",
					scopedSlots: { customRender: "healthConsultationContentMiNi" }
				},
				{
					align: "left",
					title: "咨询来源",
					dataIndex: "healthConsultationSourceDescribe"
				},
				{
					align: "left",
					title: "提问者姓名",
					dataIndex: "questionerName",
					scopedSlots: {
						customRender: 'docName'
					}
				},
				{
					align: "left",
					title: "提问者证件号码",
					dataIndex: "questionerIdentityNumber"
				},
				{
					align: "left",
					title: "咨询时间",
					dataIndex: "questionerQuestionTime"
				},
				{
					align: "left",
					title: "答复时间",
					dataIndex: "finalResponseTime"
				},
				{
					align: "left",
					title: "状态",
					dataIndex: "responseStateDescribe"
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
			api.queryhealthConsultationListed(data).then(res => {
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
		getDocCatName (code) {
			return this.$refs.dicCatCode.getName(code)
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		addRecord () {
			this.$refs.warningForm.addForm()
		},
		showRecordInfo (record) {
			this.$router.push({
				path: `HealthConsultInfoPage/${record.questionerID}`
				// params: {questionerID: }
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		showWarningInfo () {},
		sendEmail () {}
	}
}
</script>
