<template>
  <a-form :form="filterForm" :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol">
    <a-card style="margin: 24px;">
      <a-divider orientation="left"><a-icon type="file-search" />查询条件</a-divider>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="产品名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <ProductSelect v-decorator="['productCode',{initialValue: ''}]" placeholder="请选择所属机构"></ProductSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="产品状态">
            <DicSelect dicType="PRODUCT_STATUS" v-decorator="['productStatus',{initialValue: ''}]" placeholder="请选择职级"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="产品分类">
            <DicSelect dicType="PRODUCT_TYPE" v-decorator="['productType',{initialValue: ''}]" placeholder="请选择职级"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="审核/审批状态">
            <DicSelect dicType="PRAUDIT_STATUS" v-decorator="['productTaskStatus',{initialValue: ''}]" placeholder="请选择人员类型"></DicSelect>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12" offset="12">
          <a-button type="primary" class="editable-add-btn" @click="addProduct" style="float:right;margin-right:10px;">新增</a-button>
          <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
          <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
        </a-col>
      </a-row>
      <a-divider orientation="left">
        <a-icon type="search" />查询结果</a-divider>
      <a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.productId" :indentSize=0 :loading="loading">
        <a slot="productCode" @click="viewProduct(record)" slot-scope="text, record">{{text}}</a>
        <template slot="operation" slot-scope="text, record">
          <div>
            <a @click="() => editProduct(record)" v-show="record.productTaskStatus==='00'||record.productTaskStatus==='04'">编辑</a>
            <a-popconfirm title="确认撤销?" @confirm="() => revokeProduct(record)" v-show="record.productTaskStatus==='01'||record.productTaskStatus==='02'||record.productTaskStatus==='04'">
              <a>撤销</a>
            </a-popconfirm>
            <a @click="() => copyProduct(record)" >复制</a>
          </div>
        </template>
      </a-table>
    </a-card>
  </a-form>
</template>
<script>
import DicSelect from "@/components/dic-select"
import ProductSelect from "@/components/product-select"
import productApi from "@/api/api-product"
export default {
	name: "product-maintain",
	components: { DicSelect, ProductSelect },
	data () {
		return {
			// 查询条件
			formItemLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			filterForm: this.$form.createForm(this),
			pageData: {
				dataCount: 0,
				data: []
			},
			loading: false,
			columns: [
				{
					align: "left",
					title: "产品代码",
					dataIndex: "productCode",
					scopedSlots: { customRender: "productCode" }
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
				},
				{
					align: "left",
					title: "审核/审批状态",
					dataIndex: "productTaskStatusDesc"
				},
				{
					align: "center",
					title: "操作",
					dataIndex: "operation",
					scopedSlots: { customRender: "operation" }
				}
			],
			selectedRows: [],
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
			this.pagination.current = 1
			this.loadPageData()
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
			query.codeFlag = "Y"
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			productApi.productList(data).then(res => {
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
		},
		viewProduct (record) {
			this.$router.push({
				name: 'ProductDetail', query: {productId: record.productId, productCode: record.productCode}
			})
		},
		editProduct (record) {
			this.$router.push({
				name: 'ProductAdd', params: {productId: record.productId, productCode: record.productCode}
			})
		},
    copyProduct (record) {
      this.$router.push({
        name: 'ProductCopy', params: {productId: record.productId, productCode: record.productCode}
      })
    },
		revokeProduct (record) {
			productApi.revoke({busiCode: record.productCode}).then(res => {
				if (res.data) {
					this.$message.success('撤销成功!')
					this.searchHandle()
				}
			}).finally(() => {
				this.loading = false
			})
		},
		addProduct () {
			this.$router.push({
				name: 'ProductAdd'
			})
		}
	}
}
</script>
