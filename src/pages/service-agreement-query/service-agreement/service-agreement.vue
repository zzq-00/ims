<template>
  <a-card :bordered="false">
   <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="协议号码">
               <a-input  :disabled="disabled"   v-decorator="['agreementNo', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		  <a-col :span="6">
            <a-form-item label="参考号码">
               <a-input  :disabled="disabled"  v-decorator="['businessNo', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		  <a-col :span="6">
            <a-form-item label="费用来源">
               <a-input  :disabled="disabled"  v-decorator="['paymentWayName', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card v-if="customerType=='01'">
      <a-divider orientation="left">
        <a-icon type="file-search" /> 个人客户购买信息</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
            <a-col :span="6">
            <a-form-item label="客户号码" >
               <a-input  :disabled="disabled" v-decorator="['custNo', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="客户名称" >
               <a-input  :disabled="disabled" v-decorator="['customerName', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="性别" >
               <a-input  :disabled="disabled" v-decorator="['genderName', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="证件类型">
               <a-input  :disabled="disabled" v-decorator="['certtypeName', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="证件号码">
               <a-input  :disabled="disabled" v-decorator="['certno', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="出生日期">
               <a-input  :disabled="disabled" v-decorator="['birthDate', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="联系电话">
               <a-input  :disabled="disabled" v-decorator="['contactTelephone', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="联系地址">
               <a-input  :disabled="disabled" v-decorator="['contactAddr', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
	<a-card v-if="customerType=='02'">
      <a-divider orientation="left">
        <a-icon type="file-search" /> 单位客户购买信息</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
            <a-col :span="6">
            <a-form-item label="客户号码" >
               <a-input  :disabled="disabled" v-decorator="['custNo', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="客户名称" >
               <a-input  :disabled="disabled" v-decorator="['customerName', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="成立日期" >
               <a-input  :disabled="disabled" v-decorator="['genderName', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="单位性质">
               <a-input  :disabled="disabled" v-decorator="['certtypeName', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="行业类别">
               <a-input  :disabled="disabled" v-decorator="['certno', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="联系人">
               <a-input  :disabled="disabled" v-decorator="['birthDate', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="联系电话">
               <a-input  :disabled="disabled" v-decorator="['contactTelephone', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
		   <a-col :span="6">
            <a-form-item label="联系地址">
               <a-input  :disabled="disabled" v-decorator="['contactAddr', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;" >
	  <a-divider orientation="left">
        <a-icon type="file-search" /> 交费/费用信息</a-divider>
		<tableOnlyshow :agreementNo="agreementNo" />
        </a-card>
		<a-card style="margin-top:24px;" >
	  <a-divider orientation="left">
        <a-icon type="file-search" /> 产品信息</a-divider>
		<tableOnlyshowProduct :productId="productId" />
        </a-card>
			<a-card style="margin-top:24px;">
	  <a-divider orientation="left">
        <a-icon type="file-search" /> 服务包信息</a-divider>
		<tableOnlyshowService :agreementId="agreementId" />
        </a-card>
			<a-card style="margin-top:24px;">
	  <a-divider orientation="left">
        <a-icon type="file-search" /> 服务信息</a-divider>
		<tableOnlyshowServicebar  :agreementId="agreementId" />
        </a-card>
	    <a-card style="margin-top:24px;">
	  <a-divider orientation="left">
        <a-icon type="file-search" /> 协议轨迹信息</a-divider>
		<tableOnlyshowAddress :agreementId="agreementId" />
        </a-card>
	  <a-card style="margin-top:24px;">
	  <a-divider orientation="left">
        <a-icon type="file-search" /> 服务实施</a-divider>
		<tableOnlyshowServicetor :agreementId="agreementId" />
        </a-card>
      </div>
    </a-modal>
    <!--任务指派 end-->
  </a-card>
</template>
<script>
import tableOnlyshow from "./service-agreement-table.vue"
import tableOnlyshowProduct from "./service-agreement-product.vue"
import tableOnlyshowService from "./service-agreement-service.vue"
import tableOnlyshowServicebar from "./service-agreement-servicebar.vue"
import tableOnlyshowAddress from "./service-agreement-address.vue"
import tableOnlyshowServicetor from "./service-agreement-servicetor.vue"
import { Promise } from "q"
import qs from "qs"
export default {
	name: "apply-info",
	components: {
		tableOnlyshow,
		tableOnlyshowProduct,
		tableOnlyshowService,
		tableOnlyshowServicebar,
		tableOnlyshowAddress,
		tableOnlyshowServicetor
	},
	data () {
		return {
			customerType: '121113131133',
			disabled: true,
			visible: false,
			confirmLoading: false,
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			serviceAgreementMessage: {agreementNum: '1234'},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			agreementId: '',
			productId: '',
			agreementNo: ''
		}
	},
	mounted () {
		// this.searchHandle()
	},
	methods: {
	 searchHandle (params) {
			this.$nextTick(() => {
				// this.pagination.current = 1
				// this.loadPageData()
			  // let params=this.$route.params
				this.filterForm.setFieldsValue({
					agreementNo: params.agreementNo,
					customerName: params.customerName,
					businessNo: params.businessNo,
					custNo: params.custNo,
					birthDate: params.birthDate,
					genderName: params.genderName,
					certno: params.certno,
					certtypeName: params.certtypeName,
					contactTelephone: params.contactTelephone,
					paymentWay: params.paymentWay,
					contactAddr: params.contactAddr
		    })
			})
		},
		returnQuire () {
			this.$router.push({
				path: '/serviceAgreementQuery'
			})
		}
	},
	created () {
		// let params = this.$route.params
		// console.log(params)
		// params.agreementId ? this.searchHandle(params) : this.returnQuire()
		let params = this.$route.params
		this.agreementId = params.agreementId
		this.productId = params.productId
		this.agreementNo = params.agreementNo
		this.customerType = params.customerType
		console.log(params)
		params.agreementId ? this.searchHandle(params) : this.returnQuire()
	}
}
</script>
<style>
.modal_box {
}
</style>


