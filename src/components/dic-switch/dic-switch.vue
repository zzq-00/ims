<template>
  <div>
    <a-switch :disabled="disabled" :dicType="dicType" :value="code" :size="size" :checked="code" :checkedChildren="checkedChildren" :unCheckedChildren="unCheckedChildren" @change="onChange"/>
  </div>
</template>

<script>
import api from '@/api/api-common'

export default {
	name: 'DicSwitch',
	props: {
		size: {
			type: String,
			default () {
				return 'default'
			}
		},
		value: {
			type: [Number, Boolean, String]
		},
		dicType: {
			type: String,
			default () {
				return ''
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
			checkedChildren: '',
			unCheckedChildren: '',
			checkedChildrenValue: '',
			unCheckedChildrenValue: ''
		}
	},
	computed: {
		code () {
			return this.value == this.checkedChildrenValue
		}
	},
	mounted () {
		this.loadList(this.getName)
	},
	methods: {
		loadList (callback) {
			if (!this.dicType) return
			api.getDicValues(this.dicType).then(res => {
				// console.log(res, "result")
				this.dataList = []
				res.map(item => {
					Object.keys(item).map(item2 => {
						this.dataList.push({value: item2, label: item[item2]})
					})
				})
				callback && callback()
			})
		},
		getName () {
			if (this.dataList && this.dataList.length > 0) {
				if (this.dataList.length === 2) {
					if (this.dataList[0].value === "1" || this.dataList[0].value === 1 || this.dataList[0].value === true) {
						this.checkedChildren = this.dataList[0].label
						this.checkedChildrenValue = this.dataList[0].value

						this.unCheckedChildren = this.dataList[1].label
						this.unCheckedChildrenValue = this.dataList[1].value
					} else {
						this.checkedChildren = this.dataList[1].label
						this.checkedChildrenValue = this.dataList[1].value

						this.unCheckedChildren = this.dataList[0].label
						this.unCheckedChildrenValue = this.dataList[0].value
					}
				}
			}
		},
		onChange (checked, event) {
			// console.log(checked, 'chelele')
			this.$emit('input', checked ? this.checkedChildrenValue : this.unCheckedChildrenValue, event)
			this.$emit('change', checked ? this.checkedChildrenValue : this.unCheckedChildrenValue, event)
		}
	}
}
</script>

<style>

</style>
