<template>
  <div id="main-attributes">
    <div id="main-attributes-title">
      <span>&nbsp;属性表</span>
    </div>
    <div id="main-attributes-container">
    </div>
  </div>
</template>

<script>

export default {
  name: "Attributes",
  data () {
    return {

    }
  }
}
</script>

<style>
#main-attributes {
  width: 2.1rem;
  height: 50%;
  position: fixed;
  right: 2%;
  top: 15%;
  border-radius: .03rem;
  background: rgba(180, 180, 180, .9);
  box-shadow: 0 0 .06rem 0 rgba(0,0,0,.2),0 .1rem .12rem 0 rgba(0,0,0,.2),inset 0 -.01rem 0 0 rgba(0,0,0,.2);
  overflow-y: auto;
  overflow-x: hidden;
  transition: .1s ease;
  opacity: 0;
  z-index: 5;
}
#main-attributes-title {
  /* height: .19rem; */
  height: 5%;
  /* line-height: .15rem; */
  display: flex;
  flex-flow: nowrap row;
  align-items: center;
  font-weight: 100;
  color: #fff;
  font-size: .12rem;
  border-bottom: .01rem solid #fff
}
#main-attributes-container {
  width: 100%;
  height: 94%;
  /* background: blue; */
}
#main-attributes-container .attrLine { 
  width: 100%;
  line-height: .16rem;
  font-size: .12rem;
  display: flex;
}
#main-attributes-container .attrLineLeft {
  width: 45%;
  font-style: italic;
  font-weight: 300;
  color: rgba(55, 55, 55, .8);
  /* overflow: scroll; */
}
#main-attributes-container .attrLineRight {
  width: 55%;
  font-weight: 400;
  color: rgba(33, 33, 33, .8);
  /* color: rgba(33, 33, 33, .9); */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  /* overflow: scroll; */
}
#main-attributes-container .attrLineRight:hover {
  /* overflow: auto; */
  white-space: normal;
}
</style>
