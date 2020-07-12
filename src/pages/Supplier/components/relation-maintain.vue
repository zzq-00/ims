<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="机构类型">
              <DicSelect dicType="SUPPLIER_SUB_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['orgType_query', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="审批状态">
              <DicSelect dicType="SUPPLIER_SUB_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['orgType_query', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构名称">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构编码">
              <a-input v-decorator="['orgCodeQuery', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
              <DicSelect dicType="COOPERATE_WAY" :allowClear="true" @change="searchHandle" v-decorator="['cooperation_Type', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在省">
              <AddressSelect dicType="0" v-decorator="['province_query', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市">
              <AddressSelect :dicType="this.filterForm.getFieldValue('province_query')" v-decorator="['city_query', {initialValue: ''}]" />
            </a-form-item>
          </a-col>

        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;">刷新</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="search" /> 查询结果</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>

    </a-card>
    <a-row :gutter="16" style="margin-top:24px;">
      <a-col :span="12" :offset="11">
        <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;">选择</a-button>
      </a-col>
    </a-row>
    <a-card>
      <span href="#" slot="title" style="float:left;">
        <a-icon type="shop" /> 供应商</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns2" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>

    </a-card>
    <a-card style="margin-top:24px">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="team" /> 服务商</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns3" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
      <a-row :gutter="16" style="margin-top:10px">
        <a-col :span="12" :offset="11">
          <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;">保存</a-button>
          <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;">撤销</a-button>
          <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;">提交</a-button>
        </a-col>
      </a-row>
    </a-card>

  </a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import { Promise } from 'q'
export default {
	components: { DicSelect, OrgSelect, AddressSelect },
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
			iconType: 'down',
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "机构编码",
					dataIndex: "sorgCode",
					scopedSlots: { customRender: 'sorgCode' }
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName"
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
					title: "机构审批状态",
					dataIndex: "currentStat"
				},
				{
					align: "left",
					title: "机构管理",
					dataIndex: "currentStatusDesc"
				}
			],

			columns2: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "机构编码",
					dataIndex: "sorgCode",
					scopedSlots: { customRender: 'sorgCode' }
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "orgTypeDesc"
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
					title: "机构管理",
					dataIndex: "currentStatusDesc"
				},
				{
					align: "left",
					title: "操作",
					dataIndex: "operation"
				}
			],
			columns3: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "机构编码",
					dataIndex: "sorgCode",
					scopedSlots: { customRender: 'sorgCode' }
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "orgTypeDesc"
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
					title: "操作",
					dataIndex: "currentStatusDesc"
				}
			],
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
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
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
			query.orgName = 'CS'
			query.supplier_code_query = ''
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				mainQuery: query
			}
			this.loading = true
			supApi.querySupOrginInfo(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		revokeRecord () {
			let arr = this.selectedRows.filter(item => ['01', '03'].includes(item.currentStatus))
			if (!arr.length) {
				this.$message.info('只能撤销状态为待送审和审批退回的数据')
				return
			}
			let names = arr.map(item => item.sorgName).join(',')
			let self = this
			this.$confirm({
				title: '确定执行撤销操作吗?',
				content: '数据撤销后不再保留, 机构名称: ' + names,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						let params = { SorgList: arr }
						supApi.revokeAll(params).then(res => {
							self.$message.success('撤销成功!')
							self.loadPageData()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
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
