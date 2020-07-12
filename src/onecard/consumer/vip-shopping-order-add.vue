<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="bank"/>
        会员信息
      </a-divider>
      <a-form :form="saveForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="会员卡号">
              <a-input v-decorator="['cardno', {initialValue: '', rules: [{ required: true, message: ' ' }]}]"
                       @pressEnter="consumerCheck"/>
              <a-input type="hidden" v-decorator="['vipid']"/>
              <a-input type="hidden" v-decorator="['accountid']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员姓名">
              <a-input :disabled="false" @pressEnter="consumerCheck"
                       v-decorator="['name',{initialValue: '', rules: [{ required: true, message: ' ' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :disabled="false" @pressEnter="consumerCheck"
                       v-decorator="['mobile' ,{initialValue: '', rules: [{ required: true, message: ' ' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <DicSelect :disabled="false" dicType="VIP_IDCARDTYPE" placeholder="请选择证件类型"
                         v-decorator="[ 'idcardtype',{initialValue: '', rules: [{ required: true, message: ' ' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号">
              <a-input :disabled="false" @pressEnter="consumerCheck" v-decorator="['idcard', {initialValue: '',rules: [{ required: true, message: ' ' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="账户金额">
              <a-input :disabled="true" v-decorator="['accountmoney', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="账户类型">
              <DicSelect :disabled="true" dicType="VIP_ACCOUNT_TYPE" v-decorator="[ 'accountmoneytype']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡类型">
              <a-input :disabled="true" v-decorator="['cardtypename', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="卡形式">
              <a-input :disabled="true" v-decorator="['typeName', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank"/>健管产品列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow"/>
      </a>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="产品类型">
              <a-select v-decorator="['producttype', {initialValue: ''}]">
                <a-select-option :key="index" :value="item.value" v-for="(item, index) in producttypeList">{{ item.label
                  }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务编码">
              <a-input v-decorator="['productcode']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务名称">
              <a-input v-decorator="['productname']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <div style="float:right">
              <a-button type="primary" class="editable-add-btn" @click="doconfirm"
                        style="float:right;margin-right:10px;">确认购买
              </a-button>
              <a-button type="" class="editable-add-btn" @click="resetFilterForm"
                        style="float:right;margin-right:10px;">重置
              </a-button>
              <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">
                查询
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        :bordered="false"
        :columns="columns"
        :dataSource="pageData.data"
        :rowSelection="rowSelection"
        :pagination="pagination"
        :rowKey="record => record.id"
        v-show="showTable"
        :indentSize=0
        :loading="loading"
      >
        <div slot="discounttype" slot-scope="text, record, index">
          <a-select
            @select="value => {discounttypeSetting(value, {rowindex:index, rowrecord:record, rowkey:'discounttype'})}"
            style="min-width: 200px"
            :value="record.discounttypeName"
            v-if="record.editable"
            :placeholder="'请选择折扣'"
          >
            <a-select-option
              v-for="item in discountrateList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}
            </a-select-option>
          </a-select>
          <!--          <span v-if="record.editable">{{record.discounttypeName}}</span>-->
        </div>

<!--        <div slot="payprice" slot-scope="text, record, index"><span>{{isNaN(record.price * record.discounttype)?0:record.price *record.discounttype}}</span>-->
        <div v-if ="record.editable || !isNaN(parseFloat(record.payprice * record.num).toFixed(2))" slot="payprice" slot-scope="text, record, index"><span>{{parseFloat(record.payprice).toFixed(2) ? parseFloat(record.payprice).toFixed(2) : 0}}</span>
        </div> <!--TODO 待修改 服务单价=折扣率*市场价-->
        <div slot="num" slot-scope="text, record, index">
          <a-input v-if="record.editable" v-model="record.num"/>
          <span v-if="!record.editable">{{text}}</span></div>
        <div slot="totalmoney" slot-scope="text, record, index"><span>{{isNaN(parseFloat(record.payprice * record.num).toFixed(2))?0:parseFloat(record.payprice * record.num).toFixed(2)}}</span>
        </div>

      </a-table>
      <a-card style="margin-top:24px;">
        <a-form :form="saveFormSub" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="总价">
                <a-input :disabled="true" :value="totalMoneyAll"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-card>
    <VipQueryContnoList @on-confirm="queryInfo" ref="vipQueryContnoList" @closeModal=clearQuery />
    <VipShoppingOrderConfirm ref="vipShoppingOrderConfirm" @on-update="confirmBack"/>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import moment from 'moment'
  import VipQueryContnoList from "./vip-query-contno-list"
  import VipShoppingOrderConfirm from "./components/vip-shopping-order-confirm"
  import {formatMoney} from "../../libs/util";

  export default {
    name: 'vip-shopping-order-add',
    components: {VipQueryContnoList, DicSelect, VipShoppingOrderConfirm},
    data() {
      const self = this;
      return {
        /*		queryParam: { sendFlag: 2 }, */
        // 查询条件
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
          /* form: this.$form.createForm(this) */
        },
        filterForm: this.$form.createForm(this),
        saveForm: this.$form.createForm(this),
        saveFormSub: this.$form.createForm(this),
        producttypeList: [],
        discountrateList: [],
        pageData: {
          dataCount: 0,
          data: []
        },
        totalMoneyAll: 0, // 页面下方总价
        loading: false,
        showTable: true,
        iconType: 'down',
        objList: [],
        serviceList: [],
        rowSelection: {
          selectedRowKeys: [],
          selectedRows: [],
          onChange: (selectedRowKeys, selectedRows) => {
            self.rowSelection.selectedRowKeys = selectedRowKeys;
            self.rowSelection.selectedRows = selectedRows
          },
          onSelect: (record, selected, selectedRows) => {
            if (!selected) {
              record.editable = false
            } else {
              record.editable = true
            }
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
        },
        columns: [
          {
            align: "left",
            dataIndex: "producttypename",
            title: "产品类型"
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
            title: "市场价",
            customRender: text => {
              return text ? "￥" + formatMoney(text, 2) : ""
            }
          },
				{
					align: "left",
					dataIndex: "servicecount",
					title: "服务数量"
				},
				{
					align: "left",
					dataIndex: "serviceunit",
					title: "服务单位"
				},
				{
					align: "left",
					dataIndex: "lowPrice",
					title: "最低售价"
				},
				{
					align: "left",
					dataIndex: "discounttype",
					title: "折扣信息*",
					scopedSlots: {customRender: 'discounttype'}
				},
				{
					align: "left",
					dataIndex: "payprice",
					title: "服务单价",
					scopedSlots: {customRender: 'payprice'}
				},
				{
					align: "left",
					dataIndex: "num",
					title: "购买数量*",
					scopedSlots: {customRender: 'num'}
				},
				{
					align: "left",
					dataIndex: "totalmoney",
					title: "总价",
					scopedSlots: {customRender: 'totalmoney'}
				}
			]
		}
	},
	watch: {
		rowSelection: {
      handler(val) {
        const {selectedRows} = val;
        let money = 0;
        if (selectedRows && selectedRows.length > 0) {
          selectedRows.forEach((v) => {
            money += (v.payprice * v.num) || 0
          })
        }
        this.totalMoneyAll = parseFloat(money).toFixed(2) || 0
      },
      deep: true
    }
	},
	mounted () {
		this.loadProductList()
	},
	methods: {
    itemSetting(LabeledValue, option) {
      this.$set(this.pageData.data[option.rowindex], option.rowkey, LabeledValue.key);
      this.$set(this.pageData.data[option.rowindex], option.rowkey + 'Name', LabeledValue.label)
    },
    dateRender(text) {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    resetFilterForm() {
      this.saveForm.resetFields();
      this.filterForm.resetFields();
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows = [];
      this.pageData.data = [];
      this.pagination.total = 0
    },
    loadProductList() {
      let self = this;
      this.producttypeList = [];
      api.queryVipShoppingTypeList().then(res => {
        if (res.status === 0) {
          res.data.map(item => {
            self.producttypeList.push({value: item.id, label: item.name, data: item})
          })
        }
      })
    },
    searchHandle() {
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows = [];
      this.saveForm.validateFields((error, values) => { // TODO
        if (error) {
          this.$message.error('请先选择会员信息，在进行产品查询!');
          return
        }
        this.$nextTick(() => {
          this.pagination.current = 1;
          this.loadPageData()
        })
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
    swithTableShow() {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
    consumerCheck(obj) {
      let data = {
        name: '',
        idcard: '',
        mobile: '',
        customercode: '',
        contno: '',
        cardno: ''
      };
      if (obj.currentTarget.value === '') {
        this.$message.warning('会员信息不能为空，请填入必填项!');
        return false
      }
      if (obj.currentTarget.id === 'name') {
        data.name = obj.currentTarget.value
      } else if (obj.currentTarget.id === 'idcard') {
        data.idcard = obj.currentTarget.value
      } else if (obj.currentTarget.id === 'mobile') {
        data.mobile = obj.currentTarget.value
      } else if (obj.currentTarget.id === 'cardno') {
        data.cardno = obj.currentTarget.value
      }
      this.$refs.vipQueryContnoList.show(data)
    },
    queryInfo(items) {
      let that = this;
      if (items) {
        // this.saveForm.resetFields()
        that.saveForm.setFieldsValue({name: items.name});
        that.saveForm.setFieldsValue({mobile: items.mobile});
        that.saveForm.setFieldsValue({idcardtype: items.idcardtype});
        that.saveForm.setFieldsValue({idcard: items.idcard});
        // that.saveForm.setFieldsValue({accountmoney: items.accountmoney})
        that.saveForm.setFieldsValue({accountmoneytype: items.accountmoneytype});
        that.saveForm.setFieldsValue({cardtypename: items.cardtypename});
        that.saveForm.setFieldsValue({typeName: items.typeName});
        that.saveForm.setFieldsValue({vipid: items.vipid});
        that.saveForm.setFieldsValue({typeName: items.typeName});
        that.saveForm.setFieldsValue({cardno: items.cardno});
        that.saveForm.setFieldsValue({accountmoney: items.money});
        let networktype = items.networktype;
        let discounttype;
        let discounttypeName;
        this.discountrateList = [];
        if (networktype === "YKT024") {
          discounttypeName = "至尚卡9折（促销）";
          discounttype = 7;
          this.discountrateList.push({
            value: discounttype,
            label: discounttypeName,
            data: discounttypeName,
            disValue: 0.9
          })
          // that.discountrateList = discountrateList
        } else if (networktype === "YKT025") {
          discounttypeName = "至珍卡8折（促销）";
          discounttype = 8;
          this.discountrateList.push({
            value: discounttype,
            label: discounttypeName,
            data: discounttypeName,
            disValue: 0.8
          })
          // that.discountrateList = discountrateList
        } else if (networktype === "YKT026") {
          discounttypeName = "至享卡7折（促销）";
          discounttype = 9;
          this.discountrateList.push({
            value: discounttype,
            label: discounttypeName,
            data: discounttypeName,
            disValue: 0.7
          })
          // that.discountrateList = discountrateList
        } else if (networktype === "YKT027") {
          discounttypeName = "至尊卡6折（促销）";
          discounttype = 10;
          this.discountrateList.push({
            value: discounttype,
            label: discounttypeName,
            data: discounttypeName,
            disValue: 0.6
          })
          // that.discountrateList = discountrateList
        } else {
          // 异步获取最小折扣
          that.discountrateCheck(items.vipid)
        }
      } else {
        that.$message.warning('无此账户')
      }
      this.loading = true;
      that.searchHandle()
    },
    discountrateCheck(vipid) {
      let that = this;
      let discounttype;
      let discounttypeName;
      this.discountrateList = [];
      api.findDiscountrate(vipid).then(res => {
        debugger
        if (res.status === 0) {
          discounttype = res.data;
          if (discounttype === 1) {
            discounttypeName = "至尚卡9.5折";
            this.discountrateList.push({
              value: discounttype,
              label: discounttypeName,
              data: discounttypeName,
              disValue: 0.95
            })
            // that.discountrateList = discountrateList
          } else if (discounttype === 2) {
            discounttypeName = "至珍卡9折";
            this.discountrateList.push({
              value: discounttype,
              label: discounttypeName,
              data: discounttypeName,
              disValue: 0.9
            })
            // that.discountrateList = discountrateList
          } else if (discounttype === 3) {
            discounttypeName = "至享卡8折";
            this.discountrateList.push({
              value: discounttype,
              label: discounttypeName,
              data: discounttypeName,
              disValue: 0.8
            })
            // that.discountrateList = discountrateList
          } else if (discounttype === 4) {
            discounttypeName = "至尊卡7折";
            this.discountrateList.push({
              value: discounttype,
              label: discounttypeName,
              data: discounttypeName,
              disValue: 0.7
            })
            // that.discountrateList = discountrateList
          } else if (discounttype === 10) {
            discounttypeName = "至尊卡6折（促销）";
            this.discountrateList.push({
              value: discounttype,
              label: discounttypeName,
              data: discounttypeName,
              disValue: 0.6
            })
            // that.discountrateList = discountrateList
          } else {
            discounttypeName = "无折扣";
            this.discountrateList.push({
              value: discounttype,
              label: discounttypeName,
              data: discounttypeName,
              disValue: 1
            })
            // that.discountrateList = discountrateList
          }
        }
        that.loadPageData()
      })
    },
    discounttypeSetting(LabeledValue, option) {
      let discount = 1;
      if (option.rowrecord.discounttype === 1) {
        discount = 0.95
      } else if (option.rowrecord.discounttype === 2 || option.rowrecord.discounttype === 7) {
        discount = 0.9
      } else if (option.rowrecord.discounttype === 3 || option.rowrecord.discounttype === 8) {
        discount = 0.8
      } else if (option.rowrecord.discounttype === 4 || option.rowrecord.discounttype === 9) {
        discount = 0.7
      } else if (option.rowrecord.discounttype === 10) {
        discount = 0.6
      }
      this.pageData.data[option.rowindex].discount = discount;
      this.pageData.data[option.rowindex].payprice = isNaN(option.rowrecord.price * discount) ? 0 : option.rowrecord.price * discount
    },
    doconfirm() {
      this.saveForm.validateFields((error, values) => {
        if (error) {
          this.$message.warning('请输入会员信息后，再进行购买!');
          return
        }
        let discount = 1;
        let discounttypeName;
        if (!this.rowSelection.selectedRowKeys || this.rowSelection.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择记录!');
          return
        }
        let selectedRecords = this.rowSelection.selectedRows;
        let noNumber = false;
        selectedRecords.forEach(p => {
          debugger
          console.log(p);
          if (p.discounttype === 1) {
            discount = 0.95;
            discounttypeName = "至尚卡9.5折"
          } else if (p.discounttype === 2 || p.discounttype === 7) {
            discount = 0.9;
            if (p.discounttype === 7) {
              discounttypeName = "至尚卡9折（促销）"
            } else {
              discounttypeName = "至珍卡9折"
            }
          } else if (p.discounttype === 3 || p.discounttype === 8) {
            discount = 0.8;
            if (p.discounttype === 8) {
              discounttypeName = "至珍卡8折（促销）"
            } else {
              discounttypeName = "至享卡8折"
            }
          } else if (p.discounttype === 4 || p.discounttype === 9) {
            discount = 0.7;
            if (p.discounttype === 9) {
              discounttypeName = "至享卡7折（促销）"
            } else {
              discounttypeName = "至尊卡7折"
            }
          } else if (p.discounttype === 10) {
            discount = 0.6;
            discounttypeName = "至尊卡6折（促销）"
          } else {
            discounttypeName = "无折扣"
          }
          p.payprice = isNaN(p.price * discount) ? 0 : parseFloat(p.price * discount).toFixed(2);
          p.totalmoney = isNaN(p.payprice * p.num) ? 0 : parseFloat(p.payprice * p.num).toFixed(2);
          p.discounttypeName = discounttypeName;
          if (!p.num || p.num === '0') {
            noNumber = true
          }
        });
        if (noNumber) {
          this.$message.warning('选择的产品中，购买数量不能为空!');
          return
        }
        let selectedPostRec = Object.assign({}, this.saveForm.getFieldsValue());
        let data = {selectedRecords: selectedRecords, selectedPostRec: selectedPostRec};
        if (this.totalMoneyAll > selectedPostRec.accountmoney) {
          this.$message.warning('购买总价超出账户余额，无法购买!');
          return
        }
        this.$refs.vipShoppingOrderConfirm.show(data)
      })
    },
    loadPageData() {
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.queryVipShoppingInfo(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1;
          if (this.discountrateList.length > 0) {
            item.discounttype = this.discountrateList[0].value;
            item.discount = 1;
            if (item.discounttype === 1) {
              item.discount = 0.95;
              item.discounttypeName = "至尚卡9.5折"
            } else if (item.discounttype === 2 || item.discounttype === 7) {
              item.discount = 0.9;
              if (item.discounttype === 7) {
                item.discounttypeName = "至尚卡9折（促销）"
              } else {
                item.discounttypeName = "至珍卡9折"
              }
            } else if (item.discounttype === 3 || item.discounttype === 8) {
              item.discount = 0.8;
              if (item.discounttype === 8) {
                item.discounttypeName = "至珍卡8折（促销）"
              } else {
                item.discounttypeName = "至享卡8折"
              }
            } else if (item.discounttype === 4 || item.discounttype === 9) {
              item.discount = 0.7;
              if (item.discounttype === 9) {
                item.discounttypeName = "至享卡7折（促销）"
              } else {
                item.discounttypeName = "至尊卡7折"
              }
            } else if (item.discounttype === 10) {
              item.discount = 0.6;
              item.discounttypeName = "至尊卡6折（促销）"
            } else {
              item.discounttypeName = "无折扣"
            }
            item.payprice = item.price * item.discount || 0
          }
        });
        this.pagination.total = this.pageData.totalCount
      }).finally(() => {
        this.loading = false
      })
    },
    confirmBack() {
      // 返回后清空数据
      this.clearQuery();
      this.totalMoneyAll = '';
      this.pageData.data = [];
      this.pagination.total = 0
    },
    // xyf添加清输入框
    clearQuery() {
      this.saveForm.resetFields()
    }
  }
}
</script>
