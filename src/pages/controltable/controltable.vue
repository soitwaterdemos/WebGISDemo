<template>
  <div id="main-controltable">
    <hide></hide>
    <user-map></user-map>
    <!-- <user-map-result></user-map-result> -->
    <!-- <tool-detail></tool-detail> -->
    <tool-set></tool-set>
    <download></download>
  </div>
</template>

<script>
import Hide from "./components/hide.vue"
import UserMap from "./components/usermap.vue"
// import UserMapResult from "./components/usermapresult.vue"
import ToolSet from "./components/toolset.vue"
// import ToolDetail from "./components/tooldetail.vue"
import Download from "./components/download.vue"

export default {
  name: "ControlTable",
  data () {
    return {
    }
  },
  components: {
    Hide,
    UserMap,
    // UserMapResult,
    ToolSet,
    // ToolDetail,
    Download,
  },
}
</script>

<style>
#main-controltable {
  width: 70%;
  height: 20%;
  position: fixed;
  right: 2%;
  bottom: 3%;
  display: flex;
  flex-flow: nowrap row;
  border-radius: .04rem;
  overflow: hidden;
  opacity: 0.9;
  z-index: 0;
  background: rgb(60, 60, 60);
}
/* @media  screen and (min-width: 960px) { 
  #main-controltable {
    width: 80%;
    height: 20%;
    position: fixed;
    right: 2%;
    bottom: 3%;
    display: flex;
    flex-flow: nowrap row;
    background: red;
  }
} */

/* 手机 */
@media  screen and (max-width: 800px) { 
  #main-controltable {
    width: 70%;
    height: 70%;
  }
}

.el-table__body tr.hover-row.current-row>td,
.el-table__body tr.hover-row.el-table__row--striped.current-row>td,
.el-table__body tr.hover-row.el-table__row--striped>td,
.el-table__body tr.hover-row>td{ /*隐藏hover变色*/
  background-color:transparent!important
}
.el-table::before { /*隐藏伪类(底部边框)*/
  width: 0px!important;
  height: 0;
}
.el-table__fixed-right::before, .el-table__fixed::before {
  width: 0px!important;
  height: 0;
}
/* 颜色选择器 */
.el-color-picker__trigger {
  border: none!important;
}
/* 级联 */
/* .el-cascader { 
  background: transparent;
} */
.el-input__inner { /* 级联 - input */
  background: transparent!important;
  height: .3rem!important;
  font-size: .12rem!important;
  line-height: .12rem!important;
  border: .01rem solid #8c8c8c55!important;
  width: 93%!important;
  padding-left: .05rem!important;
  margin-left: 4%!important;
  color: #fff!important;
}
/* 级联 - menu */
.el-cascader-menu {
  background: #3e3e3eee!important;
  /* border: 0 solid red!important; */
}
/* 级联 - menu - item */
.el-cascader-menu__item{
  color: #8c8c8c!important;
}
.el-cascader-menu__item:hover{
  background: #3e3e3eee!important;
}
/* 级联 - 选中后 input 中的 label */
.el-cascader__label {
  font-weight: 400!important;
  font-size: .12rem!important;
  color: #8c8c8c!important;
}
.el-cascader__label span {
  color: #8c8c8c!important;
}
/*折叠面板*/
.el-collapse-item__header, .el-collapse-item__content{
  background: rgb(90,90,90)!important;
  color: #fff!important;
  border: none!important;
  /* border-bottom: .01rem dotted #aaa!important; */
}
/* 按钮 */
.el-button {
  border: none!important;
    opacity: .8;
}
</style>
