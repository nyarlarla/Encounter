<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style>
.maxHeight{
  height: calc(100vh - 104px)!important;
}
</style>