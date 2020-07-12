<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1200" title="账户消费明细列表" footer="">
    <a-card style="margin-top:24px;">
      <div slot="extra">

      </div>
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />账户消费明细列表</span>
      <a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">
				<span slot="textVal" slot-scope="text, record, index">{{text || '-'}}</span>
      </a-table>
    </a-card>
  </a-modal>
</template>
<script>
  import api from '@/api/api-vip'
  import {formatMoney} from "../../../libs/util"

  export default {
    name: 'vip-product-flow-list-detail',
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
			columns: [
				{
					align: "left",
					dataIndex: "productcode",
					title: "商品编码"
				},
				{
					align: "left",
					dataIndex: "productname",
					title: "商品名称"
				},
				{
					align: "left",
					dataIndex: "num",
					title: "数量"
				},
				{
					align: "left",
					dataIndex: "price",
					title: "单价",
					customRender: (text) => {
                      return text ? '￥' + formatMoney(text, 2) : ''
                    }
				},
				{
					align: "left",
					dataIndex: "pmoney",
					title: "总价",
					customRender: (text) => {
                      return text ? '￥' + formatMoney(text, 2) : ''
                    }
				},
				{
					align: "left",
					dataIndex: "note",
					title: "说明",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "left",
					dataIndex: "specs",
					title: "规格",
					scopedSlots: { customRender: 'textVal' }
				},
				{
					align: "left",
					dataIndex: "model",
					title: "型号",
					scopedSlots: { customRender: 'textVal' }
				}
			]
		}
	},
	methods: {
      show(obj) {
        this.formModal = true;
        this.parentData = obj;
        this.searchHandle()
      },
      searchHandle() {
        this.$nextTick(() => {
          this.pagination.current = 1;
          this.loadPageData()
        })
      },
      loadPageData() {
        let query = this.filterForm.getFieldsValue();
        let data = {
          page: this.pagination.current,
          limit: this.pagination.pageSize
        };
        this.loading = true;
        api.qureyProductFlowDetail(Object.assign(data, query, this.parentData)).then(res => {
          this.pageData = res || {totalCount: 0, data: []};
          this.pageData.data.forEach((item, index) => {
            item.recordIndex = index + 1;
            let note = item.note;
            if (item.note === "null") {
              item.note = " "
            }
            if (item.specs === "null") {
              item.specs = " "
            }
            if (item.model === "null") {
              item.model = " "
            }
            if (item.productcode === "null") {
              item.productcode = " "
            }
            if (item.productname === "null") {
              item.productname = " "
            }
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
      }
    }
}
</script>
<style>

</style>
