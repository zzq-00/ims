<template>
  <div>

    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-spin :spinning="spinning"/>
      <RelationForm ref="relationForm" v-show="readOnly" :dataRef="relaRef"/>
      <RateForm ref="rateForm" v-show="readOnly" :dataRef="dataRef" />
      <a-card style="margin: 12px;">
        <a-divider orientation="left">
        <a-icon type="search" />产品基本信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-row>
              <a-col :span="8">
                <a-form-item label="产品分类">
                  <DicSelect :disabled="readOnly" dicType="PRODUCT_TYPE" v-decorator="[
                    'productType',
                    {initialValue: '',rules: [{ required: true, message: '请选择产品分类!' }]}
                    ]" placeholder="请选择产品分类" @change="getProductCode"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品代码">
                  <a-input :disabled="readOnly" v-decorator="['productCode',{rules: [{ required: true, message: '产品代码不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品名称">
                  <a-input :disabled="readOnly" v-decorator="['productName',{rules: [{ required: true, message: '产品名称不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="14">
                <a-form-item label="产品套餐类型" :labelCol="{span:8}">
                   <a-radio-group @change="OptionsChange"  :disabled="readOnly" :options="productPackTypeOptions" v-decorator="['productPackType',{initialValue:'01',rules: [ { required: true, message: '产品套餐类型为空!' }]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item label="是否为保险产品覆盖" :labelCol="{span:12}">
                   <a-switch :disabled="readOnly" checkedChildren="是" unCheckedChildren="否" defaultChecked :checked="dataForm.getFieldsValue(['isInsurece']).isInsurece" v-decorator="['isInsurece',{initialValue:true}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="绑定保险产品" :labelCol="{span:3}" v-show="dataForm.getFieldValue('isInsurece')">
                  <InsProductSelect :disabled="readOnly" mode='multiple' v-decorator="[
                      'insProductlist',
                      {initialValue: [],rules: [{ required: dataForm.getFieldValue('isInsurece'), message: '请选择保险产品!' }]}
                      ]" placeholder="请选择保险产品" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="产品保障期选项">
                  <DicSelect :disabled="readOnly" dicType="PERIOD_OPTION" v-decorator="[
                    'periodOption',
                    {initialValue: '',rules: [{ required: true, message: '请选择产品保障期!' }]}
                    ]" placeholder="请选择产品保障期" />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-item label="产品保障止期(截止至)">
                  <a-date-picker :disabled="readOnly" v-decorator="['periodEndDate', {rules: [{ required: true, message: '请选择产品保障截止期!' }]}]" />
                </a-form-item>
              </a-col> -->
              <a-col :span="8" v-show="dataForm.getFieldValue('periodOption') =='1'">
                <a-form-item label="产品保障期" >
                  <a-input-number :disabled="readOnly" v-decorator="['period',{rules: [{ required: dataForm.getFieldValue('periodOption') =='1', message: '产品保障期不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-show="dataForm.getFieldValue('periodOption') =='1'">
                <a-form-item label="产品保障期单位" >
                  <DicSelect :disabled="readOnly" dicType="PERIOD_UNIT" v-decorator="[
                    'periodUnit',
                    {initialValue: '',rules: [{ required: dataForm.getFieldValue('periodOption') =='1', message: '请选择产品保障期单位!' }]}
                    ]" placeholder="请选择产品保障期单位" @change="getProductCode"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item  v-show="dataForm.getFieldValue('periodOption') =='4'">
                  <span slot="label" style="">产品保障止期（截止至）</span>
                  <a-date-picker :disabled="readOnly" v-decorator="['periodEndDate']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item label="销售配置机构" :labelCol="{span:6}" :wrapperCol="{span:18}">
                  <OrgSelect :disabled="readOnly" allowClear mode='tags'  :maxTagCount="3" maxTagPlaceholder="更多"  :maxTagTextLength="50" dicType="4" v-decorator="[
                  'region',{initialValue: [],rules: [{ required: true, message: '请选择销售配置机构!' }]}
                  ]" placeholder="请选择销售配置机构" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="销售渠道">
                  <DicSelect :disabled="readOnly" mode='multiple' dicType="SALE_CHANNEL" v-decorator="[
                    'saleChannel',
                    {initialValue: [],rules: [{ required: true, message: '请选择销售渠道!' }]}
                    ]" placeholder="请选择销售渠道" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="是否为健管卡">
                  <a-switch :disabled="readOnly" checkedChildren="是" unCheckedChildren="否" :checked="dataForm.getFieldsValue(['isDoc']).isDoc" defaultChecked v-decorator="['isDoc']" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="销售起始日期">
                  <a-date-picker :disabled="readOnly" v-decorator="['startDate',{rules: [{ required: true, message: '销售起始日期不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="销售停止日期">
                  <a-date-picker :disabled="readOnly" v-decorator="['endDate']" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品销售价格">
                  <a-input-number v-if="isOptions" disabled placeholder="各项服务价格之和"  v-decorator="['price']" />
                  <a-input-number v-else :disabled="readOnly"  v-decorator="['price',{initialValue: '', rules: [{ required: true, message: '产品销售价格不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品成本(%)">
                  <a-input-number :disabled="readOnly" v-decorator="['costPercent',{rules: [{ required: true, message: '产品成本不能为空!' }]}]" @change="calProfitPercent" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品销售费用(%)">
                  <a-input-number :disabled="readOnly" v-decorator="['salesCostPercent',{rules: [{ required: true, message: '产品销售费用不能为空!' }]}]" @change="calProfitPercent" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品管理费用(%)">
                  <a-input-number :disabled="readOnly" v-decorator="['mntCostPercent',{rules: [{ required: true, message: '产品管理费用不能为空!' }]}]" @change="calProfitPercent" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品税费(%)">
                  <a-input-number :disabled="readOnly" v-decorator="['taxPercent',{rules: [{ required: true, message: '产品税费不能为空!' }]}]" @change="calProfitPercent" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品利润(%)">
                  <a-input-number disabled v-decorator="['profitPercent',{rules: [{ required: true, message: '产品利润不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品服务实施类型">
                  <DicSelect allowClear :disabled="readOnly" dicType="IMPL_TYPE" v-decorator="[
                    'implType',
                    {initialValue: ''}
                    ]" placeholder="请选择产品服务实施类型" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="销售收入管理机构">
                  <OrgSelect :disabled="readOnly" dicType="4" v-decorator="[
                  'saleOrgCode',{initialValue: '',rules: [{ required: true, message: '请选择销售收入管理机构!' }]}
                  ]" placeholder="请选择销售收入管理机构" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="是否赠品">
                   <a-switch :disabled="readOnly" checkedChildren="是" unCheckedChildren="否" :checked="dataForm.getFieldsValue(['isGifts']).isGifts" defaultChecked v-decorator="['isGifts']"/>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="产品描述" :labelCol="{ span: 3 }">
                  <a-textarea :disabled="readOnly" v-decorator="['explain', {rules: [{ required: true, message: '产品描述不能为空!' }]}]"  :rows="4"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="24" v-show="!readOnly">
              <a-button type="primary" class="editable-add-btn" style="float:right;margin:0px 10px 0 0;" @click="submitForm">保存</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import OrgSelect from '@/components/org-select'
