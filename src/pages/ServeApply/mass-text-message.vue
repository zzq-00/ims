<template>
	<a-card :bordered="false">
		<a-card>
			<a-divider orientation="left">
				<a-icon type="mail" /> 群发短信</a-divider>
			<a-form :form="dataForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
				<a-form-item label="手机号录入">
					<a-input placeholder="请注意：手机号之间用英文“,”隔开'" v-decorator="['phone', { rules: [{ required: true, message: '手机号不能为空，多个手机号用英文逗号隔开' }] }]" />
				</a-form-item>
				<a-form-item label="短信内容">
					<a-textarea v-decorator="['content', { rules: [{ required: true, message: '短信内容不能为空' }] }]" :autosize="{ minRows: 6, maxRows: 10 }" />
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 11, offset: 5 }">
					<a-row :gutter="16">
						<a-col :span="24" style="margin:10px 0 0 0;text-align:right">
							<a-button type="" @click="showHistory" class="editable-add-btn" style="float:right;margin-right:10px;">发送历史查询</a-button>
							<a-button type="" @click="resetForm" class="editable-add-btn" style="float:right;margin-right:10px;">重置</a-button>
							<a-button type="primary" :loading="submitLoading" @click="submitForm" class="editable-add-btn" style="float:right;margin-right:10px;">发送</a-button>
						</a-col>
					</a-row>
				</a-form-item>
			</a-form>
		</a-card>

		<MessageHistoryModal ref="messageHistoryModal" />
	</a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import MessageHistoryModal from './components/message-history-modal'
export default {
	name: "mass-text-message",
	components: { MessageHistoryModal },
	data () {
		return {
			dataForm: this.$form.createForm(this),
			submitLoading: false
		}
	},
	mounted () {
	},
	methods: {
		resetForm () {
			this.dataForm.resetFields()
		},
    submitForm () {
      console.log("发送短信……")
      this.dataForm.validateFields((error, values) => {
        if (error) {
          return
        }
        let formData = Object.assign({}, values)
        formData.messL = []
        let phoneArr = formData.phone.split(",")
        let fg = true
        for(let i=0; i<phoneArr.length; i++){
          for(let j=i+1; j<phoneArr.length; j++){
            if(phoneArr[i]==phoneArr[j]){         //第一个等同于第二个，splice方法删除第二个
              console.log("手机号重复")
              return this.$message.error("电话号码：" + phoneArr[j] + "手机号重复！")
            }
          }
        }
        phoneArr.map(item => {
          console.log(item)
          if (!this.validatePhoneNo(item)) {
            fg = false
            this.$message.error("电话号码：" + item + "格式错误！")
          }
          formData.messL.push({
            sendNo: item,
            sendMessage: formData.content,
            sendObjects: "06"
          })
        })
        if (!fg) { // 手机号校验异常
          return
        }
        delete formData.phone
        delete formData.content
        api.sendMassSms(formData).then(res => {
          this.$message.success('发送成功!')
          this.resetForm()
        })
      })
    },
		showHistory () {
			this.$refs.messageHistoryModal.show()
		},

		// 校验电话号码规则
		validatePhoneNo (phoneNo) {
		  let valid = /^1(3|4|5|6|7|8|9)\d{9}$/
		  if (!valid.test(phoneNo)) {
				return false
			} else {
		    return true
			}
		}


	}
}
</script>

