<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="用户查询">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="8">
							<a-form-item label="系统用户">
								<a-input v-decorator="['userName',{initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="姓名">
								<a-input v-decorator="['staffName',{initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="管理机构">
								<OrgSelect2 dicType="86" v-decorator="['orgCode',{initialValue: ''}]" @change="searchHandle" />
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
					:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
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
import api from "@/api/api-process-config"
import OrgSelect2 from '@/components/org-select2'
export default {
	name: 'queue-subscription-form',
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
			modalWidth: 970,
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
				{ title: "系统用户", dataIndex: "userName" },
				{ title: "工号", dataIndex: "staffNo" },
				{ title: "姓名", dataIndex: "staffName" },
				{ title: "所属管理机构", dataIndex: "orgName" },
				{ title: "联系电话", dataIndex: "tel", scopedSlots: { customRender: 'textVal' } },
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
				api.staffUserHousekeeperInfo(data).then(res => {
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
				this.$emit('on-update', this.selectedRows)
				this.formModal = false
			} else {
				this.$message.warning('请选择用户')
			}
		}
	}
}
</script>
