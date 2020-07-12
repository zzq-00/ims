<template>
  <a-modal v-model="contractModal" style="top: 30px;" :width="1070" title="合约信息">
    <a-form :form="dataForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-spin :spinning="spinning"/>
      <a-divider orientation="left"><a-icon type="search" />合约详细信息</a-divider>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="合约名称" >
            <a-input v-decorator="['contName',{rules: [{ required: true, message: '合约名称不能为空!' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="合约管理机构" >
            <OrgSelect disabled dicType="4" v-decorator="['orgCode',{initialValue: '',rules: [{ required: true, message: '请选择合约管理机构!' }]}]"></OrgSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="供应商名称" >
            <a-input disabled v-decorator="['supplierName',{rules: [{ required: true, message: '供应商名称不能为空!' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="合约类型" >
            <DicSelect dicType="SUP_CONTRACT_TYPE" v-decorator="['cooperateWay',{initialValue: '',rules: [{ required: true, message: '请选择合约类型!' }]}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="开始/结束时间" :label-col="{span:6}" :wrapper-col="{span:16}">
            <a-range-picker v-decorator="['contractDate',{rules: [{ required: true, message: '开始/结束时间不能为空!' }]}]">
            </a-range-picker>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="结算周期" >
            <DicSelect dicType="PAY_FREQ" v-decorator="['payFreq',{initialValue: '1',rules: [{ required: true, message: '请选择结算周期!' }]}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="结算方式" >
            <DicSelect dicType="PAY_WAY" v-decorator="['payWay',{initialValue: '02',rules: [{ required: true, message: '请选择结算方式!' }]}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="货币类型" >
            <DicSelect dicType="CURRENCY" v-decorator="['currency',{initialValue: 'CNY',rules: [{ required: true, message: '请选择货币类型!' }]}]"></DicSelect>
          </a-form-item>
        </a-col>
        <a-col :span="18">
          <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
            <a-input v-decorator="['remark']">
            </a-input>
          </a-form-item>
        </a-col>
        <a-divider orientation="left"><a-icon type="search" />合约文件信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6" style="text-align:left">
            <span type='margin:5px 10px 0 0;'>合约上传：</span>
            <a-upload :file-list="contractList" :remove="removeContract" :before-upload="beforeContract">
              <a-button type="primary"> 点击添加文件 </a-button>
            </a-upload>
          </a-col>
          <a-col :span="6" style="text-align:left">
<!--            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" :disabled="contractList.length === 0" :loading="contractUploading" @click="uploadContract">导入</a-button>-->
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='cancelContract'>清空</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadContract">下载</a-button>
          </a-col>
          <a-col :span="6" style="text-align:left">
            <span type='margin:5px 10px 0 0;'>批复上传：</span>
            <a-upload :file-list="replyList" :remove="removeReply" :before-upload="beforeReply">
              <a-button type="primary"> 点击添加文件 </a-button>
            </a-upload>
          </a-col>
          <a-col :span="6" style="text-align:left">
<!--            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" :disabled="replyList.length === 0" :loading="replyUploading" @click="uploadReply">导入</a-button>-->
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='cancelReply'>清空</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadReply">下载</a-button>
          </a-col>
        </a-row>
        <a-divider orientation="left"><a-icon type="search" />合约账户信息</a-divider>
        <a-col :span="8">
          <a-form-item label="开户行" >
            <a-input v-decorator="['supplierContractM.bankName']">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="分行名称" >
            <a-input v-decorator="['supplierContractM.branchName']">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="账户名称" >
            <a-input v-decorator="['supplierContractM.accName']">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="银行账号" >
            <a-input v-decorator="['supplierContractM.bankAcc']">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="是否有效" v-show="showValidState">
            <DicSelect dicType="EFFECT_TYPE" v-decorator="['validState',{ initialValue: '01', rules: [{ required: true, message: '请选择是否有效!' }]}]"></DicSelect>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div slot="footer">
      <a-button v-if="!verify" type="" @click="contractModal=false">取消</a-button>
      <a-button v-if="!verify" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
    </div>
  </a-modal>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import moment from 'moment'
