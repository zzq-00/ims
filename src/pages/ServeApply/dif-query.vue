<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="申请人姓名">
              <a-input v-decorator="['applyName', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务卡号码">
              <a-input v-decorator="['cardNo', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="产品名称">
              <a-input v-decorator="['productName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="处理状态">
              <DicSelect dicType="SI_DIF_STATUS" v-decorator="['dealResult', { initialValue: '' }]" :allowClear="true" @change="searchHandle" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="处理人">
              <a-input v-decorator="['handleName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="search" /> 查询显示</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :rowSelection1="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
        <a slot="serviceName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text || '-' }}</a>
				<span slot="textVal" slot-scope="text, record">{{ text || '-' }}</span>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
    </a-card>

		<ApplyInfoDetails ref="applyInfoDetails" />
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import ApplyInfoDetails from "@/pages/ServeApply/apply-info-details"
export default {
	name: "serve-apply-dif-query",
	components: { DicSelect, ApplyInfoDetails },
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
			submitLoading: false,
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "产品名称", dataIndex: "productName" },
				{ title: "服务名称", dataIndex: "serviceName", scopedSlots: { customRender: "serviceName" } },
				{ title: "服务商名称", dataIndex: "sorgName" },
				{ title: "服务卡号码", dataIndex: "cardNo" },
				{ title: "申请人姓名", dataIndex: "applyName", scopedSlots: { customRender: "textVal" } },
				{ title: "性别", dataIndex: "applySex", scopedSlots: { customRender: "textVal" } },
				{ title: "申请日期", dataIndex: "applyTime" },
				{ title: "当前状态", dataIndex: "statusDesc" },
				{ title: "处理状态", dataIndex: "dealResultDesc" },
				{ title: "申请方式", dataIndex: "channelTypeDesc" },
				{ title: "处理人", dataIndex: "handleName" }
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
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
		}
	},
	mounted () {
		this.searchHandle()
	},
	methods: {
		onChange (date, dateString) {
			console.log(date, dateString)
		},
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
			api.queryDiffQuery(data).then(res => {
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
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		addRecord () {

		},
		showRecordInfo (obj) {
			this.$refs.applyInfoDetails.show(obj)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		}
	}
}
</script>

