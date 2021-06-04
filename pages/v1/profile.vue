<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        chat
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { sysStore } from '~/store'

@Component({
  layout: 'frontend'
})
export default class V1Profile extends Vue {
}
</script>
