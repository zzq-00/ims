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
              <a-input type="hidden" v-decorator="['accountmoneytype', {initialValue: '1'}]"/>
              <a-input type="hidden" v-decorator="['insuretype', {initialValue: '3'}]"/>
              <a-input type="hidden" v-decorator="['sex', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button @click="resetFilterForm" class="editable-add-btn" style="float:right;margin-right:10px;" type="">
              重置
            </a-button>
            <a-button @click="searchHandle" class="editable-add-btn" style="float:right;margin-right:10px;" type="">查询
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
      <a-table :bordered="false" :columns="columns" :dataSource="pageData.data" :indentSize=0
               :loading="loading" :pagination="pagination" :rowKey="index => index.index" :rowSelection="rowSelection"
               :scroll="{ x: 'max-content'}" @rowClick="selectRowClick" v-show="showTable">

      </a-table>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank"/>提现信息</span>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button @click="doWithdrawal" class="editable-add-btn" style="margin-right:5px;" type="primary">申请提现
            </a-button>
          </div>
        </a-col>
      </a-row>
      <a-form :form="saveForm" :loading="saveLoading" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="提现银行">
              <DicSelect dicType="VIP_BANK"
                         v-decorator="[ 'bank',{rules: [{ required: true, message: '提现银行不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="提现银行支行">
              <a-input v-decorator="['banknsubame']"/>
              <a-input type="hidden" v-decorator="['cardno',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['name',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['idcard',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['idcardtype',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['status',{initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="可退金额">
              <a-input-number
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="['money', {rules: [{ required: true, message: '请选择可退金额!' }]}]"
              />
              <a-input-number style="display:none;" v-decorator="['totalmoney']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="银行省份">
              <AddressSelect
                dicType="0"
                v-decorator="['province', {initialValue: '', rules: [{ required: true, message: '请选择省份!' }]}]"
                @change="hasCascadeDefaultProvince = true"
              ></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="银行城市">
              <AddressSelect
                :dicType="saveForm.getFieldValue('province')"
                :hasCascadeDefault="hasCascadeDefaultProvince"
                @change="hasCascadeDefaultCity=true"
                v-decorator="['city', {initialValue: '', rules: [{ required: true, message: '请选择城市!' }]}]"
              ></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="银行区县">
              <AddressSelect
                :dicType="saveForm.getFieldValue('city')"
                v-decorator="['district',{initialValue: '', rules: [{ required: true, message: '请选择区县!' }]}]"
                :hasCascadeDefault="hasCascadeDefaultProvince || hasCascadeDefaultCity"
              ></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="银行卡号">
              <a-input-number
                @blur="peopleCardBlur"
                v-decorator="['bankcardno',{rules: [{ required: true, message: '银行卡号不能为空!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="退保说明">
              <a-input v-decorator="['note']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import AddressSelect from '@/components/address-select'
  import {formatMoney} from "../../libs/util"

  export default {
    name: 'vip-withdraw-apply-add',
    components: {DicSelect, AddressSelect},
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
        saveForm: this.$form.createForm(this),
        loading: false,
        saveLoading: false,
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
            customRender: (text) => {
              return text ? '￥' + formatMoney(text, 2) : ''
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
            dataIndex: "accountmoneytypeName",
            title: "账户类型"
          },
          {
            align: "left",
            dataIndex: "statusName",
            title: "账户状态"
          }
        ],
        rowSelection: {
          type: 'radio',
          selectedRowKeys: [],
          selectedRows: [],
          onChange: (selectedRowKeys, selectedRows) => {
            // 重置表单项数据
            this.saveForm.resetFields();
            // 	// 每次新加载数据都不联动
            this.hasCascadeDefaultProvince = false;
            this.hasCascadeDefaultCity = false;
            if (selectedRows[0].cardno === null) {
              this.$message.warning('卡号不能为空！')
            }
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.rowSelection.selectedRows = selectedRows;
            this.saveLoading = true;
            // 设置表单默认值
            this.resetSaveFormData(selectedRows[0])
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
        currRowIndex: -1,
        hasCascadeDefaultProvince: false,
        hasCascadeDefaultCity: false,
        peopleCardValue: ''
      }
    },
    mounted() {
      /* this.searchHandle() */
      this.hasCascadeDefaultProvince = false;
      this.hasCascadeDefaultCity = false
    },
    methods: {
      peopleCardBlur(e) {
        const {value} = e.target;
        const reg = /^[0-9]*$/;
        if (reg.test(value)) {
          this.peopleCardValue = value
        } else {
          e.target.value = this.peopleCardValue
        }
      },
      searchHandle() {
        let query = this.filterForm.getFieldsValue();
        if (query.name === "" && query.idcard === "" &&
          query.mobile === "" && query.cardno === "") {
          this.$message.warning("请至少输入一个检索条件!");
          return
        }
        this.$nextTick(() => {
          this.pagination.current = 1;
          this.loadPageData()
        })
      },
      loadPageData() {
        this.rowSelection.selectedRowKeys = [];
        let query = this.filterForm.getFieldsValue();
        let data = {
          page: this.pagination.current,
          limit: this.pagination.pageSize
        };
        Object.assign(data, query);
        this.loading = true;
        api.queryAccountInfo(data).then(res => {
          this.pageData = res.data || {totalCount: 0, data: []};
          this.pageData.data.forEach((item, index) => {
            item.recordIndex = index + 1
          });
          this.pagination.total = this.pageData.totalCount
        }).finally(() => {
          this.saveForm.resetFields();
          this.loading = false
        })
      },
      selectRowClick(record, index) {
        // 重置表单项数据
        this.saveForm.resetFields();
        if (this.currRowIndex === index) {
          this.currRowIndex = -1;
          this.rowSelection.selectedRowKeys = []
        } else {
          this.currRowIndex = index;
          this.rowSelection.selectedRowKeys = [];
          this.rowSelection.selectedRowKeys.push(index)
        }
      },
      resetSaveFormData(data) {
        this.saveForm.setFieldsValue(data);
        this.saveForm.setFieldsValue({money: 0});
        api.queryWithdrawalMoney(data).then(res => {
          let flag = res.data.flag;
          if (flag) {
            this.saveForm.setFieldsValue({money: res.data.money});
            this.saveForm.setFieldsValue({totalmoney: res.data.money})
          } else {
            this.$message.warning('没有查询到可退金额！')
          }
        }).finally(() => {
          this.saveLoading = false
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
      doWithdrawal() {
        let self = this;
        debugger
        this.saveForm.validateFields((error, values) => {
          debugger
          if (error || values.money === 0) {
            self.$message.warning('您填写的数据有误或者必填项没填！');
            return
          }
          if (parseInt(this.saveForm.getFieldValue('status')) === 2) {
            self.$message.warning('待激活账户不能提现！');
            return
          }
          if (parseInt(this.saveForm.getFieldValue('money')) > parseInt(this.saveForm.getFieldValue('totalmoney'))) {
            self.$message.warning('输入金额大于可退金额，不可以进行提现申请！');
            return
          }
          api.withdrawalApply(this.saveForm.getFieldsValue()).then(res => {
            if (res.status === 0) {
              self.$message.success('申请提现成功！');
              self.loadPageData()
            } else {
              self.$message.error('申请提现失败！')
            }
          })
        })
      }
    }
}
</script>
