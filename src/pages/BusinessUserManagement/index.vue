<template>
  <div style="padding: 20px; background-color: #fff">
    <a-card title="业务用户" :bordered="false" style="width: 100%">
  		<a-form :form="form">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="用户姓名">
                <a-input v-decorator="['name']" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="用户账号">
                <a-input v-decorator="['username']" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="管理员">
                <a-checkbox v-decorator="['phone']"></a-checkbox>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="用户角色">
                <a-select 
                  :maxTagCount="1"
                  :dropdownMatchSelectWidth="false"
                  mode="multiple"
                  @change="selectChange"
                  v-decorator="['roles']">
                  <div slot="dropdownRender" slot-scope="menu">
                    <div
                      style="padding: 4px 8px; cursor: pointer;"
                      @mousedown="e => e.preventDefault()"
                    >
                      <div style="display:flex;justify-content: space-around;">
                        <div>角色名称(描述)</div>
                        <div>
                          <span>全选</span>
                          <a-checkbox :checked="checkAll" @change="selectAllRoles"></a-checkbox>
                        </div>
                      </div>
                    </div>
                    <a-divider style="margin: 4px 0;" />
                    <v-nodes :vnodes="menu" />
                  </div>
                  <a-select-option 
                    v-for="role in roles" 
                    :value="role.name" 
                    :key="role.name">
                      {{ role.name }}
                      <span v-if='role.desc'>({{role.desc}})</span>
                    </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row> -->
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
    <a-card title="业务用户一览" :bordered="false" style="width: 100%">
      <a-table
        :loading="loading"
        :pagination="false"
        :customRow="rowclick"
        :columns="columns" 
        :dataSource="listData">
        <template slot="handle" slot-scope="text,record">
          <a href="javascript:;" @click="() => handleMec(record)">设置健管中心</a>
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
    <!-- 展示弹窗用 -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
        },
        form: this.$form.createForm(this),
        roles: [
          {
            name: '管理员',
            desc: '可以配置登陆权限'
          },
          {
            name: '健管中心管家',
            desc: ''
          },
          {
            name: '健管中心管理员',
            desc: ''
          },
          {
            name: '健管中心系统管理员',
            desc: '健管中心管理员'
          },
          {
            name: '排班管理',
            desc: ''
          },
          {
            name: '普通用户',
            desc: '可以进行业务操作'
          },
          {
            name: '系统管理员',
            desc: '可以设置系统参数'
          },
          {
            name: '药库机构管理员',
            desc: ''
          },
          {
            name: '药库全局管理员',
            desc: ''
          },
          {
            name: '药库用户',
            desc: ''
          },
        ],
        checkAll: false,
        // 表格
        loading: false,
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`,
          },
          
          {
              title: '用户姓名',
              dataIndex: 'name',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '用户账号',
              dataIndex: 'userName',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '健管中心',
              dataIndex: 'mecName',
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
    created() {
      this.queryData();
    },
    beforeRouteUpdate (to, from, next) {
      if (to.name === "busiusermanage") { // 回到查询页
        this.submit();
      }
      next();
    },
    methods: {
      selectAllRoles(e) {
        if (e.target.checked) { // 全选
          let nameCollect = this.roles.map((item) => {
            return item.name;
          });
          this.checkAll = true;
          this.form.setFieldsValue({
            roles: nameCollect
          });
        } else {
          this.checkAll = false;
          this.form.setFieldsValue({
            roles: undefined
          });
        }
      },
      // 全选状态
      selectChange(value) {
        if ((value.length === this.roles.length) && (value.length !== 0)) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      queryData() {
        this.page = 1;
        this.submit();
      },
      // 查询获取列表数据
      submit() {
        this.loading = true
        this.form.validateFields((err, values) => {
          let url = this.$apiList.geCustInfoList;
          this.$axios.post(url, {
            page: this.page, 
            limit: this.pageSize,
            name: values.name,
            userName: values.username
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
                  userName: item.userName,
                  mecName: item.mecName,
                  mecNoList: item.mecNoList
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
              // this.dbclickRow(rowData, index);
            }
          }
        }
      },
      dbclickRow (rowData, index) {
      },
      // 设置健管中心
      handleMec(record) {
        // 去'' / 去重
        let mecNoList = record.mecNoList.filter((item, index, array) => {
          return item !== '' && array.indexOf(item) === index;
        });

        this.$router.push({
          name: 'busiusermec',
          params: { mecNoList },
          query: {
            username: record.userName
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