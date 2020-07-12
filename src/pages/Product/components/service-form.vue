<template>
  <div>

    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-spin :spinning="spinning" />
      <a-card style="margin: 12px;">
        <a-divider orientation="left">
          <a-icon type="search" />服务基本信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-row>
              <a-col :span="12">
                <a-form-item label="基础服务名称" :labelCol="{span:6}" :wrapperCol="{span:18}">
                  <a-input :disabled="true" v-decorator="['serviceName']"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="服务名称" :labelCol="{span:6}" :wrapperCol="{span:18}">
                  <PserviceSelect allowClear :disabled="readOnly" ref="pservice" v-decorator="[
                      'serviceCode',
                      {initialValue: '',rules: [{ required: true, message: '请选择服务名称!' }]}
                      ]" placeholder="请选择服务名称" @select="value => serviceChange(value)"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="服务属性" :labelCol="{span:6}" :wrapperCol="{span:18}">
                  <a-radio-group  :options="serviceTypeOptions" disabled  v-decorator="['serviceProperty',{initialValue: '01'}]" />
                </a-form-item>
              </a-col>
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
                  <a-input-number allowClear :disabled="readOnly" v-decorator="['availableAmount', {initialValue: '',rules: [{ required: dataForm.getFieldValue('chargingWay') !='00' && dataForm.getFieldValue('chargingWay') !='02', message: '请输入可用额度!' }]}]" />
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
              <a-col :span="8">
                <a-form-item label="服务概率成本">
                  <a-input-number allowClear :disabled="readOnly" v-decorator="['probabilityCost',{rules: [{ required: true, message: '服务概率成本不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="可选/必选">
                  <DicSelect allowClear :disabled="readOnly" dicType="SERVICE_OPTION" v-decorator="[
                      'serviceOption',
                      {initialValue: '',rules: [{ required: true, message: '请选择可选/必选!' }]}
                      ]" placeholder="请选择可选/必选" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="服务限制类型">
                  <DicSelect allowClear :disabled="readOnly" dicType="LIMIT_TYPE" v-decorator="[
                      'limitType',
                      {initialValue: '',rules: [{ required: true, message: '请选择服务限制类型!' }]}
                      ]" placeholder="请选择服务限制类型" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="服务结算类型">
                  <DicSelect allowClear :disabled="readOnly" dicType="BALANCE_TYPE" v-decorator="[
                      'balanceType',
                      {initialValue: '',rules: [{ required: true, message: '请选择服务结算类型!' }]}
                      ]" placeholder="请选择服务结算类型" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="是否有等待期">
                  <DicSelect allowClear :disabled="readOnly" dicType="YES_NO" v-decorator="[
                      'isWaitingPeriod',
                      {initialValue: '',rules: [{ required: true, message: '请选择是否有等待期!' }]}
                      ]" placeholder="请选择是否有等待期" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="等待期(天)">
                  <a-input-number allowClear :disabled="readOnly" v-decorator="['waitingPeriod',{rules: [{ required: dataForm.getFieldValue('isWaitingPeriod') ==='Y', message: '请输入等待期!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="服务方式">
                  <DicSelect allowClear :disabled="readOnly" dicType="SERVICE_WAY" v-decorator="[
                      'serviceWay',
                      {initialValue: '',rules: [{ required: true, message: '请选择服务方式!' }]}
                      ]" placeholder="请选择服务方式" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="服务定价标准">
                  <DicSelect allowClear :disabled="readOnly" dicType="SERVICE_PRICE_OPTION" v-decorator="[
                      'servicePriceOption',
                      {initialValue: '01',rules: [{ required: true, message: '请选择服务定价标准!' }]}
                      ]" placeholder="请选择服务定价标准" />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-show="dataForm.getFieldValue('servicePriceOption') =='01'">
                <a-form-item label="服务定价（服务整体）">
                  <a-input-number allowClear :disabled="readOnly" v-decorator="['price',{rules: [{ required: dataForm.getFieldValue('servicePriceOption') ==='01', message: '服务定价不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-show="dataForm.getFieldValue('servicePriceOption') =='01'">
                <a-form-item label="服务成本">
                  <a-input-number allowClear :disabled="readOnly" v-decorator="['cost',{rules: [{ required: dataForm.getFieldValue('servicePriceOption') ==='01', message: '服务成本不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-show="dataForm.getFieldValue('servicePriceOption') =='02' && !readOnly">
                <a-button type="primary" class="editable-add-btn" style="float:right;margin:0px 10px 0 0;" @click="addPriceItem">添加</a-button>
              </a-col>
            </a-row>
            <a-row v-if="dataForm.getFieldValue('servicePriceOption') =='02'">
              <a-col :span="20" :offset="2">
                <a-table bordered :dataSource="dataSource" :columns="columns" size="middle">
                  <template slot="startDate" slot-scope="text, record, index">
                        <a-select allowClear :disabled="readOnly" :value="text" @select="value=> handleChange(value, record.key, 'startDate')">
                          <a-select-option  v-for="(item, index2) in 25" :key="index2" :value="`${index2}:00`">{{index2}}:00</a-select-option>
                        </a-select>
                  </template>
                  <template slot="endDate" slot-scope="text, record, index">
                        <a-select allowClear :disabled="readOnly" :value="text" @select="value=> handleChange(value, record.key, 'endDate')">
                          <a-select-option v-for="(item, index2) in 25" :key="index2" :value="`${index2}:00`">{{index2}}:00</a-select-option>
                        </a-select>
                  </template>
                  <template v-for="col in ['price', 'cost']" :slot="col" slot-scope="text, record, index">
                    <div :key="col">
                      <a-input-number allowClear :disabled="readOnly" style="margin: -5px 0" :value="text" @change="value => handleChange(value, record.key, col)" />
                    </div>
                  </template>
                  <template slot="operation" slot-scope="text, record, index" v-show="!readOnly">
                    <div class="editable-row-operations">
                      <a-popconfirm title="确认删除?" @confirm="() => deleteItem(record.key)">
                        <a>删除</a>
                      </a-popconfirm>
                    </div>
                  </template>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="24"  v-show="!readOnly">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin:0px 10px 0 0;" @click="submitForm">保存</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
  import OrgSelect2 from "@/components/org-select2"
  import DicSelect from "@/components/dic-select"
  import PserviceSelect from "@/components/pservice-select"
  import "moment/locale/zh-cn"

  const serviceTypeOptions = [
	{ label: "基础服务", value: "01" },
	{ label: "附加服务", value: "02" }
]
export default {
	name: "service-form",
	components: { DicSelect, PserviceSelect, OrgSelect2 },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 12 },
				wrapperCol: { span: 12 }
			},
			spinning: false,
			extraParam: {},
			entityData: {},
			isAdd: true,
			modalWidth: 970,
			modalTitle: "",
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			serviceTypeOptions,
			dataSource: [],
			editingKey: '',
			columns: [
				{
					title: "时间起期",
					dataIndex: "startDate",
					width: "15%",
					scopedSlots: { customRender: "startDate" }
				},
				{
					title: "时间至期",
					dataIndex: "endDate",
					width: "15%",
					scopedSlots: { customRender: "endDate" }
				},
				{
					title: "服务定价(服务整体)",
					dataIndex: "price",
					width: "25%",
					scopedSlots: { customRender: "price" }
				},
				{
					title: "服务成本",
					dataIndex: "cost",
					width: "25%",
					scopedSlots: { customRender: "cost" }
				},
				{
					title: "操作",
					dataIndex: "operation",
					scopedSlots: { customRender: "operation" }
				}
			],
			readOnly: false
		}
	},
	props: {
		serviceType: {
			type: String,
			default () {
				return "01"
			}
		},
		dataRef: {
		  type: Object,
			default () {
		    return {}
		  }
		}
	},
	watch: {
		serviceType (oldVal, newVal) {
			this.dataForm.setFieldsValue({ serviceProperty: this.serviceType === '02' ? '01' : '02' })
		}
	},
	mounted () {
		this.$nextTick(() => {
			this.dataForm.setFieldsValue({ serviceProperty: this.serviceType === '02' ? '01' : '02' })
		})
	},
	methods: {
		addForm () {
			this.isAdd = true
			this.formModal = true
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.entityData = {}
			})
		},
		editForm (dataValue, readOnly, type, serviceName) {
		  // this.serviceType = dataValue.entityData.servicetype
			// this.dataForm.setFieldsValue()

			this.entityData = { serviceProperty: type === 'service' ? '01' : '02' }
			this.readOnly = readOnly === 'readOnly'
			this.dataSource = []
			Object.assign(this.entityData, dataValue)
			if (dataValue.servicePriceOption && dataValue.servicePriceOption === '01') {
				this.entityData.cost = dataValue.cost
				this.entityData.price = dataValue.price
			} else if (dataValue.servicePriceOption && dataValue.servicePriceOption === '02') {
				dataValue.productServicePrices.map(item => {
					this.dataSource.push(
						{
							startDate: item.startDate,
							endDate: item.endDate,
							price: item.price,
							cost: item.cost,
							key: item.productServicePriceId
						})
				})
			}
			this.$nextTick(() => {

				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.entityData)
        if(type === 'service2'){
          this.dataForm.setFieldsValue({ serviceName:  serviceName })
        }
				// if (this.entityData.enterTime) {
				// 	this.dataForm.setFieldsValue({
				// 		enterTime: moment(this.entityData.enterTime, "YYYYMM")
				// 	})
				// }
			})
		},
    serviceChange(value){
      if(this.entityData.serviceProperty === '01'){
        this.dataForm.setFieldsValue({ serviceName: this.$refs.pservice.getName(value) })
      }
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
		// 新增一行表格数据
		addPriceItem () {
			let newItem = {}
			if (this.dataSource.length === 0) {
				newItem.key = 0
			} else {
				newItem.key = this.dataSource[this.dataSource.length - 1].key + 1
			}
			newItem.startDate = '0:00'
			newItem.endDate = '24:00'
			newItem.price = 0
			newItem.cost = 0
			this.dataSource.push(newItem)
		},
		// 删除一行表格数据
		deleteItem (key) {
			const target = this.dataSource.filter(item => key !== item.key)
			if (target) {
				this.dataSource = target
			}
		},
		// 修改表格信息后,更新表格数据源
		handleChange (value, key, col) {
			const target = this.dataSource.filter(item => key === item.key)[0]
			if (target) {
				target[col] = value
			}
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error("表单请填写完整！")
					return
				}
				let formData = Object.assign({}, values)
				formData.serviceName = this.$refs.pservice.getName(formData.serviceCode)
				if (formData.serviceProperty === '01') {
					formData.serviceType = '02'
				} else {
					formData.serviceType = '03'
				}
				formData.changeType = 'add'
				formData.productServiceId = this.dataRef.key
				formData.parentServiceId = this.dataRef.parentServiceId
				formData.productId = this.dataRef.productId
				formData.productServicePrices = []
        let status = true
				if (formData.servicePriceOption === '01') {
					formData.productServicePrices.push({
						servicePriceOption: '01',
						cost: formData.cost,
						price: formData.price,
						productId: this.dataRef.productId,
						productServicePriceId: '',
						productServiceId: this.dataRef.key,
						startDate: '',
						endDate: ''
					})
				} else {

					this.dataSource.map(item => {
					  if(item.cost === null || item.price === null){
              this.$message.error("保存失败，请完善服务定价列表")
              status = false
            }
						formData.productServicePrices.push({
							servicePriceOption: '02',
							cost: item.cost,
							price: item.price,
							productServicePriceId: item.key,
							productId: this.dataRef.productId,
							productServiceId: this.dataRef.key,
							startDate: item.startDate,
							endDate: item.endDate
						})
					})
				}
				if(!status){
				  return;
        }
				if (formData.hasOwnProperty("amountUnit") && formData.amountUnit === '') {
					formData.amountUnit = null
				}
				if (formData.hasOwnProperty("availableAmount") && formData.availableAmount === '') {
					formData.availableAmount = null
				}
				if (formData.hasOwnProperty("waitingPeriod") && formData.waitingPeriod && formData.waitingPeriod === '') {
					formData.waitingPeriod = null
				  delete (formData["waitingPeriod"])
				}
				this.$emit('on-save', formData)
			})
		}
	}
}
</script>
<style>
</style>
