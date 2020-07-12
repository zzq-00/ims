<template>
  <div>
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-card style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="home"/> 健管卡信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="健管卡代码">
										<a-input v-decorator="['docCode', ]"  :disabled="disabled"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡名称">
										<a-input v-decorator="['docName', ]" :disabled="disabled" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡类型">
										<a-input :disabled="disabled"
										    v-decorator="['docCatCode',]" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="健管卡类型码">
										<a-input v-decorator="['docTypeCode',]" :disabled="disabled"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡号码长度">
										<a-input-number :min="1" :precision="0"  v-decorator="['docNoLen',]"  :disabled="disabled"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否有价">
										<a-input
										    v-decorator="['isValued',]" :disabled="disabled" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="是否虚拟卡">
										<a-input  :disabled="disabled"
										    v-decorator="['isVirtual',]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否有效">
										<a-input  :disabled="disabled"
										    v-decorator="['isValid', ]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="有效截止日期">
										<a-input  :disabled="disabled" v-decorator="['invalidDate',]"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="票面金额">
										<a-input  :disabled="disabled"  v-decorator="['faceAmount', ]" />
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
			</a-form>
  </div>
</template>
<script>
export default {
	name: 'card-form',
	data () {
		return {
			disabled: true,
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			dataForm: this.$form.createForm(this),
			extraParam: {}
		}
	},
	mounted () {

	 },
	methods: {
		editForm (extraParam) {
			extraParam.isValued === 'Y' ? extraParam.isValued = '是' : extraParam.isValued = '否'
			extraParam.isVirtual === 'Y' ? extraParam.isVirtual = '是' : extraParam.isVirtual = '否'
			extraParam.isValid === 'Y' ? extraParam.isValid = '是' : extraParam.isValid = '否'
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(extraParam)
			})
		}
	}
}
</script>
<style>

</style>
