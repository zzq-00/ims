<template>
  <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
    <a-spin :spinning="spinning"/>
    <a-divider orientation="left"><a-icon type="home"/> 医生信息</a-divider>
    <a-row :gutter="16">
      <!-- <a-col :span="3">
        <a-avatar :size="96" icon="user" />
      </a-col> -->
      <a-col :span="24">
        <a-row>
          <a-col :span="8">
            <a-form-item label="编码" >
              <a-input :disabed="verify" v-decorator="['doctorCode']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="医生姓名" >
              <a-input :disabed="verify" v-decorator="['doctorName']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话" >
              <a-input :disabled="verify"  v-decorator="['doctorTel']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="所属医院" >
              <a-input :disabled="verify"  v-decorator="['serviceOrgName']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="管理机构">
              <a-input :disabled="verify"  v-decorator="['orgCodeName']" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-divider orientation="left"><a-icon type="plus-square" /> 医生详细信息</a-divider>
    <a-row :gutter="16">
      <a-row>
        <a-col :span="8">
          <a-form-item label="医生编码">
            <a-input :disabled="verify"  v-decorator="['doctorCode']" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="医生姓名">
            <a-input :disabled="verify"  v-decorator="['doctorName']" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="所属医院">
            <a-input :disabled="verify"  v-decorator="['serviceOrgName']" />
          </a-form-item>
        </a-col>
          <a-col :span="8">
          <a-form-item label="所属上级科室">
            <DicSelect :disabed="verify" dicType="UP_DEPT" placeholder="所属上级科室不能为空"
            v-decorator="['upDeptName']" @change="changeDept"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="所属子科室">
            <a-select :disabed="verify" :showSearch="true" :filterOption="true"  optionFilterProp="children" allowClear placeholder="请选择所属上级科室" :dropdownMatchSelectWidth="false"
              v-decorator="['deptName']">
              <a-select-option v-for="(item, index) in deptList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="性别">
            <a-input :disabled="verify"  v-decorator="['doctorGender']" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="出生日期">
            <a-date-picker :disabed="verify" v-decorator="['doctorBirthday']" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="职称">
            <DicSelect :disabed="verify" dicType="CERTI_TYPE" placeholder="请选择证件类型"
            v-decorator="['doctorTitleCode']" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="学历">
            <a-date-picker :disabed="verify" v-decorator="['doctorEducation']" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="联系电话">
            <a-input :disabled="verify"  v-decorator="['doctorTel']" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="18">
          <a-form-item label="擅长" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-textarea :disabed="verify" v-decorator="['doctorSpec']" :rows="4" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="18">
          <a-form-item label="乘车路线" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-textarea :disabed="verify" v-decorator="['busLine']" :rows="4" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-card style="margin-top: 24px;">
          <span slot="title" style="float:left;">
            <a-icon type="aliwangwang-o" /> 服务信息</span>
            <div>
              <a-table :bordered="false" :pagination="pagination2" :dataSource="pageData2.data" :columns="columns2" :rowKey="record => record.supServId" :indentSize=0 :loading="loading2">
              </a-table>
            </div>
        </a-card>
      </a-col>
    </a-row>
    <QueryServiceTable :doctorCode="doctor.doctorCode"/>
    <a-row :gutter="16">
        <a-col :span="12" :offset="12">
          <a-button type="primary" class="editable-add-btn" @click="go(-1)" style="float:right;margin-right:10px;">返回</a-button>
        </a-col>
      </a-row>
  </a-form>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DicSelect from '@/components/dic-select'
import QueryServiceTable from './query-service-table'

export default {
	name: 'query-doctor',
	components: { DicSelect, QueryServiceTable },
	props: {
		verify: {
			type: Boolean,
			default () {
				return true
			}
		}
	},
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			loading2: false,
			spinning: false,
			extraParam: {},
			isAdd: true,
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			deptList: [],
			doctor: {}
		}
	},
	mounted () {
		this.doctor = this.$route.params.doctor
		if (!this.doctor) {
			this.dataForm.setFieldsValue(this.doctor)
		}
	 },
	methods: {
	}
}
</script>
<style>

</style>
