<template>
	<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle" footer="">
		<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
			<a-spin :spinning="spinning" />
			<a-divider orientation="left">
				<a-icon type="home" /> 科室信息</a-divider>
			<a-card style="margin-top: 24px;">
				<a-row :gutter="16">
					<a-col :span="2">
						<a-avatar :size="64" icon="user" />
					</a-col>
					<a-col :span="6">
						<a-form-item label="编码">
							<a-input v-decorator="['deptCode']" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="0">
						<a-form-item label="机构编码">
							<a-input v-decorator="['serviceOrgCode']" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="名称">
							<a-input v-decorator="['deptName']" disabled>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="电话">
							<a-input v-decorator="['deptTel']" disabled></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="所属医院">
							<a-input v-decorator="['serviceOrgName']" disabled></a-input>
						</a-form-item>
					</a-col>
				</a-row>
			</a-card>
			<a-card style="margin-top: 24px;">
				<a-divider orientation="left">
					<a-icon type="folder-open" /> 科室详细信息</a-divider>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="科室编码">
							<a-input v-decorator="['deptCode']" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="科室名称">
							<a-input v-decorator="['deptName']" disabled/>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="上级科室编码">
							<a-input v-decorator="['upDeptCode']"disabled />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="上级科室名称">
							<a-input v-decorator="['upDeptName']" disabled></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="所属医院">
							<a-input v-decorator="['deptName']" disabled></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="联系人">
							<a-input v-decorator="['deptLinkman']"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="联系电话">
							<a-input v-decorator="['deptTel']"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="科室特色">
							<a-input v-decorator="['deptCistic']"></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="24">
						<a-form-item label="科室简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
							<a-textarea v-decorator="['deptInfo', {rules: [{ required: true, message: '擅长不能为空!' }]} ]"
								:rows="1" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-card>
			<a-card style="margin-top: 24px;">
				<a-divider orientation="left">
					<a-icon type="home" /> 科室人员信息
				</a-divider>
				<a-row :gutter="16">
					<a-col :span="16">
						<a-row :gutter="16">
							<a-col :span="12">
								<a-form-item label="名称">
									<a-input v-decorator="['personName']" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="编码">
									<a-input v-decorator="['personCode']" />
								</a-form-item>
							</a-col>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-button type="primary" class="editable-add-btn" @click="exportData"
							style="float:right;margin-right:10px;">导出</a-button>
						<a-button type="" class="editable-add-btn" @click="searchData"
							style="float:right;margin-right:10px;">查询</a-button>
					</a-col>
				</a-row>
				<div v-show="showTable">
					<a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection"
						:dataSource="pageData.data" :columns="columns" :rowKey="record => record.doctorCode"
						:indentSize=0 :loading="loading">
						<a slot="doctorCode" @click="editData(record)" slot-scope="text, record">{{text}}</a>
					</a-table>
				</div>
			</a-card>
		</a-form>
		<DoctorForm ref='doctorForm'/>
	</a-modal>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DicSelect from '@/components/dic-select'
import DoctorForm from '@/pages/Supplier/components/query-doctor-form'

export default {
	name: 'department-form',
	components: { DicSelect, DoctorForm },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 1070,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dateEntity: {},
			dataForm: this.$form.createForm(this),
			showTable: true,
			loading: false,
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
					dataIndex: "doctorName"
				},
				{
					align: "left",
					title: "编码",
					dataIndex: "doctorCode",
					scopedSlots: { customRender: 'doctorCode' }
				},
				{
					align: "left",
					title: "性别",
					dataIndex: "doctorGenderName"
				},
				{
					align: "left",
					title: "职称",
					dataIndex: "doctorTitleName"
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
	mounted () {

	},
	methods: {
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
			if (!this.dataForm.getFieldValue('serviceOrgCode')) return
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				searchListsBo: {
					name: this.dataForm.getFieldValue('personName'),
					code: this.dataForm.getFieldValue('personCode'),
					fromDept: this.dataForm.getFieldValue('deptCode'),
					serverOrgCode: this.dataForm.getFieldValue('serviceOrgCode')
				}
			}
			this.loading = true
			supApi.getDoctorsForDept(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		editForm (obj) {
			this.formModal = true
			console.log(obj, 'department edit')
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(obj)
			})
		},
		editData (obj) {
			this.formModal = false
			let param = {
				cooperateWay: '',
				orgName: this.dataForm.getFieldValue('serviceOrgName')
			}
			console.log(obj, 'docFromDept edit')
			this.$refs.doctorForm.editForm(obj, param)
		},
		exportData () {
			if (!this.dataForm.getFieldValue('serviceOrgCode')) return
			let data =
				{
					name: this.dataForm.getFieldValue('personName'),
					code: this.dataForm.getFieldValue('personCode'),
					fromDept: this.dataForm.getFieldValue('deptCode'),
					serverOrgCode: this.dataForm.getFieldValue('serviceOrgCode')
				}
			supApi.exportDoctorsForDept(data).then(res => {
				if (res === (undefined || '')) {
					this.$message.error('文件导出失败！')
				} else {
					this.$downloadFileByBase64(res, `科室人员信息-医生.xlsx`)
				}
			}).finally(() => {
			})
		}
	}
}
</script>
<style>

</style>
