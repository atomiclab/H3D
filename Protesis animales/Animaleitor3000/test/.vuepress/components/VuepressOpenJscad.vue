<template>
  <div>
    <open-jscad v-bind="$attrs"></open-jscad>
  </div>
</template>
<script>
import OpenJscad from "@jwc/vue-openjscad";

export default {
  name: "VuepressOpenJscad",
  components: { OpenJscad },
  inheritAttrs: false
};
</script>