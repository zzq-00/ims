<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1070" title="详细信息">
    <a-form :form="dataForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-spin :spinning="spinning"/>
      <a-divider orientation="left"><a-icon type="search" />详细信息</a-divider>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="管理机构" >
            <a-input disabled v-decorator="['orgName']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="管家姓名" >
            <a-input disabled v-decorator="['staffName']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="管家工号" >
            <a-input disabled v-decorator="['staffNo']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="系统账号" >
            <a-input disabled v-decorator="['systemNo']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="客户类型" >
            <a-input disabled v-decorator="['customerTypeStr']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务实施机构" >
            <a-input disabled v-decorator="['serviceExecuteOrgStr']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="健管中心名称" >
            <a-input disabled v-decorator="['realName']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="VIP诊疗室名称" >
            <a-input disabled v-decorator="['vipName']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务项目" >
            <a-input disabled v-decorator="['serveItemDesc']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务细类" >
            <a-input disabled v-decorator="['serveItemSub']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务单位" >
            <a-input disabled v-decorator="['serveUnitDesc']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务数量" >
            <a-input disabled v-decorator="['serveCount']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务时间" >
            <a-input disabled v-decorator="['serveTime']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务机构/预约医院" >
            <a-input disabled v-decorator="['serviceProvider']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showCustomer">
          <a-form-item label="客户姓名" >
            <a-input disabled v-decorator="['customeName']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showCustomer">
          <a-form-item label="客户证件类型" >
            <a-input disabled v-decorator="['customeCertTypeDesc']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showCustomer">
          <a-form-item label="客户证件号" >
            <a-input disabled v-decorator="['customeCertNum']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showCustomer">
          <a-form-item label="客户性别" >
            <a-input disabled v-decorator="['customeSexStr']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showCustomer">
          <a-form-item label="出生日期" >
            <a-input disabled v-decorator="['borthTimeStr']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showTeam">
          <a-form-item label="团体客户名称" >
            <a-input disabled v-decorator="['teamName']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showTeam">
          <a-form-item label="团体客户人数" >
            <a-input disabled v-decorator="['teamNum']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="备注" >
            <a-input disabled v-decorator="['remarkdesc']" />
          </a-form-item>
        </a-col>
        <a-col :span="6" v-show="showCustomer">
          <a-form-item label="客户人数" >
            <a-input disabled v-decorator="['customerNum']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="联系电话" >
            <a-input disabled v-decorator="['custTel']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="客户来源" >
            <a-input disabled v-decorator="['custChannelDesc']" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div slot="footer">
      <a-button type="" @click="formModal=false">关闭</a-button>
    </div>
  </a-modal>
</template>
<script>

export default {
	data () {
		return {
			// 查询条件
			formItemLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			formLayout: "horizontal",
			dataForm: this.$form.createForm(this),
			submitLoading: false,
			spinning: false,
			formModal: false,
			showCustomer: false,
			showTeam: false
		}
	},
	methods: {
	  initForm (obj) {
	    if (obj.customerType === '01') {
	      this.showCustomer = true
				this.showTeam = false
			} else {
				this.showCustomer = false
				this.showTeam = true
			}
			this.formModal = true
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(obj)
			})
		}
	}
}
</script>
