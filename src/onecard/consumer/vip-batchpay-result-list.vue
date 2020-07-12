<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="姓名">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="月份">
              <a-week-picker format="yyyy-MM"
                             v-decorator="['monthdate', {rules: [{ required: true, message: '月份不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />批量支付结果列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table :scroll="{x: 3000}" :bordered="false" :columns="columns" :dataSource="pageData.data" :indentSize=0 :loading="loading" :pagination="pagination" :rowKey="index => index.index" v-show="showTable">

      </a-table>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import moment from 'moment'
import {formatMoney} from '@/libs/util'
export default {
	name: 'vip-batchpay-result-list',
	components: { DicSelect },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: 'down',
			columns: [
				{
					align: "left",
					dataIndex: "name",
					title: "姓名"
				},
				{
					align: "left",
					dataIndex: "idcard",
					title: "证件号"
				},
				{
					align: "left",
					dataIndex: "monthdate",
					title: "月份"
				},
				{
					align: "left",
					dataIndex: "day1Name",
					title: "1日"
				},
				{
					align: "left",
					dataIndex: "day2Name",
					title: "2日"
				},
				{
					align: "left",
					dataIndex: "day3Name",
					title: "3日"
				},
				{
					align: "left",
					dataIndex: "day4Name",
					title: "4日"
				},
				{
					align: "left",
					dataIndex: "day5Name",
					title: "5日"
				},
				{
					align: "left",
					dataIndex: "day6Name",
					title: "6日"
				},
				{
					align: "left",
					dataIndex: "day7Name",
					title: "7日"
				},
				{
					align: "left",
					dataIndex: "day8Name",
					title: "8日"
				},
				{
					align: "left",
					dataIndex: "day9Name",
					title: "9日"
				},
				{
					align: "left",
					dataIndex: "day10Name",
					title: "10日"
				},
				{
					align: "left",
					dataIndex: "day11Name",
					title: "11日"
				},
				{
					align: "left",
					dataIndex: "day12Name",
					title: "12日"
				},
				{
					align: "left",
					dataIndex: "day13Name",
					title: "13日"
				},
				{
					align: "left",
					dataIndex: "day14Name",
					title: "14日"
				},
				{
					align: "left",
					dataIndex: "day15Name",
					title: "15日"
				},
				{
					align: "left",
					dataIndex: "day16Name",
					title: "16日"
				},
				{
					align: "left",
					dataIndex: "day17Name",
					title: "17日"
				},
				{
					align: "left",
					dataIndex: "day18Name",
					title: "18日"
				},
				{
					align: "left",
					dataIndex: "day19Name",
					title: "19日"
				},
				{
					align: "left",
					dataIndex: "day20Name",
					title: "20日"
				},
				{
					align: "left",
					dataIndex: "day21Name",
					title: "21日"
				},
				{
					align: "left",
					dataIndex: "day22Name",
					title: "22日"
				},
				{
					align: "left",
					dataIndex: "day23Name",
					title: "23日"
				},
				{
					align: "left",
					dataIndex: "day24Name",
					title: "24日"
				},
				{
					align: "left",
					dataIndex: "day25Name",
					title: "25日"
				},
				{
					align: "left",
					dataIndex: "day26Name",
					title: "26日"
				},
				{
					align: "left",
					dataIndex: "day27Name",
					title: "27日"
				},
				{
					align: "left",
					dataIndex: "day28Name",
					title: "28日"
				},
				{
					align: "left",
					dataIndex: "day29Name",
					title: "29日"
				},
				{
					align: "left",
					dataIndex: "day30Name",
					title: "30日"
				},
				{
					align: "left",
					dataIndex: "day31Name",
					title: "31日"
				}
			],
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
		}
	},
	mounted () {

	},
	methods: {
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		loadPageData () {
			this.filterForm.validateFields((error, values) => { // TODO
				if (error) {
					return
				}

				let query = values
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}
				Object.assign(data, query)
				this.loading = true
				api.queryBatchpayList(data).then(res => {
					this.pageData = res.data ? { totalCount: res.data.length, data: res.data } : { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => {
				  	item.recordIndex = index + 1
					})
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			})
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		}
	}
}
</script>
