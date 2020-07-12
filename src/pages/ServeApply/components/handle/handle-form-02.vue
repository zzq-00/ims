<template>
  <div>
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-card style="margin: 10px;">
        <a-divider orientation="left">
          <a-icon type="customer-service"/>
          服务信息
        </a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="来源">
              <a-input :disabled="true" v-decorator="['channelTypeDesc', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="申请的服务">
              <a-input :disabled="true" v-decorator="['serviceName', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider orientation="left">
          <a-icon type="user"/>
          使用人情况
        </a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="使用人姓名">
              <a-input :disabled="true" v-decorator="['patientName', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="性别">
              <a-input :disabled="true" v-decorator="['patientGenderDesc', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input :disabled="true" v-decorator="['patientCerttypeDesc', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :disabled="true" v-decorator="['patientCertno', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="出生日期">
              <a-input :disabled="true" v-decorator="['patientBirthDate', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :disabled="true" v-decorator="['patientTelephone', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider orientation="left">
          <a-icon type="user"/>
          联系人信息
        </a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="联系人姓名">
              <a-input :disabled="true" v-decorator="['linkmanName', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input :disabled="true" v-decorator="['linkmanCerttypeDesc', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :disabled="true" v-decorator="['linkmanCertno', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话">
              <a-input :disabled="true" v-decorator="['linkmanPhone', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">分诊信息</a-divider>
        <a-row>
          <a-col :span="12">
            <a-form-item label="主要疾病或症状" :labelCol="{span: 4}" :wrapperCol="{span: 16}">
              <a-input v-decorator="['disease', {rules: [{ required: true, message: '不能为空!',trigger: 'blur' }]}]" :disabled="status" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="具体描述" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea :disabled="status" v-decorator="['detailedDescription', {}]"
                          :autosize="{ minRows: 4, maxRows: 6 }"
                          placeholder="1.客户因为该疾病或症状去过哪些，什么科室就诊?什么诊断?2.本次服务预约希望解决的问题是什么?3.其他需要备注的信息"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :pull="1">
            <a-form-item label="医疗机构" :labelCol="{span: 3}" :wrapperCol="{span: 12}">
              <a-input-search :readOnly="true" :disabled="status"
                              v-decorator="['merchantName', {rules: [{ required: true, message: '医疗机构不能为空!' }]}]"
                              enter-button @search="onSearchSorg"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="期望医生" :labelCol="{span: 8}">
              <a-input :disabled="status" v-decorator="['resmedDoctorName', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否需要特需门诊">
              <DicSelect :disabled="status" dicType="YES_NO"
                         v-decorator="['specialFlag', {rules: [{ required: true, message: '不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否有所在地医保卡">
              <DicSelect :disabled="status" dicType="YES_NO"
                         v-decorator="['medicareFlag', {rules: [{ required: true, message: '不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="期望就诊时间">
              <DicSelect :disabled="status" dicType="RESMED_DATE_TYPE"
                         v-decorator="['resmedDateType', {rules: [{ required: true, message: '不能为空!' }]}]" @change="resmedDateTypeChange"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <!-- 期望就诊时间选定会出现不方便就诊时间可以点击指定就诊时间不可以点击，当期望就诊时间为空时不方便就怎时间不可以点击和指定就诊时间可以点击 -->
          <a-col :span="8" v-show="!contTypeflag">
            <a-form-item label="指定就诊时间" :labelCol="{span: 6}">
              <a-select v-decorator="['resmedDates']" v-model="resmedDates" mode="multiple" :minLength="2" :disabled="dataForm.getFieldsValue().resmedDateType === '1'||status" @blur="resmedDateCheck">
                <a-select-option v-for="item in applyDateList" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8" v-show="!contTypeflag">
            <a-form-item label="不方便就诊时间" :labelCol="{span: 7}">
              <!-- 指定就诊时间最少选择两项！ -->
              <a-select v-decorator="['notResmedDates']" v-model="notResmedDates"  mode="multiple" :maxLength="2" :disabled="dataForm.getFieldsValue().resmedDateType === '2'||status" @blur="notResmedDateCheck">
                <a-select-option v-for="item in applyDateList" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8" v-show="contTypeflag">
            <a-form-item label="健管中心预约时间">
              <a-select v-decorator="['jgResmedDates']" v-model="jgResmedDates" mode="default" :maxLength="1" :disabled="status">
                <a-select-option v-for="item in applyDateList" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="就诊卡号" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <a-input :disabled="status" v-decorator="['medredCardno', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :push="2" style="text-align:left;font-weight:bold;">
            <span>1）特需门诊挂号费在150-800元间，每个机构每个医生不同。2）儿研所只有特需门诊,儿童机构需要提前自行办理机构就诊卡</span>
          </a-col>
        </a-row>
        <a-row>
          <!-- :disabled="true" -->
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea :disabled="status" v-decorator="['remark', {}]" :autosize="{ minRows: 4, maxRows: 6 }"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <div style="margin: 0 0 10px 0">
      <a-button type="primary" :disabled ="status" :loading="submitLoading" @click="triageApplyInfo('01')">保存</a-button>
      <!-- 点击提交 更新服务预约申请表 -->
      <a-popconfirm title="是否确认提交，提交后不可修改" @confirm="triageApplyInfo('02')" ok-text="确认" cancel-text="取消">
        <a-button type="primary" :disabled ="status" :loading="submitLoading">提交</a-button>
      </a-popconfirm>

      <a-button type="" :disabled ="status" @click="cancelApplyInfo">撤销申请</a-button>
    </div>
    <SorgSelectModal ref="sorgSelectModal" @on-update="onSelectSorgHandle"/>
    <!-- 撤销申请 要进行短信发送的框 -->
    <MassTextMessageSingle ref="massTextMessageSingle" @on-update="closeForm"/>
    <MassTextMessages ref="massTextMessages" @on-update="stepNext"/>
    <ApplyInfoForm ref="applyInfoForm"/>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import apiconfig from '@/api/api-process-config'
import DicSelect from '@/components/dic-select'
import SorgSelectModal from '../sorg-select-modal'
import MassTextMessageSingle from '../../mass-text-message-single'
import MassTextMessages from '../../mass-text-messages'
import ApplyInfoForm from "../apply-info-form"
export default {
	name: "handle-form-02",
	components: {DicSelect, SorgSelectModal, MassTextMessageSingle, MassTextMessages, ApplyInfoForm},
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
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			dataForm: this.$form.createForm(this),
			status: false,
			resmedDates: [],
			notResmedDates: [],
			jgResmedDates: [],
			applyDateList: [], // 获取初始化时间
			contTypeflag: false,
			submitLoading: false
		}
	},
	mounted () {
		this.initLoad()
	},
	methods: {
		initLoad () {
			console.log('02页面数据', this.taskInfo)
			this.status = parseInt(this.taskInfo.status) > 2
			if (this.taskInfo.orgType === "04") {
				this.contTypeflag = true
				this.checkHinsService()
			} else {
				this.contTypeflag = false
			}
			if (this.taskInfo.status !== "02") {
				this.getApplyTrace()
			}
			this.$nextTick(() => {
				this.initValue(this.taskInfo)// 初始化页面值
			})
			this.loadApplyDateList()// 获取日期
		},
		initValue (data) {
			this.dataForm.setFieldsValue({
				channelTypeDesc: data.channelTypeDesc,
				serviceName: data.serviceName,
				patientName: data.patientName,
				patientGenderDesc: data.patientGenderDesc,
				patientCerttypeDesc: data.patientCerttypeDesc,
				patientCertno: data.patientCertno,
				patientBirthDate: data.patientBirthDate,
				patientTelephone: data.patientTelephone,
				linkmanName: data.linkmanName,
				linkmanCerttypeDesc: data.linkmanCerttypeDesc,
				linkmanCertno: data.linkmanCertno,
				linkmanPhone: data.linkmanPhone,
				disease: data.disease,
				detailedDescription: data.detailedDescription,
				merchantName: data.sorgName + data.deptName,
				resmedDoctorName: data.resmedDoctorName,
				specialFlag: data.specialFlag,
				medicareFlag: data.medicareFlag,
				resmedDateType: data.resmedDateType,
				medredCardno: data.medredCardno,
				remark: this.getRemark(data.remark, 1)// 1代表分诊阶段
			})
			if (this.contTypeflag) {
				this.dataForm.setFieldsValue({
					jgResmedDates: this.getAarray(data.jgResmedDates)
				})
			} else {
				this.dataForm.setFieldsValue({
					notResmedDates: this.getAarray(data.notResmedDates),
					resmedDates: this.getAarray(data.resmedDates)
				})
			}
		},
		onSearchSorg () {
			let params = {
				productName: this.taskInfo.productName,
				serviceName: this.taskInfo.serviceName,
				serviceCode: this.taskInfo.serviceCode,
				productCode: this.taskInfo.productCode
			}
			this.$refs.sorgSelectModal.show(params)
		},
		onSelectSorgHandle (item) {
			this.dataForm.setFieldsValue({
				merchantName: item.sorgName + item.deptName
			})
			// 预约节点改变医疗机构需要重新给数据驱动赋值，用于自建签约查询
			this.taskInfo.merchantcode = item.sorgCode
			this.taskInfo.deptName = item.deptName
			this.taskInfo.deptCode = item.deptCode
			this.taskInfo.sorgName = item.sorgName
			this.taskInfo.supplierCode = null
			this.taskInfo.supplierName = null
			// 判断是否需要推送健管中心
			if (item.orgType === "04") {
				this.checkHinsService()
			}
		},
		loadApplyDateList () {
			api.queryTime().then(res => {
				if (res.status === 0) {
					this.applyDateList = res.data.rows
				}
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
					this.$emit('on-update')
					// 撤销成功后执行短信提醒服务
					// this.$emit('stepNext',res.data)
					this.$refs.massTextMessageSingle.show(res.data)
				} else {
					this.$message.error("撤销失败!")
				}
			}).finally(() => {
			})
		},
		/*
    *该方法自需要在父组件使用就可以
    *来判断该节点是否已经是历史轨迹是则不能修改，不是可以执行服务分诊信息填写
    */
		getApplyTrace () {
			let {serviceReservationId} = this.taskInfo
			let params = {serviceReservationId, status: '02'}
			api.getApplyTrace(params).then(res => {
				// 获取该节点的轨迹进行页面回显
				if (res.status === 0) {
					this.initValue(res.data)
				}
			}).finally(() => {
			})
		},
		// 更新服务预约申请表
		triageApplyInfo (addType) {
			// if(addType=="02"){
			//   if (!confirm("是否确认提交，提交后不可修改")) return;
			// }
			let taskInfo = this.taskInfo
			// 非空校验
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return this.$message.error("表单填写不完整！")
				}
				let data = Object.assign({}, values)
				if (this.contTypeflag) {
					if (this.jgResmedDates && this.jgResmedDates.length > 0) {
					} else {
						return this.$message.error("健管中心预约时间不可为空！")
					}
				} else {
					if (data.resmedDates && data.resmedDates.length > 0) {
						if (data.resmedDates.length < 2) {
							return this.$message.error("指定就诊时间最少选择两项！")
						}
						data.resmedDates = data.resmedDates.join(',')
					} else {
						data.resmedDates = "无"
					}
					if (data.notResmedDates && data.notResmedDates.length > 0) {
						if (data.notResmedDates.length > 2) {
							return this.$message.error("不方便就诊时间最多选择两项！")
						}
						data.notResmedDates = data.notResmedDates.join(',')
					} else {
						data.notResmedDates = "无"
					}
				}
				data.saveType = addType
				const params = {
					disease: data.disease || taskInfo.disease,
					detailedDescription: data.detailedDescription || taskInfo.detailedDescription,
					merchantName: data.merchantName || taskInfo.merchantName,
					resmedDoctorName: data.resmedDoctorName || taskInfo.resmedDoctorName,
					specialFlag: data.specialFlag || taskInfo.specialFlag,
					medicareFlag: data.medicareFlag || taskInfo.medicareFlag,
					resmedDateType: data.resmedDateType || taskInfo.resmedDateType,
					medredCardno: data.medredCardno || taskInfo.medredCardno,
					merchantcode: data.merchantcode || taskInfo.merchantcode,
					sorgName: data.sorgName || taskInfo.sorgName,
					deptName: data.deptName || taskInfo.deptName,
					deptCode: data.deptCode || taskInfo.deptCode,
					sorgProvince: data.sorgProvince || taskInfo.sorgProvince,
					sorgCity: data.sorgCity || taskInfo.sorgCity,
					orgType: data.orgType || taskInfo.orgType,
					remark: this.addRemark(taskInfo.remark, 1, data.remark) || taskInfo.remark,
					resmedDates: data.resmedDates,
					notResmedDates: data.notResmedDates,
					cardNo: data.cardNo || taskInfo.cardNo,
					agreementNo: data.agreementNo || taskInfo.agreementNo,
					saveType: data.saveType || taskInfo.saveType,
					serviceCode: data.serviceCode || taskInfo.serviceCode,
					serviceReservationId: data.serviceReservationId || taskInfo.serviceReservationId
				}
				api.triageApplyInfo(params).then(res => {
					if (res.status === 0) {
						if (res.data.result === 1) {
							let serviceData = res.data.serviceApplication
							if (addType === '02') {
								this.status = true// 全部预约处于不可编辑状态
								serviceData.lastStatus = "02"
								if (serviceData.status === '03') {
									this.$message.success('保存成功! 即将进入下一步!') // .nextStatus[0] status
									// 处理短信
									let messageData = {
										taskInfo: taskInfo,
										serviceData: serviceData
									}
									this.$refs.massTextMessages.showForm(messageData)
								}
								// this.$refs.massTextMessageSingle.show(res.data);
								// 短信模板发送开始 未找到
								// var sendMess={};
								// sendMess.allInfo=list;
								// sendMess.newInfo=serviceData;
								// var molibeMesInfo = selectSMInfo(sendMess);//selectSMInfo
								// window.parent.updateSubPage(serviceData);
								// if(molibeMesInfo!=null&&molibeMesInfo!=""){
								//   window.parent.showMessM(molibeMesInfo);
								// }else{
								// window.parent.nextLoadingPages(serviceData.status,serviceData.workQueueId);//进入下一个页面
								// }
								if (serviceData.status !== '00') {
									this.checkOrder(serviceData.workQueueId)
								}
							} else {
								this.$message.success('保存成功!')
							}
						} else {
							this.$message.error('添加失败!')
						}
					}
				}).finally(() => {
					// this.submitLoading = false
				})
			})
		},
		// 判断是否需要推送健管中心
		checkHinsService () {
			let params = {"serviceCode": this.taskInfo.serviceCode}
			api.checkHinsService(params).then(res => {
				// console.log('res',res)
				this.contTypeflag = res.data.flag
				if (res.data.flag) {
					this.getHinsWorkPlan()// 获取健管中心排班日期
				}
			}).finally(() => {
			})
		},
		// 获取健管中心排班日期
		getHinsWorkPlan () {
			let params = {
				serviceCode: this.taskInfo.serviceCode,
				merchantCode: this.taskInfo.merchantcode
			}
			api.getHinsWorkPlan(params).then(res => {
				if (res.status === 0) {
					this.applyDateList = res.data
				}
			}).finally(() => {
			})
		},
		// 判断当前用户是否属于该队列 不应该把该接口放在服务分诊里 发短信时进行验证
		checkOrder (queueID) {
			// queueID 如何获取
			let flag = false
			let params = {queueID}
			apiconfig.checkOrder(params).then(res => {
				if (res.status === 0) {
					flag = res.data
				}
			}).finally(() => {
			})
			return flag
		},
		/**
     * 处理时间字符串转换成数组
     * data 当前备注所在节点
     */
		getAarray (data) {
			let str = []
			if (data && typeof data === "string") {
				if (data === '无') {
					str = ''
				} else {
					str = data.split(',')
				}
			}
			return str
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
				return '服务实施阶段'
			} else {
				return ''
			}
		},
		resmedDateTypeChange () {
			this.dataForm.setFieldsValue({resmedDates: undefined, notResmedDates: undefined})
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
		},
		resmedDateCheck (record) {
			if (record.length < 2) {
				return this.$message.error("指定就诊时间最少选择两项！")
			}
		},
		notResmedDateCheck (record) {
			if (record.length > 2) {
				return this.$message.error("不方便就诊时间最多选择两项！")
			}
		}
	},
	watch: {
		taskInfo: {
			handler (newName, oldName) {
				this.initLoad()
			},
			// immediate: true,
			deep: true
		}
	}
}
</script>
