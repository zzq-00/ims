<template>
  <div>
		<a-card style="top: 15px;">
      <a-form :form="filterForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-row>
          <a-col :span="7">
            <a-form-item label="服务商类型">
              <DicSelect dicType="MEMBER_TYPE" :allowClear="true" v-decorator="['orgType', {initialValue: '',rules: [{ required: true, message: '服务商类型不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="服务商名称">
              <a-input v-decorator="['sorgName', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="所在省">
              <AddressSelect dicType="0" v-decorator="['province', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="所在市">
              <AddressSelect :dicType="this.filterForm.getFieldValue('province')" v-decorator="['city', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-col :span="24">
          <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
          <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          <a-button type="" class="editable-add-btn" @click="addRows" style="float:right;margin-right:10px;">添加</a-button>
  <!--				<a-button type="" class="editable-add-btn" @click="addAllRows" style="float:right;margin-right:10px;">全部添加</a-button>-->
        </a-col>
      </a-form>
    </a-card>
    <a-card style="top:20px;">
      <a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.providerId" :indentSize=0 :loading="loading">
      </a-table>
    </a-card>
  </div>
</template>
<script>
import api from "@/api/api-product-network"
import DicSelect from '@/components/dic-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import ProservSelect from '@/components/proserv-select'

export default {
	name: 'product-template-detail-supplier',
	components: { DicSelect, OrgSelect, AddressSelect, ProservSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			// modalWidth: 800,
			// modalTitle: '选择服务',
			submitLoading: false,
			filterForm: this.$form.createForm(this),
			pageData: {
				data: []
			},
			loading: false,
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "服务商编码",
					dataIndex: "sorgCode"
				},
				{
					align: "left",
					title: "服务商名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "供应商名称",
					dataIndex: "supplierName"
				},
				{
					align: "left",
					title: "管理机构",
					dataIndex: "orgName"
				},
				{
					align: "left",
					title: "所在省",
					dataIndex: "provinceName"
				},
				{
					align: "left",
					title: "所在市",
					dataIndex: "cityName"
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
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}

				let query = this.filterForm.getFieldsValue()
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}

				Object.assign(data, query)
				this.loading = true
				api.getSorgTemplet(data).then(res => {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			})
		},
		addRows () {
			if (this.selectedRows == undefined) {
			  this.$message.error("请选择一条数据！")
        return
			}
      this.$emit('on-add-rows', this.selectedRows)
		},
		addAllRows () {
			this.$emit('on-add-allrows', this.selectedRows)
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		}
	}
}
</script>
<style>

</style>
