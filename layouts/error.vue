<template>
  <v-card class="mt-5 ml-5 mr-5" flat>
    <v-card-title>伺服器錯誤，請稍後刷新再試</v-card-title>
    <v-card-text>
      <v-btn color="primary" @click="$router.go(-1)">回上頁</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  layout: 'error'
})
export default class LoginLayout extends Vue {}
</script>
