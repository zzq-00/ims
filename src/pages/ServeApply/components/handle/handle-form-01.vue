<template>
  <div>
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-card style="margin:24px;">
        <a-divider orientation="left"><a-icon type="customer-service" /> 服务信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="申请的服务">
              <a-input :value="taskInfo.serviceName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="卡号">
              <a-input :value="taskInfo.cardNo"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="来源">
              <a-input :value="taskInfo.channelTypeDesc"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品信息">
              <a-input :value="taskInfo.productName"  :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin:24px;">
        <a-divider orientation="left"><a-icon type="user" /> 持卡人信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="持卡人姓名">
              <a-input :value="taskInfo.applyName"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :value="taskInfo.applyCertno"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :value="taskInfo.applyTel"  :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin:24px;">
        <a-divider orientation="left"><a-icon type="user" /> 使用人情况</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="使用人姓名">
              <a-input :value="taskInfo.patientName"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="性别">
              <a-input :value="taskInfo.patientGenderDesc"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input :value="taskInfo.patientCerttypeDesc"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :value="taskInfo.patientCertno"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="出生日期">
              <a-input :value="taskInfo.patientBirthDate"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :value="taskInfo.patientTelephone"  :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin:24px;">
        <a-divider orientation="left"><a-icon type="user" /> 联系人信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="联系人姓名">
              <a-input :value="taskInfo.linkmanName"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input :value="taskInfo.linkmanCerttypeDesc"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :value="taskInfo.linkmanCertno"  :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话">
              <a-input :value="taskInfo.linkmanPhone"  :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin:24px;">
        <a-divider orientation="left"><a-icon type="form" /> 申请信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="主要疾病或症状">
              <a-input v-decorator="['disease', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="具体描述">
              <a-input v-decorator="['detailedDescription', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="医疗机构">
              <a-input v-decorator="['sorgName', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="科室">
              <a-input v-decorator="['deptName', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊卡号">
              <a-input v-decorator="['medredCardno', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="期望医生">
              <a-input v-decorator="['resmedDoctorName', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在省">
              <a-input v-decorator="['sorgProvinceName', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市">
              <a-input v-decorator="['sorgCityName', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否有所在地医保">
               <DicSelect :disabled="true" dicType="YES_NO"
                         v-decorator="['medicareFlag', {rules: [{ required: true, message: '不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否需要特需门诊">
               <DicSelect :disabled="true" dicType="YES_NO"
                         v-decorator="['specialFlag', {rules: [{ required: true, message: '不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="期望就诊时间">
              <a-input v-decorator="['resmedDateTypeDesc', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="指定日期">
              <a-input v-decorator="['resmedDates', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="不方便就诊时间">
              <a-input v-decorator="['notResmedDates', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
export default {
	name: "handle-form-01",
	components: {DicSelect},
	props: {
		taskInfo: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			dataForm: this.$form.createForm(this)
		}
	},
	methods: {
		initLoad () {
			let data = this.taskInfo
			this.dataForm.setFieldsValue({
				disease: data.disease,
				detailedDescription: data.detailedDescription,
				sorgName: data.sorgName,
				deptName: data.deptName,
				medredCardno: data.medredCardno,
				resmedDoctorName: data.resmedDoctorName,
				sorgProvinceName: data.sorgProvinceName,
				sorgCityName: data.sorgCityName,
				medicareFlag: data.medicareFlag,
				specialFlag: data.specialFlag,
				resmedDateTypeDesc: data.resmedDateTypeDesc,
				resmedDates: data.resmedDates,
				notResmedDates: data.notResmedDates
			})
		}
	},
	watch: {
		taskInfo: {
			handler (newName, oldName) {
				this.$nextTick(() => {
					this.initLoad()
				})
			},
			immediate: true,
			deep: true
		}
	}
}
</script>
