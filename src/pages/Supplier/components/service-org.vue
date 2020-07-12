<template>
  <div>
    <a-form :form="orgForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-card style="margin-top: 24px;">
        <a-row :gutter="16">
          <a-col :span="2">
            <a-avatar :size="64" icon="user" />
          </a-col>
          <a-col :span="5">
            <a-form-item label="机构编码" >
              <a-input v-decorator="['sorgCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="0">
            <a-form-item label="供应商编码" >
              <a-input v-decorator="['supplierCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构名称">
              <a-input @blur="blurSorgName" :disabled="verify" v-decorator="['sorgName',{rules: [{ required: true, message: '机构名称不能为空!' }]}]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构类型">
              <DicSelect :disabled="verify" dicType="SUPPLIER_SUB_TYPE" :removeList="removeListOrgType" :allowClear="true" @change="handleOrgType" v-decorator="['orgType',{ initialValue: '', rules: [{ required: true, message: '请选择机构类型!' }]}]" placeholder="请选择机构类型"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="是否有效" v-show="serviceOrgData.showValidState">
              <DicSelect :disabled="verify" dicType="EFFECT_TYPE" v-decorator="['validState', {initialValue: '',rules: [{ required: serviceOrgData.showValidState, message: '请选择是否有效!' }]}]"></DicSelect>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin-top: 24px;">
        <a-divider orientation="left">
          <a-icon type="folder-open" /> 机构基础信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="是否自建"  >
              <a-switch :disabled="verify" @change="handleIsSelfSign" v-decorator="['isSelfSign']" :checked="orgForm.getFieldValue('isSelfSign')" checkedChildren="是" unCheckedChildren="否" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="E-mail">
              <a-input :disabled="verify" v-decorator="['sorgEmail',{rules: [{ required: true,message: 'email不能为空!' },{ type:'email', message: 'email格式不规范!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在省">
              <AddressSelect :disabled="verify" dicType="0" placeholder="请选择" v-decorator="['sorgProvince', { initialValue: '', rules: [{ required: true, message: '请选择!' }]} ]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市">
              <AddressSelect :disabled="verify" :dicType="this.orgForm.getFieldValue('sorgProvince')" placeholder="请选择" v-decorator="['sorgCity',{ initialValue: '', rules: [{ required: true, message: '请选择!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在区">
              <AddressSelect :disabled="verify" :dicType="this.orgForm.getFieldValue('sorgCity')" placeholder="请选择" v-decorator="['sorgCounty',{ initialValue: ''}]"></AddressSelect>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="联系人">
              <a-input :disabled="verify" v-decorator="['sorgLinkman',{rules: [{ required: true, message: '联系人不能为空!' }]}]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系人手机">
              <a-input :disabled="verify" v-decorator="['sorgMobile',{rules: [{ required: true, message: '联系人手机不能为空!' }, { pattern: /^1[3456789]\d{9}$/, message: '联系人手机格式不正确!' }]}]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="网址">
              <a-input :disabled="verify" v-decorator="['sorgWebUrl']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构电话">
              <a-input :disabled="verify" v-decorator="['sorgTel']"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="邮编">
              <a-input :disabled="verify" v-decorator="['sorgZipcode']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="18">
            <a-form-item label="详细地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
              <a-input :disabled="verify" @blur="blurSorgAdderss" v-decorator="['sorgAdderss',{rules: [{ required: true, message: '详细地址不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="经度">
              <a-input-number :disabled="verify" :precision="6" v-decorator="['sorgLongitude']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="纬度">
              <a-input-number :disabled="verify" :precision="6" v-decorator="['sorgLatitude']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider orientation="left" v-show="showHospitalProp">
          <a-icon type="folder-open" /> 机构类别属性 </a-divider>
        <a-row :gutter="16" v-show="showHospitalProp">
          <a-col :span="6">
            <a-form-item label="社保类型">
              <DicSelect :disabled="verify" dicType="SOCIAL_SECUR_TYPE" v-decorator="['socialSecurType', { initialValue: ''}]"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="医院等级">
              <DicSelect :disabled="verify" dicType="HOSPITAL_LEVEL" v-decorator="['hospitalLevel',{rules: [{ required: this.orgForm.getFieldValue('orgType') == '02', message: '医院等级不能为空!' }]}]"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="医院类型">
              <DicSelect :disabled="verify" dicType="HOSPITAL_TYPE" v-decorator="['hospitalType',{rules: [{ required: this.orgForm.getFieldValue('orgType') == '02', message: '医院类型不能为空!' }]}]"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构属性">
              <DicSelect :disabled="verify" dicType="SORG_PROPERTY" v-decorator="['sorgProperty', { initialValue: ''}]"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构性质">
              <DicSelect :disabled="verify" dicType="PROPERTY_CODE" v-decorator="['propertyCode', { initialValue: ''}]"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属国家机构">
              <DicSelect :disabled="verify" dicType="SUBJECTION" v-decorator="['subjection', { initialValue: ''}]"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
