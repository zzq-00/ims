<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
				<a-card>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="服务流程">
								<a-input :disabled="true" :value="extraParam.serviceName" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="支持的渠道" :labelCol="{span:4}" :wrapperCol="{span: 20}">
								<DicSelect dicType="ST_SYS_NO" mode="multiple" v-decorator="['startChannel', {rules: [{ required: true, message: '请选择' }]}]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

				<a-card style="margin-top:10px;" title="分诊节点">
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="该节点是否有效">
								<DicSelect dicType="YES_NO" v-decorator="['a02.flowStatus', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可结束">
								<DicSelect dicType="YES_NO" v-decorator="['a02.isEnd', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可取消">
								<DicSelect dicType="YES_NO" v-decorator="['a02.isCancel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="是否可回退">
								<DicSelect dicType="YES_NO" :disabled="true" v-decorator="['a02.isBack']" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="流程条件">
								<DicSelect :disabled="disabledFlag" dicType="SI_SPECIAL_STEPS_01" :allowClear="true" v-decorator="['a02.flowState', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

				<a-card style="margin-top:10px;" title="预约节点">
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="该节点是否有效">
								<DicSelect dicType="YES_NO" v-decorator="['a03.flowStatus', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可结束">
								<DicSelect dicType="YES_NO" v-decorator="['a03.isEnd', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可取消">
								<DicSelect dicType="YES_NO" v-decorator="['a03.isCancel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="是否可回退">
								<DicSelect dicType="YES_NO" :disabled="true" v-decorator="['a03.isBack', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="流程条件">
								<DicSelect :disabled="disabledFlag" dicType="SI_SPECIAL_STEPS_01" v-decorator="['a03.flowState', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

				<a-card style="margin-top:10px;" title="陪诊节点">
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="该节点是否有效">
								<DicSelect dicType="YES_NO" v-decorator="['a04.flowStatus', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可结束">
								<DicSelect dicType="YES_NO" v-decorator="['a04.isEnd', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可取消">
								<DicSelect dicType="YES_NO" v-decorator="['a04.isCancel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="是否可回退">
								<DicSelect dicType="YES_NO" :disabled="true" v-decorator="['a04.isBack', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="流程条件">
								<DicSelect :disabled="disabledFlag" dicType="SI_SPECIAL_STEPS_0103" v-decorator="['a04.flowState', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

				<a-card style="margin-top:10px;" title="次日就诊节点">
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="该节点是否有效">
								<DicSelect dicType="YES_NO" v-decorator="['a05.flowStatus', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可结束">
								<DicSelect dicType="YES_NO" v-decorator="['a05.isEnd', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可取消">
								<DicSelect dicType="YES_NO" v-decorator="['a05.isCancel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="是否可回退">
								<DicSelect dicType="YES_NO" :disabled="true" v-decorator="['a05.isBack', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="流程条件">
								<DicSelect :disabled="disabledFlag" dicType="SI_SPECIAL_STEPS_01" v-decorator="['a05.flowState', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

				<a-card style="margin-top:10px;" title="记录服务实施节点">
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="该节点是否有效">
								<DicSelect dicType="YES_NO" v-decorator="['a06.flowStatus', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可结束">
								<DicSelect dicType="YES_NO" v-decorator="['a06.isEnd', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可取消">
								<DicSelect dicType="YES_NO" v-decorator="['a06.isCancel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="是否可回退">
								<DicSelect dicType="YES_NO" :disabled="true" v-decorator="['a06.isBack', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="流程条件">
								<DicSelect :disabled="disabledFlag" dicType="SI_SPECIAL_STEPS_01" v-decorator="['a06.flowState', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

				<a-card style="margin-top:10px;" title="回访节点">
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="该节点是否有效">
								<DicSelect dicType="YES_NO" v-decorator="['a08.flowStatus', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可结束">
								<DicSelect dicType="YES_NO" v-decorator="['a08.isEnd', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可取消">
								<DicSelect dicType="YES_NO" v-decorator="['a08.isCancel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="是否可回退">
								<DicSelect dicType="YES_NO" :disabled="true" v-decorator="['a08.isBack', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="流程条件">
								<DicSelect :disabled="disabledFlag" dicType="SI_SPECIAL_STEPS_0102" v-decorator="['a08.flowState', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

				<a-card style="margin-top:10px;" title="问题工单节点">
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="该节点是否有效">
								<DicSelect dicType="YES_NO" v-decorator="['a11.flowStatus', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可结束">
								<DicSelect dicType="YES_NO" v-decorator="['a11.isEnd', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="是否可取消">
								<DicSelect dicType="YES_NO" v-decorator="['a11.isCancel', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="6">
							<a-form-item label="是否可回退">
								<DicSelect dicType="YES_NO" :disabled="true" v-decorator="['a11.isBack', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="流程条件">
								<DicSelect :disabled="disabledFlag" dicType="SI_SPECIAL_STEPS_01" v-decorator="['a11.flowState', {initialValue: '' }]" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-card>

			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">返回</a-button>
				<a-button v-if="!readonly" :loading="submitLoading" @click="submitForm('00')" type="primary">保存</a-button>
				<a-button v-if="!readonly" :loading="submitLoading" @click="submitForm('01')" type="primary">保存并发布</a-button>
			</div>
    </a-modal>

  </div>
