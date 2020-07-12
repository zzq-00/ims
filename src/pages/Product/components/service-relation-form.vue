<template>
  <div>
    <a-card style="margin: 12px;">
      <div>
        <a-divider orientation="left">
          <a-icon type="search"/>
          各服务间关系：
        </a-divider>
        <a-row>
          <a-col :span="24">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin:0px 10px 0 0;"  v-show=!readOnly
                      @click="handleAdd">新增
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <!--        <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>-->
          <a-table tableLayout='fix' :rowKey='record=>record.key' :pagination=false :dataSource="proserverelaData"
                   :columns="deletedata" bordered size="small">
            <template slot="productServiceName" slot-scope="text, record">
            </template>
            <template slot="mainServiceCode" slot-scope="text, record">
              <editable-cell :ref="`mainServiceCode_${record.key}`" formType="select" :defaultEditable="record.editable"
                             :required="true" message='请选择服务' :value="record.mainServiceCode"
                             :text="record.mainServiceCode">
                <a-select-option v-for="d in dictList.productServiceIdList" :key="d.value" :value="d.value">{{d.text}}
                </a-select-option>
              </editable-cell>
            </template>

            <template slot="serviceRelaType" slot-scope="text, record">
              <editable-cell :ref="`serviceRelaType_${record.key}`"
                             @valueChange="onCellChange(record.key, 'serviceRelaType', $event)" formType="select"
                             :defaultEditable="record.editable" :required="true" message='请选择配置关系'
                             :value="record.serviceRelaType" :text="record.serviceRelaType">
                <a-select-option v-for="d in dictList.serviceRelaList" :key="d.value" :value="d.value">{{d.text}}
                </a-select-option>
              </editable-cell>
            </template>
            <template slot="minorServiceCode" slot-scope="text, record">
              <editable-cell :ref="`minorServiceCode_${record.key}`"
                             @valueChange="onCellChange(record.key, 'configStatus', $event)" formType="select"
                             :defaultEditable="record.editable" :required="true" message='请选择服务'
                             :value="record.minorServiceCode" :text="record.minorServiceCode">
                <a-select-option v-for="d in dictList.productServiceIdList" :key="d.value" :value="d.value">{{d.text}}
                </a-select-option>
              </editable-cell>
            </template>


            <template slot="operation" slot-scope="text, record">
              <div class='editable-row-operations'>
                <a-popconfirm v-if="proserverelaData.length">
            <span>
              <a @click="() => onDelete(record.key)">删除</a>
            </span>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </a-row>
        <a-row>
          <a-divider orientation="left">
            <a-icon type="search"/>
            各服务执行顺序：
          </a-divider>
          <!--        <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>-->
          <a-table :pagination=false :dataSource="orderServiceData" :columns="ordercolumns" bordered size="small">

            <template slot="exeOrder" slot-scope="text, record">
              <editable-cell :ref="`exeOrder_${record.key}`"
                             @valueChange="onCellChange(record.key, 'exeOrder', $event)" formType="select"
                             :defaultEditable="record.editable" :required="true" message='请选择配置关系'
                             :value="record.exeOrder" :text="record.exeOrder">
                <a-select-option v-for="d in dictList.configOrderList" :key="d.value" :value="d.value">{{d.text}}
                </a-select-option>
              </editable-cell>
            </template>
          </a-table>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin:0px 10px 0 0;"  v-show=!readOnly
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

  const columns=[
    {
      title: '服务包/产品',
      dataIndex: 'productServiceName',
      width: '0',
      scopedSlots: {customRender: 'parentServiceName'}
    },
    {
      title: '服务',
      dataIndex: 'mainServiceCode',
      width: '20%',
      scopedSlots: {customRender: 'mainServiceCode'}
    },
    {
      title: '关系',
      dataIndex: 'serviceRelaType',
      width: '20%',
      scopedSlots: {customRender: 'serviceRelaType'}
    },
    {
      title: '服务',
      dataIndex: 'minorServiceCode',
      width: '20%',
      scopedSlots: {customRender: 'minorServiceCode'}
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      scopedSlots: {customRender: 'operation'}
    }
  ]
  export default {
    name: "relation-form",
    components: {
      EditableCell
    },
    data() {
      return {
        dictList: {
          configStatusList: [],
          serviceRelaList: [],
          configOrderList: [],
          productServiceIdList: []
        },
        signData: [],
        mulData: [],
        readOnly: false,
        // 服务关系数组
        proserverelaData: [],
        orderServiceData: [],
        productpackId: '',
        productpackName: '',
        count: 0,
        columns, // 用于保持数据源不变
        deletedata: columns, // 用于保留要删的数据可以做数据回滚的操作
        fields: ['mainServiceCode', 'serviceRelaType', 'minorServiceCode'],
        orderfields: ['exeOrder'],
        ordercolumns: [
          {
            title: '服务包/产品',
            dataIndex: 'parentServiceName',
            width: '20%',
            scopedSlots: {customRender: 'parentServiceName'}
          },
          {
            title: '服务',
            dataIndex: 'serviceName',
            width: '20%',
            scopedSlots: {customRender: 'serviceName'}
          },
          {
            title: '执行顺序',
            dataIndex: 'exeOrder',
            width: '20%',
            scopedSlots: {customRender: 'exeOrder'}
          }
        ],
        // fields: ['productServiceId', 'productServiceName', 'mainServiceCode', 'serviceRelaType', 'minorServiceCode'],
        // orderFields: ['parentServiceName', 'serviceCode', 'exeOrder'],
        rules: {
          // mainServiceCode: {
          // 	rules: [{
          // 		required: true,
          // 		message: '请选择服务名词'
          // 	}]
          // },
          // configCondition: {
          // 	rules: [{
          // 		required: true,
          // 		message: '请选择配置条件'
          // 	}]
          // },
          // configStatus: {
          // 	rules: [{
          // 		required: true,
          // 		message: '请选择条件或类型'
          // 	}]
          // }
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
      editForm(dataValue, readOnly) {
        //注意*** 编辑和查询传递的dataValue格式不同
        this.proserverelaData = []
        this.orderServiceData = []
        this.readOnly = readOnly === 'readOnly'
        if (readOnly) {
          let keyMap = {serviceRelaId: "key" ,serviceRelaTypeDesc: 'serviceRelaType',mainServiceName:'mainServiceCode',minorServiceName:'minorServiceCode'}
          if (dataValue.type === 'product') {
            if (dataValue.value.hasOwnProperty('psList') && !(Object.keys(dataValue.value.psList).length === 0 && dataValue.value.psList.constructor === Array) && dataValue.value.psList.length > 0) {
              dataValue.value.psList.forEach(item => {
                if ( item.hasOwnProperty('prodServeRela') && item.prodServeRela != null && !(Object.keys(item.prodServeRela).length === 0 && item.prodServeRela.constructor === Object)) {
                  item.prodServeRela.forEach(row => {
                    this.proserverelaData.push(
                      Object.keys(row).reduce((newData, key) => {
                        let newKey = keyMap[key] || key
                        newData.editable = !readOnly
                        newData[newKey] = row[key]
                        return newData
                      }, {}))
                  })
                }
              })
            }
          }
          if (dataValue.type === 'package') {
            if( dataValue.value.hasOwnProperty('prodServeRela') && dataValue.value.prodServeRela!=null && !(Object.keys(dataValue.value.prodServeRela).length === 0 && dataValue.value.prodServeRela.constructor === Object)) {
              dataValue.value.prodServeRela.forEach(row => {
                this.proserverelaData.push(
                  Object.keys(row).reduce((newData, key) => {
                    let newKey = keyMap[key] || key
                    newData.editable = false
                    newData[newKey] = row[key]
                    return newData
                  }, {}))
              })
            }
          }
          let orderServiceData = []
          if (dataValue.children.length > 0) {
            let length = '1'
            dataValue.children.map(item => {
              if (item.value.hasOwnProperty('serviceType') && (item.type === 'service' || item.type === 'package')) {
                const  exeorder = item.value.exeOrder || '0'

                const newData = {
                  key: item.key,
                  parentServiceName: dataValue.title,
                  serviceCode: item.value.serviceCode,
                  serviceName: item.value.serviceName,
                  exeOrder: exeorder==='0'? '00-无关': ''.concat('第',exeorder,'顺位'),
                  editable: !readOnly
                }
                orderServiceData.push(newData)
                length++
              }
            })
            this.orderServiceData = orderServiceData
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
        }else {
          this.productpackId = this.dataRef.key
          this.productpackName = this.dataRef.title
          this.initDictConfigStatus()
          this.initProduct()
          this.initDictOrderStatusAndProduct()
        }
      },
      initProduct() {
        this.dictList.productServiceIdList = []
        if (this.dataRef.hasOwnProperty('children') && this.dataRef.children.length > 0) {
          this.dataRef.children.map(item => {
            if (item.value.hasOwnProperty('serviceType') && item.type === 'service') {
              this.dictList.productServiceIdList.push({
                value: item.value.serviceCode,
                text: item.title
              })
            }
          })
        }
        this.proserverelaData = []
        let keyMap = {serviceRelaId: "key"}
        if (this.dataRef.hasOwnProperty('type') && this.dataRef.type === 'product') {
          if (this.dataRef.value.hasOwnProperty('psList') && !(Object.keys(this.dataRef.value.psList).length === 0 && this.dataRef.value.psList.constructor === Array) && this.dataRef.value.psList.length > 0) {
            this.dataRef.value.psList.forEach(item => {
              if (item.productServiceId === this.productpackId && item.hasOwnProperty('prodServeRela') && !(Object.keys(item.prodServeRela).length === 0 && item.prodServeRela.constructor === Object)) {
                item.prodServeRela.forEach(row => {
                  this.proserverelaData.push(
                    Object.keys(row).reduce((newData, key) => {
                      let newKey = keyMap[key] || key
                      newData.editable = true
                      newData[newKey] = row[key]
                      return newData
                    }, {}))
                })
                this.count = this.proserverelaData.length
              }
            })
          }
        }
        if (this.dataRef.hasOwnProperty('type') && this.dataRef.type === 'package') {
          if (this.dataRef.key === this.productpackId && this.dataRef.value.hasOwnProperty('prodServeRela') && !(Object.keys(this.dataRef.value.prodServeRela).length === 0 && this.dataRef.value.prodServeRela.constructor === Object)) {
            this.dataRef.value.prodServeRela.forEach(row => {
              this.proserverelaData.push(
                Object.keys(row).reduce((newData, key) => {
                  let newKey = keyMap[key] || key
                  newData.editable = true
                  newData[newKey] = row[key]
                  return newData
                }, {}))
            })
          }
        }

      },
      initDictOrderStatusAndProduct() {
        let orderServiceData = []
        this.dictList.configOrderList = [{value: '0', text: '00-无关'}]
        if (this.dataRef.hasOwnProperty('children') && this.dataRef.children.length > 0) {
          let length = '1'
          this.dataRef.children.map(item => {
            if (item.value.hasOwnProperty('serviceType') && (item.type === 'service' || item.type === 'package')) {
              this.dictList.configOrderList.push({
                value: String(length),
                text: ''.concat('第', String(length), '顺位')
              })
              const newData = {
                key: item.key,
                parentServiceName: this.productpackName,
                serviceCode: item.value.serviceCode,
                serviceName: item.title,
                exeOrder: item.value.exeOrder || '0',
                editable: true
              }
              orderServiceData.push(newData)
              length++
            }
          })
          this.orderServiceData = orderServiceData
        }
      },
      initDictConfigStatus() {
        // eslint-disable-next-line no-unused-expressions
        productApi.getDictType("SERVICE_RELA_TYPE").then(res => {
          // 这里根据自己接口返回进行判断 和循环赋值
          this.dictList.serviceRelaList = []
          res.map(item => {
            Object.keys(item).map(item2 => {
              this.dictList.serviceRelaList.push({value: item2, text: item[item2]})
            })
          })
        })

        // this.dictList.productServiceIdList.push()
      },
      // input Change事件
      onCellChange(key, dataIndex, value) {
        const proserverelaData = [...this.proserverelaData]
        const target = proserverelaData.find(item => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.proserverelaData = proserverelaData
        }
      },
      // 删除
      onDelete(key) {
        // 拷贝数组数据
        const proserverelaData = [...this.proserverelaData]
        // 过滤移除当前项目
        this.proserverelaData = proserverelaData.filter(item => item.key !== key)
      },
      // 点击编辑
      edit(key) {
        const newData = [...this.proserverelaData]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target.editable = true
          this.proserverelaData = newData
        }
      },
      // 点击保存
      save(key) {
        this.validateRow(key, this.fields, (err, values) => {
          if (!err) {
            const newData = [...this.proserverelaData]
            const row = newData.find(item => key === item.key)
            if (row) {
              // 用户数据合并到原对象上
              Object.assign(row, values)
              delete row.editable
              this.signData = row
              // target 保存了最新行数据，可以提价到后台
              this.proserverelaData = newData
            }
          }
        })
      },
      // 点击取消
      cancel(key) {
        const newData = [...this.proserverelaData]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.proserverelaData = newData
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
      validateRowSameProduct(key, fields, callback) {
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
          // 特殊校验
          fields.forEach(filedn => {
            const e = (filedn !== filed && this.$refs[`${filed}_${key}`].validate().value === this.$refs[`${filedn}_${key}`].validate().value)
            if (e) {
              this.$message.warn('同一服务不能配置服务关系')
              err = err || e
            }
          })
        })
        callback(err, row)
      },
      // 批量提交保存数据
      handleSave: function () {
        const newData = [...this.proserverelaData]
        // 找出处于可编辑行
        const rows = newData.filter(row => {
          return row.editable
        })
        let count = 0
        // 一个个校验行
        rows.forEach(row => {
          this.validateRowSameProduct(row.key, this.fields, (err, values) => {
            if (!err) {
              // 行记录数据合并到row中
              Object.assign(row, values)
              count++
            }
          })
        })

        const orderData = [...this.orderServiceData]
        orderData.forEach(row => {
          this.validateRow(row.key, this.orderfields, (err, values) => {
            if (!err) {
              // 行记录数据合并到row中
              Object.assign(row, values)
            }
          })
        })
        let formData = {
          rela: [],
          order: []
        }
        // 最终数据在rows中;
        if (rows.length === count) {
          // 数据在rows,提交数据
          this.mulData = rows
          let keyMap = {key: "serviceRelaId"}

          formData.rela = []
          let relaObj = {productServiceId: this.productpackId, prodServeRela: []}
          rows.forEach(row => {
            relaObj.prodServeRela.push(
              Object.keys(row).reduce((newData, key) => {
                let newKey = keyMap[key] || key
                if (key != 'editable') {
                  newData[newKey] = row[key]
                }
                return newData
              }, {}))
          })
          formData.rela.push(relaObj)
          orderData.forEach(row => {
            formData.order.push({productServiceId: row['key'], exeOrder: row['exeOrder']})
          })
          this.$emit('on-save', formData)
        }
      },
      // 点击新增
      handleAdd() {
        const {count, proserverelaData} = this
        const newData = {
          key: count,
          productServiceId: this.productpackId,
          productServiceName: this.productpackName,
          mainServiceCode: "",
          serviceRelaType: '03',
          minorServiceCode: ''
        }
        this.proserverelaData = [...proserverelaData, newData]
        this.count = count + 1
        newData.editable = true
      }
    }
  }
</script>
<style scoped>
</style>
