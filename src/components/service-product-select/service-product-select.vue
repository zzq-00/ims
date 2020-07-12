<template>
  <div>
    <a-select v-model="selectedVal" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import api from '@/api/api-product-network'

export default {
	name: 'service-product-select',
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
		productCode: {
			type: String,
			default () {
				return ''
			}
		},
		callType: {
			type: String,
			default () {
				return ''
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
		productCode (newVal, oldVal) {
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
		// getClassNames (ids) {
		// 	let items = this.dataList.filter(item =>
		// 		ids.findIndex((value, index, arr) => {
		// 			return item.id === value
		// 		}) >= 0
		// 	)
		// 	let classNames = items.map(item => {
		// 		return item.className
		// 	})
		// 	return classNames
		// },
		loadList (callback) {
		  if (this.callType === 'serviceCode' && this.productCode === '') {
		    return
			}
			api.getServiceByProductAll({productCode: this.productCode}).then(res => {
				this.dataList = []
				if (this.callType === 'serviceCode') {
					Object.keys(res.data.result).map(item2 => {
						this.dataList.push({ value: item2, label: res.data.result[item2], disabled: false })
					})
				} else {
					Object.keys(res.data.result).map(item2 => {
						this.dataList.push({ value: item2, label: item2 + '-' + res.data.result[item2], disabled: false })
					})
				}
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
