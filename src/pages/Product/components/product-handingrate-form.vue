<template>
  <div>
    <a-card style="margin: 12px;">
      <div>
        <a-divider orientation="left">
          <a-icon type="search"/>
          协议退保手续费率配置：
        </a-divider>
        <a-row>
          <a-col :span="24">
            <a-button type="primary" v-show=!readOnly class="editable-add-btn" style="float:right;margin:0px 10px 0 0;"
                      @click="handleAdd">新增
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <!--        <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>-->
          <a-table :pagination=false :dataSource="dataSource" :columns="deletedata" size="small" bordered>
            <template slot="productServiceId" slot-scope="text, record">
              <editable-cell :ref="`productServiceId_${record.key}`" formType="select"
                             :defaultEditable="record.editable"
                             :required="true" message='请选择服务' :value="record.productServiceId"
                             :text="record.productServiceId">
                <a-select-option v-for="d in dictList.productServiceIdList" :key="d.value" :value="d.value">{{d.text}}
                </a-select-option>
              </editable-cell>
            </template>

            <template slot="configCondition" slot-scope="text, record">
              <editable-cell :ref="`configCondition_${record.key}`"
                             @valueChange="onCellChange(record.key, 'configCondition', $event)" formType="select"
                             :defaultEditable="record.editable" :required="true" message='请选择配置条件'
                             :value="record.configCondition" :text="record.configCondition">
                <a-select-option v-for="d in dictList.configConditionList" :key="d.value" :value="d.value">{{d.text}}
                </a-select-option>
              </editable-cell>
            </template>
            <template slot="configStatus" slot-scope="text, record">
              <editable-cell :ref="`configStatus_${record.key}`"
                             @valueChange="onCellChange(record.key, 'configStatus', $event)" formType="select"
                             :defaultEditable="record.editable" :required="true" message='请选择条件状态'
                             :value="record.configStatus" :text="record.configStatus">
                <a-select-option v-for="d in dictList.configStatusList" :key="d.value" :value="d.value">{{d.text}}
                </a-select-option>
              </editable-cell>
            </template>


            <template slot="feeRate" slot-scope="text, record">
              <editable-cell
                :ref="`feeRate_${record.key}`"
                decoratorType="integer"
                formType="number"
                :defaultEditable="record.editable"
                :decoratorOptions="rules.feeRate"
                :required="true"
                :min="0" :max="100"
                :value="text"
                :text="text"
                placeholder='请输入'/>
            </template>

            <template slot="operation" v-show=!readOnly slot-scope="text, record">
              <div class='editable-row-operations'>

                <!--          <span v-if="record.editable">-->
                <!--            <a @click="() => save(record.key)">确认</a>-->
                <!--              <a-divider type="vertical" />-->

                <!--              <a @click="() => cancel(record.key)">取消</a>-->
                <!--              <a-divider type="vertical" />-->

                <!--          </span>-->
                <!--        <span v-else>-->
                <!--            <a @click="() => edit(record.key)">编辑</a>-->
                <!--              <a-divider type="vertical" />-->
                <!--          </span>-->
                <a-popconfirm v-if="dataSource.length">
            <span>
              <a @click="() => onDelete(record.key)">删除</a>
            </span>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </a-row>
        <a-row>

          <a-col :span="24">
            <a-button type="primary" class="editable-add-btn" v-show=!readOnly style="float:right;margin:0px 10px 0 0;"
                      @click="handleSave">保存
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>
<script>
  import EditableCell from '@/components/editablecell'
  import productApi from '@/api/api-product'
  import moment from 'moment'

  const columns = [
    {
      title: '服务名称',
      dataIndex: 'productServiceId',
      width: '20%',
      scopedSlots: {customRender: 'productServiceId'}
    },
    {
      title: '配置条件',
      dataIndex: 'configCondition',
      width: '20%',
      scopedSlots: {customRender: 'configCondition'}
    },
    {
      title: '条件状态/类型',
      dataIndex: 'configStatus',
      width: '20%',
      scopedSlots: {customRender: 'configStatus'}
    },
    {
      title: '手续费率(%)',
      dataIndex: 'feeRate',
      width: '10%',
      scopedSlots: {customRender: 'feeRate'}
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      scopedSlots: {customRender: 'operation'}
    }
  ]

  export default {
    name: "rate-form",
    components: {
      EditableCell
    },
    data() {
      return {
        dictList: {
          configStatusList: [],
          productServiceIdList: [],
          configConditionList: []
        },
        signData: [],
        mulData: [],
        dataSource: [],
        psList : [],
        count: 0,
        columns, // 用于保持数据源不变
        deletedata: columns, // 用于保留要删的数据可以做数据回滚的操作
        readOnly: false,
        fields: ['productServiceId', 'configCondition', 'configStatus', 'feeRate'],
        rules: {
          productServiceId: {
            rules: [{
              required: true,
              message: '请选择服务'
            }]
          },
          configCondition: {
            rules: [{
              required: true,
              message: '请选择配置条件'
            }]
          },
          configStatus: {
            rules: [{
              required: true,
              message: '请选择条件或类型'
            }]
          },
          feeRate: {
            rules: [{
              required: true,
              message: '请填写手续费率'
            }]
          }
        }
      }
    },
    props: {
      dataRef: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    created() {


    },
    methods: {
      moment,
      editForm(node, readOnly, type) {
        let dataValue = node.value
        this.dataSource = []
        this.readOnly = readOnly === 'readOnly'
        if (readOnly) {
          // console.log("dataValue", dataValue)
          let keyMap = {
            surrenderFeeId: "key",
            configConditionDesc: "configCondition",
            productServiceDesc: "productServiceId",
            configStatusDesc: "configStatus"
          }
          let tableData = []
          if(dataValue.hasOwnProperty('surrenderFeeRates') && dataValue.surrenderFeeRates != null){
          dataValue.surrenderFeeRates.forEach(row => {
            this.dataSource.push(
              Object.keys(row).reduce((newData, key) => {
                let newKey = keyMap[key] || key
                newData.editable = false
                newData[newKey] = row[key]
                return newData
              }, {}))
          })
          }
          var _that = this
          this.deletedata = JSON.parse(JSON.stringify(this.columns)) // 这样处理防止传的是地址地址
          let deletearray = JSON.parse(JSON.stringify(this.columns))
          for (let i = 0; i < deletearray.length; i++) {
            // 判断是要取消显示那一条，并且删除数据中没有这个数据的记录
            if (deletearray[i].dataIndex === 'operation') {
              deletearray.splice(i, 1)
              _that.deletedata = deletearray
            }
          }
        } else {
          this.initDictConfigStatus()
          this.initServiceDict(node)

          //初始化数据
          let keyMap = {surrenderFeeId: "key"}
          let tableData = []
          if (dataValue && dataValue.hasOwnProperty("surrenderFeeRates") && dataValue.surrenderFeeRates) {
            dataValue.surrenderFeeRates.forEach(row => {
              this.dataSource.push(
                Object.keys(row).reduce((newData, key) => {
                  let newKey = keyMap[key] || key
                  newData.editable = true
                  newData[newKey] = row[key]
                  return newData
                }, {}))
            })
            this.count= this.dataSource.length
          }
        }
      },
      traverseForService (node) {
        // 遍历树节点组织数据
        if (node && node.length) {
          node.map(item => {
            this.psList.push(item.value)
            if (item.children && item.children.length) {
              this.traverseForService(item.children)
            }
          })
        }
      },
      initServiceDict(node){
        this.psList = []
        this.traverseForService(node.children)
        if (this.psList.length > 0) {
          this.psList.map(item => {
            if (item.hasOwnProperty('serviceType') && (item.serviceType === '02' || item.serviceType === '03')) {
              this.dictList.productServiceIdList.push({
                value: item.productServiceId,
                text: ''.concat(item.serviceCode,"-",item.serviceName)
              })
            }
          })
        }
      },
      initDictConfigStatus() {
        // eslint-disable-next-line no-unused-expressions
        productApi.getDictType("CONFIG_STATUS").then(res => {
          // console.log(res)
          // 这里根据自己接口返回进行判断 和循环赋值
          this.dictList.configStatusList = []
          res.map(item => {
            Object.keys(item).map(item2 => {
              this.dictList.configStatusList.push({value: item2, text: item[item2]})
            })
          })
        })
        productApi.getDictType("CONFIG_CONDITION").then(res => {
          // console.log(res)
          // 这里根据自己接口返回进行判断 和循环赋值
          this.dictList.configConditionList = []
          res.map(item => {
            Object.keys(item).map(item2 => {
              this.dictList.configConditionList.push({value: item2, text: item[item2]})
            })
          })
        })

        // this.dictList.productServiceIdList.push()
      },
      // input Change事件
      onCellChange(key, dataIndex, value) {
        // console.log(`${key}, ${dataIndex}：${value} `)
        const dataSource = [...this.dataSource]
        const target = dataSource.find(item => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.dataSource = dataSource
        }
      },
      // 删除
      onDelete(key) {
        // 拷贝数组数据
        const dataSource = [...this.dataSource]
        // 过滤移除当前项目
        this.dataSource = dataSource.filter(item => item.key !== key)
      },
      // // 点击编辑
      // edit (key) {
      // 	const newData = [...this.dataSource]
      // 	const target = newData.filter(item => key === item.key)[0]
      // 	if (target) {
      // 		target.editable = true
      // 		this.dataSource = newData
      // 	}
      // },
      // // 点击保存
      // save (key) {
      // 	this.validateRow(key, this.fields, (err, values) => {
      // 		if (!err) {
      // 			const newData = [...this.dataSource]
      // 			const row = newData.find(item => key === item.key)
      // 			if (row) {
      // 				// 用户数据合并到原对象上
      // 				Object.assign(row, values)
      // 				delete row.editable
      // 				this.signData = row
      // 				console.log('单行保存row', row)
      // 				// target 保存了最新行数据，可以提价到后台
      // 				this.dataSource = newData
      // 			}
      // 		}
      // 	})
      // },
      // 点击取消
      cancel(key) {
        const newData = [...this.dataSource]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.dataSource = newData
        }
      },
      // validateRow可以提取为公共函数
      validateRow(key, fields, callback) {
        // 查找验证是否通过
        const row = {}
        let err = false
        // forEach 对每一个验证，可以更改为some满足一个就提醒
        fields.forEach(filed => {
          let refName = `${filed}_${key}`
          let result = this.$refs[refName].validate()
          row[filed] = result.value
          if (!result.success) {
            err = true
          }
        })
        callback(err, row)
      },
      // 批量提交保存数据
      handleSave: function () {
        const newData = [...this.dataSource]
        // 找出处于可编辑行
        const rows = newData.filter(row => {
          return row.editable
        })
        let count = 0
        // 一个个校验行
        rows.forEach(row => {
          this.validateRow(row.key, this.fields, (err, values) => {
            if (!err) {
              // 行记录数据合并到row中
              Object.assign(row, values)
              count++
            }
          })
        })
        // 最终数据在rows中;
        if (rows.length === count) {
          for(let i=0; i<count; i++) {
            for (let j = 0; j < count; j++) {
              if (rows[j].productServiceId === rows[i].productServiceId && i != j) {
                this.$message.error("请勿重复定义！")
                return
              }
            }
          }
          // 数据在rows,提交数据
          this.mulData = rows
          // console.log('批量多行rows', rows)
          let keyMap = {key: "surrenderFeeId"}
          let formData = {}
          formData.surrenderFeeRates = []
          rows.forEach(row => {
            formData.surrenderFeeRates.push(
              Object.keys(row).reduce((newData, key) => {
                let newKey = keyMap[key] || key
                if (key != 'editable') {
                  newData[newKey] = row[key]
                }
                return newData
              }, {}))
          })
          this.$emit('on-save', formData)
        }
      },
      // 点击新增
      handleAdd() {
        const {count, dataSource} = this
        const newData = {
          key: count,
          productServiceId: '',
          configCondition: '01',
          configStatus: "01",
          feeRate: '0'
        }
        this.dataSource = [...dataSource, newData]
        this.count = count + 1
        newData.editable = true
      }
    }
  }
</script>
<style scoped>
</style>
