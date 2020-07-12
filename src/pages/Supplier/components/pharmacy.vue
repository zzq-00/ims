<template>
  <div>
    <a-form :form="dataForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-card style="margin: 24px;">
        <a-divider orientation="left">
          <a-icon type="save" /> 药店信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="3">
            <a-avatar :size="96" icon="user" />
          </a-col>
          <a-col :span="10">
            <a-form-item label="药店编码">
              <a-input v-decorator="['pharmacyCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="0">
            <a-form-item label="供应商编码" >
              <a-input v-decorator="['supplierCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="药店名称" >
              <a-input :disabled="verify" v-decorator="['pharmacyName',{rules: [{ required: true, message: '药店名称不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="上级药店名称" >
              <a-input :disabled="verify" v-decorator="['upPhaName']" allowClear @click="ModalPharSearchModal = true">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="0">
            <a-form-item label="上级药店编码" >
              <a-input :disabled="verify" v-decorator="['upPhaCode']" allowClear>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="是否有效" v-show="showValidState">
              <DicSelect :disabled="verify" dicType="EFFECT_TYPE" v-decorator="['validState',{ initialValue: '01', rules: [{ required: true, message: '请选择是否有效!' }]}]"></DicSelect>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="10">
            <a-form-item label="管理机构" >
              <a-input v-decorator="[
                      'gender',
                      {rules: [{ required: true, message: '请选择!' }]}
                      ]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="是否有效" >
                  <DicSelect dicType="EFFECT_TYPE" v-decorator="[
                      'pharmacy.ValidState',
                      {rules: [{ required: true, message: '请选择!' }]}
                      ]" placeholder="请选择"></DicSelect>
                </a-form-item>
          </a-col> -->
        </a-row>
        <a-divider orientation="left">
          <a-icon type="save" /> 药店详细信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="是否自建" >
              <a-switch :disabled="verify" @change="handleIsSelfSign" v-decorator="['isSelfSign']" :checked="dataForm.getFieldValue('isSelfSign')" checkedChildren="是" unCheckedChildren="否" defaultChecked />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="所在省" >
              <AddressSelect :disabled="verify" allowClear dicType="0" placeholder="请选择" v-decorator="[
                      'province',
                      {initialValue: '',rules: [{ required: true, message: '所在省不能为空!' }]}
                      ]" @change="provinceChange"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市" >
              <AddressSelect :disabled="verify" allowClear :dicType="dataForm.getFieldValue('province')" placeholder="请选择" v-decorator="[
                      'city',
                      {initialValue: '',rules: [{ required: true, message: '所在市不能为空!' }]}
                      ]">
              </AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在区" >
              <AddressSelect :disabled="verify" allowClear :dicType="dataForm.getFieldValue('city')" placeholder="请选择" v-decorator="['county',{initialValue: ''}]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构属性" >
              <DicSelect :disabled="verify" allowClear dicType="SORG_PROPERTY" v-decorator="['sorgProperty',{initialValue: ''}]"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构主营" >
              <a-input :disabled="verify" v-decorator="['mainBusi']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系手机" >
              <a-input :disabled="verify" v-decorator="['pharmacyMobile',
                      {initialValue: '',rules: [{ pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确!' }]}]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="E-MAIL" >
              <a-input :disabled="verify" v-decorator="['email',{initialValue: '',rules: [{ type: 'email', message: 'email格式不正确!' }]}]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮编" >
              <a-input :disabled="verify" v-decorator="['postCode']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item label="详细地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 11 }">
              <a-input :disabled="verify" @blur="blurSorgAdderss" v-decorator="['pharmacyAddress',{rules: [{ required: true, message: '详细地址不能为空!' }]}]">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="药店经度" >
              <a-input-number :precision="6" v-decorator="['pharmacyLongitude']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="药店纬度" >
              <a-input-number :precision="6" v-decorator="['pharmacyLatitude']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="药店网址" >
              <a-input :disabled="verify" v-decorator="['url',{rules: [{ type: 'url', message: '网址格式不正确!' }]}]">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="药店等级" >
              <a-input :disabled="verify" v-decorator="['pharmacyLevel']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构特点" >
              <a-input :disabled="verify" v-decorator="['cistic']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话" >
              <a-input :disabled="verify" v-decorator="['pharmacyTel']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="机构简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea :disabled="verify" v-decorator="['introduction']" placeholder="机构简介" :rows="3" />
            </a-form-item>
          </a-col>
<!--          <a-col :span="18">-->
<!--            <a-form-item label="机构简介" :label-col="{ span: 3 }" :wrapper-col="{ span: 11 }">-->
<!--              <a-input :disabled="verify" v-decorator="['introduction']">-->
<!--              </a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="12">
            <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="savePhar()" style="float:right;margin-right:10px;">保存药店</a-button>
            <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="next()" style="float:right;margin-right:10px;">下一步</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <a-modal v-model="ModalPharSearchModal" :footer="null" style="top: 30px;" :width="1070" title="上级机构查询">
      <ModalPharSearch @confirm="confirm" />
    </a-modal>
  </div>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
import ModalPharSearch from './modal-phar-search'
export default {
	components: { DicSelect, AddressSelect, ModalPharSearch },
	props: {
		pharmacyData: {
			type: Object,
			default () {
				return {}
			}
		},
		verify: {
			type: Boolean,
			default () {
				return false
			}
		}
	},
	data () {
		return {
			// 查询条件
			formItemLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			formLayout: "horizontal",
			dataForm: this.$form.createForm(this),
			loading: false,
			editData: null,
			addTitle: "新增用户",
			visible: false,
			ModalPharSearchModal: false,
			count: 2,
			power: [],
			options: [
				{ label: "自建签约", value: "自建签约" },
				{ label: "第三方签约", value: "第三方签约" },
				{ label: "内部自建", value: "内部自建" }
			],
			showValidState: false
		}
	},
	watch: {
		pharmacyData: {
			immediate: true,
			deep: true,
			handler (newVal, oldVal) {
				this.restoreFormData(newVal)
			}
		}
	},
	created () {
		// 取出权限串和token，存入data
		console.log(this.$route.query, "============")
		// this.power = JSON.parse(this.$route.query.power)
		// this.token = this.$route.query.token
	},
	mounted () { },
	methods: {
		provinceChange (value, option) {
			console.log(value, option, 'provinceChange')
		},
		restoreFormData (obj) {
			if (!obj || !obj.pharmacyCode) {
				this.dataForm.resetFields()
				this.showValidState = false
				return
			}
			this.showValidState = true
			let data = Object.assign({}, obj)
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(data)
			})
		},
		savePhar () {
			this.dataForm.validateFields((error, values) => {
				if (!error) {
					let formData = Object.assign({}, values)
					let data = {}
					data.isSelfSign = formData.isSelfSign ? 'Y' : 'N'
					data.pharmacy = formData
					data.pharmacy.validState = '01'
					data.pharmacy.isSelfPhar = data.isSelfSign
					if (formData.isSelfSign) {
						data.supplier = {
							supplierCode: this.dataForm.getFieldValue('supplierCode'),
							supplierName: formData.pharmacyName, // 药店名称
							supplierType: '01',
							supplierSubType: '18', // 药店
							supplierOrgCode: '86',
							cooperationType: '1',
							isResult: '01',
							province: formData.province,
							city: formData.city,
							country: formData.country,
							supplierLinkman: '',
							supplierTel: formData.pharmacyTel, // 联系电话
							supplierMobile: formData.pharmacyMobile, // 联系手机
							certifiCode: '',
							licenseCode: '',
							supplierAddress: formData.pharmacyAddress, // 详细地址
							busLine: '',
							validState: '01'
						}
					}
					delete formData.isSelfSign
					supApi.savePhar(data).then((res) => {
						this.$message.success("保存成功!")
						this.dataForm.setFieldsValue({pharmacyCode: res.data.pharmacy.pharmacyCode, supplierCode: res.data.supplier ? res.data.supplier.supplierCode : ''})
						let obj = {
							type: '18',
							sorgCode: res.data.pharmacy.pharmacyCode,
							sorgName: res.data.pharmacy.pharmacyName,
							supplierCode: res.data.supplier ? res.data.supplier.supplierCode : undefined,
							upSorgCode: res.data.pharmacy.upPhaCode,
							isSelfSign: data.isSelfSign
						}
						this.$emit('getOrgCode', obj)
					}).catch((err) => {
						console.log(err)
					})
				}
			})
		},
		handleIsSelfSign (val) {
			if (val) {
				this.$emit('showTabs', ['showTabSupplier'], true)
			} else {
				this.$emit('showTabs', ['showTabSupplier'], false)
			}
		},
		next () {
		  if (this.dataForm.getFieldValue('pharmacyCode') === undefined || this.dataForm.getFieldValue('pharmacyCode') === '') {
		    this.$message.error("请先保存药店信息！")
				return
			}
			if (this.dataForm.getFieldValue('isSelfSign')) {
				this.$emit('showTabs', [], true, '6')
			} else {
				this.$emit('showTabs', [], true, '7')
				this.$emit('showTabs', ['showTabOrgRela'], true)
			}
		},
		confirm (obj) {
			this.ModalPharSearchModal = false
			this.dataForm.setFieldsValue({'upPhaName': obj.sorgName, 'upPhaCode': obj.sorgCode})
		},
		// 详细地址离焦事件
		blurSorgAdderss () {
			this.getAddress()
		},
		// 获取经纬度
		getAddress () {
			if (this.dataForm.getFieldValue('pharmacyAddress') === undefined || this.dataForm.getFieldValue('pharmacyAddress') === '') {
				return
			}
			let data = {
				address: this.dataForm.getFieldValue('pharmacyAddress')
			}
			supApi.getAddress(data).then(res => {
				// 经纬度赋值
				this.dataForm.setFieldsValue({pharmacyLatitude: res.data.location.lat, pharmacyLongitude: res.data.location.lng})
			})
		}
	}
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
