<template>
  <a-card :bordered="false">
    <a-card>
			<a-divider orientation="left">
        <a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
					<a-col :span="6">
            <a-form-item label="购买人">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <DicSelect dicType="CERTI_TYPE" v-decorator="[ 'idcardtype', {initialValue: ''}]" />
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
            <a-form-item label="卡形式">
              <DicSelect dicType="VIP_CARD_TYPE" v-decorator="[ 'type', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="购买方式">
              <DicSelect dicType="VIP_MONEYSTORETYPE" v-decorator="[ 'storetypecode', {initialValue: '2'}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="缴费状态">
              <DicSelect dicType="VIP_INSURESTATUS" v-decorator="[ 'status', {initialValue: '1'}]" />
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
        <a-icon type="bank" /> 购买列表</span>
      	<a href="#" slot="extra">
        	<a-icon :type="iconType" @click="swithTableShow" />
				</a>
				<a-row :gutter="16" style="margin-bottom:12px;">
          <a-col :span="12" :offset="12">
            <div style="float:right">
              <a-button v-if="!iscom" type="primary" class="editable-add-btn" @click="appleConfirm" style="margin-right:5px;">缴费确认</a-button>
              <a-button type="primary" class="editable-add-btn" @click="modifyInsureInfo" style="margin-right:5px;">编辑</a-button>
              <a-button v-if="iscom" type="" class="editable-add-btn" @click="delHandle" style="margin-right:5px;">删除</a-button>
            </div>
		  		</a-col>
        </a-row>
				<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">
					<a slot="name" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				</a-table>
    </a-card>
    <ConfirmForm ref="confirmForm" @callback="searchHandle"/>
    <InsureForm ref="insureForm" @callback="searchHandle"/>
    <InsureComForm ref="insureComForm" @callback="searchHandle"/>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import ConfirmForm from "./components/confirm-form"
  import InsureForm from "./components/insure-form"
  import InsureComForm from "./components/insure-com-form"
  import moment from 'moment'
  import {formatMoney} from '@/libs/util'
  import {Promise} from 'q'

  export default {
    name: 'vip-insure-list-branch',
    components: {DicSelect, ConfirmForm, InsureForm, InsureComForm},
    props: {
      iscom: {
        type: Boolean,
        default() {
          return true
        }
      }
    },
	data () {
		return {
			// 查询条件
			filterForm: this.$form.createForm(this),
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			isDobber: false,
			pageData: {
				dataCount: 0,
				data: []
			},
			// selectedRows: [],
			loading: false,
			showTable: true,
			iconType: 'down',
			columns: [
				{
					align: "left",
					title: "姓名",
					dataIndex: "name",
					scopedSlots: { customRender: 'name' }
				},
				{
					align: "left",
					title: "性别",
					dataIndex: "sexName"
				},
				{
					align: "left",
					title: "出生日期",
					dataIndex: "birthday",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
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
					title: "联系方式",
					dataIndex: "mobile"
				},
				{
					align: "left",
					title: "产品名称",
					dataIndex: "productcodeName"
				},
				{
					align: "left",
					title: "购买方式",
					dataIndex: "storetypecodeName"
				},
        {
          align: "left",
          title: "购买金额",
          dataIndex: "money",
          customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
        },
				{
					align: "left",
					title: "卡类别",
					dataIndex: "typeName"
				},
				{
					align: "left",
					title: "试销计划",
					dataIndex: "sxtypeName"
				},
				{
					align: "left",
					title: "缴费状态",
					dataIndex: "status",
					customRender: (text) => {
            if (parseInt(text) === 1) return '待缴费';
            if (parseInt(text) === 2 || 3) return '缴费成功'
          }
				}
			],
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
        this.loadPageData()
      })
		},
		// 点击单选框实现选中效果
		radioChange (selectedRowKeys, selectedRows) {
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      this.rowSelection.selectedRows = selectedRows;
      this.rowSelection.selectedRowKeys = selectedRowKeys
    },
		onPageChange (page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
		onPageSizeChange (current, size) {
      this.pagination.pageSize = size;
      this.searchHandle()
    },
		loadPageData () {
      this.rowSelection.selectedRows = [];
      this.rowSelection.selectedRowKeys = [];
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.queryVipInsureList(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.pagination.total = this.pageData.totalCount
      }).finally(() => {
        this.loading = false
      })
    },
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		showRecordInfo (record) {
      // 打开确认缴费页面
      // 获取选中信息
      let data = {
        insureId: record.id,
        vipId: record.vipid
      };
      let self = this;
      api.getInsureInfo(data).then(res => {
        let insuretype = res.data.vipInsure.insuretype;
        let iscom = !(parseInt(insuretype) === 1);
        if (res.status === 0) {
          let vipInsureFormData = Object.assign({editable: 'view'}, res.data);
          vipInsureFormData.title = '产品购买信息预览';
          if (iscom) {
            self.$refs.insureComForm.show(vipInsureFormData)
          } else {
            self.$refs.insureForm.show(vipInsureFormData)
          }
        } else {
          self.$message.error(res.statusText)
				}
			})
		},
		swithTableShow () {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
		modifyInsureInfo () {
      let self = this;
      let arr = this.rowSelection.selectedRows;
      if (!arr.length) {
        this.$message.warning('请选择记录!');
        return
      } else if (arr.length > 1) {
        this.$message.warning('此操作不能选择多条数据，请选择一条记录进行此操作!');
        return
      }
      // 打开确认缴费页面
      // 获取选中信息
      let data = {
        insureId: self.rowSelection.selectedRows[0].id,
        vipId: self.rowSelection.selectedRows[0].vipid
      };
			api.getInsureInfo(data).then(res => { // TODO
        let insuretype = res.data.vipInsure.insuretype;
        let iscom = !(parseInt(insuretype) === 1);
        if (res.status === 0) {
          let vipInsureFormData = Object.assign({editable: 'edit'}, res.data);
          if (iscom) {
            self.$refs.insureComForm.show(vipInsureFormData)
          } else {
            self.$refs.insureForm.show(vipInsureFormData)
          }
        } else {
          self.$message.error('获取数据失败')
        }
			})
		},
		appleConfirm () {
      let self = this;
      let arr = this.rowSelection.selectedRows;
      if (!arr.length) {
        this.$message.warning('请选择记录!');
        return
      } else if (arr.length > 1) {
        this.$message.warning('此操作不能选择多条数据，请选择一条记录进行此操作!');
        return
      }
      // 缴费状态不正确
      if (self.rowSelection.selectedRows[0].status !== 1) {
        self.$message.warning('不是待缴费状态!');
        return
      }
			// 储值方式不正确
			if (self.rowSelection.selectedRows[0].storetypecode !== '2') {
        self.$message.warning('储值方式不是POS刷卡!');
        return
      }
			// 打开确认缴费页面
			this.$refs.confirmForm.show({vipStoreApplyId: self.rowSelection.selectedRows[0].id})
		},
		delHandle () {
      let self = this;
      let arr = this.rowSelection.selectedRows;
      if (!arr.length) {
        this.$message.warning('请选择记录!');
        return
      } else if (arr.length > 1) {
        this.$message.warning('此操作不能选择多条数据，请选择一条记录进行此操作!');
        return
      }
      if (self.rowSelection.selectedRows[0].status !== 1) {
        self.$message.warning('仅支持删除未缴费确认的申请单!');
        return
      }
			this.$confirm({
				title: '确认提示',
				content: `确定删除当前选中的${self.rowSelection.selectedRows[0].name}项记录吗？`,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						api.insureDelete(self.rowSelection.selectedRows[0].id).then(res => {
							if (res.status === 0) {
                self.rowSelection.selectedRows = [];
                self.$message.success('删除成功');
                self.searchHandle()
              } else {
								self.$message.error(res.statusText)
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
