<template>
  <a-row type="flex" justify="center">
    <a-col :span="24">
      <a-card style="margin-top: 24px;">
        <span slot="title" style="float:left;"><a-icon type="aliwangwang-o" /> 服务信息</span>
        <slot name="search"></slot>
        <div>
          <a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.serverCode" :indentSize=0 :loading="loading">
          </a-table>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DicSelect from '@/components/dic-select'

export default {
	name: 'query-service-table',
	components: { DicSelect },
	props: {
		param: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
			loading: false,
			pageSize: 20, // 每页显示多少条
			dataCount: 0, // 总条数
			page: 1, // 当前页
			pageData: {
				dataCount: 0,
				data: []
			},
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "服务编码",
					dataIndex: "serverCode"
				},
				{
					align: "left",
					title: "服务名称",
					dataIndex: "serverName"
				},
				{
					align: "开始日期",
					title: "所属合约名称",
					dataIndex: "startDate"
				},
				{
					align: "left",
					title: "结束日期",
					dataIndex: "endDate"
				}
				// {
				// 	align: "center",
				// 	title: "操作",
				// 	dataIndex: "operation",
				// 	scopedSlots: { customRender: "operation" }
				// }
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
	watch: {
		param: {
			deep: true,
			handler () {
				this.init()
			}
		}
	},
	mounted () {
		this.init()
	},
	methods: {
		init () {
			this.searchHandle()
		},
		searchHandle () {
			this.pagination.current = 1
			this.loadServiceData()
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadServiceData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.loadServiceData()
		},
		loadServiceData () {
			console.log('serviceparam', this.param)
			if (!this.param.serverOrgCode) return
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				searchListsBo: this.param
			}
			this.loading = true
			supApi.searchSerList(data).then(res => {
				this.pageData = res.data
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		exportData () {
			console.log('serviceparam', this.param)
			if (!this.param.serverOrgCode) return
			supApi.exportService(this.param).then(res => {
				if (res === (undefined || '')) {
					this.$message.error('文件导出失败！')
				} else {
					this.$downloadFileByBase64(res, `服务信息导出.xlsx`)
				}
			}).finally(() => {
			})
		}
	}
}
</script>
<style>

</style>
