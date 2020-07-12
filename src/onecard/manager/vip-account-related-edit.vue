<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="1600" title="附属人信息">
      <a-form
        :form="dataForm"
        :labelCol="dataFormLayout.labelCol"
        :wrapperCol="dataFormLayout.wrapperCol"
      >
        <a-row>
          <a-col :span="8">
            <a-form-item label="与会员本人关系">
              <DicSelect
                :disabled="(editable == 'view')"
                dicType="VIP_RELATIONSHIP"
                v-decorator="[ 'relatedcode', {initialValue: ''}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="姓名">
              <a-input
                :disabled="(editable == 'view')"
                v-decorator="['relatedname',{rules: [{ required: true, message: '姓名不能为空!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件类型">
              <DicSelect
                :disabled="(editable == 'view')"
                dicType="VIP_IDCARDTYPE"
                v-decorator="[ 'relatedidcardtype',{rules: [{ required: true, message: '请选择证件类型!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件号码">
              <a-input
                :disabled="(editable == 'view')"
                v-decorator="['relatedidcard',{rules: [{ required: true, message: '证件号码不能为空!' },{ validator: checkPeopleCard }]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="出生日期">
              <a-week-picker
                :disabled="(editable == 'view')"
                v-decorator="['relatedbirthday', {rules: [{ required: true, message: '出生日期不能为空!' }]}]"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别">
              <DicSelect
                :disabled="(editable == 'view')"
                dicType="VIP_SEX"
                v-decorator="[ 'relatedsex',{rules: [{ required: true, message: '请选择性别!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="移动电话">
              <a-input
                :disabled="(editable == 'view')"
                v-decorator="['relatedmobile',{rules: [{ required: true, message: '移动电话不能为空!' }]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item class="form-item-label-long" label="证件长期有效">
              <DicSelect
                :disabled="(editable == 'view')"
                dicType="VIP_IDCARDISLONG"
                v-decorator="[ 'idcardislong']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item class="form-item-label-long" label="证件有效期始">
              <a-week-picker :disabled="(editable == 'view')" format="YYYY-MM-DD" v-decorator="['idcardstart']"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item class="form-item-label-long" label="证件有效期止">
              <a-week-picker :disabled="(editable == 'view')" format="YYYY-MM-DD" v-decorator="['idcardend']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-input type="hidden" v-decorator="['accountid']" />
          <a-input type="hidden" v-decorator="['vipid']" />
          <a-input type="hidden" v-decorator="['id']" />
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button type @click="formModal=false">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import api from "@/api/api-vip"
  import DicSelect from "@/components/dic-select"

  export default {
    name: "vip-account-related-edit",
    components: {DicSelect},
    data () {
      return {
        formModal: false,
        editable: "",
        dataFormLayout: {
          labelCol: {span: 5},
          wrapperCol: {span: 15}
        },
        submitLoading: false,
        dataForm: this.$form.createForm(this)
      }
    },
    methods: {
      // 校验身份证号
      checkPeopleCard (rule, value, callback) {
        const type = this.dataForm.getFieldValue("relatedidcardtype")
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        const regLetter = /[A-WY-Za-wy-z\W]+/g
        if (type == "0" && !reg.test(value) && regLetter.test(value)) {
          callback("身份证号码含有非法字符！")
        } else if (type == "0" && !reg.test(value)) {
          callback("请输入正确的身份证号码！")
        } else {
          callback()
        }
      },
      show (obj) {
        this.formModal = true
        this.$nextTick(() => {
          this.dataForm.setFieldsValue(obj)
        })
      },
      submitForm () {
        let self = this
        this.dataForm.validateFields((error, values) => {
          console.log(error, values)
          if (error) {
            return
          }
          self.submitLoading = true
          api
            .updateVipRelated(values)
            .then(res => {
              if (res.status === 0) {
                // 更新列表数据
                self.$emit("callback")
                self.formModal = false
              } else {
                self.$message.error("删除失败")
              }
            })
            .finally(() => {
              self.submitLoading = false
            })
        })
      }
    }
  }
</script>
<style>
</style>
