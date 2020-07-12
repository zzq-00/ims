<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="投保人">
              <a-input v-decorator="['appntname', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系方式">
              <a-input v-decorator="['appntmobile', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件类型">
              <DicSelect dicType="VIP_IDCARDTYPE" v-decorator="[ 'appntidtype', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件号码">
              <a-input v-decorator="['appntidno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="活动名称">
              <DicSelect dicType="VIP_ACTIVE_TYPE_SUB" v-decorator="[ 'activitytype',{initialValue: '3',rules: [{ required: true, message: '活动名称不能为空!'}]}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />发卡列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button type="primary" class="editable-add-btn" @click="exportExcel" style="margin-right:5px;">导出Excel</a-button>
          </div>
        </a-col>
      </a-row>
      <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
export default {
	name: 'vip-direct-sales',
	components: { DicSelect },
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
					align: "left",
					dataIndex: "activitytypeName",
					title: "活动名称"
				},
				{
					align: "left",
					dataIndex: "comname",
					title: "机构名称"
				},
				{
					align: "left",
					dataIndex: "agentcode",
					title: "销售编号"
				},
				{
					align: "left",
					dataIndex: "agentname",
					title: "销售姓名"
				},
				{
					align: "left",
					dataIndex: "agentmobile",
					title: "销售电话"
				},
				{
					align: "left",
					dataIndex: "signdate",
					title: "业务日期"
				},
				{
					align: "left",
					dataIndex: "appntname",
					title: "客户姓名"
				},
				{
					align: "left",
					dataIndex: "appntidno",
					title: "客户证件号码"
				},
				{
					align: "left",
					dataIndex: "appntmobile",
					title: "客户手机号"
				},
				{
					align: "left",
					dataIndex: "cardtypename",
					title: "会员卡类型"
				},
				{
					align: "left",
					dataIndex: "typename",
					title: "会员卡形式"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "errorinfo",
					title: "未发卡原因"
				}
			],
			rowSelection: {
				type: 'radio',
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
		// this.searchHandle()
	},
	created(){
		this.searchHandle()
	},
	methods: {
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		loadPageData () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.queryByDirectSales(data).then(res => {
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
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
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		exportExcel () {
			let query = this.filterForm.getFieldsValue()
			api.directSalesExport(query).then(res => {
			   console.log('导出', query)
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `一卡通系统保单报表.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
				// let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
				// let objectUrl = URL.createObjectURL(blob)
				// window.open(objectUrl, '_blank')
			})
		}
	}
}
</script>
