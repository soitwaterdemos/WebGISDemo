<template>
  <div id="main-letter">
    <name></name>
    <ProjectName></ProjectName>
  </div>
</template>

<script>
import Name from "./components/name.vue"
import ProjectName from "./components/projectname.vue"

export default {
  name: "Letter",
  components: {
    Name,
    ProjectName,
  },
}
</script>

<style scoped>
#main-letter {
  display: flex;
  flex-flow: nowrap row;
}
</style>
