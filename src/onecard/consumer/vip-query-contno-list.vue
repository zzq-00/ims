<template>
  <a-card :bordered="false">
    <a-modal :footer="null" :width="1250" style="top: 30px;" title="选择会员" v-model="formModal" @cancel="closeModal">
      <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank"/>会员信息列表</span>
        <a href="#" slot="extra">
          <a-icon :type="iconType" @click="swithTableShow"/>
        </a>
        <a-row :gutter="16" style="margin-bottom:12px;">
          <a-col :offset="12" :span="12">
            <div style="float:right">
              <a-button @click="buyConfirm" class="editable-add-btn" style="margin-right:5px;" type="primary">确认选择
              </a-button>
            </div>
          </a-col>
        </a-row>
        <a-table :bordered="false" :columns="columns" :dataSource="pageData.data" :indentSize=0 :loading="loading"
                 :pagination="pagination" :rowKey="index => index.index" :rowSelection="rowSelection"
                 :scroll="{ x: 'max-content'}" @rowClick="selectRowClick" v-show="showTable">

        </a-table>
      </a-card>
    </a-modal>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import DicSwitch from '@/components/dic-switch'
  import AddressSelect from '@/components/address-select'

  export default {
    name: 'vip-query-contno-list',
    components: {DicSelect, DicSwitch, AddressSelect},
    data() {
      return {
        formModal: false,
        accountData: {},
        inputCompact: {
          dealtypeValue: 1,
          receivetypeValue: 1
        },
			// 查询条件
			filterFormLayout: {
				labelCol: {span: 9},
				wrapperCol: {span: 15}
			},
			filterForm: this.$form.createForm(this),
			formData: {},
			headers: {},
			isuploadFile: true,
			fileList: [],
			pageData: {
				dataCount: 0,
				data: []
			},
			loading: false,
			showTable: true,
			iconType: 'down',
			rowSelection: {
				type: 'radio',
				selectedRows: [],
				selectedRowKeys: [],
				onChange: this.radioChange
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
			},
			currRowIndex: -1,
			columns: [
				{
					align: "left",
					dataIndex: "name",
					title: "客户名字"
				},
				{
					align: "left",
					dataIndex: "idcard",
					title: "证件号码"
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "手机号"
				},
				{
					align: "left",
					dataIndex: "userTypeName",
					title: "险种名称"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "卡号"
				},
        {
          align: "left",
          dataIndex: "money",
          title: "金额",
          customRender: (text) => {
            return text ? '￥' + parseFloat(text).toFixed(2) : ''
          }
        },
				{
					align: "left",
					dataIndex: "accountmoneytypeName",
					title: "账户类型"
				},
				{
					align: "left",
					dataIndex: "claimstatus",
					title: "理赔状态",
					customRender: (text) => {
						if (text === 1) {
							return "正常"
						} else if (text === 2) {
							return "理赔中"
						}
					}
				}
			]
		}
	},
	mounted () {

	},
	methods: {
		show (obj) {
      this.formModal = true;
      this.accountData = Object.assign({}, obj);
      this.searchHandle()
    },
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		searchHandle () {
			this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
		},
		loadPageData () {
      this.rowSelection.selectedRowKeys = [];
      let data = {
        name: this.accountData.name,
        idcard: this.accountData.idcard,
        mobile: this.accountData.mobile,
        customercode: this.accountData.customercode,
        contno: this.accountData.contno,
        cardno: this.accountData.cardno,
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      this.loading = true;
      api.queryAccountForClaim(data).then(res => {
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
		radioChange (selectedRowKeys, selectedRows) {
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows = selectedRows;
      this.rowSelection.selectedRowKeys = selectedRowKeys
    },
		selectRowClick (record, index) {
			if (this.currRowIndex === index) {
        this.currRowIndex = -1;
        this.rowSelection.selectedRowKeys = []
      } else {
        this.currRowIndex = index;
        this.rowSelection.selectedRowKeys = [];
        this.rowSelection.selectedRowKeys.push(index)
      }
		},
		swithTableShow () {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
		buyConfirm () {
			if (this.rowSelection.selectedRowKeys.length) {
        this.$emit('on-confirm', this.pageData.data[this.rowSelection.selectedRowKeys]);
        this.formModal = false
      } else {
				this.$message.warning('请选择一条记录!')
			}
		},
		closeModal () {
			this.$emit('closeModal')
		}
	}
}
</script>
