<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-spin :spinning="spinning"/>
      <a-divider orientation="center"> 合并历史下载 </a-divider>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="开始/结束时间" :label-col="{span:6}" :wrapper-col="{span:16}">
            <a-range-picker v-decorator="['downloadDate',{rules: [{ required: true, message: '开始/结束时间不能为空!' }]}] "/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div slot="footer">
      <a-button type="" @click="formModal=false">取消</a-button>
      <a-button :loading="submitLoading" type="primary" @click="download">下载</a-button>
    </div>
  </a-modal>
</template>

<script>
import supApi from '@/api/api-supplier'
import moment from 'moment'
export default {
  name: "merge-history-form",
  data () {
    return {
      dataFormLayout: {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 }
      },
      spinning: false,
      modalWidth: 970,
      modalTitle: '',
      submitLoading: false,
      formModal: false,
      dataForm: this.$form.createForm(this),
    }
  },
  mounted () {

  },
  methods: {
    initHistoryForm () {
      this.dataForm.resetFields()
      this.formModal = true
    },
    download () {
      this.dataForm.validateFields((error, values) => {
        if (error) {
          return
        }
        let formData = Object.assign({}, values)
        let data = {
          startDate: moment(formData.downloadDate[0]).format('YYYY-MM-DD'),
          endDate: moment(formData.downloadDate[1]).format('YYYY-MM-DD')
        }
        this.submitLoading = true
        supApi.dealMergeExport(data).then(res => {
          if (res.status === (undefined || '')) {
            this.$message.error('文件导出失败！')
          } else {
            this.$downloadFileByBase64(res, `合并历史机构.xlsx`)
          }
        }).finally(() => {
          this.submitLoading = false
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
