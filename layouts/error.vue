<template>
  <v-card class="mt-5 ml-5 mr-5" flat>
    <v-card-title>Server Error</v-card-title>
    <v-card-subtitle>Please try again later.</v-card-subtitle>
    <v-card-text>
      <v-btn color="primary" @click="$router.go(-1)">Back to Previous Page</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  layout: 'admin'
})
export default class LoginLayout extends Vue {}
</script>
