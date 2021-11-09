<!--
 * @Author: zxx
 * @Date: 2021-11-09 13:42:00
 * @LastEditors: zxx
 * @LastEditTime: 2021-11-09 14:53:48
 * @FilePath: \multi-projects-template\src\apps\test-app\views\dashboard\index.vue
 * @Description: some description
-->
<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created () {
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
