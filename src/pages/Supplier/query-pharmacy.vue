<template>
  <div>
    <a-form :form="dataForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-card style="margin: 24px;">
        <a-divider orientation="left"><a-icon type="save" /> 药店信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="3">
            <a-avatar :size="96" icon="user" />
          </a-col>
          <a-col :span="10">
            <a-form-item label="编码">
              <a-input v-decorator="['pharmacyCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="名称" >
              <a-input :disabled="verify" v-decorator="['pharmacyName']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话" >
              <a-input :disabled="verify" v-decorator="['pharmacyTel']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="18">
            <a-form-item label="详细地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 11 }">
              <a-input :disabled="verify" v-decorator="['pharmacyAddress']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
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
        <a-divider orientation="left"><a-icon type="save" /> 药店详细信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="机构名称" >
              <a-input :disabled="verify" v-decorator="['pharmacyName']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构编码">
              <a-input v-decorator="['pharmacyCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上级药店编码" >
              <a-input :disabled="verify" v-decorator="['upPhaCode']" >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上级药店名称" >
              <a-input :disabled="verify" v-decorator="['upPhaName']" >
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="所在省" >
              <AddressSelect dicType="0" placeholder="请选择" v-decorator="['province']"
                 @change="provinceChange"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市" >
              <AddressSelect :dicType="dataForm.getFieldValue('province')" placeholder="请选择" v-decorator="['city']">
              </AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在区" >
              <AddressSelect :dicType="dataForm.getFieldValue('city')" placeholder="请选择" v-decorator="['county']"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话" >
              <a-input :disabled="verify" v-decorator="['pharmacyTel']">
              </a-input>
            </a-form-item>
          </a-col>
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
            <a-form-item label="药店等级" >
              <a-input :disabled="verify" v-decorator="['pharmacyLevel']">
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
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="机构属性" >
              <DicSelect dicType="SORG_PROPERTY" v-decorator="['sorgProperty',{initialValue: ''}]"></DicSelect>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item label="详细地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 11 }">
              <a-input :disabled="verify" v-decorator="['pharmacyAddress']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item label="机构简介" :label-col="{ span: 3 }" :wrapper-col="{ span: 11 }">
              <a-input :disabled="verify" v-decorator="['introduction']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="机构特点" >
              <a-input :disabled="verify" v-decorator="['cistic']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="机构主营" >
              <a-input :disabled="verify" v-decorator="['mainBusi']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="12">
            <a-button type="primary" class="editable-add-btn" @click="go(-1)" style="float:right;margin-right:10px;">返回</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
export default {
	components: { DicSelect, AddressSelect },
	name: 'query-pharmacy',
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
				return true
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
			power: []
		}
	},
	created () {
		// 取出权限串和token，存入data
		console.log(this.$route.query, "============")
		// this.power = JSON.parse(this.$route.query.power)
		// this.token = this.$route.query.token
	},
	mounted () {
		let params = this.$route.params.sorgCode
		this.getPhaBasicInfos(params)
	},
	methods: {
		getPhaBasicInfos (params) {
			console.log('sorgCode===', this.param)
			let data = {
				sorgCode: params
			}
			this.loading2 = true
			supApi.getPhaBasicInfos(data).then(res => {
				let data = res.data
				this.dataForm.setFieldsValue(data)
			}).finally(() => {
				this.loading2 = false
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
