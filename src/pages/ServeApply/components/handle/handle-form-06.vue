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
        <a-divider orientation="left">备注信息</a-divider>
        <a-row>
          <a-col :span="24">
            <a-form-item label="分诊阶段" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea  :disabled="true" :value="getRemark(taskInfo.remark, 1)"  :autoSize="{ minRows: 2, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-col :span="24">
          <a-form-item label="预约阶段" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
            <a-textarea  :disabled="true" :value="getRemark(taskInfo.remark, 2)" :autoSize="{ minRows: 2, maxRows: 6 }" />
          </a-form-item>
        </a-col>
      <a-col :span="24">
        <a-form-item label="陪诊阶段" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
          <a-textarea  :disabled="true" :value="getRemark(taskInfo.remark, 3)" :autoSize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
      </a-col>
    </a-card>
    <a-card style="margin: 24px;">
      <a-divider orientation="left">预约信息</a-divider>
      <a-row>
        <a-col :span="12">
          <a-form-item label="供应商" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
            <a-input :disabled="true" :value="taskInfo.supplierName"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-form-item label="医疗机构">
            <a-input  :value="taskInfo.sorgName" :disabled="true" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="期望预约医生">
            <a-input  :value="taskInfo.resmedDoctorName" :disabled="true" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="预约就诊时间">
            <a-input  :value="taskInfo.payDate" :disabled="true" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="margin: 24px;">
      <a-divider orientation="left">服务实施结果信息</a-divider>
      <a-row>
        <a-col :span="6">
          <a-form-item label="实施机构">
            <DicSelect :disabled="!status" dicType="ORG_DEPT" @change="changeOrg" v-decorator="['implementOrg', {initialValue: '', rules: [{ required: true, message: '不能为空!' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="实施时间">
            <a-date-picker :disabled="!status" show-time format="YYYY-MM-DD HH:mm" :disabled-date="disabledDate"  v-decorator="['serviceTime', {initialValue: null,rules: [{ required: true, message: '不能为空!' }]}]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-show="filterForm.getFieldValue('implementOrg')==='01'||filterForm.getFieldValue('implementOrg')==='03'">
        <a-col :span="12">
            <a-form-item :label="filterForm.getFieldValue('implementOrg')==='01'?'健管中心':'VIP诊疗室'"  :labelCol="{span: 4}" :wrapperCol="{span: 20}" >
                <a-input-search :disabled="!status" v-decorator="['hibmName', {rules: [{ required: hibmStatus, message: '不能为空!' }]}]" enter-button @search="selectOrg" />
                <a-input v-show="false" v-decorator="['hibmCode']"/>
              </a-form-item>
        </a-col>
        <a-col :span="0">
          <a-input v-decorator="['hibmCode']"/>
        </a-col>
    </a-row>
      <a-row>
        <a-col :span="6">
          <a-form-item label="管家评价">
            <a-input-number :disabled="!status" :min="0" :max="15" v-decorator="['staffApprise']" placeholder="评价（0-15分）"/>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="联系客户时间">
            <a-date-picker :disabled="!status" format="YYYY-MM-DD"  v-decorator="['connTime', {initialValue:null, rules: [{ required: true, message: '不能为空!' }]}]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-form-item label="申请的服务">
            <a-input :value="taskInfo.serviceName" :disabled="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="服务价格">
            <a-input :value="taskInfo.price" :disabled="true"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-form-item label="医生姓名">
            <a-input :disabled="!status" v-decorator="['doctorName']"/>
            <!--<a-input :disabled="!status" v-decorator="['actualDoctorName']"/>-->
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="医生职称">
            <DicSelect :disabled="!status" dicType="DOCTOR_TITLE_CODE" v-decorator="['doctorTitleCode', {initialValue: ''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <div style="float: right; margin: 0 10px 10px 0">
            <a-button type="primary"  v-show="status" :loading="uploading" @click="submitForm">提交</a-button>
            <a-button type="" v-show ="btnShow" :disabled="false" @click="cancelApplyInfo">撤销申请</a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-card v-show="staffStatus">
      <a-row>
        <a-col :span="6">
          <a-form-item label="陪诊人姓名">
            <a-input :disabled="!status" v-decorator="['staffName', {initialValue:''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="陪诊人电话">
            <a-input :disabled="!status" v-decorator="['staffTel', {initialValue:''}]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
		  <a-col :span="6" v-show="false">
			  <a-form-item label="PICC陪诊人工号">
				  <a-input :disabled="true" v-decorator="['piccStaffNo', {initialValue:''}]" />
			  </a-form-item>
		  </a-col>
        <a-col :span="6">
          <a-form-item label="PICC陪诊人姓名">
            <a-input :disabled="true" v-decorator="['piccStaffName', {initialValue:''}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="PICC陪诊人电话">
            <a-input-search :disabled="!status" v-decorator="['piccStaffMobile', {initialValue:''}]" enter-button @search="selectPiccStaff" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <span style="color: red;font-weight: bold;">管家请注意！如果是管家陪诊，请务必选择PICC陪诊填写陪诊信息，否则陪诊绩效不会被计入。</span>
        </a-col>
      </a-row>
    </a-card>
    </a-form>
    <!-- 撤销申请 要进行短信发送的框 -->
    <MassTextMessageSingle ref="massTextMessageSingle" @on-update="closeForm"/>
    <OrgSelectModal ref="orgSelectModal" @on-update="selectOrgHandle"/>
    <StaffUserSelect ref="staffUserSelect" @on-update="showStaffUser"/>
    <MassTextMessages ref="massTextMessages" @on-update="stepNext"/>
    <ApplyInfoForm ref="applyInfoForm" />
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
import MassTextMessageSingle from '../../mass-text-message-single'
import OrgSelectModal from '@/pages/ProcessConfig/components/org-select-modal'
import StaffUserSelect from '@/pages/ServeApply/components/staff-user-select-modal'
import MassTextMessages from '../../mass-text-messages'
import ApplyInfoForm from "../apply-info-form"
import moment from 'moment'

