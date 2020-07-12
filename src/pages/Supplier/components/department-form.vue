<template>
	<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
		<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
			<a-spin :spinning="spinning"/>
			<a-divider orientation="left"><a-icon type="home"/> 科室信息</a-divider>
			<a-row :gutter="16">
				<!-- <a-col :span="3">
					<a-avatar :size="96" icon="user" />
				</a-col> -->
				<a-col :span="24">
					<a-row>
						<a-col :span="8">
							<a-form-item label="科室名称">
								<a-input v-decorator="['deptName', {rules: [{ required: true, message: '科室名称不能为空!' }]}]" />
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="联系人">
								<a-input v-decorator="['deptLinkman']" />
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="联系电话">
								<a-input v-decorator="['deptTel']" />
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="所属机构">
								<a-input disabled v-decorator="['serviceOrgCode']" :readonly="true" />
							</a-form-item>
						</a-col>
						<!-- <a-col :span="8">
							<a-form-item label="是否有效">
								<DicSelect dicType="EFFECT_TYPE" placeholder="请选择是否有效"
										v-decorator="['validStateDep', {rules: [{ required: true, message: '请选择是否有效!' }]}]" />
							</a-form-item>
						</a-col> -->
					</a-row>
				</a-col>
			</a-row>
			<a-divider orientation="left"><a-icon type="home" /> 科室详细信息</a-divider>
			<a-row :gutter="16">
				<a-row>
					<a-col :span="8">
						<a-form-item label="上级科室名称">
							<DicSelect dicType="UP_DEPT" placeholder="请选择上级科室名称"
								v-decorator="['upDeptCode', {initialValue:'',rules: [{ required: true, message: '请选择上级科室名称!' }]}]"/>
						</a-form-item>
					</a-col>
					<a-col :span="16">
						<a-form-item label="科室特色" :label-col="{ span: 4 }" :wrapper-col="{ span: 11 }">
							<a-input v-decorator="['deptCistic']" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="18">
						<a-form-item label="科室简介" :label-col="{span:3}" :wrapper-col="{span:21}">
							<a-textarea v-decorator="['deptInfo']" :rows="4" />
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
	name: 'department-form',
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
			dateEntity: {},
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {

	 },
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			console.log('addForm======', obj)
			this.isAdd = true
			this.modalTitle = '新建科室'
			this.formModal = true

			this.$nextTick(() => {
				this.dataEntity = {}
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({serviceOrgCode: obj.sorgCode})
			})
		},
		editForm (deptCode, extraParam) {
			let param = {
				deptCode: deptCode
			}
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑科室'
			this.isAdd = false
			this.formModal = true
			this.spinning = true
			supApi.getDeptInfo(param).then(res => {
				this.$nextTick(() => {
					this.dataEntity = res.data.department
					this.dataForm.resetFields()
					this.dataForm.setFieldsValue(res.data.department)
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
				let formData = Object.assign(this.dataEntity, values)

				let data = Object.assign({}, this.extraParam)
				data.department = formData

				this.submitLoading = true
				supApi.saveDept(data).then(res => {
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
