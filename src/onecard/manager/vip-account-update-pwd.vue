<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
			<!-- <a-alert message="请至少输入一个检索条件！" type="info" show-icon style="margin-bottom:12px;" closable/> -->
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="会员姓名">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系方式">
              <a-input v-decorator="['mobile', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡号">
              <a-input v-decorator="['cardno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />会员帐户列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
<!--            :disabled="!rowSelection.selectedRows.length || rowSelection.selectedRows[0].status !== 3"-->
            <a-button  type="primary" class="editable-add-btn" @click="updatePwd" style="margin-right:5px;">修改密码</a-button>
          </div>
        </a-col>
      </a-row>
      <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>
    <UpdatePwd ref="updatePwd"/>
  </a-card>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import UpdatePwd from './components/update-pwd'
import {formatMoney} from "../../libs/util"

export default {
	name: 'vip-account-update-pwd',
	components: {DicSelect, UpdatePwd},
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: {span: 9},
				wrapperCol: {span: 15}
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			loading: false,
			showTable: true,
			iconType: 'down',
			columns: [
				{
					align: "left",
					dataIndex: "name",
					title: "会员姓名"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "idcardtypeName",
					title: "证件类型"
				},
				{
					align: "left",
					dataIndex: "idcard",
					title: "证件号"
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "联系方式"
				},
				{
					align: "left",
					dataIndex: "money",
					title: "账户余额",
					customRender: text => {
					  if (text === 0 || text === null) {
							return "￥0.00"
						} else {
							return text ? "￥" + formatMoney(text, 2) : ""
						}
					}
				},
				{
					align: "left",
					dataIndex: "couponcnt",
					title: "卡券数"
				},
				{
					align: "left",
					dataIndex: "points",
					title: "积分",
					customRender: text => {
						if (text === 0 || text === null) {
							return 0.00
						} else {
							return text ? formatMoney(text, 2) : ""
						}
					}
				},
				{
					align: "left",
					dataIndex: "cardtypename",
					title: "卡类型"
				},
				{
					align: "left",
					dataIndex: "gradetypename",
					title: "会员级别"
				},
				{
					align: "left",
					dataIndex: "typeName",
					title: "卡形式"
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "账户状态"
				},
				{
					align: "left",
					dataIndex: "unitname",
					title: "发卡机构"
				},
				{
					align: "left",
					dataIndex: "usertypeName",
					title: "活动名称"
				}
			],
			rowSelection: {
				type: 'radio',
				selectedRows: [],
				onChange: (selectedRowKeys, selectedRows) => {
					this.rowSelection.selectedRows = selectedRows
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
			let query = this.filterForm.getFieldsValue()
			let hasValueFlag = false
			Object.keys(query).map(item => {
				if (query[item]) hasValueFlag = true
			})
			if (!hasValueFlag) {
				this.$message.warning('请至少输入一个检索条件！')
				return
			}
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.queryUpdatePwdAccountInfo(data).then(res => {
				this.pageData = res.data || {totalCount: 0, data: []}
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
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
		updatePwd () {
			if (!this.rowSelection.selectedRows || this.rowSelection.selectedRows.length <= 0) {
				this.$message.warning('请选择一条会员记录!')
				return
			}
			let data = {
				accountid: this.rowSelection.selectedRows[0].id,
				unitid: this.rowSelection.selectedRows[0].unitid,
				name: this.rowSelection.selectedRows[0].name,
				vipid: this.rowSelection.selectedRows[0].vipid,
				mobile: this.rowSelection.selectedRows[0].mobile
			}
			this.$refs.updatePwd.show(data)
		}

	}
}
</script>
