<template>
  <a-card :bordered="false">
    <a-card style="margin-top: 24px">
        <span href="#" slot="title" style="float:left;">
        <a-icon type="search" /> 查询条件</span>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="2">
          <a-col :span="12">
            <a-form-item label="起始时间">
              <a-date-picker  :allowClear="true"   v-decorator="['startDate',{rules: [{ required:true, message:'该项目为必填项目'}]}]">
            </a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间">
              <a-date-picker  :allowClear="true"  v-decorator="['endDate',{rules: [{ required:true, message:'该项目为必填项目'}]}]"  >
              </a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-button style="float: right" @click="Query">批处理日志查询</a-button>
    </a-card>
    <a-card style="margin-top: 24px">
        <span href="#" slot="title" style="float:left;">
        <a-icon type="form" />系统操作日志查询结果</span>
      <a-table :rowSelection="{	type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :dataSource="resultData" :pagination="pagination" :columns="columns" :indentSize=0 :spinning="spinning"></a-table>
      <br>
      <a-button @click="show" :disabled="this.selectedRowKeys.length===0">导出日志下载地址</a-button>
      <div v-show="showDiv">
      <a-form  :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="2">
          <a-col :span="8">
            <a-form-item label="事件号码">
              <span>{{this.selectedInfo.eventNo}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="事件类型">
              <span >{{this.selectedInfo.eventType}}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div>
        <a-button @click="downLoad">下载选中日志</a-button>
      </div>
      </div>
    </a-card>
  </a-card>
</template>

<script>
import api from '@/api/api-logQuery'
import moment from 'moment'
export default {
	name: "logQurey",
	data () {
		return {
			dateFormat: 'YYYY-MM-DD',
			file: '',
			showDiv: false,
			selectedInfo: '',
			filterFormLayout: {
				labelCol: {span: 9},
				wrapperCol: {span: 15}
			},
			filterForm: this.$form.createForm(this),
			selectData: {limit: 10, page: 1, startDate: '', endDate: ''},
			filterForm0: this.$form.createForm(this),
			selectedRowKeys: [],
			selectedRow: '',
			downFile: '',
			resultData: '',
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
					align: "center",
					title: "序号",
					customRender: (value, row, index) => `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1}`
				},
				{
					align: "center",
					title: "事件号码",
					dataIndex: "eventNo"

				},
				{
					align: "center",
					title: "事件类型",
					dataIndex: "eventType"

				},
				{
					align: "center",
					title: "日志文件名称",
					dataIndex: "logFileName"

				},
				{
					align: "center",
					title: "执行状态",
					dataIndex: "performState"

				},
				{
					align: "center",
					title: "操作日期",
					dataIndex: "modifyDate",
					customRender: (value, row, index) => `${row.modifyDate.toString().substring(0, 10)}`

				},
				{
					align: "center",
					title: "操作时间",
					dataIndex: "modifyTime"

				}]

		}
	},
	created () {
		 var date = moment(new Date(), 'YYYY-MM-DD')
		var date1 = moment(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD')
		if (date !== '' && date !== null && date1 !== '' && date1 !== null) {
			this.selectData.startDate = date1.format('YYYY-MM-DD')
			this.selectData.endDate = date.format('YYYY-MM-DD')
		}
		this.loadData(this.selectData)
	},
	methods: {
		moment,
		onSelectChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys
			this.selectedRow = selectedRows[0]
			this.downFile = selectedRows[0].eventNo
      this.file= selectedRows[0].logFileName
			this.selectedInfo = {eventNo: this.selectedRow.eventNo, eventType: this.selectedRow.eventType}
		},
		show () {
			this.showDiv = true
		},
		Query () {
			this.filterForm.validateFields(err => {
				if (err) {
					this.$message.warning('请填写必填项目')
				} else {
					let data = {
						...this.filterForm.getFieldsValue(),
						limit: 10,
						page: 1
					}
					this.pagination.current = 1
					this.pagination.pageSize = 10
					if (data.startDate !== null && data.startDate !== '' && data.startDate !== undefined) {
					  data.startDate = data.startDate.format("YYYY-MM-DD")
					}
					if (data.endDate !== null && data.endDate !== '' && data.endDate !== undefined) {
					  data.endDate = data.endDate.format("YYYY-MM-DD")
					}
					if (data.endDate !== null && data.endDate !== '' && data.endDate !== undefined && data.startDate !== null && data.startDate !== '' && data.startDate !== undefined) {
					 if (data.startDate > data.endDate) {
							this.$message.warning('结束日期不能早于开始日期')
							return
						}
					}
					this.selectData = data
					this.loadData(data)
				}
			})
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.pagination.pageSize = pageSize
			this.selectData.limit = pageSize
			this.selectData.page = page
			this.loadData(this.selectData)
		},
		onPageSizeChange (current, size) {
			this.pagination.current = 1
			this.pagination.pageSize = size
			this.selectData.limit = size
			this.selectData.page = 1
			this.loadData(this.selectData)
		},
		loadData (data) {
			this.selectedRowKeys = []
			this.showDiv = false
			this.selectedInfo = ''
			this.downFile = ''
			this.filterForm0.resetFields()
			api.queryLog(data).then(res => {
				this.resultData = res.data.data
				this.pagination.total = res.data.totalCount
			})
			console.log(data)
		},
		downLoad () {
			if (this.selectedRowKeys.length === 0) {
				this.$message.warning('请选中一条记录')
				return
			}
			api.downLog({eventNo: this.downFile}).then(res => {
				this.$downloadFileByBase64(res, this.file)
			})
		}
	}

}
</script>

<style scoped>

</style>
