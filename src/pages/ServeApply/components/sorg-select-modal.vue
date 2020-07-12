<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="医疗机构查询">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="产品名称">
								<a-input :readonly="true" :value="extraParams.productName" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="服务名称">
								<a-input :readonly="true" :value="extraParams.serviceName" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="机构名称">
								<a-input v-decorator="['sorgName', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="医疗机构所在省">
								<AddressSelect dicType="0" v-decorator="['orgPrivince', {initialValue: ''}]" />
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

			<h4 style="margin-top:10px;">医疗机构列表</h4>
			<a-card>
				<a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
				</a-table>
			</a-card>

			<a-card style="margin-top:10px;">
				<a-form :form="filterForm2" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="科室名称">
								<a-input v-decorator="['deptName', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12" :offset="11">
							<a-button type="" class="editable-add-btn" @click="resetFilterForm2" style="float:right;margin-right:10px;">重置</a-button>
							<a-button type="" class="editable-add-btn" @click="searchHandle2" style="float:right;margin-right:10px;">查询</a-button>
						</a-col>
					</a-row>
				</a-form>
			</a-card>

			<h4 style="margin-top:10px;">科室列表</h4>
			<a-card>
				<a-table :bordered="false" :pagination="pagination2" :dataSource="pageData2.data" :columns="columns2" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading2"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys2, onChange: onRowChange2 }">
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
import api from '@/api/api-serve-apply'
import AddressSelect from '@/components/address-select'
export default {
	name: 'serve-apply-sorg-select',
	components: { AddressSelect },
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
				{ title: "所在省", dataIndex: "orgPrivinceDesc", width: 100 },
				{ title: "所有市", dataIndex: "orgCityDesc", width: 100 },
				{ title: "医疗机构名称", dataIndex: "sorgName" },
				{ title: "医院等级", dataIndex: "sorgLevelDesc", width: 100 },
				{ title: "地址", dataIndex: "sorgAddress" },
				{ title: "联系人", dataIndex: "linkMan", width: 100, scopedSlots: { customRender: 'textVal' } },
				{ title: "联系号码", dataIndex: "linkTel", width: 100, scopedSlots: { customRender: 'textVal' } }
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
			},

			pageData2: {
				dataCount: 0,
				data: []
			},
			filterForm2: this.$form.createForm(this),
			selectedRows2: [],
			selectedRowKeys2: [],
			loading2: false,
			columns2: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "医疗机构", dataIndex: "sorgName" },
				{ title: "科室名称", dataIndex: "deptName" }
			],
			pagination2: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange2(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange2(page, pageSize)
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
				query.productCode = this.extraParams.productCode
				query.serviceCode = this.extraParams.serviceCode

				data.ServiceOrgVo = query

				this.loading = true
				api.findServiceOrg(data).then(res => {
					console.log(res, 'result')
					let pageData = {
						totalCount: res.data.total,
						data: res.data.rows
					}
					this.pageData = pageData || { totalCount: 0, data: [] }
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

		onRowChange2 (selectedRowKeys, selectedRows) {
			this.selectedRowKeys2 = selectedRowKeys || []
			this.selectedRows2 = selectedRows
		},
		searchHandle2 () {
			this.$nextTick(() => {
				this.pagination2.current = 1
				this.loadPageData2()
			})
		},
		onPageChange2 (page, pageSize) {
			this.pagination2.current = page
			this.loadPageData2()
		},
		onPageSizeChange2 (current, size) {
			this.pagination2.pageSize = size
			this.searchHandle2()
		},
		loadPageData2 () {
			if (!this.selectedRows.length) {
				return
			}
			this.filterForm2.validateFields((error, values) => {
				if (error) {
					return
				}

				let query = values
				let data = {
					page: this.pagination2.current,
					limit: this.pagination2.pageSize,
					sorgCode: this.selectedRows[0].sorgCode
				}
				Object.assign(data, query)
				this.loading2 = true
				api.findOrgDept(data).then(res => {
					console.log(res, 'result')
					let pageData = {
						totalCount: res.data.total,
						data: res.data.rows
					}
					this.pageData2 = pageData || { totalCount: 0, data: [] }
					this.pageData2.data.forEach((item, index) => { item.recordIndex = index + 1 })
					this.pagination2.total = this.pageData2.totalCount
				}).finally(() => {
					this.loading2 = false
				})
			})
		},
		resetFilterForm2 () {
			this.filterForm2.resetFields()
			this.searchHandle2()
		},

		show (extraParams) {
			this.extraParams = extraParams || {}
			this.filterForm.resetFields()

			this.filterForm.setFieldsValue({
				productName: this.extraParams.productName,
				serviceName: this.extraParams.serviceName
			})

			this.formModal = true
			this.searchHandle()
		},
		submitForm () {
			if (this.selectedRows2.length) {
				this.selectedRows[0].deptCode = this.selectedRows2[0].deptCode
				this.selectedRows[0].deptName = this.selectedRows2[0].deptName
				this.$emit('on-update', this.selectedRows[0])
				this.formModal = false
				this.selectedRows = []
				this.selectedRowKeys = []
				this.selectedRows2 = []
				this.selectedRowKeys2 = []
			} else {
				this.$message.warning('请选择科室')
			}
		}
	}
}
</script>
