<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="提问者姓名">
              <a-input v-decorator="['questionerName', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="提问者证件号码">
              <a-input v-decorator="['questionerIdentityNumber', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="咨询时间">
              <a-range-picker :readonly="true" v-decorator="['questionBeginTime', {initialValue: null}]"  format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="咨询内容">
              <a-input v-decorator="['healthConsultationContent', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="咨询来源">
              <DicSelect ref="dicCatCode" dicType="HEALTH_CONSULTATION_SOURCE" :allowClear="true" @change="searchHandle" v-decorator="['healthConsultationSource', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="答复人">
              <a-input v-decorator="['responsePerson', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="状态">
              <DicSelect dicType="RESPONSE_STATE" :removeList="removeListArr" :allowClear="true" @change="searchHandle" v-decorator="['responseState', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="primary" :loading="aloading" class="editable-add-btn" @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 查询结果</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination"  :dataSource="pageData.data" :columns="columns" :rowKey="record => record.questionerID" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
        <a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
        <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
        <a-tag slot="responseStateDescribe" slot-scope="text" :color="text=== '已答复' ? 'green' : 'orange'">{{text}}</a-tag>
      </a-table>
    </a-card>

  </a-card>
</template>
<script>
import api from "@/api/api-health-consult"
import DicSelect from "@/components/dic-select"
import moment from 'moment'
export default {
	name: "consult-query",
	components: { DicSelect },
	data () {
		return {
			removeListArr: ['03'],
			visible: true,
			confirmLoading: false,
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
			selectedRowKeys: [],
			loading: false,
			aloading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{ title: "序号", customRender: (text, record, index) => { return `${index + 1}` } },
				{ title: "健康咨询编号", dataIndex: "healthConsultationCode", scopedSlots: { customRender: "healthConsultationCode" } },
				{ title: "咨询内容", dataIndex: "healthConsultationContentMiNi", scopedSlots: { customRender: "healthConsultationContentMiNi" } },
				{ title: "咨询来源", dataIndex: "healthConsultationSourceDescribe" },
				{ title: "提问者姓名", dataIndex: "questionerName", scopedSlots: { customRender: "docCode" } },
				{ title: "提问者证件号码", dataIndex: "questionerIdentityNumber" },
				{ title: "咨询时间", dataIndex: "questionerQuestionTime" },
				// { title: "答复人", dataIndex: "responsePerson " },
				{ title: "答复时间", dataIndex: "finalResponseTime" },
				{ title: "状态", dataIndex: "responseStateDescribe", scopedSlots: { customRender: "responseStateDescribe" } }
			],
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
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
		},
		handleCancel () {
			this.visible = false
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
			this.loadPageData()
		},
		loadPageData () {
			this.selectedRows = []
			this.selectedRowKeys = []

			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			// 重新组装咨询时间参数
			let betweenTime = data.questionBeginTime
			data.questionBeginTime = betweenTime ? moment(betweenTime[0]).format('YYYY-MM-DD') : ''
			data.questionEndTime = betweenTime ? moment(betweenTime[1]).format('YYYY-MM-DD') : ''
			this.loading = true
			api
				.healthConsultationQuery(data)
				.then(res => {
					console.log(res, "result")
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
					this.pagination.total = this.pageData.totalCount
				})
				.finally(() => {
					this.loading = false
				})
		},
		getDocCatName (code) {
			return this.$refs.dicCatCode.getName(code)
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		addRecord () {

		},
		showRecordInfo (record) {
			this.$router.push({
				path: `HealthConsultInfoPage/${record.questionerID}`
				// params: {questionerID: }
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		exportRecord () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			// 重新组装咨询时间参数
			let betweenTime = data.questionBeginTime
			data.questionBeginTime = betweenTime ? moment(betweenTime[0]).format('YYYY-MM-DD') : ''
			data.questionEndTime = betweenTime ? moment(betweenTime[1]).format('YYYY-MM-DD') : ''
			this.aloading = true
			api.exportRecord(data).then(res => {
				if (res !== undefined) {
					this.$downloadFileByBase64(res, `健康咨询记录导出.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
				console.log('处理加载')
				this.aloading = false
			})
		}
	}
}
</script>
