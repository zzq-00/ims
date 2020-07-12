<template>
  <div>
    <a-select :customerType="customerType" v-model="selectedVal" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import api from '@/api/api-serve-apply'

export default {
	name: 'ServitemSubSelect',
	props: {
		customerType: {
			type: String,
			default () {
				return '01'
			}
		},
		serveItem: {
			type: String,
			default () {
				return undefined
			}
		},
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
		},
		customerType (newVal, oldVal) {
			this.loadList()
		},
		serveItem (newVal, oldVal) {
			this.loadList()
		}
	},
	mounted () {
		this.loadList()
		if (this.value) {
			this.selectedVal = this.value
		}
	},
	methods: {
		loadList (callback) {
			if (!this.serveItem || !this.customerType) return
			let obj = {
				serveItem: this.serveItem,
				customerType: this.customerType,
				serveItemSub: ""
			}
			api.addserveds(obj).then(res => {
				this.dataList = []
				res.data.map(item => {
					this.dataList.push({value: item.performanceSalaryId, label: item.performanceName, hasCustomerNum: item.hasCustomerNum,hasCustomerInfo: item.hasCustomerInfo})
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
		},
		getHasCustomerNum(value){
			let item = this.dataList.find(item => item.value === value)
			return item?item.hasCustomerNum:'N'
		},
		getHasCustomerInfo(value){
			let item = this.dataList.find(item => item.value === value)
			return item?item.hasCustomerInfo:'N'
		}
	}
}
</script>

<style>

</style>
