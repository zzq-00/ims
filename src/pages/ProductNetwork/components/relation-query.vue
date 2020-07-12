<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="供应商服务">
              <SupservSelect :allowClear="true" @change="searchData" v-decorator="['supplierServiceCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="产品服务">
              <ProservSelect :allowClear="true" @change="searchData" v-decorator="['serviceCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="searchHandle">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="search" /> 查询结果</span>
      <a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :scroll="{x:800}" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="supplierServiceName" @click="showRelationInfo(record)" slot-scope="text, record">{{text}}</a>
<!--				<a slot="serviceName" @click="showRelationInfo(record)" slot-scope="text, record">{{text}}</a>-->
				<!-- 处理超长生成...,并加上提示文字代码 -->
        <div :style="{maxWidth: '400px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden', wordWrap: 'break-word', wordBreak: 'break-all' }" slot="serviceCode" slot-scope="text, record">
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>{{record.serviceCode}}</span>
            </template>
            {{record.serviceCode}}
          </a-tooltip>
        </div>
        <div :style="{maxWidth: '400px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden', wordWrap: 'break-word', wordBreak: 'break-all' }" slot="serviceName" @click="showRelationInfo(record)" slot-scope="text, record">
          <a-tooltip style="color: #ec613e" placement="topLeft">
            <template slot="title">
              <span>{{record.serviceName}}</span>
            </template>
            {{record.serviceName}}
          </a-tooltip>
        </div>
      </a-table>
    </a-card>

		<RelationView ref="relationView" />
  </a-card>
</template>
<script>
import api from '@/api/api-product-network'
import SupservSelect from '@/components/supserv-select'
import ProservSelect from '@/components/proserv-select'
import RelationView from './relation-view'
export default {
	components: { SupservSelect, ProservSelect, RelationView },
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
				{ align: "center", title: "序号", dataIndex: "recordIndex" },
				{ align: "left", title: "供应商服务编码", dataIndex: "supplierServiceCode" },
				{ align: "left", title: "供应商服务名称", dataIndex: "supplierServiceName", scopedSlots: { customRender: 'supplierServiceName' } },
				{ align: "left", title: "产品服务编码", dataIndex: "serviceCode", scopedSlots: { customRender: 'serviceCode' } },
        { align: "left", title: "产品服务名称", dataIndex: "serviceName", scopedSlots: { customRender: 'serviceName' } }
			],
			rowSelection: {
				type: 'radio',
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
	  searchData() {
      this.$nextTick(() => {
        this.searchHandle()
      })
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
			this.loadPageData()
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		loadPageData () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				queryParam: query
			}
			this.loading = true
			api.supservRelaQueryPage(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		showRelationInfo (obj) {
		  let data = {
        supplierServiceCode : obj.supplierServiceCode,
        supplierServiceName : obj.supplierServiceName
      }
      this.$emit('showMaintain', data)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		}
	}
}
</script>
