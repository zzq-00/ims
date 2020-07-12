<template>
  <div style="padding: 20px; background-color: #fff">
    <a-card title="查询条件" :bordered="false" style="width: 100%">
  		<a-form :form="form">
          <a-row :gutter="10">
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="健管中心">
              <a-select 
                  showSearch
                  :dropdownMatchSelectWidth="false"
                  optionFilterProp="children"
                  :filterOption="filterOption"
                  v-decorator="['mecno']" 
                  allowClear>
                  <a-select-option 
                    v-for="mec in mecList"
                    :key="mec.id"
                    :value="mec.mecNo">{{mec.mecName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="服务项目">
                <a-select 
                  :dropdownMatchSelectWidth="false"
                  v-decorator="['servitemno']" allowClear>
                  <a-select-option 
                  v-for="(value,key) in servItemMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="选择月份">
                <a-month-picker placeholder="选择月份" v-decorator="['workplanmonth']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="排班日期">
                <a-date-picker placeholder="选择日期" v-decorator="['workplandate']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :span="24">
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
    <a-card title="排班列表" :bordered="false" style="width: 100%">
      <a-table
        :loading="loading"
        :pagination="false"
        :columns="columns" 
        :dataSource="listData">
        <template slot="handle" slot-scope="text,record">
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询条件
        mecList: [], // 健管中心列表
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
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
              title: '健管中心',
              dataIndex: 'mecname',
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
              title: '开始时间',
              dataIndex: 'starttime',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '结束时间',
              dataIndex: 'endtime',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '最大限额人数',
              dataIndex: 'maxpeoplestr',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '操作',
              scopedSlots: {customRender: 'handle'}
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
      // 服务项目
      servItemMap () {
        return this.$store.getters['hins/cServItem'];
      },
    },
    created() {
      this.$store.dispatch('hins/fetchSelectCode', {
        codename: 'HINS_SERV_ITME'
      });
      this.queryMecName();
      this.queryData();
    },
    methods: {
      // 查询健管中心
      queryMecName() {
        let url = this.$apiList.queryMecName;
        this.$axios.post(url).then((res) => {
          if (res.status === 0) {
            let { data } = res;
            this.mecList = data;
          } else {
            this.$message.error('健管中心列表获取失败');
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      // 过滤健管中心
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
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
        let url = this.$apiList.getWorkplanDataList;
        this.$axios.post(url, {
          page: this.page,
          limit: this.pageSize,
          mecNo : values.mecno,
          servItemNo: values.servitemno,
          workPlanDate: values.workplandate && values.workplandate.format("YYYY-MM-DD"),
	        workPlanMonth: values.workplanmonth && values.workplanmonth.format("YYYY-MM"),
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
                mecno: ele.mecNo,
                mecname: ele.mecName,
                servitemno: ele.servItemNo,
                servitemname: ele.servItemName,
                starttime: ele.startTime && this.$moment(ele.startTime).format('YYYY-MM-DD HH:mm'),
                endtime: ele.endTime && this.$moment(ele.endTime).format('YYYY-MM-DD  HH:mm'),
                maxpeoplestr: ele.maxPeople < 1 ? "" : ele.maxPeople,
                workplanNo: ele.workplanNo
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
      handleDel(record) {
        let url = this.$apiList.deleteWorkPlan;
        this.$axios.post(url, {
          id: record.id,
	        workplanNo: record.workplanNo
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('删除成功');
            this.submit();
          } else if (res.status === -1) {
            this.$message.error(res.data);
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
.add-btn {
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
.ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:first-child) {
  max-width: 70px;
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