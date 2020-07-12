<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-spin :spinning="spinning"/>
      <a-divider orientation="left"><a-icon type="home"/> 选择合并目标机构 </a-divider>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-row>
            <a-col :span="12">
              <a-form-item label="机构名称">
                <a-select ref="sorgNameSelect" placeholder="请选择" v-decorator="['sorgName', {initialValue: ''}]">
                  <a-select-option v-for="item in sorgNameList" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item>
                <a-radio :checked="showUpdateName" @click="showUpdateName = !showUpdateName"> 修改名称 </a-radio>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item>
                <a-input v-show="showUpdateName" v-decorator="['updateName',{initialValue:'',rules: [ { required: true, message: '修改名称为空!' }]}]"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-form>
    <div slot="footer">
      <a-button :loading="submitLoading" type="primary" @click="submitForm">合并到目标机构</a-button>
      <a-button type="" @click="formModal=false">关闭</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
	name: "supplier-merges-form",
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			modalWidth: 1070,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			sorgNameList: [],
			showUpdateName: false
		}
	},
	mounted () {

	},
	watch: {
		formModal: function (newVal, oldVal) {
			if (!newVal) {
				this.resetDataForm()
			}
		}
	},
	methods: {
		sorgNameSelect (obj) {
			this.formModal = true
			this.sorgNameList = obj
		},
		resetDataForm () {
			this.dataForm.resetFields()
		},
		submitForm () {
			if (this.dataForm.getFieldValue('sorgName') === '') {
				this.$message.info("请选择对应的目标数据！")
				return
			}
			if (this.showUpdateName) {
				if (this.dataForm.getFieldValue('updateName') === '') {
					this.$message.info("请确认是否需要修改名称，如果需要修改，请录入修改后的名称！")
					return
				}
			}
			let data = {
				sorgCode: this.dataForm.getFieldValue('sorgName'),
				updateName: this.dataForm.getFieldValue('updateName')
			}
			this.$emit('on-update', data)
			this.formModal = false
		}
	}
}
</script>

<style scoped>

</style>
