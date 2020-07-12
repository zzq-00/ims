<template>
 <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="file-search" /> 服务协议查询</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="查询类型">
              <ServiceAgreementSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docDefId', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
        </a-row>
		 <a-row :gutter="16" v-if="seleceType===1">
          <a-col :span="6">
            <a-form-item label="客户号码">
                <a-input  v-decorator="['custNo', { initialValue: '' }]"  ></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6" style="margin:4px 0 0 0;text-align:right">
            <a-button type="" class="editable-add-btn" style="float:left;margin-right:10px;" @click="showModal">客户查询</a-button>
          </a-col>
        </a-row>
		 <a-row :gutter="16" v-if="seleceType===2">
          <a-col :span="8">
            <a-form-item label="协议号码">
                <a-input  v-decorator="['agreementNo', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		  <a-col :span="8">
            <a-form-item label="参考号码">
                <a-input  v-decorator="['businessNo', { initialValue: '' }]" placeholder="卡单号或其他号码"></a-input>
            </a-form-item>
          </a-col>
		   </a-row>
		   <a-row :gutter="16" v-if="seleceType===2">
		   <a-col :span="8">
            <a-form-item label="协议生效日期">
                <a-date-picker v-decorator="['startDate', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
		  <a-col :span="8">
           	 <a-form-item label="至">
                <a-date-picker v-decorator="['startDateTo', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
		    </a-row>
			<a-row :gutter="16" v-if="seleceType===2">
		   <a-col :span="8">
            <a-form-item label="协议终止日期">
                <a-date-picker v-decorator="['endDate', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
		  <a-col :span="8">
           	 <a-form-item label="至">
                <a-date-picker v-decorator="['endDateTo', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
		    </a-row>
				<a-row :gutter="16" v-if="seleceType===2">
		   <a-col :span="8">
            <a-form-item label="协议满期日期">
                <a-date-picker v-decorator="['expireDate', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
		  <a-col :span="8">
           	 <a-form-item label="至">
                <a-date-picker v-decorator="['expireDateTo', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
		    </a-row>
      </a-form>
        <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="loadPageData">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table v-show="showTable"  :bordered="false" :pagination="pagination"  :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
        <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
        </a-card>
    <!--客户查询 start-->
    <a-modal title="查询项"  width="800px"  class="modal_box" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <div>
        <a-form :form="filterForms" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol"  >
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="客户号码">
                <a-input placeholder="客户号码"  v-decorator="['custNo', { initialValue: '' }]"/>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="客户类别">
               <ServiceMenSelect  v-decorator="['customerType', { rules: [{ required: true, message: '请选择客户类别' }] }]"  @change="searchHandles"/>
              </a-form-item>
            </a-col>
          </a-row>
		  <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="客户名称">
                <a-input placeholder="客户名称"  v-decorator="['customerName', { initialValue: '' }]"  />
              </a-form-item>
            </a-col>
            <a-col :span="10" v-if="isMenSelect">
              <a-form-item label="证件号码">
                <a-input placeholder="证件号码" v-decorator="['certno', { initialValue: '' }]"  />
              </a-form-item>
            </a-col>
          </a-row>
		   <a-row :gutter="16">
		  <a-form-item style="float:right;margin-right:10px;">
		   <a-button type="" class="editable-add-btn"   @click="submitMenQuery">查询</a-button>
		  </a-form-item>

        </a-row>
        </a-form>

        <a-card style="margin-top:24px;" v-if="isMen">
          <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="paginations" :rowSelection="rowSelections" :dataSource="pageDatas.data" :columns="columns2" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
            <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
          </a-table>
        </a-card>
		    <a-card style="margin-top:24px;" v-else>
          <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="paginations" :rowSelection="rowSelections" :dataSource="pageDatas.data" :columns="columns3" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
            <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
          </a-table>
        </a-card>
      </div>
	  <template slot="footer">
	   <a-button key="submit" type="" :loading="loading" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确定
        </a-button>
		</template>
    </a-modal>
   </a-card>
