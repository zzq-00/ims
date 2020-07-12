<template>
   <div class="editable-cell">
      <div v-if="editable" class="editable-cell-input-wrapper">
        <a-select v-if="arr.type=='time'" :value="value" @change="handleChange">
          <a-select-option v-for="item in arr.arr" :key="item">
            {{ item }}
          </a-select-option>
        </a-select>
        <a-date-picker v-if="arr.type=='date'" style="width:120px;" :value="value?value:null" format="YYYY-MM-DD"  @change="handleChange1"/>
        <a-icon
          type="check"
          class="editable-cell-icon-check"
          @click="check"/>
      </div>
      <div v-else class="editable-cell-text-wrapper" @click="edit">
        {{ value || ' ' }}
        <a-icon type="edit" class="editable-cell-icon" @click="edit"/>
      </div>
    </div>
</template>
<script>
export default {
	props: {
		arr: Object,
		text: String
	},
	data () {
		return {
			value: this.text,
			editable: false
		}
	},
	methods: {
		handleChange (e) {
			this.value = e
			this.editable = false
			this.$emit('change', e)
		},
		handleChange1 (e) {
			let arrT = new Date(e._d).toLocaleDateString().split('/')
			let remindTime = arrT[0] + "-" + this.format(arrT[1]) + "-" + this.format(arrT[2])
			this.value = remindTime
			this.editable = false
			this.$emit('change', remindTime)
		},
		check () {
			this.$emit('change', this.value)
			this.editable = false
		},
		edit () {
			this.editable = true
		},
		format (m) {
			return m < 10 ? '0' + m : m
		}
	}
}
</script>

<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
