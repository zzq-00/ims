<template>
<a-card >
  <a-card>
      <a-divider orientation="left">
        <a-icon type="file-search" /> 提问者基本信息</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="提问者姓名">
              <a-input v-decorator="['questionerName']"  :disabled="disabled"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="提问者性别">
              <a-input v-decorator="['questionerGenderDescribe']"  :disabled="disabled"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="出生日期">
              <a-input v-decorator="['questionerBirthday']"  :disabled="disabled"/>
            </a-form-item>
          </a-col>
           <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input v-decorator="['questionerIdentityTypeDescribe']"  :disabled="disabled"/>
            </a-form-item>
          </a-col>
           <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['questionerIdentityNumber']"  :disabled="disabled"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>


  <a-card style="margin-top:24px;">
   	<a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :rowSelection="rowSelections" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.questionerID" :indentSize="0" :loading="loading">
			 <a-tag slot="responseStateDescribe" slot-scope="text" :color="text=== '已答复' ? 'green' : 'orange'">{{text}}</a-tag>
		</a-table>
    </a-card>
    <a-card style="margin-top:24px;">
    <a-form :form="filterForms" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="14">
            <a-form-item label="咨询内容">
             <a-textarea placeholder="" :rows="4" v-decorator="['healthConsultationContent', {initialValue: ''}]"  :disabled="disabled"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="14">
            <a-form-item label="答复内容">
             <a-textarea  :rows="4" v-decorator="['responseContent', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
         <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="returnLastPage">返回</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="toResportPage">答复历史</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="submiteRsponseContent">发送</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    </a-card>
</template>
<script>
import api from "@/api/api-consult-query"
export default {
	props () {

	},
	data () {
		return {
			disabled: true,
			showTable: true,
			filterForm: this.$form.createForm(this),
			filterForms: this.$form.createForm(this),
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
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
			rowSelections: {
				type: 'radio',
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
					this.onChangeSelect(selectedRows)
				}
			},
			columns: [
				{
					align: "left",
					title: "序号",
					customRender: (text, record, index) => {
						return `${index + 1}`
					},
					width: 70
				},
				{
					align: "left",
					title: "健康咨询编号",
					dataIndex: "healthConsultationCode"
				},
				{
					align: "left",
					title: "咨询内容",
					dataIndex: "healthConsultationContentMiNi",
					width: 200
				},
				{
					align: "left",
					title: "咨询来源",
					dataIndex: "healthConsultationSourceDescribe",
					width: 100
				},
				{
					align: "left",
					title: "咨询时间",
					dataIndex: "questionerQuestionTime"
				},
				{
					align: "left",
					title: "答复时间",
					dataIndex: "finalResponseTime"
				},
				{
					align: "left",
					title: "状态",
					dataIndex: "responseStateDescribe",
					scopedSlots: { customRender: "responseStateDescribe" }
				}
			],
			loading: false,
			questionerName: '',
			questionerIdentityNumber: '',
			selectedRow: '',
			questionerID: ''
		}
	},
	watch: {

	},
	mounted () {
		this.$nextTick(() => {
			let query = this.$route.params
         	this.showInfo(query.id)
			this.questionerID = query.id
		})
	},
	methods: {
		// 获取咨询者信息
		showInfo (id) {
			let data = {
				questionerID: id
			}
			this.loading = true
			api.questionerInfoQuery(data).then(res => {
				this.$nextTick(() => {
				   this.filterForm.setFieldsValue(
					  res.data[0]
				   )
				   this.questionerName = res.data[0].questionerName
				   this.questionerIdentityNumber = res.data[0].questionerIdentityNumber
				   this.questionerName ? this.loadPageData() : this.$message.error('此人无咨询记录')
			   })
			}).finally(() => {
				this.loading = false
			})
		},
		onChangeSelect (selectedRows) {
			this.selectedRow = selectedRows
			console.log(selectedRows)
			this.$nextTick(() => {
				 this.filterForms.setFieldsValue(selectedRows[0])
				 this.QueryReplyHistoryList(selectedRows[0])
			})
		},
		QueryReplyHistoryList (data) {
			this.loading = true
			 api.QueryReplyHistoryList(data).then(res => {
				 console.log(res.data)
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
			this.paginations.current = 1
			this.loadPageData()
		},
		returnLastPage () {
			this.$router.back('-1')
		},
		toResportPage () {
			this.$router.push({
				path: `HealthConsultResponesPage/${this.questionerID}`
				// params: {questionerID: }
			})
		},
		isSubmiteRsponseContent () {
		   this.selectedRow && this.selectedRow[0] ? this.submiteRsponseContent() : this.$message.info('请至少选择一条数据!')
		},
		submiteRsponseContent () {
			let query = this.filterForms.getFieldsValue()
			const datas = this.selectedRow[0]
			if (!this.selectedRow || !this.selectedRow[0]) {
		 	  return	this.$message.error('请至少选择一条数据!')
			}
			if (!query.responseContent || query.responseContent === 0) {
				  this.$message.error('回复内容不能为空!')
			} else {
				this.loading = true
				datas.responseContent = query.responseContent
				const conlData = {
					0: true
				}
				Object.assign(conlData, datas)
				const data = {
					conlData: conlData
				}
				this.loading = true
				api.saveReplyHistoryAndSendToInterface(data).then(res => {
			   this.$message.success('信息保存并发送成功')
			   this.filterForms.resetFields()
			   this.selectedRows = []
					this.$nextTick(() => {
						this.pagination.current = 1
						this.pagination.pageSize = 10
						this.loadPageData()
					})
				}).finally(() => {
					this.loading = false
				})
			}
		},
		loadPageData () {
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				questionerName: this.questionerName
			}
			// Object.assign(data, query)
			this.loading = true
			api.healthConsultationDetailQuery(data).then(res => {
				// console.log(res, "result")
				if (res.status !== 500) {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
					this.pagination.total = this.pageData.totalCount
				} else {
					// this.$message.error('网络错误！')
				}
			}).finally(() => {
				this.loading = false
			})
		}
	}
}
</script>
