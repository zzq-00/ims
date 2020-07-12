<template>
  <a-modal
    centered
    :width="800"
    :visible="true"
    title="既往体检信息"
    @cancel="handleCancel">
    <div class="wrap">
      <a-table
        :pagination="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="listData">
        <template slot="handle" slot-scope="text,record">
          <a @click="() => handleDetail(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="() => handlePrint(record)">打印</a>
        </template>
      </a-table>
      <!-- <div class="tab-pagination">
        <a-pagination 
          v-model="page"
          showQuickJumper
          showSizeChanger
          :pageSizeOptions="['10', '20', '50']"
          :showTotal="(total) => `共${total} 条数据`"
          @change="onPageChange"
          @showSizeChange="onShowSizeChange"
          :total="total" />
      </div> -->
    </div>
    <item-detail
      @close="()=>{detailVisible = false}"
      v-if="detailVisible"
      :physicalno="physicalno"
      ></item-detail>
    <move-list
      @close="()=>{moveVisible = false}"
      :visible="moveVisible"
      ></move-list>
    <template slot="footer">
        <a-button key="print" type="primary" @click="print">打印</a-button>
        <a-button 
          key="moveto" 
          type="primary" 
          :loading="loading" 
          @click="moveTo">
          档案转移至...
        </a-button>
      </template>
  </a-modal>
</template>

<script>
  import ItemDetail from './ItemDetail'
  import MoveList from './MoveList'
  export default {
    props: {
      visible: false,
      customerNo: ''
    },
    components: {
      ItemDetail,
      MoveList
    },
    created() {
      this.fetchList();
    },
    data() {
      return {
        detailVisible: false,
        moveVisible: false,
        loading: false,
        selectedRowKeys: [],
        physicalno: '',
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => index + 1,
          },
          {
              title: '体检号',
              dataIndex: 'physicalno'
          },
          {
              title: '体检时间',
              dataIndex: 'servdate'
          },
          {
              title: '操作',
              scopedSlots: { customRender: 'handle'}
          },
        ],
        listData: [
          // {
          //   key: 0,
          //   physicalno: '2018495662550',
          //   servdate: '2020-01-02'
          // },
        ],
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    methods: {
      fetchList() {
        let url = this.$apiList.getCheckUpInformation;
        this.$axios.post(url, {
          // page: this.page,
          // limit: this.pageSize,
          customerNo: this.customerNo
        }).then(res => {
          if (res.data.statusText && res.data.statusText === "Success") {
            let data = res.data.data;
            let listData = [];

            // this.total = totalCount;
            data.forEach((ele, index) => {
              listData.push({
                key: index,
                physicalno: ele.physicalNo,
                servstatus: ele.servStatus,
                servdate: this.$moment(ele.createDate).format("YYYY-MM-DD"),
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
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        // this.selectedRows = selectedRows;
      },
      handleDetail(record) {
        this.physicalno = record.physicalno;
        this.detailVisible = true;
      },
      handlePrint() {
      },
      print() {

      },
      moveTo() {
        return;
        
        if (this.selectedRowKeys.length > 0) {
          	/* for (var i = 0; i < count; i++) {
              var selectRows = selectRowSet.getRow(i);
                if (selectRows.data["servstatus"] < 4) {
                  var info = "体检号为" + selectRows.data["physicalno"];
                MessageBox.alert({
                  type : "warn", 
                  message : info + "未实施不能转移档案"
                });
                return;
                }
            } */
          this.moveVisible = true;
          
        } else {
          alert("请选择一条记录!");
        }
      },
      handleCancel() {
        this.$emit("close", false)
      },
      onShowSizeChange (current, pageSize) {
        this.pageSize = pageSize;
        this.page = current;
        // 重新获取列表数据
        this.fetchList();
      },
      onPageChange (page, pageSize) {
        this.pageSize = pageSize;
        this.page = page;
        this.fetchList();
      },
    },
  }
</script>

<style lang="less" scoped>
.tab-pagination {
  margin-top: 15px;
  text-align: right;
  .ant-pagination {
    display: inline-block;
  }
}
.wrap {
  margin: -24px;
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}
</style>