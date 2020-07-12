<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="销售渠道">
              <DicSelect dicType="VIP_SHOPPING_SALCHANNEL" v-decorator="[ 'salchannel', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡号">
              <a-input v-decorator="['cardno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员姓名">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="证件类型">
              <DicSelect dicType="VIP_IDCARDTYPE" v-decorator="[ 'idcardtype', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号">
              <a-input v-decorator="['mobile', {initialValue: ''}]" />
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
        <a-icon type="bank"/>已购买服务列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button type="primary" class="editable-add-btn" @click="docancel" style="margin-right:5px;">取消交易</a-button>
          </div>
        </a-col>
      </a-row>
      <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import moment from 'moment'
  import {formatMoney} from "../../libs/util"

  export default {
    name: 'vip-shopping-order-list',
    components: {DicSelect},
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
        filterForm: this.$form.createForm(this),
        loading: false,
        showTable: true,
        iconType: 'down',
        columns: [
          {
            align: "left",
					dataIndex: "salchannelName",
					title: "销售渠道"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "name",
					title: "会员姓名"
				},
				{
					align: "left",
					dataIndex: "orderNo",
					title: "订单号"
				},
				{
					align: "left",
					dataIndex: "producttypename",
					title: "产品类别"
				},
				{
					align: "left",
					dataIndex: "productcode",
					title: "服务编码"
				},
				{
					align: "left",
					dataIndex: "productname",
					title: "服务名称"
				},
				{
					align: "left",
					dataIndex: "price",
					title: "价格",
					customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
				},
				{
					align: "left",
					dataIndex: "purchasedate",
					title: "购买日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "num",
					title: "数量"
				},
				{
					align: "left",
					dataIndex: "totalmoney",
					title: "总价",
					customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
				},
				{
					align: "left",
					dataIndex: "status",
					title: "交易状态",
					customRender: (text) => {
						if (text === 1) {
							return "交易成功"
						} else if (text === 2) {
							return "取消交易"
						}
					}
				},
				{
					align: "left",
					dataIndex: "userTypeName",
					title: "活动名称"
				}
			],
			rowSelection: {
				type: 'radio',
				selectedRows: [],
				selectedRowKeys: [],
				onChange: (selectedRowKeys, selectedRows) => {
          this.rowSelection.selectedRows = [];
          this.rowSelection.selectedRowKeys = [];
          this.rowSelection.selectedRows = selectedRows;
          this.rowSelection.selectedRowKeys = selectedRowKeys
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
		this.searchHandle()
	},
	methods: {
		searchHandle () {
			this.$nextTick(() => {
        this.pagination.current = 1;
        this.rowSelection.selectedRows = [];
        this.rowSelection.selectedRowKeys = [];
        this.loadPageData()
      })
		},
		loadPageData () {
      debugger
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.queryPurchasedserviceManagapi(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.pagination.total = this.pageData.totalCount
      }).finally(() => {
        this.loading = false;
        this.saveForm.resetFields()
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
      this.filterForm.resetFields();
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = []
    },
    swithTableShow() {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
    docancel() {
      if (this.currRowIndex === -1) {
        this.$message.warning('请选择一条会员记录!');
        return
      }
      let self = this;
      this.$confirm({
        title: '确认提示',
        content: `确定取消当前选中的"${self.rowSelection.selectedRows[0].cardno} - ${self.rowSelection.selectedRows[0].orderNo}"项记录吗？`,
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            api.deleteVipshoppingorder(self.rowSelection.selectedRows[0].id).then(res => {
              if (res.status === 0) {
                // let index = self.pageData.data.findIndex(item => (item.id === self.selectedRows[0].id))
                // self.pageData.data.splice(index, 1)
                self.$message.success('取消交易成功');
                self.rowSelection.selectedRows = [];
                self.rowSelection.selectedRowKeys = [];
                self.loadPageData()
              } else {
                self.$message.error('取消交易失败')
              }
            }).finally(() => {
              resolve()
            })
          })
        }
      })
    }
	}
}
</script>
