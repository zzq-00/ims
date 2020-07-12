<template>
  <a-card :bordered="false">
    <a-card style="margin-top:24px">
      <a-divider orientation="left">
        <a-icon type="cluster" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="模板编码">
              <a-input :allowClear="true" v-decorator="['templetCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="模板名称">
              <a-input :allowClear="true" v-decorator="['templetName', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="templetCode" @click="openTemplateDetail(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
      <a-row :gutter="16" style="margin-top:10px">
        <a-col :span="12" :offset="11">
          <a-button type="" class="editable-add-btn" @click="editTemplate" style="float:right;margin-right:10px;">修改</a-button>
          <a-button type="primary" class="editable-add-btn" @click="addTemplate" style="float:right;margin-right:10px;">新增</a-button>
        </a-col>
      </a-row>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-product-network'
import DicSelect from '@/components/dic-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import ProservSelect from '@/components/proserv-select'

import { Promise } from 'q'
export default {
	name: "ProductTemplate",
	components: { DicSelect, OrgSelect, AddressSelect, ProservSelect },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
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
					title: "模板编码",
					dataIndex: "templetCode",
          scopedSlots: { customRender: 'templetCode' }
				},
				{
					align: "left",
					title: "模板名称",
					dataIndex: "templetName"
				},
				{
					align: "left",
					title: "模板描述",
					dataIndex: "templetRemark"
				},
				{
					align: "left",
					title: "最后修改日期",
					dataIndex: "updateTime"
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
		this.searchHandle()
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
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.showTemplet(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
    openTemplateDetail(obj) {
      this.$router.push({
        path: '/ProductTemplateDetail',
        query: {'type': 'show', 'data': obj}
      })
    },
    addTemplate () {
			this.$router.push({
				path: '/ProductTemplateDetail',
        query: {'type': 'add'}
			})
		},
    editTemplate () {
		  if (this.selectedRows.length == 0) {
        this.$message.info('请选择一条数据!')
        return
      }
      this.$router.push({
        path: '/ProductTemplateDetail',
        query: {'type': 'edit', 'data': this.selectedRows[0]}
      })
    }
	}
}
</script>
