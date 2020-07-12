<template>
  <div>
	<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="服务处理及查询">
      <div style="margin-left: 10px;">
        <a-steps progress-dot :current="stepIndex" size="small" @change="onStepChange">
          <a-step :status="getStepStatus('01')" title="服务申请" />
          <a-step :status="getStepStatus('02')" title="服务分诊" description="" />
          <a-step :status="getStepStatus('03')" title="服务预约" description="" />
          <a-step :status="getStepStatus('04')" title="服务陪诊" description="" />
          <a-step :status="getStepStatus('05')" title="次日就诊" description="" />
          <a-step :status="getStepStatus('06')" title="服务实施" description="" />
          <a-step :status="getStepStatus('08')" title="服务回访" description="" />
          <a-step :status="getStepStatus('11')" title="疑难处理" description="" />
        </a-steps>
      </div>
      <div class="steps-content">
				<HandleForm01 :taskInfo="extraParams" v-if="stepIndex === 0" />
				<HandleForm02 :taskInfo="extraParams" @stepNext="getserviceApplication" v-if="stepIndex === 1" @on-update="closeForm"/>
				<HandleForm03 :taskInfo="extraParams" @stepNext="getserviceApplication" v-if="stepIndex === 2" @on-update="closeForm"/>
				<HandleForm04 :taskInfo="extraParams" @stepNext="getserviceApplication" v-if="stepIndex === 3" @on-update="closeForm"/>
				<HandleForm05 :taskInfo="extraParams" @stepNext="getserviceApplication" v-if="stepIndex === 4" />
				<HandleForm06 :taskInfo="extraParams" @stepNext="getserviceApplication" v-if="stepIndex === 5" />
				<HandleForm08 :taskInfo="extraParams" :statusMap="handleStatusMap" @stepNext="getserviceApplication" v-if="stepIndex === 6" @close-parent="closeForm"/>
				<HandleForm11 :taskInfo="extraParams" :statusMap="handleStatusMap" @stepNext="getserviceApplication" v-if="stepIndex === 7"  @close-parent="closeForm"/>
      </div>
			<div class="steps-action" v-if="false">
      	<a-button v-if="stepIndex < 8" type="primary" @click="stepIndex++">下一步</a-button>
      	<a-button v-if="stepIndex > 0" style="margin-left: 8px" @click="stepIndex--">上一步</a-button>
      </div>

		<div slot="footer">
			<a-button type="" @click="formModal=false">取消</a-button>
		</div>
    </a-modal>
  </div>
</template>
<script>
import HandleForm01 from './handle/handle-form-01'
import HandleForm02 from './handle/handle-form-02'
import HandleForm03 from './handle/handle-form-03'
import HandleForm04 from './handle/handle-form-04'
import HandleForm05 from './handle/handle-form-05'
import HandleForm06 from './handle/handle-form-06'
import HandleForm08 from './handle/handle-form-08'
import HandleForm11 from './handle/handle-form-11'

import api from '@/api/api-serve-apply'
export default {
	name: 'apply-info-handle',
	components: { HandleForm01, HandleForm02, HandleForm03, HandleForm04, HandleForm05, HandleForm06, HandleForm08, HandleForm11 },
	data () {
		return {
			formModal: false,
			modalWidth: '100%',
			stepIndex: 0,
			extraParams: {},
			handleStatusMap: {},
			statusObj: {
				"01": 0,
				"02": 1,
				"03": 2,
				"04": 3,
				"05": 4,
				"06": 5,
				"08": 6,
				"11": 7
			}


		}
	},
	methods: {
		getStepStatus (ss) {
			if (this.extraParams.status === ss) {
				return 'finish'
			}
			if (this.handleStatusMap[ss]) {
				return 'process'
			}
			return 'wait'
		},
		show (extraParams) {
			this.extraParams = extraParams || {}
			this.formModal = true

			this.loadHandleStatusMap()
			this.stepIndex = this.statusObj[extraParams.status]
			this.$emit("on-update")

			// this.onStepChange();//判断要显示的页面
			if (!this.stepIndex) {
				this.formModal = false
			}
		},
		loadHandleStatusMap () {
			if (!this.extraParams.serviceReservationId) return
			let params = {
				serviceReservationId: this.extraParams.serviceReservationId
			}
			api.queryStatus(params).then(res => {
				this.handleStatusMap = res.data || {}
			})
		},
		onStepChange (current) {
			console.log('current=====', current)
			if (current > this.statusObj[this.extraParams.status]) return
			this.stepIndex = current
		},
		// 获取更新后的预约服务申请表下一步状态
		getserviceApplication (data) {
			// 服务实施节点给data.close赋值，提交之后关闭窗口
			if (data.close) {
				this.closeForm()
			} else {
				this.show(data)
			}
		},
		closeForm () {
			this.formModal = false
			this.$emit("on-update")
		}
		/**
		 * @author john  selectSMInfo短信模板
		 * 根据服务实施状态带出需要展示的短信模板
		 */
		// selectSMInfo(sendMess) {
		// 	var retData;
		// 	$.ajax({
		// 		url: '/picchibm/messageModel/selectSMInfo',
		// 		type: "post",
		// 		contentType: "application/json",
		// 		async: false,
		// 		dataType: "json",
		// 		data: JSON.stringify(sendMess),
		// 		success: function (data) {
		// 			retData = data.sendingInfo;
		// 		}
		// 	});
		// 	return retData;
		// }

	}
}
</script>
<style scoped>
.steps-content {
  margin: 10px 0 0 0;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 400px;
  text-align: center;
}
.steps-action {
  margin-top: 24px;
}
</style>
