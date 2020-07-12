<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="bank" />查询条件
      </a-divider>
      <a-form
        :form="filterForm"
        :labelCol="filterFormLayout.labelCol"
        :wrapperCol="filterFormLayout.wrapperCol"
      >
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
            <a-form-item label="证件号码">
              <a-input v-decorator="['appntidno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="卡号">
              <a-input v-decorator="['cardno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="保单号">
              <a-input v-decorator="['contno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="数据类型">
              <DicSelect
                dicType="VIP_ACTIVE_TYPE" :firstValue="'9'"
                v-decorator="[ 'activitytype', {initialValue: '2'}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="账户状态">
              <DicSelect dicType="VIP_ACCOUNTSTATUS" v-decorator="[ 'status', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="保单状态">
              <DicSelect
                dicType="VIP_CONTSTATUSTYPE"
                v-decorator="[ 'contstatus', {initialValue: ''}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="卡类型">
              <DicSelect dicType="VIP_CARD" v-decorator="[ 'cardtypecode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="卡形式">
              <DicSelect dicType="VIP_CARD_TYPE" v-decorator="[ 'type', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-item label="分公司代码(86**)">
              <a-input v-decorator="['unitid', {initialValue: ''}]" />
            </a-form-item>
          </a-col>-->
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button
              type
              class="editable-add-btn"
              @click="resetFilterForm"
              style="float:right;margin-right:10px;"
            >重置</a-button>
            <a-button
              type
              class="editable-add-btn"
              @click="searchHandle"
              style="float:right;margin-right:10px;"
            >查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />发卡列表
      </span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table
        :scroll="{ x: 'max-content'}"
        v-show="showTable"
        :bordered="false"
        :pagination="pagination"
        :rowSelection="rowSelection"
        :dataSource="pageData.data"
        :columns="columns"
        :rowKey="record => record.id"
        :indentSize="0"
        :loading="loading"
      ></a-table>
    </a-card>
  </a-card>
</template>
<script>
import api from "@/api/api-vip"
import DicSelect from "@/components/dic-select"
export default {
	name: "vip-common-select",
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
			iconType: "down",
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
					dataIndex: "comcode",
					title: "机构代码"
				},
				// {
				// 	align: "left",
				// 	dataIndex: "appntnameCopy",
				// 	title: "姓名"
				// },
				{
					align: "left",
					dataIndex: "appntnameCopy",
					title: "会员姓名"
				},
				{
					align: "left",
					dataIndex: "appntsexNameCopy",
					title: "性别"
				},
				{
					align: "left",
					dataIndex: "appntidnoCopy",
					title: "证件号码"
				},
				{
					align: "left",
					dataIndex: "appntmobileCopy",
					title: "手机号"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
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
					dataIndex: "salchannelName",
					title: "销售渠道"
				},
				{
					align: "left",
					dataIndex: "contno",
					title: "保单号"
				},
				{
					align: "left",
					dataIndex: "prem",
					title: "保费"
				},
				{
					align: "left",
					dataIndex: "signdate",
					title: "签单日期"
				},
				{
					align: "left",
					dataIndex: "customgetpoldate",
					title: "回执日期"
				},
				{
					align: "left",
					dataIndex: "errorinfo",
					title: "未发原因"
				},
				{
					align: "left",
					dataIndex: "activestatusName",
					title: "卡激活状态"
				},
				{
					align: "left",
					dataIndex: "contstatusName",
					title: "保单状态"
				},
				{
					align: "left",
					dataIndex: "riskname",
					title: "险种名称"
				},
				{
					align: "left",
					dataIndex: "appntname",
					title: "投保人姓名"
				},
				{
					align: "left",
					dataIndex: "appntsexName",
					title: "投保人性别"
				},
				{
					align: "left",
					dataIndex: "appntidno",
					title: "投保人证件号码"
				},
				{
					align: "left",
					dataIndex: "appntmobile",
					title: "投保人手机号"
				},
				{
					align: "left",
					dataIndex: "insurednname",
					title: "被保人姓名"
				},
				{
					align: "left",
					dataIndex: "insuredsexName",
					title: "被保人性别"
				},
				{
					align: "left",
					dataIndex: "insuredidno",
					title: "被保人证件号码"
				},
				{
					align: "left",
					dataIndex: "insuredmobile",
					title: "被保人手机号"
				}
			],
			rowSelection: {
				type: "radio",
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
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api
				.queryByCommon(data)
				.then(res => {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => {
						item.recordIndex = index + 1
						item.appntmobileCopy = item.appntmobile
						item.appntnameCopy = item.appntname
						item.appntsexNameCopy = item.appntsexName
						item.appntidnoCopy = item.appntidno
					})
					this.pagination.total = this.pageData.totalCount
				})
				.finally(() => {
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
			// this.searchHandle();
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		}
	}
}
</script>
