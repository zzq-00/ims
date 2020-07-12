<template>
  <div>
    <AppModal :taskInfo="taskInfo"  :statusMap="statusMap" />
	<ReportModal :taskInfo="taskInfo" @on-closeed="closeParent"/>
	<QuestionModal :taskInfo="taskInfo" @on-update="closeParent"/>
</div>
</template>
<script>
import api from '@/api/api-serve-apply'
import AppModal from '@/pages/ServeApply/components/apply-info-modal'
import QuestionModal from '@/pages/ServeApply/components/apply-question-modal'
import ReportModal from '@/pages/ServeApply/components/apply-report-modal'
export default {
  components: {AppModal,QuestionModal,ReportModal},
	props: {
		taskInfo: {
			type: Object,
			default () {
				return {}
			}
		},
		statusMap: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			status: false, // 是否可点击 控制实施的全局
			filterForm: this.$form.createForm(this),
			uploading: false
		}
	},
	mounted () {
	},
	methods: {
    closeParent(){
      this.$emit('close-parent')
    }
  }
}
</script>