<!--            <a-form-item label="是否百佳医院">-->
<!--              <a-switch :disabled="verify" v-decorator="['isBest',{rules: [{ required: true, message: '是否百佳医院不能为空!' }]}]" checkedChildren="是" unCheckedChildren="否" defaultChecked  :checked="orgForm.getFieldValue('isBest')" />-->
<!--            </a-form-item>-->
            <a-form-item label="是否百佳医院">
              <a-select :disabled="verify" allowClear @change="changeIsBest" v-decorator="['isBest', {initialValue:'0',rules: [{ required: this.orgForm.getFieldValue('orgType') == '02', message: '是否百佳医院不能为空!'}]}]">
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-show="showBestOrgNum">
            <a-form-item label="百佳医院排名" >
              <a-input-number :disabled="verify" :precision="0" :min='1' :max='100' v-decorator="['bestorgNum', {rules: [{required: this.orgForm.getFieldValue('isBest') == '1', message:'百佳医院排名不能为空！'}]}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider orientation="left">
          <a-icon type="folder-open" /> 机构其他信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="日均门诊量">
              <a-input-number :disabled="verify" :precision="0" :min='1' v-decorator="['outpatientNum']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上级机构">
              <a-input :disabled="verify" @click="openUpperForm" v-decorator="['upSorgCode']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="特色科室" :label-col="{span:2}" :wrapper-col="{span:15}">
              <a-input :disabled="verify" v-decorator="['cisticDept']" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="乘车路线" :label-col="{span:2}" :wrapper-col="{span:15}">
              <a-input :disabled="verify" v-decorator="['busLine']" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="机构简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea :disabled="verify" v-decorator="['sorgInfo']" placeholder="机构简介" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="12">
            <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="saveSorg" style="float:right;margin-right:10px;">保存机构</a-button>
          </a-col>
        </a-row>
      </a-card>
      <Department ref="department" :param="deptParam()" v-if="deptParam().sorgCode" :verify="verify" @on-update="departmentCount"/>
      <Doctor ref="doctor" :param="doctorParam()" v-if="doctorParam().sorgCode" :verify="verify" @on-update="doctorCount"/>
      <a-modal v-model="showUpperForm" :footer="null" style="top: 30px;" :width="1070" title="上级机构查询">
        <QueryUpperForm ref='queryUpperForm' @on-update="setUpSorgCode"/>
      </a-modal>
      <QuerySimilarForm ref="querySimilarForm" @on-update="isQuerySimilarForm" @showOrgInfo="showOrgInfo"/>
      <a-row :gutter="16" style="margin-top:12px;">
        <a-col :span="12" :offset="12">
          <a-button v-if="!verify" type="primary" @click="next" class="editable-add-btn" style="float:right;margin-right:10px;">下一步</a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
