<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="机构编码">
              <a-input v-decorator="['sorgCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构名称">
              <a-input v-decorator="['sorgName', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在省">
              <AddressSelect dicType="0" v-decorator="['sorgProvince', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市">
              <AddressSelect :dicType="this.filterForm.getFieldValue('sorgProvince')" v-decorator="['sorgCity', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构类型">
              <DicSelect dicType="SUPPLIER_SUB_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['orgType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="合作方式">
              <DicSelect dicType="COOPERATE_WAY" :allowClear="true" @change="searchHandle" v-decorator="['cooperationType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
              <OrgSelect dicType="4" :allowClear="true" @change="searchHandle" v-decorator="['orgCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="提取方式">
              <a-select optionFilterProp="children" :dropdownMatchSelectWidth="false" v-decorator="['dataSource', {initialValue: 'MergeSorg'}]">
                <a-select-option v-for="(item, index) in typeList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="downloadHistory" style="float:right;margin-right:10px;">合并历史下载</a-button>
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <a-table v-show="showTable" :bordered="false" :scroll="{ x: 'max-content'}" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="sorgCode" @click="showSimilardata(record)" slot-scope="text,record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
    </a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 机构信息</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType2" @click="swithTableShow2" /></a>
				<a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="primary" class="editable-add-btn" @click="openMergeForm" style="float:right;margin-right:10px;">合并机构</a-button>
            <a-button type="" class="editable-add-btn" @click="mergeBack" style="float:right;margin-right:10px;">非相似数据</a-button>
          </a-col>
        </a-row>
      <a-table v-show="showTable2" :bordered="false" :scroll="{ x: 'max-content'}" :pagination="pagination2" :rowSelection="rowSelection2" :dataSource="pageData2.data" :columns="columns2" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading2">
      </a-table>
    </a-card>
    <MergeForm ref="mergeForm" @on-update="mergeSorg"/>
    <HistoryForm ref="historyForm"/>
  </a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import MergeForm from '@/pages/Supplier/components/supplier-merges-form'
import HistoryForm from '@/pages/Supplier/components/merge-history-form'
import { Promise } from 'q'

export default {
	components: { DicSelect, OrgSelect, AddressSelect, MergeForm, HistoryForm },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			typeList: [{value: 'MergeSorg', label: '系统提取'}, {value: 'externalOrg', label: '接口提取'}],
			pageData: {
				dataCount: 0,
				data: []
			},
			pageData2: {
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
					dataIndex: "sorgprovincename"
				},
				{
					align: "left",
					title: "所在市",
					dataIndex: "sorgcityname"
				},

				{
					align: "left",
					title: "详细地址",
					dataIndex: "sorgAddress"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "orgTypeDesc"
				},
				{
					align: "left",
					title: "合作方式",
					dataIndex: "cooperationTypeDesc"
				},
				{
					align: "left",
					title: "管理机构",
					dataIndex: "orgCodeDesc",
					scopedSlots: { customRender: 'orgCodeDesc' }
				},
				{
					align: "left",
					title: "相似数据数量",
					dataIndex: "similardata"
				}
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
			},
			selectedRows2: [],
			loading2: false,
			showTable2: true,
			iconType2: 'down',
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
					title: "所在省",
					dataIndex: "sorgprovincename"
				},
				{
					align: "left",
					title: "所在市",
					dataIndex: "sorgcityname"
				},

				{
					align: "left",
					title: "详细地址",
					dataIndex: "sorgAddress"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "orgType"
				},
				{
					align: "left",
					title: "合作方式",
					dataIndex: "cooperationTypeDesc"
				},
				{
					align: "left",
					title: "管理机构",
					dataIndex: "orgCodeDesc",
					scopedSlots: { customRender: 'orgCodeDesc' }
				}
			],
			rowSelection2: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows2 = selectedRows
				}
			},
			pagination2: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange2(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange2(page, pageSize)
			},
			sorgCode: undefined
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
				limit: this.pagination.pageSize
			}
			let formData = this.filterForm.getFieldsValue()
			Object.assign(data, formData)

			this.loading = true
			supApi.mergeQuerySupplier(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		showSimilardata (record) {
		  let data = {
				sorgCode: record.sorgCode
			}
		  supApi.dealMergeCheck(data).then(res => {
		    if (res.data.result === "true") {
					this.$message.info("该相似机构在其他服务中正在使用，当前不可合并！")
					return
				}
				this.sorgCode = record.sorgGroup
				this.loadSimilardata()
			})
		},
		loadSimilardata () {
			this.pagination2.current = 1
			this.loadSimilardataPage()
		},
		onPageChange2 (page, pageSize) {
			this.pagination2.current = page
			this.loadSimilardataPage()
		},
		onPageSizeChange2 (current, size) {
			this.pagination2.pageSize = size
			this.searchHandle2()
		},
		loadSimilardataPage () {
			let data = {
				page: this.pagination2.current,
				limit: this.pagination2.pageSize,
				dataSource: this.filterForm.getFieldsValue().dataSource,
				sorgGroup: this.sorgCode
			}
			this.loading2 = true
			supApi.mergeSimilardata(data).then(res => {
				this.pageData2 = res.data || { totalCount: 0, data: [] }
				this.pageData2.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination2.total = this.pageData2.totalCount
			}).finally(() => {
				this.loading2 = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		openMergeForm () {
		  if (this.selectedRows2.length === 0) {
				this.$message.info("请选择数据!")
				return
			}
			if (this.selectedRows2.length === 1) {
				this.$message.info("请至少选择两条数据!")
				return
			}
			let sorgNameList = []
			this.selectedRows2.map(item => {
				sorgNameList.push({value: item.sorgCode, label: item.sorgName})
			})
			this.$refs.mergeForm.sorgNameSelect(sorgNameList)
		},
		mergeSorg (obj) {
			let data = {}
			data.mergeList = []
			this.selectedRows2.map(item => {
				if (item.sorgCode === obj.sorgCode) {
					item.isTarget = "Y"
				}
				data.mergeList.push(item)
			})
			data.updateName = obj.updateName
			supApi.dealMergeSorg(data).then(res => {
			  if (res.status === 0) {
			    this.$message.success("合并成功！")
					this.pageData2 = res.data || { totalCount: 0, data: [] }
					this.pageData2.data.forEach((item, index) => { item.recordIndex = index + 1 })
					this.pagination2.total = this.pageData2.totalCount
				}
			}).finally(() => {
				this.loading2 = false
			})
		},
		mergeBack () {
			if (this.selectedRows2.length === 0) {
				this.$message.info("请至少选择一条数据")
				return
			}
			let data = {}
			data.delSorgList = []
			this.selectedRows2.map(item => {
				data.delSorgList.push(item)
			})
			supApi.dealMergeBackList(data).then(res => {
				this.pageData2 = res.data || { totalCount: 0, data: [] }
				this.pageData2.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination2.total = this.pageData2.totalCount
			}).finally(() => {
				this.loading2 = false
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		swithTableShow2 () {
			this.showTable2 = !this.showTable2
			this.iconType2 = this.showTable2 ? 'down' : 'up'
		},
		downloadHistory () {
		  this.$refs.historyForm.initHistoryForm()
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
