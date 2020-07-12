<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="服务名称">
              <PseriviceSelect :allowClear="true" v-decorator="['serviceCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
						<a-button type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="searchHandle">查询</a-button>
						<a-button type="" class="editable-add-btn" style="margin:0px 0 0 0;" @click="resetFilterForm">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-divider orientation="left"><a-icon type="search" /> 查询结果</a-divider>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="productCode" @click="showProductInfo(record)" slot-scope="text, record">{{text}}</a>
      </a-table>
    </a-card>

  </a-card>
</template>
<script>
  import api from '@/api/api-product-service'
  import PseriviceSelect from '@/components/pservice-select'
  import OrgSelect from '@/components/org-select'

  export default {
	name: 'NetworkAdd',
	components: { PseriviceSelect, OrgSelect },
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
			iconType: 'down',
			columns: [
				// {
				// 	align: "center",
				// 	title: "序号",
				// 	dataIndex: "recordIndex"
				// },
				{
					align: "left",
					title: "产品代码",
					dataIndex: "productCode",
					scopedSlots: { customRender: 'productCode' }
				},
				{
					align: "left",
					title: "产品名称",
					dataIndex: "productName"
				},
				{
					align: "left",
					title: "产品分类",
					dataIndex: "productTypeDesc"
				},
				{
					align: "left",
					title: "产品状态",
					dataIndex: "productStatusDesc"
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
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
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
			api.getProductByService(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		showProductInfo (record) {
			this.$router.push({
				name: 'ProductDetail', query: {productCode: record.productCode}
			})
		}
	}
}
</script>
