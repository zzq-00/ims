<template>
      <a-table v-show="showTable"  :bordered="false" :pagination="pagination"  :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
        <a-tag slot="disable" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "可选" : "必选" }}</a-tag>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
</template>
<script>
// 协议轨迹信息
import api from "@/api/api-service-agreement"
export default {
	name: "table_onlyshow",
	props: {
		agreementId: {

	  }
	},
	data () {
		return {
			visible: false,
			confirmLoading: false,
			pageData: {
				dataCount: 0,
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
					title: "协议变更号码",
					dataIndex: "changeNo"
					// scopedSlots: { customRender: "docName" }
				},
				{
					align: "left",
					title: "变更项目",
					dataIndex: "changeTypeDesc"

				},
				{
					align: "left",
					title: "操作时间",
					dataIndex: "updateTimeTrack"
					// scopedSlots: { customRender: "yesNo" }
				},
				{
					align: "left",
					title: "生效时间",
					dataIndex: "changeDate"
				},
                	{
					align: "left",
					title: "操作人",
					dataIndex: "updateOperTrack"
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
	  agreementId (newV, oldV) {
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
				agreementId: this.agreementId
			}
			this.loading = true
			api.getAgreementTraceTableInfo(data).then(res => {
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


