<template>
  <a-modal
    centered
    :width="860"
    destroyOnClose
    :visible="true"
    title="健管中心"
    @ok="handleConfirm"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="9">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="健管中心编码">
            <a-input v-decorator="['mecno']" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="9">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="健管中心名称">
            <a-input v-decorator="['mecname']" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <div style="text-align: right;">
              <a-button type="primary" @click="handleQuery">查询</a-button>
              <a-button @click="reset">重置</a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="modal-wrap">
      <a-table
        :pagination="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="listData">
      </a-table>
    </div>
  </a-modal>
</template>

<script>

  export default {
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        form: this.$form.createForm(this),
        // 表格
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${index+1}`,
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
        ],
        listData: [],
        selectedRowKeys: [],
        // selectedRows: [],
        mecNoList: []
      }
    },
    created() {
      this.fetchMecNo();
      this.handleQuery();
    },
    beforeDestroy() {
      sessionStorage.removeItem('mecNoList');
    },
    methods: {
      fetchMecNo() {
        const mecNoList = sessionStorage.getItem('mecNoList');
        if (mecNoList) {
          this.mecNoList = JSON.parse(mecNoList);
        } else {
          this.mecNoList = this.$route.params.mecNoList;
          sessionStorage.setItem('mecNoList', JSON.stringify(this.$route.params.mecNoList));
        }

        this.selectedRowKeys = this.mecNoList;
      },
      reset() {
        this.selectedRowKeys = [];
        this.form.resetFields();
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        // this.selectedRows = selectedRows;
      },
      handleQuery() {
        // 重置选中项
        this.selectedRowKeys = this.mecNoList;

        this.form.validateFields((err, values) => {
          let url = this.$apiList.getMecInfoList;
          this.$axios.post(url, {
            mecNo: values.mecno,
            mecName: values.mecname
          }).then((res) => {
            if (res.status === 0) {
              let data = res.data;
              let listData = [];
              if (data === undefined) {
                return;
              }

              data.forEach((item, index) => {
                // 设置默认选中项
                listData.push({
                  key: item.mecNo,
                  id: item.id,
                  mecname: item.mecName,
                  mecno: item.mecNo
                });
              });
              this.listData = listData;

            } else {
              this.$message.error("保存失败");
            }
          }).catch((err) => {
            console.log(err);
          });
        });
      },
      handleConfirm() {
        let selectedRowKeys = [];
        this.listData.forEach((item, index, array) => {
          if (item.mecno && this.selectedRowKeys.indexOf(item.mecno) > -1) {
            selectedRowKeys.push(item.mecno);
          }
        });
        if (selectedRowKeys.length > 10) {
          this.$info({
            title: "提示",
            content: "最多选择10个健管中心!"
          })
          return;
        } else if (selectedRowKeys.length < 1) {
          this.$info({
            title: "提示",
            content: "最少选择一个健管中心!"
          })
          return;
        }

        let url = this.$apiList.saveCapUsersHospital;
        this.$axios.post(url, {
          userName: this.$route.query.username,
          mecNos: selectedRowKeys.join(',')
        }).then((res) => {
          if (res.status === 0) {
            this.$message.success("保存成功");
            this.handleCancel();
          } else {
            this.$message.error("保存失败");
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleCancel() {
        this.$router.push({
          name: 'busiusermanage'
        });
      },
    },
  }
</script>

<style lang="less" scoped>
.modal-wrap {
  max-height: 400px;
  margin: -24px;
  padding: 24px;
  overflow-y: auto;
}
strong {
  display: inline-block;
  padding: 16px 0;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}
.first-strong {
  padding-top: 0;
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
// 表单
.ant-form /deep/ .ant-form-item-label{
    text-align: left;
  }
</style>