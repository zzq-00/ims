<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="800" title="修改密码">
      <a-tabs @change="changeTabs">
        <a-tab-pane tab="原密码修改" key="1">
          <a-form :form="dataForm1" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
            <a-spin :spinning="spinning"/>
            <a-row>
              <a-col :span="24">
                <a-form-item label="原支付密码">
                  <a-input type="password" v-decorator="['oldpassword', {initialValue: '',rules: [{ required: true, message: '请填写原支付密码'},{min: 6, message: '该输入项的最小长度为6”' }]}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="新支付密码">
                  <a-input type="password" v-decorator="['newpassword', {rules: [{ required: true, message: '新支付密码不能为空'},{min: 6, message: '该输入项的最小长度为6”' },{ validator: this.checkPass }]}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="确认新支付密码">
                  <a-input type="password" v-decorator="['confirmpassword', {rules: [{ required: true, message: '确认新支付密码不能为空' },{min: 6, message: '该输入项的最小长度为6”' },{ validator: this.checkPass2 }]}]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="验证码修改" key="2">
          <a-form :form="dataForm2" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
            <a-spin :spinning="spinning"/>
            <a-row>
              <a-col :span="24">
                <a-form-item label="手机号">
                  <a-input :disabled="true" v-decorator="['mobile', {rules: [{ required: true, message: '请填写手机号' }]}]" />
                  <a-button :disabled="sendbtndisabled" class="editable-add-btn" @click="sendYZM" style="margin-right:5px;">{{ (sendbtndisabled)?'(' + this.countTime + ')秒后，重新发送':'发送验证码'}}</a-button>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="短信验证码">
                  <a-input v-decorator="['yzmcode', {rules: [{ required: true, message: '验证码不能为空' }]}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="新支付密码">
                  <a-input type="password" v-decorator="['newpassword', {rules: [{ required: true, message: '请填写新支付密码' },{min: 6, message: '该输入项的最小长度为6”' },{ validator: this.checkPass }]}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="确认新支付密码">
                  <a-input type="password" v-decorator="['confirmpassword', {rules: [{ required: true, message: '请再次输入新支付密码' },{min: 6, message: '该输入项的最小长度为6”' },{ validator: this.checkPass2 }]}]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <div slot="footer">
        <a-button type="" @click="close">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitForm">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-vip'
import crypto from 'crypto'

export default {
	name: 'update-pwd',
	data () {
		return {
			dataFormLayout: {
				labelCol: {span: 5},
				wrapperCol: {span: 15}
			},
			submitLoading: false,
			spinning: false,
			formModal: false,
			parentData: {},
			updatetype: '1',
			countTime: 60, // 秒
			sendbtndisabled: false,
			dataForm1: this.$form.createForm(this),
			dataForm2: this.$form.createForm(this),
			extraParam2: {}
		}
	},
	mounted () {
	},
	methods: {
		show (obj) {
			this.formModal = true
			this.parentData = obj

			this.dataForm1.resetFields()
			this.dataForm2.resetFields()
			this.extraParam2.mobile = obj.mobile

			this.$nextTick(() => {
				this.dataForm2.setFieldsValue({mobile: obj.mobile})
			})
		},
		close () {
			this.formModal = false
		},
		checkPass (rule, value, callback) {
			let { validateFields } = (this.updatetype === '1') ? this.dataForm1 : this.dataForm2
			if (value) {
				validateFields(['confirmpassword'], { force: true })
			}
			callback()
		},

		checkPass2 (rule, value, callback) {
			let { getFieldValue } = (this.updatetype === '1') ? this.dataForm1 : this.dataForm2
			if (value && value !== getFieldValue('newpassword')) {
				callback(new Error('两次输入密码不一致！'))
			} else {
				callback()
			}
		},
		changeTabs (key) {
			this.updatetype = key
			if (key === '2') {
				this.$nextTick(() => {
					this.dataForm2.setFieldsValue({
						mobile: this.extraParam2.mobile
					})
				})
			}
		},
		submitForm () {
			if (this.updatetype === '1') {
				this.dataForm1.validateFields((error, values) => {
					if (error) {
						this.$message.error('您填写的数据有误或者必填项没填！')
						return
					}
					const Md5 = crypto.createHash('md5')
					Md5.update(values.oldpassword)
					let oldpassword = Md5.digest('HEX')
					values.oldpassword = oldpassword.toUpperCase()
					this.saveForm(Object.assign({updatetype: this.updatetype}, this.parentData, values))
				})
			} else if (this.updatetype === '2') {
				this.dataForm2.validateFields((error, values) => {
					if (error) {
						this.$message.error('您填写的数据有误或者必填项没填！')
						return
					}
					this.saveForm(Object.assign({updatetype: this.updatetype}, this.parentData, values))
				})
			}
		},
		/* saveForm (data) {
      debugger
      let self = this
      this.submitLoading = true
      api.resetPwdUpdatePwd(data).then(res => {
        if (res.status === 0) {
          self.$message.success('密码修改成功')
          self.close()
        } else {
          self.$message.error('密码修改失败')
        }
      }).finally(() => {
        self.submitLoading = false
      })
    }, */
		saveForm (data) {
			let self = this
			// this.submitLoading = true
			const md5 = crypto.createHash('md5')
			md5.update(data.newpassword)
			let md5password = md5.digest('HEX')
			data.newpassword = md5password.toUpperCase()
			data.confirmpassword = md5password.toUpperCase()
			api.resetPwdUpdatePwd(data).then(res => {
				debugger
				if (res.status === 0) {
					self.$message.success('密码修改成功')
					self.close()
				} else {
					self.$message.error('修改密码失败，原密码不正确！')
				}
			}).finally(() => {
				self.submitLoading = false
			})
		},
		sendYZM () {
			if (!this.dataForm2.getFieldsValue(['mobile']).mobile) {
				this.$message.warning('请输入手机号')
				return
			}
			this.sendbtndisabled = true
			let self = this
			let data = {
				mobile: this.dataForm2.getFieldsValue(['mobile']).mobile
			}
			api.sendYzmcode(Object.assign(data, this.parentData)).then(res => {
				if (res.status === 0) {
					self.countDown()
				} else {
					self.sendbtndisabled = false
					self.$message.error('发送失败')
				}
			}).catch((e) => {
				self.sendbtndisabled = false
				self.$message.error('发送失败')
			})
		},
		// 倒计时
		countDown () {
			if (this.sendbtndisabled && (this.countTime > 0 && this.countTime <= 60)) { // 当为0的时候，liked设置为true，button按钮显示内容为 获取验证码
				this.countTime = this.countTime - 1
				setTimeout(() => this.countDown(), 1000)// 每一秒调用一次
			} else {
				this.sendbtndisabled = false
				this.countTime = 60
			}
		}

	}
}
</script>
<style>

</style>
