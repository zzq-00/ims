<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle" footer="">
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-spin :spinning="spinning"/>
      <a-divider orientation="left"><a-icon type="home"/> 药店信息</a-divider>
      <a-card style="margin-top: 24px;">
        <a-row :gutter="16">
          <a-col :span="2">
            <a-avatar :size="64" icon="user" />
          </a-col>
          <a-col :span="6">
            <a-form-item label="编码" >
              <a-input v-decorator="['pharmacyCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="名称">
              <a-input v-decorator="['pharmacyName']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="电话">
              <a-input v-decorator="['pharmacyTel']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
              <a-input v-decorator="['orgName']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="15">
            <a-form-item label="详细地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
              <a-input v-decorator="['pharmacyAddress']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin-top: 24px;">
        <a-divider orientation="left">
          <a-icon type="folder-open" /> 药店详细信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="机构名称" >
              <a-input v-decorator="['pharmacyCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构编码">
              <a-input v-decorator="['pharmacyName']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上级药店编码">
              <a-input v-decorator="['upPhaCode']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上级药店名称">
              <a-input v-decorator="['upPhaName']"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="所在省" >
              <AddressSelect dicType="0" v-decorator="['province']"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市" >
              <AddressSelect :dicType="dataForm.getFieldValue('province')" v-decorator="['city',{initialValue:data.city}]">
              </AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在区" >
              <AddressSelect :dicType="dataForm.getFieldValue('city')" v-decorator="['county',{initialValue:data.county}]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话" >
              <a-input v-decorator="['pharmacyTel']"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="药店经度" >
              <a-input  v-decorator="['pharmacyLongitude']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="药店纬度" >
              <a-input  v-decorator="['pharmacyLatitude']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="药店等级" >
              <a-input  v-decorator="['pharmacyLevelName']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系手机" >
              <a-input  v-decorator="['pharmacyMobile']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="机构属性" >
              <a-input  v-decorator="['sorgPropertyDesc']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="详细地址" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea  v-decorator="['pharmacyAddress']" :rows="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="机构简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea  v-decorator="['introduction']" :rows="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="机构特点" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea  v-decorator="['cistic']" :rows="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="机构主营" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea  v-decorator="['isChain']" :rows="1" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </a-modal>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
export default {
	name: 'query-phamacy-form',
	components: { DicSelect,AddressSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			extraParam: {},
			modalWidth: 1070,
			modalTitle: '',
			formModal: false,
			spinning: false,
      dataForm: this.$form.createForm(this),
      data:{}
		}
	},
	mounted () {
	},
	methods: {
		editForm (obj) {
			this.formModal = true
			this.spinning = true
			console.log(obj, 'phamacy edit')
			let data = {
				sorgCode: obj.sorgCode
			}
			supApi.getPhaBasicInfos(data).then(res => {
				this.dataForm.resetFields()
        res.data.orgName = obj.orgName
        this.data = res.data
				this.dataForm.setFieldsValue(res.data)
			}).finally(() => {
				this.spinning = false
			})
		}
	}
}
</script>
<style>

</style>
