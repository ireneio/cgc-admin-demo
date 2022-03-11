<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Search Orders</h2>
        <v-card outlined>
          <v-card-text>
            <v-row class="mb-n8">
              <v-col cols="6" sm="4" md="4">
                <v-menu
                  v-model="dialog.date"
                  :nudge-right="40"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.dateRange"
                      label="Select Date Range"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    range
                    v-model="form.dateRange"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6" md="4">
                <v-btn
                  color="info"
                  class="mt-4"
                  @click="handleSearch"
                  :disabled="isSearchBtnDisabled"
                >
                  Search
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="tableData"
              :single-select="false"
              :options="tableOptions"
              :search="tableSearch"
              :show-select="false"
              :mobile-breakpoint="1023"
              class="elevation-1 mt-4"
              @click:row="handleRowClick"
            >
            <template v-slot:top>
              <v-text-field
                v-model="tableSearch"
                label="Search ID, User, Status"
                class="mx-4"
              ></v-text-field>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { transactionStore } from '~/store'
import { numberWithCommas } from '~/utils/formatters'

@Component({
  layout: 'admin'
})
export default class OrdersIndex extends Vue {
  private get isSearchBtnDisabled() {
    return this.form.dateRange.length !== 2
  }

  private async handleSearch() {}

  private form: any = {
    dateRange: []
  }

  private dialog: any = {
    date: false
  }

  private headers: Array<any> = [
    { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false },
    { text: 'User', value: 'email', align: 'start', sortable: true },
    { text: 'Status', value: 'status', align: 'start', sortable: true },
    { text: 'Misc', value: 'misc', align: 'start', sortable: true, filterable: false },
  ]

  private tableData: any[] = []

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['created_at'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private handleRowClick(row: any, col: any): void {
  }

  private async getOrders() {

  }

  private async init() {

  }

  private async created() {
  }
}
</script>
