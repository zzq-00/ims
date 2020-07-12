<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1200" title="账户消费列表" footer>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />收支列表
      </span>
      <div>
        <a-form
          :form="filterForm"
          :labelCol="filterFormLayout.labelCol"
          :wrapperCol="filterFormLayout.wrapperCol"
        >
          <a-row :gutter="16" style="left: 450px">
            <a-col :span="5">
              <a-form-item label="收入">
                <a-input v-decorator="['addmoney']" />
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="支出">
                <a-input v-decorator="['submoney']" />
              </a-form-item>
            </a-col>
            <a-col :span="14">
              <a-form-item label>
                <a-radio-group
                  @change="searchHandle"
                  :options="searchRadioOptions"
                  v-decorator="['flowtype',{initialValue:'1'}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        :bordered="false"
        :pagination="pagination"
        :dataSource="pageData.data"
        :columns="columns"
        :rowKey="record => record.index"
        :indentSize="0"
        :loading="loading"
      >
        <a :style="{'color': (record.money >0? 'red':'blue')}" @click="showRecordInfo(record)" slot="money"
           slot-scope="text, record, index">{{formatMoney(text)}}</a>
      </a-table>
      <VipProductFlowListDetail ref="vipProductFlowListDetail" />
    </a-card>
  </a-modal>
</template>
<script>
  import api from "@/api/api-vip"
  import moment from "moment"
  import VipProductFlowListDetail from "./vip-product-flow-list-detail"
  import {formatMoney} from "../../../libs/util"

  export default {
    name: 'vip-money-flow-list-detail',
    components: {VipProductFlowListDetail},
    data() {
      return {
        formModal: false,
        parentData: {},
        filterFormLayout: {
          labelCol: {span: 7},
          wrapperCol: {span: 13}
        },
        pageData: {
          dataCount: 0,
          data: []
        },
        filterForm: this.$form.createForm(this),
        loading: false,
        pagination: {
          pageSize: 5,
          current: 1,
          total: 0,
          showTotal: total => `共 ${total} 条数据`,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "35", "50"],
          onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
          onChange: (page, pageSize) => this.onPageChange(page, pageSize)
        },
        searchRadioOptions: [
          {label: '全部', value: '1'},
          {label: '收入', value: '2'},
          {label: '支出', value: '3'}
			],
			columns: [
				{
					align: "left",
					dataIndex: "name",
					title: "会员",
					width: '80px'
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号",
					width: '80px',
          ellipsis: 'true'
				},
				{
					align: "left",
					dataIndex: "flowdate",
					title: "交易日期",
					width: '80px',
					customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
          },
          ellipsis: 'true'
        },
        {
          align: "left",
          dataIndex: "orderno",
          title: "订单号",
          width: '80px',
          ellipsis: 'true'
        },
        {
          align: "left",
          dataIndex: "note",
          title: "收支说明",
          width: '80px',
          ellipsis: 'true'
        },
        {
          align: "left",
          dataIndex: "money",
          title: "收支金额",
          width: '80px',
          scopedSlots: {customRender: 'money'},
          ellipsis: 'true'
        },
        {
          align: "left",
          dataIndex: "accountmoney",
          title: "余额",
          width: '80px',
          customRender: (text) => {
            return text ? formatMoney(text, 2) : '0.00'
          },
          ellipsis: 'true'
        },
        {
          align: "left",
          dataIndex: "mobile",
          title: "联系方式",
          width: '80px',
          ellipsis: 'true'
        },
        {
          align: "left",
          dataIndex: "idcard",
          title: "证件号码",
          width: '80px',
          ellipsis: 'true'
        },
        {
          align: "left",
          dataIndex: "merchantname",
          title: "商户",
          width: '80px',
          ellipsis: 'true'
        }
      ]
		}
	},
	methods: {
    show(obj) {
      this.formModal = true;
      this.parentData = obj;
      this.searchHandle()
    },
    searchHandle() {
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
    },
    loadPageData() {
      let query = this.filterForm.getFieldsValue();
      let flowtype = query.flowtype;
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
      this.loading = true;
      api.qureyFLowDetailList(Object.assign(data, query, this.parentData)).then(res => {
        this.pageData = res.data.gridStore || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        let addmoney = res.data.flowStore.addmoney;
        let submoney = res.data.flowStore.submoney;
        this.filterForm.setFieldsValue({
          addmoney: isNaN(parseFloat(addmoney).toFixed(2)) ? '' : formatMoney(addmoney, 2),
          submoney: isNaN(parseFloat(submoney).toFixed(2)) ? '' : formatMoney(submoney, 2)
        });


        this.pagination.total = this.pageData.totalCount
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
<style lang="less" scoped>
  .ant-table-thead > tr > th,
.ant-table-tbody > tr > td{
  padding: 16px 8px;
  word-break:normal;
  white-space: normal;
}
</style>
