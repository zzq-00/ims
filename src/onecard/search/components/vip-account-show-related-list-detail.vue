<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1200" title="附属人列表" footer>
    <a-card style="margin-top:24px;">
      <div slot="extra"></div>
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />附属人列表
      </span>
      <a-table
        :bordered="false"
        :pagination="pagination"
        :dataSource="pageData.data"
        :columns="columns"
        :rowKey="record => record.id"
        :indentSize="0"
        :loading="loading"
      ></a-table>
    </a-card>
  </a-modal>
</template>
<script>
import api from "@/api/api-vip";
import moment from "moment";
import { formatMoney } from "@/libs/util";
export default {
  name: "vip-account-show-related-list-detail",
  data() {
    return {
      formModal: false,
      parentData: {},
      filterFormLayout: {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 }
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
        onShowSizeChange: (current, pageSize) =>
          this.onPageSizeChange(current, pageSize),
        onChange: (page, pageSize) => this.onPageChange(page, pageSize)
      },
      columns: [
        {
          align: "left",
          title: "姓名",
          dataIndex: "relatedname"
        },
        {
          align: "left",
          title: "与会员本人关系",
          dataIndex: "relatedcodeName"
        },
        {
          align: "left",
          title: "其他关系",
          dataIndex: "relatedother"
        },
        {
          align: "left",
          title: "移动电话",
          dataIndex: "relatedmobile"
        },
        {
          align: "left",
          title: "证件类型",
          dataIndex: "relatedidcardtypeName"
        },
        {
          align: "left",
          title: "证件号",
          dataIndex: "relatedidcard",
          width: '80px',
          ellipsis: 'true'
        },
        {
          align: "left",
          title: "证件长期有效",
          dataIndex: "idcardislongName"
        },
        {
          align: "left",
          title: "证件有效期始",
          dataIndex: "idcardstart",
          customRender: text => {
            return text ? moment(text).format("YYYY-MM-DD") : "";
          }
        },
        {
          align: "left",
          title: "证件有效期止",
          dataIndex: "idcardend",
          customRender: text => {
            return text ? moment(text).format("YYYY-MM-DD") : "";
          }
        },
        {
          align: "left",
          title: "投保关系",
          dataIndex: "cardholderflag",
          width: '80px',
          ellipsis: 'true'
        }
      ]
    };
  },
  mounted() {
    this.syncMainRelated();
    // this.getCardTypeList();
    // this.getSysparam();
  },
  methods: {
    show(obj) {
      this.formModal = true;
      this.parentData = obj;
      this.searchHandle();
    },
    searchHandle() {
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.loadPageData();
      });
    },
    syncMainRelated() {
      this.related = {};
      if (this.pageData.data.length === 0) {
        this.pageData.data.push(
          Object.assign(this.related, {
            personType: "1",
            relatedcode: "1",
            relatedcodeName: "本人"
          })
        );
      } else if (
        this.pageData.data.length > 0 &&
        this.pageData.data.findIndex(item => parseInt(item.personType) === 1) < 0
      ) {
        this.pageData.data.unshift(
          Object.assign(this.related, {
            personType: "1",
            relatedcode: "1",
            relatedcodeName: "本人"
          })
        );
      }

    },
    loadPageData() {
      let query = this.filterForm.getFieldsValue();
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      this.loading = true;

      //附属人方法
      api
        .queryVIPAccountQuery(Object.assign(data, query, this.parentData))
        .then(res => {
          this.pageData = res.data || { totalCount: 0, data: [] };
          this.pageData.data.forEach((item, index) => {
            item.recordIndex = index + 1;
            if (item.cardholderflag === "0") {
              item.cardholderflag = "持卡人";
            } else {
              item.cardholderflag = "附属人";
            }
          });
          this.pagination.total = this.pageData.totalCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.loadPageData();
    },
    onPageSizeChange(current, size) {
      this.pagination.pageSize = size;
      this.searchHandle();
    }
  }
};
</script>
<style>
</style>
