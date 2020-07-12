<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1200" title="重新发送短信" footer="">
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />已发短信列表</span>
      <div slot="extra">
        <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
        <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
      </div>
      <div>
        <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="手机号">
                <a-input v-decorator="['mobile']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="类型">
                <DicSelect dicType="VIP_MSGTYPESTATUS" v-decorator="[ 'deptid',{initialValue:'0'}]" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :bordered="false" @rowClick="selectRowClick" :rowSelection="rowSelection" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="index => index.index" :indentSize=0 :loading="loading">

      </a-table>
      <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />重新发送短信</span>
        <div slot="extra">
          <a-button type="primary" class="editable-add-btn" @click="doSendSms()" style="margin-right:5px;">重新发送</a-button>
        </div>
        <a-form :form="saveForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="5">
              <a-form-item label="移动电话">
                <a-input v-decorator="['mobile',{rules: [{ required: true, message: '移动电话不能为空!' }]}]"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="20" :pull="6">
              <a-form-item label="短信内容">
                <a-textarea v-decorator="['message',{rules: [{ required: true, message: '短信内容不能为空!' }]}]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-card>
  </a-modal>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import moment from 'moment'
export default {
	name: 'send-sms-info',
	components: { DicSelect },
	data () {
		const self = this
		return {
			formModal: false,
			parentData: {},
			saveForm: this.$form.createForm(this, {name: "saveForm"}),
			filterForm: this.$form.createForm(this, {name: "filterForm"}),
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			loading: false,
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			},
			rowSelection: {
				type: 'radio',
				selectedRowKeys: [],
				selectedRows: [],
				onChange: (selectedRowKeys, selectedRows) => {
					self.rowSelection.selectedRows = []
					self.rowSelection.selectedRowKeys = []
					self.rowSelection.selectedRows = selectedRows
					self.rowSelection.selectedRowKeys = selectedRowKeys
					self.setFormValue()
				}
			},
			currRowIndex: -1,
			columns: [
				{
					align: "left",
					title: "姓名",
					dataIndex: "name",
					width: '120px'
				},
				{
					align: "left",
					title: "手机号",
					dataIndex: "mobile",
					width: '80px'
				},
				{
					align: "left",
					title: "消息",
					dataIndex: "message"
				},
				{
					align: "left",
					title: "发送状态",
					dataIndex: "sendflagName",
					width: '80px'
				},
				{
					align: "left",
					title: "类型",
					dataIndex: "deptid",
					width: '80px'
				},
				{
					align: "left",
					title: "发送时间",
					dataIndex: "sendtime",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					},
					width: '120px'
				}
			],
      		sendParams: {}
		}
	},
	methods: {
		show (obj) {
			this.formModal = true
			this.parentData = obj
			this.searchHandle()
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		loadPageData () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			this.loading = true
			api.getVipSendMessageList(Object.assign(data, query, this.parentData)).then(res => {
				this.pageData = res.data ? { totalCount: res.data.length, data: res.data } : { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
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
		selectRowClick (record, index) {
			// if (this.currRowIndex === index) {
			// 	this.currRowIndex = -1
			// 	this.rowSelection.selectedRowKeys = []
			// } else {
			// 	this.currRowIndex = index
			// 	this.rowSelection.selectedRowKeys = []
			// 	this.rowSelection.selectedRowKeys.push(index)
			// 设置初始值
			// this.setFormValue(record)
        	this.sendParams = record
			// }
		},
		setFormValue () {
			const { mobile, message } = this.rowSelection.selectedRows[0]
			this.saveForm.setFieldsValue({ mobile })
			this.saveForm.setFieldsValue({ message })
		},
		doSendSms () {
			let self = this
			this.saveForm.validateFields((error, values) => {
				// TODO
				let mobile = this.saveForm.getFieldsValue().mobile
				let message = this.saveForm.getFieldsValue().message
				if (mobile === "" || message === "") {
					this.$message.warning('您填写的数据有误或者必填项没填!')
					return
				}
				if (error) {
					return
				}
				this.$confirm({
					title: '确认提示',
					content: `确认给"${mobile}"手机号重新发送短息吗？`,
					okType: 'danger',
					onOk () {
						api.saveVipSendMessageByVipId(Object.assign({}, self.sendParams, values, self.parentData)).then(res => {
							if (res.status === 0) {
								self.$message.success('发送成功')
								self.saveForm.setFieldsValue({mobile: ""})
				                self.saveForm.setFieldsValue({message: ""})
								self.loadPageData()
								self.rowSelection.selectedRows=[]
								self.rowSelection.selectedRowKeys=[]
							} else {
								self.$message.error('发送失败')
							}
						})
					}

				})
			})
		}
	}
}

</script>
<style>

</style>
