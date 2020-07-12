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
            <a-form-item label="查询范围">
              <DicSelect dicType="CARDHOLDERFLAG_LIST" v-decorator="[ 'cardholderflag', {initialValue: ''}]" />
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
        <a-icon type="bank" />会员帐户列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button type="primary" class="editable-add-btn" @click="cardActive" style="margin-right:5px;">激活</a-button>
            <!-- <a-button type="primary" class="editable-add-btn" @click="cardAgainActive" style="margin-right:5px;">换卡激活</a-button> -->
          </div>
        </a-col>
      </a-row>
      <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">
        <a @click="showRecordInfo_M(record)" slot="money" slot-scope="text, record, index">{{'￥' +
          formatMoney(text)}}</a>
        <a slot="couponcnt" @click="showRecordInfo_SC(record)" slot-scope="text, record, index">{{text}}</a>
        <a @click="showRecordInfo_SP(record)" slot="points" slot-scope="text, record, index">{{formatPoints(text)}}</a>
        <a slot="gradetypename" @click="showRecordInfo_SS(record)" slot-scope="text, record, index">{{text}}</a>
        <a slot="relatedcnt" @click="showRecordInfo_SR(record)" slot-scope="text, record, index">{{text}}</a>
      </a-table>
    </a-card>
    <VipMoneyFlowListDetail ref="vipMoneyFlowListDetail"/>
    <VipAccountShowCouponListDetail ref="vipAccountShowCouponListDetail"/>
    <VipAccountShowPointListDetail ref="vipAccountShowPointListDetail"/>
    <VipAccountShowServiceListDetail ref="vipAccountShowServiceListDetail"/>
    <VipAccountShowRelatedListDetail ref="vipAccountShowRelatedListDetail"/>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import VipMoneyFlowListDetail from "./components/vip-money-flow-list-detail"
  import VipAccountShowCouponListDetail from "./components/vip-account-show-coupon-list-detail"
  import VipAccountShowPointListDetail from "./components/vip-account-show-point-list-detail"
  import VipAccountShowServiceListDetail from "./components/vip-account-show-service-list-detail"
  import VipAccountShowRelatedListDetail from "./components/vip-account-show-related-list-detail"
  import {formatMoney} from "../../libs/util"

  export default {
    name: 'vip-account-related-new-list',
    components: {
      DicSelect,
      VipMoneyFlowListDetail,
      VipAccountShowCouponListDetail,
      VipAccountShowPointListDetail,
      VipAccountShowServiceListDetail,
      VipAccountShowRelatedListDetail
    },
    data() {
      return {
        // 查询条件
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        },
        accountGradeTypeList: [],
			accountCardTypeList: [],
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
					title: "会员姓名"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "idcardtypeName",
					title: "证件类型"
				},
				{
					align: "left",
					dataIndex: "idcard",
					title: "证件号"
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "联系方式"
				},
				{
					align: "left",
					dataIndex: "money",
					title: "账户余额",
					scopedSlots: { customRender: 'money' }
				},
				{
					align: "left",
					dataIndex: "couponcnt",
					title: "卡券数",
					scopedSlots: { customRender: 'couponcnt' }
				},
				{
					align: "left",
					dataIndex: "points",
					title: "积分",
					scopedSlots: { customRender: 'points' }
				},
				{
					align: "left",
					dataIndex: "cardtypename",
					title: "卡类型"
				},
				{
					align: "left",
					dataIndex: "gradetypename",
					title: "会员级别",
					scopedSlots: { customRender: 'gradetypename' }
				},
				{
					align: "left",
					dataIndex: "typeName",
					title: "卡形式"
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "账户状态"
				},
				{
					align: "left",
					dataIndex: "unitname",
					title: "发卡机构"
				}, {
					align: "left",
					dataIndex: "usertypeName",
					title: "活动名称"
				},
				{
					align: "left",
					dataIndex: "relatedcnt",
					title: "附属人",
					scopedSlots: { customRender: 'relatedcnt' }
				},
				{
					align: "left",
					dataIndex: "cardholderflagName",
					title: "是否是持卡人",
					scopedSlots: { customRender: 'cardholderflagName' }
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
		// this.searchHandle()
	},
	methods: {
		searchHandle () {
			this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
		},
		loadPageData () {
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.queryAccountByRelated(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.pagination.total = this.pageData.totalCount
      }).finally(() => {
        this.loading = false
      })
    },
		onPageChange (page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
		onPageSizeChange (current, size) {
      this.pagination.pageSize = size;
      this.searchHandle()
    },
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		swithTableShow () {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
		formatMoney (money) {
      return formatMoney(money, 2)
    },
		cardActive () {
      if (this.currRowIndex === -1) {
        this.$message.warning('请选择一条会员记录!');
        return
      }
      if (this.selectedRows[0].status !== 2) {
        this.$message.warning('请选择待激活状态会员!');
        return
      }
      let self = this;
      this.$confirm({
        title: '确认提示',
        content: `确定激活当前选中的"${self.selectedRows[0].cardno} - ${self.selectedRows[0].name}"项记录吗？`,
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            api.cardActive(self.selectedRows[0]).then(res => {
              if (res.status === 0) {
                let index = self.pageData.data.findIndex(item => item.id === self.selectedRows[0].id);
                self.pageData.data[index].status = 3;
                self.pageData.data[index].statusName = '已激活';
                self.$message.success('激活成功')
              } else {
								self.$message.error('激活失败')
							}
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		cardAgainActive () {
      if (this.currRowIndex === -1) {
        this.$message.warning('请选择一条会员记录!');
        return
      }
      if (this.selectedRows[0].changecardnoflag !== 1) {
        this.$message.warning('账户状态不是换卡状态!');
        return
      }
      let self = this;
      this.$confirm({

        title: '确认提示',
        content: `确定对当前选中的"${self.selectedRows[0].cardno} - ${self.selectedRows[0].name}"进行换卡激活吗？`,
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            api.cardActive(self.selectedRows[0]).then(res => {
              if (res.status === 0) {
                let index = self.pageData.data.findIndex(item => item.id === self.selectedRows[0].id);
                self.pageData.data[index].status = 3;
                self.pageData.data[index].statusName = '已激活';
                self.$message.success('激活成功')
              } else {
								self.$message.error('激活失败')
							}
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		loadGradeTypeList () {
      let self = this;
      api.queryVipGradeType().then(res => { // TODO
        self.accountGradeTypeList = [];
        if (res.data.length > 0) {
          res.data.map(item => {
            self.accountGradeTypeList.push({value: item.code, label: item.name})
          })
        }
      })
    },
		loadCardTypeList () {
      let self = this;
      api.queryVipCardType().then(res => { // TODO
        self.accountCardTypeList = [];
        if (res.data.length > 0) {
          res.data.map(item => {
            self.accountCardTypeList.push({value: item.code, label: item.name})
          })
        }
      })
    },
		showRecordInfo_M (record) {
      let data = {
        accountid: record.id
      };
			this.$refs.vipMoneyFlowListDetail.show(data)
		},
		showRecordInfo_SP (record) {
      let data = {
        accountid: record.id,
        paymenttype: "1"
      };
			this.$refs.vipAccountShowPointListDetail.show(data)
		},
		showRecordInfo_SR (record) {
      let data = {
        accountid: record.id

      };
			this.$refs.vipAccountShowRelatedListDetail.show(data)
		},
		showRecordInfo_SS (record) {
      let data = {
        accountid: record.id,
        vipid: record.vipid
      };
      this.$refs.vipAccountShowServiceListDetail.show(data)
    },
    showRecordInfo_SC(record) {
      let data = {
        accountid: record.id,
        status: "1"
      };
      this.$refs.vipAccountShowCouponListDetail.show(data)
    },
    formatPoints(point) {
      return formatMoney(point)
    }
  }
}
</script>
