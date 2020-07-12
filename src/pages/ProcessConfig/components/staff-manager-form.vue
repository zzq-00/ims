<template>
    <div>
        <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
            <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
                <a-row :gutter="8">
                    <a-col :span="8">
                        <a-form-item label="姓名">
                            <a-input :disabled="editBtn" v-decorator="['staffName', {initialValue: '',rules: [{ required: true, message: '请输入姓名!' }]}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="性别">
                            <DicSelect :disabled="editBtn" dicType="GENDER" :allowClear="true" v-decorator="['gender', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="学历">
                            <DicSelect :disabled="editBtn" dicType="EDUCATION" :allowClear="true" v-decorator="['education', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="岗位职务">
                            <a-input :disabled="editBtn" v-decorator="['postOffice', {initialValue: ''}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="职称">
                            <a-input :disabled="editBtn" v-decorator="['technicalTitle', {initialValue: ''}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="联系电话">
                            <a-input v-decorator="['tel', {initialValue: '',rules: [{ required: true, message: '请输入联系电话!' }]}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="公司邮箱">
                            <a-input v-decorator="['email', {initialValue: '',rules: [{ required: true, message: '请输入公司邮箱!' }]}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="入司时间">
                            <a-date-picker :disabled="editBtn" v-decorator="['entryDate', { initialValue: null, rules: [{ required: true, message: '请选择入司时间!' }] }]" format="YYYY/MM/DD"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="人员状态">
                            <DicSelect :disabled="userStatus" dicType="USER_STATUS" :allowClear="true" v-decorator="['status', {initialValue: '01',rules: [{ required: true, message: '请选择!' }]}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="管理机构">
                            <OrgSelect2 :disabled="editBtn" dicType="Attach_86_1" :Attach_86_1="Attach_86_1" v-decorator="['orgCode', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" placeholder="请选择" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="所属部门">
                            <DicSelect :disabled="editBtn" dicType="ORG_DEPT" :allowClear="true" v-decorator="['orgDeptCode', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="用户角色">
                            <DicSelect dicType="health_user_role" :removeList="removeList" :allowClear="true" v-decorator="['userRoleCode', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" />
                        </a-form-item>
                    </a-col>
					<!-- 用户角色为04 分公司管家主管 再展示是否审批人 -->
                    <a-col :span="14" v-show="dataForm.getFieldValue('userRoleCode') === '04'">
                        <a-form-item label="是否可被选择为审核人">
                            <DicSelect dicType="YES_NO" v-decorator="['isApproval', {initialValue: null, rules: [{ required: dataForm.getFieldValue('userRoleCode') === '04', message: '请选择!' }]}]" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="8" v-if="dataForm.getFieldValue('orgDeptCode') === '01' || dataForm.getFieldValue('orgDeptCode') === '03'">
                    <a-col :span="24">
                        <a-form-item :label="dataForm.getFieldValue('orgDeptCode')==='01'?'健管中心':'VIP诊疗室'" :labelCol="{span: 2}" :wrapperCol="{span:22}" >
							<!-- 只有序列外管家才有此校验 -->
                            <a-input-search :disabled="editBtn" v-decorator="['hibmName', {rules: [{ required: this.extraParam.staffSeqType === '02', message: dataForm.getFieldValue('orgDeptCode')==='01'?'健管中心不能为空！':'VIP诊疗室不能为空!' }]}]" enter-button @search="selectOrg" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="8">
                    <a-col :span="24">
                        <a-form-item label="备注" :labelCol="{span: 2}" :wrapperCol="{span:22}">
                            <a-textarea :disabled="editBtn" :allowClear="true" v-decorator="['remark', {initialValue: ''}]" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <div slot="footer">
                <a-button type="" @click="formModal=false">返回</a-button>
                <a-button v-if="!readonly" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
            </div>
        </a-modal>

        <OrgSelectModal ref="orgSelectModal" @on-update="selectOrgHandle"/>
    </div>
</template>
<script>
import moment from 'moment'
import api from "@/api/api-process-config"
import OrgSelect2 from "@/components/org-select2"
import DicSelect from '@/components/dic-select'
import OrgSelectModal from './org-select-modal'
export default {
	name: 'staff-manager-form',
	components: { DicSelect, OrgSelect2, OrgSelectModal },
	data () {
		return {
			Attach_86_1: [
				{type: 9001, value: '总部健管中心'},
				{type: 9002, value: '集团健管中心'}
			],
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			editBtn: false,
			userStatus: true,
			extraParam: {},
			readonly: true,
			modalWidth: 970,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			removeList: ['05']
		}
	},
	mounted () {

	},
	methods: {
		addForm (obj) {
			this.editBtn = false
			this.extraParam = obj || {}
			this.readonly = false
			this.modalTitle = '新建序列外管家'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (extraParam, readonly) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑' + extraParam.staffSeqTypeDesc
			this.readonly = false
			// 序列内外管家排除对应的角色属性
			if (extraParam.staffSeqType === '01') {
				this.removeList = ['06']
			} else {
				this.removeList = ['05']
			}
			if (readonly) {
				this.modalTitle = '查看' + extraParam.staffSeqTypeDesc
				this.readonly = true
			}
			this.formModal = true
			this.spinning = false
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.extraParam)
				if (this.extraParam.entryDate) {
					this.dataForm.setFieldsValue({'entryDate': moment(this.extraParam.entryDate, 'YYYY/MM/DD')})
				}
			})
			this.userStatus = this.editBtn = this.extraParam.staffSeqType === '01'// 设置只读
		},
		selectOrg () {
			this.$refs.orgSelectModal.show()
		},
		selectOrgHandle (obj) {
			this.extraParam.hibmCode = obj.sorgCode
			this.dataForm.setFieldsValue({
				hibmName: obj.sorgName
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return this.$message.error('表单请填写完整!')
				}
				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				this.submitLoading = true
				if (data.staffNo) {
					api.updInfoHousekeeperInfo(data).then(res => {
						this.$message.success('保存成功!')
						this.formModal = false
						this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					api.addHousekeeperInfo(data).then(res => {
						this.$message.success('保存成功!')
						this.formModal = false
						this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				}
			})
		}
	}
}
</script>
<style>

</style>
