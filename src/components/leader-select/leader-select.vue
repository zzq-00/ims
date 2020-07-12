<template>
  <div>
    <a-select v-model="selectedVal" :dicType="dicType" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :labelInValue="labelInValue" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index" :disabled="item.disabled">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import api from '@/api/api-common'

export default {
	name: 'DicSelect',
	props: {
		placeholder: {
			type: String,
			default () {
				return '请选择'
			}
		},
		value: {
			type: [Number, Array, String, Object],
			default () {
				return undefined
			}
		},
		dicType: {
			type: String,
			default () {
				return ''
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
		labelInValue: {
			type: Boolean,
			default () {
				return false
			}
		},
		defaultList: {
			type: Array,
			default () {
				return []
			}
		},
		removeList: {
			type: Array,
			default () {
				return []
			}
		},
		personType: {
			type: Array
		},
		defaultDisplayFirst: {
			type: Boolean,
			default () {
				return false
			}
		},
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
		dicType (newVal, oldVal) {
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
		getName (value) {
			let item = this.dataList.find(item => item.value === value)
			return item ? item.label : ''
		},
		disabledItem (keyArray) {
			this.dataList.map(item => {
				let index = keyArray.indexOf(item.value)
				if (index >= 0) {
					item.disabled = true
				} else {
					item.disabled = false
				}
			})
		},
		loadList (callback) {
				if (!this.dicType) return
			api.getLeaderInfo(this.dicType).then(res => {
				this.dataList = []
				res.data.map(item => {
					this.dataList.push({ value: item.upUserCode, label: item.upUserCode + '-' + item.upUserName })
				})
				if(this.defaultDisplayFirst){
					this.selectedVal = this.dataList[0].value
					this.$emit('input', this.selectedVal)
					this.$emit('change', this.selectedVal)
				}
				callback && callback()
			})
		},
		onChange (value, option) {
			console.log(value, option, '')
			this.$emit('input', value, option)
			this.$emit('change', value, option)
		},
		onSelect (value, opiton) {
			this.$emit('select', value, opiton)
		},
		diff (a, b) {
			return a.filter(item => {
				return b.indexOf(item.value) < 0
		    })
	    }
	}
}

</script>

<style>

</style>
