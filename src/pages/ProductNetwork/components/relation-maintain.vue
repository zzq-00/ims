<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="服务类型">
              <a-select optionFilterProp="children" :dropdownMatchSelectWidth="false" @change="showTableType" v-decorator="['serviceType', {initialValue: '01'}]">
                <a-select-option v-for="(item, index) in serviceTypeList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-if="filterForm.getFieldValue('serviceType')=='01'">
            <a-form-item label="服务名称">
              <SupservSelect :allowClear="true" @change="showTableType" v-decorator="['serviceCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6" v-else>
            <a-form-item label="服务名称">
              <ProservSelect :allowClear="true" @change="showTableType" v-decorator="['serviceCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;" @click="refreshData">刷新</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="searchHandle">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"> <a-icon type="search" /> 查询结果</span>
      <a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.serviceCode" :indentSize=0 :loading="loading"
				:row-selection="{ type: tableType, selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
        <span slot="textVal" slot-scope="text">{{text || '-'}}</span>
      </a-table>
    </a-card>
    <a-row :gutter="16" style="margin:10px 0 10px 0;">
      <a-col :span="12" :offset="11">
        <a-button type="primary" :disabled="selectedRows.length === 0" @click="transferRecord" class="editable-add-btn" style="float:right;margin-right:10px;">选择</a-button>
      </a-col>
    </a-row>

    <a-card>
      <span href="#" slot="title" style="float:left;"><a-icon type="shop" /> 供应商服务</span>
      <a-table :bordered="false" :pagination="false" :dataSource="list2" :columns="columns2" :rowKey="record => record.serviceCode" :indentSize=0>
        <a slot="operDelete" @click="deleteRecord2(record)" slot-scope="text, record">删除</a>
         <span slot="textVal" slot-scope="text">{{text || '-'}}</span>
      </a-table>

    </a-card>
    <a-card style="margin-top:24px">
      <span href="#" slot="title" style="float:left;"><a-icon type="team" /> 产品服务</span>
      <a-table :bordered="false" :pagination="false" :dataSource="list3" :columns="columns3" :rowKey="record => record.serviceCode" :indentSize=0>
        <a slot="operDelete" @click="deleteRecord3(record)" slot-scope="text, record">删除</a>
         <span slot="textVal" slot-scope="text">{{text || '-'}}</span>
      </a-table>
      <a-row :gutter="16" style="margin-top:10px">
        <a-col :span="12" :offset="11">
          <a-button type="primary" :disabled="list2.length == 0 || list3.length === 0" @click="saveRelation" class="editable-add-btn" style="float:right;margin-right:10px;">保存</a-button>
        </a-col>
      </a-row>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-product-network'
import SupservSelect from '@/components/supserv-select'
import ProservSelect from '@/components/proserv-select'

export default {
	components: { SupservSelect, ProservSelect },
	data () {
		return {
			serviceTypeList: [{value: '01', label: '供应商服务'}, {value: '02', label: '产品服务'}],
			form: {
				resource: ''
			},
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
      tableType: 'radio',
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			showTable: true,
			iconType: 'down',
			columns: [
				{ align: "center", title: "序号", customRender: (value, row, index) => `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1}`},
				{ align: "left", title: "服务编码", dataIndex: "serviceCode" },
				{ align: "left", title: "服务名称", dataIndex: "serviceName" }
			],

			list2: [],
			columns2: [
				{ align: "center", title: "序号",	customRender: (value, row, index) => index + 1 },
				{ align: "left", title: "服务编码", dataIndex: "serviceCode" },
				{ align: "left", title: "服务名称",	dataIndex: "serviceName" },
				{ align: "left", title: "删除", dataIndex: "operation", scopedSlots: { customRender: 'operDelete' } }
			],
			list3: [],
			columns3: [
				{ align: "center", title: "序号", customRender: (value, row, index) => index + 1 },
				{ align: "left", title: "服务编码", dataIndex: "serviceCode", scopedSlots: { customRender: 'sorgCode' } },
				{ align: "left", title: "服务名称",	dataIndex: "serviceName" },
				{ align: "left", title: "删除",	dataIndex: "currentStatusDesc", scopedSlots: { customRender: 'operDelete' } }
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
      delList: []
		}
	},
  mounted() {
    this.searchHandle()
  },
	methods: {
    showTableType (obj) {
      if (obj == '02') {
        this.tableType = 'checkbox'
      } else {
        this.tableType = 'radio'
      }
      this.$nextTick(() => {
        this.searchHandle()
      })
    },
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
		},
		searchHandle () {
			this.pagination.current = 1
			this.selectedRowKeys = []
			this.selectedRows = []
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
				queryParam: {serviceCode: query.serviceCode}
			}
			this.loading = true
			if (query.serviceType === '01') {
				api.supservQueryPage(data).then(res => {
					console.log(res, 'result')
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			} else {
				api.proservQueryPage(data).then(res => {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			}
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		deleteRecord2 (record) {
			let index = this.list2.findIndex(item => item.serviceCode === record.serviceCode)
			this.list2.splice(index, 1)
		},
		deleteRecord3 (record) {
			let index = this.list3.findIndex(item => item.serviceCode === record.serviceCode)
      this.delList.push({"id":this.list3[index]['supplierServicesRelaId']})
			this.list3.splice(index, 1)
		},
		transferRecord () {
			let type = this.filterForm.getFieldValue('serviceType')
			if (type === '01') {
				// 供应商（单选）
        let record = this.selectedRows[0]
        if (this.list2.length > 0) {
          this.$Message.error('只可添加一条供应商服务')
          return
        }
				this.list2.push(record)
			} else {
				// 服务商（多选）
        this.selectedRows.map(item => {
          this.list3.push(item)
        })
        this.list3 = this.unique(this.list3)
			}
		},
		saveRelation () {
			let data = []
      this.list3.map(item => {
        data.push({"serviceCode": item.serviceCode, "supplierServiceCode": this.list2[0].serviceCode})
      })
      console.log("data:", data)
			api.supservRelaSave(data).then(res => {
				this.$Message.success('关系保存成功')
				this.searchHandle()
				this.list2 = []
				this.list3 = []

			})
      this.delList.forEach(item => {
        console.log("item：", item)
        api.supservRelaDelete(item).then(res => {
          this.delList = []
        })
      })
      this.$emit('on-update')
		},
    loadRelationData (obj) {
      this.list2 = []
      this.delList = []
      this.list2.push({
        recordIndex: 1,
        serviceCode: obj.supplierServiceCode,
        serviceName: obj.supplierServiceName
      })
      let params = {
        supplierServiceCode: obj.supplierServiceCode
      }
      this.loading = true
      api.supservRelaQueryList(params).then(res => {
        this.list3 = res;
        this.list3.forEach((item, index) => { item.recordIndex = index + 1})
      }).finally(() => {
        this.loading = false
      })
    },
    unique (arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.serviceCode) && res.set(arr.serviceCode, 1))
    },
    refreshData () {
      this.filterForm.resetFields()
      this.searchHandle()
      this.list2 = []
      this.list3 = []
      this.delList = []
    }
	}
}
</script>
