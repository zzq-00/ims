<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="疑难工单上报">
      <a-card style="margin: 24px;">
        <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol"
                :wrapperCol="filterFormLayout.wrapperCol">
          <a-row>
            <a-col :span="24">
              <a-form-item label="备注" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                <a-textarea v-decorator="['remark', {initialValue:remark||'',rules: [{ required: true, message: '备注不能为空!' }]}]"
                            :autoSize="{ minRows: 2, maxRows: 6 }"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

      </a-card>
      <template slot="footer">
        <a-button type="" :loading="uploading" @click="saveForm">保存</a-button>
        <a-button :loading="uploading1" type="primary" @click="submitForm">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import api from '@/api/api-serve-apply'

  export default {
    props: {
        remark: {
            type: String,
            default() {
                return ''
            }
        }
    },
    data() {
      return {
        // 查询条件
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        },
        formModal: false,
        modalWidth: 500,
        filterForm: this.$form.createForm(this),
        param: {},
        uploading1: false,
        uploading: false
      }
    },
    methods: {
      initForm(param) {
        this.formModal = true
        this.param = param
      },
      saveForm() {
        this.filterForm.validateFields((error, values) => {
          if (error) {
            this.$message.error("请将表单填写完整")
            return
          }
          this.param.remark = this.filterForm.getFieldValue('remark')
          this.param.saveType='03'
          this.$emit("on-update", this.param)
        })
      },
      submitForm() {
        let self = this
        this.filterForm.validateFields((error, values) => {
          if (error) {
            this.$message.error("请将表单填写完整")
            return
          }
          this.param.remark = this.filterForm.getFieldValue('remark')
          this.param.saveType='02'
          this.$emit("on-update", this.param)
          this.formModal=false
        })
      }
    }
  }
</script>
