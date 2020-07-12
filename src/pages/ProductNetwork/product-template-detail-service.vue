<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-card style="top: 15px;">
				<a-form :form="filterForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
					<a-col :span="12">
						<a-form-item label="服务名称">
							<ProservSelect ref="proservSelect" :allowClear="true" v-decorator="['serviceName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="服务类别">
							<DicSelect dicType="SERVICE_BASE_TYPE" :allowClear="true" v-decorator="['serviceBaseType', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-form>
			</a-card>
			<a-card>
				<a-table :bordered="false" :pagination="pagination" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onRowChange, type: 'radio' }"
                 :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
				</a-table>
			</a-card>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/api-product-network"
import DicSelect from '@/components/dic-select'
import ProservSelect from '@/components/proserv-select'

export default {
	name: 'product-template-detail-service',
	components: { DicSelect, ProservSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			modalWidth: 800,
			modalTitle: '选择服务',
			submitLoading: false,
			formModal: false,
			filterForm: this.$form.createForm(this),
			pageData: {
				data: []
			},
			loading: false,
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "服务编码",
					dataIndex: "serviceCode"
				},
				{
					align: "left",
					title: "服务名称",
					dataIndex: "serviceName"
				},
				{
					align: "left",
					title: "服务别名",
					dataIndex: "serviceAliasName"
				},
				{
					align: "left",
					title: "服务类别",
					dataIndex: "serviceBaseTypeDesc"
				}
			],
			selectedRows: [],
			selectedRowKeys: [],
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
			this.selectedRows = selectedRows
			this.selectedRowKeys = selectedRowKeys
		},
		searchHandle () {
			this.selectedRowKeys = []
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
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			let serviceName = query.serviceName
			query.serviceName = this.$refs.proservSelect.getName(serviceName)
			Object.assign(data, query)
			this.loading = true
			api.getServiceTemplet(data).then(res => {
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		addForm () {
			this.modalTitle = '选择服务'
			this.formModal = true
		},
		submitForm () {
			if (this.selectedRows.length === 0) {
			  this.$message.error("请选择一条数据！")
				return
			}
			this.$emit('on-update', this.selectedRows[0])
			this.formModal = false
		}
	}
}
</script>
<style>

</style>
