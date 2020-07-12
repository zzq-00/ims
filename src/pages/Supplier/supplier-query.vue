<template>
  <a-card :bordered="false">
    <a-divider orientation="left">
      <a-icon type="file-search" /> 供应商信息查询 </a-divider>
    <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="查询类型">
            <DicSelect dicType="SUPPLIER_TYPE" :allowClear="true" v-decorator="['code', {initialValue: ''}]" @change="changeCode" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构类型">
            <DicSelect dicType="SUPPLIER_SUB_TYPE" :disabled="filterForm.getFieldValue('code')==='02'" :allowClear="true" v-decorator="['orgType', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="管理机构">
            <OrgSelect dicType="4" :allowClear="true" :disabled="filterForm.getFieldValue('changeCooperateWay')==='2'" v-decorator="['managerOrg', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="合作方式">
            <DicSelect dicType="COOPERATE_WAY" :allowClear="true" v-decorator="['cooperateWay', {initialValue: ''}]" @change="changeCooperateWay" />
          </a-form-item>
		</a-col>
		<a-col :span="6">
		  <a-form-item label="编码">
				<a-input v-decorator="['providerCode', {initialValue: ''}]" />
		  </a-form-item>
		</a-col>
        <a-col :span="6">
          <a-form-item label="名称">
            <a-input v-decorator="['providerName', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="省名称">
            <AddressSelect dicType="0" allowClear :disabled="filterForm.getFieldValue('code')==='02'" v-decorator="['province', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="市名称">
            <AddressSelect allowClear :disabled="filterForm.getFieldValue('code')==='02'" :dicType="this.filterForm.getFieldValue('province')" v-decorator="['city', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务类别">
            <DicSelect dicType="BELONG_SERVICE_TYPE" :allowClear="true" v-decorator="['serviceType', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align:right">
          <a-button type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="searchHandle">查询</a-button>
          <a-button type="" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="resetFilterForm">重置</a-button>
          <a-button type="" class="editable-add-btn" style="margin:0px 0 0 0;" @click="exportData":loading="uploading">导出</a-button>
        </a-col>
	  </a-row>
	  <QueryServiceOrg ref="queryServiceOrg" :params='params'/>
	  <PhamacyForm ref="phamacyForm"/>
	  <DoctorForm ref="doctorForm" />
    </a-form>
    <a-divider orientation="left">
      <a-icon type="search" /> 查询结果</a-divider>
    <a-table v-show="showTable" bordered :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode || record.doctorName" :indentSize=0 :loading="loading">
      <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
      <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
    </a-table>
  </a-card>
