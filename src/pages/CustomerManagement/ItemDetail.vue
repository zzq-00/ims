<template>
  <a-modal
    centered
    :width="600"
    :okButtonProps="{ props: {disabled: true} }"
    :visible="true"
    :footer="null"
    title="项目详情画面"
    @cancel="handleCancel">
    <div class="wrap">
      <a-table
        :pagination="false"
        :columns="columns"
        :dataSource="listData">
      </a-table>
    </div>
  </a-modal>
</template>

<script>
  export default {
    props: {
      physicalno: ''
    },
    data() {
      return {
        loading: false,
        servStatus: ["待取消","已取消","已预约","已登记","已实施","已结算","已推送"],
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => index + 1,
          },
          {
              title: '服务项目名称',
              dataIndex: 'servitemname'
          },
          {
              title: '项目明细名称',
              dataIndex: 'servitemsubname'
          },
          {
              title: '体检时间',
              dataIndex: 'servdate'
          },
          {
              title: '服务状态',
              dataIndex: 'servstatus'
          },
        ],
        listData: [
          // {
          //   key: 0,
          //   servitemname: '中医服务',
          //   servitemsubname: '中医脉诊',
          //   servdate: '2020-01-02',
          //   servstatus: '已推送'
          // },
        ],
      }
    },
    created() {
      this.fetchList();
    },
    methods: {
      fetchList() {
        let url = this.$apiList.getCheckUpItemsInformation;
        this.$axios.post(url, {
          physicalNo: this.physicalno
        }).then(res => {
          if (res.data.statusText && res.data.statusText === "Success") {
            let data = res.data.data;
            let listData = [];

            // this.total = totalCount;
            data.forEach((ele, index) => {
              listData.push({
                key: index,
                servitemname: ele.servItemName,
                servitemsubname: ele.servItemSubName,
                servstatus: this.servStatus[ele.servStatus],
                servdate: this.$moment(ele.servDate).format("YYYY-MM-DD"),
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
      handleCancel() {
        this.$emit("close", false)
      },
    },
  }
</script>

<style lang="less" scoped>
.wrap {
  max-height: 400px;
  margin: -24px;
  padding: 24px;
  overflow-y: auto;
}
</style>