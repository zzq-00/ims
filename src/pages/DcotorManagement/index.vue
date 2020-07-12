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
                  <a-select-option
                  v-for="(value,key) in genderMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
                </a-select>
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
              label="手机">
                <a-input v-decorator="['phone']" allowClear />
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
                <a-date-picker placeholder="选择日期" v-decorator="['birthdayEndTo']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
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
    <a-card title="医师/技师信息列表" :bordered="false" style="width: 100%">
	    <a-button class="doc-add-btn" type="primary" icon="plus" @click="addItem">新增</a-button>
      <a-table
        :loading="loading"
        :scroll="{ x: 'max-content'}"
        :pagination="false"
        :columns="columns"
        :dataSource="listData">
          <template slot="handle" slot-scope="text,record">
            <a @click="() => handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除?"
              @confirm="() => handleDel(record)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
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
    <!-- 新增编辑弹窗 -->
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
      idtype: ["身份证","护照","军官证","工作证","其他"],
      columns: [
        {
          title: "序号",
          fixed: true,
          width: 60,
          customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`,
        },
        {
            title: '姓名',
            dataIndex: 'name',
          fixed: true,
          width: 80,
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
            title: '健管中心',
            dataIndex: 'mecno',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '医师级别',
            dataIndex: 'docclass',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '医师编码',
            dataIndex: 'docno',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '所属科室',
            dataIndex: 'department',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '民族',
            dataIndex: 'nationality',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '婚姻状况',
            dataIndex: 'marriage',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '学历',
            dataIndex: 'degree',
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
            title: '证件号',
            dataIndex: 'idno',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '电话',
            dataIndex: 'phone',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '电子邮箱',
            dataIndex: 'email',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '单位名称',
            dataIndex: 'company',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '家庭住址',
            dataIndex: 'homeaddress',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
        },
        {
            title: '操作',
            width: 120,
            scopedSlots: {customRender: 'handle'},
            fixed: 'right',
        },
      ],
      listData: [],
      // 分页
      pageSize: 10,
      page: 1,
      total: 0,
    }
  },
  computed: {
    genderMap () {
      return this.$store.getters['hins/cGender'];
    },
    degreeMap () {
      return this.$store.state.hins.degree;
    },
    idtypeMap () {
      return this.$store.state.hins.idtype;
    },
    docclassMap () {
      return this.$store.state.hins.docclass;
    },
    marriageMap () {
      return this.$store.state.hins.marriage;
    },
  },
  created() {
    this.$store.dispatch('hins/fetchSelectCode', {
      codename: 'VIP_SEX'
    });
    this.queryData();
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === "doctormanagement") { // 回到查询页
      this.submit();
    }
    next();
  },
  methods: {
    queryData() {
      this.page = 1;
      this.submit();
    },
    // 查询获取列表数据
    submit() {
      this.form.validateFields((err, values) => {
        this.fetchList(values);
      });

    },
    fetchList(values) {
      this.loading = true
      let url = this.$apiList.getDoctorByService;
      this.$axios.post(url, {
        page: this.page,
        limit: this.pageSize,
        name: values.name,
        sex: values.sex,
        idno: values.idno,
        phone: values.phone,
        startBirthday: values.birthdayBeginFrom && values.birthdayBeginFrom.format("YYYY-MM-DD"),
        endBirthday: values.birthdayEndTo && values.birthdayEndTo.format("YYYY-MM-DD")
      }).then(res => {
        this.loading = false
        if (res.status === 0) {
          let { data, totalCount } = res.data;
          let tempData = [];
          this.total = totalCount;

          data.forEach((ele, index) => {
            tempData.push({
              key: index,
              id: ele.id,
              name: ele.name,
              sex: ele.sexTypeName,
              birthday: ele.birthday && this.$moment(ele.birthday).format("YYYY-MM-DD"),
              mecno: ele.mecName,
              docclass: ele.docClassName,
              docno: ele.docNo,
              department: ele.department,
              nationality: ele.nationality,
              marriage: ele.marriageTypeName,
              degree: ele.educationTypeName,
              idtype: ele.ceritTypeName,
              idno: ele.idno,
              phone: ele.phone,
              email: ele.email,
              company: ele.company,
              homeaddress: ele.homeAddress
            });
          });
          this.listData = tempData;
        } else {
          this.$message.error('查询失败');
        }
      }).catch(err => {
        console.log(err);
      });
    },
    reset() {
      this.form.resetFields();
    },
    // 表格
    // 新增
    addItem() {
      this.$router.push({
        name: "docbaseinfo",
        query: {
          t: "add"
        }
      });
    },
    handleEdit (rowData) {
      this.$router.push({
        name: "docbaseinfo",
        // 根据id查询详情
        query: {
          k: rowData.id,
          t: "edit"
        }
      });
    },
    // 删除行
    handleDel (rowData) {
      let url = this.$apiList.delDocInfoById;
      this.$axios.post(url, {
        id: rowData.id
      }).then(res => {
        if (res.status === 0) {
          this.$message.success('删除成功');
          this.submit();
        } else if (res.status === -1) {
          this.$message.error(res.statusText);
        } else {
          this.$message.error('删除失败');
        }
      }).catch(err => {
        console.log(err);
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

.doc-add-btn {
  margin-bottom: 8px;
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
.ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:first-child),
.ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:last-child) {
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
