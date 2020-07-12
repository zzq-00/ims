<template>
  <a-card :bordered="false">
    <a-divider orientation="left">
      <a-icon type="file-search" /> 查询条件</a-divider>
    <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="供应商管理编码">
            <DicSelect dicType="SUPPLIER_SUB_TYPE" :allowClear="true" v-decorator="['supplierCode', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="供应商名称">
			   <a-input v-decorator="['supplierName', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
		<a-col :span="8">
			<a-form-item label="结算起始日期">
				<a-date-picker value-format="YYYY-MM-DD"  v-decorator="['settleStartDate',{rules: [{ required: true, message: '结算起始日期不能为空!' }]}]" />
			</a-form-item>
		</a-col>
		<a-col :span="8">
			<a-form-item label="结算结算日期">
				<a-date-picker value-format="YYYY-MM-DD"  v-decorator="['settleEndDate']" />
			</a-form-item>
		</a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align:right">
          <a-button type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="searchHandle">查询</a-button>
          <a-button type="" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="resetFilterForm">重置</a-button>
          <!-- <a-button type="" class="editable-add-btn" style="margin:0px 0 0 0;">导出</a-button> -->
        </a-col>
      </a-row>
    </a-form>
    <div>
    <a-radio-group v-model="size" style="margin-bottom: 16px">
      <a-radio-button v-for="item in sortList" :key="item.id" :value="item.id">
        {{item.consumeType}}
      </a-radio-button>
    </a-radio-group>

  </div>
    <!-- tab切换 -->
    <!-- 商品实物物品 -->
     <a-table bordered :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">
      <!-- <a slot="sorgCode" slot-scope="text, record">{{text}}</a> -->

      <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
    </a-table>
	  <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="primary" :disabled="selectedRows.length === 0" class="editable-add-btn" @click="submit()" style="float:right;margin-right:10px;">确认</a-button>
          </a-col>
        </a-row>
    <!-- 药店消费数据 -->
     <!-- <a-table v-show="size=='default'" bordered :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns1" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
      <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
      药店消费数据
      <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
    </a-table> -->
    <!-- 服务实施结算 -->
     <!-- <a-table v-show="size=='large'" bordered :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns1" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
      <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
     服务实施结算
      <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
    </a-table> -->
  </a-card>
</template>
<script>
import supApi from "@/api/api-supplier"
import DicSelect from "@/components/dic-select"
import OrgSelect from "@/components/org-select"
import AddressSelect from "@/components/address-select"
import { Promise } from "q"
let docColumns = [
	{
		align: "center",
		title: "序号",
		dataIndex: "recordIndex"
	},
	{
		align: "left",
		title: "供应商编码",
		dataIndex: "supplierCode"
	},
	{
		align: "left",
		title: "供应商名称",
		dataIndex: "supplierName"
	},
	{
		align: "left",
		title: "供应商管理机构",
		dataIndex: "suppOrgCode"
	},
	{
		align: "left",
		title: "订单号",
		dataIndex: "orderNo"
	},
	{
		align: "left",
		title: "支付方式",
		dataIndex: "payWay"
	},
	{
		align: "left",
		title: "商品名称",
		dataIndex: "productorhospitalName"
	},
	{
		align: "left",
		title: "协议单价",
		dataIndex: "settle_price"
	},
	{
		align: "left",
		title: "商品数量",
		dataIndex: "goodsNum"
	},
	{
		align: "left",
		title: "发货时间",
		dataIndex: "buying_time"
	},
	{
		align: "left",
		title: "收货人姓名",
		dataIndex: "consignee"
	},
	{
		align: "left",
		title: "收货人地址",
		dataIndex: "consigneeAddress"
	},
	{
		align: "left",
		title: "消费类型",
		dataIndex: "consumeType"
	}

]
export default {
	name: "supplier-query",
	components: { DicSelect, OrgSelect, AddressSelect },
	data () {
		return {
			size: 'small',
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			sortList: [],
			filterForm: this.$form.createForm(this),
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [],
			size: '',
			sigleObj: {},
			rowSelection: {
				type: 'radio',
				onChange: (index, selectedRows) => {
					console.log(selectedRows[0])
					this.sigleObj = selectedRows[0]
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
	watch: {
		'size': { // tab改变切换底部table  方法已写
			immediate: false,
			handler (val, old) {


			}


		}
	},
	mounted () {
		// 测试id接口
		// this.getSortFuc({
		// 	"batchNo": 1,
		// 	"dataSrc": '',
		// })
		// this.searchHandle()  //不默认开局筛选
		console.log(this.$route)
		if (this.$route.query.data) { // 结算确认点击过来
			let row = this.$route.query.data
			this.filterForm = {
				"settleEndDate": row.settleEndDate,
				"settleStartDate": row.settleStartDate,
				"supplierCode": row.supplierCode,
				"supplierName": row.supplierName
			}
			this.getData(this.filterForm)
		}
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
			this.loadPageData()
		},
		// 筛选数据
		loadPageData () {
			this.filterForm.validateFields((error, values) => {
				if (!error) {
					let query = this.filterForm.getFieldsValue()
					delete query.code
					let pam = query
					query.page = this.pagination.current
					query.limit = this.pagination.pageSize
					query.settleEndDate = query.settleEndDate ? query.settleEndDate : ''
					this.getData(pam)
				}
			})
		},
		// 请求列表数据，如需要传分页，在pam里面加上即可
		getData (pam) {
			this.loading = true
			supApi.handletSingleList(pam).then(res => {
				console.log(res, "result")
				this.columns = [...phaColumns]
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				// this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		// 重置表单
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		// 获取tab类型
		getSortFuc (pam) {
			supApi.handletdSortList(pam).then(res => {
				console.log(res, "result")
				this.sortList = res.data
			}).finally(() => {
			})
		},
		// 确认
		submit () {
			let pam = this.sigleObj
			supApi.handleSubmit(pam).then(res => {
				console.log(res, "result")
				this.$Message.success(res.statusText)
			}).finally(() => {
			})
		}

	}
}
</script>
