<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="健管卡代码">
              <HealthCardSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docDefId', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="健管卡类型">
              <DicSelect ref="dicCatCode" dicType="DOC_CAT_CODE" :allowClear="true" @change="searchHandle" v-decorator="['docCatCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="健管卡类型码">
              <a-input v-decorator="['docTypeCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否有价">
              <DicSelect dicType="YES_NO" :allowClear="true" @change="searchHandle" v-decorator="['isValued', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否虚拟卡">
              <DicSelect dicType="YES_NO" :allowClear="true" @change="searchHandle" v-decorator="['isVirtual', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否有效">
              <DicSelect dicType="YES_NO" :allowClear="true" @change="searchHandle" v-decorator="['isValid', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
					<a-col :span="8">
            <a-form-item label="是否预警提示">
              <DicSelect dicType="YES_NO" :allowClear="true" @change="searchHandle" v-decorator="['isWarning', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
					<a-col :span="8">
            <a-form-item label="设置状态">
              <DicSelect dicType="IS_WARNING" :allowClear="true" @change="searchHandle" v-decorator="['setUpStatus', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="primary" :disabled="selectedRows.length === 0" class="editable-add-btn" @click="showWarningInfo" style="float:right;margin-right:10px;">设置预警</a-button>
			<a-button type="primary" :disabled="selectedRows.length === 0" class="editable-add-btn" @click="sendEmail" style="float:right;margin-right:10px;">发送邮件</a-button>
			<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
		  </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 健管卡预警列表</span>
      	<a href="#" slot="extra">
        	<a-icon :type="iconType" @click="swithTableShow" />
				</a>
				<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize=0 :loading="loading">
					<a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
          <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
          <span slot="docCatCode" slot-scope="text, record">{{getDocCatName(text)}}</span>
					<a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'" >{{text === 'Y' ? '是' : '否'}}</a-tag>
				</a-table>
    </a-card>
    <WarningForm ref="warningForm" @on-update="loadPageData" />
  </a-card>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select'
import WarningForm from '@/pages/HealthCard/components/warning-form'
import { Promise } from 'q'
import qs from 'qs'
export default {
	name: 'health-warning',
	components: { DicSelect, HealthCardSelect, WarningForm },
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
					title: "健管卡代码",
					dataIndex: "docCode",
					scopedSlots: { customRender: 'docCode' }
				},
				{
					align: "left",
					title: "健管卡名称",
					dataIndex: "docName",
					scopedSlots: { customRender: 'docName' }
				},
				{
					align: "left",
					title: "设置状态",
					dataIndex: "setUpStatus"
				},
				{
					align: "left",
					title: "健管卡类型",
					dataIndex: "docCatCode"
				},
				{
					align: "left",
					title: "健管卡类型码",
					dataIndex: "docTypeCode"
				},
				{
					align: "left",
					title: "现有库存数",
					dataIndex: "totalCount"
				},
				{
					align: "left",
					title: "有效库存数",
					dataIndex: "yCount"
				},
				{
					align: "left",
					title: "失效库存数",
					dataIndex: "nCount"
				},
				{
					align: "left",
					title: "库存预警数",
					dataIndex: "warningQuantity"
				},
				{
					align: "left",
					title: "是否预警",
					dataIndex: "isValued",
					scopedSlots: { customRender: 'yesNo' }
				},
				{
					align: "left",
					title: "是否有价",
					dataIndex: "isValued",
					scopedSlots: { customRender: 'yesNo' }
				},
				{
					align: "left",
					title: "是否虚拟卡",
					dataIndex: "isVirtual",
					scopedSlots: { customRender: 'yesNo' }
				},
				{
					align: "left",
					title: "是否有效",
					dataIndex: "isValid",
					scopedSlots: { customRender: 'yesNo' }
				},
				{
					align: "left",
					title: "有效截止日期",
					dataIndex: "invalidDate"
				},
				{
					align: "left",
					title: "健管卡总数",
					dataIndex: "totalInventory"
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
			api.queryWarningList(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		getDocCatName (code) {
			return this.$refs.dicCatCode.getName(code)
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		addRecord () {
			this.$refs.warningForm.addForm()
		},
		showRecordInfo (obj) {
			this.$refs.warningForm.editForm(obj.docDefId, obj)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		showWarningInfo () {

		},
		sendEmail () {

		}
	}
}
</script>
