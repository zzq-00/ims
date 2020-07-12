<template>
    <a-form :form="filterForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-card v-if="qnrInfo.qnrQuestionEntities" style="margin-top: 24px;">
            <a-divider orientation="left">回访内容</a-divider>
            <div v-for="(item,index) in qnrInfo.qnrQuestionEntities" :key="item.qnrQuestionId">
                <!-- 不需要答案，辅助说明 -->
                <a-row>
                    <a-col>
                        <div for='name' :style="labelStyle">{{index+1}}. {{item.questionDesc}}
                            <span v-if="item.answerType==='02'"
                                style='color:#ccc'>（1到{{item.answerEntities[0].maxLength}}字）</span>
                            <span v-if="item.answerType==='06'" style='color:#00F'>[多选题]</span>
                            <span v-show="item.mustAnswerFlag==='Y'" style="color: red;">*</span>
                        </div>
                    </a-col>
                </a-row>
                <!-- 数字 -->
                <a-row v-if="item.answerType==='01'">
                    <a-col :span="4">
                        <a-form-item>
                            <a-input-number :disabled="!status" style='margin: 10px 0 0 30px;'
                                :min='parseInt(item.answerEntities[0].minValue)'
                                :max='parseInt(item.answerEntities[0].maxValue)' v-decorator="[`question${index+1}`,{initialValue: parseInt(answerJson[`question${index+1}`])||0,
                                rules: [{ required: item.mustAnswerFlag==='Y', message: '不能为空!' }]}]"
                                placeholder='item.answerEntities[0].minValue~item.answerEntities[0].maxValue' />
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 文字 -->
                <a-row v-if="item.answerType==='02'">
                    <a-col :span="12">
                        <a-form-item>
                            <a-textarea :disabled="!status" style="margin: 10px 0 0 30px;" v-decorator="[`question${index+1}`,{initialValue: answerJson[`question${index+1}`]||'',
                                rules: [{ required: item.mustAnswerFlag==='Y', message: '不能为空!' }]}]"
                                :autoSize="{ minRows: 2, maxRows: 6 }" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 单选按钮 -->
                <a-row v-if="item.answerType==='03'">
                    <a-col :span="2">
                        <a-form-item style="margin-left: 30px">
                            <a-radio-group :disabled="!status" v-decorator="[`question${index+1}`,{initialValue: answerJson[`question${index+1}`]||'',
                                rules: [{ required: item.mustAnswerFlag==='Y', message: '不能为空!' }]}]">
                                <div v-for="item1 in item.answerEntities" :key="item1.optionCode">
                                    <a-radio :style="radioStyle" :value="item1.optionCode">{{item1.answerOption}}
                                    </a-radio>
                                </div>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 单选下拉列表 -->
                <a-row v-if="item.answerType==='04'">
                    <a-col :span="4">
                        <a-form-item>
                            <a-select :disabled="!status" v-decorator="[`question${index+1}`,{initialValue: answerJson[`question${index+1}`]||undefined,
                                rules: [{ required: item.mustAnswerFlag==='Y', message: '不能为空!' }]}]"
                                style="margin: 10px 0 0 30px;">
                                <a-select-option v-for="item1 in item.answerEntities" :key="item1.optionCode"
                                    :value="item1.optionCode" :selected="item1.defaultFlag==='Y'">
                                    {{item1.answerOption}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 多选按钮 -->
                <a-row v-if="item.answerType==='05'">
                    <a-col :span="3">
                        <a-form-item>
                            <a-checkbox-group :disabled="!status" v-decorator="[`question${index+1}`,{initialValue: answerJson[`question${index+1}`]||'',
                            rules: [{ required: item.mustAnswerFlag==='Y', message: '不能为空!' }]}]">
                                <div v-for="item1 in item.answerEntities" :key="item1.optionCode">
                                    <a-checkbox :style="radioStyle" :value="item1.optionCode">{{item1.answerOption}}
                                    </a-checkbox>
                                </div>
                            </a-checkbox-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 多选列表 -->
                <a-row v-if="item.answerType==='06'">
                    <a-col :span="4">
                        <a-form-item>
                            <a-select :disabled="!status"
                                v-decorator="[`question${index+1}`,{initialValue:answerJson[`question${index+1}`]||undefined ,rules: [{ required: item.mustAnswerFlag==='Y', message: '不能为空!' }]}]"
                                style="margin: 10px 0 0 30px;" mode='multiple'>
                                <a-select-option v-for="item1 in item.answerEntities" :key="item1.answerId"
                                    :value="item1.optionCode" :selected="item1.defaultFlag==='Y'">
                                    {{item1.answerOption}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 日期控件 -->
                <a-row v-if="item.answerType==='07'">
                    <a-col :span="4">
                        <a-form-item>
                            <a-date-picker :disabled="!status" style="margin: 10px 0 0 30px;width: 377px;height: 30px;"
                                v-decorator="[`question${index+1}`,{initialValue: answerJson[`question${index+1}`]||'',
                                rules: [{ required: item.mustAnswerFlag==='Y', message: '不能为空!' }]}]" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <hr style="height:0.5px;border:none;border-top:1px solid #d9d9d9;margin: 10px 0 10px 0" />
            </div>
        </a-card>
        <a-card style="margin-top: 24px;">
            <a-row>
                <a-col :span="12">
                    <a-form-item label="请您对本地服务给予总体评价">
                        <DicSelect :disabled="!status" dicType="SI_QNR_SCORE"
                            v-decorator="['satisFactionPoint', {initialValue: '05',rules: [{ required: true, message: '总体评价不能为空!' }]}]" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="回访状态">
                        <DicSelect :disabled="!status" dicType="SI_RETURN_STATUS"
                            v-decorator="['returnStatus', {initialValue: '',rules: [{ required: true, message: '回访状态不能为空!' }]}]" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12" v-show="filterForm.getFieldValue('returnStatus')==='02'">
                    <a-form-item label="待再次回访原因">
                        <DicSelect :disabled="!status" dicType="SI_AGAIN_REASON"
                            v-decorator="['againReason', {initialValue: '',rules: [{ required: filterForm.getFieldValue('returnStatus')==='02', message: '待再次回访原因不能为空!' }]}]" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12" v-show="filterForm.getFieldValue('returnStatus')==='03'">
                    <a-form-item label="预约再回访时间">
                        <a-date-picker :disabled="!status" style="width: 478px;height: 30px;" show-time
                            format="YYYY-MM-DD HH:mm"
                            v-decorator="['applyReTime', {initialValue:'',rules: [{ required:filterForm.getFieldValue('returnStatus')==='03', message: '再回访时间不能为空!' }]}]" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <div style="float: right; margin: 0 10px 10px 0">
                        <a-button type="" v-show="status" :loading="uploading" @click="saveForm">保存</a-button>
                        <a-button type="primary" v-show="status" :loading="uploading1" @click="submitForm">提交</a-button>
                        <a-button type="primary" v-show="status" @click="reportDan">疑难工单上报</a-button>
                    </div>
                </a-col>
            </a-row>
        </a-card>
        <ReportModal ref='reportModal' :remark='remark' @on-update="onupdate" />
    </a-form>
