<template>
    <div>
        <a-card style="margin-top: 24px;">
            <a-divider orientation="left">疑难工单信息</a-divider>
            <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="疑难上报描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                            <a-textarea :disabled="true"
                                v-decorator="['remark', {initialValue:'',rules: [{ required: true, message: '备注不能为空!' }]}]"
                                :autoSize="{ minRows: 2, maxRows: 6 }" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="5">
                        <a-form-item label="处理结果">
                            <DicSelect :disabled="!status" dicType="SI_DIF_STATUS"
                                v-decorator="['dealResult', {initialValue: '',rules: [{ required: true, message: '处理结果不能为空!' }]}]" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="处理描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                            <a-textarea :disabled="!status"
                                v-decorator="['dealDescribe', {initialValue:'',rules: [{ required: filterForm.getFieldValue('dealResult')==='00', message: '处理描述不能为空!' }]}]"
                                :autoSize="{ minRows: 2, maxRows: 6 }" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <div style="float: right; margin: 0 10px 10px 0">
                            <a-button type="" v-show="status" :loading="uploading" @click="saveForm">保存</a-button>
                            <a-button type="primary" v-show="status" :loading="uploading1" @click="submitForm">提交
                            </a-button>
                        </div>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>
    </div>
</template>
<script>
    import api from '@/api/api-serve-apply'
    import DicSelect from '@/components/dic-select'
    export default {
        components: { DicSelect },
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
                // 查询条件
                filterFormLayout: {
                    labelCol: { span: 9 },
                    wrapperCol: { span: 15 }
                },
                formModal: false,
                modalWidth: 500,
                filterForm: this.$form.createForm(this),
                param: {},
                uploading1: false,
                uploading: false,
                askInfo:{},
                qnrInfo:{},
                status: false
            }
        },
        mounted() {
            this.initForm()
        },
        watch: {
            taskInfo(newVal, oldVal) {
                this.initLoad()
            }
        },
        methods: {
            initForm() {
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
                QnrCustomerBo.chaperoneDateStr = this.taskInfo.consumeDate;
                QnrCustomerBo.consumeDateStr = this.taskInfo.consumeDate;
                QnrCustomerBo.custGender = this.taskInfo.patientGenderDesc;
                QnrCustomerBo.serviceName = this.taskInfo.serviceName;
                QnrCustomerBo.serviceReservationId = this.taskInfo.serviceReservationId;
                api.serviceReturnVitis(QnrCustomerBo).then(res => {
                    if (res.status === 0) {
                        if (res.data.qnrInfo != null) {
                            this.qnrInfo = res.data.qnrInfo;
                        }
                    }
                }).finally(() => {
                })
                this.status = parseInt(this.taskInfo.status) === 11// 判断是否已过了该步骤
                api.showQuInfo({ serviceReservationId: this.taskInfo.serviceReservationId }).then(res => {
                    if (res.status === 0) {
                        this.filterForm.setFieldsValue(res.data.askInfo)
                    }
                }).finally(() => {
                })
            },
            saveForm() {
                this.filterForm.validateFields((error, values) => {
                    if (error) {
                        return
                    }
                    this.uploading = true
                    let param = {
                        serviceReservationId: this.taskInfo.serviceReservationId,
                        qnrInfoId: this.qnrInfo.qnrInfoId || '',
                        saveType: '01',
                        remark: this.filterForm.getFieldValue('remark'),
                        dealResult: this.filterForm.getFieldValue('dealResult'),
                        dealDescribe: this.filterForm.getFieldValue('dealDescribe')
                    }
                    api.dealDifficult(param).then(res => {
                        if (res.status === 0) {
                            this.$message.success('保存成功!')
                        }
                    }).finally(() => {
                        this.uploading = false
                    })
                })
            },
            submitForm() {
                let self = this
                this.filterForm.validateFields((error, values) => {
                    if (error) {
                        return
                    }
                    this.$confirm({
                        title: '提示',
                        content: '是否确认提交，提交后不可修改？',
                        okType: 'danger',
                        onOk() {
                            return new Promise((resolve, reject) => {
                                self.uploading1 = true
                                let param = {
                                    serviceReservationId: self.taskInfo.serviceReservationId,
                                    qnrInfoId: self.qnrInfo.qnrInfoId || '',
                                    saveType: '02',
                                    remark: self.filterForm.getFieldValue('remark'),
                                    dealResult: self.filterForm.getFieldValue('dealResult'),
                                    dealDescribe: self.filterForm.getFieldValue('dealDescribe')
                                }
                                api.dealDifficult(param).then(res => {
                                    if (res.status === 0) {
                                        if (res.data.result === 1) {
                                            self.$message.success("操作成功!")
                                          //  self.$emit("on-update", serviceData)
                                          setTimeout(()=>{
                                            self.closeForm()
                                          },3000)
                                          
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
          closeForm () {
              console.log('11111111111')
            this.$emit("on-closeed")
          }
        }
    }
</script>
