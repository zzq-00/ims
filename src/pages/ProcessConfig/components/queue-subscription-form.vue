<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="用户订阅">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="8">
							<a-form-item label="管理机构">
								<a-input :disabled="true" :value="extraParams.orgName" />
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="队列名称">
								<a-input :disabled="true" :value="extraParams.queueName" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12" :offset="11">
							<a-button type="" class="editable-add-btn" @click="selectStaff" style="float:right;margin-right:10px;">用户查询</a-button>
						</a-col>
					</a-row>
				</a-form>
			</a-card>

			<h4 style="margin-top:10px;">查询结果</h4>
			<a-card>
				<a-table :bordered="false" :dataSource="list" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
				</a-table>
			</a-card>

			<div slot="footer">
				<a-button type="" @click="formModal=false">返回</a-button>
				<a-button type="primary" @click="deleteBatch">删除</a-button>
				<a-button type="primary" @click="submitForm">保存</a-button>
			</div>

			<QueueStaffModal ref="queueStaffModal" @on-update="selectStaffHandle" />
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/api-process-config"
import QueueStaffModal from './queue-staff-modal'
export default {
	name: 'queue-subscription-form',
	components: { QueueStaffModal },
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
			list: [],
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "系统用户", dataIndex: "userName" },
				{ title: "管家名称", dataIndex: "realName" },
				{ title: "工号", dataIndex: "staffNo" },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "是否接受短信", dataIndex: "isMessDesc", scopedSlots: { customRender: 'textVal' } },
				{ title: "是否接受邮件", dataIndex: "isMailDesc", scopedSlots: { customRender: 'textVal' } }
			]
		}
	},
	mounted () {

	},
	methods: {
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
		},
		searchHandle () {
			this.$nextTick(() => {
				this.loadPageData()
			})
		},
		loadPageData () {
			this.selectedRows = []
			this.selectedRowKeys = []
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let data = {
					orgCode: this.extraParams.orgCode,
					queueId: this.extraParams.queueId
				}

				this.loading = true
				api.getQueueOrderSub(data).then(res => {
					console.log(res, 'result')
					this.list = res.data.data || []
					this.setRecordIndex()
				}).finally(() => {
					this.loading = false
				})
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		setRecordIndex () {
			if (!this.list) this.list = []
			this.list.forEach((item, index) => { item.recordIndex = index + 1 })
		},
		show (extraParams) {
			this.extraParams = extraParams || {}
			this.filterForm.resetFields()

			this.formModal = true
			this.searchHandle()
		},
		selectStaff () {
			this.$refs.queueStaffModal.show()
		},
		selectStaffHandle (items) {
			items = items || []
			items.forEach(item => {
				let obj = {}
				obj.isMess = "1"
				obj.isMessDesc = "是"
				obj.isMail = "1"
				obj.isMailDesc = "是"
				obj.userName = item.userName
				obj.staffNo = item.staffNo
				obj.realName = item.staffName
				obj.orgCode = item.orgCode
				obj.orgName = item.orgName
				obj.queueId = this.extraParams.queueId

				/** 校验是否唯一 **/
				var flag = true
				this.list.forEach(itm => {
					if (itm.staffNo === item.staffNo) {
						flag = false
					}
				})
				if (flag) {
					this.list.push(obj)
				} else {
					this.$message.warning(item.staffName + '不可重复订阅此队列！')
				}
			})
		},
		submitForm () {
			let data = {
				queL: this.list
			}
			api.addQueueOrder(data).then(res => {
				this.$message.success('保存成功')
				this.formModal = false
			})
		},
		deleteBatch () {
			if (!this.selectedRows.length) {
				this.$message.warning('请选择记录')
				return
			}

			let self = this
			this.$confirm({
				title: '确认提示',
				content: '数据将直接解除订阅，是否确认?',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						let freshItems = self.selectedRows.filter(item => !item.workQueueSubScriptionId) || []
						let persistItems = self.selectedRows.filter(item => item.workQueueSubScriptionId) || []
						if (freshItems.length) {
							freshItems.forEach(item => {
								let index = self.list.findIndex(ii => ii.recordIndex === item.recordIndex)
								if (index >= 0) self.list.splice(index, 1)
							})

							self.setRecordIndex()
							self.selectedRowKeys = []
							self.selectedRows = []

							if (!persistItems.length) {
								self.$message.success('删除成功')
								resolve()
							}
						}

						if (persistItems.length) {
							let data = {
								delL: persistItems.map(item => item.workQueueSubScriptionId)
							}
							api.delQueueOrder(data).then(res => {
								self.$message.success('删除成功')
								self.searchHandle()
							}).finally(() => {
								resolve()
							})
						}
					})
				}
			})
		}
	}
}
</script>
