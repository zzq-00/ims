<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="领用人查询">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="管理机构">
								<OrgSelect2 dicType="86" v-decorator="['orgCode',{initialValue: ''}]" @change="searchHandle" placeholder="请选择所属机构" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="领用人代码">
								<a-input v-decorator="['receiveCode', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="领用人姓名">
								<a-input v-decorator="['receiveName', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="证件类型">
								<DicSelect dicType="CERTI_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['receiveIdType', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="证件号码">
								<a-input v-decorator="['receiveIdNo', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="领用人类型">
								<DicSelect dicType="RECEIVE_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['receiveType', {initialValue: '', rules: [{ required: true, message: '领用人类型不能为空!' }]}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6" v-show="showDepartment()">
							<a-form-item label="部门">
								<a-input v-decorator="['receiveDepartment', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6" v-show="showChannel()">
							<a-form-item label="渠道">
								<DicSelect dicType="BRANCH_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['receiveChannel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12" :offset="11">
							<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
							<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
						</a-col>
					</a-row>
				</a-form>
			</a-card>
			<a-card style="margin-top:24px;">
				<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="tableColumns()" :rowKey="record => record.receiveId" :indentSize=0 :loading="loading">
					<a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
					<a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
					<a-badge slot="number" slot-scope="text, record" :count="text" :showZero="true" />
				</a-table>
			</a-card>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button type="primary" @click="submitForm">确定</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import OrgSelect2 from '@/components/org-select2'
import { Promise } from 'q'
export default {
	name: 'health-receiver-select',
	components: { DicSelect, OrgSelect2 },
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
			formModal: false,
			modalWidth: 1170,
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			loading: false,
			columns: [
				{
					align: "left",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "管理机构",
					dataIndex: "receiveOrgName"
				},
				{
					align: "left",
					title: "领用人代码",
					dataIndex: "receiveCode"
				},
				{
					align: "left",
					title: "领用人姓名",
					dataIndex: "receiveName"
				},
				{
					align: "left",
					title: "证件类型",
					dataIndex: "receiveIdTypeName"
				},
				{
					align: "left",
					title: "证件号码",
					dataIndex: "receiveIdNo"
				},
				{
					align: "left",
					title: "性别",
					dataIndex: "receiveGenderName"
				},
				{
					align: "left",
					title: "出生日期",
					dataIndex: "receiveBirthday"
				},
				{
					align: "left",
					title: "领用人类型",
					dataIndex: "receiveTypeDesc"
				}
			],
			rowSelection: {
				type: 'radio',
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

	},
	methods: {
		tableColumns () {
			let arr = [...this.columns]
			let type = this.filterForm.getFieldsValue().receiveType
			if (type === '01') {
				arr.push({
					align: "left",
					title: "渠道",
					dataIndex: "receiveChannel"
				})
			}
			if (type === '02') {
				arr.push({
					align: "left",
					title: "部门",
					dataIndex: "receiveDepartment"
				})
			}

			return arr
		},
		showChannel () {
		  if (this.filterForm.getFieldValue('receiveType') === '01') {
		    return true
			} else {
		    return false
			}
			// let type = this.filterForm.getFieldValue('receiveType')
			// return type === '01'
		},
		showDepartment () {
			if (this.filterForm.getFieldValue('receiveType') === '02') {
				return true
			} else {
				return false
			}
			// let type = this.filterForm.getFieldValue('receiveType')
			// return type === '02'
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
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}

				let query = this.filterForm.getFieldsValue()
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}
				Object.assign(data, query)
				this.loading = true
				api.queryReceiver(data).then(res => {
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
		show (obj) {
		  this.filterForm.setFieldsValue({receiveType: obj})
			this.formModal = true
		},
		submitForm () {
			if (this.selectedRows.length) {
				this.$emit('on-update', this.selectedRows[0])
				this.formModal = false
			} else {
				this.$message.warning('请选择一条记录')
			}
		}
	}
}
</script>