</template>
<script>
import api from '@/api/api-process-config'
import DicSelect from '@/components/dic-select'
export default {
	name: 'mess-controll-form',
	components: { DicSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			readonly: true,

			modalWidth: 1170,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			disabledFlag: false,
			dataForm: this.$form.createForm(this),
			flowDefData: {
				channelL: [],
				issueStatus: '',
				flowL: []
			}
		}
	},
	mounted () {

	 },
	methods: {
		loadFlowDefData () {
			if (!this.extraParam.serviceCode) return
			let params = {
				serviceCode: this.extraParam.serviceCode
			}
			api.queryFlowDeServiceFlow(params).then(res => {
				this.flowDefData = res.data
				let channelL = this.flowDefData.channelL || []
				this.dataForm.setFieldsValue({startChannel: channelL})
				this.restoreForm()
			})
		},
		restoreForm () {
			let flowList = this.flowDefData.flowL || []
			flowList.forEach(item => {
				if (item.currentStep === '02') {
					this.dataForm.setFieldsValue({'a02': item})
				} else if (item.currentStep === '03') {
					this.dataForm.setFieldsValue({'a03': item})
				} else if (item.currentStep === '04') {
					this.dataForm.setFieldsValue({'a04': item})
				} else if (item.currentStep === '05') {
					this.dataForm.setFieldsValue({'a05': item})
				} else if (item.currentStep === '06') {
					this.dataForm.setFieldsValue({'a06': item})
				} else if (item.currentStep === '08') {
					this.dataForm.setFieldsValue({'a08': item})
				} else if (item.currentStep === '11') {
					this.dataForm.setFieldsValue({'a11': item})
				}
			})
		},
		editForm (extraParam, readonly) {
			this.extraParam = extraParam || {}
			this.modalTitle = '服务流程规则配置'
			this.readonly = false
			if (readonly) {
				this.readonly = true
				this.modalTitle = '查看服务流程规则配置'
			}
			this.formModal = true
			this.spinning = false
			this.dataForm.resetFields()

			this.loadFlowDefData()
		},
		submitForm (issueStatus) {
			if (issueStatus === '01' && this.extraParam.haveQueue !== 'Y') {
				// 保存并发布
				this.$Message.warning('此服务未配置服务队列，不可发布！')
				return
			}

			if (this.flowDefData.issueStatus && this.flowDefData.issueStatus !== '00') {
				this.$Message.warning('此流程已发布，如需修改请先禁用！')
				return
			}

			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign({}, values)

				if (formData.a08.flowState === '02' && formData.a11.flowStatus !== 'Y') {
					this.$Message.warning('流程条件投诉则问题工单需有效！')
					return
				}

				let isEndCount = 0
				if (formData.a02.isEnd === 'Y') isEndCount++
				if (formData.a03.isEnd === 'Y') isEndCount++
				if (formData.a04.isEnd === 'Y') isEndCount++
				if (formData.a05.isEnd === 'Y') isEndCount++
				if (formData.a06.isEnd === 'Y') isEndCount++
				if (formData.a08.isEnd === 'Y') isEndCount++
				if (isEndCount > 1) {
					this.$Message.warning('在问题工单节点之前只可有一个可以结束的节点！')
					return
				}
				console.log('formdata====', formData)

				let data = {
					issueStatus: issueStatus,
					serviceCode: this.extraParam.serviceCode,
					serviceName: this.extraParam.serviceName,
					startChannel: formData.startChannel,
					flowL: []
				}
				let flowObj1 = {
					flowStatus: 'Y',
					isEnd: 'N',
					isCancel: 'N',
					isBack: 'N',
					flowState: '01',
					isStart: 'Y'
				}
				data.flowL.push(flowObj1)

				formData.a02.currentStep = '02'
				formData.a03.currentStep = '03'
				formData.a04.currentStep = '04'
				formData.a05.currentStep = '05'
				formData.a06.currentStep = '06'
				formData.a08.currentStep = '08'
				formData.a11.currentStep = '11'

				data.flowL.push(formData.a02)
				data.flowL.push(formData.a03)
				data.flowL.push(formData.a04)
				data.flowL.push(formData.a05)
				data.flowL.push(formData.a06)
				data.flowL.push(formData.a08)
				data.flowL.push(formData.a11)

				this.submitLoading = true
				api.saveFlowServiceFlow(data).then(res => {
					this.$message.success('保存成功!')
					this.formModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		}
	}
}
</script>
<style>

</style>
