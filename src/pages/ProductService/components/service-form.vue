<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="服务类别">
              <DicSelect dicType="SERVICE_BASE_TYPE" placeholder="请选择"
                  v-decorator="['serviceBaseType', {rules: [{ required: true, message: '请选择!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务代码">
              <a-input :disabled="inputDisabled" v-decorator="['serviceCode', {rules: [{ required: true, message: '服务代码不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务名称">
              <a-input v-decorator="['serviceName', {rules: [{ required: true, message: '服务名称不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务别名">
              <a-input v-decorator="['serviceAliasName']" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="服务说明" :labelCol="{span: 5}" :wrapperCol="{span: 19}" >
              <a-textarea v-decorator="['explain']" :rows="4" />
            </a-form-item>
          </a-col>
        </a-row>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm" v-show="buttonVisible">保存</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-product-service'
import DicSelect from '@/components/dic-select'

export default {
	name: 'service-form',
	components: { DicSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			serviceId: undefined,
			modalWidth: 770,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
      buttonVisible: false,
      inputDisabled: false
		}
	},
	mounted () {

	 },
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			console.log('addForm======', obj)
			this.isAdd = true
			this.modalTitle = '新建服务'
			this.formModal = true
      this.buttonVisible = true
			this.$nextTick(() => {
				this.dataForm.resetFields()
				// this.dataForm.setFieldsValue({serviceOrgCode: obj.sorgCode})
			})
		},
		editForm (extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑服务'
			this.isAdd = false
			this.formModal = true
      this.buttonVisible = true
      this.inputDisabled = true
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(extraParam)
				this.$emit('on-update')
			})
		},
    showForm(obj) {
      this.extraParam = obj || {}
      this.modalTitle = '服务详情'
      this.isAdd = false
      this.formModal = true
      this.buttonVisible = false
      this.$nextTick(() => {
        this.dataForm.resetFields()
        this.dataForm.setFieldsValue(obj)
        this.$emit('on-update')
      })
    },
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				let data = Object.assign({}, this.extraParam)

				if (this.isAdd) {
					api.addService(formData).then(res => {
						this.$message.success('保存成功!')
						this.formModal = false
						this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					api.updateService({
						...formData,
						"serviceId": data.serviceId,
						"serviceWay": data.serviceWay
					}).then(res => {
						this.$message.success('修改成功!')
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
