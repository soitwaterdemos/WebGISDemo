<template>
  <div id="main-controltable-usermap">
      <el-table
        :data="tableData"
        style="width: 100%;" size="mini" 
        :header-cell-style="setRowStyle" :row-style="setRowStyle" :cell-style="setCellStyle">
        <el-table-column
          fixed
          prop="name"
          label="Document"
          min-width="100">
        </el-table-column>
        <el-table-column
          label="Options"
          min-width="100">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index" @change="refreshOpenlayersMap">Visible</el-radio>
            <!-- <el-checkbox v-model="checked[scope.$index]" @change="commitSelectedOpenlayersMap">Select</el-checkbox> -->
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import store from "@/api/store.js"
import bus from "@/api/bus.js"

export default {
  name: "UserMap",
  data () {
    return {
      radio: 0, // radio 复选框
      checked: store.state.globalValue.currentSelectedLayerIndex, // checkedbox 选中
      tableData: store.state.globalValue.tableData,
    }
  },
  methods: {
    setRowStyle ({row, rowIndex}) {
    //   console.log("86, 行号", rowIndex)
      return "background:#3c3c3c;border: none"
    },
    setCellStyle ({row, column, rowIndex, columnIndex}) {
      return "border: none;overflow: hidden"
    },
    refreshOpenlayersMap () {
      store.state.globalValue.currentVisibleLayerIndex = this.radio
      bus.$emit("refreshOpenlayers")
    },
    commitSelectedOpenlayersMap () { // checkBox 选中则触发
      // console.log("子组件: ", this.checked)
      // console.log("store: ", store.state.globalValue.currentSelectedLayerIndex)
      store.commit("selectedCheckedBoxOpenlayersMap")
    },
  },
  mounted () {
    bus.$on("refreshUserMapOptionsVisibleIndex", () => {
      this.radio = store.state.globalValue.currentVisibleLayerIndex
    })
  },
}
</script>

<style scoped>
#main-controltable-usermap {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  border-right: .01rem solid rgb(42, 42, 42);
  /* background: red; */
}
.el-table {
  background: transparent;
}
/* 手机 */
@media  screen and (max-width: 800px) { 
  #main-controltable-usermap {
    width: calc(100% - .2rem);
    height: 50%;
  } 
}
</style>
