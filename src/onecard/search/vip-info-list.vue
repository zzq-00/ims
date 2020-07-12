<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="bank" />查询条件
      </a-divider>
      <a-form
        :form="filterForm"
        :labelCol="filterFormLayout.labelCol"
        :wrapperCol="filterFormLayout.wrapperCol"
      >
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
          <a-col :span="12" :offset="11">
            <a-button
              type
              class="editable-add-btn"
              @click="resetFilterForm"
              style="float:right;margin-right:10px;"
            >重置</a-button>
            <a-button
              type
              class="editable-add-btn"
              @click="searchHandle"
              style="float:right;margin-right:10px;"
            >查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <!-- <a-icon type="bank" />会员帐户列表</span> -->
        <a-icon type="bank" />会员信息列表
      </span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button
              type="primary"
              class="editable-add-btn"
              @click="modifyVipInfo"
              style="margin-right:5px;"
            >编辑</a-button>
            <a-button
              type
              class="editable-add-btn"
              @click="modifySms()"
              style="margin-right:5px;"
            >重发短信</a-button>
          </div>
        </a-col>
      </a-row>
      <a-table
        @rowClick="selectRowClick"
        v-show="showTable"
        :bordered="false"
        :pagination="pagination"
        :rowSelection="rowSelection"
        :dataSource="pageData.data"
        :columns="columns"
        :rowKey="record => record.id"
        :indentSize="0"
        :loading="loading"
      ></a-table>
    </a-card>

    <a-card v-if="!loading" style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />投保信息列表
      </span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithSubTableShow" />
      </a>
      <a-table
        v-show="showSubTable"
        :bordered="false"
        :dataSource="currSubList"
        :columns="subcolumns"
        :indentSize="0"
      ></a-table>
    </a-card>
    <VipInfoEdit ref="vipInfoEdit" @callback="changeSubItem" />
    <SendSmsInfo ref="sendSmsInfo" />
  </a-card>
</template>
<script>
  import VipInfoEdit from "./vip-info-edit"
  import SendSmsInfo from "./components/send-sms-info"
  import api from "@/api/api-vip"
  import DicSelect from "@/components/dic-select"
  import moment from "moment"
  import {formatMoney} from "../../libs/util";

  export default {
    name: "vip-info-list",
    components: {DicSelect, VipInfoEdit, SendSmsInfo},
    data() {
      const self = this;
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
			// selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			showSubTable: true,
			iconSubType: "down",
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
					dataIndex: "cardtypename",
					title: "卡类型"
				},
				{
					align: "left",
					dataIndex: "gradetypename",
					title: "会员级别"
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
				}
			],
			rowSelection: {
				type: "radio",
				selectedRowKeys: [],
				selectedRows: [],
				onChange: (selectedRowKeys, selectedRows) => {
          self.rowSelection.selectedRows = [];
          self.rowSelection.selectedRowKeys = [];
          self.rowSelection.selectedRows = selectedRows;
          self.rowSelection.selectedRowKeys = selectedRowKeys;
          self.selectedUser()
        }
			},
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			},
			// currRowIndex: -1,
			currSubList: [],
			subcolumns: [
				{
					align: "left",
					dataIndex: "activitytypeName",
					title: "活动名称",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "unitid",
					title: "机构代码",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "unitname",
					title: "机构名称",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "name",
					title: "姓名",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "sexName",
					title: "性别",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "idcard",
					title: "证件号码",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "手机号",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "typename",
					title: "卡形式",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "salchannelName",
					title: "销售渠道",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "contno",
					title: "保单号",
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "prem",
					title: "保费",
					customRender: text => {
            return text ? "￥" + formatMoney(text, 2) : ""
          },
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "signdate",
					title: "签单日期",
					customRender: text => {
						return text ? moment(text).format("YYYY-MM-DD") : ""
					},
					width: "80px"
				},
				{
					align: "left",
					dataIndex: "customgetpoldate",
					title: "回执日期",
					customRender: text => {
						return text ? moment(text).format("YYYY-MM-DD") : ""
					},
					width: "80px"
				}
			]
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
      if (
        query.name === "" &&
        query.idcard === "" &&
        query.cardno === "" &&
        query.mobile === ""
      ) {
        this.$message.warning("请至少输入一个检索条件!");
        return
      }
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api
        .queryAccountInfoVipAccount(data)
        .then(res => {
          this.pageData = res.data || {totalCount: 0, data: []};
          this.pageData.data.forEach((item, index) => {
            item.recordIndex = index + 1
          });
          this.pagination.total = this.pageData.totalCount
        })
        .finally(() => {
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
      this.iconType = this.showTable ? "down" : "up"
    },
		swithSubTableShow () {
      this.showSubTable = !this.showSubTable;
      this.iconSubType = this.showSubTable ? "down" : "up"
    },
		selectRowClick (record, index) {
			// if (this.currRowIndex === index) {
			// 	this.currRowIndex = -1
			// 	this.rowSelection.selectedRowKeys = []
			// } else {
			// 	this.currRowIndex = index
			// 	this.rowSelection.selectedRowKeys = []
			// 	this.rowSelection.selectedRowKeys.push(index)
			// 	this.selectedUser(record, index)
			// }
		},
		selectedUser () {
      this.currSubList = [];
      console.log(this.rowSelection.selectedRows);
      const {vipid, id} = this.rowSelection.selectedRows[0];
      let data = {
        vipid: vipid,
        id,
        page: 0,
        limit: 0
      };
      api.queryInsureWithGS(data).then(res => {
        this.currSubList = res.data || {totalCount: 0, data: []};
        this.currSubList.forEach((item, index) => {
          item.recordIndex = index + 1
        })
      })
		},
		modifyVipInfo () {
      let self = this;
      console.log(this.rowSelection.selectedRows);
      if (this.rowSelection.selectedRows.length === 0) {
        this.$message.warning("请选择一条会员记录!");
        return
      }
      // 获取选中信息
      let queryInsureInfo = {
        id: this.rowSelection.selectedRows[0].vipid,
        accountid: this.rowSelection.selectedRows[0].id,
        cardcode: this.rowSelection.selectedRows[0].cardtypecode
      };
			// getInsureInfo
			api.getVipInfo(queryInsureInfo).then(res => {
        let cardcode = queryInsureInfo.cardcode;
        debugger
        // TODO
        if (res.status === 0) {
          let vipInsureFormData = Object.assign(
            {
              editable: "edit",
              accountid: this.rowSelection.selectedRows[0].id,
              cardcode: cardcode
            },
            res.data
          );
					self.$refs.vipInfoEdit.show(vipInsureFormData)
				} else {
					self.$message.error("获取数据失败")
				}
			})
		},
		changeSubItem () {
			this.loadPageData()
		},
		modifySms () {
      const {vipid} = this.rowSelection.selectedRows[0];
      this.$refs.sendSmsInfo.show({vipid})
    }
	}
}
</script>
