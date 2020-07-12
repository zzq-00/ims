<template>
  <a-card :bordered="false">
    <a-divider orientation="left">
      <a-icon type="file-search" /> 查询条件</a-divider>
    <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="供应商管理机构">
			  <OrgSelect dicType="4" :allowClear="true"  v-decorator="['suppOrgCode', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
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
          <a-form-item label="结算状态">
            <DicSelect :defaultList="listArr"  :allowClear="true" v-decorator="['currStatus', {initialValue: ''}]" />
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
          <a-button type="" class="editable-add-btn" style="margin:0px 0 0 0;" :loading="submitLoading" @click="exportSettleConfirm">导出</a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-divider orientation="left">
      <a-icon type="search" /> 查询结果</a-divider>
    <!--<a-table v-show="showTable" bordered :pagination="pagination"  :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading"> -->
    <a-table v-show="showTable" bordered :pagination="pagination"  :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
	<!-- <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a> -->
      <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
    </a-table>
	<a-divider orientation="left">
        <a-icon type="audit" /> 明细查看</a-divider>
				<a-tabs default-active-key="1" >
					<a-tab-pane key="1" tab="实物商品">
						<a-table v-show="physicalGoods" :bordered="false" :pagination="false" :dataSource="pagePhysical.data" :columns="columnPhysical" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loadingPhysical">
        				</a-table>
					</a-tab-pane>
					<a-tab-pane key="2" tab="药店消费" force-render>
						<a-table v-show="pharmacy" :bordered="false" :pagination="false" :dataSource="pagePharmacy.data" :columns="columnsPharmacy" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loadingPharmacy">
        				</a-table>
					</a-tab-pane>
					<a-tab-pane key="3" tab="服务实施" force-render>
						<a-table v-show="service" :bordered="false" :pagination="false" :dataSource="pageService.data" :columns="columnsService" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loadingService">
        				</a-table>
					</a-tab-pane>
				</a-tabs>
    <div>
    <a-radio-group v-model="size" style="margin-bottom: 16px">
      <a-radio-button v-for="item in sortList" :key="item.id" :value="item.id">
        {{item.dataSrc}}
      </a-radio-button>
    </a-radio-group>

  </div>
    <!-- tab切换 -->
    <!-- 商品实物物品 -->
     <!-- <a-table bordered :pagination="pagination1" :dataSource="pageData1.data" :columns="columns1" :rowKey="record => record.id" :indentSize=0 :loading="loading"> -->
      <!-- <a slot="sorgCode" slot-scope="text, record">{{text}}</a> -->

      <!-- <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span> -->
    <!-- </a-table> -->
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
	  <a-row :gutter="16">
          <a-col :span="12" :offset="11" >
            <a-button :disabled="this.sigleObj.currStatus!='02' || this.sigleObj.currStatus==undefined" type="primary" class="editable-add-btn"  @click="submit(1)" style="float:right;margin-right:10px;">结算确认</a-button>
            <a-button type="" class="editable-add-btn" @click="submit(2)" style="float:right;margin-right:10px;">全部确认</a-button>
            <a-button :disabled="this.sigleObj.currStatus!='02' || this.sigleObj.currStatus==undefined" type="" class="editable-add-btn" @click="submit(3)" style="float:right;margin-right:10px;">结算不通过</a-button>
          </a-col>
        </a-row>
  </a-card>
</template>
<script>
import supApi from "@/api/api-supplier"
import DicSelect from "@/components/dic-select"
import OrgSelect from "@/components/org-select"
import AddressSelect from "@/components/address-select"
import { Promise } from "q"