</template>
<script>
    import api from '@/api/api-serve-apply'
    import moment from 'moment'
    import DicSelect from '@/components/dic-select'
    import ReportModal from './report-modal'
    export default {
        components: { DicSelect, ReportModal },
        props: {
            taskInfo: {
                type: Object,
                default() {
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
                radioStyle: {
                    float: 'left',
                    // display: 'block',
                    height: '30px',
                    lineHeight: '30px',
                },
                labelStyle: {
                    lineHeight: '30px',
                    fontWeight: 'bold',
                    display: 'block',
                    fontSize: '15px',
                    textAlign: 'left'
                },
                status: false, // 是否可点击 控制实施的全局
                filterForm: this.$form.createForm(this),
                hibmStatus: false,
                staffStatus: false,
                uploading: false,
                uploading1: false,
                qnrInfo: {},
                remark: '',
                answerJson: {}
            }
        },
        mounted() {
            this.initLoad()
        },
        watch: {
            taskInfo(newVal, oldVal) {
                this.initLoad()
            }
        },
        methods: {
            initLoad() {
                this.status = parseInt(this.taskInfo.status) === 8// 判断是否已过了该步骤
                let QnrCustomerBo = {};
                QnrCustomerBo.serviceCode = this.taskInfo.serviceCode;
                QnrCustomerBo.productCode = this.taskInfo.productCode;
                QnrCustomerBo.provinceCode = this.taskInfo.patientProvince;
                QnrCustomerBo.cityCode = this.taskInfo.patientCity;
                QnrCustomerBo.supplierCode = this.taskInfo.supplierCode;
                QnrCustomerBo.sorgCode = this.taskInfo.merchantcode;

                QnrCustomerBo.custName = this.taskInfo.patientName;
                QnrCustomerBo.sorgName = this.taskInfo.sorgName;
                QnrCustomerBo.supplierName = this.taskInfo.supplierName;
                QnrCustomerBo.chaperoneDateStr = moment(this.taskInfo.consumeDate).format("YYYY-MM-DD  HH:mm");
                QnrCustomerBo.consumeDateStr = moment(this.taskInfo.consumeDate).format("YYYY-MM-DD  HH:mm");
                QnrCustomerBo.custGender = this.taskInfo.patientGenderDesc;
                QnrCustomerBo.serviceName = this.taskInfo.serviceName;
                QnrCustomerBo.serviceReservationId = this.taskInfo.serviceReservationId;
                api.serviceReturnVitis(QnrCustomerBo).then(res => {
                    if (res.status === 0) {
                        if (res.data.qnrInfo) {
                            this.qnrInfo = res.data.qnrInfo;
                            //循环问题
                            this.qnrInfo.qnrQuestionEntities.forEach((item, index) => {
                                if (item.answerType === '06' || item.answerType === '05') {
                                    this.answerJson['question' + (index + 1)] = []
                                }
                                //循环答案
                                item.answerEntities.forEach((item1, index1) => {
                                    if (item1.defaultFlag === 'Y' && !(item.answerType === '06' || item.answerType === '05')) {
                                        this.answerJson['question' + (index + 1)] = item1.optionCode
                                    }
                                    if (item1.defaultFlag === 'Y' && (item.answerType === '06' || item.answerType === '05')) {
                                        this.answerJson['question' + (index + 1)].push(item1.optionCode)
                                    }
                                })
                            });
                            if (parseInt(this.taskInfo.status) >= 8) {
                                api.showQuInfo({ serviceReservationId: this.taskInfo.serviceReservationId }).then(res => {
                                    if (res.status === 0 && res.data.askInfo) {
                                        this.filterForm.setFieldsValue(res.data.askInfo)
                                        this.remark = res.data.askInfo.remark
                                        if (res.data.askInfo.answerJson) {
                                            this.answerJson = JSON.parse(res.data.askInfo.answerJson);
                                        }
                                    }
                                }).finally(() => {
                                })
                            }
                        }
                    }
                }).finally(() => {
                })
            },
            saveForm() {
                console.log('回访时间', this.filterForm.getFieldValue('applyReTime'))
                this.filterForm.validateFields((error, values) => {
                    if (error) {
                        this.$message.error("请将表单填写完整")
                        return
                    }
                    this.uploading = true
                    let param = this.getData()
                    param.saveType = '04'
                    api.saveServiceDescribe(param).then(res => {
                        if (res.status === 0) {
                            this.$message.success('保存成功!')
                        }
                    }).finally(() => {
                        this.uploading = false
                    })
                })
            },
            getData() {
                let answerJson = this.filterForm.getFieldsValue()
                delete answerJson.satisFactionPoint
                delete answerJson.returnStatus
                delete answerJson.againReason
                delete answerJson.applyReTime
                let param = {
                    serviceReservationId: this.taskInfo.serviceReservationId,
                    qnrInfoId: this.qnrInfo.qnrInfoId || '',
                    satisFactionPoint: this.filterForm.getFieldValue('satisFactionPoint'),
                    returnStatus: this.filterForm.getFieldValue('returnStatus'),
                    againReason: this.filterForm.getFieldValue('againReason'),
                    applyReTimeStr: this.filterForm.getFieldValue('applyReTime') ? moment(this.filterForm.getFieldValue('applyReTime')).format("YYYY-MM-DD HH:mm") : undefined,
                    answerJson: JSON.stringify(answerJson),
                    remark:this.remark
                }
                return param;
            },
            submitForm() {
                let self = this
                this.filterForm.validateFields((error, values) => {
                    if (error) {
                        this.$message.error("请将表单填写完整")
                        return
                    }
                    this.$confirm({
                        title: '提示',
                        content: '是否确认提交，提交后不可修改？',
                        okType: 'danger',
                        onOk() {
                            return new Promise((resolve, reject) => {
                                self.uploading1 = true
                                let param = self.getData()
                                param.saveType = '01'
                                api.saveServiceDescribe(param).then(res => {
                                    if (res.status === 0) {
                                        if (res.data.result === 1) {
                                            let serviceData = res.data.serviceApplication
                                            // 如果判断可以进入下一步，并且保存成功则进行跳转
                                            self.status = false
                                            self.$message.success("提交成功! ")
                                            self.$emit("on-update")
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
            reportDan() {
                let param = this.getData()
                this.$refs.reportModal.initForm(param)
            },
            onupdate(returnParam) {
                this.filterForm.validateFields((error, values) => {
                    if (error) {
                        this.$message.error("请将表单填写完整")
                        return
                    }
                    if (returnParam.saveType === '03') {
                        api.saveServiceDescribe(returnParam).then(res => {
                            if (res.status === 0) {
                                this.$message.success('保存成功!')
                                this.remark=returnParam.remark
                            }
                        }).finally(() => {
                        })
                    }
                    if (returnParam.saveType === '02') {
                        let self = this
                        this.$confirm({
                            title: '提示',
                            content: '是否确认提交，提交后不可修改？',
                            okType: 'danger',
                            onOk() {
                                return new Promise((resolve, reject) => {
                                    api.describeReport(returnParam).then(res => {
                                        if (res.status === 0) {
                                            if (res.data.result === 1) {
                                                let serviceData = res.data.serviceApplication
                                                // 如果判断可以进入下一步，并且保存成功则进行跳转
                                                self.$message.success("提交成功! ")
                                                self.$emit("on-update")
                                            } else {
                                                self.$message.error("服务实施内部存储失败!")
                                            }
                                        } else {
                                            self.$message.error(res.statusText)
                                        }
                                    }).finally(() => {
                                        resolve()
                                    })
                                })
                            }
                        })
                    }
                })
            }
        }
    }
</script>