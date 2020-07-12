<template>
	<div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-spin :spinning="spinning" />
			<a-card title="当前问题列表">
				<a-table :bordered="false" :dataSource="questionList" :columns="columns" :rowKey="record => record.qnrQuestionId" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
					<div slot="operation" slot-scope="text, record">
						<a-button type="link" @click="deleteQuestion(record)">删除</a-button>
					</div>
					<div slot="sort" slot-scope="text, record, index">
						<a-button type="link" v-if="index > 0" @click="moveUpQuestion(record)">上移</a-button>
						<a-button type="link" v-if="index < questionList.length - 1" @click="moveDownQuestion(record)">下移</a-button>
					</div>
				</a-table>
			</a-card>
			<div style="margin:10px;">
				<a-button type="primary" :disabled="!selectedRows.length" @click="editQuestion" style="float:right;margin-right: 10px;">修改</a-button>
				<a-button type="primary" @click="addQuestion" style="float:right;margin-right: 10px;">添加公共问题</a-button>
			</div>

			<a-card title="编辑问题" style="margin-top: 50px;">
				<a-form :form="dataForm" style="margin: 10px;" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
					<a-row :gutter="8">
						<a-col :span="12">
							<a-form-item label="问卷名称">
								<a-input :disabled="true" :value="extraParam.qnrName" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="问卷编码">
								<a-input :disabled="true" :value="extraParam.qnrCode" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="8">
						<a-col :span="24">
							<a-form-item label="问卷描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
								<a-textarea :disabled="true" :value="extraParam.qnrDesc" :autosize="{ minRows: 4, maxRows: 8 }" />
							</a-form-item>
						</a-col>
					</a-row>

					<a-row :gutter="16">
						<a-col :span="24">
							<a-form-item label="问题描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
								<a-input v-decorator="['questionDesc', {initialValue: '', rules: [{ required: true, message: '问题描述不能为空!' }]}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12">
							<a-form-item label="问题类型">
								<DicSelect dicType="QUESTION_TYPE" @change="questionTypeChange" v-decorator="['questionType', {initialValue: '', rules: [{ required: true, message: '问题类型不能为空!' }]}]" />
							</a-form-item>
						</a-col>
						<a-col :span="12" v-if="dataForm.getFieldValue('questionType') !== '01'">
							<a-form-item label="答案类型">
								<a-select v-decorator="['answerType', {initialValue: '', rules: [{ required: true, message: '答案类型不能为空!' }]}]">
									<a-select-option v-for="(item,index) in answerList()" :key="index" :value="item.value">{{item.label}}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12">
							<a-form-item label="问题顺序">
								<a-input :disabled="true" v-decorator="['questionSeq', {initialValue: ''}]" placeholder="自动生成" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="是否必答">
								<a-radio-group :options="[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]" v-decorator="['mustAnswerFlag',{initialValue:'Y'}]"/>
							</a-form-item>
						</a-col>
					</a-row>

					<a-row :gutter="16">
						<a-col :span="12">
							<a-form-item label="当前问题">
								<a-select @change="loadList2" v-decorator="['currentQuestionId', {initialValue: ''}]">
									<a-select-option v-for="(item,index) in list1" :key="index" :value="item.qnrQuestionId">{{item.questionDesc}}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="当前选项">
								<a-select v-decorator="['currentQuestionOption', {initialValue: ''}]">
									<a-select-option v-for="(item,index) in list2" :key="index" :value="item.optionCode">{{item.answerOption}}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12">
							<a-form-item label="客户性别为">
								<DicSelect dicType="GENDER" v-decorator="['custGender', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="16">
						<a-col :span="12">
							<a-form-item label="客户年龄为">
								<a-input v-decorator="['ageLowerLimit', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="至区间回答此问题">
								<a-input v-decorator="['ageTopLimit', {initialValue: ''}]" />
							</a-form-item>
						</a-col>
					</a-row>

					<a-card title="答案选项列表" style="margin-top: 10px;" v-if="isQuestionType(['02','03'])">
						<a-button slot="extra" size="small" type="primary" @click="addOption">添加选项</a-button>
						<a-row :gutter="20">
							<a-col :span="5" style="margin-right: 8px;"><span class="table-row-require">*</span>答案选项</a-col>
							<a-col :span="5" style="margin-right: 8px;"><span class="table-row-require">*</span>选项代码值</a-col>
							<a-col :span="3">是否缺省值</a-col>
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

				</a-form>
			</a-card>

			<div slot="footer">
				<a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm(true)">保存并继续添加</a-button>
				<a-button :loading="submitLoading" type="primary" @click="resetDataForm">重置</a-button>
				<a-button type="" @click="formModal=false">返回</a-button>
			</div>
		</a-modal>
		<QuestionSelectModal ref="questionSelectModal" @on-update="selectQuestionHandle" />
	</div>
