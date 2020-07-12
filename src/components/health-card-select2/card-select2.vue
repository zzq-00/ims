<template>
  <div>
    <a-select v-model="selectedVal" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
  import api from '@/api/api-health-card'

  export default {
    name: 'health-card-select',
    props: {
      placeholder: {
        type: String,
        default () {
          return '请选择'
        }
      },
      value: {
        type: [Number, Array, String],
        default () {
          return undefined
        }
      },
      mode: {
        type: String,
        default () {
          return 'default'
        }
      },
      showSearch: {
        type: Boolean,
        default () {
          return true
        }
      },
      filterOption: {
        type: Boolean,
        default () {
          return true
        }
      },
      allowClear: {
        type: Boolean,
        default () {
          return false
        }
      },
      disabled: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        dataList: [],
        selectedVal: ''
      }
    },
    watch: {
      value (newVal, oldVal) {
        this.selectedVal = newVal
      }
    },
    mounted () {
      this.loadList()
      if (this.value) {
        this.selectedVal = this.value
      }
    },
    methods: {
      getCode (id) {
        let item = this.dataList.find(item => item.value === id)
        if (item && item.code) return item.code
        return ''
      },
      loadList (callback) {
        api.getCardCodeList().then(res => {
          console.log(res, "result")
          this.dataList = []
          res.data.data.map(item => {
            if (item && item.docName) this.dataList.push({ value: item.docName.split('-')[0], label: item.docName, code: item.docName.split('-')[0] })
          })
          console.log(this.dataList)
          callback && callback()
        })
      },
      onChange (value, option) {
        this.$emit('input', value, option)
        this.$emit('change', value, option)
      },
      onSelect (value, opiton) {
        this.$emit('select', value, opiton)
      }
    }
  }
</script>

<style>

</style>
