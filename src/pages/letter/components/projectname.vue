<template>
  <div id="project-name">
    <div id="openlayers">Open&nbsp;WebGIS</div>
    <div id="demo">Experiment</div>
  </div>
</template>

<script>

export default {
  name: "ProjectName",
  data () {
    return {

    }
  }
}
</script>

<style scoped>
#project-name {
  font-size: .2rem; 
  color: #fff;
  margin-left: .1rem; 
  text-shadow: #333 .015rem .015rem .015rem;
}
#project-name #openlayers {
  font-weight: 100;
}
#project-name #demo {
  font-weight: bold;
}
</style>
