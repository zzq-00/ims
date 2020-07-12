<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="产品名称">
              <ServiceProductSelect :allowClear="true" v-decorator="['productCode', {initialValue: '',rules: [{ required: true, message: '产品名称不能为空!' }]}]" @change="changeProductCode"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务名称">
              <ServiceProductSelect :productCode="filterForm.getFieldValue('productCode')" callType="serviceCode" :allowClear="true" v-decorator="['serviceCode', {initialValue: '',rules: [{ required: true, message: '服务名称不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在省">
              <AddressSelect dicType="0" allowClear v-decorator="['sorgProvince', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市">
              <AddressSelect allowClear :dicType="this.filterForm.getFieldValue('sorgProvince')" v-decorator="['sorgCity', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="服务商名称">
              <a-input placeholder="" v-decorator="['sorgCode', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务商类型">
              <DicSelect dicType="SUPPLIER_SUB_TYPE" :allowClear="true" v-decorator="['orgType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商编码">
              <a-input placeholder="" v-decorator="['supplierCode', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商名称">
              <a-input placeholder="" v-decorator="['supplierName', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
					<a-col :span="6">
						<a-form-item label="全部供应商" >
              <a-switch defaultChecked :checked="filterForm.getFieldValue('allSupplier')" v-decorator="['allSupplier', {initialValue: false}]" checkedChildren="是" unCheckedChildren="否"/>
            </a-form-item>
            <!-- <a-form-item label="全部供应商" >
              <a-switch defaultChecked :checked="filterForm.getFieldValue('flag')" v-decorator="['flag', {initialValue: false}]" checkedChildren="是" unCheckedChildren="否"/>
            </a-form-item> -->
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;" @click="resetFilterForm">重置</a-button>
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;" @click="searchHandle">查询</a-button>
            <a-button type="primary" @click="exportRecord" :loading="uploading" class="editable-add-btn" style="float:right;margin-right:10px;">导出</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex+record.productCode+record.serviceCode" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
        <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
      <a-row :gutter="16" style="margin-top:10px">
        <a-col :span="12" :offset="11">
          <a-button type="" :disabled="selectedRows.length === 0" @click="deleteSelected" class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
          <a-button type="primary" class="editable-add-btn"  @click="deleteAll" style="float:right;margin-right:10px;">全部删除</a-button>
        </a-col>
      </a-row>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-product-network'
import DicSelect from '@/components/dic-select'
import ServiceProductSelect from '@/components/service-product-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import { Promise } from 'q'
let baseColumns = [
	{
		align: "center",
		title: "序号",
		dataIndex: "recordIndex"
	},
	{
		align: "left",
		title: "产品名称",
		dataIndex: "productCodeName",
		scopedSlots: { customRender: 'productCodeName' }
	},
	{
		align: "left",
		title: "服务名称",
		dataIndex: "sorgCodeName"
	},
	{
		align: "left",
		title: "服务商名称",
		dataIndex: "serviceCodeName"
	},
	{
		align: "left",
		title: "所属省/直辖市",
		dataIndex: "sorgProvince"
	},
	{
		align: "left",
		title: "市",
		dataIndex: "sorgCity"
	},
	{
		align: "left",
		title: "状态",
		width: '80',
		dataIndex: "statusDesc"
	}]
export default {
	name: 'NetworkQuery',
	components: { DicSelect, ServiceProductSelect, OrgSelect, AddressSelect },
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
			columns: baseColumns,
			uploading: false,
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
		// this.searchHandle()
	},
	methods: {
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
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
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}

				let query = this.filterForm.getFieldsValue()
				let data = {
					flag: true,
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}
				console.log(query, 'query---')
				if (query.allSupplier) {
					this.columns = [...baseColumns]
					this.columns.splice(4, 0, {
						align: "left",
						title: "供应商名称",
						dataIndex: "supplierCodeName"
					})
				} else {
					this.columns = [...baseColumns]
				}
				delete query.allSupplier
				Object.assign(data, query)
				this.loading = true
				api.queryServiceNet(data).then(res => {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		changeProductCode () {
			this.filterForm.setFieldsValue({serviceCode: ''})
		},
		exportRecord () {
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let data = {
					productCode: this.filterForm.getFieldValue('productCode'),
					serviceCode: this.filterForm.getFieldValue('serviceCode'),
					sorgProvince: this.filterForm.getFieldValue('sorgProvince'),
					sorgCity: this.filterForm.getFieldValue('sorgCity'),
					sorgCode: this.filterForm.getFieldValue('sorgCode'),
					orgType: this.filterForm.getFieldValue('orgType')
				}
				this.uploading = true
				api.exportServiceNet(data).then(res => {
					if (res.status === (undefined || '')) {
						this.$message.error('文件导出失败！')
					} else {
						this.$downloadFileByBase64(res, `产品服务网络.xlsx`)
					}
				}).finally(() => {
					this.uploading = false
				})
			})
		},
		deleteSelected () {
			let data = []
			this.selectedRows.map(item => { data.push(item) })
			api.delServiceNet(data).then(res => {
				this.selectedRowKeys = []
				this.$Message.success('删除成功')
				this.loadPageData()
			})
		},
		deleteAll () {
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}

				let self = this
				this.$confirm({
					title: '确认提醒',
					content: '将删除全部服务商信息, 删除后无法恢复, 是否确认?',
					okType: 'danger',
					onOk () {
						return new Promise((resolve, reject) => {
							api.allDelServiceNet(values).then(res => {
								self.selectedRowKeys = []
								self.selectedRowKeys = []
								self.$Message.success('删除成功')
								self.searchHandle()
							}).finally(() => {
								resolve()
							})
						})
					}
				})
			})
		}
	}
}
</script>
