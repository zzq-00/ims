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
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="保单号">
              <a-input v-decorator="['grpcontno', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="保全批单号">
              <a-input v-decorator="['edoracceptno', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="打印状态">
              <DicSelect dicType="VIP_PRTSTATUS" v-decorator="[ 'prtstatus', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="部分领取状态">
              <DicSelect dicType="VIP_STATUS_TYPE" v-decorator="[ 'status', {initialValue: ''}]"/>
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
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button type="" class="editable-add-btn" @click="doPrint" style="margin-right:5px;">打印</a-button>
            <a-button type="primary" class="editable-add-btn" @click="doUpdateStatus(2)" style="margin-right:5px;">
              部分领取完成
            </a-button>
            <a-button type="primary" class="editable-add-btn" @click="doUpdateStatus(3)" style="margin-right:5px;">
              部分领取失败
            </a-button>
          </div>
        </a-col>
      </a-row>
      <a-table @rowClick="selectSubTableRowClick" :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false"
               :pagination="pagination" :rowSelection="rowSelectionSub" :dataSource="pageData.data" :columns="columns"
               :rowKey="record => record.index" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>
    <VipWithdrawApplyReasonForm ref="vipWithdrawApplyReasonForm" @callback="searchHandle"/>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import VipWithdrawApplyReasonForm from './components/vip-withdraw-apply-reason-form'
  import {formatMoney} from "../../libs/util"

  export default {
    name: 'vip-withdraw-apply-list',
    components: {DicSelect, VipWithdrawApplyReasonForm},
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
					dataIndex: "orderno",
					title: "部分领取单号"
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "部分领取状态"
				},
				{
					align: "left",
					dataIndex: "prtstatusName",
					title: "打印状态"
				},
				{
					align: "left",
					dataIndex: "applydate",
					title: "提现时间"
				},
				{
					align: "left",
					dataIndex: "grpcontno",
					title: "保单号"
				},
				{
					align: "left",
					dataIndex: "edoracceptno",
					title: "保全批单号"
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
            dataIndex: "idcard",
            title: "会员证件号"
          },
          {
            align: "left",
            dataIndex: "itemmoney",
            title: "部分领取金额",
            customRender: (text) => {
              return text ? '￥' + formatMoney(text, 2) : ''
            }
          },
          {
            align: "left",
            dataIndex: "bankname",
            title: "银行"
          },
          {
            align: "left",
            dataIndex: "bankcardno",
            title: "银行卡号"
          },
				{
					align: "left",
					dataIndex: "provincename",
					title: "开户省"
				},
				{
					align: "left",
					dataIndex: "cityname",
					title: "开户市"
				},
				{
					align: "left",
					dataIndex: "banknsubame",
					title: "开户行"
				}
			],
			rowSelectionSub: {
				selectedRowKeys: [],
				onChange: (selectedRowKeys, selectedRows) => {
					this.rowSelectionSub.selectedRowKeys = selectedRowKeys
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
    searchHandle() {
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
    },
    loadPageData() {
      this.rowSelectionSub.selectedRowKeys = [];
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.queryVipWithDrawApply(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.pagination.total = this.pageData.totalCount
      }).finally(() => {
        this.loading = false
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
      this.filterForm.resetFields()
      // this.searchHandle()
    },
    swithTableShow() {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
    selectSubTableRowClick(record, index) {
      let ki = this.rowSelectionSub.selectedRowKeys.findIndex(key => (key === index));
      if (ki > -1) {
        this.rowSelectionSub.selectedRowKeys.splice(ki, 1)
      } else {
        this.rowSelectionSub.selectedRowKeys.push(index)
      }
    },
    doUpdateStatus(status) {
      let self = this;
      if (!self.rowSelectionSub.selectedRowKeys || self.rowSelectionSub.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择要处理的部分领取订单!');
        return
      }
      let selectedRecords = self.rowSelectionSub.selectedRowKeys.map(val => {
        return this.pageData.data[val]
      });
      try {
        selectedRecords.forEach((val) => {
          if (status === 2 && parseInt(val.prtstatus) === 0) {
            // eslint-disable-next-line no-throw-literal
            throw '部分领取订单中含有未打印的数据，不能进行进行部分领取状态修改！'
          } else if (parseInt(val.status) !== 1) {
            // eslint-disable-next-line no-throw-literal
            throw '选择的记录中含有不是部分领取处理中状态的数据，不能进行部分领取状态修改！'
          } else if (status === 3 && selectedRecords[0].orderno !== val.orderno) {
            // eslint-disable-next-line no-throw-literal
            throw '更新部分领取失败状态时，只能选择部分领取单号相同的数据！'
          }
        })
			} catch (e) {
        this.$message.error(e);
        return
      }
			if (status === 2) {
				this.$confirm({
					title: '确认提示',
					content: `确认将选择的部分领取订单更新为部分领取成功吗？`,
					okType: 'danger',
					onOk () {
						return new Promise((resolve, reject) => {
              let data = {
                status: status,
                list: selectedRecords
              };
              api.updateStatusVipWithDrawApply(data).then(res => {
                if (res.status === 0) {
                  self.$message.success('部分领取状态更新成功！');
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
			} else {
				self.$refs.vipWithdrawApplyReasonForm.show(selectedRecords)
			}
		},
		doPrint () {
      let self = this;
      if (!self.rowSelectionSub.selectedRowKeys || self.rowSelectionSub.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择要处理的部分领取订单!');
        return
      }
      let selectedRecords = self.rowSelectionSub.selectedRowKeys.map(val => {
        return this.pageData.data[val]
      });
      let idList = [];
      try {
        selectedRecords.forEach(val => {
          if (parseInt(val.prtstatus) === 0) {
            if (parseInt(val.status) === 1) {
              if (val.contstate === '10') {
                // eslint-disable-next-line no-throw-literal
                throw '选择的记录中含有未传核心的数据，不能进行打印！'
              } else if (val.contstate === '01') {
                // eslint-disable-next-line no-throw-literal
                throw '选择的记录中含有传核心失败的数据，不能进行打印！'
              }
            }
          } else if (parseInt(val.prtstatus) === 1) {
            // eslint-disable-next-line no-throw-literal
            throw '选择的记录中含有已打印的数据，不能进行二次打印！'
          }
          idList.push(val.itemid)
        })
      } catch (e) {
        this.$message.error(e);
        return
      }
      let flag = false;
      selectedRecords.forEach(p => {
        p.bankName = p.bankname
      });
      api.printWithdrawapply(selectedRecords).then(res => {
        if (res.status === undefined) {
          // base64内容，文件名
          this.$downloadFileByBase64(res, '贴心管家部分领取票据信息单')
        } else {
          this.$message.error('文件下载失败,请重试');
          flag = true
        }
      });
      if (flag) {
        return
      }
      api.updatePrtStatus(idList).then(
        res => {
          if (res.status === 0) {
            flag = false
          } else {
            this.$message.error(res.statusText)
          }
        }
      );
      this.searchHandle()
    }
	}
}
</script>
