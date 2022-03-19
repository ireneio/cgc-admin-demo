<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Edit Product Labels</h2>
        <v-card outlined>
          <v-toolbar flat class="mb-n4">
            <v-btn
              color="info"
              @click="handleCreateItem"
              :disabled="
                skuLabels.sku_color.length === 0 &&
                skuLabels.sku_author.length === 0 &&
                skuLabels.sku_painting_category.length === 0 &&
                skuLabels.sku_painting_country.length === 0 &&
                skuLabels.sku_painting_size.length === 0 &&
                skuLabels.sku_painting_style.length === 0 &&
                skuLabels.sku_painting_tech.length === 0 &&
                skuLabels.sku_painting_year.length === 0
              "
            >
            
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
          </v-toolbar>
          <v-card-text class="pt-0">
            <v-row class="mb-n8">
              <v-col cols="6" md="3" lg="3" class="">
                <v-checkbox label="Only In-Stock" v-model="form.inStockOnly"></v-checkbox>
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
                  label="Search SKU"
                  class="mx-4"
                ></v-text-field>
              </template>
              <template v-slot:item.auction="{ item }">
                <v-chip small :color="getAuctionChipColor(item.auction)">
                  {{ getAuctionChipValue(item.auction) }}
                </v-chip>
              </template>
              <template v-slot:item.price="{ item }">
                <v-layout justify-end>{{ formattedQuantityRows(item.price) }}</v-layout>
              </template>
              <template v-slot:item.stock="{ item }">
                <v-layout justify-end>{{ formattedQuantityRows(item.stock) }}</v-layout>
              </template>
              <template v-slot:item.is_shelf="{ item }">
                <v-chip small :color="item.is_shelf ? 'success' : 'warning'">
                  {{ item.is_shelf ? 'Y' : 'N' }}
                </v-chip>
              </template>
              <template v-slot:item.is_featured="{ item }">
                <v-chip small :color="item.is_featured ? 'success' : 'warning'">
                  {{ item.is_featured ? 'Y' : 'N' }}
                </v-chip>
              </template>
              <template v-slot:item.is_recommended="{ item }">
                <v-chip small :color="item.is_recommended ? 'success' : 'warning'">
                  {{ item.is_recommended ? 'Y' : 'N' }}
                </v-chip>
              </template>
              <template v-slot:item.is_purchase_allowed="{ item }">
                <v-chip small :color="item.is_purchase_allowed ? 'success' : 'warning'">
                  {{ item.is_purchase_allowed ? 'Y' : 'N' }}
                </v-chip>
              </template>
              <template v-slot:item.is_main="{ item }">
                <v-chip small :color="item.is_main ? 'success' : 'warning'">
                  {{ item.is_main ? 'Y' : 'N' }}
                </v-chip>
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
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="info"
        >
          <v-btn
            icon
            dark
            @click="handleCreateCancel"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="handleCreateSave"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="mb-n6"><h4>Basic Information</h4></v-col>
              <v-col
                cols="6"
              >
                <v-text-field
                  v-model="form.descriptionMain"
                  label="Title"
                  :counter="fieldInputLengths.descriptionMain"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
              >
                <v-text-field
                  v-model="form.descriptionSub"
                  label="Description"
                  :counter="fieldInputLengths.descriptionSub"
                ></v-text-field>
              </v-col>
              <v-col
                cols="3"
              >
                <v-text-field
                  @input="handlePriceInput"
                  :value="form.price"
                  label="Price"
                  append-icon="mdi-currency-usd"
                  :counter="fieldInputLengths.price"
                ></v-text-field>
              </v-col>
              <v-col
                cols="3"
              >
                <v-text-field
                  v-model="form.priceDeduction"
                  label="Price Deduction"
                  append-icon="mdi-percent"
                  :counter="fieldInputLengths.price"
                ></v-text-field>
              </v-col>
              <v-col
                cols="3"
              >
                <v-text-field
                  readonly
                  outlined
                  label="Price Final"
                  append-icon="mdi-currency-usd"
                  v-model="priceFinal"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Stock"
                  v-model="form.stock"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  label="Category"
                  multiple
                  :items="categoryDisplay"
                  single-line
                  v-model="form.categoryMain"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="accessLevelList"
                  label="Permission"
                  v-model="form.accessLevel"
                ></v-select>
              </v-col>
              <v-col cols="12" class="mb-n6"><h4>Sku Labels</h4></v-col>
              <v-col cols="12">
                <div class="mt-2">SKU is not editable</div>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_color"
                  label="Sku Color"
                  v-model="form.skuColor"
                  :disabled="skuLabels.sku_color.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_author"
                  label="Sku Author"
                  v-model="form.skuAuthor"
                  :disabled="skuLabels.sku_author.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_painting_category"
                  label="Sku Category"
                  v-model="form.skuCategory"
                  :disabled="skuLabels.sku_painting_category.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_painting_country"
                  label="Sku Country"
                  v-model="form.skuCountry"
                  :disabled="skuLabels.sku_painting_country.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_painting_size"
                  label="Sku Size"
                  v-model="form.skuSize"
                  :disabled="skuLabels.sku_painting_size.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_painting_style"
                  label="Sku Style"
                  v-model="form.skuStyle"
                  :disabled="skuLabels.sku_painting_style.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_painting_tech"
                  label="Sku Technique"
                  v-model="form.skuTechnique"
                  :disabled="skuLabels.sku_painting_tech.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="3" v-show="!dialog.isEditMode">
                <v-select
                  :items="skuLabels.sku_painting_year"
                  label="Sku Year"
                  v-model="form.skuYear"
                  :disabled="skuLabels.sku_painting_year.length === 0"
                ></v-select>
              </v-col>
              <v-col cols="12" class="mb-n6"><h4>Website Logic</h4></v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="form.isShelf"
                  label="Display"
                ></v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="form.isMain"
                  label="Display On Landing Page"
                  :disabled="!form.isShelf"
                ></v-checkbox>
              </v-col>
              <v-col cols="6" class="mt-n12">
                <v-checkbox
                  v-model="form.isFeatured"
                  label="Show In Featured"
                  :disabled="!form.isShelf"
                ></v-checkbox>
              </v-col>
              <v-col cols="6" class="mt-n12">
                <v-checkbox
                  v-model="form.isRecommended"
                  label="Show In Recommendation"
                  :disabled="!form.isShelf"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" class="mt-n12">
                <v-checkbox
                  v-model="form.isPurchaseAllowed"
                  label="Allow Purchase"
                  :disabled="!form.isShelf"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" class="mb-n6"><h4>Auction Options</h4></v-col>
              <v-col cols="6">
                <v-select
                  :items="auctionList"
                  label="Auction"
                  v-model="form.auction"
                  :disabled="!isEnableAuctionOptions"
                ></v-select>
              </v-col>
              <v-col cols="6" v-show="form.auction === auctionTypes.ongoing">
                <v-menu
                  v-model="dialog.startDate"
                  :nudge-right="40"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.auctionDates"
                      label="Select Date Range"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    range
                    v-model="form.auctionDates"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="3" v-show="form.auction === auctionTypes.ongoing">
                <v-menu
                  v-model="dialog.startTime"
                  :nudge-right="40"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.auctionStartTime"
                      label="Select Start Time"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="form.auctionStartTime"
                    ampm-in-title
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="3" v-show="form.auction === auctionTypes.ongoing">
                <v-menu
                  v-model="dialog.endTime"
                  :nudge-right="40"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.auctionEndTime"
                      label="Select End Time"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="form.auctionEndTime"
                    ampm-in-title
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { errorStore } from '~/store'
import { $apiPlatform } from '~/utils/api'
import DataParser from '~/utils/data'
import { numberWithCommas } from '~/utils/formatters'
import { httpResponseMapper } from '~/utils/http'
import { isNatural, isNaturalInteger } from '~/utils/number'
import Token from '~/utils/token'