</template>
<script>
import api from "@/api/api-service-agreement"
import ServiceAgreementSelect from "@/components/select-service-agreement"
import ServiceMenSelect from "@/pages/service-agreement-query/service-agreement/card-select.vue"
import { Promise } from "q"
import moment from "moment"
import qs from "qs"
export default {
	name: "apply-info",
	components: {ServiceAgreementSelect, ServiceMenSelect},
	data () {
		return {
			visible: false,
			confirmLoading: false,
			// 查询条件
			seleceType: 0,
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: [
				]
			},
			pageDatas: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			filterForms: this.$form.createForm(this),
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{
					align: "left",
					title: "序号",
					// dataIndex:'',
					customRender: (text, record, index) => {
						return `${index + 1}`
					}
					// scopedSlots: { customRender: "docCode" }
				},
				{
					align: "left",
					title: "协议号码",
					dataIndex: "agreementNo",
					scopedSlots: { customRender: "docName" }
				},
				{
					align: "left",
					title: "参考号码",
					dataIndex: "businessNo"
				},
				{
					align: "left",
					title: "客户号码",
					dataIndex: "custNo"
				},
				{
					align: "left",
					title: "客户名称",
					dataIndex: "customerName"
				},
				{
					align: "left",
					title: "协议生效时间",
					dataIndex: "startDate"
				},
				{
					align: "left",
					title: "协议终止时间",
					dataIndex: "endDate"
				},
				{
					align: "left",
					title: "协议满期时间",
					dataIndex: "expireDate"
				}
			],
			columns2: [
				{
					align: "left",
					title: "序号",
					// dataIndex:'',
					customRender: (text, record, index) => {
						return `${index + 1}`
					}
					// scopedSlots: { customRender: "docCode" }
				},
				{
					align: "left",
					title: "客户号码",
					dataIndex: "custNo"
					// scopedSlots: { customRender: "docName" }
				},
				{
					align: "left",
					title: "客户名称",
					dataIndex: "customerName"
				},
				{
					align: "left",
					title: "证件类型",
					dataIndex: "certtypeName"
				},
				{
					align: "left",
					title: "证件号码",
					dataIndex: "certno"
				},
				{
					align: "left",
					title: "性别",
					dataIndex: "genderName"
				},
				{
					align: "left",
					title: "出生日期",
					dataIndex: "birthDate"
				}
			],
			columns3: [
				{
					align: "left",
					title: "序号",
					// dataIndex:'',
					customRender: (text, record, index) => {
						return `${index + 1}`
					}
					// scopedSlots: { customRender: "docCode" }
				},
				{
					align: "left",
					title: "客户号码",
					dataIndex: "custNo"
					// scopedSlots: { customRender: "docName" }
				},
				{
					align: "left",
					title: "客户名称",
					dataIndex: "customerName"
				},
				{
					align: "left",
					title: "联系人",
					dataIndex: "linkman"
				},
				{
					align: "left",
					title: "成立日期",
					dataIndex: "companyEstabDate"
				},
				{
					align: "left",
					title: "单位性质",
					dataIndex: "companyProper"
				},
				{
					align: "left",
					title: "行业类型",
					dataIndex: "companyIndustryType"
				}
			],
			isMen: true,
			isMenSelect: false,
			rowSelections: {
				type: 'radio',
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			rowSelection: {
				type: 'checkbox',
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
			},
			paginations: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChanges(current, pageSize),
				onChange: (page, pageSize) => this.onPageChanges(page, pageSize)
			},
			certnoNum: ''
		}
	},
	mounted () {
		// this.searchHandle()
	},
	methods: {
		handleCancel () {
			this.visible = false
		},
	    handleOk (e) {
			// console.log(this.selectedRows[0].certno)
			this.visible = false
			//    this.=this.selectedRows[0].certno
		   this.filterForm.setFieldsValue({'custNo': this.selectedRows[0].custNo})
		},
		// 查询协议
		queryAgreement () {
			//   let query = this.filterForm.getFieldsValue()
		   this.seleceType == 1 ? this.queryAgreement1() : this.seleceType == 2 ? this.queryAgreement2() : this.queryAgreement3()
		},
		queryAgreement1 () {
         	this.$nextTick(() => {
				this.filterForm.setFieldsValue({
					agreementNo: '',
					businessNo: '',
					endDate: '',
					endDateTo: '',
					expireDate: '',
					expireDateTo: '',
					startDate: '',
					startDateTo: ''
				})
     		this.pagination.current = 1
			// this.loadPageData ()
			})
		 },
		queryAgreement2 () {
			this.$nextTick(() => {
				this.filterForm.setFieldsValue({custNo: this.selectedRows[0].custNo})
				this.pagination.current = 1
			// this.loadPageData ()
			})
		},
		queryAgreement3 () {
         	this.$nextTick(() => {
				this.filterForm.setFieldsValue({
					agreementNo: '',
					businessNo: '',
					endDate: '',
					endDateTo: '',
					expireDate: '',
					expireDateTo: '',
					startDate: '',
					startDateTo: '',
					custNo: ''
				})
     		this.pagination.current = 1
			// this.loadPageData ()
			})
		 },
		// 提交客户查询
		submitMenQuery () {
			   this.filterForms.validateFields(err => {
				if (!err) {
					console.info('success')
				}
			})
			this.$nextTick(() => {
				let query = this.filterForms.getFieldsValue()
		        console.log(query)
				query.customerType === '01' ? this.isMen = true : this.isMen = false
				query.customerType ? this.serchMenQuery(query) : ''
				this.paginations.current = 1
			})
		},
		serchMenQuery (query) {
			let data = {
				page: this.paginations.current,
				limit: this.paginations.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.customerListQuery(data).then(res => {
				// console.log(res, "result")
				this.pageDatas = res.data || { totalCount: 0, data: [] }
				this.pageDatas.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.paginations.total = this.pageDatas.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		showModal () {
			this.loading = false
			this.visible = true
		},
		handleCancel (e) {
			this.visible = false
		},
		searchHandle () {
			this.$nextTick(() => {
				let query = this.filterForm.getFieldsValue()
				this.seleceType = query.docDefId
				this.queryAgreement()
			})
		},
		// 改变客户类别
		searchHandles (e) {
			// this.$nextTick(() => {
			// let query = this.filterForms.getsFieldsValue()
			console.log(e)
			e === '01' ? this.isMenSelect = true : this.isMenSelect = false
			// })
		},
		onPageChange (page, pageSize) {
			this.$nextTick(() => {
				this.pagination.current = page
				this.loadPageData()
			})
		},
		onPageChanges (page, pageSize) {
			this.paginations.current = page
			let query = this.filterForms.getFieldsValue()
		    //    console.log(query)
			this.serchMenQuery(query)
		},
		onPageSizeChanges (current, size) {
			this.$nextTick(() => {
			  this.paginations.pageSize = size
			  this.paginations.current = 1
				let query = this.filterForms.getFieldsValue()
				// console.log(query)
			  this.serchMenQuery(query)
			})
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.paginations.current = 1
			this.$nextTick(() => {
              	this.loadPageData()
			})
		},
		loadPageData () {
			// this.showRecordInfo()
			const query = this.filterForm.getFieldsValue()
			query.startDate ? query.startDate = moment(query.startDate).format('YYYY-MM-DD') + ' 00:00:00' : ''
			query.startDateTo ? query.startDateTo = moment(query.startDateTo).format('YYYY-MM-DD') + ' 00:00:00' : ''
			query.endDate ? query.endDate = moment(query.endDate).format('YYYY-MM-DD') + ' 00:00:00' : ''
			query.endDateTo ? query.endDateTo = moment(query.endDateTo).format('YYYY-MM-DD') + ' 00:00:00' : ''
			query.expireDate ? query.expireDate = moment(query.expireDate).format('YYYY-MM-DD') + ' 00:00:00' : ''
			query.expireDateTo ? query.expireDateTo = moment(query.expireDateTo).format('YYYY-MM-DD') + ' 00:00:00' : ''
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.queryAgreementQuery(data).then(res => {
				// console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		showRecordInfo (obj) {
			console.log(obj)
			// let params = {
			// 	aftertaxChargeAmount: null,
			// 	agreementId: "499739",
			// 	agreementNo: "521019",
			// 	birthDate: "1988-08-04",
			// 	businessNo: null,
			// 	cardNo: null,
			// 	certno: "130426198808043240",
			// 	certtype: "0",
			// 	certtypeName: "身份证",
			// 	clearText: null,
			// 	companyEstabDate: null,
			// 	companyIndustryType: null,
			// 	companyProper: null,
			// 	contactAddr: "丰台区新宫中福丽宫品牌基地4号楼333",
			// 	contactAddr1: "丰台区新宫中福丽宫品牌基地4号楼333",
			// 	contactTelephone: "17301392367",
			// 	contactTelephone1: "17301392367",
			// 	custNo: "0000162020",
			// 	custNo1: "0000162020",
			// 	customerName: "李多多",
			// 	customerName1: "李多多",
			// 	customerType: "01",
			// 	docCode: null,
			// 	endDate: "2019-08-14",
			// 	expireDate: "2019-02-07",
			// 	gender: "1",
			// 	genderName: "女",
			// 	insertOper: null,
			// 	insertTime: null,
			// 	linkman: null,
			// 	orgCode: null,
			// 	paymentWay: null,
			// 	paymentWayName: null,
			// 	pretaxChargeAmount: null,
			// 	productCode: null,
			// 	productId: "129",
			// 	roleType: null,
			// 	saleChannel: null,
			// 	saleNo: null,
			// 	saleWay: null,
			// 	serviceCode: null,
			// 	serviceName: null,
			// 	serviceRelaType: null,
			// 	startDate: null,
			// 	status: null,
			// 	sysNo: null,
			// 	taxChargeAmount: null,
			// 	taxRate: null
			// }
			// obj = params
			this.$router.push({
				name: 'serviceAgreement',
				params: obj
			})
			// this.$refs.warningForm.editForm(obj.docDefId, obj)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		}
	}
}
</script>
<style>
.modal_box {
}
</style>


