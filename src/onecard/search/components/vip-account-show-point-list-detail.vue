<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1200" title="账户积分列表" footer="">
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />账户积分列表</span>
      <div>
        <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="10" :offset="14">
              <a-form-item label="">
                <a-radio-group @change="searchHandle" :options="searchRadioOptions" v-decorator="['paymenttype',{initialValue:'1'}]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>
  </a-modal>
</template>
<script>
  import api from '@/api/api-vip'
  import moment from 'moment'
  import {formatMoney} from '@/libs/util'

  export default {
    name: 'vip-account-show-point-list-detail',
    data() {
      return {
        formModal: false,
        parentData: {},
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
			searchRadioOptions: [
				{ label: '全部', value: '1' },
				{ label: '收入', value: '2' },
				{ label: '支出', value: '3' }
			],
			columns: [
				{
					align: "left",
					dataIndex: "flowdate",
					title: "流水日期",
					customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
          }
				},
				{
					align: "left",
					dataIndex: "note",
					title: "收支说明"
				},
        {
          align: "left",
          dataIndex: "points",
          title: "收支积分",
          customRender: (text) => {
            return text ? formatMoney(text, 0) : ''
          }
        },
        {
          align: "left",
          dataIndex: "accountpoints",
          title: "剩余积分",
          customRender: (text) => {
            return text ? formatMoney(text, 0) : ''
          }
        }
			]
		}
	},
	methods: {
		show (obj) {
      this.formModal = true;
      this.parentData = obj;
      this.searchHandle()
    },
		searchHandle () {
			this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData()
      })
		},
		loadPageData () {
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        paymenttype: query.paymenttype
      };
      this.loading = true;
      api.queryPointByAccid(Object.assign(data, query, this.parentData)).then(res => {
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
    }
	}
}
</script>
<style>

</style>
