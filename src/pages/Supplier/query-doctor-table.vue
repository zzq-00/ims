<template>
  <div>
		<a-card style="margin-top: 24px;">
			<span slot="title" style="float:left;"><a-icon type="home" /> 人员信息</span>
			<template slot="extra">
				<a-icon :type="iconType" @click="toggleTableShow" />
			</template>
			<slot name="search"></slot>
			<div v-show="showTable">
				<a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.doctorName" :indentSize=0 :loading="loading">
					<a slot="doctorName" @click="editData(record)" slot-scope="text, record">{{text}}</a>
				</a-table>
			</div>
		</a-card>
		<DoctorForm ref="doctorForm" @on-update="searchData" />
		<QueryServiceOrg ref="queryServiceOrg" :params='params'/>
		<PhamacyForm ref="phamacyForm"/>
  </div>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DoctorForm from '@/pages/Supplier/components/query-doctor-form'
import QueryServiceOrg from "./query-service-org"
import PhamacyForm from "@/pages/Supplier/components/query-phamacy-form"
import { Promise } from 'q'
let docColums = [
	{
		align: "center",
		title: "序号",
		dataIndex: "recordIndex"
	},
	{
		align: "left",
		title: "姓名",
		dataIndex: "doctorName",
		scopedSlots: { customRender: 'doctorName' }
	},
	{
		align: "left",
		title: "编码",
		dataIndex: "doctorCode"
	},
	{
		align: "left",
		title: "性别",
		dataIndex: "doctorGenderName"
	},
	{
		align: "left",
		title: "所在科室",
		dataIndex: "upDeptName"
	}, {
		align: "left",
		title: "职称",
		dataIndex: "doctorTitleName"
	}
]
let orgColums = [
	{
		align: "center",
		title: "序号",
		dataIndex: "recordIndex"
	},
	{
		align: "left",
		title: "姓名",
		dataIndex: "sorgName",
		scopedSlots: { customRender: 'doctorName' }
	},
	{
		align: "left",
		title: "编码",
		dataIndex: "sorgCode"
	},
	{
		align: "left",
		title: "机构类型",
		dataIndex: "orgTypeName"
	},
	{
		align: "left",
		title: "所在省份",
		dataIndex: "provinceName"
	},
	{
		align: "left",
		title: "所在市",
		dataIndex: "cityName"
	},
	{
		align: "left",
		title: "详细地址",
		dataIndex: "address"
	}
]
export default {
	name: 'query-doctor-table',
	components: { DoctorForm, QueryServiceOrg, PhamacyForm },
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
			params: {},
			showTable: true,
			iconType: 'down',
			columns: [],
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
			if (this.param.memberType === '19') {
				supApi.searchDocList(data).then(res => {
					this.columns = [...docColums]
					console.log(res, 'result')
					this.pageData = res.data || {totalCount: 0, data: []}
					this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			} else if (this.param.memberType === '18') {
				supApi.searchMemberOfPhaList(data).then(res => {
					this.columns = [...orgColums]
					console.log(res, 'result')
					this.pageData = res.data || {totalCount: 0, data: []}
					this.pageData.data.forEach((item, index) => { 
						item.recordIndex = index + 1 
						item.doctorName = item.sorgName
					})
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			} else {
				supApi.searchMemberList(data).then(res => {
					this.columns = [...orgColums]
					console.log(res, 'result')
					this.pageData = res.data || {totalCount: 0, data: []}
					this.pageData.data.forEach((item, index) => { 
						item.recordIndex = index + 1 
						item.doctorName = item.sorgName
					})
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			}
		},
		editData (obj) {
			if (this.param.memberType === '19') {
				// 医生
				this.$refs.doctorForm.editForm(obj, this.param)
			} else if (this.param.memberType === '18') {
				// 药店
				let data = {
					sorgCode: obj.sorgCode,
					orgName: this.param.sorgName
				}
				this.$refs.phamacyForm.editForm(data)
			} else {
				// 机构
				this.params = {
					sorgCode: obj.sorgCode,
					orgCode: obj.orgCode,
					supplierCode: obj.sorgCode
				}
				this.$refs.queryServiceOrg.showOrgInfo(this.params)
			}
		},
		exportData () {
			console.log('pageParam===', this.param)
			if (!this.param.serverOrgCode) return
			if (this.param.memberType === '19') {
				supApi.exportOrgDocAgency(this.param).then(res => {
					if (res === (undefined || '')) {
						this.$message.error('文件导出失败！')
					} else {
						this.$downloadFileByBase64(res, `机构成员导出-医生.xlsx`)
					}
				}).finally(() => {
				})
			} else if (this.param.memberType === '18') {
				supApi.exportOrgPhaAgency(this.param).then(res => {
					if (res === (undefined || '')) {
						this.$message.error('文件导出失败！')
					} else {
						this.$downloadFileByBase64(res, `机构成员导出-药店.xlsx`)
					}
				}).finally(() => {
				})
			} else {
				supApi.exportOrgOrg(this.param).then(res => {
					if (res === (undefined || '')) {
						this.$message.error('文件导出失败！')
					} else {
						this.$downloadFileByBase64(res, `机构成员导出-机构.xlsx`)
					}
				}).finally(() => {

				})
			}
		}
	}
}
</script>
<style>

</style>