export default {
	components: {DicSelect, MassTextMessageSingle, OrgSelectModal, StaffUserSelect, MassTextMessages, ApplyInfoForm},
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
				labelCol: {span: 8},
				wrapperCol: {span: 16}
			},
			status: false, // 是否可点击 控制实施的全局
			filterForm: this.$form.createForm(this),
			hibmStatus: false,
			staffStatus: false,
			uploading: false,
			btnShow: false
		}
	},
	watch: {
		taskInfo: {
			// immediate: true,
			deep: true,
			handler (newVal, oldVal) {
				this.initLoad()
			}
		}
	},
	mounted () {
		this.initLoad()
	},
	methods: {
		moment,
		initLoad () {
			console.log('06页面数据', this.taskInfo)
			// 健管中心的单子该页面只显示 撤销申请，所以需要将status拆出一个btnShow用于控制展示
			this.btnShow = this.status = parseInt(this.taskInfo.status) === 6// 判断是否已过了该步骤
			api.getPayDate({serviceReservationId: this.taskInfo.serviceReservationId}).then(res => {
				// 字符串获取到携带秒，通过日期转换去除秒，再转为字符串
				let tDate = moment(res.data.payDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
				this.taskInfo.payDate = tDate === 'Invalid date' ? null : tDate
			})
			let connTime = moment(this.taskInfo.applyTime, 'YYYY-MM-DD')
			let serviceTime = this.taskInfo.payDate === null ? null : moment(this.taskInfo.payDate, 'YYYY-MM-DD HH:mm')
			// 判断如果是健管中心预约，该页面全部置灰，仅留撤销
			this.checkHinsService06()
			this.filterForm.setFieldsValue({
				connTime: connTime,
				serviceTime: serviceTime,
				staffName: this.taskInfo.nextStaffName || this.taskInfo.staffName,
				staffTel: this.taskInfo.nextStaffTel || this.taskInfo.staffTel,
				piccStaffNo: this.taskInfo.nextPiccStaffNo || this.taskInfo.piccStaffNo,
				piccStaffName: this.taskInfo.nextPiccStaffName || this.taskInfo.piccStaffName,
				piccStaffMobile: this.taskInfo.nextPiccStaffMobile || this.taskInfo.piccStaffMobile
			})
			// 判断该服务配置是否跳过陪诊
			api.checkSerFlow({serviceCode: this.taskInfo.serviceCode}).then(res => {
				this.staffStatus = (res.data === '04')
			})
			let params = {
				orderNo: this.taskInfo.orderNo
			}
			api.queryResult(params).then(res => {
				if (res.status === 0 && res.data.imResultBo) {
					this.$nextTick(() => {
						this.taskInfo.implementOrg = res.data.imResultBo.implementOrg
						this.taskInfo.doctorName = res.data.imResultBo.doctorName
						this.taskInfo.doctorTitleCode = res.data.imResultBo.doctorTitleCode
						this.taskInfo.hibmName = res.data.imResultBo.hibmName
						this.taskInfo.hibmCode = res.data.imResultBo.hibmCode
						this.filterForm.setFieldsValue({
							implementOrg: this.taskInfo.implementOrg,
							doctorName: this.taskInfo.doctorName,
							doctorTitleCode: this.taskInfo.doctorTitleCode,
							hibmName: this.taskInfo.hibmName,
							hibmCode: this.taskInfo.hibmCode,
							staffName: res.data.imResultBo.staffName,
							staffTel: res.data.imResultBo.staffTel,
							piccStaffNo: res.data.imResultBo.piccStaffNo,
							piccStaffName: res.data.imResultBo.piccStaffName,
							piccStaffMobile: res.data.imResultBo.piccStaffTel,
							serviceTime: moment(res.data.imResultBo.serviceTime, 'YYYY-MM-DD HH:mm'),
							connTime: moment(res.data.imResultBo.connTime, 'YYYY-MM-DD'),
							staffApprise: res.data.imResultBo.staffApprise
						})
					})
				}
			}).finally(() => {
			})
		},
		// 判断是否需要推送健管中心
		checkHinsService06 () {
			let params = {"serviceCode": this.taskInfo.serviceCode}
			api.checkHinsService(params).then(res => {
				if (res.data.flag) {
					this.status = !res.data.flag // 若是健管中心则给status赋值取反，将控件设置不可用
				}
			})
		},
		selectOrg () {
			this.$refs.orgSelectModal.show()
		},
		selectOrgHandle (obj) {
			this.filterForm.setFieldsValue({
				hibmName: obj.sorgName,
				hibmCode: obj.sorgCode
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
		submitForm () {
			let self = this
			if (this.staffStatus) {
				if (!self.filterForm.getFieldValue('piccStaffName') || self.filterForm.getFieldValue('piccStaffName') === '') {
					if (!self.filterForm.getFieldValue('staffName') || self.filterForm.getFieldValue('staffName') === '') {
						return self.$message.error("陪诊管家和PICC陪诊管家不可同时为空！")
					} else {
						if (!self.filterForm.getFieldValue('staffTel') || self.filterForm.getFieldValue('staffTel') === '') {
							return self.$message.error("陪诊管家电话不可为空！")
						}
					}
				} else {
					if (self.filterForm.getFieldValue('staffName') && self.filterForm.getFieldValue('staffName') !== '') {
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
				let serviceTime = moment(params.serviceTime).format('YYYY-MM-DD HH:mm')
				delete params.serviceTime
				params.serviceTime = serviceTime
				params.serviceTimeStr = serviceTime
				params.saveType = '02'
				params.consumeNo = this.taskInfo.orderNo
				params.implementOrg = this.filterForm.getFieldValue('implementOrg')
				params.hibmCode = this.filterForm.getFieldValue('hibmCode')
				params.hibmName = this.filterForm.getFieldValue('hibmName')
				params.serviceTime = this.filterForm.getFieldValue('serviceTime')
				params.staffApprise = this.filterForm.getFieldValue('staffApprise')
				params.connTime = this.filterForm.getFieldValue('connTime')
				params.doctorName = this.filterForm.getFieldValue('doctorName')
				params.doctorTitleCode = this.filterForm.getFieldValue('doctorTitleCode')
				params.applyTime = moment(params.applyTime).format('YYYY-MM-DD HH:mm')
				params.updateTime = moment(params.updateTime).format('YYYY-MM-DD HH:mm')
				params.serviceTimeStr = moment(params.serviceTimeStr).format('YYYY-MM-DD HH:mm')
				params.serviceTime = moment(params.serviceTime).format('YYYY-MM-DD HH:mm')
				// 补充管家信息
				params.staffName = this.filterForm.getFieldValue('staffName')
				params.staffTel = this.filterForm.getFieldValue('staffTel')
				params.piccStaffName = this.filterForm.getFieldValue('piccStaffName')
				params.piccStaffNo = this.filterForm.getFieldValue('piccStaffNo')
				params.piccStaffTel = this.filterForm.getFieldValue('piccStaffMobile')
				api.addImplementInfo(params).then(res => {
					if (res.status === 0) {
						if (res.data.result === 1) {
							let serviceData = res.data.serviceApplication
							// 如果判断可以进入下一步，并且保存成功则进行跳转
							this.status = false
							if (serviceData.status === '06') {
								this.$message.success("提交成功! 此服务流程已结束！")
							}
							if (serviceData.status !== '06') {
								this.$message.success('提交成功!') // 服务实施完成
								// 处理短信
								let messageData = {
									taskInfo: this.taskInfo,
									serviceData: serviceData
								}
								this.$refs.massTextMessages.showForm(messageData)
								// this.$emit("stepNext", serviceData)
							}
						} else {
							this.$message.error("服务实施内部存储失败!")
						}
					} else {
						this.$message.error(res.statusText)
					}
				}).finally(() => {
					this.uploading = false
				})
			})
		},
		changeOrg (e) {
			this.filterForm.setFieldsValue({hibmCode: '', hibmName: ''})
			this.hibmStatus = (e === '01' || e === '03')
		},
		disabledDate (serviceTime) {
			const date = new Date()
			if (!serviceTime || !date) {
				return false
			}
			return serviceTime.valueOf() > moment(new Date(), 'YYYY-MM-DD HH:mm')
		},
		selectPiccStaff () {
			this.$refs.staffUserSelect.showPage()
		},
		showStaffUser (obj) {
			this.filterForm.setFieldsValue({
				piccStaffNo: obj.staffNo,
				piccStaffName: obj.staffName,
				piccStaffMobile: obj.tel
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
				serviceData.close = true
				this.$emit("stepNext", serviceData)
			}
		},
		closeForm () {
			this.$emit("on-update")
		}
	}
}
</script>
