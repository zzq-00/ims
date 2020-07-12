<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="添加号源">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="机构编码">
								<a-input  v-decorator="['hinsCode']"  />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="机构名称">
								<a-input  v-decorator="['hinsName']"  />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="所在省">
								<AddressSelect  dicType="0" v-decorator="['hinsProvince']" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="所在市">
								<a-input v-decorator="['hinsCity']" />
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
				<a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
				</a-table>
			</a-card>

			<div slot="footer">
				<!-- <a-button type="" @click="formModal=false">取消</a-button> -->
				<a-button type="primary" @click="submitForm">确定</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import AddressSelect from '@/components/address-select'
export default {
	name: 'hins-select-modal',
	components: { AddressSelect },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
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
				{ title: "序号", dataIndex: "recordIndex", width: 100 },
				{ title: "机构编码", dataIndex: "sorgCode", scopedSlots: { customRender: 'textVal' } },
				{ title: "机构名称", dataIndex: "supplierName", scopedSlots: { customRender: 'textVal' } },
				{ title: "省", dataIndex: "orgPrivinceDesc", width: 100, scopedSlots: { customRender: 'textVal' } },
				{ title: "市", dataIndex: "orgCityDesc", scopedSlots: { customRender: 'textVal' } }
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
					limit: this.pagination.pageSize,
					sorgCode: query.hinsCode,
					sorgName: query.hinsName,
					sorgProvince: query.hinsProvince,
					sorgCity: query.hinsCity,
					supplierCode: ""
				}

				this.loading = true
				api.queryHinsSorg(data).then(res => {
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


		show (obj) {
			this.formModal = true
			this.searchHandle()
		},
		submitForm () {
			if (this.selectedRows.length) {
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize,
					HinsTable: this.selectedRows,
					price: null,
					supplierCode: ''
				}
				this.loading2 = true
				api.updateHinsTable(data).then(res => {
					console.log(res, "result")
					this.$emit('on-update', res.data)
				})

				this.formModal = false
			} else {
				this.$message.warning('请选择号源')
			}
		}
	}
}
</script>
