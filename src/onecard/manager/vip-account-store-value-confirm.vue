<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="会员名字">
              <a-input v-decorator="['payername', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <DicSelect dicType="VIP_IDCARDTYPE" v-decorator="[ 'idcardtype', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="购买状态">
              <DicSelect dicType="INSURESTATUS" v-decorator="[ 'status', {initialValue: '1'}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="确认类型">
              <DicSelect dicType="VIP_CONFIRMTYPE" v-decorator="[ 'confirmType', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 购买列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow"/>
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
           <!-- <a-button @click="deleteStore" class="editable-add-btn" style="margin-right:5px;" type="">删除</a-button>-->
            <a-button type="primary" class="editable-add-btn" @click="appleConfirm" style="margin-right:5px;">缴费确认
            </a-button>
          </div>
        </a-col>
      </a-row>
      <a-table :bordered="false" :columns="columns" :dataSource="pageData.data" :indentSize=0 :loading="loading"
               :pagination="pagination" :rowKey="record => record.id" :rowSelection="rowSelection" :scroll="{ x: 'max-content'}"
               @rowClick="selectRowClick" v-show="showTable">

      </a-table>
    </a-card>
    <ConfirmForm ref="confirmForm"  @callback="searchHandle()"/>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import ConfirmForm from "./components/confirm-form"
  import moment from 'moment'
  import {formatMoney} from '@/libs/util'

  export default {
    name: 'vip-account-store-value-confirm',
    components: {DicSelect, ConfirmForm},
    data() {
      return {
        // 查询条件
        filterForm: this.$form.createForm(this),
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        },
        pageData: {
          dataCount: 0,
          data: []
        },
        /*		selectedRows: [], */
        loading: false,
        showTable: true,
        iconType: 'down',
        rowSelection: {
          type: 'radio',
				selectedRows: [],
				selectedRowKeys: [],
				onChange: this.radioChange
			},
			columns: [
				{
          align: "left",
          title: "姓名",
          dataIndex: "payername"
        },
        {
          align: "left",
          title: "证件类型",
          dataIndex: "idcardtypeName"
        },
        {
          align: "left",
          title: "证件号",
          dataIndex: "idcard"
        },
        {
          align: "left",
          title: "卡号",
          dataIndex: "cardno"
        },
        {
          align: "left",
          title: "购买金额",
          dataIndex: "totalvalue",
          customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
        },
        {
          align: "left",
          title: "账户余额",
          dataIndex: "accountmoney",
          customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
        },
        {
          align: "left",
          title: "印刷号",
          dataIndex: "prtno"
        },
        {
          align: "left",
          title: "卡类型",
          dataIndex: "typename"
        },
        {
          align: "left",
          title: "卡类别",
          dataIndex: "cardtypename"
        },
        {
          align: "left",
          title: "会员等级",
          dataIndex: "gradetypename"
        },
				{
					align: "left",
					title: "账户状态",
					dataIndex: "accountstatusName"
				},
				{
					align: "left",
					title: "购买状态",
					dataIndex: "status",
					customRender: (text) => {
            if (parseInt(text) === 1) return '待确认';
            if (parseInt(text) === 2) return '缴费成功';
            if (parseInt(text) === 4) return '缴费失败'
          }
				},
				{
					align: "left",
					title: "确认类型",
					dataIndex: "confirmtype",
					customRender: (text) => {
            if (parseInt(text) === 1) return '购买确认';
            if (parseInt(text) === 2 || 3) return '充值确认'
          }
				},
				{
					align: "left",
					title: "推荐人工号",
					dataIndex: "refereecode"
				},
				{
					align: "left",
					title: "申请日期",
					dataIndex: "flowdate",
					customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
          }
				},
				{
					align: "left",
					title: "生效日期",
					dataIndex: "contnostartdate",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					title: "满期日期",
					dataIndex: "contnoenddate",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
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
		/* this.searchHandle() */
	},
	methods: {
    searchHandle() {
      let query = this.filterForm.getFieldsValue();
      if (query.payername === '' && query.idcardtype === '' && query.idcard === '' && query.confirmType === '') {
        this.$message.warning("请至少输入一个检索条件!");
        return
      }
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
    },
    // 点击单选框实现选中效果
    radioChange(selectedRowKeys, selectedRows) {
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows = selectedRows;
      this.rowSelection.selectedRowKeys = selectedRowKeys
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
    onPageSizeChange(current, size) {
      this.pagination.pageSize = size;
      this.searchHandle()
    },
    loadPageData: function () {
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.queryStoreValueConfirm(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.pagination.total = this.pageData.totalCount;
        this.rowSelection.selectedRowKeys = [];
        this.rowSelection.selectedRows = []
      }).finally(() => {
        this.loading = false
      })
    },
    resetFilterForm() {
      this.filterForm.resetFields()
      // 需求是重置时不触发查询
      // this.searchHandle()
    },
    selectRowClick(record, index) {
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows.push(this.pageData.data[index]);
      this.rowSelection.selectedRowKeys.push(this.pageData.data[index].id)
    },
    swithTableShow() {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
    /*	deleteStore: function () {
      let self = this
      let arr = this.rowSelection.selectedRows
      if (!arr.length) {
        this.$message.warning('请选择一条记录!')
        return
      } else if (arr.length > 1) {
        this.$message.warning('此操作不能选择多条数据，请选择一条购买记录进行删除!')
        return
      }
      if (self.rowSelection.selectedRows[0].status !== 1) {
        this.$message.warning('仅支持删除未缴费确认的申请单!')
        return
      }
      this.$confirm({
        title: '确认提示',
        content: `确定删除吗？`,
        okType: 'danger',
        onOk () {
          return new Promise((resolve, reject) => {
            let data = self.rowSelection.selectedRows[0].id
            api.deleteStoreValue(data).then(res => {
              if (res.status === 0) {
                let index = self.pageData.data.findIndex(item => (item.id === self.rowSelection.selectedRows[0].id))
                self.pageData.data.splice(index, 1)
                self.rowSelection.selectedRows = []
                self.$message.success('删除成功')
              } else {
                self.$message.error('删除失败')
              }
            }).finally(() => {
              resolve()
            })
          })
        }
      })
    }, */
		appleConfirm () {
      let arr = this.rowSelection.selectedRows;
      if (!arr.length) {
        this.$message.error('请选择记录!');
        return
      } else if (arr.length > 1) {
        this.$message.error('此操作不能选择多条数据，请选择一条记录进行此操作!');
        return
      }
      // 缴费状态不正确
      if (arr[0].status === 2) {
        this.$message.error('不是待缴费状态!');
        return
      }
      // 打开确认缴费页面
      this.$refs.confirmForm.show({id: arr[0].id})
    }

	}
}
</script>
