<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="医疗机构查询">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="产品名称">
								<a-input :disabled="true" :value="extraParams.productName" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="服务名称">
								<a-input :disabled="true" :value="extraParams.serviceName" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="医疗名称名称">
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

			<a-card>
				<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
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
import api from '@/api/api-process-config'
import AddressSelect from '@/components/address-select'
export default {
	name: 'org-select-modal',
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
				{ title: "序号", dataIndex: "recordIndex", width: 100 },
				{ title: "医疗机构省", dataIndex: "orgPrivinceDesc", width: 180 },
				{ title: "医疗机构市", dataIndex: "orgCityDesc" },
				{ title: "医疗机构名称", dataIndex: "sorgName" },
				{ title: "医院等级", dataIndex: "sorgLevelDesc" },
				{ title: "地址", dataIndex: "sorgAddress", width: 300 },
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
			}
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

				data.ServiceOrgVo = query
				data.ServiceOrgVo.productCode = this.extraParams.productCode
				data.ServiceOrgVo.serviceCode = this.extraParams.serviceCode

				this.loading = true
				api.findServiceOrgServiceFlow(data).then(res => {
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
		show (extraParams) {
			this.extraParams = extraParams || {}
			this.filterForm.resetFields()

			this.formModal = true
			this.searchHandle()
		},
		submitForm () {
			if (this.selectedRows.length) {
				this.$emit('on-update', this.selectedRows[0])
				this.formModal = false
			} else {
				this.$message.warning('请选择医疗机构')
			}
		}
	}
}
</script>
