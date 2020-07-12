<template>
  <div>
  <a-form :form="orgForm">
    <a-card style="margin-top: 24px;">
      <a-row :gutter="16">
        <a-col :span="2">
          <a-avatar :size="64" icon="user" />
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构编码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['sorgCode']" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[
                    'sorgName',
                    {rules: [{ required: true, message: '不能为空!' }]}
                    ]">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <DicSelect dicType="SUPPLIER_SUB_TYPE" @change="handleOrgType" v-decorator="[
                    'orgType',
                    { initialValue: '', rules: [{ required: true, message: '请选择!' }]}
                    ]" placeholder="请选择"></DicSelect>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="margin-top: 24px;">
      <a-divider orientation="left">
        <a-icon type="folder-open" /> 机构基础信息</a-divider>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="是否自建" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-switch @change="handleIsSelfSign" v-decorator="['isSelfSign']" checkedChildren="是" unCheckedChildren="否" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="E-mail" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[
                    'sorgEmail',
                    {rules: [{ required: true, message: '请选择!' }]}
                    ]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所在省" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <AddressSelect dicType="0" placeholder="请选择" v-decorator="[
                    'sorgProvince',
                    { initialValue: '', rules: [{ required: true, message: '请选择!' }]}
                    ]"></AddressSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所在市" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <AddressSelect :dicType="this.orgForm.getFieldValue('sorgProvince')" placeholder="请选择" v-decorator="[
                    'sorgCity',
                    { initialValue: '', rules: [{ required: true, message: '请选择!' }]}
                    ]"></AddressSelect>
          </a-form-item>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所在区" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <AddressSelect :dicType="this.orgForm.getFieldValue('sorgCity')" placeholder="请选择" v-decorator="[
                    'sorgCounty',
                    { initialValue: '', rules: [{ required: true, message: '请选择!' }]}
                    ]"></AddressSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="联系人" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[
                    'sorgLinkman',
                    {rules: [{ required: true, message: '请选择!' }]}
                    ]">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="联系人手机" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[
                    'sorgMobile',
                    {rules: [{ required: true, message: '请选择!' }]}
                    ]">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="网址" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['sorgWebUrl']"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构电话" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['sorgWebUrl']"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="邮编" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['sorgZipcode']"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="18">
          <a-form-item label="详细地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
            <a-input v-decorator="[
                    'sorgAdderss',
                    {rules: [{ required: true, message: '请选择!' }]}
                    ]">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="经度" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['sorgLatitude']"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="维度" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['sorgLongitude']"></a-input>
          </a-form-item>
        </a-col>

      </a-row>
      <a-divider orientation="left">
        <a-icon type="folder-open" /> 机构类别属性</a-divider>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="社保类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <DicSelect dicType="SOCIAL_SECUR_TYPE" v-decorator="['socialSecurType', { initialValue: ''}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="医院等级" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <DicSelect dicType="HOSPITAL_LEVEL" v-decorator="['hospitalLevel', { initialValue: ''}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="医院类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <DicSelect dicType="HOSPITAL_TYPE" v-decorator="['hospitalType', { initialValue: ''}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构属性" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <DicSelect dicType="SORG_PROPERTY" v-decorator="['sorgProperty', { initialValue: ''}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="机构性质" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <DicSelect dicType="PROPERTY_CODE" v-decorator="['propertyCode', { initialValue: ''}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所属国家机构" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <DicSelect dicType="SUBJECTION" v-decorator="['subjection', { initialValue: ''}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="是否百佳医院" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-switch v-decorator="['isBest']" checkedChildren="是" unCheckedChildren="否" defaultChecked />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">
        <a-icon type="folder-open" /> 机构其他信息</a-divider>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="扫描门诊量" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['outpatientNum']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="上级机构" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="['bestOrgNum']" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="特色科室" :label-col="{span:2}" :wrapper-col="{span:15}">
            <a-input v-decorator="['cisticDept']" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="乘车路线" :label-col="{span:2}" :wrapper-col="{span:15}">
            <a-input v-decorator="['busLine']" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="机构简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
            <a-textarea v-decorator="['sorgInfo']" placeholder="Basic usage" :rows="3" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12" :offset="12">
          <a-button type="primary" class="editable-add-btn" @click="saveSorg" style="float:right;margin-right:10px;">保存机构</a-button>
        </a-col>
      </a-row>
    </a-card>
    <Department ref="department" :param="deptParam()" v-if="deptParam().sorgCode" />
    <Doctor ref="doctor" :param="doctorParam()" v-if="doctorParam().sorgCode" />

    <a-row :gutter="16" style="margin-top:12px;">
      <a-col :span="12" :offset="12">
        <a-button type="primary" @click="next()" class="editable-add-btn" style="float:right;margin-right:10px;">下一步</a-button>
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
export default {
	name: 'supplier',
	components: { DicSelect, AddressSelect, Department, Doctor },
	props: {
		serviceOrg: {
			type: Object,
			default () {
				return {}
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
			orgForm: this.$form.createForm(this)
		}
	},
	watch: {
		serviceOrg: {
			immediate: true,
			deep: true,
			handler (newVal, oldVal) {
				this.restoreFormData(newVal)
			}
		}
	},
	mounted () { },
	methods: {
		handleIsSelfSign (val) {
			if (val) {
				this.$emit('showTabs', ['showTabProvider'], true)
			} else {
				this.$emit('showTabs', ['showTabProvider'], false)
			}
		},
		handleOrgType (val) {
			// '01' '02' '18'
			if (val === '18') {
				this.$emit('showTabs', ['showTabPhar'], true, '5')
				this.$emit('showTabs', ['showTabSupplier'], false)
			} else {
				this.$emit('showTabs', ['showTabPhar'], false)
			}
		},
		swithTableShow2 () {
			this.showTable2 = !this.showTable2
			this.iconType2 = this.showTable2 ? 'down' : 'up'
		},
		restoreFormData (obj) {
			if (!obj || !obj.sorgCode) {
				this.orgForm.resetFields()
				return
			}
			let data = Object.assign({}, obj)
			data.isBest = data.isBest === 1
			this.$nextTick(() => {
				this.orgForm.setFieldsValue(data)
			})
		},
		saveSorg () {
			this.orgForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				let data = { }
				data.isSelfSign = formData.isSelfSign ? 'Y' : 'N'
				formData.isBest = formData.isBest ? 1 : 0
				formData.validState = '01'

				data.upSorgCode = ''
				data.serviceOrg = formData
				if (formData.isSelfSign) {
					data.supplier = {
						supplierCode: '',
						supplier_name: formData.sorgName,
						supplierType: '01',
						supplierSubType: formData.orgType,
						supplierOrgCode: '86',
						cooperationType: '1',
						isResult: '01',
						province: formData.sorgProvince,
						city: formData.sorgCity,
						country: formData.sorgCounty,
						supplierLinkman: formData.sorgLinkman,
						supplierTel: formData.sorgTel,
						supplierMobile: formData.sorgMobile,
						certifiCode: '',
						licenseCode: '',
						supplierAddress: formData.address,
						bus_Line: '',
						validState: '01'
					}
				}
				delete formData.isSelfSign

				supApi.saveOrg(data).then(res => {
					if (res.data) this.orgForm.setFieldsValue({sorgCode: res.data.serviceOrg.sorgCode})
					this.$message.success('保存成功!')
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
		next () {
			if (this.orgForm.getFieldValue('isSelfSign')) {
				this.$emit('showTabs', [], true, '6')
			} else {
				this.$emit('showTabs', [], true, '7')
			}
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
