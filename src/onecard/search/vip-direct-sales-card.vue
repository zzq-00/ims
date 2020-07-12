<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="活动名称">
              <DicSelect dicType="VIP_ACTIVE_TYPE_SUB" v-decorator="[ 'activitytype', {initialValue: '3'}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="销售编号">
              <a-input v-decorator="['agentcode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="销售姓名">
              <a-input v-decorator="['agentname', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="销售电话">
              <a-input v-decorator="['agentmobile', {initialValue: ''}]" />
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
      <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import moment from 'moment'
export default {
	name: 'vip-direct-sales-card',
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
					title: "客户电话"
				},
				{
					align: "left",
					dataIndex: "cardtypename",
					title: "卡类型"
				},
				{
					align: "left",
					dataIndex: "typename",
					title: "卡形式"
				},
				{
					align: "left",
					dataIndex: "accountstatusName",
					title: "卡状态"
				},
				{
					align: "left",
					dataIndex: "persondate",
					title: "建档日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "nutdate",
					title: "营养素评估"
				},
				{
					align: "left",
					dataIndex: "assdate",
					title: "健康评估"
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
		// this.searchHandle()
	},
	methods: {
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		loadPageData () {
		    //debugger
		    if(this.filterForm.getFieldsValue(['agentname']).agentname === "" && this.filterForm.getFieldsValue(['agentcode']).agentcode === ""
            && this.filterForm.getFieldsValue(['agentmobile']).agentmobile === ""){
            this.$message.warning(
                "请至少输入一个检索条件！"
            );
		        return
        }
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.queryReceiveCardInfo(data).then(res => {
				//debugger
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
		}
	}
}
</script>
