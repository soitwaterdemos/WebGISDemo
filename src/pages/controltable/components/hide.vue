<template>
  <div id="main-controltable-hide" @click="hideOptions">
    <div class="font control-table-font">Hide&nbsp;Options</div>
  </div>
</template>

<script>

export default {
  name: "Hide",
  data () {
    return {
    }
  },
  methods: {
    hideOptions () {

    },
  },
}
</script>

<style scoped>
#main-controltable-hide {
  height: 100%;
  width: .2rem;
  font-size: .1rem;
  color: rgba(16, 164, 226, .8);
  box-sizing: border-box;
  border-right: .01rem solid rgb(42, 42, 42);
  display: flex;
  flex-flow: wrap column;
  justify-content: center;
  align-items: center;
  background: rgb(54, 54, 54);
}
#main-controltable-hide .font {
  transform:rotate(-90deg);
}
</style>
