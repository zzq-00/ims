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
              label="证件号">
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
              label="项目">
                <a-input v-decorator="['servitemname']" allowClear></a-input>
              </a-form-item>
            </a-col>
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
          </a-row>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="服务状态">
                <a-select @change="statusChange" v-decorator="['servstatus',{ initialValue: '3' }]">
                  <!-- <a-select-option value="3">已登记</a-select-option> -->
                  <a-select-option 
                  v-for="(value,key) in servstatusMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="预约日期">
                <a-date-picker placeholder="选择日期" v-decorator="['startresdate']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="至">
                <a-date-picker placeholder="选择日期"  v-decorator="['endresdate']" />
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
    <a-card title="预约查询列表" :bordered="false" style="width: 100%">
        <yishi-modal
          @close="closeModal"
          :visible="modalVisible"
          :servstatus="modalInfo.servstatus"
          :info="modalInfo"
          ></yishi-modal>
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
  </div>
</template>

<script>
  import YishiModal from './YishiModal';
  export default {
    components: {
      YishiModal
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
              title: '联系方式',
              dataIndex: 'phone',
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
          {
              title: '服务项目',
              dataIndex: 'servitemname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '项目明细',
              dataIndex: 'servitemsubname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '医师/技师',
              dataIndex: 'doctor',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '医师结论',
              dataIndex: 'conclusion',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
        ],
        listData: [],
        modalInfo: {
          name: '',
          physicalno: '',
          sex: '',
          idno: '',
          phone: '',
          startbirthday: '',
          endbirthday: '',
          id: '',
          servitemno: '',
          servitemsubno: '',
          mecno: '',
          doctor: '',
          conclusion: ''
        },
        modalVisible: false,
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.fetchDropDown('VIP_SEX');
      this.fetchDropDown('HINS_SERV_STATUS');
      this.fetchDropDown('HINS_DOC_CONCLUSIONS'); // 确认页使用

      this.$nextTick(() => {
        this.queryData();
      });
    },
    computed: {
      genderMap () {
        return this.$store.getters['hins/cGender'];
      },
      servstatusMap () {
        return this.$store.getters['hins/cServStatus'];
      },
    },
    methods: {
      fetchDropDown(codename) {
        this.$store.dispatch('hins/fetchSelectCode', {
          codename,
        });
      },
      queryData() {
        this.page = 1;
        this.submit();
      },
      submit() {
        this.loading = true
        let url = this.$apiList.getCustHsItemList;
        this.form.validateFields((err, values) => {
          this.$axios.post(url, {
            "endbirthday": values.endbirthday && values.endbirthday.format("YYYY-MM-DD"),
            "endresdate": values.endresdate && values.endresdate.format("YYYY-MM-DD"),
            "idno": values.idno,
            "limit": this.pageSize,
            "name": values.name,
            "page": this.page,
            "phone": values.phone,
            "servItemName": values.servitemname,
            "servStatus": values.servstatus,
            "sex": values.sex,
            "physicalNo": values.physicalno,
            "startbirthday": values.startbirthday && values.startbirthday.format("YYYY-MM-DD"),
            "startresdate": values.startresdate && values.startresdate.format("YYYY-MM-DD")
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
                  birthday: this.$moment(item.birthday).format("YYYY-MM-DD"),
                  idtype: item.idtypeName,
                  idno: item.idno,
                  phone: item.phone,
                  physicalno: item.physicalNo,
                  servitemname: item.servItemName,
                  servitemsubname: item.servItemSubName,
                  servitemno: item.servItemNo,
                  servitemsubno: item.servItemSubNo,
                  servstatus: item.servStatus,
                  mecno: item.mecNo,
                  doctor: item.doctor,
                  conclusion: item.conclusion
                });
              });
              this.listData = listData;
            } else {
              this.clearData();
              this.$message.error('数据获取失败');
            }
          })
          .catch((err) => {
              this.clearData();
              this.$message.error('数据获取失败');
            console.log(err);
          });
        });
       
      },
      clearData() {
        this.total = 0;
        this.listData = [];
      },
      reset() {
        this.form.resetFields();
        this.queryData();
      },
      // 表格
      closeModal(flag) {
        this.modalVisible = false;
        if (flag==='success') {
          this.submit();
        }
      },
      statusChange() {
        this.$nextTick(() => {
          this.queryData();
        });
      },
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
        if (rowData.servstatus === "2") return;
        this.modalVisible = true;
        this.modalInfo = {
          name: rowData.name,
          id: rowData.id,
          physicalno: rowData.physicalno,
          sex: rowData.sexcode,
          idno: rowData.idno,
          phone: rowData.phone,
          servstatus: rowData.servstatus,
          servitemno: rowData.servitemno,
          servitemsubno: rowData.servitemsubno,
          mecno: rowData.mecno,
          doctor: rowData.doctor,
          conclusion: rowData.conclusion,
          startbirthday: this.form.getFieldValue("startbirthday") || "",
          endbirthday: this.form.getFieldValue("endbirthday") || ""
        }
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
  padding-left: 4px;
  padding-right: 4px;
}
.ant-table-wrapper /deep/ .ant-table{
  table-layout: fixed;
}
.ant-table-wrapper /deep/ .ant-table-thead > tr > th,
.ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:first-child) {
  max-width: 70px;
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