<template>
	<div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" style="margin: 10px;" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning" />
				<a-row :gutter="16">
					<a-col :span="24">
						<a-form-item label="问题名称" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
							<a-input v-decorator="['questionName', {initialValue: '', rules: [{ required: true, message: '问题名称不能为空!' }]}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="问题类型">
							<DicSelect dicType="QUESTION_TYPE" @change="questionTypeChange" v-decorator="['questionType', {initialValue: '', rules: [{ required: true, message: '问题类型不能为空!' }]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6" v-if="dataForm.getFieldValue('questionType') !== '01'">
						<a-form-item label="答案类型">
							<a-select v-decorator="['answerType', {initialValue: '', rules: [{ required: true, message: '答案类型不能为空!' }]}]">
								<a-select-option v-for="(item,index) in answerList()" :key="index" :value="item.value">{{item.label}}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="是否必答">
							<a-radio-group :options="[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]" v-decorator="['mustAnswerFlag',{initialValue:'Y'}]"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="24">
						<a-form-item label="问题描述" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
							<a-textarea v-decorator="['questionDesc', {initialValue: '', rules: [{ required: true, message: '问题描述不能为空!' }]}]" :autosize="{ minRows: 6, maxRows: 8 }" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-alert
					message="问题帮助：如果您需要在问题里包含一些动态内容，可以在问题里用以下方式代替："
					description="客户姓名$1  客户称谓$2  服务机构$3  供应商机构$4  服务时间$5  陪诊时间$6  服务名称$7"
					type="info"
					show-icon
				/>
			</a-form>

			<a-card title="答案选项列表" style="margin-top: 10px;" v-if="isQuestionType(['02','03'])">
				<a-button slot="extra" size="small" type="primary" @click="addOption">添加选项</a-button>
				<a-row :gutter="20">
					<a-col :span="5" style="margin-right: 8px;"><span class="table-row-require">*</span>答案选项</a-col>
					<a-col :span="5" style="margin-right: 8px;"><span class="table-row-require">*</span>选项代码值</a-col>
					<a-col :span="3"><span class="table-row-require">*</span>是否缺省值</a-col>
					<a-col :span="5" style="margin-right: 8px;"><span class="table-row-require">*</span>代码选项值说明</a-col>
					<a-col :span="2">操作</a-col>
					<a-col :span="2">排序</a-col>
				</a-row>
				<a-row v-for="(item,index) in  options" :key="index">
					<a-col :span="5" style="margin-right: 8px;">
						<a-form-item><a-input placeholder="答案选项" v-model="options[index].answerOption" /></a-form-item>
					</a-col>
					<a-col :span="5" style="margin-right: 8px;">
						<a-form-item><a-input placeholder="选项代码值" v-model="options[index].optionCode"/></a-form-item>
					</a-col>
					<a-col :span="3">
						<a-form-item>
							<a-checkbox :checked="item.defaultFlag === 'Y'" @change="(e) => {item.defaultFlag = e.target.checked ? 'Y' : 'N'}">是</a-checkbox>
						</a-form-item>

					</a-col>
					<a-col :span="5" style="margin-right: 8px;">
						<a-form-item><a-input placeholder="选项代码值说明" v-model="options[index].optionCodeDesc" /></a-form-item>
					</a-col>
					<a-col :span="2" style="padding-left: 15px;">
						<a-icon class="dynamic-oper-button" @click="deleteOption(index)" type="minus-circle-o" />
					</a-col>
					<a-col :span="2" style="padding-left: 5px;">
						<a-icon class="dynamic-oper-button" v-if="index > 0" @click="moveUpOption(index)" type="up-circle-o" />
						<a-icon class="dynamic-oper-button" v-if="index < options.length - 1" @click="moveDownOption(index)" type="down-circle-o" />
					</a-col>
				</a-row>
			</a-card>

			<a-card title="问题答案" style="margin-top: 10px;" v-if="isQuestionType(['04']) && isAnswerType(['01'])">
				<a-row>
					<a-col :span="10" style="margin-right: 5px;">
						<a-form-item label="最大值" :labelCol="{span:8}" :wrapperCol="{span:16}">
							<a-input placeholder="最大值" v-model="answerObj.maxValue" />
						</a-form-item>
					</a-col>
					<a-col :span="10" style="margin-right: 5px;">
						<a-form-item label="最小值" :labelCol="{span:8}" :wrapperCol="{span:16}">
							<a-input placeholder="最小值" v-model="answerObj.minValue"/>
						</a-form-item>
					</a-col>
				</a-row>
			</a-card>

			<a-card title="问题答案" style="margin-top: 10px;" v-if="isQuestionType(['04']) && isAnswerType(['02'])">
				<a-row>
					<a-col :span="10" style="margin-right: 5px;">
						<a-form-item label="最大长度" :labelCol="{span:8}" :wrapperCol="{span:16}">
							<a-input placeholder="最大可输入200汉字" v-model="answerObj.maxLength" />
						</a-form-item>
					</a-col>
					<a-col :span="10" style="margin-right: 5px;">
						<a-form-item label="缺省输入值" :labelCol="{span:8}" :wrapperCol="{span:16}">
							<a-input placeholder="输入缺省的默认内容" v-model="answerObj.defaultInput" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-card>

			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button type="primary" @click="preview">预览</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
			</div>
		</a-modal>

		<QuestionPreview ref="questionPreview" />
	</div>
