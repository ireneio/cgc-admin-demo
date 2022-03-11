<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Edit Categories</h2>
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
                  label="Search Categories"
                  class="mx-4"
                ></v-text-field>
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
                cols="12"
              >
                <v-text-field
                  v-model="form.label"
                  label="Label"
                  :counter="textFieldLengths.label"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="form.descriptionMain"
                  label="Main Description"
                  :counter="textFieldLengths.descriptionMain"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="form.descriptionSub"
                  label="Sub Description"
                  :counter="textFieldLengths.descriptionSub"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="accessLevelList"
                  label="Permission"
                  v-model="form.permission"
                ></v-select>
              </v-col>
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
            :disabled="form.permission === '' || form.label === ''"
          >
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { errorStore } from '~/store'
import { $apiPlatform } from '~/utils/api'
import { textFormatDb } from '~/utils/formatters'
import { httpResponseMapper } from '~/utils/http'
import DataParser from '~/utils/data'

@Component({
  layout: 'admin'
})
export default class ProductIndex extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'Label', value: 'label', align: 'start', sortable: true },
    // { text: 'Main description', value: 'description_main', align: 'start', sortable: true },
    // { text: 'Sub description', value: 'description_sub', align: 'start', sortable: false },
    { text: 'Access Level', value: 'access_level', align: 'start', sortable: true, filterable: false },
    { text: 'Display', value: 'is_shelf', align: 'start', sortable: true, filterable: false },
    { text: 'Purchase', value: 'is_purchase_allowed', align: 'start', sortable: true, filterable: false },
    { text: 'Featured', value: 'is_featured', align: 'start', sortable: true, filterable: false },
    { text: 'Recommended', value: 'is_recommended', align: 'start', sortable: true, filterable: false },
    { text: 'Landing', value: 'is_main', align: 'start', sortable: true, filterable: false },
    // { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false, filterable: false },
  ]

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['is_shelf', 'is_purchase_allowed', 'is_featured', 'is_recommended'],
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
    id: '',
    label: '',
    descriptionMain: '',
    descriptionSub: '',
    isFeatured: false,
    isPurchaseAllowed: false,
    isMain: false,
    isRecommended: false,
    isShelf: true,
    permission: ''
  }

  @Watch('form.isShelf')
  onFormIsShelfChange(newVal: boolean) {
    if (!newVal) {
      this.form.isFeatured = false
      this.form.isPurchaseAllowed = false
      this.form.isMain = false
      this.form.isRecommended = false
    }
  }

  private dialog: any = {
    activateConfimationText: 'Enable this category?',
    activate: false,
    deleteConfimationText: 'Disable this category?',
    delete: false,
    isEditMode: false,
    new: false,
    title: 'Create Category',
    createTitle: 'Create Category',
    editTitle: 'Edit Category',
    error: false,
    errorTitle: 'Server Error. Please try again later.'
  }

  private async handleRowClick(row: any, col: any): Promise<void> {
    const {
      id,
      access_level,
      is_shelf,
      is_featured,
      is_purchase_allowed,
      is_recommended,
      is_main,
      label,
      description_main,
      description_sub
    } = row
    this.form = {
      id,
      label,
      descriptionMain: description_main,
      descriptionSub: description_sub,
      permission: access_level,
      isFeatured: is_featured,
      isPurchaseAllowed: is_purchase_allowed,
      isMain: is_main,
      isRecommended: is_recommended,
      isShelf: is_shelf,
    }
    this.dialog.title = this.dialog.editTitle
    this.dialog.new = true
    this.dialog.isEditMode = true
  }

  private clearForm(): void {
    this.form = {
      label: '',
      descriptionMain: '',
      descriptionSub: '',
      isFeatured: false,
      isPurchaseAllowed: false,
      isMain: false,
      isRecommended: false,
      isShelf: true,
      permission: ''
    }
  }

  private handleCreateItem(): void {
    this.dialog.title = this.dialog.createTitle
    this.dialog.new = true
    this.dialog.isEditMode = false
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private get textFieldLengths() {
    return {
      label: 64,
      descriptionMain: 256,
      descriptionSub: 256
    }
  }

  private fieldValidation() {
    if (this.form.label.length > this.textFieldLengths.label) {
      this.snackbar.text = `Label excceeded length (${this.textFieldLengths.label})`
      this.snackbar.toggle = true
      return false
    }
    if (this.form.descriptionMain.length > this.textFieldLengths.descriptionMain) {
      this.snackbar.text = `Main Description excceeded length (${this.textFieldLengths.descriptionMain})`
      this.snackbar.toggle = true
      return false
    }
    if (this.form.descriptionSub.length > this.textFieldLengths.descriptionSub) {
      this.snackbar.text = `Sub Description excceeded length (${this.textFieldLengths.descriptionSub})`
      this.snackbar.toggle = true
      return false
    }
    return true
  }

  private async handleCreateSave() {
    if (!this.fieldValidation()) {
      return
    }
    const _payload = {
      ...this.form,
      accessLevel: this.form.permission,
      value: textFormatDb(this.form.label)
    }
    const _endpoint = this.dialog.isEditMode ? '/category/options' : '/category'
    const _req = await $apiPlatform.post(_endpoint, _payload)
    httpResponseMapper(_req)
    if (errorStore.isActive) {
      this.snackbar.text = `Category update failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      this.clearForm()
      this.snackbar.text = 'Category update success.'
      await this.init()
      this.dialog.new = false
    }
    this.snackbar.toggle = true
  }

  private async getCategories() {
    const _req = await $apiPlatform.get('/category')
    return httpResponseMapper(_req).data
  }

  private tableData: any[] = []

  private async init() {
    try {
      const _rows = await this.getCategories()
      if (_rows && _rows.length) {
        this.tableData = [..._rows]
      }
    } catch (e: unknown) {

    }
  }

  private async created() {
    await this.init()
  }
}
</script>
