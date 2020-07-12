<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="服务名称">
              <PseriviceSelect ref="pseriviceSelect" :allowClear="true" v-decorator="['serviceCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务类别">
              <DicSelect dicType="SERVICE_BASE_TYPE" :allowClear="true" v-decorator="['serviceBaseType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
						<a-button type="" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="searchHandle">查询</a-button>
						<a-button type="" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="resetFilterForm">重置</a-button>
						<a-button type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="addService">新增</a-button>
						<a-button :disabled="selectedRows.length==0" type="" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="editService">修改</a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
      <a-row :gutter="16">
        <a-col :span="24" style="text-align:right">
          <a-form-item>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">
        <a-icon type="search" /> 查询结果</a-divider>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="serviceCode" @click="showService(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
    </a-card>
    <SerivceForm ref="serviceForm" @on-update="searchHandle" />
  </a-card>
</template>
<script>
  import api from '@/api/api-product-service'
  import DicSelect from '@/components/dic-select'
  import PseriviceSelect from '@/components/pservice-select'
  import SerivceForm from './components/service-form'

  export default {
	name: 'NetworkAdd',
	components: { DicSelect, PseriviceSelect, SerivceForm },
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
			iconType: 'down',
			columns: [
				// {
				// 	align: "center",
				// 	title: "序号",
				// 	dataIndex: "recordIndex"
				// },
				{
					align: "left",
					title: "服务代码",
					dataIndex: "serviceCode",
					scopedSlots: { customRender: 'serviceCode' }
				},
				{
					align: "left",
					title: "服务名称",
					dataIndex: "serviceName"
				},
				{
					align: "left",
					title: "服务别名",
					dataIndex: "serviceAliasName"
				},
				{
					align: "left",
					title: "服务类别",
					dataIndex: "serviceBaseTypeDesc"
				}
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
		this.searchHandle()
	},
	methods: {
		onSelectChange (selectedRowKeys, selectedRows) {
			this.selectedRows = selectedRows
			this.selectedRowKeys = selectedRowKeys
		},
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageDataPublic()
				// 主动更新下拉列表
				this.$refs.pseriviceSelect.loadList()
				// 清空选中
				this.selectedRows = []
				this.selectedRowKeys = []
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
		resetFilterForm () {
			this.filterForm.resetFields()
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
			api.getServicelist(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		addService () {
			this.$refs.serviceForm.addForm()
		},
		editService () {
			this.$refs.serviceForm.editForm(this.selectedRows[0])
		},
    showService(obj) {
      this.$refs.serviceForm.showForm(obj)
    }
	}
}
</script>
