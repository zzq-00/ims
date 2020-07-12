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
            label="设备编码">
              <a-input v-decorator="['devicecode']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="仪器类型">
              <a-select v-decorator="['instrumenttype']" allowClear>
                <a-select-option value="A">骨密度仪</a-select-option>
                <a-select-option value="B">脉象仪</a-select-option>
                <a-select-option value="C">鹰演</a-select-option>
                <a-select-option value="D">中卫一体机</a-select-option>
                <a-select-option value="E">双佳一体机</a-select-option>
              </a-select>
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
    <a-card title="设备信息列表" :bordered="false" style="width: 100%">
        <add-modal
          @close="closeModal"
          :visible="modalVisible"
          :modalType="modalType"
          :editInfo="editInfo"
          ></add-modal>
	    <a-button class="equ-add-btn" type="primary" icon="plus" @click="addItem">新增</a-button>
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
          labelCol: { span: 9 },
          wrapperCol: { span: 15 },
        },
        form: this.$form.createForm(this),
        mecList: [],
        // 表格
        loading: false,
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`
          },
          {
              title: '健管中心',
              dataIndex: 'mecname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '设备编码',
              dataIndex: 'devicecode',
          },
          {
              title: '仪器类型',
              dataIndex: 'instrumenttypeName',
          },
          {
              title: '操作',
              width: 120,
              scopedSlots: {customRender: 'handle'}
          },
        ],
        instrumentType: {
          "A": "骨密度仪",
          "B": "脉象仪",
          "C": "鹰演",
          "D": "中卫一体机",
          "E": "双佳一体机"
        },
        listData: [],
        modalVisible: false,
        modalType: "add",
        editInfo: {},
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.queueAjax();
    },
    computed: {
      instrumenttypeMap () {
        return this.$store.getters['hins/cInstrumentType']
      },
      mecMap () {
        let mecAll = {};
        this.mecList.forEach((mec) => {
          mecAll[mec.mecNo] = mec.mecName;
        });
        return mecAll;
      },
    },
    methods: {
      async queueAjax() {
        await this.queryMecName();
        this.queryData();
      },
      // 查询健管中心
      queryMecName() {
        let url = this.$apiList.queryMecName;
        return new Promise((resolve, reject) => {
          this.$axios.post(url).then((res) => {
            if (res.status === 0) {
              let { data } = res;
              this.mecList = data;
              resolve();
            } else {
              this.$message.error('健管中心列表获取失败');
              reject();
            }
          }).catch((err) => {
            console.log(err);
          });
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
      submit() {
        this.form.validateFields((err, values) => {
          // 请至少输入一个检索条件!
          this.fetchDataList(values);
        });
      },
      fetchDataList(va) {
        this.loading = true
        let url = this.$apiList.getEquipmentInfoList;
        this.$axios.post(url, {
          page: this.page,
          limit: this.pageSize,
          deviceCode: va.devicecode,
          mecNo: va.mecno,
          instrumentType: va.instrumenttype
        }).then(res => {
          this.loading = false
          if (res.status === 0) {
            let {data, totalCount} = res.data;
            let listData = [];

            this.total = totalCount;
            data.forEach((ele, index) => {
              listData.push({
                key: index,
                devicecode: ele.deviceCode,
                mecno: ele.mecNo,
                mecname: this.mecMap[ele.mecNo],
                instrumenttype: ele.instrumentType,
                instrumenttypeName: this.instrumentType[ele.instrumentType],
                id: ele.id
              });
            });
            this.listData = listData;
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
        console.log(record);
        this.editInfo = record;
        this.modalType = "edit";
        this.modalVisible = true;

      },
      // 删除
      handleDel(record) {
        // 当前客户已存在体检单，不能删除！(看源码)
        let url = this.$apiList.delEquipmentById;
        this.$axios.post(url, {
          id: record.id
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
      closeModal(flag) {
        this.modalVisible = false;
        // 新增或修改成功，重新获取列表数据
        if (flag==='success') {
          this.queryData();
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
.equ-add-btn {
  margin-bottom: 8px;
}
// 表格
.ant-table-wrapper /deep/ thead.ant-table-thead tr th,
.ant-table-wrapper /deep/ tbody.ant-table-tbody tr td {
  padding-left: 6px;
  padding-right: 6px;
}
.ant-table-wrapper /deep/ .ant-table{
  table-layout: fixed;
}
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