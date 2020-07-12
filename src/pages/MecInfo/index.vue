<template>
  <div style="padding: 20px; background-color: #fff">
    <a-card title="查询条件" :bordered="false" style="width: 100%">
  		<a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="健管中心名称">
              <a-input v-decorator="['mecname']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="负责人">
              <a-input v-decorator="['headname']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="预约电话">
              <a-input v-decorator="['emcappointphone']" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="详细地址">
              <a-input v-decorator="['address']" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="所在地区">
              <a-select 
              :dropdownMatchSelectWidth="false"
              v-decorator="['city']" allowClear>
                <a-select-option 
                  v-for="(city, code) in cityMap"
                  :key="code"
                  :value="code">{{city}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="健管中心等级">
              <a-select v-decorator="['meclevel']" allowClear>
                <a-select-option 
                    v-for="(value,key) in hoslevelMap"
                    :key="key"
                    :value="key">{{value}}</a-select-option>
              </a-select>
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
    <a-card title="体检分部信息列表" :bordered="false" style="width: 100%">
        <add-modal
          @close="closeModal"
          :visible="modalVisible"
          :editInfo="editInfo"
          :modalType="modalType"
          ></add-modal>
	    <a-button class="mec-add-btn" type="primary" icon="plus" @click="addItem">新增</a-button>
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
  import AddModal from './AddModal';
  export default {
    components: {
      AddModal
    },
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 11 },
          wrapperCol: { span: 13 },
        },
        form: this.$form.createForm(this),
        // 表格
        loading: false,
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`
          },
          {
              title: '健管中心编码',
              dataIndex: 'mecno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '健管中心名称',
              dataIndex: 'mecname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '负责人',
              dataIndex: 'headname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '预约电话',
              dataIndex: 'emcappointphone',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '详细地址',
              dataIndex: 'address',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '所在地区',
              dataIndex: 'city',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '健管中心等级',
              dataIndex: 'meclevel',
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
          //   mecno: 'H11001903',
          //   mecname: '中国人民保险健康管理中心北京示范店',
          //   headname: '孙小小',
          //   emcappointphone: '18888888888',
          //   address: '北京市方圆大厦5层',
          //   city: '内蒙古自治区',
          //   meclevel: '一级'
          // },
        ],
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
      cityMap() {
        return this.$store.getters['hins/cProvinces']
      },
      hoslevelMap() {
        return this.$store.getters['hins/cHosLevel']
      }
    },
    created() {
      this.fetchDropDown('HINS_MEC_PROVINCE');
      this.fetchDropDown('HOS_LEVEL_CODE');
      this.queryData();
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
        this.form.validateFields((err, values) => {
          // 请至少输入一个检索条件!
          this.fetchDataList(values);
        });
      },
      fetchDataList(va) {
        this.loading = true
        let url = this.$apiList.getMecInfo;
        this.$axios.post(url, {
          page: this.page,
          limit: this.pageSize,
          mecName: va.mecname,
          address: va.address,
          headName: va.headname,
          emcAppointPhone: va.emcappointphone,
          city: va.city,
          mecLevel: va.meclevel
        }).then(res => {
          this.loading = false
          if (res.status === 0) {
            let {data, totalCount} = res.data;
            let listData = [];

            this.total = totalCount;
            data.forEach((ele, index) => {
              listData.push({
                key: index,
                id: ele.id,
                mecno: ele.mecNo,
                mecname: ele.mecName,
                headname: ele.headName,
                emcappointphone: ele.emcAppointPhone,
                address: ele.address,
                city: ele.citylTypeName,
                cityRaw: ele.city,
                meclevel: ele.mecLevelTypeName,
                mecLevelRaw: ele.mecLevel
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
      // 删除前检查医院下时候有服务项目配置
      handleDel (record) {
        let url = this.$apiList.getHinsServItemListByMecno;
        this.$axios.post(url, {
          mecNo: record.mecno,
        }).then(res => {
          if (res.status === 0) {
            let { data } = res;
            if (data.length === 0) {
              this.deleteMec(record.id);
            } else {
              this.$message.error('此医院下有服务项目配置，请先删除服务项目配置！');
            }
          } else {
            this.$message.error('删除失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      // 删除
      deleteMec(id) {
        let url = this.$apiList.delById;
        this.$axios.post(url, {
          id,
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('删除成功');
            this.queryData();
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
.mec-add-btn {
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
  max-width: 90px;
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