</template>
<script>
import api from '@/api/api-questionnaire'
import DicSelect from '@/components/dic-select'
import QuestionPreview from './question-preview'
export default {
	name: 'question-form',
	components: { DicSelect, QuestionPreview },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 1070,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			options: [],
			answerObj: {
				minValue: 50,
				maxValue: 200,
				maxLength: 200,
				defaultInput: ''
			}
		}
	},
	mounted () {

	},
	methods: {
		questionTypeChange () {
			this.dataForm.setFieldsValue({answerType: ''})
		},
		answerList () {
			let questionType = this.dataForm.getFieldValue('questionType')
			if (questionType === '01') {
				return []
			} else if (questionType === '02') {
				return [ { label: '单选按钮', value: '03' }, { label: '单选下拉列表', value: '04' }	]
			} else if (questionType === '03') {
				return [ { label: '多选按钮', value: '05' }, { label: '多选列表', value: '06' } ]
			} else if (questionType === '04') {
				return [ { label: '数字', value: '01' }, { label: '文本', value: '02' } ]
			} else if (questionType === '05') {
				return [ { label: '日期控件', value: '07' } ]
			}
			return []
		},
		isQuestionType (type = []) {
			let questionType = this.dataForm.getFieldValue('questionType')
			return type.includes(questionType)
		},
		isAnswerType (type = []) {
			let answerType = this.dataForm.getFieldValue('answerType')
			return type.includes(answerType)
		},
		addOption () {
			let obj = {
				answerOption: '',
				optionCode: '',
				defaultFlag: 'N',
				optionCodeDesc: '',
				answerSeq: this.options.length + 1
			}

			this.options.push(obj)
		},
		deleteOption (index) {
			this.options.splice(index, 1)
		},
		moveUpOption (index) {
			if (index <= 0) return
			let index2 = index - 1

			this.options[index] = this.options.splice(index2, 1, this.options[index])[0]
		},
		moveDownOption (index) {
			if (index >= this.options.length) return
			let index2 = index + 1

			this.options[index] = this.options.splice(index2, 1, this.options[index])[0]
		},
		validateOption () {
			let flag = true
			if (this.isQuestionType(['02', '03'])) {
				if (this.options.length < 2) {
					this.$Message.error('选择题必须包含至少两个答案项!')
					return false
				}

				this.options.forEach(item => {
					if (!item.answerOption) flag = false
					if (!item.optionCode) flag = false
					if (!item.optionCodeDesc) flag = false
				})

				if (!flag) this.$Message.error('请完善答案选项列表!')
			}

			return flag
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建公共问题'
			this.formModal = true
			this.options = []
			this.answerObj = {}

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({
					questionType: '01'
				})
			})
		},
		editForm (extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑公共问题'
			this.isAdd = false
			this.formModal = true
			this.dataForm.resetFields()
			this.options = []
			this.answerObj = {}

			this.spinning = true
			let params = {
				id: this.extraParam.publicQuestionId
			}
			api.queryOnePublicQuestion(params).then(res => {
				let obj = res.data

				this.$nextTick(() => {
					this.dataForm.setFieldsValue(obj)
				})
				this.options = obj.publicAnswerEntities || []
				Object.keys(this.answerObj).forEach(key => {
					if (obj[key]) this.answerObj[key] = obj[key]
				})
			}).finally(() => {
				this.spinning = false
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				if (!this.validateOption()) {
					return
				}

				let formData = Object.assign(this.extraParam, values)
				if (formData.questionType === '04') {
					formData.publicAnswerEntities = []
					formData.publicAnswerEntities.push(this.answerObj)
				}
				if (['02', '03'].includes(formData.questionType)) {
					formData.publicAnswerEntities = this.options
				}

				let self = this
				self.submitLoading = true
				api.addOrUpdatePublicQuestion(formData).then(res => {
					self.$message.success('保存成功!')
					self.formModal = false
					self.$emit('on-update')
				}).finally(() => {
					self.submitLoading = false
				})
			})
		},
		preview () {
			let formData = Object.assign(this.extraParam, this.dataForm.getFieldsValue())
			if (!formData.questionType) {
				this.$message.warning('问题类型不能为空!')
				return
			}
			if (formData.questionType === '04') {
				formData.publicAnswerEntities = []
				formData.publicAnswerEntities.push(this.answerObj)
			}
			if (['02', '03'].includes(formData.questionType)) {
				formData.publicAnswerEntities = this.options
			}

			this.$refs.questionPreview.show(formData)
		}
	}
}
</script>
<style >
.dynamic-oper-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-oper-button:hover {
  color: #777;
}
.dynamic-oper-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.table-row-require {
	color: red;
	font-weight: bold;
}
</style>
