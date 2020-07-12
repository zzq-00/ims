<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="任务指派">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<h4>基本信息</h4>
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="产品名称">
								<a-input :readonly="true" :value="extraParams.productName" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="卡号">
								<a-input :readonly="true" :value="extraParams.cardNo" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="服务名称">
								<a-input :readonly="true" :value="extraParams.serviceName" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="服务商名称">
								<a-input :readonly="true" :value="extraParams.sorgName" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="申请人姓名">
								<a-input :readonly="true" :value="extraParams.applyName" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="申请日期">
								<a-input :readonly="true" :value="extraParams.insertTime" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="申请方式">
								<a-input :readonly="true" :value="extraParams.channelTypeDesc" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="当前状态">
								<a-input :readonly="true" :value="extraParams.statusDesc" />
							</a-form-item>
						</a-col>
					</a-row>

					<h4>查询条件</h4>
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="系统帐号">
								<a-input v-decorator="['userName', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="姓名">
								<a-input v-decorator="['staffName', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="管理机构">
								<OrgSelect2 dicType="orgCode_4" v-decorator="['orgCode', {initialValue: ''}]" />
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

			<h4 style="margin-top:10px;">查询结果</h4>
			<a-card>
				<a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
				</a-table>
			</a-card>

			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button type="primary" @click="submitForm">任务指派</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import OrgSelect2 from '@/components/org-select2'
export default {
	name: 'serve-apply-assign',
	components: { OrgSelect2 },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			extraParams: {},
			formModal: false,
			modalWidth: 1170,
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "系统帐号", dataIndex: "userName" },
				{ title: "工号", dataIndex: "staffNo" },
				{ title: "名称", dataIndex: "staffName" },
				{ title: "所属管理机构", dataIndex: "orgName" },
				{ title: "联系电话", dataIndex: "tel" },
				{ title: "状态", dataIndex: "status", scopedSlots: { customRender: 'textVal' } }
			],
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
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
			this.searchHandle2()
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

				let query = values
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}
				Object.assign(data, query)

				this.loading = true
				api.findStaffUserList(data).then(res => {
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
		show (extraParams) {
			this.extraParams = extraParams || {}
			this.filterForm.resetFields()

			this.formModal = true
			this.searchHandle()
		},
		submitForm () {
			if (this.selectedRows.length) {
				let item = this.selectedRows[0]
				let params = {
					serviceReservationId: this.extraParams.serviceReservationId,
					userName: item.userName
				}
				api.getBulterCompetence().then(res => {
					if (!res.data) {
						this.$Message.error('只有总公司服务总管和总公司服务管理人员可以进行任务指派!')
					} else {
						api.taskAssign(params).then(res => {
							this.$emit('on-update', item)
							this.formModal = false
							this.$Message.success('任务指派成功!')
						})
					}
				})
			} else {
				this.$message.warning('请指派的处理人')
			}
		}
	}
}
</script>
