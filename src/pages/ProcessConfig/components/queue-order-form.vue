<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-row :gutter="8">
					<a-col :span="12">
            <a-form-item label="系统用户">
              <a-input :disabled="true" :value="extraParam.userName" />
            </a-form-item>
          </a-col>
					<a-col :span="12">
            <a-form-item label="管理机构">
              <a-input :disabled="true" :value="extraParam.orgName" />
            </a-form-item>
          </a-col>
					<a-col :span="12">
            <a-form-item label="队列名称">
              <a-input :disabled="true" :value="extraParam.queueName" />
            </a-form-item>
          </a-col>
					<a-col :span="12">
            <a-form-item label="订阅日期">
              <a-input :disabled="true" :value="extraParam.insertTime" />
            </a-form-item>
          </a-col>
					<a-col :span="12">
            <a-form-item label="用户姓名">
              <a-input :disabled="true" :value="extraParam.realName" />
            </a-form-item>
          </a-col>
						<a-col :span="12">
            <a-form-item label="是否接收短信">
              <DicSelect dicType="SI_SEND_YN" :allowClear="true" v-decorator="['isMess', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" />
            </a-form-item>
          </a-col>
						<a-col :span="12">
            <a-form-item label="是否接收邮件">
              <DicSelect dicType="SI_SEND_YN" :allowClear="true" v-decorator="['isMail', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" />
            </a-form-item>
          </a-col>
				</a-row>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">返回</a-button>
				<a-button v-if="!readonly" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/api-process-config"
import DicSelect from '@/components/dic-select'
export default {
	name: 'queue-order-form',
	components: { DicSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			readonly: true,
			modalWidth: 800,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {

	 },
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			this.readonly = false
			this.modalTitle = '新建队列订阅'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (extraParam, readonly) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑队列订阅'
			this.readonly = false
			if (readonly) {
				this.modalTitle = '查看队列订阅'
				this.readonly = true
			}
			this.formModal = true
			this.spinning = false
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.extraParam)
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				this.submitLoading = true
				if (data.queueId) {
					api.updateQueueOrder(data).then(res => {
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
