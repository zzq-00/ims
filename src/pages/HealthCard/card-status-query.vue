<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
					<a-col :span="6">
            <a-form-item label="查询方式">
							<a-select @change="searchHandle" v-decorator="['queryWay', {initialValue: '', rules: [{ required: true, message: '查询方式不能为空!' }]}]" allowClear>
								<a-select-option :value="1">1-连号查询</a-select-option>
								<a-select-option :value="2">2-单号查询</a-select-option>
							</a-select>
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="管理机构">
              <OrgSelect2 dicType="86" v-decorator="['orgCode',{initialValue: ''}]" @change="searchHandle" placeholder="请选择所属机构" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="健管卡代码">
              <HealthCardSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="产品代码">
              <HealthProductSelect ref="healthProductSelect" :allowClear="true" @change="searchHandle" v-decorator="['productCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="售出来源">
							<DicSelect dicType="PAYMENT_SOURCE" :allowClear="true" @change="searchHandle" v-decorator="['salesSource', {initialValue: ''}]" />
						</a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="健管卡状态">
              <DicSelect dicType="DOC_STATUS" :allowClear="true" @change="searchHandle" v-decorator="['status', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="起始号码">
							<!-- docTypeCode -->
              <a-input v-decorator="['startNo', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="终止号码">
              <a-input v-decorator="['endNo', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
				<a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="发放者">
              <a-input v-decorator="['sender', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="接收者">
              <a-input v-decorator="['receiver', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="开始日期">
              <a-date-picker v-decorator="['startDate',{initialValue: null}]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="终止日期">
              <a-date-picker v-decorator="['endDate',{initialValue: null}]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
						<a-button type="" class="editable-add-btn" @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 健管卡状态查询</span>
      	<a href="#" slot="extra">
        	<a-icon :type="iconType" @click="swithTableShow" />
				</a>
				<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
				</a-table>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select'
import HealthProductSelect from '@/components/health-product-select'
import OrgSelect2 from '@/components/org-select2'
import { Promise } from 'q'
import moment from "moment"
export default {
	name: 'health-card-status-query',
	components: { DicSelect, HealthCardSelect, HealthProductSelect, OrgSelect2 },
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
					title: "管理机构代码",
					dataIndex: "orgCode"
				},
				{
					align: "left",
					title: "管理机构名称",
					dataIndex: "orgName"
				},
				{
					align: "left",
					title: "健管卡代码",
					dataIndex: "docCode"
				},
				{
					align: "left",
					title: "健管卡名称",
					dataIndex: "docName"
				},
				{
					align: "left",
					title: "产品代码",
					dataIndex: "productCode"
				},
				{
					align: "left",
					title: "产品名称",
					dataIndex: "productName"
				},
				{
					align: "left",
					title: "发放者",
					dataIndex: "sender"
				},
				{
					align: "left",
					title: "接收者",
					dataIndex: "receiver"
				},
				{
					align: "left",
					title: "起始号码",
					dataIndex: "startNo"
				},
				{
					align: "left",
					title: "终止号码",
					dataIndex: "endNo"
				},
				{
					align: "left",
					title: "数量",
					dataIndex: "docNum"
				},
				{
					align: "left",
					title: "健管卡状态",
					dataIndex: "status"
				},
				{
					align: "left",
					title: "售出来源",
					dataIndex: "salesSource"
				},
				{
					align: "left",
					title: "操作员",
					dataIndex: "updateOper"
				},
				{
					align: "left",
					title: "操作时间",
					dataIndex: "updateTime"
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
		// this.$nextTick(() => {
		// 	this.filterForm.setFieldsValue({queryWay: 1})
		// 	this.searchHandle()
		// })
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
				let queryWay = values.queryWay
				let requestFunc = queryWay === 1 ? api.queryCardStatusConstant : api.queryCardStatusSingle
				let query = this.filterForm.getFieldsValue()
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}
				delete query.queryWay
				Object.assign(data, query)
				if (data.docCode) {
					data.docCode = this.$refs.healthCardSelect.getCode(data.docCode)
				}
				this.loading = true
				requestFunc(data).then(res => {
					console.log(res, 'result')
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
			this.searchHandle()
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		exportRecord () {
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}

				let queryWay = values.queryWay
				let requestFunc = queryWay === 1 ? api.exportCardStatusConstant : api.exportCardStatusSingle
				let query = this.filterForm.getFieldsValue()
				if (query.startDate == null && query.endDate == null) {
					return this.$message.warn('请输入开始和终止日期')
				}
				if (query.startDate) {
					query.startDate = moment(query.startDate).format("YYYY/MM/DD")
				}
				if (query.endDate) {
					query.endDate = moment(query.endDate).format("YYYY/MM/DD")
				}
				var days = new Date(query.endDate) - new Date(query.startDate)
				if (days < 0) {
					return this.$message.warn('结束日期必须大于开始日期')
				}
				if (days > 7948800000) {
					return this.$message.warn('起止时间间隔不能超过三个月')
				}
				if (query.docCode) {
					query.docCode = this.$refs.healthCardSelect.getCode(query.docCode)
				}
				requestFunc(query).then(res => {
					if (res.status === undefined) {
						// base64内容，文件名
						this.$downloadFileByBase64(res, `健管卡状态.xls`)
					} else {
						this.$message.error('文件下载失败,请重试')
					}
				}).finally(() => {
				})
			})
		}
	}
}
</script>