@Component({
  layout: 'admin'
})
export default class ProductItems extends Vue {
  private getAuctionChipColor(val: '0' | '1' | '2') {
    switch (val) {
      case '0':
      case '1':
        return 'default'
      case '2':
        return 'info'
    }
  }

  private getAuctionChipValue(val: '0' | '1' | '2') {
    switch (val) {
      case '0':
        return 'NONE'
      case '1':
        return 'ENDED'
      case '2':
        return 'ONGOING'
    }
  }

  private isEnableAuctionOptions = false

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'SKU', value: 'sku', align: 'start', sortable: true },
    // { text: 'Category', value: 'category_main', align: 'start', sortable: true },
    { text: 'Price', value: 'price', align: 'start', sortable: true, filterable: false },
    { text: 'Stock', value: 'stock', align: 'start', sortable: true, filterable: false },
    // { text: 'Author', value: 'author', align: 'start', sortable: true },
    { text: 'Auction', value: 'auction', align: 'start', sortable: true, filterable: false },
    { text: 'Display', value: 'is_shelf', align: 'start', sortable: true, filterable: false },
    { text: 'Purchase Allowed', value: 'is_purchase_allowed', align: 'start', sortable: true, filterable: false },
    { text: 'Featured', value: 'is_featured', align: 'start', sortable: true, filterable: false },
    { text: 'Recommended', value: 'is_recommended', align: 'start', sortable: true, filterable: false },
    { text: 'Landing', value: 'is_main', align: 'start', sortable: true, filterable: false },
    // { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private tableData: any[] = []

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['sku', 'author', 'is_shelf', 'stock', 'auction'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private get accessLevelList() {
    return DataParser.accessLevelList
  }

  private get auctionList() {
    return [
      // {
      //   text: 'Ended',
      //   value: this.auctionTypes.ended
      // },
      {
        text: 'None',
        value: this.auctionTypes.none
      },
      {
        text: 'Ongoing',
        value: this.auctionTypes.ongoing
      },
    ]
  }

  private get auctionTypes() {
    return DataParser.auctionTypes
  }

  private get priceFinal() {
    if (Number(this.form.priceDeduction) === 0) {
      // return numberWithCommas(this.form.priceRaw)
      return this.form.priceRaw
    }
    return Number((Number(this.form.priceRaw) * ((100 - Number(this.form.priceDeduction)) / 100)).toFixed(2))
    // return numberWithCommas(Number((Number(this.form.priceRaw) * ((100 - Number(this.form.priceDeduction)) / 100)).toFixed(2)))
  }

  private handlePriceInput(val: string) {
    const _serialized = val.split(',').join('')
    this.form.priceRaw = _serialized
    this.form.price = _serialized
    // this.form.price = isNaturalInteger(val) ? numberWithCommas(Number(_serialized)) : val
  }

  private get fieldInputLengths() {
    return {
      descriptionMain: 128,
      descriptionSub: 256,
      price: 24
    }
  }

  @Watch('form.inStockOnly')
  async onInStockOnlyChange(newVal: boolean) {
    // await this.init()
    if (!newVal) {
      await this.init()
    } else {
      const _req = await $apiPlatform.get('/product?in_stock=true')
      const _data = httpResponseMapper(_req)?.data
      this.tableData = _data
    }
  }

  @Watch('accessLevelList')
  async onAccessLevelListChange(newVal: any[]) {
    this.form.accessLevel = newVal[newVal.length -1]
  }

  private form: any = {
    id: '',
    inStockOnly: false,
    displayOnly: false,
    featuredOnly: false,
    recommendedOnly: false,
    allowPurchaseOnly: false,
    landingOnly: false,
    categoryMain: [],
    categorySub: [],
    descriptionMain: '',
    descriptionSub: '',
    price: 0,
    priceRaw: 0,
    priceDeduction: 0,
    sku: '',
    isFeatured: false,
    isMain: false,
    isShelf: true,
    isRecommended: false,
    isPurchaseAllowed: true,
    stock: 0,
    auction: this.auctionTypes.none,
    auctionDates: [],
    accessLevel: [],
    imgCover: '',
    imgSub: '',
    imgSubSecond: '',
    imgSubThird: '',
    auctionStartTime: '',
    auctionEndTime: '',
    skuColor: '',
    skuAuthor: '',
    skuCategory: '',
    skuCountry: '',
    skuSize: '',
    skuStyle: '',
    skuTechnique: '',
    skuYear: ''
  }

  private dialog: any = {
    isEditMode: false,
    editTitle: 'Edit Product Label',
    newTitle: 'Create Product Label',
    new: false,
    title: 'Create Product Label',
    error: false,
    errorTitle: 'Server Error. Please try again later.',
    startDate: false,
    startTime: false,
    endTime: false
  }

  private handleRowClick(row: any, col: any) {
    const {
      id,
      category_main,
      category_sub,
      description_main,
      description_sub,
      price,
      price_deduction,
      sku,
      is_featured,
      is_main,
      is_shelf,
      is_recommended,
      is_purchase_allowed,
      stock,
      auction,
      // auctionDates,
      access_level,
      img_main,
      img_sub,
      img_sub_second,
      img_sub_third,
      // auctionStartTime,
      // auctionEndTime
    } = row
    const _priceRaw = Number(price.replaceAll(',', ''))
    const _categoryMain = category_main.split(',')
    const _categorySub = category_sub.split(',')
    this.form = {
      ...this.form,
      id,
      categoryMain: _categoryMain,
      categorySub: _categorySub,
      descriptionMain: description_main,
      descriptionSub: description_sub,
      price,
      priceRaw: _priceRaw,
      priceDeduction: price_deduction,
      sku,
      isFeatured: is_featured,
      isMain: is_main,
      isShelf: is_shelf,
      isRecommended: is_recommended,
      isPurchaseAllowed: is_purchase_allowed,
      stock,
      auction,
      // auctionDates,
      accessLevel: access_level,
      imgCover: img_main,
      imgSub: img_sub,
      imgSubSecond: img_sub_second,
      imgSubThird: img_sub_third,
      // auctionStartTime,
      // auctionEndTime
    }
    this.dialog.title = this.dialog.editTitle
    this.dialog.isEditMode = true
    this.dialog.new = true
  }

  private clearForm(): void {
    this.form = {
      id: '',
      inStockOnly: false,
      displayOnly: false,
      featuredOnly: false,
      recommendedOnly: false,
      allowPurchaseOnly: false,
      landingOnly: false,
      categoryMain: [],
      categorySub: [],
      descriptionMain: '',
      descriptionSub: '',
      price: 0,
      priceRaw: 0,
      priceDeduction: 0,
      sku: '',
      isFeatured: false,
      isMain: false,
      isShelf: true,
      isRecommended: false,
      isPurchaseAllowed: true,
      stock: 0,
      auction: this.auctionTypes.none,
      auctionDates: [],
      accessLevel: this.accessLevelList[this.accessLevelList.length - 1],
      imgCover: '',
      imgSub: '',
      imgSubSecond: '',
      imgSubThird: '',
      auctionStartTime: '',
      auctionEndTime: '',
      skuColor: '',
      skuAuthor: '',
      skuCategory: '',
      skuCountry: '',
      skuSize: '',
      skuStyle: '',
      skuTechnique: '',
      skuYear: ''
    }
  }

  private handleCreateItem(): void {
    this.dialog.new = true
  }

  private handleDeleteItem({ id, status }: { id: string, status: string }): void {
    this.form.id = id
    if (status === '啟用') {
      this.dialog.delete = true
    } else {
      this.dialog.activate = true
    }
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.dialog.isEditMode = false
    this.dialog.title = this.dialog.newTitle
    this.clearForm()
  }

  private fieldValidations() {
    if (this.form.descriptionMain.length === 0) {
      this.snackbar.text = 'Title is required'
      this.snackbar.toggle = true
      return
    }
    if (this.form.descriptionMain.length > this.fieldInputLengths.descriptionMain) {
      this.snackbar.text = `Title exceeded length (${this.fieldInputLengths.descriptionMain})`
      this.snackbar.toggle = true
      return
    }
    if (this.form.descriptionSub.length === 0) {
      this.snackbar.text = 'Description is required'
      this.snackbar.toggle = true
      return
    }
    if (this.form.descriptionSub.length > this.fieldInputLengths.descriptionSub) {
      this.snackbar.text = `Description exceeded length (${this.fieldInputLengths.descriptionSub})`
      this.snackbar.toggle = true
      return
    }
    if (this.form.price.length > this.fieldInputLengths.price) {
      this.snackbar.text = `Price exceeded length (${this.fieldInputLengths.price})`
      this.snackbar.toggle = true
      return
    }
    if (!isNatural(this.form.priceRaw)) {
      this.snackbar.text = 'Price is not a valid natural number'
      this.snackbar.toggle = true
      return
    }
    if (this.form.priceDeduction.length > this.fieldInputLengths.price) {
      this.snackbar.text = `Price Deduction exceeded length (${this.fieldInputLengths.price})`
      this.snackbar.toggle = true
      return
    }
    if (!isNatural(this.form.priceDeduction)) {
      this.snackbar.text = 'Price Deduction is not a valid natural number'
      this.snackbar.toggle = true
      return
    }
    if (!isNaturalInteger(this.form.stock)) {
      this.snackbar.text = 'Stock is not a valid natural integer'
      this.snackbar.toggle = true
      return
    }
    if (this.form.skuColor === '' && this.skuLabels.sku_color.length > 0 && !this.dialog.isEditMode) {
      this.snackbar.text = 'Sku Color is required'
      this.snackbar.toggle = true
      return
    }
     if (this.form.skuAuthor === '' && this.skuLabels.sku_author.length > 0 && !this.dialog.isEditMode) {
      this.snackbar.text = 'Sku Author is required'
      this.snackbar.toggle = true
      return
    }
     if (this.form.skuCategory === '' && this.skuLabels.sku_painting_category.length > 0 && !this.dialog.isEditMode) {
      this.snackbar.text = 'Sku Category is required'
      this.snackbar.toggle = true
      return
    }
     if (this.form.skuCountry === '' && this.skuLabels.sku_painting_country.length > 0 && !this.dialog.isEditMode) {
      this.snackbar.text = 'Sku Country is required'
      this.snackbar.toggle = true
      return
    }
    if (this.form.skuSize === '' && this.skuLabels.sku_painting_size.length > 0 && !this.dialog.isEditMode) {
      this.snackbar.text = 'Sku Size is required'
      this.snackbar.toggle = true
      return
    }
    if (this.form.skuStyle === '' && this.skuLabels.sku_painting_style.length > 0 && !this.dialog.isEditMode) {
      this.snackbar.text = 'Sku Style is required'
      this.snackbar.toggle = true
      return
    }
    if (this.form.skuTechnique === '' && this.skuLabels.sku_painting_tech.length > 0) {
      this.snackbar.text = 'Sku Technique is required'
      this.snackbar.toggle = true
      return
    }
    if (this.form.skuYear === '' && this.skuLabels.sku_painting_year.length > 0) {
      this.snackbar.text = 'Sku Year is required'
      this.snackbar.toggle = true
      return
    }
    return true
  }

  private async handleCreateSave() {
    if (!this.fieldValidations()) {
      return
    }
    const {
      id,
      categoryMain,
      categorySub,
      descriptionMain,
      descriptionSub,
      priceRaw,
      priceDeduction,
      skuColor,
      skuAuthor,
      skuCategory,
      skuCountry,
      skuSize,
      skuStyle,
      skuTechnique,
      skuYear,
      isFeatured,
      isMain,
      isShelf,
      isRecommended,
      isPurchaseAllowed,
      stock,
      auction,
      accessLevel
    } = this.form
    const _sku = `${skuColor}${skuAuthor}${skuCategory}${skuCountry}${skuSize}${skuStyle}${skuTechnique}${skuYear}`.toUpperCase()
    if (_sku.includes('UNDEFINED')) {
      return
    }
    const _categoryMain = categoryMain.join(',')
    const _action = this.dialog.isEditMode ? 'update' : 'create'

    //  TODO categorySub
    const _payload = {
      details: {
        categoryMain: _categoryMain,
        categorySub: '',
        descriptionMain,
        descriptionSub,
        price: priceRaw.toString(),
        priceDeduction: priceDeduction.toString(),
        sku: _sku,
        imgCover: '',
        imgSub: '',
        imgSubSecond: '',
        imgSubThird: ''
      },
      options: {
        isFeatured,
        isMain,
        isShelf,
        isRecommended,
        isPurchaseAllowed,
        stock: stock.toString(),
        auction,
        accessLevel
      },
      id,
      action: _action
    }
    const result = await $apiPlatform.post(
      '/product',
      _payload,
      { headers: { authorization: `Bearer ${Token.getValue()}` } }
    )
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `Product Label update failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      this.snackbar.text = 'Product Label update success.'
      this.clearForm()
      await this.init()
      this.dialog.new = false
    }
    this.snackbar.toggle = true
  }

  // private async handleDeleteConfirm(flag: boolean) {
  //   await $apiUser.post('/user', { id: this.form.id, action: flag ? 'activate' : 'delete' })
  //   if (errorStore.isActive) {
  //     this.snackbar.text = '操作失敗'
  //     errorStore.clearError()
  //   } else {
  //      await userStore.getUsers()
  //     if (flag) {
  //       this.dialog.activate = false
  //     } else {
  //       this.dialog.delete = false
  //     }
  //     this.clearForm()
  //     this.snackbar.text = '操作成功'
  //   }
  //   this.snackbar.toggle = true
  // }

  // private handleDeleteCancel(): void {
  //   this.dialog.delete = false
  //   this.clearForm()
  // }

  private categoryData: any[] = []

  private get categoryDisplay() {
    return this.categoryData.map((category) => {
      return { text: category.label, value: category.id }
    })
  }

  private async getCategory() {
    const _req = await $apiPlatform.get('/category')
    return httpResponseMapper(_req)?.data
  }

  private async setCategory() {
    const _rows = await this.getCategory()
    if (_rows && _rows.length) {
      this.categoryData = [..._rows]
    } else {
      this.categoryData = []
    }
  }

  private skuLabels: any = {
    sku_author: [],
    sku_color: [],
    sku_painting_category: [],
    sku_painting_country: [],
    sku_painting_size: [],
    sku_painting_style: [],
    sku_painting_tech: [],
    sku_painting_year: []
  }

  private async getSkuLabels() {
    const _req = await $apiPlatform.get('/sku/all')
    return httpResponseMapper(_req)?.data
  }

  private async setSkuLabels() {
    const _data = await this.getSkuLabels()    
    const {
      sku_author,
      sku_color,
      sku_painting_category,
      sku_painting_country,
      sku_painting_size,
      sku_painting_style,
      sku_painting_tech,
      sku_painting_year
    } = _data
    this.skuLabels = {
      sku_author: sku_author.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value })),
      sku_color: sku_color.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value })),
      sku_painting_category: sku_painting_category.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value })),
      sku_painting_country: sku_painting_country.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value })),
      sku_painting_size: sku_painting_size.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value })),
      sku_painting_style: sku_painting_style.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value })),
      sku_painting_tech: sku_painting_tech.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value })),
      sku_painting_year: sku_painting_year.map((item: any) => ({ text: `${item.label}(${item.value})`, value: item.value }))
    }
  }

  private async getProducts() {
    const { inStockOnly, displayOnly, recommendedOnly, landingOnly, featuredOnly, allowPurchaseOnly } = this.form

    console.log('inStockOnly', inStockOnly);
    
    const _req = await $apiPlatform.get(
      `/product?in_stock=${inStockOnly}&shelf=${displayOnly}&recommended=${recommendedOnly}&main=${landingOnly}&featured=${featuredOnly}&allow_purchase=${allowPurchaseOnly}`
   )
    return httpResponseMapper(_req)?.data
  }

  private formattedQuantityRows(val: number) {
    return numberWithCommas(val)
  }

  private async init() {
    const _rows = await this.getProducts()    
    if (_rows && _rows.length) {
      this.tableData = [..._rows]
    } else {
      this.tableData = []
    }
  }

  private async mounted() {
    await Promise.all([
      this.init(),
      this.setCategory(),
      this.setSkuLabels()
    ])
  }
}
</script>