export default {
	name: "supplier-query",
	components: { DicSelect, OrgSelect, AddressSelect },
	data () {
		return {
			submitLoading: false,
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
			pagePhysical: {
				data: []
			},
			pagePharmacy: {
				data: []
			},
			pageService: {
				data: []
			},
			filterForm: this.$form.createForm(this),
			sortList: [],
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			loadingPhysical: false,
			loadingPharmacy: false,
			loadingService: false,
			showTable: true,
			physicalGoods: true,
			pharmacy: true,
			service: true,
			iconType: "down",
			columns: [
				{
					align: "left",
					title: "序号",
					customRender: (value, row, index) => `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1}`
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
					title: "供应商所在机构",
					dataIndex: "suppOrgCode"
				},
				{
					align: "left",
					title: "结算金额",
					dataIndex: "settleAmount"
				},
				{
					align: "left",
					title: "订单数量",
					dataIndex: "orderNum"
				},
				{
					align: "left",
					title: "结算状态",
					dataIndex: "currStatus"
				}
			],
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
			},
			iconTypeSelf: 'down',
			columnPhysical: [
				{
					align: "left",
					title: "序号",
					customRender: (value, row, index) => `${index + 1}`
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
			],
			columnsPharmacy: [
				{
					align: "left",
					title: "序号",
					customRender: (value, row, index) => `${index + 1}`
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
					title: "一卡通卡号",
					dataIndex: "oneCardNo"
				},
				{
					align: "left",
					title: "商户名称",
					dataIndex: "productorhospitalName"
				},
				{
					align: "left",
					title: "消费时间",
					dataIndex: "consumeDate"
				},
				{
					align: "left",
					title: "商品单价",
					dataIndex: "settle_price"
				},
				{
					align: "left",
					title: "商品数量",
					dataIndex: "goodsNum"
				},
				{
					align: "left",
					title: "结算价格",
					dataIndex: "settleAmount"
				},
				{
					align: "left",
					title: "消费类型",
					dataIndex: "consumeType"
				}
			],
			columnsService: [
				{
					align: "left",
					title: "序号",
					customRender: (value, row, index) => `${index + 1}`
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
					title: "服务卡号",
					dataIndex: "cardNo"
				},
				{
					align: "left",
					title: "服务机构",
					dataIndex: "productorhospitalName"
				},
				{
					align: "left",
					title: "就诊时间",
					dataIndex: "serveOccurTime"
				},
				{
					align: "left",
					title: "服务名称",
					dataIndex: "serveItemName"
				},
				{
					align: "left",
					title: "管家姓名",
					dataIndex: "staffName"
				},
				{
					align: "left",
					title: "结算金额",
					dataIndex: "settleAmount"
				},
				{
					align: "left",
					title: "消费类型",
					dataIndex: "consumeType"
				}
			],
			size: '',
			sigleObj: {},
			rowSelection: {
				type: 'radio',
				// selectedRowKeys: [],
				// fixed: true,
				onChange: (index, selectedRows) => {
					// alert(JSON.stringify(index))
					// alert("1-"+JSON.stringify(this.selectedRowKeys))
					// alert(JSON.stringify(this.sigleObj.currStatus))
					console.log(selectedRows[0])
					this.sigleObj = selectedRows[0]
					// alert(JSON.stringify(index[index.length - 1]))
					// alert("2-"+JSON.stringify(index))
					// this.rowSelection.selectedRowKeys = index[index.length - 1]

					this.selectedRows = selectedRows
					this.selectedRowKeys = index
					// alert("3-"+JSON.stringify(this.selectedRowKeys))
					// alert(JSON.stringify(this.sigleObj.currStatus))
					let pam = selectedRows[0]
					let dataPage = {
						page: this.pagination.current,
						limit: this.pagination.pageSize
					}
					// {
					// 	"batchNo": selectedRows[0].batchNo
					// }
					// alert(JSON.stringify(pam))
					this.getSortFuc(pam, dataPage)
					this.getSortPharmacy(pam, dataPage)
					this.getSortService(pam, dataPage)
					// alert("4-"+JSON.stringify(this.selectedRowKeys))
				}
			},

			listArr: [
				// {value:'00',label:'待核对'},
				// {value:'01',label:'核对待确认'},
				{value: '02', label: '待确认'},
				{value: '03', label: '已确认'},
				{value: '01', label: '结算不通过'}
				// {value:'05',label:'核对失败'},
			]
		}
	},
	watch: {
		'size': { // tab改变切换底部table  方法已写
			immediate: false,
			handler (val, old) {
				this.getbotData(this.sigleObj)
			}
		}
	},

	methods: {

		searchHandle () {
			this.clearData()
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		},
		// 筛选数据
		loadPageData () {
			this.filterForm.validateFields((error, values) => {
				if (!error) {
					let query = this.filterForm.getFieldsValue()
					let data = {
						page: this.pagination.current,
						limit: this.pagination.pageSize
					}
					Object.assign(data, query)
					this.loading = true
					supApi.handletlementList(data).then(res => {
						console.log(res, "result")
						// this.columns = [...docColumns]
						this.pageData = res.data || { totalCount: 0, data: [] }
						this.pageData.data.forEach((item, index) => {
							item.recordIndex = index + 1
						})
						// this.pagination.total = this.pageData.totalCount
					}).finally(() => {
						this.loading = false
					})
				}
			})
		},
		// 重置表单
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		// 获取tab类型
		getSortFuc (parm, dataPage) {
			this.$nextTick(() => {
				let pam = {
					"batchNo": parm.batchNo,
					"dataSrc": '02'
				}

				Object.assign(pam, dataPage)
				// alert("实物商品"+JSON.stringify(pam))
				this.loadingPhysical = true
				supApi.handletdSortList(pam).then(res => {
					console.log(res, "result")
					this.pagePhysical = res.data || { totalCount: 0, data: [] }
					this.pagePhysical.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
				}).finally(() => {
					this.loadingPhysical = false
				})
			})
		},
		getSortPharmacy (parm, dataPage) {
			this.$nextTick(() => {
				let pam = {
					"batchNo": parm.batchNo,
					"dataSrc": '01'
				}
				Object.assign(pam, dataPage)
				// alert("药店消费"+JSON.stringify(pam))
				this.loadingPharmacy = true
				supApi.handletdSortList(pam).then(res => {
					// console.log(res, "result")
					// this.sortList=res.data
					console.log(res, "result")
					// this.columns = [...docColumns]
					this.pagePharmacy = res.data || { totalCount: 0, data: [] }
					this.pagePharmacy.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
				}).finally(() => {
					this.loadingPharmacy = false
				})
			})
		},
		getSortService (parm, dataPage) {
			this.$nextTick(() => {
				let pam = {
					"batchNo": parm.batchNo,
					"dataSrc": '03'
				}
				Object.assign(pam, dataPage)
				// alert("服务实施"+JSON.stringify(pam))
				this.loadingService = true
				supApi.handletdSortList(pam).then(res => {
					// console.log(res, "result")
					// this.sortList=res.data
					console.log(res, "result")
					// this.columns = [...docColumns]
					this.pageService = res.data || { totalCount: 0, data: [] }
					this.pageService.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
				}).finally(() => {
					this.loadingService = false
				})
			})
		},
		// 查看每一条详细 跳页面
		showOrgInfo (row) {
			this.$router.push({
				name: 'AccountHand',
				query: {
					data: row
				}
			})
		},
		// 获取底部数据  如要传分页直接加上即可
		getbotData (row) {
			let pam = {
				// "settleDate": row.settleEndDate,
				"settleEndDate": row.settleEndDate,
				"settleStartDate": row.settleStartDate,
				"supplierCode": row.supplierCode,
				"supplierName": row.supplierName

			}
			supApi.handletlementList(pam).then(res => {
				console.log(res, "result")
				// this.columns1 = [...phaColumns]
				this.pageData1 = res.data || { totalCount: 0, data: [] }
				this.pageData1.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
			}).finally(() => {
			})
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.getbotData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.getbotData()
		},
		// tableRefush(){
		// 	this.loadPageData()
		// 	this.pagePhysical = { totalCount: 0, data: [] }
		// 	this.pagePharmacy = { totalCount: 0, data: [] }
		// 	this.pageService = { totalCount: 0, data: [] }
		// },

		clearData () {
			this.selectedRowKeys = []
			this.selectedRows = []
			// this.rowSelection.selectedRowKeys = []
			this.pagePhysical.data = []
			this.pagePharmacy.data = []
			this.pageService.data = []
			this.sigleObj = {}
		},
		// 确认 1部分  2全部 3不通过
		submit (type) {
			let pam = {}
			if (type == 2) {
				pam = this.filterForm.getFieldsValue()
				alert("全部通过" + JSON.stringify(pam))
				supApi.handleAllSubmit(pam).then(res => {
					console.log(res, "result")
					this.$Message.success(res.statusText)
				}).finally(() => {
					this.clearData()
					this.loadPageData()
				})
			} else {
				if (type == 1) {
					alert("结算确认")

					 pam = {
						"batchNo": this.sigleObj.batchNo,
						"currStatus": "03"
					 }
				} else {
					alert("结算不通过")
 					pam = {
						"batchNo": this.sigleObj.batchNo,
						"currStatus": '01'
					 }
				}
				alert("开始请求" + JSON.stringify(pam))
				supApi.handleNoAllSubmit(pam).then(res => {
					console.log(res, "result")
					this.$Message.success(res.statusText)
				}).finally(() => {
					this.clearData()
					this.loadPageData()
				})
			}
		},
		// 导出
		exportSettleConfirm () {
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let query = this.filterForm.getFieldsValue()
				let data = Object.assign({}, query)
				this.submitLoading = true
				supApi.exportSettleConfirm(data).then(res => {
					if (res.status === undefined) {
						// base64内容，文件名
						this.$downloadFileByBase64(res, `结算确认表.xlsx`)
					} else {
						this.$message.error('文件下载失败,请重试')
					}
				}).finally(() => {
					this.submitLoading = false
				})
			})
		}
	}
}
</script>