export default {
	components: {DicSelect, AddressSelect, OrgSelect},
	props: {
		supplierData: {
			type: Object,
			default () {
				return {}
			}
		},
		param: {
			type: Object,
			default () {
				return {}
			}
		},
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
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			formLayout: "horizontal",
			dataForm: this.$form.createForm(this),
			submitLoading: false,
			addTitle: "新增用户",
			power: [],
			spinning: false,
			extraParam: {},
			contNo: '',
			contractModal: false,
			accId: '',
			contId: '',
			contractList: [],
			replyList: [],
			contractUploading: false,
			replyUploading: false,
			showValidState: false
		}
	},
	created () {
		// 取出权限串和token，存入data
		// console.log(this.$route.query, "============")
		// this.power = JSON.parse(this.$route.query.power)
		// this.token = this.$route.query.token
	},
	mounted () {
	},
	methods: {
		addForm () {
			// this.extraParam = obj || {}
			this.contractModal = true
			this.showValidState = false
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.contractList = []
				this.replyList = []
				this.accId = ''
				this.contId = ''
				this.dataForm.setFieldsValue({"supplierName": this.supplierData.supplierName})
				this.dataForm.setFieldsValue({"contName": this.supplierData.supplierName})
				this.dataForm.setFieldsValue({"orgCode": this.supplierData.supplierOrgCode})
			})
		},
		editForm (contNo, extraParam) {
			this.contractModal = true
			this.showValidState = true
			let param = {
				contNo: contNo,
				sorgCode: extraParam.sorgCode
			}
			this.contNo = contNo
			this.extraParam = extraParam || {}
			this.spinning = true
			supApi.getContractInfo(param).then(res => {
				this.$nextTick(() => {
					let supplierContract = res.data.supplierContract
					supplierContract.supplierContractM = {}
					supplierContract.contractDate = []
					supplierContract.contractDate.push(moment(supplierContract.startDate))
					supplierContract.contractDate.push(moment(supplierContract.endDate))
					supplierContract.supplierContractM.bankName = supplierContract.bankName
					supplierContract.supplierContractM.branchName = supplierContract.branchName
					supplierContract.supplierContractM.accName = supplierContract.accName
					supplierContract.supplierContractM.bankAcc = supplierContract.bankAcc
					this.dataForm.setFieldsValue(supplierContract)
					console.log(supplierContract, 'dddd')
					// this.dataForm.setFieldsValue(this.accountData)
					this.dataForm.setFieldsValue({"supplierName": extraParam.supplierName, "validState": supplierContract.supContStatus})
					// 对账号ID和合约ID赋值，用于修改合约传值
					this.accId = supplierContract.accId
					this.contId = supplierContract.contId
					this.contractList = []
					this.replyList = []
					console.log("res.data.supplierContract.attachName:", res.data.supplierContract.attachName)
					console.log("res.data.supplierContract.replyFileName:", res.data.supplierContract.replyFileName)
					if (res.data.supplierContract.attachName != null) {
						this.contractList.push({uid: 1, name: res.data.supplierContract.attachName})
					}
					if (res.data.supplierContract.replyFileName != null) {
						this.replyList.push({uid: 1, name: res.data.supplierContract.replyFileName})
					}
				})
			}).finally(() => {
				this.spinning = false
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
					sorgCode: this.param.sorgCode,
					sorgName: this.param.sorgName,
					supplierId: this.supplierData.supplierId,
					supplierCode: this.supplierData.supplierCode,
					contNo: this.contNo,
					supplierContract: {},
					supplierContractM: {},
					accId: this.accId,
					contId: this.contId
				}
				Object.assign(data.supplierContractM, formData.supplierContractM)
				data.supplierContract.startDate = formData.contractDate[0]
				data.supplierContract.endDate = formData.contractDate[1]
				data.supplierContract.supContStatus = formData.validState
				data.supplierContract.contNo = this.contNo

				delete formData.supplierContractM
				delete formData.contractDate
				Object.assign(data.supplierContract, formData)

				this.submitLoading = true
				supApi.saveContract(data).then(res => {
					this.$message.success('保存成功!')
					// 上传合约文件
					let contNodata = {
						newConNo: res.data.paramsContract.contNo,
						supplierContract: this.contNo
					}
					this.uploadContract(contNodata)
					// 上传批复文件
					this.uploadReply(contNodata)
					this.contractModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		},
		// 文件上传相关方法
		removeContract (file) {
			const index = this.contractList.indexOf(file)
			const newFileList = this.contractList.slice()
			newFileList.splice(index, 1)
			this.contractList = newFileList
		},
		removeReply (file) {
			const index = this.replyList.indexOf(file)
			const newFileList = this.replyList.slice()
			newFileList.splice(index, 1)
			this.replyList = newFileList
		},
		beforeContract (file) {
			this.contractList = [file]
			return false
		},
		beforeReply (file) {
			this.replyList = [file]
			return false
		},
		uploadContract (contNoData) {
		  if (this.contractList.length === 0) {
				return
			}
			this.contractUploading = true
			if (this.contractList[0] && this.contractList[0].name) {
				let data = new FormData()
				this.contractList.map((item, index) => {
					if (item.size === undefined) {
						return
					}
					data.append('contractFile', item)
					data.append("fileName", this.contractList[0].name)
					data.append('supplierContract', contNoData.supplierContract)
					data.append('newConNo', contNoData.newConNo)
					supApi.uploadContract(data).then(res => {
						if (res.status !== 0) {
							this.$message.error(res.statusText)
						} else {
							this.$message.success(res.statusText)
						}
					}).finally(() => {
						this.contractUploading = false
					})
				})
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		uploadReply (contNoData) {
			if (this.replyList.length === 0) {
				return
			}
			this.replyUploading = true
			if (this.replyList[0] && this.replyList[0].name) {
				let data = new FormData()
				this.replyList.map((item, index) => {
					if (item.size === undefined) {
						return
					}
					data.append('replyFile', item)
					data.append("fileNamePf", this.replyList[0].name)
					data.append('supplierContract', contNoData.supplierContract)
					data.append('newConNo', contNoData.newConNo)
					supApi.uploadReply(data).then(res => {
						if (res.status !== 0) {
							this.$message.error(res.statusText)
						} else {
							this.$message.success(res.statusText)
						}
					}).finally(() => {
						this.replyUploading = false
					})
				})
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		cancelContract () {
			this.contractList = []
		},
		cancelReply () {
			this.replyList = []
		},
		downloadContract () {
		  if (this.contractList.length === 0) {
		    return
			}
		  // 赋值文件信息时会将uid设置为1
		  if (this.contractList[0].uid !== 1) {
		    this.$message.error("请先保存再下载！")
				return
			}
			let data = {
				attachName: this.contractList[0].name,
				conOldCode: this.contNo,
				conNewCode: ''
			}
			supApi.downContract(data).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, this.contractList[0].name)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
			})
		},
		downloadReply () {
			if (this.replyList.length === 0) {
				return
			}
			// 赋值文件信息时会将uid设置为1
			if (this.replyList[0].uid !== 1) {
				this.$message.error("请先保存再下载！")
				return
			}
		  let data = {
				attachName: this.replyList[0].name,
				conOldCode: this.contNo,
				conNewCode: ''
			}
			supApi.downContract(data).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, this.replyList[0].name)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
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
