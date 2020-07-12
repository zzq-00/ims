<template>
    <div>
        <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
            <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
                <a-spin :spinning="spinning"/>
                <a-row :gutter="8">
                    <a-col :span="24">
                        <a-form-item label="管家系统帐号" :labelCol="{span: 3}" :wrapperCol="{span:21}">
                            <a-input-search :readonly="true"
                                            v-decorator="['bulterNumber', {rules: [{ required: true, message: '管家系统帐号不能为空!' }]}]"
                                            enter-button @search="searchUser"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="8">
                    <a-col :span="8">
                        <a-form-item label="是否有效">
                            <DicSelect dicType="YES_NO" placeholder="请选择"
                                       v-decorator="['isValid', {rules: [{ required: true, message: '请选择' }]}]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="第三方名称">
                            <a-select v-decorator="['thirdName']" mode="multiple">
                                <a-select-option v-for="item in thirdNameList" :key="item.code"
                                                 :value="item.codeAndDesc">{{item.codeAndDesc}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="预约来源">
                            <a-select v-decorator="['orderSource']" mode="multiple">
                                <a-select-option v-for="item in orderSourceList" :key="item.code"
                                                 :value="item.codeAndDesc">{{item.codeAndDesc}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="8">
                    <a-col :span="8">
                        <a-form-item label="服务类别">
                            <DicSelect v-model="serviceType_watch" dicType="POLICY_SERVICE_TYPE" placeholder="请选择" v-decorator="['serviceType']"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="产品名称">
                            <a-select v-decorator="['productName']" mode="multiple">
                                <a-select-option v-for="item in productList" :key="item.productCode"
                                                 :value="item.productName">{{item.productName}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="是否查看">
                            <DicSelect dicType="YES_NO" placeholder="请选择"
                                       v-decorator="['isChecked', {rules: [{ required: true, message: '请选择' }]}]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="8">
                    <a-col :span="8">
                        <a-form-item label="是否接收短信">
                            <DicSelect dicType="YES_NO" placeholder="请选择"
                                       v-decorator="['receivedMess', {rules: [{ required: true, message: '请选择' }]}]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="是否接收邮件">
                            <DicSelect dicType="YES_NO" placeholder="请选择"
                                       v-decorator="['receivedEmail', {rules: [{ required: true, message: '请选择' }]}]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <div slot="footer">
                <a-button type="" @click="formModal=false">取消</a-button>
                <a-button v-if="!readonly" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
            </div>
        </a-modal>

        <StaffUserModal ref="staffUserModal" @on-update="searchUserHandle"/>
    </div>
</template>
<script>
import api from '@/api/api-process-config'
import DicSelect from '@/components/dic-select'
import StaffUserModal from './staff-user-modal'

export default {
	name: 'mess-controll-form',
	components: {DicSelect, StaffUserModal},
	data () {
		return {
			dataFormLayout: {
				labelCol: {span: 8},
				wrapperCol: {span: 16}
			},
			spinning: false,
			extraParam: {},
			readonly: true,

			modalWidth: 970,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			orderSourceList: [],
			thirdNameList: [],
			productList: [],
			serviceType_watch: undefined
		}
	},
	mounted () {
		this.loadOrderSourceList()
		this.loadThirdNameList()
		this.loadProductList()
	},
	watch: {
		serviceType_watch () {
			let productType = this.serviceType_watch
			this.loadProductList(productType)
		}
	},
	methods: {
		loadProductList (productType) {
			api.queryProductSelectBulterAccessCfg({productType: productType}).then(res => {
				this.productList = res.data.data
			})
		},
		loadOrderSourceList () {
			api.queryOrderSourceBulterAccessCfg({orderSource: null}).then(res => {
				this.orderSourceList = res.data.data
			})
		},
		loadThirdNameList () {
			api.queryThirdNameBulterAccessCfg({thirdName: null}).then(res => {
				this.thirdNameList = res.data.data
			})
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.readonly = false
			this.modalTitle = '新增管家配置信息'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({thirdName: [], orderSource: [], productName: []})
			})
		},
		editForm (extraParam, readonly) {
			this.extraParam = extraParam || {}
			this.modalTitle = '修改管家配置信息'
			this.readonly = false
			if (readonly) {
				this.readonly = true
				this.modalTitle = '查看管家配置信息'
			}
			this.formModal = true
			this.spinning = false
			this.dataForm.resetFields()
			console.log('serviceType===', this.extraParam.serviceType)
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(this.extraParam)
				this.dataForm.setFieldsValue({thirdName: [], orderSource: [], productName: []})
				if (this.extraParam.thirdName) {
					this.dataForm.setFieldsValue({thirdName: this.extraParam.thirdName.split(',')})
				}
				if (this.extraParam.orderSource) {
					this.dataForm.setFieldsValue({orderSource: this.extraParam.orderSource.split(',')})
				}
				if (this.extraParam.productName) {
					this.dataForm.setFieldsValue({productName: this.extraParam.productName.split(',')})
				}
			})
		},
		searchUser () {
			this.$refs.staffUserModal.show()
		},
		searchUserHandle (items) {
			items = items || []
			let names = items.map(item => item.staffName + '-' + item.userName)
			this.dataForm.setFieldsValue({
				bulterNumber: names.join(',')
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign({}, values)
				let data = this.extraParam
				Object.assign(data, formData)
				data = {
					bulterOrder: data
				}

				this.submitLoading = true
				api.saveBulterOrderBoBulterAccessCfg(data).then(res => {
					if (res.data.code === "00") {
						this.$message.success("数据保存成功!")
					} else {
						if (res.data.code === "02") {
							this.$message.success("数据保存失败!")
						} else {
							this.$message.success("配置信息已重复!")
						}
					}
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
