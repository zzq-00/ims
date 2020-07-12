<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="模板名称">
                <a-input placeholder="预约申请-客户-齿科服务-01(必填)" v-decorator="['templateName', {rules: [{ required: true, message: '模板名称不能为空!' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="11">
              <a-form-item label="自动填充内容">
                <a-select v-decorator="['autoFillMess']">
                  <a-select-option v-for="item in messList" :key="item.messCode" :value="item.messName">{{item.messName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="1">
              <a-button :disabled="!dataForm.getFieldValue('autoFillMess')" type="primary" icon="plus" @click="appendMess" />
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="服务节点">
                <DicSelect dicType="ACTUALIZED_STATUS" placeholder="请选择" v-decorator="['templateType', {rules: [{ required: true, message: '请选择' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="发送对象">
                <DicSelect dicType="SEND_OBJECTS" placeholder="请选择" v-decorator="['sendingObjects', {rules: [{ required: true, message: '请选择' }]}]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="服务类型">
                <DicSelect dicType="SERVICE_BASE_TYPE" placeholder="请选择" @change="loadProductList" v-decorator="['serviceType', {rules: [{ required: true, message: '请选择' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="产品名称">
                <a-select v-decorator="['productInfo']" mode="multiple">
                  <a-select-option v-for="item in productList" :key="item.productCode" :value="item.productCode">{{item.productName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="预约来源">
                <DicSelect dicType="ST_SYS_NO" mode="multiple" placeholder="请选择" v-decorator="['applyChannel', {rules: [{ required: false, message: '请选择' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="是否有效">
                <DicSelect dicType="EFFECT_TYPE" placeholder="请选择" v-decorator="['isEffective', {rules: [{ required: true, message: '请选择' }]}]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="发送内容" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                <a-textarea :autosize="{ minRows: 4, maxRows: 6 }" v-decorator="['sendingInfo', {rules: [{ required: true, message: '发送内容不能为空!' }]}]" />
              </a-form-item>
            </a-col>
          </a-row>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button v-if="!readonly" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-process-config'
import DicSelect from '@/components/dic-select'

export default {
	name: 'mess-controll-form',
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

			modalWidth: 970,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			messList: [],
			productList: []
		}
	},
	mounted () {
		this.loadMessList()
	 },
	methods: {
		loadMessList () {
			api.queryFillMessMessageModel().then(res => {
				this.messList = res.data.messL
			})
		},
		loadProductList () {
			this.dataForm.setFieldsValue({productInfo: []})
			let serviceType = this.dataForm.getFieldValue('serviceType')
			if (!serviceType) {
				this.productList = []
				return
			}
			let params = {
				serviceType: serviceType
			}

			api.initProductMessageModel(params).then(res => {
				this.productList = res.data
			})
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.readonly = false
			this.modalTitle = '新增短信/邮件模板维护'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({productInfo: [], applyChannel: []})
			})
		},
		editForm (extraParam, readonly) {
			this.extraParam = extraParam || {}
			this.modalTitle = '修改短信/邮件模板'
			this.readonly = false
			if (readonly) {
				this.readonly = true
				this.modalTitle = '查看短信/邮件模板'
			}
			this.formModal = true
			this.spinning = false
			this.dataForm.resetFields()
			console.log('serviceType===', this.extraParam.serviceType)
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(this.extraParam)
				this.dataForm.setFieldsValue({productInfo: [], applyChannel: []})
				if (this.extraParam.productInfo) {
					this.dataForm.setFieldsValue({productInfo: this.extraParam.productInfo.split(',')})
				}
				if (this.extraParam.applyChannel) {
					this.dataForm.setFieldsValue({applyChannel: this.extraParam.applyChannel.split(',')})
				}
			})
		},
		appendMess () {
			let autoFillMess = this.dataForm.getFieldValue('autoFillMess')
			let sendingInfo = this.dataForm.getFieldValue('sendingInfo') || ''

			sendingInfo = sendingInfo + autoFillMess
			this.dataForm.setFieldsValue({sendingInfo: sendingInfo})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}

				let formData = Object.assign({}, values)
				let data = this.extraParam
				Object.assign(data, formData)
				if (data.productInfo) {
					data.productInfo = data.productInfo.join(',')
				}

				if (data.applyChannel) {
				  console.log('----',data.applyChannel)
          data.applyChannel.map((item,index)=>{
            data.applyChannel[index] = 'A-'+item;
          })
					data.applyChannel = data.applyChannel.join(',')
				}
        console.log('data.applyChannel',data.applyChannel)
				this.submitLoading = true

				if (data.templateId) {
					api.updateMessageTemplateMessageModel(data).then(res => {
						this.$message.success('保存成功!')
						this.formModal = false
						this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					api.insertMessageTemplateMessageModel(data).then(res => {
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