import Department from '@/pages/Supplier/department'
import Doctor from '@/pages/Supplier/doctor'
import QueryUpperForm from "./query-upper-form"
import QuerySimilarForm from "./query-similar-form"
import {Promise} from "q"
export default {
	name: 'service-org',
	components: {DicSelect, AddressSelect, Department, Doctor, QueryUpperForm, QuerySimilarForm},
	props: {
		serviceOrgData: {
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
			removeListOrgType: ['19'],
			// 查询条件
			formItemLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			orgForm: this.$form.createForm(this),
			departmentNum: '',
			doctorNum: '',
			showHospitalProp: false,
			showBestOrgNum: false,
			showUpperForm: false,
			querySimilarForm: true
		}
	},
	watch: {
		serviceOrgData: {
			immediate: true,
			deep: true,
			handler (newVal, oldVal) {
				this.restoreFormData(newVal)
			}
		}
	},
	mounted () {},
	methods: {
	  // 上级机构查询
		openUpperForm () {
			this.showUpperForm = true
			this.$nextTick(() => {
				this.$refs.queryUpperForm.initUpperForm({"manageOrgType": this.orgForm.getFieldValue('orgType')})
			})
		},
		// 为上级机构赋值
		setUpSorgCode (obj) {
			this.orgForm.setFieldsValue({upSorgCode: obj})
			this.showUpperForm = false
		},
		// 详细地址离焦事件
		blurSorgAdderss () {
			// 详细地址为空不需校验
			if (this.orgForm.getFieldValue('sorgAdderss') === undefined || this.orgForm.getFieldValue('sorgAdderss') === '') {
				return
			}
			this.getAddress()
		},
		// 机构名称离焦事件
		blurSorgName () {
		  // 详细地址为空不需校验
			if (this.orgForm.getFieldValue('sorgAdderss') === undefined || this.orgForm.getFieldValue('sorgAdderss') === '') {
			  return
			}
			this.openSimilarForm()
		},
		// 获取经纬度
		getAddress () {
			let data = {
				address: this.orgForm.getFieldValue('sorgAdderss')
			}
			supApi.getAddress(data).then(res => {
				// 经纬度赋值
				this.orgForm.setFieldsValue({sorgLatitude: res.data.location.lat, sorgLongitude: res.data.location.lng})
				// 校验相似机构
				this.openSimilarForm()
			})
		},
		// 校验相似机构
		openSimilarForm () {
			// 机构名称为空不需校验
			if (this.orgForm.getFieldValue('sorgName') === undefined || this.orgForm.getFieldValue('sorgName') === '') {
				return
			}
			// 跳过提醒不需校验
			if (!this.querySimilarForm) {
				return
			}
			let queryCondition = {
				sorgName: this.orgForm.getFieldValue('sorgName') ? this.orgForm.getFieldValue('sorgName') : '',
				sorgAddress: this.orgForm.getFieldValue('sorgAdderss'),
				sorgLongitude: this.orgForm.getFieldValue('sorgLongitude'),
				sorgLatitude: this.orgForm.getFieldValue('sorgLatitude'),
				sorgCode: this.orgForm.getFieldValue('sorgCode') ? this.orgForm.getFieldValue('sorgCode') : ''
			}
			let data = {
				page: 1,
				limit: 10,
				beHospital: queryCondition
			}
			supApi.querySimilarSorg(data).then(res => {
			  if (res.status === 0) {
			    if (res.data.totalCount === 0) {
			      this.$message.success("此机构没有重复数据!")
					} else {
						let similarData = {
							res: res,
							sorgCode: this.orgForm.getFieldValue('sorgCode'),
							sorgName: this.orgForm.getFieldValue('sorgName')
						}
						this.$refs.querySimilarForm.initSimilarForm(similarData)
					}
				}
			})
		},
		isQuerySimilarForm (obj) {
			// 跳过提醒后，不再校验相似机构
			this.querySimilarForm = obj
		},
		handleIsSelfSign (val) {
		  console.log("是否自建：", val)
			if (val) {
				this.$emit('showTabs', ['showTabSupplier'], true)
			} else {
				this.$emit('showTabs', ['showTabSupplier'], false)
			}
		},
		handleOrgType (val) {
			// '01' '02' '18'
			if (val === '18') {
				this.$emit('showTabs', ['showTabPhar'], true, '5')
				this.$emit('showTabs', ['showTabServiceOrg', 'showTabSupplier'], false)
			} else {
				this.$emit('showTabs', ['showTabPhar'], false)
			}
			if (val === '02') {
			  this.showHospitalProp = true
			} else {
			  this.showHospitalProp = false
			}
			if (val === '03') {
				this.orgForm.setFieldsValue({isSelfSign: true})
			} else {
				this.orgForm.setFieldsValue({isSelfSign: false})
			}
			// 机构类型变换后，控制供应商tab页
			this.handleIsSelfSign(this.orgForm.getFieldValue('isSelfSign'))
		},
		swithTableShow2 () {
			this.showTable2 = !this.showTable2
			this.iconType2 = this.showTable2 ? 'down' : 'up'
		},
		restoreFormData (obj) {
			// 初始化页面时设置是否校验相似机构为true
			this.querySimilarForm = true
		  if (obj.orgType === '02') {
		    // 机构类型为医疗机构，显示机构类别属性
		    this.showHospitalProp = true
				if (obj.isBest === '1') {
					// 为百佳医院，显示百佳排名
					this.showBestOrgNum = true
				}
			} else {
				this.showHospitalProp = false
			}
			if (!obj || !obj.sorgCode) {
				this.orgForm.resetFields()
				return
			}
			let data = Object.assign({}, obj)
			// data.isBest = data.isBest === 1
			this.$nextTick(() => {
				this.orgForm.setFieldsValue(data)
			})
		},
		// 控制百佳医院排名是否显示
		changeIsBest () {
			this.$nextTick(() => {
				if (this.orgForm.getFieldValue('isBest') === '1') {
					// 为百佳医院，显示百佳排名
					this.showBestOrgNum = true
				} else {
					this.showBestOrgNum = false
				}
			})
		},
		// 保存机构：如果没有保存过则新增，否则需要修改，成功后需要返回数据到Tab主页面
		saveSorg () {
			this.orgForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				let data = { }
				data.isSelfSign = formData.isSelfSign ? 'Y' : 'N'
				// formData.isBest = formData.isBest ? 1 : 0
				// 是否有效
				if (!this.serviceOrgData.showValidState) {
				  // 新建机构时默认为01-有效
					formData.validState = '01'
				}
				data.upSorgCode = formData.upSorgCode
				data.serviceOrg = formData
				if (formData.isSelfSign) {
				  console.log('formData:', formData)
					data.supplier = {
						supplierCode: this.orgForm.getFieldValue('supplierCode'),
						supplierName: formData.sorgName,
						supplierType: '01',
						supplierSubType: formData.orgType,
						supplierOrgCode: '86',
						cooperationType: '1',
						isResult: formData.validState,
						province: formData.sorgProvince,
						city: formData.sorgCity,
						county: formData.sorgCounty,
						supplierLinkman: formData.sorgLinkman,
						supplierTel: formData.sorgTel,
						supplierMobile: formData.sorgMobile,
						certifiCode: '',
						licenseCode: '',
						supplierAddress: formData.sorgAdderss,
						busLine: formData.busLine,
						validState: formData.validState
					}
				}
				delete formData.isSelfSign
				delete formData.upSorgCode
				// 校验相似机构
				// this.openSimilarForm()
				supApi.saveOrg(data).then(res => {
					if (res.data) this.orgForm.setFieldsValue({sorgCode: res.data.serviceOrg.sorgCode, supplierCode: res.data.supplier ? res.data.supplier.supplierCode : ''})
					let obj = {
						type: res.data.serviceOrg.orgType,
						sorgCode: res.data.serviceOrg.sorgCode,
						sorgName: res.data.serviceOrg.sorgName,
        		supplierCode: res.data.supplier ? res.data.supplier.supplierCode : undefined,
						upSorgCode: res.data.serviceOrg.upSorgCode,
						isSelfSign: data.isSelfSign
					}
					// 更新供应商信息
					this.updateSupplierInfo(res.data)
					this.$emit('getOrgCode', obj)
					// this.$message.success('保存成功!')
				})
			})
		},
		deptParam () {
			let sorgCode = this.orgForm.getFieldValue('sorgCode')
			let sorgName = this.orgForm.getFieldValue('sorgName')
			return {
				sorgCode: sorgCode,
				sorgName: sorgName
			}
		},
		doctorParam () {
			let sorgCode = this.orgForm.getFieldValue('sorgCode')
			let sorgName = this.orgForm.getFieldValue('sorgName')
			return {
				sorgCode: sorgCode,
				sorgName: sorgName
			}
		},
		departmentCount (obj) {
			this.departmentNum = obj
		},
		doctorCount (obj) {
			this.doctorNum = obj
		},
		// 更新供应商信息
		updateSupplierInfo (obj) {
			let supplierData = {
				supplierCode: obj.supplier ? obj.supplier.supplierCode : '',
				supplier_name: obj.serviceOrg.sorgName,
				supplierType: '01',
				supplierSubType: obj.serviceOrg.orgType,
				supplierOrgCode: '86',
				cooperationType: '1',
				isResult: obj.serviceOrg.validState,
				province: obj.serviceOrg.sorgProvince,
				city: obj.serviceOrg.sorgCity,
				county: obj.serviceOrg.sorgCounty,
				supplierLinkman: obj.serviceOrg.sorgLinkman,
				supplierTel: obj.serviceOrg.sorgTel,
				supplierMobile: obj.serviceOrg.sorgMobile,
				certifiCode: '',
				licenseCode: '',
				supplierAddress: obj.serviceOrg.sorgAdderss,
				bus_Line: obj.serviceOrg.busLine,
				validState: obj.serviceOrg.validState
			}
			let updateSupplier = {
				sorgCode: this.orgForm.getFieldValue('sorgCode'),
				supplierData: supplierData
			}
			supApi.updateSupplierInfo(updateSupplier).then(res => {
				this.$message.success('保存成功!')
			})
		},
		next () {
			if (this.orgForm.getFieldValue('sorgCode') === undefined || this.orgForm.getFieldValue('sorgCode') === '') {
				this.$message.error('请先保存机构信息！')
				return
			}
			if (this.departmentNum === 0 || this.doctorNum === 0) {
				let self = this
				this.$confirm({
					title: '确认提示',
					content: '科室信息或人员信息未添加是否下一步？',
					okType: 'danger',
					onOk () {
						return new Promise((resolve, reject) => {
							if (self.orgForm.getFieldValue('isSelfSign')) {
								self.$emit('showTabs', [], true, '6')
								self.$destroyAll()
							} else {
								self.$emit('showTabs', [], true, '7')
								self.$emit('showTabs', ['showTabOrgRela'], true)
								self.$destroyAll()
							}
						})
					}
				})
			} else {
				if (this.orgForm.getFieldValue('isSelfSign')) {
					this.$emit('showTabs', [], true, '6')
				} else {
					this.$emit('showTabs', [], true, '7')
					this.$emit('showTabs', ['showTabOrgRela'], true)
				}
			}
		},
		showOrgInfo (obj) {
			this.$emit('showOrgInfo', obj)
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
