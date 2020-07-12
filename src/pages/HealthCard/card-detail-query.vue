<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
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
					<a-col :span="6">
            <a-form-item label="销售渠道">
              <DicSelect dicType="SALE_CHANNEL" :allowClear="true" @change="searchHandle" v-decorator="['salesChannel', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
					<a-col :span="6">
            <a-form-item label="起始号码">
              <a-input v-decorator="['startNo', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="终止号码">
              <a-input v-decorator="['endNo', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="售出来源">
							<DicSelect dicType="PAYMENT_SOURCE" :allowClear="true" @change="searchHandle" v-decorator="['salesSource', {initialValue: ''}]" />
						</a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="健康卡状态">
              <DicSelect dicType="DOC_STATUS" :allowClear="true" @change="searchHandle" v-decorator="['status', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
				<a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="售出日期(开始)">
              <a-date-picker v-decorator="['salesStartDate',{initialValue: null}]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="售出日期(结束)">
              <a-date-picker v-decorator="['salesEndDate',{initialValue: null}]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="失效日期(起期)">
              <a-date-picker v-decorator="['invalidStartDate',{initialValue: null}]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="失效日期(止期)">
              <a-date-picker v-decorator="['invalidEndDate',{initialValue: null}]" format="YYYY-MM-DD" />
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
        <a-icon type="bank" /> 健管卡明细查询</span>
      	<a href="#" slot="extra">
        	<a-icon :type="iconType" @click="swithTableShow" />
				</a>
				<a-table :rowClassName= "(record, index) => { return 'ant-table-thead'}"
                 :scroll="{x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
					<a-button slot="oper" size="small" @click="showDetail(record)" slot-scope="text, record">查看</a-button>
				</a-table>
    </a-card>

		<CardDetailForm ref="cardDetailForm" />
  </a-card>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import HealthCardSelect from '@/components/health-card-select'
import HealthProductSelect from '@/components/health-product-select'
import OrgSelect2 from '@/components/org-select2'
import CardDetailForm from './components/card-detail-form'
import moment from "moment"
import { Promise } from 'q'
export default {
	name: 'health-card-detail-query',
	components: { DicSelect, HealthCardSelect, HealthProductSelect, OrgSelect2, CardDetailForm },
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
					align: "center",
					title: "管理机构代码",
					dataIndex: "orgCode"
				},
				{
					align: "center",
					title: "管理机构名称",
					dataIndex: "orgName"
				},
				{
					align: "center",
					title: "产品代码",
					dataIndex: "productCode",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "产品名称",
					dataIndex: "productName",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "健管卡代码",
					dataIndex: "docCode"
				},
				{
					align: "center",
					title: "健管卡名称",
					dataIndex: "docName"
				},
				{
					align: "center",
					title: "健管卡号码",
					dataIndex: "cardNo"
				},
				{
					align: "center",
					title: "健管卡状态",
					dataIndex: "status"
				},
				{
					align: "center",
					title: "领用人",
					dataIndex: "receptor"
				},
				{
					align: "center",
					title: "售出日期",
					dataIndex: "salesDate"
				},
				{
					align: "center",
					title: "失效日期",
					dataIndex: "invalidDate"
				},
				{
					align: "center",
					title: "销售渠道",
					dataIndex: "salesChannel",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "售出来源",
					dataIndex: "salesSource",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "收费方式",
					dataIndex: "paymentWay",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "金额",
					dataIndex: "faceAmount",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "费用承担机构",
					dataIndex: "budgetOrg"
				},
				{
					align: "center",
					title: "费用承担部门",
					dataIndex: "budgetDept",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "预算类型",
					dataIndex: "budgetType"
				},
				{
					align: "center",
					title: "预算名称",
					dataIndex: "budgetName",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "center",
					title: "项目名称",
					dataIndex: "itemName"
				},
				{
					align: "center",
					title: "密码",
					dataIndex: "clearText"
				},
				{
					align: "center",
					fixed: 'right',
					title: "查看",
					dataIndex: "bizType",
					scopedSlots: { customRender: 'oper' }
				}
			],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			pagination: {
				pageSize: 5,
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
			if (data.docCode) {
				data.docCode = this.$refs.healthCardSelect.getCode(data.docCode)
			}
			this.loading = true
			api.queryCardDetail(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
					item.invalidDate ? item.invalidDate = item.invalidDate.split(' ')[0] : ''
					item.salesDate ? item.salesDate = item.salesDate.split(' ')[0] : ''
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
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
			let query = this.filterForm.getFieldsValue()
			if (query.salesStartDate == null && query.salesEndDate == null) {
				return this.$message.warn('请输入售出开始和结束日期')
			}
			if (query.salesStartDate) {
				query.salesStartDate = moment(query.salesStartDate).format("YYYY/MM/DD")
			}
			if (query.salesEndDate) {
				query.salesEndDate = moment(query.salesEndDate).format("YYYY/MM/DD")
			}
			var days = new Date(query.salesEndDate) - new Date(query.salesStartDate)
			if (days < 0) {
				return this.$message.warn('结束日期必须大于开始日期')
			}
			if (days > 7948800000) {
				return this.$message.warn('起止时间间隔不能超过三个月')
			}

			if (query.docCode) {
				query.docCode = this.$refs.healthCardSelect.getCode(query.docCode)
			}
			api.exportCardDetail(query).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `健管卡明细信息.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			}).finally(() => {
			})
		},
		showDetail (obj) {
		  if (obj.status === '01-待售') {
		    this.$message.error("尚未生成协议！")
				return
			}
			this.$refs.cardDetailForm.editForm(obj)
		}
	}
}
</script>
<style lang="less">
  .ant-table-thead > tr > th {
    padding: 16px 5px;
    overflow-wrap: break-word;
  }
</style>
