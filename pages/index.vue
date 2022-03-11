<template>
  <div>
    <v-toolbar flat class="banner">
      <h1>
        <strong class="primary--text">Welcome to DFON</strong>
        <h6>Kindly select a functionality from the menu</h6>
      </h1>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin'
})
export default class Index extends Vue {
  private beforeRouteEnter(to: any, from: any, next: Function) {
    next((vm: Vue) => {
      // vm.$router.push('/account')
    })
  }
}
</script>
<style lang="scss" scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}
</style>
