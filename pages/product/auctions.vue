<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Edit Auctions</h2>
        <v-card outlined>
          <v-toolbar flat class="mb-n4">
            <v-btn
              color="info"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Create
            </v-btn>
          </v-toolbar>
          <v-card-text class="pt-0">
            <v-row class="mb-n8">
              <v-col cols="6" sm="4" md="4">
                <v-menu
                  v-model="dialog.dateSearch"
                  :nudge-right="40"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formSearch.dateRange"
                      label="Select Date Range (GMT+0)"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    range
                    v-model="formSearch.dateRange"
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
              item-key="id"
              :show-select="false"
              :search="tableSearch"
              :mobile-breakpoint="1023"
              class="elevation-1 mt-4"
              @click:row="handleRowClick"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="tableSearch"
                  label="Search ID, SKU"
                  class="mx-4"
                ></v-text-field>
              </template>
               <template v-slot:item.price_floor="{ item }">
                <v-layout justify-end>{{ formattedPriceRows(item.price_floor) }}</v-layout>
              </template>
               <template v-slot:item.price_bought="{ item }">
                <v-layout justify-end>{{ formattedPriceRows(item.price_bought) }}</v-layout>
              </template>
              <template v-slot:item.bid_min="{ item }">
                <v-layout justify-end>{{ formattedPriceRows(item.bid_min) }}</v-layout>
              </template>
               <template v-slot:item.bid_max="{ item }">
                <v-layout justify-end>{{ formattedPriceRows(item.bid_max) }}</v-layout>
              </template>
              <template v-slot:item.access_level="{ item }">
                {{ getAccessLevelDisplay(item.access_level) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.toggle"
      :timeout="snackbar.timeout"
      top
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar.toggle = false"
        >
          {{ snackbar.closeText }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      v-model="dialog.new"
      max-width="700px"
      max-height="70vh"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialog.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="6"
              >
                <!-- <v-select
                  :items="skuList"
                  label="SKU"
                  v-model="form.sku"
                ></v-select> -->
                <v-text-field
                  v-model="form.sku"
                  label="SKU"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
              >
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
                      label="Select Date Range (GMT+0)"
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
              <v-col
                cols="6"
              >
                <v-menu
                  ref="menu"
                  v-model="dialog.time"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.timeStart"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.timeStart"
                      label="Select Time of Start Date (GMT+0)"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    full-width
                    v-if="dialog.time"
                    v-model="form.timeStart"
                    @click:minute="$refs.menu.save(form.timeStart)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="6"
              >
                <v-menu
                  ref="menu2"
                  v-model="dialog.time2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.timeEnd"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.timeEnd"
                      label="Select Time of End Date (GMT+0)"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    full-width
                    v-if="dialog.time2"
                    v-model="form.timeEnd"
                    @click:minute="$refs.menu2.save(form.timeEnd)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="3"
              >
                <v-text-field
                  v-model="form.price_floor"
                  label="Floor Price"
                  :counter="textFieldLengths.price_floor"
                  append-icon="mdi-currency-usd"
                ></v-text-field>
              </v-col>
              <v-col
                cols="3"
              >
                <v-text-field
                  v-model="form.price_bought"
                  label="Selling Price"
                  :counter="textFieldLengths.price_bought"
                  append-icon="mdi-currency-usd"
                ></v-text-field>
              </v-col>
              <v-col
                cols="3"
              >
                <v-text-field
                  v-model="form.bid_min"
                  label="Min Bid"
                  :counter="textFieldLengths.bid_min"
                  append-icon="mdi-currency-usd"
                ></v-text-field>
              </v-col>
              <v-col
                cols="3"
              >
                <v-text-field
                  v-model="form.bid_max"
                  label="Max Bid"
                  :counter="textFieldLengths.bid_max"
                  append-icon="mdi-currency-usd"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
              >
                <v-select
                  :items="accessLevelList"
                  label="Access Level"
                  v-model="form.access_level"
                ></v-select>
              </v-col>
              <!-- <v-col
                cols="6"
              >
                <v-text-field
                  outlined
                  readonly
                  v-model="product.product_price_listed"
                  label="Listed Product Price"
                  append-icon="mdi-currency-usd"
                ></v-text-field>
              </v-col> -->
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="handleCreateCancel"
          >
            cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="handleCreateSave"
            :disabled="isSaveBtnDisabled"
          >
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { authStore, errorStore } from '~/store'
import { $apiPlatform } from '~/utils/api'
import { numberWithCommas, numberWithDollarSign } from '~/utils/formatters'
import { httpResponseMapper } from '~/utils/http'
import DataParser from '~/utils/data'
import { isNatural } from '~/utils/number'
import { dateToISOEndOfDay, dateToISOStartOfDay } from '~/utils/date'
import moment from 'moment'

@Component({
  layout: 'admin'
})
export default class ProductAuctions extends Vue {
  private formattedPriceRows(val: number) {
    return numberWithCommas(val)
  }

  // private product = {
  //   product_price_listed: 0,
  //   sku: '',
  //   product_id: ''
  // }

  // private skuList: any[] = []

  private get textFieldLengths() {
    return {
      price_floor: 15,
      price_bought: 15,
      bid_min: 15,
      bid_max: 15
    }
  }

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'SKU', value: 'sku', align: 'start', sortable: true },
    // { text: 'Product ID', value: 'product_id', align: 'start', sortable: true },
    { text: 'Start Date', value: 'date_start', align: 'start', sortable: true, filterable: false },
    { text: 'End Date', value: 'date_end', align: 'start', sortable: true, filterable: false },
    { text: 'Floor($)', value: 'price_floor', align: 'start', sortable: true, filterable: false },
    { text: 'Selling($)', value: 'price_bought', align: 'start', sortable: true, filterable: false },
    { text: 'Winner ID', value: 'user_id_winner', align: 'start', sortable: true },
    { text: 'Creator ID', value: 'user_id_creation', align: 'start', sortable: true },
    { text: 'Access Level', value: 'access_level', align: 'start', sortable: true, filterable: false },
    // { text: 'Last updated', value: 'last_updated', align: 'start', sortable: true, filterable: false, filterable: false },
    // { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false, filterable: false },
  ]

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['date_end', 'sku', 'date_start', 'price_floor'],
      sortDesc: [true],
      multiSort: true,
      mustSort: false
  }

  private get accessLevelList() {
    return DataParser.accessLevelList
  }

  private getAccessLevelDisplay(val: string) {
    return this.accessLevelList.find(item => item.value === val)?.text
  }

  private form: any = {
    product_id: '',
    sku: '',
    dateRange: [],
    timeStart: '',
    timeEnd: '',
    price_floor: 0,
    price_bought: 0,
    bid_min: 0,
    bid_max: 0,
    user_id_winner: '',
    user_id_creation: '',
    access_level: this.accessLevelList[0].value,
    status: false,
    id: ''
  }

  private formSearch: any = {
    dateRange: [],
  }

  private dialog: any = {
    activateConfimationText: 'Enable this auction?',
    activate: false,
    deleteConfimationText: 'Disable this auction?',
    delete: false,
    isEditMode: false,
    new: false,
    title: 'Create Auction',
    createTitle: 'Create Auction',
    editTitle: 'Edit Auction',
    error: false,
    errorTitle: 'Server Error. Please try again later.',
    date: false,
    time: false,
    time2: false,
    dateSearch: false,
  }

  private handleRowClick(row: any, col: any) {
    const {
      // product_id,
      sku,
      date_start,
      date_end,
      price_floor,
      price_bought,
      bid_min,
      bid_max,
      user_id_winner,
      user_id_creation,
      access_level,
      status,
      id
    } = row
    this.form = {
      ...this.form,
      // product_id,
      sku,
      dateRange: [date_start, date_end],
      price_floor,
      price_bought,
      bid_min,
      bid_max,
      user_id_winner,
      user_id_creation,
      access_level,
      status,
      id
    }
    this.dialog.title = this.dialog.editTitle
    this.dialog.new = true
    this.dialog.isEditMode = true
  }

  private clearForm(): void {
    this.form = {
      product_id: '',
      sku: '',
      dateRange: [],
      timeStart: '',
      timeEnd: '',
      price_floor: 0,
      price_bought: 0,
      bid_min: 0,
      bid_max: 0,
      user_id_winner: '',
      user_id_creation: '',
      access_level: this.accessLevelList[0].value,
      status: false,
      id: ''
    }
  }

  private handleCreateItem(): void {
    this.dialog.title = this.dialog.createTitle
    this.dialog.new = true
    this.dialog.isEditMode = false
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.dialog.isEditMode = false
    this.dialog.title = this.dialog.createTitle
    this.clearForm()
  }

  private fieldValidation() {
    if (this.form.product_id === '') {
      return false
    }
    if (this.form.dateRange.length !== 2) {
      return false
    }
    if (!this.form.timeStart || !this.form.timeEnd) {
      return false
    }
    return true
  }

  private async handleCreateSave() {
    if (!this.fieldValidation()) {
      return
    }
    const [dateStart, dateEnd] = this.form.dateRange
    const _payload = {
      ...this.form,
      date_start: moment(dateStart + ' ' + this.form.timeStart).toISOString(),
      date_end: moment(dateEnd + ' ' + this.form.timeEnd).toISOString()
    }
    const _endpoint = '/auction'
    const _req = await $apiPlatform.post(_endpoint, _payload)
    httpResponseMapper(_req)
    if (errorStore.isActive) {
      this.snackbar.text = `Auction update failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      this.clearForm()
      this.snackbar.text = 'Auction update success.'
      await this.init()
      this.dialog.new = false
    }
    this.snackbar.toggle = true
  }

  private isSearchBtnDisabled = false

  private get isSaveBtnDisabled() {
    return (
      !isNatural(this.form.price_floor) ||
      !isNatural(this.form.price_bought) ||
      !isNatural(this.form.bid_max) ||
      !isNatural(this.form.bid_min) ||
      !this.form.sku ||
      // !this.form.product_id ||
      this.form.dateRange.length !== 2
    )
  }

  private async handleSearch() {
    await this.setAuctionsSearch()
  }

  private async getAuctions() {
    const _req = await $apiPlatform.get(`/auction?userId=${authStore.id}`)
    return httpResponseMapper(_req).data
  }

  private async getAuctionsSearch() {
    const [startDate, endDate] = this.formSearch.dateRange
    const _startDate = dateToISOStartOfDay(startDate)
    const _endDate = dateToISOEndOfDay(endDate)
    const _req = await $apiPlatform.get(`/auction?startDate=${_startDate}&endDate=${_endDate}`)
    return httpResponseMapper(_req).data
  }

  private async setAuctionsSearch() {
    try {
      const _rows = await this.getAuctionsSearch()
      if (_rows && _rows.length) {
        this.tableData = [..._rows]
      }
    } catch (e: unknown) {

    }
  }

  // private async getProducts() {
  //   const _req = await $apiPlatform.get('/auction')
  //   return httpResponseMapper(_req).data
  // }

  private tableData: any[] = []

  private async init() {
    try {
      let _rows = await this.getAuctions()
      if (_rows && _rows.length) {
        if (authStore.access_level !== '6') {
          _rows = _rows.filter((item: any) => item.user_id_creation === authStore.id)
        }
        this.tableData = [..._rows].map((item) => ({
          ...item,
          date_start: moment(item.date_start).toLocaleString(),
          date_end: moment(item.date_end).toLocaleString()
        }))
      }
    } catch (e: unknown) {

    }
  }

  private async created() {
    await this.init()
  }
}
</script>
