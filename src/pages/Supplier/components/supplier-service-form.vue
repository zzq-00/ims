<template>
	<a-modal v-model="serviceModal" style="top: 30px;" :width="1070" title="服务信息">
  	<a-form :form="dataForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
			<a-spin :spinning="spinning"/>
			<a-divider orientation="left">
				<a-icon type="aliwangwang-o" /> 服务信息</a-divider>
			<a-row :gutter="16">
				<a-row>
					<a-col :span="8">
						<a-form-item label="合约号码">
							<a-Select v-decorator="['contNo',{rules: [{ required: true, message: '请选择合约号码!' }]}]" showSearch optionFilterProp="children">
								<a-select-option v-for="(item, index) in contList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="服务名称" >
							<a-Select label-in-value v-decorator="['supServName',{rules: [{ required: true, message: '请选择服务名称!' }]}]" showSearch optionFilterProp="children">
								<a-select-option v-for="(item, index) in serviceList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="价格类型" >
							<DicSelect dicType="PRICE_TYPE" v-decorator="['priceType',{initialValue: '',rules: [{ required: true, message: '请选择价格类型!' }]}]"></DicSelect>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="固定价格" >
							<a-input-number :step="0.01" :precision="2" v-decorator="['specPrivce']" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="最低价格" >
							<a-input-number :step="0.01" :precision="2" v-decorator="['minSettleCode']" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="最高价格" >
							<a-input-number :step="0.01" :precision="2" v-decorator="['maxSettleCode']" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="其他价格" >
							<a-input-number :step="0.01" :precision="2" v-decorator="['otherPrice']" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="是否有效" >
							<DicSelect dicType="EFFECT_TYPE" v-decorator="[
									'serviceStates',
									{initialValue: '01',rules: [{ required: true, message: '请选择是否有效!' }]}
									]" disabled></DicSelect>
						</a-form-item>
					</a-col>
				</a-row>
				<a-col :span="18">
					<a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
						<a-input v-decorator="['remark']">
						</a-input>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div slot="footer">
			<a-button v-if="!verify" key="confirm" type="" @click="serviceModal=false">取消</a-button>
			<a-button v-if="!verify" :loading="submitLoading"  key="print" type="primary" @click.native="submitForm()">{{supServId?'修改':'新增'}}</a-button>
		</div>
	</a-modal>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
export default {
	components: { DicSelect, AddressSelect },
	props: {
		verify: {
			type: Boolean,
			default () {
				return false
			}
		}
	},
	data () {
		return {
			// 查询条件
			formItemLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			formLayout: "horizontal",
			dataForm: this.$form.createForm(this),
			submitLoading: false,
			editData: null,
			addTitle: "新增用户",
			visible: false,
			count: 2,
			power: [],
			spinning: false,
			contList: [],
			serviceList: [],
			extraParam: {},
			supServId: '',
			serviceModal: false
		}
	},
	created () {
		// 取出权限串和token，存入data
		// console.log(this.$route.query, "============")
		// this.power = JSON.parse(this.$route.query.power)
		// this.token = this.$route.query.token
	},
	mounted () {
		// this.getSupplierContList()
		// this.getBaseServiceList()
	},
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			this.getSupplierContList()
			this.getBaseServiceList()
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.serviceModal = true
			})
		},
		editForm (supServId, extraParam) {
			this.serviceModal = true
			let param = {
				supServId: supServId,
				sorgCode: extraParam.sorgCode
			}
			this.supServId = supServId
			this.extraParam = extraParam || {}
			this.spinning = true
			console.log("查询服务信息参数：", param)
			supApi.getServiceInfo(param).then(res => {
				console.log("查询服务信息结果：", res)
				// this.$nextTick(() => {
				let supplierService = res.data.supplierService
				let supServName = supplierService.supServName
				delete supplierService.supServName
				supplierService.supServName = {
					key: supplierService.serviceCode,
					label: supServName
				}
				this.dataForm.setFieldsValue(supplierService)
				// })
			}).finally(() => {
				this.spinning = false
			})
			this.getSupplierContList()
			this.getBaseServiceList()
		},
		getBaseServiceList () {
			supApi.getSupSer().then((result) => {
				result.data.map(item => {
					this.serviceList.push({ value: item.serviceCode, label: item.serviceName })
				})
			}).catch((err) => {
				console.log(err)
			})
		},
		getSupplierContList () {
			if (!this.extraParam.supplierCode) return
			supApi.queryContractList4Supplier({supplierCode: this.extraParam.supplierCode}).then((result) => {
				this.contList = []
				result.data.map(item => {
					this.contList.push({value: item.contNo, label: item.contNo})
				})
			}).catch((err) => {
				console.log(err)
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				let data = {
					sorgCode: this.extraParam.sorgCode,
					sorgName: this.extraParam.sorgName,
					supplierCode: this.extraParam.supplierCode,
					supServId: this.supServId,
					supplierContract: {}
				}
				Object.assign(data.supplierContract, formData)
				data.supplierContract.serviceName = this.dataForm.getFieldValue('supServName').key
				data.supplierContract.supServName = this.dataForm.getFieldValue('supServName').label

				this.submitLoading = true
				supApi.saveService(data).then(res => {
					this.$message.success('保存成功!')
					this.serviceModal = false
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
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
