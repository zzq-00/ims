<template>
  <div>
		<a-card style="margin-top: 24px;">
			<span slot="title" style="float:left;"><a-icon type="home" /> 人员信息</span>
			<template slot="extra">
				<a-icon :type="iconType" @click="toggleTableShow" />
			</template>
			<div v-show="showTable">
				<a-button type="default" v-if="!verify" class="editable-add-btn" :disabled="!selectedRows.length"  @click="deleteData" style="float:right;margin-left:10px;z-index:10;">删除</a-button>
				<a-button type="primary" v-if="!verify" class="editable-add-btn" @click="addData" style="float:right;margin-left: 10px;z-index:10;">新建</a-button>
				<a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.deptCode" :indentSize=0 :loading="loading">
					<a slot="doctorName" @click="editData(record)" slot-scope="text, record">{{text}}</a>
				</a-table>
			</div>
		</a-card>
		<DoctorForm ref="dataForm" @on-update="searchData" :verify="verify"/>
  </div>
</template>
<script>
import supApi from '@/api/api-supplier'
import DoctorForm from '@/pages/Supplier/components/doctor-form'
import { Promise } from 'q'
export default {
	name: 'doctor',
	components: { DoctorForm },
	props: {
		param: {
			type: Object,
			default () {
				return {}
			}
		},
		verify: {
			type: Boolean,
			default () {
				return false
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
					title: "姓名",
					dataIndex: "doctorName",
					scopedSlots: { customRender: 'doctorName' }
				},
				{
					align: "left",
					title: "性别",
					dataIndex: "doctorGenderDesc"
				},
				{
					align: "left",
					title: "所在科室",
					dataIndex: "deptNameDoc"
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
				onChange: (page, pageSize) => this.onPageChange2(page, pageSize)
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
			if (!this.param.sorgCode) return
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, this.param)
			this.loading = true
			supApi.queryDoctorTable(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || {totalCount: 0, data: []}
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
        this.$emit('on-update', this.pageData.totalCount)
			}).finally(() => {
				this.loading = false
			})
		},
		addData () {
			this.$refs.dataForm.addForm(this.param)
		},
		editData (obj) {
			this.$refs.dataForm.editForm(obj, this.param)
		},
		deleteData () {
			let arr = this.selectedRows
			if (!arr.length) {
				this.$message.info('请选择记录!')
				return
			}
			let names = arr.map(item => item.doctorName).join(',')
			let self = this
			this.$confirm({
				title: '确定执行删除操作吗?',
				content: '医生姓名: ' + names,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						let params = Object.assign({}, self.param)
						params.doctorInfo = arr
						supApi.deleteDoctor(params).then(res => {
							self.$message.success('删除成功!')
							self.selectedRows = []
							self.loadPageData()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		}
	}
}
</script>
<style>

</style>
