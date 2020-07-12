<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="产品">
              <ProductSelect :allowClear="true" v-decorator="['busiCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="任务类型">
              <DicSelect dicType="TASK_TYPE" :allowClear="true" v-decorator="['taskType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品分类">
              <DicSelect dicType="PRODUCT_TYPE" :allowClear="true" v-decorator="['busiType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
              <a-button type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="searchHandle">查询</a-button>
              <a-button class="editable-add-btn" style="margin:0px 0 0 0;" @click="resetFilterForm">重置</a-button>
          </a-col>

        </a-row>
      </a-form>
      <a-divider />

      <a-divider orientation="left">
        <a-icon type="audit" /> 待审核任务公共池</a-divider>
        <a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.taskId" :indentSize=0 :loading="loading">
        </a-table>
      <a-row :gutter="16">
        <a-col :span="24" style="text-align:right;margin:10px 0 0 0">
          <a-form-item>
            <a-button :disabled="this.selectedRows.length==0" type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="pick">获取任务</a-button>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">
        <a-icon type="audit" /> 待审核任务个人池</a-divider>
        <a-table v-show="showTableSelf" :bordered="false" :pagination="paginationSelf" :rowSelection="rowSelectionSelf" :dataSource="pageDataSelf.data" :columns="columnsSelf" :rowKey="record => record.taskId" :indentSize=0 :loading="loading">
        </a-table>
      <a-row :gutter="16">
        <a-col :span="24" style="text-align:right;margin:10px 0 0 0">
          <a-form-item>
            <a-button :disabled="this.selectedRowsSelf.length==0" type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="goToExamine">进入</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

  </a-card>
</template>
<script>
import api from '@/api/api-product'
import DicSelect from '@/components/dic-select'
import ProductSelect from '@/components/product-select'

export default {
	name: 'product-examine',
	components: { DicSelect, ProductSelect },
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
			pageDataSelf: {
				dataCount: 0,
				rows: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowsSelf: [],
			loading: false,
			loadingSelf: false,
			showTable: true,
			showTableSelf: true,
			iconType: 'down',
			columns: [
				{
					align: "left",
					title: "产品代码",
					dataIndex: "busiCode"
				},
				{
					align: "left",
					title: "产品名称",
					dataIndex: "busiName"
				},
				{
					align: "left",
					title: "任务类型",
					dataIndex: "taskTypeDesc"
				},
				{
					align: "left",
					title: "销售配置机构",
					dataIndex: "regionDesc"
				},
				{
					align: "left",
					title: "产品分类",
					dataIndex: "busiTypeDesc"
				}
			],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				},
				type: 'checkbox'
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
			},
			iconTypeSelf: 'down',
			columnsSelf: [
				{
					align: "left",
					title: "产品代码",
					dataIndex: "busiCode",
					scopedSlots: { customRender: 'busiCode' }
				},
				{
					align: "left",
					title: "产品名称",
					dataIndex: "busiName"
				},
				{
					align: "left",
					title: "任务类型",
					dataIndex: "taskTypeDesc"
				},
				{
					align: "left",
					title: "销售配置机构",
					dataIndex: "regionDesc"
				},
				{
					align: "left",
					title: "产品分类",
					dataIndex: "busiTypeDesc"
				}
			],
			rowSelectionSelf: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowsSelf = selectedRows
				},
				type: 'radio'
			},
			paginationSelf: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChangeSelf(current, pageSize),
				onChange: (page, pageSize) => this.onPageChangeSelf(page, pageSize)
			}
		}
	},
	mounted () {
		this.searchHandle()
		this.searchHandleSelf()
	},
	methods: {
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageDataPublic()
			})
		},
		onPageChange (current, size) {
			this.pagination.current = current
			this.loadPageDataPublic()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		},
		loadPageDataPublic () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.examinePublicList(data).then(res => {
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		searchHandleSelf () {
			this.$nextTick(() => {
				this.paginationSelf.current = 1
				this.loadPageDataSelf()
			})
		},
		onPageChangeSelf (current, size) {
			this.paginationSelf.current = current
			this.loadPageDataSelf()
		},
		onPageSizeChangeSelf (current, size) {
			this.paginationSelf.pageSize = size
			this.searchHandleSelf()
		},
		loadPageDataSelf () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.paginationSelf.current,
				limit: this.paginationSelf.pageSize
			}
			Object.assign(data, query)
			this.loadingSelf = true
			api.examineSelfList(data).then(res => {
				this.pageDataSelf = res.data || { totalCount: 0, data: [] }
				this.pageDataSelf.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.paginationSelf.total = this.pageDataSelf.totalCount
			}).finally(() => {
				this.loadingSelf = false
			})
		},
		// 获取任务
		pick () {
			let taskCodeList = []
			this.selectedRows.map(item => {
				taskCodeList.push(item.taskCode)
			})
			let data = {
				taskCodeList: taskCodeList
			}
			api.examinePick(data).then(res => {
				this.searchHandle()
				this.searchHandleSelf()
			}).finally(() => {
			})
		},
		// 获取任务
		goToExamine () {
			let taskCode = this.selectedRowsSelf[0].taskCode
			let busiCode = this.selectedRowsSelf[0].busiCode
			this.$router.push({
				name: 'ProductExamineDetail', params: {taskCode: taskCode, busiCode: busiCode}
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		}
	}
}
</script>