</template>
<script>
import api from '@/api/api-questionnaire'
import DicSelect from '@/components/dic-select'
import QuestionSelectModal from './question-select-modal'
export default {
	name: 'questionnaire-design-form',
	components: { DicSelect, QuestionSelectModal },
	data () {
		return {
			loading: false,
			questionList: [],
			selectedRows: [],
			rowLoading: false,
			selectedRowKeys: [],
			columns: [
				{ title: "序号", dataIndex: "recordIndex", with: 100 },
				{ title: "问题描述", dataIndex: "questionDesc", width: 550 },
				{ title: "操作", dataIndex: "operation", width: 100, scopedSlots: { customRender: "operation" } },
				{ title: "排序", dataIndex: "sort", width: 180, scopedSlots: { customRender: "sort" } }
			],
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			modalWidth: 1170,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			list1: [],
			list2: [],
			questionnaireObj: {},
			curQuestionObj: {},
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
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
			this.loadList1(this.selectedRows[0])
		},
		addQuestion () {
			this.$refs.questionSelectModal.show()
		},
		selectQuestionHandle (obj) {
			api.queryOnePublicQuestion({id: obj.publicQuestionId}).then(res => {
				let data = res.data
				data.qnrInfoId = this.questionnaireObj.qnrInfoId
				api.PubQuestQuestion(data).then(res => {
					this.loadQuestionList()
				})
			})
		},
		editQuestion () {
			let obj = this.selectedRows[0]
			if (obj.publicQuestionId) {
				this.$Message.warning('此问题为公共问题，不可更改')
				return
			}
			this.curQuestionObj = obj
			this.dataForm.setFieldsValue(obj)
			this.loadList1(obj.questionSeq)
		},
		loadList1 (questSeq) {
			this.list1 = []
			this.questionList.forEach(item => {
				if ((questSeq === 'max' || item.questionSeq < questSeq) && ['02', '03'].includes(item.questionType)) {
					this.list1.push(item)
				}
			})
		},
		loadList2 (qnrQuestionId) {
			api.queryQuestionAnswer({qnrQuestionId}).then(res => {
				this.list2 = res.data
			})
		},
		deleteQuestion (obj) {
			api.deleteQuestion({id: obj.qnrQuestionId}).then(res => {
				this.loadQuestionList()
			})
		},
		moveUpQuestion (obj) {
			let index = this.questionList.findIndex(item => item.qnrQuestionId === obj.qnrQuestionId)
			if (index <= 0) {
				this.$Message.info('顶部无法继续上移')
				return
			}

			let obj2 = this.questionList[index - 1]
			let questionSeq = obj.questionSeq
			obj.questionSeq = obj2.questionSeq
			obj2.questionSeq = questionSeq

			let params = {
				qnrInfoId: this.extraParam.qnrInfoId,
				qnrQuestSeqEntites: [
					{ qnrQuestionId: obj.qnrQuestionId, questionSeq: obj.questionSeq },
					{ qnrQuestionId: obj2.qnrQuestionId, questionSeq: obj2.questionSeq }
				]
			}

			api.updateQuestionaireQuestSeq(params).then(res => {
				this.loadQuestionList()
			})
		},
		moveDownQuestion (obj) {
			let index = this.questionList.findIndex(item => item.qnrQuestionId === obj.qnrQuestionId)
			if (index >= this.questionList.length - 1) {
				this.$Message.info('底部无法继续下移')
				return
			}

			let obj2 = this.questionList[index + 1]
			let questionSeq = obj.questionSeq
			obj.questionSeq = obj2.questionSeq
			obj2.questionSeq = questionSeq

			let params = {
				qnrInfoId: this.extraParam.qnrInfoId,
				qnrQuestSeqEntites: [
					{ qnrQuestionId: obj.qnrQuestionId, questionSeq: obj.questionSeq },
					{ qnrQuestionId: obj2.qnrQuestionId, questionSeq: obj2.questionSeq }
				]
			}

			api.updateQuestionaireQuestSeq(params).then(res => {
				this.loadQuestionList()
			})
		},
		loadQuestionList () {
			if (!this.extraParam.qnrInfoId) return

			this.spinning = true
			api.queryListQuestion({qnrInfoId: this.extraParam.qnrInfoId}).then(res => {
				this.questionList = res.data
				this.questionList.forEach((item, index) => {
					item.recordIndex = index + 1
				})
			}).finally(() => {
				this.spinning = false
			})
		},
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
				optionCodeDesc: ''
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
		resetDataForm () {
			this.questionList = []
			this.questionnaireObj = {}
			this.curQuestionObj = {}
			this.list1 = []
			this.list2 = []
			this.loadList1('max')
			this.dataForm.resetFields()

			this.loadQuestionList()
		},
		loadQuestionaire () {
			let params = {
				id: this.extraParam.qnrInfoId
			}

			this.spinning = true
			api.queryOneQnrInfo(params).then(res => {
				this.questionnaireObj = res.data
				Object.assign(this.extraParam, this.questionnaireObj)
				this.$nextTick(() => {
					this.dataForm.setFieldsValue(this.questionnaireObj)
				})
			}).finally(() => {
				this.spinning = false
			})
		},
		show (extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑问卷问题'
			this.formModal = true
			this.resetDataForm()

			this.loadQuestionaire()
		},
		submitForm (notClose) {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				if (!this.validateOption()) {
					return
				}

				let formData = Object.assign(this.curQuestionObj, values)
				formData.qnrInfoId = this.extraParam.qnrInfoId

				if (formData.questionType === '04') {
					formData.answerEntities = []
					formData.answerEntities.push(this.answerObj)
				}
				if (['02', '03'].includes(formData.questionType)) {
					formData.answerEntities = this.options
				}

				let self = this
				self.submitLoading = true
				api.addOrUpdateQuestion(formData).then(res => {
					self.$message.success('保存成功!')
					this.loadQuestionaire()
					if (notClose) {
						this.resetDataForm()
					} else {
						self.formModal = false
					}

					self.$emit('on-update')
				}).finally(() => {
					self.submitLoading = false
				})
			})
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
