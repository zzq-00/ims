<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="会员姓名">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系方式">
              <a-input v-decorator="['mobile', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡号">
              <a-input v-decorator="['cardno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="交易时间">
              <a-radio-group :options="searchTimeTypeRadioOptions" @change="timeTypeChange" v-decorator="['timetype',{initialValue:'1'}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="开始日期">
              <a-week-picker format="YYYY-MM-DD" v-decorator="['startdate']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="截止日期">
              <a-week-picker format="YYYY-MM-DD" v-decorator="['enddate']"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="6">
            <a-form-item label="收支类型">
              <DicSelect dicType="VIP_FLOWTYPE" v-decorator="[ 'flowtype', {initialValue: ''}]" />
            </a-form-item>
          </a-col> -->
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
        <a-icon type="bank" />收支列表</span>
       <div style="float:right">
        <a-form :form="selectForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="5">
              <a-form-item label="收入">
                <a-input  v-decorator="['addmoney']"/>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="支出">
                <a-input  v-decorator="['submoney']"/>
              </a-form-item>
            </a-col>
            <a-col :span="14">
              <a-form-item label="">
                <a-radio-group @change="searchHandle" :options="searchRadioOptions" v-decorator="['flowtype',{initialValue:'1'}]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">
        <a :style="{'color': (record.money >0? 'red':'blue')}" @click="showRecordInfo(record)" slot="money"
           slot-scope="text, record, index">{{formatMoney(text)}}</a>
      </a-table>
    </a-card>
    <VipProductFlowListDetail ref="vipProductFlowListDetail"/>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import moment from 'moment'
  import VipProductFlowListDetail from "./components/vip-product-flow-list-detail"
  import {formatMoney} from "../../libs/util"

  export default {
    name: 'vip-money-flow-select',
    components: {DicSelect, VipProductFlowListDetail},
    data() {
      return {
        // 查询条件
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        },
        pageData: {
          dataCount: 0,
          data: []
        },
        filterForm: this.$form.createForm(this, {name: "filterForm"}),
        selectForm: this.$form.createForm(this, {name: "selectForm"}),
        Form: this.$form.createForm(this),
        selectedRows: [],
        loading: false,
        showTable: true,
        iconType: 'down',
        searchRadioOptions: [
          {label: '全部', value: '1'},
          {label: '收入', value: '2'},
          {label: '支出', value: '3'}
        ],
        searchTimeTypeRadioOptions: [
          {label: '一周', value: '1'},
          {label: '一个月', value: '2'},
          {label: '三个月', value: '3'}
        ],
			columns: [
				{
					align: "left",
					dataIndex: "name",
					title: "会员"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "merchantname",
					title: "商户"
				},
				{
					align: "left",
					dataIndex: "flowdate",
					title: "交易日期",
					customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
          }
				},
				{
					align: "left",
					dataIndex: "orderno",
					title: "订单号"
				},
				{
					align: "left",
					dataIndex: "note",
					title: "收支说明"
				},
				{
					align: "left",
					dataIndex: "money",
					title: "收支金额",
					scopedSlots: { customRender: 'money' }
				},
				{
					align: "left",
					dataIndex: "accountmoney",
					title: "余额",
					customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "联系方式"
				},
				{
					align: "left",
					dataIndex: "idcard",
					title: "证件号码"
				}
			],
			rowSelection: {
				type: 'radio',
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
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
		this.initDateValue('1')
		// this.searchHandle()
	},
	methods: {
		initDateValue (type) {
      let endD = moment();
      let startD = moment().add(-1, 'weeks');
      if (type === '1') {
        startD = moment().add(-1, 'weeks')
      } else if (type === '2') {
        startD = moment().add(-1, 'months')
      } else if (type === '3') {
        startD = moment().add(-3, 'months')
      }

      this.filterForm.setFieldsValue({
        startdate: startD,
        enddate: endD
      })
    },
    timeTypeChange(e) {
      let type = e.target.value;
      this.initDateValue(type)
    },
    searchHandle() {
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
    },
    loadPageData() {
      if (this.filterForm.getFieldsValue(['name']).name === "" && this.filterForm.getFieldsValue(['idcard']).idcard === "" &&
        this.filterForm.getFieldsValue(['mobile']).mobile === "" && this.filterForm.getFieldsValue(['cardno']).cardno === "") {
        this.$message.warning(
          "请至少输入一个检索条件！"
        );
        return
      }
      let query = this.filterForm.getFieldsValue();
      let queryData = this.selectForm.getFieldsValue();
      let flowtype = queryData.flowtype;
      if (flowtype === "2") {
        // flowtype = 1
        query.flowtype = 1
      } else if (flowtype === "3") {
        // flowtype = -1
        query.flowtype = -1
      } else {
        // flowtype = 0
        query.flowtype = ""
      }
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        flowtype: flowtype
      };
      Object.assign(data, query);
      if (data.startdate) {
        data.startdate = moment(query.startdate).format('YYYY-MM-DD')
      }
      if (data.enddate) {
        data.enddate = moment(query.enddate).format('YYYY-MM-DD')
      }
      var days = Date.parse(data.enddate) - Date.parse(data.startdate);
      if (days < 0) {
        return this.$message.warn('结束日期必须大于开始日期')
      }

      this.loading = true;
      api.qureyFLowDetailList(data).then(res => {
        this.pageData = res.data.gridStore || {totalCount: 0, data: []};
        // console.log('KK', this.pageData.data.gridStore.data)
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        let addmoney = res.data.flowStore.addmoney;
        let submoney = res.data.flowStore.submoney;
        this.selectForm.setFieldsValue({
          addmoney: addmoney,
          submoney: submoney
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
    onPageSizeChange(current, size) {
      this.pagination.pageSize = size;
      this.searchHandle()
    },
    resetFilterForm() {
      this.filterForm.resetFields('name');
      this.filterForm.resetFields('idcard');
      this.filterForm.resetFields('mobile');
      this.filterForm.resetFields('cardno')
      // this.searchHandle()
    },
    swithTableShow() {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
    showRecordInfo(record) {
      let data = {
        orderno: record.orderno,
        id: record.id
      };
      if (record.flowtype === -1) {
        this.$refs.vipProductFlowListDetail.show(data)
      }
    },
    formatMoney(money) {
      return formatMoney(money, 2)
    }
  }
}
</script>
