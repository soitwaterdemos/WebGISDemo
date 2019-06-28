<template>
  <div id="main-letter">
    <name></name>
    <ProjectName id="project-name"></ProjectName>
  </div>
</template>

<script>
import Name from "./components/name.vue"
import ProjectName from "./components/projectname.vue"

export default {
  name: "Letter",
  data () {
    return {
      dd: 10,
    }
  },
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
