<template>
  <a-card :bordered="false">
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol" >
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="供应商名称">
              <a-input v-decorator="['supplierName', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商编码">
              <a-input v-decorator="['supplierCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在省">
              <AddressSelect allowClear dicType="0" v-decorator="['province_query', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市">
              <AddressSelect allowClear :dicType="this.filterForm.getFieldValue('province_query')" v-decorator="['city_query', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button :disabled="selectedRows.length==0" type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="addSupplierProvider">保存</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
		<a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
		<a slot="sorgCode" slot-scope="text">{{text}}</a>
				<span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
		</a-table>
	</a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
import { Promise } from 'q'
export default {
	components: {DicSelect, AddressSelect},
	props: {
		param: {
			type: Object,
			default () {
				return {}
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
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "供应商编码",
					dataIndex: "supplierCode",
					scopedSlots: { customRender: 'supplierCode' }
				},
				{
					align: "left",
					title: "供应商名称",
					dataIndex: "supplierName"
				},
				{
					align: "left",
					title: "所在省",
					dataIndex: "provinceDesc"
				},
				{
					align: "left",
					title: "所在市",
					dataIndex: "cityDesc"
				},
				{
					align: "left",
					title: "供应商类型",
					dataIndex: "supplierSubTypeDesc"
				}
			],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			pagination: {
				pageSize: 5,
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
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				sorgCode: this.param.sorgCode
			}
			data = Object.assign(data, query)
      data.city = query.city_query
      data.province = query.province_query
      delete data.city_query
      delete data.province_query
			this.loading = true
			supApi.queryThirdPartySupplierList(data).then(res => {
				this.pageData = res.data
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		addSupplierProvider () {
			let data = {
				sorgCode: this.param.sorgCode,
				supplierCode: this.param.supplierCode,
				orgType: this.param.orgType,
				temp:"relevQueryListSupp",
				supplierObject: this.selectedRows
			}
			supApi.saveSupProvider(data).then(res => {
				this.$message.success('保存成功!')
				this.filterForm.resetFields()
				this.searchHandle()
				this.$emit('addRelaSupplier')
			}).finally(() => {
			})
		}
	}
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
