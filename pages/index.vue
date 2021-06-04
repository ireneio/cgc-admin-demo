<template>
  <div>
    <v-toolbar flat class="banner">
      <h1>
        <strong class="primary--text">載入中...</strong>
      </h1>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'frontend'
})
export default class Index extends Vue {
  private beforeRouteEnter(to: any, from: any, next: Function) {
    next(false)
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
