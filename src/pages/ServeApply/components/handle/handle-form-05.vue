<template>
  <div>
    <a-form :form="filterForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-card style="margin: 24px;">
        <a-divider orientation="left">服务信息</a-divider>
        <a-row>
          <a-col :span="6">
            <a-form-item label="来源">
              <a-input :value="taskInfo.channelTypeDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="申请服务">
              <a-input :value="taskInfo.serviceName" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">使用人信息</a-divider>
        <a-row>
          <a-col :span="6">
            <a-form-item label="使用人姓名">
              <a-input :value="taskInfo.patientName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="性别">
              <!--              <a-input :value="taskInfo.patientGender=='01'?'男':''" :disabled="true" />-->
              <a-input :value="taskInfo.patientGenderDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input :value="taskInfo.patientCerttypeDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :value="taskInfo.patientCertno" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :value="taskInfo.patientTelephone" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="出生日期">
              <a-input :value="taskInfo.patientBirthDate" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">联系人信息</a-divider>
        <a-row>
          <a-col :span="6">
            <a-form-item label="姓名">
              <a-input  :value="taskInfo.linkmanName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input  :value="taskInfo.linkmanCerttypeDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input  :value="taskInfo.linkmanCertno" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :value="taskInfo.linkmanPhone" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin: 24px;">
        <a-divider orientation="left">预约信息</a-divider>
        <a-row>
          <a-col :span="12">
            <a-form-item label="主要疾病或症状" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <a-input :disabled="true"  :value="taskInfo.disease"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="具体描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <a-textarea  :disabled="true" :value="taskInfo.detailedDescription"  :autoSize="{ minRows: 2, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="供应商" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <a-input :disabled="true" :value="taskInfo.supplierName"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="就诊卡号">
              <a-input  :value="taskInfo.medredCardno" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="医疗机构">
              <a-input  :value="taskInfo.sorgName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="科室">
              <a-input  :value="taskInfo.deptName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="期望医生">
              <a-input :value="taskInfo.resmedDoctorName" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="是否需要特需门诊">
              <DicSelect dicType="YES_NO"  :disabled="true" v-decorator="['specialFlag', {initialValue:taskInfo.specialFlag || ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否有所在地医保">
              <DicSelect dicType="YES_NO"  :disabled="true" v-decorator="['medicareFlag', {initialValue: taskInfo.medicareFlag || ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="预约就诊时间">
              <a-input  v-decorator="['payDateStr']" :value="taskInfo.payDate || taskInfo.payDateStr" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="备注" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <a-textarea  :disabled="true" :value="getRemark(taskInfo.remark, 2)" :autoSize="{ minRows: 2, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card>
        <a-divider orientation="left">陪诊服务信息</a-divider>
        <div v-show="has04">
          <a-row>
            <a-col :span="6">
              <a-form-item label="陪诊人姓名">
                <a-input :disabled="!status" v-decorator="['nextStaffName', {initialValue:''}]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="陪诊人电话">
                <a-input :disabled="!status" v-decorator="['nextStaffTel', {initialValue:''}]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
			  <a-col :span="6" v-show="false">
				  <a-form-item label="PICC陪诊人工号">
					  <a-input :disabled="true" v-decorator="['nextPiccStaffNo', {initialValue:''}]" />
				  </a-form-item>
			  </a-col>
            <a-col :span="6">
              <a-form-item label="PICC陪诊人姓名">
                <a-input :disabled="true" v-decorator="['nextPiccStaffName', {initialValue:''}]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="PICC陪诊人电话">
                <a-input-search :disabled="!status" v-decorator="['nextPiccStaffMobile', {initialValue:''}]" enter-button @search="selectPiccStaff" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <span style="color: red;font-weight: bold;">管家请注意！如果是管家陪诊，请务必选择PICC陪诊填写陪诊信息，否则陪诊绩效不会被计入。</span>
            </a-col>
          </a-row>
        </div>
        <a-row>
          <a-col :span="12">
            <a-form-item label="备注" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <a-textarea  :disabled="!status" v-decorator="['remark2', {initialValue:''}]" :autoSize="{ minRows: 2, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-col :span="12">
          <div style="float: right; margin: 0 10px 10px 0">
            <a-button type="primary" :loading="uploading"  v-show="status" @click="saveForm()">保存</a-button>
            <a-button type="primary" :loading="uploading1"  v-show="status" @click="submitForm()">提交</a-button>
            <a-button type="" v-show ="status" @click="cancelApplyInfo">撤销申请</a-button>
          </div>
        </a-col>
      </a-card>
    </a-form>
    <!-- 撤销申请 要进行短信发送的框 -->
    <MassTextMessageSingle ref="massTextMessageSingle" @on-update="closeForm"/>
    <StaffUserSelect ref="staffUserSelect" @on-update="showStaffUser"/>
    <MassTextMessages ref="massTextMessages" @on-update="stepNext"/>
    <ApplyInfoForm ref="applyInfoForm" />
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
import MassTextMessageSingle from '../../mass-text-message-single'
import MassTextMessages from '../../mass-text-messages'
import StaffUserSelect from '@/pages/ServeApply/components/staff-user-select-modal'
import ApplyInfoForm from "../apply-info-form"
import moment from 'moment'
export default {
	components: {DicSelect, MassTextMessageSingle, StaffUserSelect, MassTextMessages, ApplyInfoForm},
	props: {
		taskInfo: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			status: false, // 是否可点击 控制实施的全局
			filterForm: this.$form.createForm(this),
			uploading: false,
			uploading1: false,
			has04: false
		}
	},
	mounted () {
		this.initLoad()
	},
	methods: {
		moment,
		initLoad () {
			console.log('05页面数据', this.taskInfo)
			this.status = parseInt(this.taskInfo.status) === 5// 判断是否已过了该步骤
			if (parseInt(this.taskInfo.status) >= 5) {
				let remark = this.getRemark(this.taskInfo.remark, 4)
				this.filterForm.setFieldsValue({
					nextStaffName: this.taskInfo.nextStaffName || this.taskInfo.staffName,
					nextStaffTel: this.taskInfo.nextStaffTel || this.taskInfo.staffTel,
					nextPiccStaffNo: this.taskInfo.nextPiccStaffNo || this.taskInfo.piccStaffNo,
					nextPiccStaffName: this.taskInfo.nextPiccStaffName || this.taskInfo.piccStaffName,
					nextPiccStaffMobile: this.taskInfo.nextPiccStaffMobile || this.taskInfo.piccStaffMobile,
					remark2: remark
				})
			}
			api.getPayDate({serviceReservationId: this.taskInfo.serviceReservationId}).then(res => {
				// 字符串获取到携带秒，通过日期转换去除秒，再转为字符串
				let resultPayDate = moment(res.data.payDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
				this.filterForm.setFieldsValue({payDateStr: resultPayDate})
			})
			// 判断该服务配置是否跳过陪诊
			api.checkSerFlow({serviceCode: this.taskInfo.serviceCode}).then(res => {
				this.has04 = (res.data === '04')
			})
		},
		// 取消预约
		cancelApplyInfo () {
			if (!confirm("是否确认撤销？")) return
			let {serviceReservationId, serviceCode, cardNo} = this.taskInfo
			let params = {serviceReservationId, serviceCode, cardNo}
			api.cancelApplyInfo(params).then(res => {
				if (res.status === 0) {
					this.$message.success('撤销成功!')
					// 撤销成功后执行短信提醒服务
					// this.$emit('stepNext',res.data)
					this.$refs.massTextMessageSingle.show(res.data)
				} else {
					this.$message.error("撤销失败!")
				}
			}).finally(() => {
			})
		},
		saveForm () {
			let self = this
			if (this.has04) {
				if (!self.filterForm.getFieldValue('nextPiccStaffName') || self.filterForm.getFieldValue('nextPiccStaffName') === '') {
					if (!self.filterForm.getFieldValue('nextStaffName') || self.filterForm.getFieldValue('nextStaffName') === '') {
						return self.$message.error("陪诊管家和PICC陪诊管家不可同时为空！")
					} else {
						if (!self.filterForm.getFieldValue('nextStaffTel') || self.filterForm.getFieldValue('nextStaffTel') === '') {
							return self.$message.error("陪诊管家电话不可为空！")
						}
					}
				} else {
					if (self.filterForm.getFieldValue('nextStaffName') && self.filterForm.getFieldValue('nextStaffName') !== '') {
						return self.$message.error("PICC陪诊和第三方陪诊有且只能有一个！")
					}
				}
			}

			this.filterForm.validateFields((error, values) => {
				if (error) {
					return self.$message.error("表单填写不完整！")
				}
				this.uploading = true
				let params = Object.assign(this.taskInfo, this.filterForm.getFieldsValue())
				params.remark = this.addRemark(this.taskInfo.remark, 4, params.remark2)
				params.saveType = '01'
				api.triageApplyInfo(params).then(res => {
					if (res.status === 0) {
						this.$message.success("保存成功！")
					} else {
						this.$message.error(res.statusText)
					}
				}).finally(() => {
					this.uploading = false
				})
			})
		},
		submitForm () {
			let self = this
			if (this.has04) {
				if (!self.filterForm.getFieldValue('nextPiccStaffName') || self.filterForm.getFieldValue('nextPiccStaffName') === '') {
					if (!self.filterForm.getFieldValue('nextStaffName') || self.filterForm.getFieldValue('nextStaffName') === '') {
						return self.$message.error("陪诊管家和PICC陪诊管家不可同时为空！")
					} else {
						if (!self.filterForm.getFieldValue('nextStaffTel') || self.filterForm.getFieldValue('nextStaffTel') === '') {
							return self.$message.error("陪诊管家电话不可为空！")
						}
					}
				} else {
					if (self.filterForm.getFieldValue('nextStaffName') && self.filterForm.getFieldValue('nextStaffName') !== '') {
						return self.$message.error("PICC陪诊和第三方陪诊有且只能有一个！")
					}
				}
			}
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return self.$message.error("表单填写不完整！")
				}
				this.$confirm({
					title: '提示',
					content: '是否确认提交，提交后不可修改？',
					okType: 'danger',
					onOk () {
						return new Promise((resolve, reject) => {
							self.uploading1 = true
							let params = Object.assign(self.taskInfo, self.filterForm.getFieldsValue())
							params.remark = self.addRemark(self.taskInfo.remark, 4, params.remark2)
							params.saveType = '02'
							api.triageApplyInfo(params).then(res => {
								if (res.status === 0) {
									if (res.data.result === 1) {
										let serviceData = res.data.serviceApplication
										// 如果判断可以进入下一步，并且保存成功则进行跳转
										self.status = false
										if (serviceData.status === '05') {
											self.$message.success("提交成功! 此服务流程已结束！")
										}
										if (serviceData.status !== '05') {
											self.$message.success('保存成功! 即将进入下一步!') //
											// 处理短信
											let messageData = {
												taskInfo: self.taskInfo,
												serviceData: serviceData
											}
											self.$refs.massTextMessages.showForm(messageData)
											// self.$emit("stepNext", serviceData)
										}
										// // 处理短信信息
										// serviceData.lastStatus = '05'
										// serviceData.payDateStr = serviceData.payDate
										// serviceData.payDate = ""
										// let list = self.taskInfo
										// list.payDateStr = list.payDate
										// list.payDate = ""
										// let sendMess = {
										// 	allInfo: list,
										// 	newInfo: serviceData
										// }
										// serviceData.payDate = serviceData.payDateStr
										// delete sendMess.allInfo.updateTime
										// api.selectSMInfo(sendMess).then(res => {
										// 	let data = {
										// 		sendingInfo: res.data.sendingInfo,
										// 		serviceData: serviceData
										// 	}
										// 	self.$refs.massTextMessages.initForm(data)
										// }).finally(() => {
										// })
									} else {
										self.$message.error("服务实施内部存储失败!")
									}
								} else {
									self.$message.error(res.statusText)
								}
							}).finally(() => {
								self.uploading1 = false
								resolve()
							})
						})
					}
				})
			})
		},
		selectPiccStaff () {
			this.$refs.staffUserSelect.showPage()
		},
		showStaffUser (obj) {
			this.filterForm.setFieldsValue({
				nextPiccStaffNo: obj.staffNo,
				nextPiccStaffName: obj.staffName,
				nextPiccStaffMobile: obj.tel
			})
		},
		/**
       * 获取备注的调用方法
       * node 当前备注所在节点
       */
		getRemark (remarks, node) {
			if (!node) return "{}"
			if (!remarks) remarks = "{}"
			var key = this.getRemarkKey(node)
			var obj = JSON.parse(remarks)
			var remark = obj[key]
			if (remark) return remark
			return ""
		},
		/**
       * 添加备注的调用方法
       * remarks 备注字符的内容Json格式
       * node 当前备注所在节点
       * remark 当前节点的备注内容
       */
		addRemark (remarks, node, remark) {
			if (!remarks) remarks = "{}"
			var obj = JSON.parse(remarks)
			var key = this.getRemarkKey(node)
			obj[key] = remark
			return JSON.stringify(obj)
		},
		/**
       * 获取备注节点的key值
       * node 备注所在节点
       */
		getRemarkKey (node) {
			if (node === 1) {
				return '分诊阶段'
			} else if (node === 2) {
				return '预约阶段'
			} else if (node === 3) {
				return '陪诊阶段'
			} else if (node === 4) {
				return '次日就诊阶段'
			} else if (node === 5) {
				return '服务实施阶段'
			} else {
				return ''
			}
		},
		stepNext (serviceData) {
			if (serviceData.status === '00') {
				this.$refs.applyInfoForm.addForm()
			} else {
				this.$emit("stepNext", serviceData)
			}
		},
		closeForm () {
			this.$emit("on-update")
		}
	}
}
</script>
