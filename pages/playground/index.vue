<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Playground</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              color="primary"
              @click="$router.push({ name: 'promotions-create' })"
            >
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="desserts"
              :single-select="singleSelect"
              item-key="name"
              show-select
              class="elevation-1 mt-4"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { sysStore } from '~/store'

@Component({
  layout: 'admin'
})
export default class PromotionsIndex extends Vue {
  private headers: Array<any> = [
    { text: 'Name', value: 'calories', align: 'start', sortable: true },
    { text: 'Type', value: 'carbs', align: 'start', sortable: true },
    { text: 'Status', value: 'carbs', align: 'start', sortable: true },
    { text: 'Memo', value: 'carbs', align: 'start', sortable: false },
    { text: 'Misc', value: 'carbs', align: 'start', sortable: false }
  ]

  // private async sendGetGroupListRequest() {
  //   try {
  //     await sysStore.getPermissionList({
  //       token: this.$cookies.get('accessToken')
  //     })
  //   } catch (e) {
  //     // error
  //   }
  // }

  private async created() {
    // await this.sendGetPermissionListRequest()
  }
}
</script>
