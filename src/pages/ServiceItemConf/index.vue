<template>
  <div style="padding: 20px; background-color: #fff">
    <a-card title="查询条件" :bordered="false" style="width: 100%">
  		<a-form :form="form">
          <a-row :gutter="16">
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
                <a-input v-decorator="['servitemname']" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="项目明细">
                <a-input v-decorator="['servitemsubname']" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="	服务类型">
                <a-select v-decorator="['instrumentflag']" allowClear >
                  <a-select-option 
                    v-for="(value, key) in instrumentflagMap"
                    :key="key"
                    :value="key">{{value}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
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
    <a-card title="服务项目配置表" :bordered="false" style="width: 100%">
      <config-item
          @close="closeModal"
          :visible="modalVisible"
          :editInfo="editInfo"
          :modalType="modalType"
          ></config-item>
	    <a-button class="conf-add-btn" type="primary" icon="plus" @click="addItem">新增</a-button>
      <a-table
        :loading="loading"
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
  </div>
</template>

<script>
  import ConfigItem from './ConfigItem'
  export default {
    components: {
      ConfigItem
    },
    data() {
      return {
        // 查询条件
        mecList: [], // 健管中心列表
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
              title: '健管中心',
              dataIndex: 'mecno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '服务类型',
              dataIndex: 'instrumentflag',
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
              title: '总部指导价(¥)',
              dataIndex: 'guidanceprice',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '市场价(¥)',
              dataIndex: 'price',
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
        // 新增、编辑
        modalVisible: false,
        modalType: "add",
        editInfo: {},
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    computed: {
      instrumentflagMap () {
        return this.$store.getters['hins/cInstrumentFlag'];
      }
    },
    created() {
      this.fetchDropDown('HINS_INSTRUMENT_FLAG');
      this.fetchDropDown('HINS_SERV_ITME');
      this.fetchDropDown('HINS_SERV_ITME_SUB');
      this.queryMecName();
      this.queryData();
    },
    methods: {
      fetchDropDown(codename) {
        this.$store.dispatch('hins/fetchSelectCode', {
          codename,
        });
      },
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
        let url = this.$apiList.loadPage;
        this.$axios.post(url, {
          page: this.page,
          limit: this.pageSize,
          mecNo : values.mecno,
          servItemName: values.servitemname,
          servItemSubName: values.servitemsubname,
          instrumentFlag: values.instrumentflag,
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
                mecno: ele.mecName,
                instrumentflag: ele.instrumentFlagName,
                servitemname: ele.servItemName,
                servitemsubname: ele.servItemSubName,
                guidanceprice: ele.guidancePrice,
                price: ele.price,
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
      addItem() {
        this.modalType = "add";
        this.modalVisible = true;
        this.editInfo = {};
      },
      handleEdit(record) {
        this.editInfo = record;
        this.modalType = "edit";
        this.modalVisible = true;
      },
      closeModal(flag) {
        this.modalVisible = false;
        // 新增或修改成功，重新获取列表数据
        if (flag==='success') {
          this.queryData();
        }
      },
      handleDel(record) {
        let url = this.$apiList.delHinsServItem;
        this.$axios.post(url, {
          id: record.id
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('删除成功');
            // 更新列表数据
            this.queryData();
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
.conf-add-btn {
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