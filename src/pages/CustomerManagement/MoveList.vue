<template>
  <a-modal
    centered
    :width="800"
    :visible="visible"
    title="客户列表"
    @cancel="handleCancel">
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
      <a-table
        :pagination="false"
        :columns="columns" 
        :dataSource="listData">
        <template slot="handle" slot-scope="text,record">
          <a @click="() => startMove(record)">档案转移</a>
        </template>
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
  </a-modal>
</template>

<script>
  export default {
    props: {
      visible: false
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
              dataIndex: 'name'
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
              dataIndex: 'idno'
          },
          {
              title: '联系方式',
              dataIndex: 'phone'
          },
          {
              title: '操作',
              scopedSlots: {customRender: 'handle'}
          }
        ],
        listData: [
          {
            key: 0,
            name: 'sunsong',
            sex: '1',
            birthday: '2019-08-08',
            idtype: '身份证',
            idno: '411422199902158888',
            phone: '18888888888',
          },
          {
            key: 1,
            name: 'sunsong',
            sex: '1',
            birthday: '2019-08-08',
            idtype: '身份证',
            idno: '',
            phone: '',
          },
        ],
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
          "idNo": values.idno,
          "birthdayBegin": values.birthdayBeginFrom,
          "birthdayEnd": values.birthdayEndTo
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
      startMove() {
        alert("是否确认将选择的档案移植？");
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
      handleCancel() {
        this.$emit("close", false)
      },
    },
  }
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: 100%;
}
.ant-table-wrapper /deep/ thead.ant-table-thead tr th,
.ant-table-wrapper /deep/ tbody.ant-table-tbody tr td {
  padding-left: 6px;
  padding-right: 6px;
}
.tab-pagination {
  margin-top: 15px;
  text-align: right;
  white-space: nowrap;
  .ant-pagination {
    display: inline-block;
  }
}
</style>