import DicSelect from '@/components/dic-select'
import InsProductSelect from '@/components/ins-product-select'
import RateForm from '@/pages/Product/components/product-handingrate-form'
import RelationForm from '@/pages/Product/components/service-relation-form'
import api from '@/api/api-product'
import moment from 'moment'
import 'moment/locale/zh-cn'
const productPackTypeOptions = [
	{ label: '固定套餐', value: '01' },
	{ label: '非固定套餐', value: '02' }
]
export default {
	name: 'product-form',
	components: { DicSelect, OrgSelect, InsProductSelect, RateForm, RelationForm },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 12 },
				wrapperCol: { span: 12 }
			},
			productPackTypeOptions,
			spinning: false,
			extraParam: {},
			entityData: {},
			isAdd: true,
			modalWidth: 970,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			productServiceId: undefined,
			readOnly: false,
      relaRef: {},
			isOptions: false // 产品价格--非固定套餐
		}
	},
	mounted () {

	},
  props: {
    dataRef: {
      type: Object,
      default() {
        return {}
      }
    }
  },
	methods: {
		OptionsChange (e) {
			if (e.target.value == '02') {
				this.dataForm.resetFields('price')
				this.isOptions = true
			} else {
				this.dataForm.resetFields('price')
				this.isOptions = false
			}
		},
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
      this.relaRef = this.dataRef
		  let dataValue = node.value
			this.readOnly = readOnly === 'readOnly'
			this.entityData = Object.assign({}, dataValue)
			this.productServiceId = dataValue.productServiceId
			this.entityData.isInsurece = dataValue.isInsurece === 'Y'
			this.entityData.isDoc = dataValue.isDoc === 'Y'
			this.entityData.isGifts = dataValue.isGifts === 'Y'
			// 数据质量问题，需要特殊处理
			if (dataValue.saleOrgCode && dataValue.saleOrgCode.length) {
				this.entityData.saleOrgCode = dataValue.saleOrgCode[0] || ''
			} else {
				this.entityData.saleOrgCode = ''
			}
			this.entityData.insProductlist = []
			if (dataValue.insProductlist && dataValue.insProductlist.length) {
				dataValue.insProductlist.map(item => {
					this.entityData.insProductlist.push(item.insProductCode)
				})
			}
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.entityData)
				if (this.entityData.startDate) {
					this.dataForm.setFieldsValue({'startDate': moment(this.entityData.startDate, 'YYYY-MM-DD')})
				}
				if (this.entityData.endDate) {
					this.dataForm.setFieldsValue({'endDate': moment(this.entityData.endDate, 'YYYY-MM-DD')})
				}
				if (this.entityData.periodEndDate) {
					this.dataForm.setFieldsValue({'periodEndDate': moment(this.entityData.periodEndDate, 'YYYY-MM-DD')})
				}
			})
      this.$refs.rateForm.editForm(node, readOnly)
      this.$refs.relationForm.editForm(node, readOnly)
		},
		getProductCode (value, option) {
			let productType = value
			api.makeCode({productType: productType}).then(res => {
				this.dataForm.setFieldsValue({productCode: res.data})
			}).finally(() => {
				this.submitLoading = false
			})
		},
		calProfitPercent () {
			this.$nextTick(() => {
				let value = this.dataForm.getFieldsValue()
				if (value.costPercent || value.salesCostPercent || value.mntCostPercent || value.taxPercent) {
					let costPercent = value.costPercent || 0
					let salesCostPercentcostPercent = value.salesCostPercent || 0
					let mntCostPercent = value.mntCostPercent || 0
					let taxPercent = value.taxPercent || 0
					let profitPercent = 100 - costPercent - salesCostPercentcostPercent - mntCostPercent - taxPercent
					this.dataForm.setFieldsValue({profitPercent: profitPercent})
				}
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				// if (!values.endDate && moment(values.endDate).isBefore(values.startDate)) {
				// 	this.$message.error("销售停止日期不能早于销售起始日期")
				// 	return
				// }
				var days = Date.parse(moment(values.endDate).format('YYYY-MM-DD')) - Date.parse(moment(values.startDate).format('YYYY-MM-DD'))
				if (days < 0) {
					return this.$message.warn('销售结束日期必须大于销售开始日期')
				}

				let formData = Object.assign({}, values)
				formData.insProductlist = []
				if (values.insProductlist && values.insProductlist.length) {
					values.insProductlist.map((item) => {
						formData.insProductlist.push({insProductCode: item})
					})
				}
				formData.isInsurece = values.isInsurece ? 'Y' : 'N'
				formData.isDoc = values.isDoc ? 'Y' : 'N'
				formData.isGifts = values.isGifts ? 'Y' : 'N'
				formData.saleOrgCode = []
				formData.saleOrgCode.push(values.saleOrgCode)

				let productService = {}
				productService.serviceCode = values.productCode
				productService.serviceName = values.productName
				productService.productServiceId = this.productServiceId
				// productService.parentServiceId = null
				// productService.serviceType = null
				formData.psList = []
				formData.psList.push(productService)
				if (formData.price == '') {
					formData.price = 0
				}
				this.$emit('on-save', formData)
			})
		}
	}
}
</script>
<style>

</style>
