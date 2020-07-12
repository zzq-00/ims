<template>
	<div>
		<a-card>
			<a-divider orientation="left">
				<a-icon type="file-search" /> 查询条件</a-divider>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :span="16">
					<a-col :span="6">
						<a-form-item label="健管卡代码">
							<HealthCardSelect v-decorator="['docDefId',{rules:[{required:true,message:'请选择建管卡代码'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="失效起期">
							<a-date-picker format="YYYY-MM-DD" v-decorator="['delayStartDate', {}]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="失效止期">
							<a-date-picker format="YYYY-MM-DD" v-decorator="['delayEndDate', {}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="16" :offset="13">
						<a-form-item>
							<a-button type="" htmlType="submit" @click="resetFilterForm"
								style="float:right;margin-right:10px;">重置</a-button>
							<a-button type="primary" html-type="submit" @click="submitQuery"
								style="float:right;margin-right:10px;">查询</a-button>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:20px">
			<HealthCardTable ref="table" @changeRowKeys="changeRowKeys" @SuccessGetData="getDatadocDefId" />
		</a-card>
		<a-card style="margin-top:20px">
			<a-form :form="filterForms" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :span="16">
					<a-col :span="8">
						<a-form-item label="变更后失效日期">
							<a-date-picker :disabledDate="disabledDate" format="YYYY-MM-DD"
								v-decorator="['confirmDate', { rules:[{required: true,message:'请选择变更后失效日期'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="10" :offset="5">
						<a-button type="primary" htmlType="submit" :loading="loading1" @click="submitAll"
							style="float:right;margin-right:10px;">全部确认</a-button>
						<a-button type="primary" htmlType="submit" :loading="loading" @click="submit"
							style="float:right;margin-right:10px;">确认</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
	</div>
</template>
<script>
	import HealthCardSelect from '@/components/health-card-select'
	import HealthCardTable from './components/table-component.vue'
	import api from '@/api/api-health-card-continue'
	import moment from "moment"
	export default {
		data() {
			return {
				// 查询条件
				filterFormLayout: {
					labelCol: { span: 9 },
					wrapperCol: { span: 15 }
				},
				filterForm: this.$form.createForm(this),
				filterForms: this.$form.createForm(this),
				rows: [],
				pageData: [],
				datadocDefId: '',
				datadelayEndDate: '',
				datadelayStartDate: '',
				loading: false,
				loading1: false
			}
		},
		components: {
			HealthCardSelect,
			HealthCardTable
		},
		mounted() {
			let params = this.$route.params
			console.log('params:')
			console.log(params)
			params.docDefId ? this.initValue(params) : ''
		},
		methods: {
			initValue(params) {
				this.$nextTick(() => {
					let yesDate = moment(new Date(), "YYYY-MM-DD").subtract(1, 'days')
					const querys = {
						delayStartDate: params.delayStartDate ? moment(params.delayStartDate, "YYYY-MM-DD") : '',
						delayEndDate: yesDate.format("YYYY-MM-DD"),
						docDefId: params.docDefId
					}
					this.filterForm.setFieldsValue(querys)
					this.$refs.table.initValue(querys)
				})
			},
			resetFilterForm() {
				this.filterForm.resetFields()
				// this,submitQuery ()
			},
			// 获取当前表格数据的查询条件
			getDatadocDefId(query) {
				this.datadocDefId = query.docDefId
				this.datadelayEndDate = query.delayEndDate
				this.datadelayStartDate = query.delayStartDate
				console.log(this.datadocDefId)
			},
			// 获取列表选中的列以及表格数据
			changeRowKeys(rows, data) {
				this.rows = rows
				this.pageData = data
			},
			submitQuery() {
				this.filterForm.validateFields(err => {
					if (!err) {
						this.$nextTick(() => {
							let query = this.filterForm.getFieldsValue()
							query.delayStartDate = query.delayStartDate ? moment(query.delayStartDate).format('YYYY-MM-DD') : ''
							query.delayEndDate = query.delayEndDate ? moment(query.delayEndDate).format('YYYY-MM-DD') : ''
							this.$refs.table.initValue(query)
						})
					} else {
						this.$message.error('请选择建管卡代码!')
					}
				})
			},
			submit() {
				this.filterForms.validateFields(err => {
					if (!err) {
						let RowKeys = JSON.parse(JSON.stringify(this.rows))
						let pageData = JSON.parse(JSON.stringify(this.pageData))
						const data = []
						const query = this.filterForms.getFieldsValue()
						let confirmDate = moment(query.confirmDate).format('YYYY-MM-DD') + ' 00:00:00'
						RowKeys.map((item, index) => {
							let items = pageData.filter(items => item === items.docId)[0]
							items.confirmDate = confirmDate
							items.invalidDate && items.invalidDate.length < 11 ? items.invalidDate = items.invalidDate + ' 00:00:00' : ''
							items.statusDate && items.statusDate.length < 11 ? items.statusDate = items.statusDate + ' 00:00:00' : ''
							data.push(items)
						})
						data.length > 0 ? this.submitAjax(data) : this.$message.error('请选择数据进行提交!')
					} else {
						this.$message.error('请选择变更后失效日期!')
					}
				})
			},
			submitAll() {
				this.filterForms.validateFields(err => {
					if (!err) {
						this.datadocDefId ? this.submitAllAjax() : this.$message.error('请先查询数据!')
					} else {
						this.$message.error('请选择变更后失效日期!')
					}
				})
			},
			submitAjax(data) {
				this.loading = true
				api.submit1(data).then(res => {
					this.submitQuery()
					console.log(res.data)
					this.$message.success(`成功${res.data.results.length}条，失败0条!`)
				}).finally(() => {
					this.loading = false
				})
			},
			submitAllAjax() {
				this.loading1 = true
				const query = this.filterForms.getFieldsValue()
				let confirmDate = moment(query.confirmDate).format('YYYY-MM-DD') + ' 00:00:00'
				let data = {
					confirmDate: confirmDate,
					delayEndDate: this.datadelayEndDate,
					delayStartDate: this.datadelayStartDate,
					docDefId: this.filterForm.getFieldValue('docDefId')
				}
				//   console.log(data)
				api.submitAll(data).then(res => {
					console.log(res)
					this.$message.success(`${res.data.msg}条提交成功!`)
					this.submitQuery()
				}).finally(() => {
					this.loading1 = false
				})
			},
			//不可选日期
			disabledDate(current) {
				return current < moment(new Date(), 'YYYY-MM-DD')- 8.64e7;
			}
		}
	}
</script>
<style lang="">

</style>