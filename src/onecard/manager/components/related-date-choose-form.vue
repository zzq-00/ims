<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="800" title="设置保全生效日期">
      <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-spin :spinning="spinning"/>
        <a-row>
          <a-col :span="24">
            <a-form-item label="保全生效日期">
              <a-week-picker format="YYYY-MM-DD"
                             v-decorator="['edorvalidate',{rules: [{ required: true, message: '保全生效日期不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import api from '@/api/api-vip'

  export default {
    name: 'related-date-choose-form',
    data() {
      return {
        dataFormLayout: {
          labelCol: {span: 5},
          wrapperCol: {span: 15}
        },
        submitLoading: false,
        spinning: false,
        formModal: false,
			importData: [],
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {
	},
	methods: {
		show (obj) {
      this.formModal = true;
      this.importData = obj
    },
		submitForm () {
      let self = this;
      this.dataForm.validateFields((error, values) => {
        if (error) {
          return
        }
        // self.submitLoading = true
        let formData = Object.assign(self.importData, values);
        api.importRelatedfile(formData).then(res => {
          if (res.status === 0) {
            // self.submitLoading = true
            self.$emit('callback');
            self.formModal = false;
            self.$message.success('导入完成!')
          } else {
            self.$message.error('导入失败');
            self.submitLoading = false
          }
				})
			})
		}
	}

}
</script>
<style>

</style>
