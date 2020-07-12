<template>
  <a-card >
    <a-card>
      <a-divider orientation="left">
        <a-icon type="file-search" /> 提问者基本信息</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="咨询时间">
             <a-date-picker  format="YYYY-MM-DD" v-decorator="['questionBeginTime',]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="至">
             <a-date-picker  format="YYYY-MM-DD" v-decorator="['questionEndTime',]"/>
            </a-form-item>
          </a-col>
        </a-row>
         <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="returnLastPage">返回</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="resetFilterForm">重置</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="queryInfo">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
     <a-table v-show="showTable"  :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination"  :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading">
      <a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
     </a-table>
    </a-card>
    <a-modal v-model="formModal" style="top: 10px;" >
     <a-form :form="filterForms" :labelCol="filterFormLayout2.labelCol" :wrapperCol="filterFormLayout2.wrapperCol">
        <a-row >
          <a-col >
            <a-form-item label="咨询内容">
              <a-textarea placeholder="" :rows="4" v-decorator="['healthConsultationContent', {initialValue: ''}]"  :disabled="disabled"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row >
          <a-col >
            <a-form-item label="答复内容">
             <a-textarea  :rows="4"  v-decorator="['responseContent', {initialValue: ''}]" :disabled="disabled"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">确定</a-button>
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import api from "@/api/api-health-consult"
import moment from "moment"
export default {
	props () {

	},
	data () {
		return {
			formModal: false,
			disabled: true,
			showTable: true,
			filterForm: this.$form.createForm(this),
			filterForms: this.$form.createForm(this),
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			filterFormLayout2: {
				labelCol: { span: 3 },
				wrapperCol: { span: 18 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			selectedRows: [],
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
			},
			columns: [
				{
					align: "left",
					title: "序号",
					dataIndex: "recordIndex",
					// dataIndex:'',
					customRender: (text, record, index) => {
						return `${index + 1}`
					}
					// scopedSlots: { customRender: "docCode" }
				},
				{
					align: "left",
					title: "咨询内容",
					dataIndex: "healthConsultationContentMiNi",
					scopedSlots: { customRender: "docCode" }
				},
				{
					align: "left",
					title: "答复内容",
					dataIndex: "responseContentMiNi"
				},
				{
					align: "left",
					title: "咨询时间",
					dataIndex: "insertTime"
				},
				{
					align: "left",
					title: "答复时间",
					dataIndex: "uptime"
				}
			],
			loading: false,
			questionerName: '',
			questionerIdentityNumber: '',
			selectedRow: ''
		}
	},
	watch: {

	},
	mounted () {
		let query = this.$route.params
		this.showInfo(query.id)
	},
	methods: {
		// 查询
		queryInfo () {
			this.loadPageData()
		},
		// 重置
		resetFilterForm () {
			this.filterForm.resetFields()
			this.loadPageData()
		},
		// 返回
		returnLastPage () {
			this.$router.back('-1')
		},
		// 获取咨询者信息
		showInfo (id) {
			let data = {
				questionerID: id
			}
			this.loading = true
			api.questionerInfoQuery(data).then(res => {
				console.log(res.data[0])
				this.$nextTick(() => {
				   this.filterForm.setFieldsValue(res.data[0] || {})
				   this.questionerName = res.data[0].questionerName
				   this.questionerIdentityNumber = res.data[0].questionerIdentityNumber
				   this.questionerName ? this.loadPageData() : this.$message.error('获取数据错误')
			   })
			}).finally(() => {
				this.loading = false
			})
		},
		onPageChange (page, pageSize) {
			this.$nextTick(() => {
				this.pagination.current = page
				this.loadPageData()
			})
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.pagination.current = 1
			this.$nextTick(() => {
              	this.loadPageData()
			})
		},
		loadPageData () {
			let query = this.filterForm.getFieldsValue()
			let questionBeginTime = ""
			if (query.questionBeginTime) {
				questionBeginTime = moment(query.questionBeginTime).format('YYYY-MM-DD')
			}
			let questionEndTime = ""
			if (query.questionBeginTime) {
				questionEndTime = moment(query.questionEndTime).format('YYYY-MM-DD')
			}
			let queryDate = {
				questionBeginTime: questionBeginTime,
				questionEndTime: questionEndTime
			}
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				questionerName: this.questionerName,
				questionerIdentityNumber: this.questionerIdentityNumber
			}
			queryDate ? Object.assign(data, queryDate) : ""
			this.loading = true
			api.queryConsultationHistory(data).then(res => {
				// console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				res.data.data && res.data.data.length > 0 ? this.$message.success('查询成功') : this.$message.success('查询成功')
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		showRecordInfo (record) {
		  console.log("record:", record)
			this.formModal = true
			this.$nextTick(() => {
				this.filterForms.setFieldsValue(record)
			})
		}
	},
	created () {
	}

}
</script>
