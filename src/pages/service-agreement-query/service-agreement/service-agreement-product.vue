<template>
      <a-table v-show="showTable"  :bordered="false" :pagination="pagination"  :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
</template>
<script>
// 产品信息
import api from "@/api/api-service-agreement"
export default {
	name: "table_onlyshow",
	props: {
		productId: {
	  }
	},
	data () {
		return {
			visible: false,
			pageData: {
				dataCount: () => pageData.data.length,
				data: []
			},
			loading: false,
			showTable: true,
			columns: [
				{
					align: "left",
					title: "序号",
					// dataIndex:'',
					customRender: (text, record, index) => {
						return `${index + 1}`
					}
					// scopedSlots: { customRender: "docCode" }
				},
				{
					align: "left",
					title: "产品代码",
					dataIndex: "productCode"
				},
				{
					align: "left",
					title: "产品名称",
					dataIndex: "productName"
				},
				{
					align: "left",
					title: "产品分类",
					dataIndex: "productTypeName"
				},
				{
					align: "left",
					title: "是否为保险产品覆盖",
					dataIndex: "yes_noName"
					// scopedSlots: { customRender: "yesNo" }
				},
				{
					align: "left",
					title: "保险产品",
					dataIndex: "ins"
				}

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
	watch: {
		productId (newV, oldV) {
			this.agreementId = newV
	  this.pagination.current = 1
	  this.loadPageData()
		}
	},
	mounted () {
		this.pagination.current = 1
	    this.loadPageData()
	},
	methods: {
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		 onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		},
		loadPageData () {
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				productId: this.productId
			}
			this.loading = true
			api.getInsuranceProductTableInfo(data).then(res => {
				// console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		}
	}

}
</script>
<style>
.modal_box {
}
</style>


