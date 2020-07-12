<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="1170" title="附属人信息">
      <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-item label="与会员本人关系" class="form-item-label-long">
              <DicSelect :disabled="(editable == 'view')" dicType="VIP_RELATIONSHIP" v-decorator="[ 'relatedcode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
        <a-col :span="8">
          <a-form-item label="姓名">
            <a-input :disabled="(editable == 'view')" v-decorator="['relatedname',{rules: [{ required: true, message: '姓名不能为空!' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="证件类型">
            <DicSelect :disabled="(editable == 'view')" dicType="VIP_IDCARDTYPE" v-decorator="[ 'relatedidcardtype',{rules: [{ required: true, message: '请选择证件类型!' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="证件号码">
            <a-input :disabled="(editable == 'view')" v-decorator="['relatedidcard',{rules: [{ required: true, message: '证件号码不能为空!' }]}]" @blur="checkIdCard "/>
          </a-form-item>
        </a-col>
      </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="出生日期">
              <a-week-picker :disabled="(editable == 'view')" format="YYYY-MM-DD"
                             v-decorator="['relatedbirthday', {rules: [{ required: true, message: '出生日期不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别">
              <DicSelect :disabled="(editable == 'view')" dicType="VIP_SEX" v-decorator="[ 'relatedsex',{rules: [{ required: true, message: '请选择性别!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="移动电话">
              <a-input :disabled="(editable == 'view')" v-decorator="['relatedmobile',{rules: [{ required: true, message: '移动电话不能为空!' }]}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item class="form-item-label-long" label="证件长期有效">
              <DicSelect :disabled="(editable == 'view')" dicType="VIP_IDCARDISLONG" v-decorator="[ 'idcardislong']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item class="form-item-label-long" label="证件有效期始">
              <a-week-picker :disabled="(editable == 'view')" format="YYYY-MM-DD" v-decorator="['idcardstart']"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item class="form-item-label-long" label="证件有效期止">
              <a-week-picker :disabled="dataForm.getFieldValue('idcardislong') === '1' ||editable === 'view'"
                             format="YYYY-MM-DD" v-decorator="['idcardend']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-input type="hidden" v-decorator="['accountid']" />
          <a-input type="hidden" v-decorator="['vipid']" />
          <a-input type="hidden" v-decorator="['id']" />
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import moment from 'moment'

export default {
	name: 'vip-account-related-edit',
	components: { DicSelect },
	data () {
		return {
			formModal: false,
			editable: '',
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			submitLoading: false,
			dataForm: this.$form.createForm(this)
		}
	},
	methods: {
		// 校验身份证号
		checkIdCard () {
			let idCardType = this.dataForm.getFieldValue('relatedidcardtype')
			let idCard = this.dataForm.getFieldValue('relatedidcard')
			if (idCard === '' || idCard === undefined) return false
			if (parseInt(idCardType) !== 0) return true
			idCard = idCard.toUpperCase()
			this.dataForm.setFieldsValue({idcard: idCard})
			// 身份证号校验
			let idcardFlag = this.checkIdNumberLogic(idCardType, idCard)
			if (idcardFlag) {
				// 根据身份证号取得性别和出生日期
				this.addBirthdayAndSex()
			}
			return idcardFlag
		},
		addBirthdayAndSex () {
			let sex = ''
			let xingbie = ''
			let year = ''
			let month = ''
			let day = ''
			// 出生日期，性别
			let obj = this.dataForm.getFieldValue('relatedidcard')
			if (obj.length === 15) {
				year = obj.substr(6, 2)
				month = obj.substr(8, 2)
				day = obj.substr(10, 2)
				xingbie = obj.substr(14, 1)
				if (xingbie % 2 === 0) {
					sex = "1"// "女性";
				} else {
					sex = "0"// "男性";
				}
				year = "19" + year
			} else if (obj.length === 18) {
				year = obj.substr(6, 4)
				month = obj.substr(10, 2)
				day = obj.substr(12, 2)
				xingbie = obj.substr(16, 1)
				if (xingbie % 2 === 0) {
					sex = "1"// "女性";
				} else {
					sex = "0"// "男性";
				}
			}
			let birthday = year.toString() + '-' + month + '-' + day.toString()
			this.dataForm.setFieldsValue({relatedsex: sex, relatedbirthday: moment(birthday, 'YYYY-MM-DD')})
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
		},
		show (obj) {
			this.formModal = true
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(obj)
			})
		},
		submitForm () {
			let self = this
			this.dataForm.validateFields((error, values) => {
				console.log(error, values)
				if (error) {
					this.$message.error("您填写的数据有误或者必填项没填！")
					return
				}
				if (!this.checkIdCard()) {
					return
				}

				self.submitLoading = true
				api.updateVipRelated(values).then(res => {
					if (res.status === 0) {
						// 更新列表数据
						self.$message.success('修改成功')
						self.$emit('callback')
						self.formModal = false
					} else {
						self.$message.error(res.statusText)
					}
				}).finally(() => {
					self.submitLoading = false
				})
			})
		}
	}

}
</script>
<style>

</style>
