<template>
  <div>
    <AppModeal :taskInfo="taskInfo" :statusMap="statusMap"/>
	<QuestionModeal :taskInfo="taskInfo" @on-update="onupdate"/>
</div>
</template>
<script>
import api from '@/api/api-serve-apply'
import AppModeal from '@/pages/ServeApply/components/apply-info-modal'
import QuestionModeal from '@/pages/ServeApply/components/apply-question-modal'
export default {
  components: {AppModeal,QuestionModeal},
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
    onupdate(serviceData) {
      this.$emit('close-parent')
    },
  }
}
</script>
