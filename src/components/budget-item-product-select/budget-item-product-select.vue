<template>
  <div>
    <a-select v-model="selectedVal" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import api from '@/api/api-budget-item'
import { Promise } from 'q'

export default {
	name: 'budget-item-product-select',
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
		},
		exeType: {
			type: String,
			default () {
				return ""
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
		exeType (newVal, oldVal) {
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
			if (!this.exeType) return
			api.getProductName({"exeType": this.exeType, queyType: "0"}).then(res => {
				this.dataList = []
				Object.keys(res.data).map(item2 => {
					this.dataList.push({ value: item2, label: item2 + "-" + res.data[item2] })
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
