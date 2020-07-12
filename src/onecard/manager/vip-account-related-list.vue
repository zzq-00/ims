<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
			<!-- <a-alert message="请至少输入一个检索条件！" type="info" show-icon style="margin-bottom:12px;" closable/> -->
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item class="form-item-label-long" label="会员姓名">
              <a-input v-decorator="['name', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item class="form-item-label-long" label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item class="form-item-label-long" label="联系方式">
              <a-input v-decorator="['mobile', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item class="form-item-label-long" label="会员卡号">
              <a-input v-decorator="['cardno', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :offset="12" :span="12">
            <a-button
              type
              class="editable-add-btn"
              @click="resetFilterForm"
              style="float:right;margin-right:10px;"
            >重置
            </a-button>
            <a-button
              type="primary"
              class="editable-add-btn"
              @click="searchHandle"
              style="float:right;margin-right:10px;"
            >查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />会员帐户列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table
        @rowClick="selectRowClick"
        :scroll="{ x: 'max-content'}"
        v-show="showTable"
        :bordered="false"
        :pagination="pagination"
        :rowSelection="rowSelection"
        :dataSource="pageData.data"
        :columns="columns"
        :rowKey="index => index.index"
        :indentSize="0"
        :loading="loading"
      ></a-table>
    </a-card>

    <a-card v-if="!loading" style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />附属人信息列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShowSub" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="24">
          <a-form
            :form="subSearchForm"
            :labelCol="filterFormLayout.labelCol"
            :wrapperCol="filterFormLayout.wrapperCol"
          >
            <a-row :gutter="16" style="margin-bottom:12px;">
              <a-form
                :form="subSearchForm"
                :labelCol="filterFormLayout.labelCol"
                :wrapperCol="filterFormLayout.wrapperCol"
              >
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-form-item class="form-item-label-long" label="附属人姓名">
                      <a-input v-decorator="['relatedname']"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item class="form-item-label-long" label="附属人证件号码">
                      <a-input v-decorator="['relatedidcard']"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item class="form-item-label-long" label="附属人移动电话">
                      <a-input v-decorator="['relatedmobile']" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="10" :offset="14">
                    <div style="float:right">
                      <a-button
                        type
                        class="editable-add-btn"
                        @click="queryRelatedList"
                        style="margin-right:10px;"
                      >查询</a-button>
                      <a-button
                        type
                        class="editable-add-btn"
                        @click="doResetForRelated"
                        style="margin-right:10px;"
                      >重置</a-button>
                      <a-button
                        type
                        class="editable-add-btn"
                        @click="updateRelate"
                        style="margin-right:10px;"
                      >修改</a-button>
                      <a-button
                        type
                        class="editable-add-btn"
                        @click="deleteRelate"
                        style="margin-right:10px;"
                      >删除</a-button>
                      <a-button
                        type="primary"
                        class="editable-add-btn"
                        @click="importRelate"
                        style="margin-right:10px;"
                      >附属人批量导入</a-button>
                    </div>
                  </a-col>
                </a-row>
              </a-form>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <a-table
        @rowClick="selectSubTableRowClick"
        :scroll="{ x: 'max-content'}"
        v-show="showTableSub"
        :bordered="false"
        :pagination="paginationSub"
        :rowSelection="rowSelectionSub"
        :dataSource="pageDataSub.data"
        :columns="columnsSub"
        :rowKey="record => record.index"
        :indentSize="0"
        :loading="loadingSub"
      ></a-table>
    </a-card>
    <VipAccountRelatedEdit ref="vipAccountRelatedEdit" @callback="changeSubItem" />
    <VipAccountRelatedImport ref="vipAccountRelatedImport" />
  </a-card>
