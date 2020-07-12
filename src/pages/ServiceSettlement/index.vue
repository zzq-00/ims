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
              label="手机">
                <a-input v-decorator="['phone']" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="证件号码">
                <a-input v-decorator="['idno']" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="性别">
                <a-select v-decorator="['sex']" allowClear>
                  <a-select-option 
                  v-for="(value,key) in genderMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="体检号">
                <a-input v-decorator="['physicalno']" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="出生日期">
                <a-date-picker placeholder="选择日期" v-decorator="['startbirthday']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="至">
                <a-date-picker placeholder="选择日期" v-decorator="['endbirthday']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
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
    <a-card title="检测/服务结算列表" :bordered="false" style="width: 100%">
      <a-table
        :loading="loading"
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
    <!-- 展示弹窗用 -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 },
        },
        form: this.$form.createForm(this),
        // 表格
        loading: false,
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`,
          },
          {
              title: '客户姓名',
              dataIndex: 'name',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '性别',
              dataIndex: 'sex',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '出生日期',
              dataIndex: 'birthday',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '联系方式',
              dataIndex: 'phone',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '证件类型',
              dataIndex: 'idtype',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '证件号码',
              dataIndex: 'idno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '体检号',
              dataIndex: 'physicalno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
        ],
        listData: [],
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.$store.dispatch('hins/fetchSelectCode', {
        codename: 'VIP_SEX'
      });
      this.queryData();
    },
    computed: {
      genderMap () {
        return this.$store.getters['hins/cGender'];
      },
    },
    methods: {
      queryData() {
        this.page = 1;
        this.submit();
      },
      // 查询获取列表数据
      submit() {
        this.loading = true
        this.form.validateFields((err, values) => {
          let url = this.$apiList.getHsConclusionList;
          this.$axios.post(url, {
            page: this.page, 
            limit: this.pageSize,
            name: values.name,
            sex: values.sex,
            phone: values.phone,
            physicalNo: values.physicalno,
            idNo: values.idno,
            startbirthday: values.startbirthday && values.startbirthday.format("YYYY-MM-DD"),
            endbirthday: values.endbirthday && values.endbirthday.format("YYYY-MM-DD")
          }).then((res) => {
            this.loading = false
            if (res.status === 0) {
              let {data, totalCount} = res.data;
              let listData = [];

              this.total = totalCount;
              data.forEach((item, index) => {
                listData.push({
                  key: index,
                  id: item.id,
                  name: item.name,
                  sex: item.sexName,
                  sexcode: item.sex,
                  birthday: item.birthday?this.$moment(item.birthday).format("YYYY-MM-DD"):"",
                  phone: item.phone,
                  idno: item.idNo,
                  idtype: item.idtypeName,
                  idtypecode: item.idType,
                  physicalno: item.physicalNo,
                  servstatus: item.servStatus,
                });
              });
              this.listData = listData;
            } else {
              this.$message.error("数据获取失败");
            }
          })
          .catch((err) => {
            console.log(err);
          });

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
        this.$router.push({
          name: "infoglance",
          // 根据id查询详情
          query: {
            k: rowData.id,
            no: rowData.physicalno,
            uname: rowData.name,
            status: rowData.servstatus,
            bir: rowData.birthday
          }
        });
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
.ant-table-wrapper /deep/ thead.ant-table-thead tr th,
.ant-table-wrapper /deep/ tbody.ant-table-tbody tr td {
  padding-left: 6px;
  padding-right: 6px;
}
.ant-table-wrapper /deep/ .ant-table{
  table-layout: fixed;
}
// .ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:last-child) {
.ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:first-child) {
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-pagination {
  margin-top: 15px;
  text-align: right;
  .ant-pagination {
    display: inline-block;
  }
}
</style>