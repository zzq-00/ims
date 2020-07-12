<template>
  <div>
    <a-select v-model="selectedVal" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import api from '@/api/api-health-card'
import { Promise } from 'q'

export default {
	name: 'budget-item-select2',
	props: {
		docParam: {
			type: Object,
			default () {
				return {}
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
		docParam: {
			deep: true,
			handler () {
				this.loadList()
			}
		}
	},
	mounted () {
		this.loadList()
		if (this.value) {
			this.selectedVal = this.value
		}
	},
	methods: {
		getName (code) {
			let item = this.dataList.find(item => item.value === code)
			if (item && item.name) return item.name
			return ''
		},
		getDetail (itemCode, docCode) {
			return new Promise((resolve, reject) => {
				let param = {
					budgetItemCode: itemCode,
					docCode: docCode
				}
				api.getBudgetItemDetail(param).then(res => {
					resolve(res.data[0])
				}).cache(e => {
					reject(e)
				})
			})
		},
		loadList (callback) {
			if (!this.docParam.docCode) {
				this.dataList = []
				return
			}
			api.getBudgetItemListByDoc(this.docParam).then(res => {
				console.log(res, "result")
				this.dataList = []
				res.data.map(item => {
					this.dataList.push({
						value: item.budgetItemName.split('-')[0],
						label: item.budgetItemName,
						name: item.budgetItemName.split('-')[1]
					})
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
