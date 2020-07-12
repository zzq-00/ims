<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="历史预约查询">

			<a-card>
				<a-table :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
				</a-table>
			</a-card>

			<div slot="footer">
				<a-button type="" @click="formModal=false">返回</a-button>
				<!-- <a-button type="primary" @click="submitForm">确定</a-button> -->
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import AddressSelect from '@/components/address-select'
export default {
	name: 'old-apply-modal',
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
			cardNo: '',
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
				{ title: "卡号", dataIndex: "cardNo", scopedSlots: { customRender: 'textVal' } },
				{ title: "产品名称", dataIndex: "productName", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务名称", dataIndex: "serviceName", width: 100, scopedSlots: { customRender: 'textVal' } },
				{ title: "预约机构", dataIndex: "sorgName", scopedSlots: { customRender: 'textVal' } },
				{ title: "预约科室", dataIndex: "deptName", scopedSlots: { customRender: 'textVal' } },
				{ title: "陪诊供应商", dataIndex: "supplierName", scopedSlots: { customRender: 'textVal' } },
				{ title: "陪诊人", dataIndex: "staffName", width: 100, scopedSlots: { customRender: 'textVal' } },
				{ title: "预约时间", dataIndex: "payDate", scopedSlots: { customRender: 'textVal' } },
				{ title: "就诊时间", dataIndex: "consumeDate", width: 100, scopedSlots: { customRender: 'textVal' } },
				{ title: "申请状态", dataIndex: "statusDesc", scopedSlots: { customRender: 'textVal' } }
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

				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize,
					cardNo: this.cardNo
				}

				this.loading = true
				api.serOldApply(data).then(res => {
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


		show (cardNo) {
			this.cardNo = cardNo || ''
			this.formModal = true
			this.searchHandle()
		}
	}
}
</script>
