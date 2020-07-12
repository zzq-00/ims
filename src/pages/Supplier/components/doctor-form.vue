<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
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
              <a-form-item label="医生姓名" >
                <a-input v-decorator="['doctorName',{rules: [{ required: true, message: '医生姓名不能为空!' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="性别" >
                <DicSelect dicType="GENDER" placeholder="请选择性别"
                  v-decorator="['doctorGender', {initialValue:'',rules: [{ required: true, message: '请选择性别!' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="职称" >
                <DicSelect dicType="DOCTOR_TITLE_CODE" placeholder="请选择职称"
                  v-decorator="['doctorTitleCode', {initialValue:'',rules: [{ required: true, message: '请选择职称!' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="医生别名" >
                <a-input v-decorator="['doctorAlias']" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="学历" >
                <DicSelect dicType="EDUCATION_S" placeholder="请选择学历"
                  v-decorator="['doctorEducation', {initialValue:'',rules: [{ required: true, message: '请选择学历!' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="执业证书编码" >
                <a-input v-decorator="['vocCertifiCode']" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="联系电话" >
                <a-input v-decorator="['doctorTel']" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider orientation="left"><a-icon type="plus-square" /> 医生详细信息</a-divider>
      <a-row :gutter="16">
        <a-row>
          <a-col :span="8">
            <a-form-item label="证件类型">
              <DicSelect dicType="CERTI_TYPE" placeholder="请选择证件类型"
              v-decorator="['idtype',{initialValue:'',rules: [{ required: true, message: '请选择证件类型!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idno',{rules: [{ required: true, message: '证件号码不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="出生日期">
              <a-date-picker v-decorator="['doctorBirthday']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="所属机构">
              <a-input disabled v-decorator="['serviceOrgCode']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="所属上级科室">
              <DicSelect :disabled="disableDept" dicType="UP_DEPT" placeholder="所属上级科室不能为空"
              v-decorator="['upDeptCodeDoc', {initialValue:'',rules: [{ required: true, message: '请选择所属上级科室!' }]}]" @change="changeDept"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="所属科室">
              <a-select :disabled="disableDept" :showSearch="true" :filterOption="true"  optionFilterProp="children" allowClear placeholder="请选择所属上级科室" :dropdownMatchSelectWidth="false"
                v-decorator="['deptNameDoc', {initialValue:'',rules: [{ required: true, message: '所属科室不能为空!' }]}]">
                <a-select-option v-for="(item, index) in deptList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item label="擅长" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-textarea v-decorator="['doctorSpec', {rules: [{ required: true, message: '擅长不能为空!' }]} ]" :rows="4" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-row>
    </a-form>
    <div slot="footer">
      <a-button v-if="!verify" type="" @click="formModal=false">取消</a-button>
      <a-button v-if="!verify" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
    </div>
  </a-modal>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'

export default {
	name: 'doctor-form',
	components: { DicSelect },
	props: {
		verify: {
			type: Boolean,
			default () {
				return false
			}
		}
	},
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 1070,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			deptList: [],
			doctorData: {},
			disableDept: false
		}
	},
	mounted () {

	 },
	methods: {
		changeDept (value) {
			let param = {
				deptName: value,
				sorgCode: this.extraParam.sorgCode
			}
			supApi.querySelectDeptList(param).then(res => {
				this.deptList = []
				res.data.map(item => {
					// 科室名称（格式：科室编码,科室名称）
					this.deptList.push({value: item.deptCode + "," + item.deptName, label: item.deptName})
				})
				this.dataForm.setFieldsValue({deptNameDoc: ''})
			}).finally(() => {
				this.spinning = false
			})
		},
		addForm (obj) {
			this.extraParam = obj || {}
			console.log('addForm======', obj)
			this.isAdd = true
			this.modalTitle = '新建医生'
			this.formModal = true
			this.disableDept = false
			this.doctorData = {}
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({serviceOrgCode: obj.sorgName})
			})
		},
		editForm (obj, extraParam) {
		  // 接收医生信息，保存按钮需要医生编码等信息
			this.disableDept = true
			this.doctorData = obj
			console.log(obj, 'doctor edit')
			let param = {
				docCode: obj.doctorCode,
				docDept: obj.deptCodeDoc,
				docName: '',
				sorgCode: extraParam.sorgCode
			}
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑医生'
			this.isAdd = false
			this.formModal = true
			this.spinning = true
			supApi.getDoctorInfo(param).then(res => {
				this.$nextTick(() => {
					this.dataForm.resetFields()
					this.dataForm.setFieldsValue(res.data.doctor)
					this.dataForm.setFieldsValue({serviceOrgCode: res.data.doctor.docServiceOrgName})
				})
			}).finally(() => {
				this.spinning = false
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				let data = {
					serviceOrgCode: this.extraParam.sorgCode,
					docServiceOrgName: this.extraParam.sorgName,
					docCode: this.doctorData.doctorCode
				}
				data.doctor = formData
				data.doctor.serviceOrgCode = this.extraParam.sorgCode
				data.doctor.doctorCode = this.doctorData.doctorCode
				console.log("this.doctorData.doctorCode:", this.doctorData.doctorCode)
				if (this.doctorData.doctorCode === undefined || this.doctorData.doctorCode === '') {
					data.doctor.deptNameDoc = this.dataForm.getFieldValue('deptNameDoc')
				} else {
					data.doctor.deptNameDoc = this.doctorData.deptCodeDoc + "," + this.doctorData.deptNameDoc
				}
				this.submitLoading = true
				supApi.saveDoctor(data).then(res => {
					this.$message.success('保存成功!')
					this.formModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		}
	}
}
</script>
<style>

</style>
