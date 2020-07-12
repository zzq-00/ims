<template>
  <div>
		<a-card style="margin-top: 24px;">
			<span slot="title" style="float:left;"><a-icon type="home" /> 部门/科室信息</span>
			<template slot="extra">
				<a-icon :type="iconType" @click="toggleTableShow" />
			</template>
			<slot name="search"></slot>
			<div v-show="showTable">
				<a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.deptCode" :indentSize=0 :loading="loading">
					<a slot="deptCode" @click="editData(record)" slot-scope="text, record">{{text}}</a>
				</a-table>
			</div>
		</a-card>
		<DepartmentForm ref="departmentForm" @on-update="searchData" />
  </div>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DepartmentForm from '@/pages/Supplier/components/query-department-form'
import { Promise } from 'q'
export default {
	name: 'query-department-table',
	components: { DepartmentForm },
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
			showTable: true,
			iconType: 'down',
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "名称",
					dataIndex: "deptName"
				},
				{
					align: "left",
					title: "编码",
					dataIndex: "deptCode",
					scopedSlots: { customRender: 'deptCode' }
				},
				{
					align: "left",
					title: "上级科室名称",
					dataIndex: "upDeptName"
				},
				{
					align: "left",
					title: "联系人",
					dataIndex: "deptLinkman"
				},
				{
					align: "left",
					title: "联系电话",
					dataIndex: "deptMobile"
				}
			],
			selectedRows: [],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			pagination: {
				pageSize: 5,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["5", "10", "20"],
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
			this.searchData()
		},
		toggleTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		searchData () {
			this.pagination.current = 1
			this.loadPageData()
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchData()
		},
		loadPageData () {
			console.log('pageParam===', this.param)
			if (!this.param.serverOrgCode) return
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				searchListsBo: this.param
			}
			this.loading = true
			supApi.searchDeptList(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || {totalCount: 0, data: []}
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		editData (obj) {
			this.$refs.departmentForm.editForm(obj)
		},
		exportData () {
			console.log('pageParam===', this.param)
			if (!this.param.serverOrgCode) return
			supApi.exportOrgDept(this.param).then(res => {
				if (res === (undefined || '')) {
					this.$message.error('文件导出失败！')
				} else {
					this.$downloadFileByBase64(res, `机构信息导出模板-部门科室.xlsx`)
				}
			}).finally(() => {

			})
		}
	}
}
</script>
<style>

</style>
