<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="bank"/>
        查询条件
      </a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="会员姓名">
              <a-input v-decorator="['name', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系方式">
              <a-input v-decorator="['mobile', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡号">
              <a-input v-decorator="['cardno', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input type="hidden" v-decorator="['accountmoneytype', {initialValue: '1'}]"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">
              重置
            </a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank"/>会员帐户列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow"/>
      </a>
<!--      @rowClick="selectRowClick"-->
      <a-table  :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false"
               :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns"
               :rowKey="index => index.index" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>

    <a-card v-if="!loading" style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank"/>会员购买列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShowSub"/>
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button type="primary" class="editable-add-btn" @click="uploadPicList" style="margin-right:5px;">上传影印件
            </a-button>
          </div>
        </a-col>
      </a-row>
<!--      @rowClick="selectSubTableRowClick"-->
      <a-table  :scroll="{ x: 'max-content'}" v-show="showTableSub" :bordered="false"
               :pagination="paginationSub" :rowSelection="rowSelectionSub" :dataSource="pageDataSub.data"
               :columns="columnsSub" :rowKey="index => index.index" :indentSize=0 :loading="loadingSub">

      </a-table>
    </a-card>
    <ImageUploadForm ref="imageUploadForm"/>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import ImageUploadForm from "./components/image-upload-form"
  import moment from 'moment'
  import {formatMoney} from '@/libs/util'

  export default {
    name: 'vip-image-upload-list',
    components: {DicSelect, ImageUploadForm},
    data() {
      return {
        // 查询条件
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        },
        filterForm: this.$form.createForm(this),
			pageData: {
				dataCount: 0,
				data: []
			},
			pageDataSub: {
				dataCount: 0,
				data: []
			},
			loading: false,
			loadingSub: false,
			showTable: true,
			showTableSub: true,
			iconType: 'down',
			iconTypeSub: 'down',
			rowSelection: {
				type: 'radio',
				selectedRows: [],
				  selectedRowKeys: [],
				onChange: this.radioChange

			},
			rowSelectionSub: {
				type: 'radio',
				selectedRows: [],
				  selectedRowKeys: [],
				onChange: this.radioChangeSub
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
			paginationSub: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onSubPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onSubPageChange(page, pageSize)
			},
			currRowIndex: -1,
			currRowIndexSub: -1,
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
          customRender: text => {
            return text ? "￥" + formatMoney(text, 2) : ""
          }
        },
        {
          align: "left",
          dataIndex: "cardtypename",
          title: "会员卡类型"
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
			columnsSub: [
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "money",
					title: "购买金额",
					customRender: (text) => {
						return text ? '￥' + formatMoney(text) : ''
					}
				},
				{
					align: "left",
					dataIndex: "flowdate",
					title: "购买日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "orderNo",
					title: "订单号"
				},
				{
					align: "left",
					dataIndex: "prtno",
					title: "印刷号"
				},
				{
					align: "left",
					dataIndex: "grpcontno",
					title: "保单号"
				},
				{
					align: "left",
					dataIndex: "syscode",
					title: "购买来源",
					customRender: (text) => {
						if (text === "YKTGLPT01") {
							return "一卡通平台"
						} else if (text === "HEALTHAPP") {
							return "APP充值"
						} else {
							return ""
						}
					}
				}
			]
		}
	},
	mounted () {
		// this.searchHandle()
	},
	methods: {
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		searchHandle () {
			this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
		},
		loadPageData () {
      if (this.filterForm.getFieldsValue(['name']).name === "" && this.filterForm.getFieldsValue(['idcard']).idcard === "" &&
        this.filterForm.getFieldsValue(['mobile']).mobile === "" && this.filterForm.getFieldsValue(['cardno']).cardno === "") {
        this.$message.warning(
          "请至少输入一个检索条件！"
        );
        return
      }
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.queryImageUploadAccountInfo(data).then(res => {
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
		onPageChange (page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
		onPageSizeChange (current, size) {
      this.pagination.pageSize = size;
      this.searchHandle()
    },
		// 点击单选框实现选中效果
		radioChange (selectedRowKeys, selectedRows) {
      // console.log("数据1：", selectedRowKeys);
      // console.log("数据2：", selectedRows);
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows = selectedRows;
      this.rowSelection.selectedRowKeys = selectedRowKeys;
      // console.log("数据2222：", this.rowSelection.selectedRowKeys[0]);
      this.searchHandleSubTable()
    },
		// 点击单选框实现选中效果
		radioChangeSub (selectedRowKeys, selectedRows) {
      // console.log("Sub数据1：", selectedRowKeys);
      // console.log("Sub数据2：", selectedRows);
      this.rowSelectionSub.selectedRows = [];
      this.rowSelectionSub.selectedRowKeys = [];
      this.rowSelectionSub.selectedRows = selectedRows;
      this.rowSelectionSub.selectedRowKeys = selectedRowKeys
    },
		selectRowClick (record, index) {
			if (this.currRowIndex === index) {
        this.currRowIndex = -1;
        this.rowSelection.selectedRowKeys = []
      } else {
        this.currRowIndex = index;
        this.rowSelection.selectedRowKeys = [];
        this.rowSelection.selectedRowKeys.push(index);
        this.searchHandleSubTable()
      }
		},

		searchHandleSubTable () {
			this.$nextTick(() => {
        this.paginationSub.current = 1;
        this.pageDataSub = {totalCount: 0, data: []};
        this.loadSubPageData()
      })
		},
		loadSubPageData () {
      // debugger

      let data = {
        accountid: this.pageData.data[this.rowSelection.selectedRowKeys[0]].id,
        type: '1',
        page: this.paginationSub.current,
        limit: this.paginationSub.pageSize
      };
      this.loadingSub = true;
      api.queryImageUploadWithContno(data).then(res => {
        this.pageDataSub = res.data || {totalCount: 0, data: []};
        this.pageDataSub.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.paginationSub.total = this.pageDataSub.totalCount;
        this.rowSelectionSub.selectedRows = [];
        this.rowSelectionSub.selectedRowKeys = []
      }).finally(() => {
        this.loadingSub = false
			})
		},
		onSubPageChange (page, pageSize) {
      this.paginationSub.current = page;
      this.loadSubPageData()
    },
		onSubPageSizeChange (current, size) {
      this.paginationSub.pageSize = size;
      this.searchHandleSubTable()
    },
		selectSubTableRowClick (record, index) {
			if (this.currRowIndexSub === index) {
        this.currRowIndexSub = -1;
        this.rowSelectionSub.selectedRowKeys = []
      } else {
        this.currRowIndexSub = index;
        this.rowSelectionSub.selectedRowKeys = [];
        this.rowSelectionSub.selectedRowKeys.push(index)
      }
		},
		swithTableShow () {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
		swithTableShowSub () {
      this.showTableSub = !this.showTableSub;
      this.iconTypeSub = this.showSubTable ? 'down' : 'up'
    },
		uploadPicList () {
      let currRecord = this.pageDataSub.data[this.rowSelectionSub.selectedRowKeys[0]];
      let arr = this.rowSelection.selectedRows;
      let arr1 = this.rowSelectionSub.selectedRows;
      if (!arr.length) {
        this.$message.warning('会员信息列表请选择一条记录!');
        return
      }
      if (!arr1.length) {
        this.$message.warning('会员充值列表请选择一条记录!');
        return
      }
      let data = {
        accountid: currRecord.accountid,
        flowid: currRecord.id,
        prtno: currRecord.prtno
      };
			this.$refs.imageUploadForm.show(data)
		}
	}
}
</script>
