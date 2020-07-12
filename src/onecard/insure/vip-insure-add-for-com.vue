<template>
  <a-card :bordered="false">
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-card style="margin: 24px;">
        <a-row :gutter="16">
          <a-col :span="12" :offset="12">
            <div style="float:right">
              <a-button v-if="(editable != 'view' && editable != 'edit')" class="editable-add-btn" style="float:right;margin-right:10px;" @click="resetInsure">新建</a-button>
              <a-button v-if="(editable == 'edit' )" class="editable-add-btn" style="float:right;margin-right:10px;" @click="printInsure">打印票据</a-button>
              <a-button v-if="(editable != 'view' )" :loading="submitLoading" type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="saveInsure">提交</a-button>
            </div>
          </a-col>
        </a-row>
        <a-divider orientation="left">
          <a-icon type="home" /> 团体产品购买人基本信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-row>
              <a-col :span="6">
                <a-form-item label="团体名称">
                  <a-input :disabled="(editable == 'view')" v-decorator="['name',{rules: [{ required: true, message: '团体名称不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="社会统一信用代码" class="form-item-label-long">
                  <a-input :disabled="(editable == 'view')" v-decorator="['idcard',{rules: [{ required: true, message: '社会统一信用代码不能为空!' },{ min: 18, max: 18, message: '字符长度应为18' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="生效日期">
                  <a-week-picker :disabled="(editable == 'view')" format="YYYY-MM-DD"
                                 v-decorator="['contnostartdate',{rules: [{ required: true, message: '生效日期不能为空!' }]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="满期日期">
                  <a-week-picker :disabled="(editable == 'view')" format="YYYY-MM-DD"
                                 v-decorator="['contnoenddate',{rules: [{ required: true, message: '满期日期不能为空!' }]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="省份">
                  <AddressSelect :disabled="(editable == 'view')" dicType="0" placeholder="请选择省份" v-decorator="['province',{initialValue: '',rules: [{ required: true, message: '请选择省份!' }]}]" @change="hasCascadeDefaultProvince=true"></AddressSelect>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="城市">
                  <AddressSelect :hasCascadeDefault="hasCascadeDefaultProvince" :disabled="(editable == 'view')" :dicType="dataForm.getFieldValue('province')" placeholder="请选择" v-decorator="['city',{initialValue: '',rules: [{ required: true, message: '请选择城市!' }]}]" @change="hasCascadeDefaultCity=true"></AddressSelect>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="区县">
                  <AddressSelect :hasCascadeDefault="hasCascadeDefaultProvince || hasCascadeDefaultCity" :disabled="(editable == 'view')" :dicType="dataForm.getFieldValue('city')" placeholder="请选择区县" v-decorator="['district',{initialValue: ''}]"></AddressSelect>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="街道">
                  <a-input :disabled="(editable == 'view')" v-decorator="['street', {initialValue: '', rules: [{ required: true, message: '街道不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="地址">
                  <a-input :disabled="(editable == 'view')" v-decorator="['address', {initialValue: '', rules: [{ required: true, message: '地址不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="邮编">
                  <a-input :disabled="(editable == 'view')" v-decorator="['zip',{rules: [{ required: true, message: '邮编不能为空!' },{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入数字!'}]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="电子邮箱">
                  <a-input :disabled="(editable == 'view')" v-decorator="['email', {initialValue: ''}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="组织机构代码">
                  <a-input :disabled="(editable == 'view')" v-decorator="['socialcreditno']" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="单位联系人">
                  <a-input :disabled="(editable == 'view')" v-decorator="['emercontact', {rules: [{ required: true, message: '单位联系人不能为空!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系人电话">
                  <a-input :disabled="(editable == 'view')" v-decorator="['emermobile', {rules: [{ required: true, message: '联系人电话不能为空!' },{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入数字!'}]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系人证件类型">
                  <DicSelect :disabled="(editable == 'view')" dicType="CERTI_TYPE" placeholder="请选择证件类型" v-decorator="[ 'emeridcardtype',{rules: [{ required: true, message: '请选择证件类型!' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系人证件号">
                  <a-input :disabled="(editable == 'view')" v-decorator="['emeridcard',{rules: [{required: true, message: '证件号码不能为空' }]}]" @blur="checkIdCard"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="企业类型">
                  <DicSelect :disabled="(editable == 'view')" dicType="VIP_GRPNATURE" placeholder="请选择企业类型" v-decorator="[ 'grpnaturecode', {rules: [{ required: true, message: '企业类型不能为空!' }]} ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="行业性质">
                  <DicSelect :disabled="(editable == 'view')" dicType="VIP_BUSINESSTYPE" placeholder="请选择企业类型" v-decorator="[ 'businesstypecode',{rules: [{ required: true, message: '行业性质不能为空!' }]} ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="账户管理费(%)">
                  <a-input-number :disabled="(editable == 'view')" :min="0" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" v-decorator="['accmanagefee', {initialValue: '0',rules: [{ required: true, message: '账户管理费必须大于0！' }]}]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item class="form-item-label-long" label="账户解约管理费(%)">
                  <a-input-number :disabled="(editable == 'view')" :min="0" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" v-decorator="['accrelieffee', {initialValue: '0'}]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin: 24px;">
        <a-divider orientation="left">
          <a-icon type="home" /> 贴心管家产品信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="购买产品">
              <DicSelect :disabled="(editable == 'view')" dicType="VIP_PRODUCT" placeholder="请选择购买产品" v-decorator="[ 'productcode',{initialValue:'001', rules: [{ required: true, message: '请选择购买产品!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="购买金额">
              <a-input-number :disabled="(editable == 'view')" :min="100" :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/\￥\s?|(,*)/g, '')" v-decorator="['money', {rules: [{ required: true, message: '请选择购买金额!' }]}]" @blur="changeMoney" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡形式">
              <DicSwitch :disabled="(editable == 'view')" dicType="VIP_CARD_TYPE" :value="dataForm.getFieldsValue(['type']).type" v-decorator="['type', {initialValue: inputCompact.typeValue}]" />
              <a-input type="hidden" v-decorator="['typeName', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin: 24px;">
        <a-divider orientation="left">
          <a-icon type="home" /> 推荐人信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="推荐人编号">
              <a-input :disabled="(editable == 'view')" v-decorator="['refereecode',{ initialValue: '', rules: [{ required: true, message: '推荐人编号不能为空!' }]}]" @pressEnter="refereecodeCheck" @blur="refereecodeCheck" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="销售渠道">
              <DicSelect :disabled="true" dicType="VIP_SALECHNL" v-decorator="[ 'agentchannel']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="推荐人姓名">
              <a-input :disabled="true" v-decorator="['refereename', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="推荐人电话">
              <a-input :disabled="true" v-decorator="['refereemobile', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="中介公司">
              <a-select :disabled="(inputCompact.agentcomcodeDisabled || editable == 'view')" v-decorator="['agentcomcode', {initialValue: ''}]">
                <a-select-option v-for="(item, index) in inputCompact.agentComList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="被保险人人数">
              <a-input-number :disabled="(editable == 'view')" :formatter="value => `${value} 人`"
                              v-decorator="['insuredcount', {initialValue:0}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item class="form-item-label-long" label="被保险人个人金额">
              <a-input-number :disabled="(editable == 'view')" :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/\￥\s?|(,*)/g, '')" v-decorator="['insuredmoney', {initialValue:0}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input type="hidden" v-decorator="['customercode', {initialValue: ''}]" />
              <a-input type="hidden" v-decorator="['idcardtype', {initialValue: '9'}]" />
              <a-input type="hidden" v-decorator="['vipid']" />
              <a-input type="hidden" v-decorator="['id']" />
              <a-input type="hidden" v-decorator="['status']" />
              <a-input type="hidden" v-decorator="['unitcode', {initialValue: ''}]" />
              <a-input type="hidden" v-decorator="['unitname', {initialValue: ''}]" />
              <a-input type="hidden" v-decorator="['sex', {initialValue: 0}]" />
              <a-input type="hidden" v-decorator="['sendpointsflag', {initialValue: 1.0}]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </a-card>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import DicSwitch from '@/components/dic-switch'
import AddressSelect from '@/components/address-select'
import moment from "moment"
export default {
	name: 'vip-insure-add-for-com',
	components: { DicSelect, DicSwitch, AddressSelect },
	data () {
		return {
			editable: '',
			dataFormLayout: {
				labelCol: { span: 12 },
				wrapperCol: { span: 12 }
			},
			inputCompact: {
				idcarttype: 0,
				sexValue: 0,
				typeValue: 2,
				maritalstatusValue: 6,
				nationalityValue: 'OS',
				agentcomcodeDisabled: true,
				idcardislongValue: 1,
				dealtypeValue: 1,
				receivetypeValue: 1,
				agentComList: []
			},
			relatedList: [],
			related: {},
			submitLoading: false,
			dataForm: this.$form.createForm(this),
			hasCascadeDefaultProvince: false,
			hasCascadeDefaultCity: false,
			statusType: false
		}
	},
	mounted () {
		this.hasCascadeDefaultProvince = false
		this.hasCascadeDefaultCity = false
	},
	methods: {
		initFormValue (obj) {
			this.hasCascadeDefaultProvince = false
			this.hasCascadeDefaultCity = false
			this.$nextTick(() => {
				this.editable = obj.editable
				if (obj.vipInsure.status !== 1) this.editable = 'view'
				if (!obj.vipInsure.accmanagefee) obj.vipInsure.accmanagefee = 0
				if (!obj.vipInsure.accrelieffee) obj.vipInsure.accrelieffee = 0
				this.relatedList = obj.list
				this.dataForm.setFieldsValue(Object.assign({}, obj.vipInsure, obj.vipInsureOther))
			})
		},
		saveInsure () {
			let that = this
			this.submitLoading = true
			// 校验表单
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.submitLoading = false
					that.$message.error('您填写的数据有误或者必填项没填！')
					return
				}
				if (parseInt(that.dataForm.getFieldValue('accmanagefee')) <= 0) {
					this.submitLoading = false
					that.$message.error('账户管理费必须大于0！')
					return
				}
				if (!this.checkIdCard()) {
					this.submitLoading = false
					return
				}
				debugger

				let vipInsure = Object.assign({ insuretype: 3.0, storetypecode: '2' }, that.dataForm.getFieldsValue(), { mobile: '00000000000' })
				vipInsure.contnostartdate = moment(vipInsure.contnostartdate).format('YYYY-MM-DD')
				vipInsure.contnoenddate = moment(vipInsure.contnoenddate).format('YYYY-MM-DD')
				if (that.editable === 'edit') {
					that.relatedList[0].vipid = vipInsure.vipid
					that.relatedList[0].relatedname = vipInsure.name
					that.relatedList[0].relatedmobile = vipInsure.mobile
					that.relatedList[0].related = vipInsure.vipid
					that.relatedList[0].relatedcode = '1'
					that.relatedList[0].relatedsex = vipInsure.sex
					that.relatedList[0].relatedidcardtype = vipInsure.idcardtype
					that.relatedList[0].relatedidcard = vipInsure.idcard
				} else {
					that.related.vipid = vipInsure.vipid
					that.related.relatedname = vipInsure.name
					that.related.relatedmobile = vipInsure.mobile
					that.related.related = vipInsure.vipid
					that.related.relatedcode = '1'
					that.related.relatedsex = vipInsure.sex
					that.related.relatedidcardtype = vipInsure.idcardtype
					that.related.relatedidcard = vipInsure.idcard
					that.relatedList.push(that.related)
				}
				let vipInsureOther = {}
				vipInsureOther.sendpointsflag = that.dataForm.getFieldValue('sendpointsflag')
				let data = { list: that.relatedList, vipInsure: vipInsure, vipInsureOther: vipInsureOther }
				if (that.editable === 'edit') {
					api.updateInsureInfo(data).then(res => {
						if (res.status === 0) {
							that.$message.success('提交成功')
							that.$emit('callback')
						} else {
							that.$message.error(res.statusText)
						}
					}).finally(() => {
						that.submitLoading = false
					})
				} else {
					api.saveInsureInfo(data).then(res => {
						if (res.status === 0) {
							that.$message.success('提交成功')
							that.dataForm.setFieldsValue({ id: res.data.insureId })
							that.dataForm.setFieldsValue({ vipid: res.data.vipId })
							that.printInsure()
						} else {
							that.$message.error(res.statusText)
						}
					}).finally(() => {
						that.submitLoading = false
					})
				}
			})
		},
		resetInsure () {
			// 重置表单
			this.dataForm.resetFields()
		},
		printInsure () {
			let data = {
				insureId: this.dataForm.getFieldValue('id'),
				vipId: this.dataForm.getFieldValue('vipid'),
				unitName: this.dataForm.getFieldValue('unitname')
			}
			api.vipInsurePrintCom(data).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, '团体客户贴心管家健康保障委托管理购买信息单')
				} else {
					this.$message.error('导出失败')
				}
			})
			// this.dataForm.resetFields()
		},
		refereecodeCheck () {
			let that = this
			api.refereecodeCheck(this.dataForm.getFieldsValue(['refereecode']).refereecode).then(res => {
				if (res.data.flag) {
					let agentchannel = res.data.agentchannelcode
					if (agentchannel === "17") { // 如果是健管直销，可以选择中介公司，否则不可选择
						that.inputCompact.agentcomcodeDisabled = false
						let agentObj = { agentCode: res.data.agentCode, limit: 100000, page: 0 }
						api.queryAgentCom(agentObj).then(rescom => {
							that.inputCompact.agentComList = []
							if (rescom.data.length > 0) {
								rescom.data.map(item => {
									that.inputCompact.agentComList.push({ value: item.agencyunitcode, label: item.agencyunitname })
								})
							}
						})
					} else {
						that.inputCompact.agentcomcodeDisabled = true
						that.inputCompact.agentComList = []
						that.dataForm.setFieldsValue({ agentcomcode: "" })
					}
					that.dataForm.setFieldsValue({ refereename: res.data.agentName })
					that.dataForm.setFieldsValue({ refereemobile: res.data.agentmobile })
					that.dataForm.setFieldsValue({ agentchannel: res.data.agentchannelcode })
					that.dataForm.setFieldsValue({ unitcode: res.data.unitCode })
					that.dataForm.setFieldsValue({ unitname: res.data.unitName })
				} else {
					that.inputCompact.agentcomcodeDisabled = true
					that.inputCompact.agentComList = []
					that.dataForm.setFieldsValue({ agentcomcode: "" })
					that.dataForm.setFieldsValue({ refereename: "" })
					that.dataForm.setFieldsValue({ refereemobile: "" })
					that.dataForm.setFieldsValue({ agentchannel: "" })
					that.dataForm.setFieldsValue({ unitcode: "" })
					that.dataForm.setFieldsValue({ unitname: "" })
					that.$message.warning('无此工号')
				}
			})
		},
		changeMoney () {
			let money = this.dataForm.getFieldsValue(['money']).money
			if (money > 99999999.99) {
				this.$message.error('数据不能超过99999999.99，请重新输入！')
				this.dataForm.setFieldsValue({money: ''})
			}
		},
		checkIdCard () {
			let idCardType = this.dataForm.getFieldValue('emeridcardtype')
			let idCard = this.dataForm.getFieldValue('emeridcard')
			if (idCard === '' || idCard === undefined) return false
			if (parseInt(idCardType) !== 0) return true
			idCard = idCard.toUpperCase()
			this.dataForm.setFieldsValue({emeridcard: idCard})
			// 身份证号校验
			return this.checkIdNumberLogic(idCardType, idCard)
		},
		checkIdNumberLogic (idCardType, idCard) {
			if (parseInt(idCardType) !== 0) {
				return true
			}

			// 身份证号Check标记:0-正常，非0-错误信息
			let idcardFlag = true

			let idCardTemp = idCard
			if (idCardTemp.length === 0) {
				return true
			}

			if (idCardTemp.length !== 15 && idCardTemp.length !== 18) {
				let idcardMsg = "请输入正确的身份证号(15位/18位)"
				this.$message.error(idcardMsg)
				return false
			}

			// 身份号逻辑判断
			let strMessage = this.commonCheckIdNumberLogic(idCardTemp)
			if (strMessage !== "true") {
				this.$message.error(strMessage)
				idcardFlag = false
			} else {
				idcardFlag = true
			}
			return idcardFlag
		},
		commonCheckIdNumberLogic (idcard) {
			let Errors = ["true", "身份证号码位数不对！", "身份证号码出生日期超出范围或含有非法字符！", "身份证号码校验错误！", "身份证号码中地区编码不正确！"]
			let area = {
				11: "北京",
				12: "天津",
				13: "河北",
				14: "山西",
				15: "内蒙古",
				21: "辽宁",
				22: "吉林",
				23: "黑龙江",
				31: "上海",
				32: "江苏",
				33: "浙江",
				34: "安徽",
				35: "福建",
				36: "江西",
				37: "山东",
				41: "河南",
				42: "湖北",
				43: "湖南",
				44: "广东",
				45: "广西",
				46: "海南",
				50: "重庆",
				51: "四川",
				52: "贵州",
				53: "云南",
				54: "西藏",
				61: "陕西",
				62: "甘肃",
				63: "青海",
				64: "宁夏",
				65: "新疆",
				71: "台湾",
				81: "香港",
				82: "澳门",
				91: "国外"
			}
			let Y, JYM, ereg
			let S, M
			let idcardArray = []
			idcardArray = idcard.split('')
			if (idcard.length !== 15 && idcard.length !== 18) return Errors[1]
			if (idcard.substr(0, 6) === "000000" || idcard.substr(0, 6) === "111111" || idcard.substr(0, 6) === "222222" || idcard.substr(0, 6) === "333333" || idcard.substr(0, 6) === "444444" || idcard.substr(0, 6) === "555555" || idcard.substr(0, 6) === "666666" || idcard.substr(0, 6) === "777777" || idcard.substr(0, 6) === "888888" || idcard.substr(0, 6) === "999999") return Errors[4]
			if (idcard.substr(0, 6) === "123456" || idcard.substr(0, 6) === "234567" || idcard.substr(0, 6) === "345678" || idcard.substr(0, 6) === "456789" || idcard.substr(0, 6) === "567890" || idcard.substr(0, 6) === "012345" || idcard.substr(0, 6) === "543210" || idcard.substr(0, 6) === "432109" || idcard.substr(0, 6) === "321098" || idcard.substr(0, 6) === "210987" || idcard.substr(0, 6) === "109876" || idcard.substr(0, 6) === "098765" || idcard.substr(0, 6) === "987654" || idcard.substr(0, 6) === "876543" || idcard.substr(0, 6) === "765432") return Errors[4]
			if (idcard.substr(0, 6) === "121212" || idcard.substr(0, 6) === "131313" || idcard.substr(0, 6) === "141414" || idcard.substr(0, 6) === "151515" || idcard.substr(0, 6) === "161616" || idcard.substr(0, 6) === "171717" || idcard.substr(0, 6) === "181818" || idcard.substr(0, 6) === "191919" || idcard.substr(0, 6) === "101010") return Errors[4]
			if (idcard.substr(0, 6) === "212121" || idcard.substr(0, 6) === "232323" || idcard.substr(0, 6) === "242424" || idcard.substr(0, 6) === "252525" || idcard.substr(0, 6) === "262626" || idcard.substr(0, 6) === "272727" || idcard.substr(0, 6) === "282828" || idcard.substr(0, 6) === "292929" || idcard.substr(0, 6) === "202020") return Errors[4]
			if (idcard.substr(0, 6) === "313131" || idcard.substr(0, 6) === "323232" || idcard.substr(0, 6) === "343434" || idcard.substr(0, 6) === "353535" || idcard.substr(0, 6) === "363636" || idcard.substr(0, 6) === "373737" || idcard.substr(0, 6) === "383838" || idcard.substr(0, 6) === "393939" || idcard.substr(0, 6) === "303030") return Errors[4]
			if (idcard.substr(0, 6) === "414141" || idcard.substr(0, 6) === "424242" || idcard.substr(0, 6) === "434343" || idcard.substr(0, 6) === "454545" || idcard.substr(0, 6) === "464646" || idcard.substr(0, 6) === "474747" || idcard.substr(0, 6) === "484848" || idcard.substr(0, 6) === "494949" || idcard.substr(0, 6) === "404040") return Errors[4]
			if (idcard.substr(0, 6) === "515151" || idcard.substr(0, 6) === "525252" || idcard.substr(0, 6) === "535353" || idcard.substr(0, 6) === "545454" || idcard.substr(0, 6) === "565656" || idcard.substr(0, 6) === "575757" || idcard.substr(0, 6) === "585858" || idcard.substr(0, 6) === "595959" || idcard.substr(0, 6) === "505050") return Errors[4]
			if (idcard.substr(0, 6) === "616161" || idcard.substr(0, 6) === "626262" || idcard.substr(0, 6) === "636363" || idcard.substr(0, 6) === "646464" || idcard.substr(0, 6) === "656565" || idcard.substr(0, 6) === "676767" || idcard.substr(0, 6) === "686868" || idcard.substr(0, 6) === "696969" || idcard.substr(0, 6) === "606060") return Errors[4]
			if (idcard.substr(0, 6) === "717171" || idcard.substr(0, 6) === "727272" || idcard.substr(0, 6) === "737373" || idcard.substr(0, 6) === "747474" || idcard.substr(0, 6) === "757575" || idcard.substr(0, 6) === "767676" || idcard.substr(0, 6) === "787878" || idcard.substr(0, 6) === "797979" || idcard.substr(0, 6) === "707070") return Errors[4]
			if (idcard.substr(0, 6) === "818181" || idcard.substr(0, 6) === "828282" || idcard.substr(0, 6) === "838383" || idcard.substr(0, 6) === "848484" || idcard.substr(0, 6) === "858585" || idcard.substr(0, 6) === "868686" || idcard.substr(0, 6) === "878787" || idcard.substr(0, 6) === "898989" || idcard.substr(0, 6) === "808080") return Errors[4]
			if (idcard.substr(0, 6) === "919191" || idcard.substr(0, 6) === "929292" || idcard.substr(0, 6) === "939393" || idcard.substr(0, 6) === "949494" || idcard.substr(0, 6) === "959595" || idcard.substr(0, 6) === "969696" || idcard.substr(0, 6) === "979797" || idcard.substr(0, 6) === "989898" || idcard.substr(0, 6) === "909090") return Errors[4]

			if (area[parseInt(idcard.substr(0, 2))] === null) return Errors[4]
			switch (idcard.length) {
			case 15:
				if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
					ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/// 测试出生日期的合法性
				} else {
					ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/// 测试出生日期的合法性
				}
				if (ereg.test(idcard)) {
					return Errors[0]
				} else {
					return Errors[2]
				}
			case 18:
				if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/// 闰年出生日期的合法性正则表达式
				} else {
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/// 平年出生日期的合法性正则表达式
				}
				if (ereg.test(idcard)) {
					S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 + (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 + (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 + (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 + (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 + (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 + (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 + parseInt(idcardArray[7]) * 1 + parseInt(idcardArray[8]) * 6 + parseInt(idcardArray[9]) * 3
					Y = S % 11
					M = "F"
					JYM = "10X98765432"
					M = JYM.substr(Y, 1)
					if (M === idcardArray[17]) {
						return Errors[0]
					} else {
						return Errors[3]
					}
				} else {
					return Errors[2]
				}
			default:
				return Errors[1]
			}
		}
	}
}
</script>
