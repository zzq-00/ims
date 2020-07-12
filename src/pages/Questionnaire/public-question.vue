<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="问题类型">
							<DicSelect dicType="QUESTION_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['questionType', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="问题名称">
							<a-input v-decorator="['questionName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
						<a-button type="primary" class="editable-add-btn" @click="addRecord" style="float:right;margin-right:10px;">新增</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 问题列表</span>
			<a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.publicQuestionId" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
				<a slot="questionName" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
			</a-table>
		</a-card>
		<div style="margin-top: 10px;margin-left: 60%;">
			<a-button type="primary" :disabled="!selectedRows.length" @click="deleteRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >删除</a-button>
			<a-button type="primary" :disabled="!selectedRows.length" @click="editRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >修改</a-button>
			<a-button type="primary" :disabled="!selectedRows.length" @click="copyRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >复制</a-button>
		</div>

		<QuestionForm ref="questionForm" @on-update="loadPageData" />
		<QuestionPreview ref="questionPreview" />
	</a-card>
</template>
<script>
import api from "@/api/api-questionnaire"
import DicSelect from "@/components/dic-select"
import QuestionForm from "./components/question-form"
import QuestionPreview from './components/question-preview'
export default {
	name: "health-warning",
	components: { DicSelect, QuestionForm, QuestionPreview },
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
				{ title: "问题名称", dataIndex: "questionName", scopedSlots: { customRender: "questionName" } },
				{ title: "问题类型", dataIndex: "questionTypeDesc" },
				{ title: "创建日期", dataIndex: "insertTimeDesc" }
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
				queryParam: query
			}
			this.loading = true
			api.queryPagePublicQuestion(data).then(res => {
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
			this.$refs.questionForm.addForm()
		},
		editRecord () {
			let obj = this.selectedRows[0]
			this.$refs.questionForm.editForm(obj)
		},
		showRecordInfo (obj) {
			let params = {
				id: obj.publicQuestionId
			}
			api.queryOnePublicQuestion(params).then(res => {
				this.$refs.questionPreview.show(res.data)
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		copyRecord () {
			let obj = this.selectedRows[0]
			api.clonePublicQuestion({id: obj.publicQuestionId}).then(res => {
				this.loadPageData()
				let newId = res.data
				this.$refs.questionForm.editForm({publicQuestionId: newId})
			})
		},
		deleteRecord () {
			let obj = this.selectedRows[0]
			let self = this
			this.$confirm({
				title: '确认提示',
				content: '删除后不可恢复，确认删除吗?',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						api.deletePublicQuestion({id: obj.publicQuestionId}).then(res => {
							self.$message.success('删除成功!')
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
