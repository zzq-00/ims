<template>
  <a-card :bordered="false">
    <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="机构名称">
            <a-input v-decorator="['sorgName', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构编码">
            <a-input v-decorator="['sorgCode', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="医院等级">
            <DicSelect allowClear dicType="HOSPITAL_LEVEL" v-decorator="['hospitalLevel', {initialValue: ''}]" />
          </a-form-item>
		</a-col>
		<a-col :span="6">
			<a-form-item label="机构类型">
			  <DicSelect allowClear dicType="SUPPLIER_SUB_TYPE" v-decorator="['orgType', {initialValue: ''}]" />
			</a-form-item>
		  </a-col>
        <a-col :span="6">
          <a-form-item label="所在省">
            <AddressSelect allowClear dicType="0" v-decorator="['province', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所在市">
            <AddressSelect allowClear :dicType="this.filterForm.getFieldValue('province')" v-decorator="['city', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12" :offset="11">
          <a-button :disabled="selectedRows.length==0" type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="addOrgProvider">保存</a-button>
          <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
      <a slot="supplierCode" slot-scope="text">{{text}}</a>
      <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
    </a-table>
  </a-card>
</template>
<script>
import supApi from "@/api/api-supplier"
import DicSelect from "@/components/dic-select"
import OrgSelect from "@/components/org-select"
import AddressSelect from "@/components/address-select"
import { Promise } from "q"
export default {
	components: { DicSelect, OrgSelect, AddressSelect },
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
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "机构编码",
					dataIndex: "sorgCode",
					scopedSlots: { customRender: "supplierCode" }
				},
				{
					align: "left",
					title: "所在省",
					dataIndex: "sorgProvinceDesc"
				},
				{
					align: "left",
					title: "所在市",
					dataIndex: "sorgCityDesc"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "orgTypeDesc",
				}
			],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			pagination: {
				pageSize: 5,
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
		this.searchHandle()
	},
	methods: {
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
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				supplierCode: this.param.supplierCode
			}
			data = Object.assign(data,query)
			this.loading = true
			supApi.queryUpsorgist(data).then(res => {
				console.log(res, "result")
				console.log("pagination===", this.pagination)
				this.pageData = res.data
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		addOrgProvider () {
			let data = {
				sorgCode: this.param.sorgCode,
				sorgName: this.param.sorgName,
				supplierCode: this.param.supplierCode,
				orgType: this.param.orgType,
				temp:"relevQueryList",
				serviceOrgObject: this.selectedRows
			}
			console.log(data)
			supApi.saveServProvider(data).then(res => {
				this.$message.success('保存成功!')
				this.filterForm.resetFields()
				this.searchHandle()
				this.$emit("addRelaOrg")
			}).finally(() => {
			})
		}
	}
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
