<template>
  <div>
    <a-select v-model="selectedVal" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import api from '@/api/api-product-service'

export default {
	name: 'PserviceSelect',
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
		getName (code) {
			let item = this.dataList.find(item => item.value === code)
			if (item && item.name) return item.name
			return ''
		},
		loadList (callback) {
			api.getAllService().then(res => {
				this.dataList = []
				Object.keys(res.data).map(item => {
					this.dataList.push({
						 value: item,
						 name: res.data[item],
					 	 label: item + '-' + res.data[item]
					  })
				})
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