</template>
<script>
  import api from "@/api/api-vip"
  import DicSelect from "@/components/dic-select"
  import moment from "moment"
  import VipAccountRelatedEdit from "./components/vip-account-related-edit"
  import VipAccountRelatedImport from "./components/vip-account-related-import"

  export default {
    name: "vip-account-related-list",
    components: {DicSelect, VipAccountRelatedEdit, VipAccountRelatedImport},
    data() {
      return {
        // 查询条件
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        },
        filterForm: this.$form.createForm(this),
        subSearchForm: this.$form.createForm(this),
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
        iconType: "down",
        iconTypeSub: "down",
        tabledata: [],
        rowSelection: {
          type: "radio",
          selectedRows: [],
          selectedRowKeys: [],
				onChange: this.radioChange
			},
			rowSelectionSub: {
				selectedRows: [],
				selectedRowKeys: [],
				onChange: (selectedRowKeys, selectedRows) => {
          this.rowSelectionSub.selectedRowKeys = selectedRowKeys;
          this.rowSelectionSub.selectedRows = selectedRows
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
			paginationSub: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onSubPageSizeChange(current, pageSize),
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
				},
				{
					align: "left",
					dataIndex: "relatedcnt",
					title: "附属人"
				}
			],
			columnsSub: [
				{
					align: "left",
					dataIndex: "relatedcodeName",
					title: "与会员本人关系"
				},
				{
					align: "left",
					dataIndex: "relatedname",
					title: "附属人姓名"
				},
				{
					align: "left",
					dataIndex: "relatedidcardtypeName",
					title: "附属人证件类型"
				},
				{
					align: "left",
					dataIndex: "relatedidcard",
					title: "附属人证件号"
				},
				{
					align: "left",
					dataIndex: "relatedbirthday",
					title: "附属人生日",
					customRender: text => {
						return text ? moment(text).format("YYYY-MM-DD") : ""
					}
				},
				{
					align: "left",
					dataIndex: "relatedsexName",
					title: "附属人性别"
				},
				{
					align: "left",
					dataIndex: "relatedmobile",
					title: "附属人移动电话"
				}
			]
		}
	},
	mounted () {
	},
	methods: {
		resetFilterForm () {
      this.filterForm.resetFields()
      // this.searchHandle()
    },
    searchHandle() {
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
    },
    loadPageData() {
      this.rowSelection.selectedRowKeys = [];
      this.rowSelectionSub.selectedRowKeys = [];
      let query = this.filterForm.getFieldsValue();
      let hasValueFlag = false;
      Object.keys(query).map(item => {
        if (query[item]) hasValueFlag = true
      });
      if (!hasValueFlag) {
        this.$message.error('请至少输入一个检索条件！');
        return
      }
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api
        .queryRelatedAccountInfo(data)
        .then(res => {
          this.pageData = res.data || {totalCount: 0, data: []};
          this.pageData.data.forEach((item, index) => {
            item.recordIndex = index + 1
          });
          this.pagination.total = this.pageData.totalCount
        })
        .finally(() => {
          this.loading = false
        });
      this.currRowIndex = -1;
      this.pageDataSub = []
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
    onPageSizeChange(current, size) {
      this.pagination.pageSize = size;
      this.searchHandle()
    },
    // 点击单选框实现选中效果
    radioChange(selectedRowKeys, selectedRows) {
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows = selectedRows;
      this.rowSelection.selectedRowKeys = selectedRowKeys;
      if (this.currRowIndex === selectedRowKeys[0]) {
        this.currRowIndex = -1;
        this.rowSelection.selectedRowKeys = [];
        this.rowSelectionSub.selectedRowKeys = [];
        this.pageDataSub = {totalCount: 0, data: []}
      } else {
        this.currRowIndex = selectedRowKeys[0];
        this.rowSelection.selectedRowKeys = [];
        this.rowSelection.selectedRowKeys.push(selectedRowKeys[0]);
        this.searchHandleSubTable()
      }
    },
    selectRowClick(record, index) {
      if (this.currRowIndex === index) {
        this.currRowIndex = -1;
        this.rowSelection.selectedRowKeys = [];
        this.rowSelectionSub.selectedRowKeys = [];
        this.pageDataSub = {totalCount: 0, data: []}
      } else {
        this.currRowIndex = index;
        this.rowSelection.selectedRowKeys = [];
        this.rowSelection.selectedRowKeys.push(index);
        this.searchHandleSubTable()
      }
    },

    searchHandleSubTable() {
      this.$nextTick(() => {
        this.paginationSub.current = 1;
        this.pageDataSub = {totalCount: 0, data: []};
        this.loadSubPageData()
      })
    },
    loadSubPageData() {
      this.rowSelectionSub.selectedRowKeys = [];
      let query = this.subSearchForm.getFieldsValue();
      let data = {
        accountid: this.pageData.data[this.currRowIndex].id,
        vipid: this.pageData.data[this.currRowIndex].vipid,
        page: this.paginationSub.current,
        limit: this.paginationSub.pageSize
      };
      this.loadingSub = true;
      api
        .queryVipRelated(Object.assign(query, data))
        .then(res => {
          this.pageDataSub = res.data || {totalCount: 0, data: []};
          this.pageDataSub.data.forEach((item, index) => {
            item.recordIndex = index + 1
          });
          this.paginationSub.total = this.pageDataSub.totalCount
        })
        .finally(() => {
          this.loadingSub = false
        })
    },
    onSubPageChange(page, pageSize) {
      this.paginationSub.current = page;
      this.loadSubPageData()
    },
    onSubPageSizeChange(current, size) {
      this.paginationSub.pageSize = size;
      this.searchHandleSubTable()
    },
    selectSubTableRowClick(record, index) {
      // let sel = this.rowSelectionSub.selectedRowKeys
      // if (this.currRowIndexSub === index) {
      // 	this.currRowIndexSub = -1
      // 	this.rowSelectionSub.selectedRowKeys = []
      // } else {
      // 	this.currRowIndexSub = index
      // 	this.rowSelectionSub.selectedRowKeys = sel
      // 	this.rowSelectionSub.selectedRowKeys.push(index)
      // }
      let ki = this.rowSelectionSub.selectedRowKeys.findIndex(key => (key === index));
      if (ki > -1) {
        this.rowSelectionSub.selectedRowKeys.splice(ki, 1)
      } else {
        this.rowSelectionSub.selectedRowKeys.push(index)
      }
    },
    swithTableShow() {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? "down" : "up"
    },
    swithTableShowSub() {
      this.showTableSub = !this.showTableSub;
      this.iconTypeSub = this.showSubTable ? "down" : "up"
    },
    importRelate() {
      if (this.currRowIndex === -1) {
        this.$message.warning("请选择一条会员记录!");
        return
      }
      let data = {
        accountid: this.pageData.data[this.currRowIndex].id,
        vipid: this.pageData.data[this.currRowIndex].vipid
      };
      this.$refs.vipAccountRelatedImport.show(data)
    },
    queryRelatedList() {
      if (this.currRowIndex === -1) {
        this.$message.warning("请选择一条会员记录!");
        return
      }
      this.searchHandleSubTable()
    },
    changeSubItem() {
      this.loadSubPageData()
    },
    updateRelate() {
      let self = this;
      if (this.currRowIndex === -1) {
        this.$message.warning("请选择一条会员记录!");
        return
      }
      if (self.rowSelectionSub.selectedRowKeys.length === 0) {
        this.$message.warning("请选择一条附属人记录!");
        return
      }
      if (self.rowSelectionSub.selectedRowKeys.length > 1) {
        this.$message.warning("修改附属人信息只能选择一条记录!");
        return
      }
      let selectedRecords = self.rowSelectionSub.selectedRowKeys.map(val => {
        return this.pageDataSub.data[val]
      });
      if (selectedRecords[0].cardholderflag === '0') {
        this.$message.warning("投保人不能修改!");
        return
      }
      let data = Object.assign(
        {editable: "edit"},
        selectedRecords[0]
      );
      data.relatedbirthday = moment(data.relatedbirthday, 'YYYY-MM-DD');
      this.$refs.vipAccountRelatedEdit.show(data)
    },
    deleteRelate() {
      if (this.currRowIndex === -1) {
        this.$message.warning("请选择一条会员记录!");
        return
      }
      let self = this;
      let ids = [];
      let selectedRecords = self.rowSelectionSub.selectedRowKeys.map(val => {
        return this.pageDataSub.data[val]
      });
      if (selectedRecords.length === 0) {
        this.$message.warning("请选择一条附属人记录!");
        return
      }
      for (let i = 0; i < selectedRecords.length; i++) {
        // 投保人不能删除
        if (selectedRecords[i].cardholderflag === '0') {
          this.$message.warning("投保人不能删除!");
          return
        }
        ids.push(selectedRecords[i].id)
      }
      let data = ids.join(",");
      this.$confirm({
        title: "确认提示",
        content: `确定删除当前选中的项记录吗？`,
        okType: "danger",
        onOk() {
          return new Promise((resolve, reject) => {
            api
              .delVipRelated(data)
              .then(res => {
                if (res.status === 0) {
                  self.$message.success("删除成功");
                  self.loadSubPageData()
                } else {
                  self.$message.error("删除失败")
                }
              })
              .finally(() => {
                resolve()
              })
          })
        }
      })
    },

    doResetForRelated() {
      this.subSearchForm.resetFields()
      // this.searchHandleSubTable()
    }
  }
}
</script>
