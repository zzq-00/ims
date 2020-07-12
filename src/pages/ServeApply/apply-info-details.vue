<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
      <a-spin :spinning="loading"/>
      <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-card v-if="showCard('01')">
          <a-divider orientation="left"><a-icon type="customer-service" /> 服务信息</a-divider>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="申请的服务">
                  <a-input :value="getServiceTrack('01').serviceName" :disabled="true" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="卡号">
                  <a-input :value="getServiceTrack('01').cardNo"  :disabled="true" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="来源">
                  <a-input :value="getServiceTrack('01').channelTypeDesc"  :disabled="true" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="产品信息">
                  <a-input :value="getServiceTrack('01').productName"  :disabled="true" />
                </a-form-item>
              </a-col>
            </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('01')">
          <a-divider orientation="left"><a-icon type="user" /> 持卡人信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="持卡人姓名">
                <a-input :value="getServiceTrack('01').applyName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="证件号码">
                <a-input :value="getServiceTrack('01').applyCertno"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="手机号码">
                <a-input :value="getServiceTrack('01').applyTel"  :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('01')">
          <a-divider orientation="left"><a-icon type="user" /> 使用人情况</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="使用人姓名">
                <a-input :value="getServiceTrack('01').patientName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="性别">
                <a-input :value="getServiceTrack('01').patientGenderDesc"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="证件类型">
                <a-input :value="getServiceTrack('01').patientCerttypeDesc"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="证件号码">
                <a-input :value="getServiceTrack('01').patientCertno"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="出生日期">
                <a-input :value="getServiceTrack('01').patientBirthDate"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="手机号码">
                <a-input :value="getServiceTrack('01').patientTelephone"  :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('01')">
          <a-divider orientation="left"><a-icon type="user" /> 联系人信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="联系人姓名">
                <a-input :value="getServiceTrack('01').linkmanName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="证件类型">
                <a-input :value="getServiceTrack('01').linkmanCerttypeDesc"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="证件号码">
                <a-input :value="getServiceTrack('01').linkmanCertno"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="联系电话">
                <a-input :value="getServiceTrack('01').linkmanPhone"  :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('01')">
          <a-divider orientation="left"><a-icon type="form" /> 申请信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="主要疾病或症状">
                <a-input :value="getServiceTrack('01').disease" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="具体描述">
                <a-input :value="getServiceTrack('01').detailedDescription"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="医疗机构">
                <a-input :value="getServiceTrack('01').sorgName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="科室">
                <a-input :value="getServiceTrack('01').deptName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="就诊卡号">
                <a-input :value="getServiceTrack('01').medredCardno"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="期望医生">
                <a-input :value="getServiceTrack('01').resmedDoctorName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在省">
                <a-input :value="getServiceTrack('01').sorgProvinceName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在市">
                <a-input :value="getServiceTrack('01').sorgCityName"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="是否有所在地医保">
                <a-input :value="chgValue(getServiceTrack('01').medicareFlag)"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="是否需要特需门诊">
                <a-input :value="chgValue(getServiceTrack('01').specialFlag)"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="期望就诊时间">
                <a-input :value="getServiceTrack('01').resmedDateTypeDesc"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="指定日期">
                <a-input :value="getServiceTrack('01').resmedDates"  :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="不方便就诊时间">
                <a-input :value="getServiceTrack('01').notResmedDates"  :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('02')">
          <a-divider orientation="left"><a-icon type="schedule" /> 分诊信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="主要疾病或症状">
                <a-input :value="getServiceTrack('02').disease" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="具体描述">
                <a-input :value="getServiceTrack('02').detailedDescription" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="医疗机构">
                <a-input :value="getServiceTrack('02').sorgName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="科室">
                <a-input :value="getServiceTrack('02').deptName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="就诊卡号">
                <a-input :value="getServiceTrack('02').medredCardno" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="期望医生">
                <a-input :value="getServiceTrack('02').resmedDoctorName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在省">
                <a-input :value="getServiceTrack('02').sorgProvinceName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在市">
                <a-input :value="getServiceTrack('02').sorgCityName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="是否有所在地医保">
                <a-input :value="chgValue(getServiceTrack('02').medicareFlag)" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="是否需要特需门诊">
                <a-input :value="chgValue(getServiceTrack('02').specialFlag)" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="期望就诊时间">
                <a-input :value="getServiceTrack('02').resmedDateTypeDesc" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="指定日期">
                <a-input :value="getServiceTrack('02').resmedDates" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="不方便就诊时间">
                <a-input :value="getServiceTrack('02').notResmedDates" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="备注">
                <a-input :value="getRemark(getServiceTrack('02').remark,'02')" :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('03')">
          <a-divider orientation="left"><a-icon type="schedule" /> 预约信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="医疗机构">
                <a-input :value="getServiceTrack('03').sorgName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="预约科室">
                <a-input :value="getServiceTrack('03').deptName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="期望医生">
                <a-input :value="getServiceTrack('03').resmedDoctorName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="预约就诊时间">
                <a-input :value="getServiceTrack('03').payDate" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="就诊卡号">
                <a-input :value="getServiceTrack('03').medredCardno" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="是否需要特需门诊">
                <a-input :value="chgValue(getServiceTrack('03').specialFlag)" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="备注">
                <a-input :value="getRemark(getServiceTrack('03').remark,'03')" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6" v-if="show3rdFlag">
              <a-form-item label="第三方签约机构">
                <a-input :value="getServiceTrack('03').supplierName" :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('04')">
          <a-divider orientation="left"><a-icon type="schedule" /> 陪诊信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="医疗机构">
                <a-input :value="getServiceTrack('04').sorgName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在省">
                <a-input :value="getServiceTrack('04').sorgProvinceName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在市">
                <a-input :value="getServiceTrack('04').sorgCityName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="陪诊人姓名">
                <a-input :value="getServiceTrack('04').staffName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="陪诊人电话">
                <a-input :value="getServiceTrack('04').staffTel" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="PICC陪诊人姓名">
                <a-input :value="getServiceTrack('04').piccStaffName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="PICC陪诊人电话">
                <a-input :value="getServiceTrack('04').nextPiccStaffMobile" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6" v-if="show3rdFlag">
              <a-form-item label="第三方签约机构">
                <a-input :value="getServiceTrack('04').supplierName" :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('05')">
          <a-divider orientation="left"><a-icon type="solution" /> 次日就诊信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="医疗机构">
                <a-input :value="getServiceTrack('05').sorgName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在省">
                <a-input :value="getServiceTrack('05').sorgProvinceName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在市">
                <a-input :value="getServiceTrack('05').sorgCityName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="陪诊人姓名">
                <a-input :value="getServiceTrack('05').nextStaffName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="陪诊人电话">
                <a-input :value="getServiceTrack('05').nextStaffTel" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="PICC陪诊人姓名">
                <a-input :value="getServiceTrack('05').nextPiccStaffName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="PICC陪诊人电话">
                <a-input :value="getServiceTrack('05').nextPiccStaffMobile" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6" v-if="show3rdFlag">
              <a-form-item label="第三方签约机构">
                <a-input :value="getServiceTrack('05').supplierName" :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="showCard('06')">
          <a-divider orientation="left"><a-icon type="check-circle" /> 实施信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="医疗机构">
                <a-input :value="getServiceTrack('06').sorgName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="预约科室">
                <a-input :value="getServiceTrack('06').deptName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="预约医生">
                <a-input :value="getServiceTrack('06').resmedDoctorName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="就诊医生">
                <a-input :value="getServiceTrack('06').actualDoctorName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在省">
                <a-input :value="getServiceTrack('06').sorgProvinceName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在市">
                <a-input :value="getServiceTrack('06').sorgCityName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="就诊时间">
                <a-input :value="getServiceTrack('06').consumeDate" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6" v-if="show3rdFlag">
              <a-form-item label="第三方签约机构">
                <a-input :value="getServiceTrack('06').supplierName" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="备注">
                <a-input :value="getRemark(getServiceTrack('06').remark,'06')" :disabled="true" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card style="margin-top:20px" v-if="false">
          <a-divider orientation="left"><a-icon type="check-circle" /> 疑难工单信息</a-divider>
        </a-card>

        <a-card style="margin-top:20px" v-if="false">
          <a-divider orientation="left"><a-icon type="check-circle" /> 回访内容</a-divider>

        </a-card>
        <ReportModal v-if="showCard('11')" :taskInfo="extraParams" />
        <QuestionModal v-if="showCard('08')" :taskInfo="extraParams" />
      </a-form>

      <div slot="footer">
				<a-button type="" @click="formModal=false">关闭</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/api-serve-apply"
