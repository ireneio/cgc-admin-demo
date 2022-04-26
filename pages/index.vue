<template>
  <div>
    <v-toolbar flat class="banner">
      <h1 class="d-flex justify-center flex-wrap text-left">
        <strong class="primary--text text-left" :style="{ flex: '0 0 100%' }">{{ this.$vuetify.lang.t('$vuetify.tips.welcome') }}</strong>
        <h6 class="text-left" :style="{ flex: '0 0 100%' }">{{ this.$vuetify.lang.t('$vuetify.tips.hint') }}</h6>
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
