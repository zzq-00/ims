<template>
    <a-form :form="filterForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-card style="margin: 24px;">
            <a-divider orientation="left">服务信息</a-divider>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="申请服务">
                        <a-input :value="taskInfo.serviceName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="卡号">
                        <a-input :value="taskInfo.cardNo" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="来源">
                        <a-input :value="taskInfo.channelTypeDesc" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="产品信息">
                        <a-input :value="taskInfo.productName" :disabled="true" />
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
                        <a-input :value="taskInfo.linkmanName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="证件类型">
                        <a-input :value="taskInfo.linkmanCerttypeDesc" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="证件号码">
                        <a-input :value="taskInfo.linkmanCertno" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="手机号码">
                        <a-input :value="taskInfo.linkmanPhone" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
        <a-card v-if="statusMap['01']" style="margin: 24px;">
            <a-divider orientation="left">申请信息</a-divider>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="主要疾病或症状" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                        <a-input :disabled="true" :value="taskInfo.disease" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="具体描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                        <a-textarea :disabled="true" :value="taskInfo.detailedDescription"
                            :autoSize="{ minRows: 1, maxRows: 6 }" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="医疗机构">
                        <a-input :value="taskInfo.sorgName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="科室">
                        <a-input :value="taskInfo.deptName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="就诊卡号">
                        <a-input :value="taskInfo.medredCardno" :disabled="true" />
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
                    <a-form-item label="所在省">
                        <a-input :value="taskInfo.sorgProvinceName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="所在市">
                        <a-input :value="taskInfo.sorgCityName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="是否有所在地医保">
                        <DicSelect dicType="YES_NO" :disabled="true"
                            v-decorator="['medicareFlag', {initialValue: taskInfo.medicareFlag || ''}]" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="是否需要特需门诊">
                        <DicSelect dicType="YES_NO" :disabled="true"
                            v-decorator="['specialFlag', {initialValue:taskInfo.specialFlag || ''}]" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="期望就诊时间">
                        <a-input :value="taskInfo.resmedDateTypeDesc" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="指定日期">
                        <a-input :value="taskInfo.resmedDates" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="不方便就诊时间">
                        <a-input :value="taskInfo.notResmedDates" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
        <a-card v-if="statusMap['02']" style="margin: 24px;">
            <a-divider orientation="left">分诊信息</a-divider>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="主要疾病或症状" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                        <a-input :disabled="true" :value="taskInfo.disease" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="具体描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                        <a-textarea :disabled="true" :value="taskInfo.detailedDescription"
                            :autoSize="{ minRows: 1, maxRows: 6 }" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="医疗机构">
                        <a-input :value="taskInfo.sorgName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="科室">
                        <a-input :value="taskInfo.deptName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="就诊卡号">
                        <a-input :value="taskInfo.medredCardno" :disabled="true" />
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
                    <a-form-item label="所在省">
                        <a-input :value="taskInfo.sorgProvinceName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="所在市">
                        <a-input :value="taskInfo.sorgCityName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="是否有所在地医保">
                        <DicSelect dicType="YES_NO" :disabled="true"
                            v-decorator="['medicareFlag', {initialValue: taskInfo.medicareFlag || ''}]" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="是否需要特需门诊">
                        <DicSelect dicType="YES_NO" :disabled="true"
                            v-decorator="['specialFlag', {initialValue:taskInfo.specialFlag || ''}]" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="期望就诊时间">
                        <a-input :value="taskInfo.resmedDateTypeDesc" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="指定日期">
                        <a-input :value="taskInfo.resmedDates" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="不方便就诊时间">
                        <a-input :value="taskInfo.notResmedDates" :disabled="true" />
                    </a-form-item>
                </a-col>