import QuestionModal from '@/pages/ServeApply/components/apply-question-modal'
import ReportModal from '@/pages/ServeApply/components/apply-report-modal'
export default {
	name: "apply-info-details",
	components: {QuestionModal, ReportModal},
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			dataForm: this.$form.createForm(this),
			modalWidth: 1270,
			modalTitle: '',
			formModal: false,
			loading: false,
			extraParams: null,
			serviceReservationId: null,
			serviceTrackList: [],
			show3rdFlag: false,
			taskInfo: {}
		}
	},
	methods: {
		showCard (status) {
			return this.serviceTrackList.find(item => item.status === status)
		},
		getServiceTrack (status) {
			return this.serviceTrackList.find(item => item.status === status) || {}
		},

		// remark 特殊处理
		getRemark (premark, node) {
			if (!node) return "{}"
			if (!premark) premark = "{}"
			let key = this.getRemarkKey(node)
			var obj = JSON.parse(premark)
			return key in obj ? obj[key] : null
		},
		/**
     * 获取备注节点的key值
     * node 备注所在节点
     */
		getRemarkKey (node) {
			if (node === '02') {
				return '分诊阶段'
			} else if (node === '03') {
				return '预约阶段'
			} else if (node === '04') {
				return '陪诊阶段'
			} else if (node === '06') {
				return '服务实施阶段'
			} else {
				return ''
			}
		},

		/**
     * 字段转换
     * @param obj
     */
		chgValue (oldValue) {
		  if (!oldValue) {
		    return oldValue
			}
			if (oldValue === 'Y') {
				return '是'
			}
			if (oldValue === 'N') {
				return '否'
			}
			return oldValue
		},


		show (obj) {
			this.dataForm.resetFields()// 清除form
			this.extraParams = obj || {}
			this.serviceReservationId = obj.serviceReservationId
			this.modalTitle = '服务明细查询'
      		this.formModal = true
			this.loadServiceTrackList()
		},
		loadServiceTrackList () {
			if (!this.serviceReservationId) return
			let params = {
				serviceReservationId: this.serviceReservationId
			}
			this.loading = true
			api.queryServiceTrack(params).then(res => {
				this.serviceTrackList = res.data.serviceTrackList || []
				this.show3rdFlag = res.data.flag
			}).finally(() => {
				this.loading = false
			})
		}
	}
}
</script>

