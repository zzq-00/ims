<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="管家工号">
							<a-input :allowClear="true" v-decorator="['staffNo', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="管家姓名">
							<a-input :allowClear="true" v-decorator="['staffName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="管理机构">
							<OrgSelect2 dicType="Attach_86_1" :Attach_86_1="Attach_86_1" v-decorator="['orgCode', {initialValue: ''}]" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="管家序列类型">
							<DicSelect dicType="STAFF_SEQ_TYPE" v-decorator="['staffSeqType', {initialValue: ''}]" placeholder="请选择" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="是否开通账号">
							<DicSelect dicType="YES_NO" v-decorator="[ 'accountStatus', {initialValue: 'N'} ]" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="账户开通日期" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
							<a-range-picker :allowClear="true" v-decorator="['timeArr']" format="YYYY/MM/DD" @blur="checkAccountStatus"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button :loading="aloading" type="" class="editable-add-btn"  @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">	<a-icon type="bank" /> 管家列表</span>
			<a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.staffId" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
				<a slot="staffNo" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
			</a-table>

			<a-row style="margin-top: 20px;">
				<a-col :span="12" :offset="11">
					<a-button type="" v-if="false" :disabled="!selectedRows.length" @click="cancelAcount" class="editable-add-btn" style="float:right;margin-right:10px;">帐号注销</a-button>
					<a-button type="" v-if="false" :disabled="!selectedRows.length" @click="resetPassword" class="editable-add-btn" style="float:right;margin-right:10px;">密码重置</a-button>
					<a-button type="" :disabled="!selectedRows.length" @click="createAcount" class="editable-add-btn" style="float:right;margin-right:10px;">开通帐号</a-button>
					<a-button type="primary" class="editable-add-btn" @click="addRecord" style="float:right;margin-right:10px;">新增序列外管家</a-button>
				</a-col>
			</a-row>
		</a-card>

		<StaffManagerForm ref="staffManagerForm" @on-update="loadPageData" />
	</a-card>
</template>
<script>
import moment from 'moment'
import api from "@/api/api-process-config"
import DicSelect from "@/components/dic-select"
import OrgSelect2 from "@/components/org-select2"
import StaffManagerForm from "./components/staff-manager-form"
import { Promise } from "q"
import qs from "qs"
export default {
	name: "staff-manager",
	components: { DicSelect, OrgSelect2, StaffManagerForm },
	data () {
		return {
			Attach_86_1: [
				{type: 9001, value: '总部健管中心'},
				{type: 9002, value: '集团健管中心'}
			],
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
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
				{ title: "序号",	dataIndex: "recordIndex" },
				{ title: "管家工号", dataIndex: "staffNo", scopedSlots: { customRender: "staffNo" } },
				{ title: "管家姓名", dataIndex: "staffName" },
				{ title: "用户名", dataIndex: "userName", scopedSlots: { customRender: "textVal" } },
				{ title: "电话", dataIndex: "tel", scopedSlots: { customRender: "textVal" } },
				{ title: "管家序列类型", dataIndex: "staffSeqTypeDesc" },
				{ title: "账号开通日期", dataIndex: "dredgeDate", scopedSlots: { customRender: "textVal" } },
				{ title: "用户角色", dataIndex: "userRoleDescribe", scopedSlots: { customRender: "textVal" } },
				{ title: "状态", dataIndex: "statusDesc", scopedSlots: { customRender: "textVal" } }
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
			this.selectedRows = []
			this.selectedRowKeys = []

			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			if (data.timeArr && data.timeArr.length) {
				data.beginTime = moment(data.timeArr[0]).format('YYYY/MM/DD')
				data.endTime = moment(data.timeArr[1]).format('YYYY/MM/DD')
				delete data.timeArr
			}

			this.loading = true
			api.staffAllQHousekeeperInfo(data).then(res => {
				console.log(res, "result")
				this.pageData.data = res.data || []
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				console.log(res.data.length)
				this.pagination.total = this.pageData.data.length
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		checkAccountStatus () {
			// let query = this.filterForm.getFieldsValue()
			// console.log(query)
			if (this.filterForm.getFieldsValue(['timeArr']) !== (undefined || '')) {
				this.filterForm.setFieldsValue({ accountStatus: "Y" })
			}
		},
		addRecord () {
			this.$refs.staffManagerForm.addForm()
		},
		showRecordInfo (obj) {
			this.$refs.staffManagerForm.editForm(obj)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		createAcount () {
			let items = this.selectedRows.filter(item => !item.userName)
			if (!items.length) {
				this.$Message.info('选择的数据已经开通帐号，请重新选择!')
				return
			}
			// 必录字段校验
			let users = items.filter(item => item.userRoleCode && item.orgDeptCode)
			if (!users.length) {
				this.$Message.info('选择的数据用户角色或所属部门为空！请先进行编辑更新！')
				return
			}
			let params = {
				userL: users
			}

			api.createUserHousekeeperInfo(params).then(res => {
				this.loadPageData()
				this.$Message.success('操作成功!初始密码为：123456')
			})
		},
		resetPassword () {
			let items = this.selectedRows.filter(item => item.userName)
			if (!items.length) {
				this.$Message.info('选择的数据未开通帐号，请重新选择!')
				return
			}

			let params = {
				userL: items
			}
			let self = this
			this.$confirm({
				title: '确认提示',
				content: '确认重置密码吗？',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						api.passReloadHousekeeperInfo(params).then(res => {
							self.loadPageData()
							self.$Message.success('操作成功!')
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		cancelAcount () {
			let items = this.selectedRows.filter(item => item.userName)
			if (!items.length) {
				this.$Message.info('选择的数据未开通帐号，请重新选择!')
				return
			}

			let params = {
				userL: items
			}
			let self = this
			this.$confirm({
				title: '确认提示',
				content: '帐号注销后不可恢复，确认继续吗？',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						api.userCancelHousekeeperInfo(params).then(res => {
							self.loadPageData()
							self.$Message.success('操作成功!')
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		exportRecord () {
			this.aloading = true
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			if (data.timeArr && data.timeArr.length) {
				data.beginTime = moment(data.timeArr[0]).format('YYYY/MM/DD')
				data.endTime = moment(data.timeArr[1]).format('YYYY/MM/DD')
				delete data.timeArr
			}
			 api.exportStaffAllHousekeeperInfo(data).then(res => {
				if (res !== undefined) {
					this.$downloadFileByBase64(res, `管家信息清单.xlsx`)
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
