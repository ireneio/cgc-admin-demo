<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">{{ config.title }}</h2>
        <v-card outlined>
          <slot name="toolbar"></slot>
          <v-card-text>
            <slot name="table"></slot>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DefaultContainer extends Vue {
  @Prop({ required: true, default: { title: 'Title' } }) readonly config: any
}
</script>
