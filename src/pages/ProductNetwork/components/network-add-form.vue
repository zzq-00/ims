<template>
  <a-card :bordered="false">
    <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
      <a-spin :spinning="spinning"/>
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="产品名称">
              <a-input :disabled="true" :value="extraParams.productName" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务名称">
              <a-input :disabled="true" :value="extraParams.serviceName" />
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
            <a-form-item label="服务成本价格">
              <a-input v-decorator="['minSettleCost', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="至">
              <a-input v-decorator="['maxSettleCost', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务商名称">
              <a-input placeholder="" v-decorator="['sorgName', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务商类型">
              <DicSelect dicType="MEMBER_TYPE" :allowClear="true" v-decorator="['orgType', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商名称">
              <a-input placeholder="" v-decorator="['supplierName', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" @click="resetFilterForm" class="editable-add-btn" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="searchHandle">查询</a-button>
						<a-button type="primary" @click="showTemplateSelect" class="editable-add-btn" style="float:right;margin-right:10px;">选择模板</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
        <span slot="textVal" slot-scope="text">{{text || '-'}}</span>
      </a-table>
    </a-card>
    <a-row :gutter="16" style="margin:10px 0 10px 0;">
      <a-col :span="12" :offset="11">
        <a-button type="primary" :disabled="selectedRows.length === 0" @click="transferRecord" class="editable-add-btn" style="float:right;margin-right:10px;">添加</a-button>
      </a-col>
    </a-row>

    <a-card>
      <a-table :bordered="false" :pagination="false" :dataSource="list2" :columns="columns2" :rowKey="record => record.recordIndex" :indentSize=0
        :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys2, onChange: onRowChange2 }">
        <a slot="operDelete" @click="deleteRecord2(record)" slot-scope="text, record">删除</a>
        <span slot="textVal" slot-scope="text">{{text || '-'}}</span>
      </a-table>
      <a-row :gutter="16" style="margin-top:10px">
        <a-col :span="12" :offset="11">
          <a-button type="primary" :disabled="selectedRows2.length === 0" @click="saveRelation" class="editable-add-btn" style="float:right;margin-right:10px;">保存产品网络</a-button>
          <a-button :disabled="selectedRows2.length === 0" @click="deleteRecord2" class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
        </a-col>
      </a-row>
    </a-card>

		<div slot="footer">
				<a-button type="" @click="formModal=false">关闭</a-button>
			</div>
    </a-modal>

		<ProductTemplateSelect ref="productTemplateSelect" @on-update="onSelectTemplate" />
  </a-card>
</template>
<script>
import api from '@/api/api-product-network'
import SupservSelect from '@/components/supserv-select'
import ProservSelect from '@/components/proserv-select'
import ProductTemplateSelect from './product-template-select'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
export default {
	name: 'network-add-form',
	components: { SupservSelect, ProservSelect, ProductTemplateSelect, DicSelect, AddressSelect },
	data () {
		return {
			formModal: false,
			modalWidth: 1170,
			modalTitle: '',
			spinning: false,
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
			selectedRows: [],
			selectedRowKeys: [],
			extraParams: {},
			loading: false,
			columns: [
				{ align: "center", title: "序号", dataIndex: "recordIndex" },
				{ align: "left", title: "服务商编码", dataIndex: "sorgCode" },
				{ align: "left", title: "服务商名称", dataIndex: "sorgName" },
				{ align: "left", title: "供应商名称", dataIndex: "supplierName" },
				{ align: "left", title: "管理机构", dataIndex: "orgName" },
				{ align: "left", title: "有效起始日期", dataIndex: "startDate" },
				{ align: "left", title: "有效截止日期", dataIndex: "endDate" }
			],

			list2: [],
			columns2: [
				{ align: "center", title: "序号",	dataIndex: "recordIndex" },
				{ align: "left", title: "模板编码", dataIndex: "templetCode" },
				{ align: "left", title: "模板名称",	dataIndex: "templetName" },
				{ align: "left", title: "模板描述",	dataIndex: "templetRemark", scopedSlots: { customRender: 'textVal' } },
				{ align: "left", title: "最后修改日期",	dataIndex: "updateTime" }
				// { align: "left", title: "删除", dataIndex: "operation", scopedSlots: { customRender: 'operDelete' } }
			],
			selectedRows2: [],
			selectedRowKeys2: [],

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
				productCode: this.extraParams.productCode,
				serviceCode: this.extraParams.serviceCode
			}
			Object.assign(data, query)
			console.log("查询条件：", data)
			this.loading = true
			api.getProductServiceOrgBy(data).then(res => {
				console.log('result==', res)
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
		show (extraParams) {
		  console.log("extraParams:", extraParams)
			this.extraParams = extraParams || {}
			this.formModal = true
			this.modalTitle = '服务网络添加'
			this.selectedRows2 = []
			this.selectedRowKeys2 = []
			this.selectedRows = []
			this.selectedRowKeys = []

			this.loadPageData()
			this.loadTemplateList()
		},
		deleteRecord2 () {
			let freshItems = this.selectedRows2.filter(item => item.fresh)
			let notFreshCount = this.selectedRows2.length - freshItems.length

			this.freshItems.forEach(item => {
				this.list2.splice(this.list2.findIndex(item2 => item2.templetCode === item.templetCode), 1)
			})

			if (notFreshCount === 0) {
				return
			}
			let params = {
				serviceCode: this.extraParams.serviceCode,
				productCode: this.extraParams.productCode
			}
			api.delTemplet(params).then(res => {
				this.$Message.success('删除成功')
				this.list2 = []
				this.selectedRowKeys2 = []
				this.selectedRows2 = []
			})
		},
		onRowChange2 (selectedRowKeys, selectedRows) {
			this.selectedRowKeys2 = selectedRowKeys || []
			this.selectedRows2 = selectedRows
		},
		transferRecord () {
			let params = {
				productCode: this.extraParams.productCode,
				serviceCode: this.extraParams.serviceCode,
				serviceNetworks: this.selectedRows
			}
			api.getServiceNetworkInsert(params).then(res => {
				this.$Message.success('添加成功!')
				this.selectedRowKeys = []
				this.selectedRows = []
				this.loadPageData()
			})
		},
		loadTemplateList () {
			this.spinning = true
			api.getTempletCode(this.extraParams).then(res => {
				if (res.data && res.data.templetCode) {
					let params = {
						serviceCode: this.extraParams.serviceCode,
						templetCode: res.data.templetCode
					}
					api.showTemplet(params).then(res => {
						let items = res.data.data
						this.list2 = items
						this.generateIndex4List2()
					})
				}
			}).finally(() => {
				this.spinning = false
			})
		},
		showTemplateSelect () {
			let params = {
				serviceCode: this.extraParams.serviceCode,
				serviceName: this.extraParams.serviceName,
				extraParams: this.extraParams
			}
			this.$refs.productTemplateSelect.show(params)
		},
		generateIndex4List2 () {
			this.list2.forEach((item, index) => {
				item.recordIndex = index + 1
			})
		},
		onSelectTemplate (item) {
			item.fresh = true
			this.list2.push(item)
			this.generateIndex4List2()
		},
		saveRelation () {
			let params = {
				serviceCode: this.extraParams.serviceCode,
				productCode: this.extraParams.productCode,
				prosrvSupsrvTemplets: this.selectedRows2
			}
			api.saveTemplets(params).then(res => {
				this.$Message.success('保存成功')

				this.selectedRows2 = []
				this.selectedRowKeys2 = []
				this.formModal = false
			})
		}
	}
}
</script>
