<template>
  <div style="padding: 20px; background-color: #fff">
    <a-card title="查询条件" :bordered="false" style="width: 100%">
  		<a-form :form="form">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="姓名">
                <a-input v-decorator="['name']" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="性别">
                <a-select v-decorator="['sex']" allowClear>
                  <a-select-option value="1">男</a-select-option>
                  <a-select-option value="0">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="手机">
                <a-input v-decorator="['phone']" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="证件号">
                <a-input v-decorator="['idno']" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="出生日期">
                <a-date-picker placeholder="选择日期" v-decorator="['birthdayBeginFrom']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="至">
                <a-date-picker placeholder="选择日期"  v-decorator="['birthdayEndTo']" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <div style="text-align: right;">
                  <a-button type="primary" @click="queryData">查询</a-button>
                  <a-button @click="reset">重置</a-button>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
  	</a-card>
    <a-card title="客户信息列表" :bordered="false" style="width: 100%">
        <cm-modal
          @close="()=>{modalVisible = false}"
          v-if="modalVisible"
          :customerNo="customerNo"
          ></cm-modal>
      <a-table
        :pagination="false"
        :customRow="rowclick"
        :columns="columns" 
        :dataSource="listData">
      </a-table>
      <div class="tab-pagination">
        <a-pagination 
          v-model="page"
          showQuickJumper
          showSizeChanger
          :pageSizeOptions="['10', '20', '50']"
          :showTotal="(total) => `共${total} 条数据`"
          @change="onPageChange"
          @showSizeChange="onShowSizeChange"
          :total="total" />
      </div>
  	</a-card>
  </div>
</template>

<script>
  import CmModal from './CmModal';
  export default {
    components: {
      CmModal
    },
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 },
        },
        form: this.$form.createForm(this),
        // 表格
        idtype: ["身份证","护照","军官证","工作证","其他"],
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`
          },
          {
              title: '姓名',
              dataIndex: 'name',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '性别',
              dataIndex: 'sex'
          },
          {
              title: '出生日期',
              dataIndex: 'birthday'
          },
          {
              title: '证件类型',
              dataIndex: 'idtype'
          },
          {
              title: '证件号码',
              dataIndex: 'idno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '联系方式',
              dataIndex: 'phone'
          },
        ],
        listData: [],
        modalVisible: false,
        customerNo:"",
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    methods: {
      queryData() {
        this.page = 1;
        this.submit();
      },
      submit() {
        this.form.validateFields((err, values) => {
          // 请至少输入一个检索条件!
          let collect = [];
          let result;
        
          Object.keys(values).forEach((ele) => {
            collect.push(values[ele]);
          });
          result = collect.every((item) => { return item === undefined || item === ""|| item === null });
          if (result) {
            this.$info({
              title: "提示",
              content: "请至少输入一个检索条件!"
            })
          } else {
            // 获取数据
            this.fetchListData(values);
          }
          
        });

      },
      fetchListData(values) {
        let payload = {
          "page": this.page,
          "limit": this.pageSize,
          "name": values.name,
          "sex": values.sex,
          "phone": values.phone,
          "idno": values.idno,
          "birthdayBegin": values.birthdayBeginFrom && values.birthdayBeginFrom.format('YYYY-MM-DD'),
          "birthdayEnd": values.birthdayEndTo && values.birthdayEndTo.format('YYYY-MM-DD')
        };
        let url = this.$apiList.getCustomerListService;

        this.$axios.post(url, payload).then(res => {
          if (res.data.statusText && res.data.statusText === "Success") {
            let {data, totalCount} = res.data.data;
            let listData = [];

            this.total = totalCount;
            data.forEach((ele, index) => {
              listData.push({
                key: index,
                name: ele.name,
                sex: ele.sex==='1'?'男':(ele.sex==='0'?'女':''),
                birthday: this.$moment(ele.birthday).format("YYYY-MM-DD"),
                idtype: this.idtype[ele.idtype],
                idno: ele.idno,
                phone: ele.phone,
                customerNo: ele.customerNo
              });
            });
            this.listData = listData;
          } else {
            this.$message.error('信息获取失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      reset() {
        this.form.resetFields();
      },
      // 表格
      
      rowclick(rowData, index) {
        return {
          on: {
            dblclick: () => {
              this.dbclickRow(rowData, index);
            }
          }
        }
      },
      dbclickRow (rowData, index) {
        this.customerNo = rowData.customerNo;
        this.modalVisible = true;
      },
      onShowSizeChange (current, pageSize) {
        this.pageSize = pageSize;
        this.page = current;
        // 重新获取列表数据
        this.submit();
      },
      onPageChange (page, pageSize) {
        this.pageSize = pageSize;
        this.page = page;
        this.submit();
      },
    },
  }
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: 100%;
}
// 表格
.ant-table-wrapper /deep/ thead.ant-table-thead tr th,
.ant-table-wrapper /deep/ tbody.ant-table-tbody tr td {
  padding-left: 6px;
  padding-right: 6px;
}
.ant-table-wrapper /deep/ .ant-table {
  table-layout: fixed;
}
.ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:last-child) {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-pagination {
  position: relative;
  margin-top: 15px;
  .ant-pagination {
    position: absolute;
    right: 0;
  }
}
</style>