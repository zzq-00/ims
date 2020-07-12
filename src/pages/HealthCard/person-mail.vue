<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="姓名">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
					<a-col :span="8">
            <a-form-item label="工号">
              <a-input v-decorator="['staffNo', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="有效状态">
              <DicSelect dicType="IS_VALID" :allowClear="true" @change="searchHandle" v-decorator="['isValid', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
            <a-button type="primary" class="editable-add-btn" @click="addRecord" style="float:right;margin-right:10px;">新建</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 健管卡管理人员联系信息</span>
      	<a href="#" slot="extra">
        	<a-icon :type="iconType" @click="swithTableShow" />
				</a>
				<a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.personMailId" :indentSize=0 :loading="loading">
					<a slot="name" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
					<a-tag slot="yesNo" slot-scope="text, record" :color="text=== '有效' ? 'green' : 'orange'" >{{text === '有效' ? '有效' : '失效'}}</a-tag>
				</a-table>
    </a-card>
    <PersonMailForm ref="personMailForm" @on-update="loadPageData" />
  </a-card>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import PersonMailForm from '@/pages/HealthCard/components/person-mail-form'
import { Promise } from 'q'
export default {
	name: 'health-person-mail',
	components: { DicSelect, PersonMailForm },
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
					title: "姓名",
					dataIndex: "name",
					scopedSlots: { customRender: 'name' }
				},
				{
					align: "left",
					title: "工号",
					dataIndex: "staffNo"
				},
				{
					align: "left",
					title: "邮箱",
					dataIndex: "email"
				},
				{
					align: "left",
					title: "手机号",
					dataIndex: "mobile"
				},
				{
					align: "left",
					title: "有效状态",
					dataIndex: "isValid",
					scopedSlots: { customRender: 'yesNo' }
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
			api.queryPersonMail(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		addRecord () {
			this.$refs.personMailForm.addForm()
		},
		showRecordInfo (obj) {
			this.$refs.personMailForm.editForm(obj.personMailId, obj)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		}
	}
}
</script>
