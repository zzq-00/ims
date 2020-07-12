<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="选择公共问题">
			<a-card>
				<a-table :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: this.selectType, selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
				</a-table>
			</a-card>

			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button type="primary" @click="submitForm">添加至本问卷</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-questionnaire'
export default {
	name: 'provider-select-modal',
	props: {
		selectType: {
			type: String,
			default () {
				return 'radio'
			}
		}
	},
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			extraParams: {},
			formModal: false,
			modalWidth: 870,
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{ title: "问题名称", dataIndex: "questionName" },
				{ title: "问题描述", dataIndex: "questionDesc" },
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
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
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
			this.selectedRows = []
			this.selectedRowKeys = []
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			data.queryParam = {}

			this.loading = true
			api.queryPagePublicQuestion(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.searchHandle()
		},
		show (extraParams) {
			this.extraParams = extraParams || {}

			this.formModal = true
			this.searchHandle()
		},
		submitForm () {
			if (this.selectedRows.length) {
				if (this.selectType === 'radio') {
					this.$emit('on-update', this.selectedRows[0])
				} else {
					 this.$emit('on-update', this.selectedRows)
				}
				this.formModal = false
			} else {
				this.$message.warning('请选择问题')
			}
		}
	}
}
</script>
