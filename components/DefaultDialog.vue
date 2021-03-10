<template>
  <v-dialog
    v-model="config.active"
    :max-width="config.width"
    :max-height="config.height"
    :persistent="config.persistent"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ config.title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DefaultDialog extends Vue {
  @Prop({ required: true, default: { active: true, width: '50vw', height: '70vh', persistent: true } }) readonly config: any
}
</script>
