<template>
  <a-card :bordered="false">
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol" >
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="机构名称">
              <a-input v-decorator="['sorgName', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构编码">
              <a-input v-decorator="['sorgCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在省">
              <AddressSelect allowClear dicType="0" v-decorator="['proviceCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市">
              <AddressSelect allowClear :dicType="this.filterForm.getFieldValue('proviceCode')" v-decorator="['cityCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="合作方式">
              <DicSelect dicType="COOPERATE_WAY" allowClear v-decorator="['cooperationType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
              <OrgSelect dicType="4" allowClear v-decorator="['manageOrgCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构类型">
              <DicSelect dicType="SUPPLIER_SUB_TYPE" allowClear v-decorator="['manageOrgType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button :disabled="selectedRows.length==0" type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="confirm">确认</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
		<a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading"></a-table>
	</a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
import OrgSelect from '@/components/org-select'
import { Promise } from 'q'
export default {
	components: {DicSelect, AddressSelect, OrgSelect},
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
					title: "机构编码",
					dataIndex: "sorgCode"
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "orgTypeDesc"
				},
				{
					align: "left",
					title: "当前状态",
					dataIndex: "validStateDesc"
				}
			],
			rowSelection: {
			  type: 'radio',
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
	mounted () {},
	methods: {
		initUpperForm (obj) {
			this.filterForm.setFieldsValue(obj)
			this.$nextTick(() => {
				this.searchHandle()
			})
		},
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
				limit: this.pagination.pageSize
			}
			data = Object.assign(data, query)
			this.loading = true
			supApi.queryThirdPartyOrgList(data).then(res => {
				this.pageData = res.data
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		confirm () {
			this.$emit('on-update', this.selectedRows[0].sorgName)
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
