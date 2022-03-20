<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Search Transactions</h2>
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
            <v-row>
              <v-col>
                <v-checkbox
                  label="Artist Payout"
                  v-model="form.artistPayout"
                  :disabled="form.dateRange.length !== 2"
                ></v-checkbox>
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
                label="Search ID, User, Amount, Tag"
                class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:item.id="{ item }">
              <v-layout justify-end>
                {{ item.id }}
              </v-layout>
            </template>
            <template v-slot:item.direction="{ item }">
              <v-chip :color="item.direction ? 'success' : 'error'" small>
                {{ item.direction ? 'Addition' : 'Deduction' }}
              </v-chip>
            </template>
            <template v-slot:item.amount_display="{ item }">
              <v-layout justify-end>
                {{ item.amount_display }}
              </v-layout>
            </template>
            <template slot="footer">
              <div class="d-flex pl-4 pb-4 pt-4" :style="{ borderTop: '1px solid #aaa' }">
                <div><strong>Total Amount</strong></div>
                <div class="text-xs-right ml-8">{{ totals.amount }}</div>
              </div>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { $apiUser } from '~/utils/api'
import { dateToISOEndOfDay, dateToISOStartOfDay } from '~/utils/date'
import { numberWithCommas } from '~/utils/formatters'
import { httpResponseMapper } from '~/utils/http'

@Component({
  layout: 'admin'
})
export default class OrdersIndex extends Vue {
  private get totals() {
    if (!this.tableData.length) {
      return {
        amount: 0
      }
    }
    return {
      amount: numberWithCommas(this.tableData.reduce((acc, curr) => {
        if (this.form.artistPayout) {
          if (!curr.direction) {
            acc += Number(curr.amount)
          }
        } else {
          if (!curr.direction) {
            acc -= Number(curr.amount)
          } else {
            acc += Number(curr.amount)
          }
        }
        return acc
      }, 0))
    }
  }

  private get isSearchBtnDisabled() {
    return this.form.dateRange.length !== 2
  }

  private async handleSearch() {
    await this.setOrders()
  }

  private form: any = {
    dateRange: [],
    artistPayout: false
  }

  @Watch('form.artistPayout')
  onFormArtistPayoutChange(newVal: boolean) {
    if (newVal) {
      this.tableData = this.tableData.filter((item) => item.tag === 'system_payable_admin_to_artist')
    } else {
      this.setOrders()
    }
  }

  private dialog: any = {
    date: false
  }

  private headers: Array<any> = [
    { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false },
    // { text: 'Status', value: 'status', align: 'start', sortable: true },
    { text: 'User', value: 'user_email', align: 'start', sortable: true },
    { text: 'Amount', value: 'amount_display', align: 'start', sortable: true },
    { text: 'Type', value: 'direction', align: 'start', sortable: true, filterable: false },
    { text: 'Tag', value: 'tag', align: 'start', sortable: true },
    // { text: 'Description', value: 'description', align: 'start', sortable: false, filterable: false },
    // { text: 'Description 2', value: 'gas', align: 'start', sortable: false, filterable: false },
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
    const [startDate, endDate] = this.form.dateRange
    const _startDate = dateToISOStartOfDay(startDate)
    const _endDate = dateToISOEndOfDay(endDate)
    const _req = await $apiUser.get(`/transaction?startDate=${_startDate}&endDate=${_endDate}&info=true`)
    return httpResponseMapper(_req)?.data
  }

  private async setOrders() {
    const _rows = await this.getOrders()
    if (_rows && _rows.length) {
      this.tableData = [..._rows].map((item) => ({
          ...item,
          amount_display: `${!item.direction ? '-' : ''}${numberWithCommas(Number(item.amount))}`
        }))
    } else {
      this.tableData = []
    }
  }

  private async created() {
  }
}
</script>
