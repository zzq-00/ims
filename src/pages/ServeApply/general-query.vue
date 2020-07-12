<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="服务卡号码">
              <a-input v-decorator="['cardNo', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品名称">
              <a-input v-decorator="['productName', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="当前状态">
              <DicSelect dicType="ACTUALIZED_STATUS" v-decorator="['status', { initialValue: '' }]" :allowClear="true" @change="searchHandle" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="申请方式">
              <DicSelect dicType="ST_SYS_NO" v-decorator="['channelType', { initialValue: '' }]" :allowClear="true" @change="searchHandle" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人姓名">
              <a-input v-decorator="['patientName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人证件类型">
              <DicSelect dicType="CERTI_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['applyCerttype', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人证件号码">
              <a-input v-decorator="['applyCertno', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人手机号码">
              <a-input v-decorator="['applyTel', {initialValue: '', rules: [{ pattern:new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/),message: '手机号格式不正确'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务申请起期">
              <a-date-picker v-decorator="['applyBeginTime', { initialValue: null }]" format="YYYY/MM/DD"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务申请止期">
              <a-date-picker v-decorator="['applyEndTime', { initialValue: null }]" format="YYYY/MM/DD"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="回访完成起期">
              <a-date-picker v-decorator="['returnStartTime', { initialValue: null }]" format="YYYY/MM/DD"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="回访完成止期">
              <a-date-picker v-decorator="['returnEndTime', { initialValue: null }]" format="YYYY/MM/DD"/>
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="服务实施处理人">
							<a-input v-decorator="['handleName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="" :loading="submitLoading" class="editable-add-btn" @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
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
      <a-table v-show="showTable" :scroll="{ x: 'calc(2400px + 50%)'}" :bordered="false" :pagination="pagination" :rowSelection1="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading">
        <span slot="textVal" slot-scope="text, record">{{ text || '-' }}</span>
        <a slot="serviceName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
      </a-table>
    </a-card>

		<ApplyInfoDetails ref="applyInfoDetails" />
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import ApplyInfoDetails from "@/pages/ServeApply/apply-info-details"
import { turn2NewPage } from "@/libs/util"
import moment from 'moment'

export default {
	name: "serve-apply-general-query",
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
				{ title: "就诊人姓名", dataIndex: "patientName" },
				{ title: "就诊人性别", dataIndex: "patientGenderDesc" },
				{ title: "就诊人证件类型",	dataIndex: "patientCerttypeDesc" },
				{ title: "就诊人证件号码", dataIndex: "patientCertNo" },
				{ title: "就诊人手机号码", dataIndex: "patientTelephone" },
				{ title: "申请日期", dataIndex: "applyTime" },
				{ title: "所属队列", dataIndex: "queueName" },
				{ title: "当前状态", dataIndex: "statusDesc" },
				{ title: "回访完成时间", dataIndex: "returnTime" },
				{ title: "申请方式", dataIndex: "channelTypeDesc" },
				{ title: "服务实施处理人", dataIndex: "handleNameDef" },
				{ title: "当前处理人", dataIndex: "handleName" }
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
				limit: this.pagination.pageSize,
				patientCerttype: query.applyCerttype, // 就诊人证件类型
				patientCertNo: query.applyCertno, // 就诊人证件号
				patientTelephone: query.applyTel// 就诊人手机号

			}
			Object.assign(data, query)
			if (data.applyBeginTime !== null) {
				data.applyBeginTime = moment(data.applyBeginTime).format('YYYY-MM-DD')
			}
			if (data.applyEndTime !== null) {
				data.applyEndTime = moment(data.applyEndTime).format('YYYY-MM-DD')
			}
			if (data.returnStartTime !== null) {
				data.returnStartTime = moment(data.returnStartTime).format('YYYY-MM-DD')
			}
			if (data.returnEndTime !== null) {
				data.returnEndTime = moment(data.returnEndTime).format('YYYY-MM-DD')
			}
			this.loading = true
			api.queryGeneralQuery(data).then(res => {
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
		},
		exportRecord () {
			let query = this.filterForm.getFieldsValue()
			if (query.applyBeginTime !== null) {
				query.applyBeginTime = moment(query.applyBeginTime).format('YYYY-MM-DD')
			}
			if (query.applyEndTime !== null) {
				query.applyEndTime = moment(query.applyEndTime).format('YYYY-MM-DD')
			}
			if (query.returnStartTime !== null) {
				query.returnStartTime = moment(query.returnStartTime).format('YYYY-MM-DD')
			}
			if (query.returnEndTime !== null) {
				query.returnEndTime = moment(query.returnEndTime).format('YYYY-MM-DD')
			}
			// let data = {
			// 	page: this.pagination.current,
			// 	limit: this.pagination.pageSize
			// }
			// Object.assign(data, query)
			this.submitLoading = true
			api.exportGeneralQuery(query).then(res => {
				if (res !== (undefined || '')) {
					this.$downloadFileByBase64(res, `综合查询导出.xlsx`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			}).finally(() => {
				this.submitLoading = false
			})
		}
	}
}
</script>

