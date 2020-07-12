<template>
  <div>
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
        <RelationForm ref="relationForm" v-show="readOnly" :dataRef="dataRef"/>
				<a-card style="margin: 12px;">
          <a-divider orientation="left">
            <a-icon type="search" />服务包基本信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
                <a-col :span="8">
									<a-form-item label="服务包编码">
										<a-input allowClear :disabled="readOnly" v-decorator="['serviceCode',{rules: [{ required: true, message: '服务包编码不能为空!' }]}]"  />
									</a-form-item>
								</a-col>
                <a-col :span="8">
									<a-form-item label="服务包名称">
										<a-input allowClear :disabled="readOnly" v-decorator="['serviceName',{rules: [{ required: true, message: '服务包名称不能为空!' }]}]" />
									</a-form-item>
								</a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
									<a-form-item label="计费方式">
										<DicSelect allowClear :disabled="readOnly" dicType="CHARGING_WAY" v-decorator="[
                      'chargingWay',
                      {initialValue: '',rules: [{ required: true, message: '请选择计费方式!' }]}
                      ]" placeholder="请选择计费方式" @select="disabledAmountUnitDic" />
									</a-form-item>
								</a-col>
                <a-col :span="8">
									<a-form-item label="服务可用额度">
										<a-input-number allowClear :disabled="readOnly" v-decorator="['availableAmount', {initialValue: '',rules: [{ required: dataForm.getFieldValue('chargingWay') !='00' && dataForm.getFieldValue('chargingWay') !='01', message: '请输入服务可用额度' }]}]" />
									</a-form-item>
								</a-col>
                <a-col :span="8">
									<a-form-item label="服务可用额度单位">
										<DicSelect allowClear :disabled="readOnly" ref="amountUnitDic" dicType="AMOUNT_UNIT" v-decorator="[
                      'amountUnit',
                      {initialValue: '',rules: [{ required: dataForm.getFieldValue('chargingWay') !='00', message: '请选择可用额度单位!' }]}
                      ]" placeholder="请选择服务可用额度单位" />
									</a-form-item>
								</a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
									<a-form-item label="服务包定价">
										<DicSelect allowClear :disabled="readOnly" dicType="PRICE_SERVICE" v-decorator="[
                      'priceOption',
                      {initialValue: '',rules: [{ required: true, message: '请选择服务包定价!' }]}
                      ]" placeholder="请选择服务包定价" />
									</a-form-item>
								</a-col>
                <a-col :span="8" v-show="dataForm.getFieldValue('priceOption') === '01'">
                  <a-form-item labe=" ">
                    <a-input-number allowClear :disabled="readOnly" v-decorator="['price',{initialValue: '',rules: [{ required: dataForm.getFieldValue('priceOption') ==='01', message: '请输入固定值' }]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
									<a-form-item label="可选必选">
										<DicSelect allowClear :disabled="readOnly" dicType="SERVICE_OPTION" v-decorator="[
                      'serviceOption',
                      {initialValue: '',rules: [{ required: true, message: '请选择可选必选!' }]}
                      ]" placeholder="请选择可选必选" />
									</a-form-item>
								</a-col>
                <a-col :span="8">
									<a-form-item label="服务选项">
										<DicSelect allowClear :disabled="readOnly" dicType="SERVICE_APPOINT" v-decorator="[
                      'serviceAppoint',
                      {initialValue: '',rules: [{ required: true, message: '请选择服务选项!' }]}
                      ]" placeholder="请选择服务选项" />
									</a-form-item>
								</a-col>
                <a-col :span="8" v-if="dataForm.getFieldsValue(['serviceAppoint']).serviceAppoint =='03'">
									<a-form-item label="服务可实施个数">
										<a-input-number allowClear :disabled="readOnly" v-decorator="[
                      'serviceNum',{initialValue: '',rules: [{ required: dataForm.getFieldsValue(['serviceAppoint']).serviceAppoint =='03', message: '服务可实施个数不能为空!' }]}]" />
									</a-form-item>
								</a-col>
                <a-col :span="24"  v-show="!readOnly">
                  <a-button type="primary" class="editable-add-btn" style="float:right;margin:0px 10px 0 0;" @click="submitForm">保存</a-button>
                </a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
			</a-form>
  </div>
</template>
<script>
  import OrgSelect2 from '@/components/org-select2'
  import DicSelect from '@/components/dic-select'
  import 'moment/locale/zh-cn'
  import RelationForm from '@/pages/Product/components/service-relation-form'

  export default {
	name: 'service-package-form',
	components: { DicSelect, OrgSelect2, RelationForm },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			entityData: {},
			isAdd: true,
			modalWidth: 970,
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			readOnly: false,
      dataRef: {}
		}
	},
	mounted () {

	 },
	methods: {
		addForm () {
			this.modalTitle = '新增资源'
			this.isAdd = true
			this.formModal = true
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.entityData = {}
			})
		},
		editForm (node, readOnly) {
      let dataValue = node.value
			this.readOnly = readOnly === 'readOnly'
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.entityData = dataValue
				this.dataForm.setFieldsValue(this.entityData)
				// if (this.entityData.enterTime) {
				// 	this.dataForm.setFieldsValue({'enterTime': moment(this.entityData.enterTime, 'YYYYMM')})
				// }
        if(readOnly){
          this.$refs.relationForm.editForm(node, readOnly)
        }
			})
		},
		// 根据计费方式控制可选的服务额度单位
		disabledAmountUnitDic (value) {
			if (value === '01') {
				this.$refs.amountUnitDic.disabledItem(['02', '03'])
				this.dataForm.setFieldsValue({ amountUnit: '01' })
			} else if (value === '02') {
				this.$refs.amountUnitDic.disabledItem(['01', '03'])
				this.dataForm.setFieldsValue({ amountUnit: '02' })
			} else if (value === '03') {
				this.$refs.amountUnitDic.disabledItem(['01', '02'])
				this.dataForm.setFieldsValue({ amountUnit: '03' })
			} else {
				this.$refs.amountUnitDic.disabledItem([])
			}
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				formData.serviceType = '01'
        formData.changeType='add'
				this.$emit('on-save', formData)
			})
		}
	}
}
</script>
<style>

</style>