<!--                <a-col v-if="this.threeOrgshow && taskInfo.supplierName" :span="6">-->
<!--                    <a-form-item label="第三方签约机构"  class="form-item-label-long">-->
<!--                        <a-input :value="taskInfo.supplierName" :disabled="true" />-->
<!--                    </a-form-item>-->
<!--                </a-col>-->
                <a-col :span="6">
                    <a-form-item label="备注">
                        <a-input :disabled="true" :value="getRemark(taskInfo.remark, 1)" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
        <a-card v-if="statusMap['03']" style="margin: 24px;">
            <a-divider orientation="left">预约信息</a-divider>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="医疗机构">
                        <a-input :value="taskInfo.sorgName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="预约科室">
                        <a-input :value="taskInfo.deptName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="期望医生">
                        <a-input :value="taskInfo.resmedDoctorName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="预约就诊时间">
                        <a-input :value="taskInfo.payDate" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="就诊卡号">
                        <a-input :value="taskInfo.medredCardno" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="是否需要特需门诊">
                        <DicSelect dicType="YES_NO" :disabled="true"
                            v-decorator="['specialFlag', {initialValue:taskInfo.specialFlag || ''}]" />
                    </a-form-item>
                </a-col>
                <a-col v-if="this.threeOrgshow && taskInfo.supplierName" :span="6">
                    <a-form-item label="第三方签约机构" class="form-item-label-long">
                        <a-input :value="taskInfo.supplierName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="备注">
                        <a-input :value="getRemark(taskInfo.remark, 2)" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
        <a-card v-if="statusMap['04']" style="margin: 24px;">
            <a-divider orientation="left">陪诊信息</a-divider>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="医疗机构">
                        <a-input :value="taskInfo.sorgName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="所在省">
                        <a-input :value="taskInfo.sorgProvinceName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="所在市">
                        <a-input :value="taskInfo.sorgCityName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="陪诊人姓名">
                        <a-input :value="taskInfo.staffName" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="陪诊人电话">
                        <a-input :value="taskInfo.staffTel" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="PICC陪诊人姓名">
                        <a-input :value="taskInfo.piccStaffName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="PICC陪诊人电话">
                        <a-input :value="taskInfo.piccStaffMobile" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col v-if="this.threeOrgshow && taskInfo.supplierName" :span="6">
                    <a-form-item label="第三方签约机构" class="form-item-label-long">
                        <a-input :value="taskInfo.supplierName" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
        <a-card v-if="statusMap['05']" style="margin: 24px;">
            <a-divider orientation="left">次日就诊信息</a-divider>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="医疗机构">
                        <a-input :value="taskInfo.sorgName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="所在省">
                        <a-input :value="taskInfo.sorgProvinceName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="所在市">
                        <a-input :value="taskInfo.sorgCityName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="陪诊人姓名">
                        <a-input :value="taskInfo.nextStaffName" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="陪诊人电话">
                        <a-input :value="taskInfo.nextStaffTel" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="PICC陪诊人姓名">
                        <a-input :value="taskInfo.nextPiccStaffName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="PICC陪诊人电话">
                        <a-input :value="taskInfo.nextPiccStaffMobile" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col  v-if="this.threeOrgshow && taskInfo.supplierName" :span="6">
                    <a-form-item label="第三方签约机构" class="form-item-label-long">
                        <a-input :value="taskInfo.supplierName" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
        <a-card v-if="statusMap['06']" style="margin: 24px;">
            <a-divider orientation="left">实施信息</a-divider>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="医疗机构">
                        <a-input :value="taskInfo.sorgName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="预约科室">
                        <a-input :value="taskInfo.deptName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="预约医生">
                        <a-input :value="taskInfo.resmedDoctorName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="就诊医生">
                        <a-input :value="taskInfo.actualDoctorName" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="所在省">
                        <a-input :value="taskInfo.sorgProvinceName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="所在市">
                        <a-input :value="taskInfo.sorgCityName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="就诊时间">
                        <a-input :value="taskInfo.consumeDate" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col v-if="this.threeOrgshow && taskInfo.supplierName" :span="6">
                    <a-form-item label="第三方签约机构" class="form-item-label-long">
                        <a-input :value="taskInfo.supplierName" :disabled="true" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="备注">
                        <a-input :value="getRemark(taskInfo.remark, 5)" :disabled="true" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
    </a-form>
</template>
<script>
    import api from '@/api/api-serve-apply'
    import DicSelect from '@/components/dic-select'
    import moment from 'moment'
    export default {
        components: {DicSelect},
        props: {
            taskInfo: {
                type: Object,
                default() {
                    return {}
                }
            },
            statusMap: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data() {
            return {
                dataFormLayout: {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 }
                },
                status: false, // 是否可点击 控制实施的全局
                filterForm: this.$form.createForm(this),
                hibmStatus: false,
                staffStatus: false,
                uploading: false,
                threeOrgshow:false
            }
        },
        mounted() {
          this.loadServiceTrackList3()
        },
        methods: {
          /**第三方签约机构查询**/
          loadServiceTrackList3 () {
            if (!this.taskInfo.serviceReservationId) return
            let params = {
              serviceReservationId: this.taskInfo.serviceReservationId
            }
            this.uploading = true
            api.queryServiceTrack(params).then(res => {
              this.serviceTrackList = res.data.serviceTrackList || []
              this.threeOrgshow = res.data.flag
            }).finally(() => {
              this.uploading = false
            })
          },
            /**
             * 获取备注的调用方法
             * node 当前备注所在节点
             */
            getRemark(remarks, node) {
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
            addRemark(remarks, node, remark) {
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
            getRemarkKey(node) {
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
            }
        }
    }
</script>
