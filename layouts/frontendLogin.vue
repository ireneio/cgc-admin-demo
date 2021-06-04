<template>
  <v-app>
    <Nuxt />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: ['authFrontend'],
})
export default class FrontendLoginLayout extends Vue {
}
</script>