</template>
<script>
import supApi from "@/api/api-supplier"
import DicSelect from "@/components/dic-select"
import OrgSelect from "@/components/org-select"
import AddressSelect from "@/components/address-select"
import QueryServiceOrg from "./query-service-org"
import PhamacyForm from "@/pages/Supplier/components/query-phamacy-form"
import DoctorForm from '@/pages/Supplier/components/query-doctor-form'
import { Promise } from "q"
let orgColumns = [
	{
		align: "center",
		title: "序号",
		dataIndex: "recordIndex"
	},
	{
		align: "left",
		title: "机构编码",
		dataIndex: "sorgCode",
		scopedSlots: { customRender: "sorgCode" }
	},
	{
		align: "left",
		title: "机构名称",
		dataIndex: "sorgName"
	},
	{
		align: "left",
		title: "所在省",
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
	},
	{
		align: "left",
		title: "机构类型",
		dataIndex: "orgTypeName"
	},
	{
		align: "left",
		title: "合作方式",
		dataIndex: "cooperationName"
	},
	{
		align: "left",
		title: "管理机构",
		dataIndex: "orgCodeName"
	},
	{
		align: "left",
		title: "医院等级",
		dataIndex: "hospitalLevelName"
	}
]
let phaColumns = [
	{
		align: "center",
		title: "序号",
		dataIndex: "recordIndex"
	},
	{
		align: "left",
		title: "机构编码",
		dataIndex: "sorgCode",
		scopedSlots: { customRender: "sorgCode" }
	},
	{
		align: "left",
		title: "机构名称",
		dataIndex: "sorgName"
	},
	{
		align: "left",
		title: "所在省",
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
let docColumns = [
	{
		align: "center",
		title: "序号",
		dataIndex: "recordIndex"
	},
	{
		align: "left",
		title: "人员姓名",
		dataIndex: "doctorName",
		scopedSlots: { customRender: "sorgCode" }
	},
	{
		align: "left",
		title: "人员编码",
		dataIndex: "doctorCode"
	},
	{
		align: "left",
		title: "所属医院",
		dataIndex: "serviceOrgName"
	},
	{
		align: "left",
		title: "医院等级",
		dataIndex: "hosptialLevelName"
	},
	{
		align: "left",
		title: "所属科室",
		dataIndex: "deptName"
	},
	{
		align: "left",
		title: "职称",
		dataIndex: "doctorTitleName"
	}
]
export default {
	name: "supplier-query",
	components: { DicSelect, OrgSelect, AddressSelect, QueryServiceOrg, PhamacyForm, DoctorForm },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			code: "",
			columns: [...orgColumns],
			params: {},
			uploading: false,
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
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
	mounted () {
		// this.searchHandle()
	},
	methods: {
		changeCode (value) {
			if (value === "02") {
				this.filterForm.setFieldsValue({
					orgType: "19",
					province: "",
					city: ""
				})
			} else {
				this.filterForm.setFieldsValue({
					orgType: ""
				})
			}
		},
		changeCooperateWay (value) {
			if (value === "2") {
				this.filterForm.setFieldsValue({ managerOrg: "" })
			}
		},
		searchHandle () {
			this.pagination.current = 1
			this.loadPageData()
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
				// 请至少输入一个检索条件!
				let collect = []
				let result

				Object.keys(values).forEach((ele) => {
					collect.push(values[ele])
				})
				result = collect.every((item) => { return item === undefined || item === "" || item === null })
				if (result) {
					this.$message.error("请至少输入一个查询条件!")
					return
				}
				if (!error) {
					let query = this.filterForm.getFieldsValue()
					this.code = query.code
					delete query.code
					let data = {
						page: this.pagination.current,
						limit: this.pagination.pageSize,
						supplierInfoBo: query
					}
					this.loading = true
					if (values.code === "01" && query.orgType === "18") {
						supApi.searchPhaList(data).then(res => {
							console.log(res, "result")
							this.columns = [...phaColumns]
							this.pageData = res.data || { totalCount: 0, data: [] }
							this.pageData.data.forEach((item, index) => {
								item.recordIndex = index + 1
							})
							this.pagination.total = this.pageData.totalCount
						}).finally(() => {
							this.loading = false
						})
					} else if (values.code === "02") {
						supApi.searchDocOfMainList(data).then(res => {
							console.log(res, "result")
							this.columns = [...docColumns]
							this.pageData = res.data || { totalCount: 0, data: [] }
							this.pageData.data.forEach((item, index) => {
								item.recordIndex = index + 1
							})
							this.pagination.total = this.pageData.totalCount
						}).finally(() => {
							this.loading = false
						})
					} else {
						supApi.searchOrgList(data).then(res => {
							console.log(res, "result")
							this.columns = [...orgColumns]
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
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		showOrgInfo (obj) {
			this.params = {
				sorgCode: obj.sorgCode,
				cooperateWay: obj.cooperationType,
				orgCode: obj.orgCode,
				supplierCode: obj.sorgCode,
				orgType: obj.orgType
			}
			console.log('params=====', this.params)
			if (obj && (obj.sorgCode || obj.doctorCode)) {
				if (obj.orgType === "18") {
					// 药店
					let data = {
						sorgCode: obj.sorgCode,
						orgName: ''
					}
					this.$refs.phamacyForm.editForm(data)
				} else if (!obj.orgType) {
					let data = {
						cooperateWay: null,
						orgName: ''
					}
					this.$refs.doctorForm.editForm(obj, data)
				} else {
					// 机构
					console.log("机构传参：", this.params)
					this.$refs.queryServiceOrg.showOrgInfo(this.params)
				}
			}
		},
		exportData () {
			this.filterForm.validateFields((error, values) => {
				// 请至少输入一个检索条件!
				let collect = []
				let result
				if (values.code === '') {
					return this.$message.warn('查询类型为必录项')
				}
				console.log("", values.code)
				if (values.code === '01' && values.province === '') {
					return this.$message.warn('省名称为必录项')
				}
				Object.keys(values).forEach((ele) => {
					collect.push(values[ele])
				})
				result = collect.every((item) => { return item === undefined || item === "" || item === null })
				if (result) {
					this.$message.error("请至少输入一个查询条件!")
					return
				}
				if (!error) {
					let data = this.filterForm.getFieldsValue()
					delete data.code
					this.uploading = true
					if (values.code === "01" && data.orgType === "18") {
						supApi.exportSupPha(data).then(res => {
							if (res === (undefined || '')) {
								this.$message.error('文件导出失败！')
							} else {
								this.$downloadFileByBase64(res, `供应商成员导出-药店.xlsx`)
							}
						}).finally(() => {
							this.uploading = false
						})
					} else if (values.code === "02") {
						supApi.exportSupDoc(data).then(res => {
							if (res === (undefined || '')) {
								this.$message.error('文件导出失败！')
							} else {
								this.$downloadFileByBase64(res, `供应商成员导出-医生.xlsx`)
							}
						}).finally(() => {
							this.uploading = false
						})
					} else {
						supApi.exportSupOrg(data).then(res => {
							if (res === (undefined || '')) {
								this.$message.error('文件导出失败！')
							} else {
								this.$downloadFileByBase64(res, `供应商成员导出-机构.xlsx`)
							}
						}).finally(() => {
							this.uploading = false
						})
					}
				}
			})
		}
	}
}
</script>
