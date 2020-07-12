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
        <add-modal
          @close="closeModal"
          :visible="modalVisible"
          :modalType="modalType"
          :editInfo="editInfo"
          ></add-modal>
	    <a-button class="add-btn" type="primary" icon="plus" @click="addItem">新增</a-button>
      <a-table
        :pagination="false"
        :columns="columns" 
        :dataSource="listData">
        <template slot="handle" slot-scope="text,record">
          <a @click="() => handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="() => handleDel(record)">删除</a>
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
  	</a-card>
  </div>
</template>

<script>
  import AddModal from './AddModal';
  export default {
    components: {
      AddModal
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
              dataIndex: 'phone',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '操作',
              scopedSlots: {customRender: 'handle'}
          },
        ],
        listData: [
          // {
          //   key: 0,
          //   name: 'sunsongsunsonghaosunsonghao',
          //   sex: '1',
          //   birthday: '2019-08-08',
          //   idtype: '身份证',
          //   idno: '411422199902158888',
          //   phone: '18888888888',
          // }
        ],
        modalVisible: false,
        modalType: 'add', // 新增or编辑
        editInfo: {},
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.queryData();
    },
    methods: {
      queryData() {
        this.page = 1;
        this.submit();
      },
      submit() {
        this.form.validateFields((err, values) => {
          // 请至少输入一个检索条件!
          /* let collect = [];
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
          } */
          this.fetchListData(values);
        });

      },
      // 获取列表数据
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
                sexRaw: ele.sex,
                birthday: this.$moment(ele.birthday).format("YYYY-MM-DD"),
                idtype: this.idtype[ele.idtype],
                idtypeRaw: ele.idtype,
                idno: ele.idno,
                phone: ele.phone,
                id: ele.id,
                customerNo: ele.customerNo,
                company: ele.company, // 公司
                country: ele.country, // 国家
                degree: ele.degree, // 学位
                delflag: ele.delflag, // 删除标记
                email: ele.email, // 邮箱
                guardianNo: ele.guardianNo, // 监护人编码
                homeAddress: ele.homeAddress, // 地址
                homeZipcode: ele.homeZipcode, // 邮政编码
                marriage: ele.marriage, // 婚姻状况
                nationality: ele.nationality, // 民族
                occupation: ele.occupation, // 职业
                guardianIdno: ele.guardianIdno, // 监护人证件号
                guardianIdtype: ele.guardianIdtype, // 监护人证件类型
                guardianName: ele.guardianName, // 监护人姓名
                remarks: ele.remarks, // 备注
                shipAddress: ele.shipAddress, // 邮寄地址
                shipZipcode: ele.shipZipcode, // 邮寄邮编
                // teamAppointno: ''
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
        this.queryData();
      },
      // 表格
      addItem() {
        this.modalType = "add";
        this.modalVisible = true;
        this.editInfo = {};
      },
      // 编辑
      handleEdit(record) {
        this.modalVisible = true;
        this.modalType = "edit";
        this.editInfo = record;
      },
      // 删除
      handleDel(record) {
        // 当前客户已存在体检单，不能删除！(看源码),处理逻辑在后台
        const url = this.$apiList.deleteHinsCustInfo;
        const payload = {
          id: record.id,
          customerNo: record.customerNo
        };
        this.$axios.post(url,payload).then((res) => {
          if (res.data.data === 'success') {
            this.$message.success("删除成功！");
            this.queryData();
          } else if (res.data.data === 'false') {
            this.$message.error("删除失败！");
          } else {
            // modal
            this.$error({
              title: '错误',
              content: res.data.data,
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      closeModal(flag) {
        this.modalVisible = false;
        // 新增或修改成功，重新获取列表数据
        if (flag==='success') {
          // this.reset();
          // this.fetchListData(this.form.getFieldsValue());
          this.submit();
        }
      },
      // 页码
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
.add-btn {
  margin-bottom: 8px;
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
  margin-top: 15px;
  text-align: right;
  .ant-pagination {
    display: inline-block;
  }
}
</style>