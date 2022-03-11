<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Edit Sku Labels</h2>
        <v-card outlined>
          <v-toolbar flat class="mb-n4">
            <v-tabs
              v-model="tab.current"
              height="48px"
            >
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab
                v-for="item in tab.items"
                :key="item.key"
              >
                {{ item.value }}
              </v-tab>
            </v-tabs>
          </v-toolbar>
          <v-card-text class="pt-0">
            <v-btn
              color="info"
              class="mt-4"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Create
            </v-btn>
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
                  label="Search Labels or Values"
                  class="mx-4"
                ></v-text-field>
                <!-- <v-dialog v-model="dialog.activate" max-width="50vw">
                  <v-card>
                    <v-card-title class="headline">{{ dialog.activateConfimationText }}</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="handleDeleteCancel">取消</v-btn>
                      <v-btn color="blue darken-1" text @click="handleDeleteConfirm(true)">確認</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog> -->
              </template>
              <!-- <template v-slot:item.misc="{ item }">
                <v-icon
                  small
                  @click.stop="handleDeleteItem(item)"
                >
                {{ item.status === '啟用' ? 'mdi-stop' : 'mdi-play' }}
                </v-icon>
              </template> -->
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
                  v-model="form.value"
                  label="Initial"
                  :counter="textFieldLengths.value"
                ></v-text-field>
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
import { errorStore, userStore } from '~/store'
import { $apiPlatform, $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Component({
  layout: 'admin'
})
export default class ProductSku extends Vue {
  private tab = {
    current: 0,
    items: [
      { key: 0, value: 'author', query: 'sku_author' },
      { key: 1, value: 'color', query: 'sku_color' },
      { key: 2, value: 'category', query: 'sku_painting_category' },
      { key: 3, value: 'country', query: 'sku_painting_country' },
      { key: 4, value: 'size', query: 'sku_painting_size' },
      { key: 5, value: 'style', query: 'sku_painting_style' },
      { key: 6, value: 'technique', query: 'sku_painting_technique' },
      { key: 7, value: 'year', query: 'sku_painting_year' }
    ]
  }

  private getSerializedDialogTitle(val: string) {
    return val[0].toUpperCase() + val.substring(1) + ' Label'
  }

  @Watch('tab.current', { immediate: true })
  private async onTabChange(newVal: number) {
    await this.setTableData()
    const _val = this.tab.items[newVal].value
    this.dialog.title = `Create ${this.getSerializedDialogTitle(_val)}`
  }

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'Label', value: 'label', align: 'start', sortable: true },
    { text: 'Initial', value: 'value', align: 'start', sortable: true },
    // { text: 'Enabled', value: 'status', align: 'start', sortable: true, filterable: false },
    // { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false },
    // { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private tableData: any[] = []

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['value'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private form: any = {
    id: '',
    label: '',
    value: ''
  }

  private dialog: any = {
    activateConfimationText: 'Enable this Label?',
    activate: false,
    deleteConfimationText: 'Disable this Label?',
    delete: false,
    new: false,
    title: '',
    error: false,
    errorTitle: 'Server Error. Please try again later.'
  }

  private handleRowClick(row: any, col: any) {
    const { label, value, id } = row
    this.form.id = id
    this.form.label = label
    this.form.value = value
    const _val = this.tab.items.find((tab) => tab.key === this.tab.current)?.value
    this.dialog.title = `Edit ${this.getSerializedDialogTitle(String(_val))}`
    this.dialog.new = true
  }

  private isUpdateInfoLoading: boolean = false

  private async handleUpdate() {
    const { id, description } = this.form
    if (description.length > 30) {
      this.snackbar.text = '大於字數限制'
      this.snackbar.toggle = true
      return
    }
    this.isUpdateInfoLoading = true
    const result = await $apiUser.post('/user', { id, description, action: 'update' })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `更新帳號失敗: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await userStore.getUsers()
      this.snackbar.text = '更新帳號成功'
    }
    this.snackbar.toggle = true
    this.isUpdateInfoLoading = false
  }

  private clearForm(): void {
    this.form = {
      id: '',
      label: '',
      value: ''
    }
  }

  private handleCreateItem(): void {
    this.dialog.new = true
  }

  // private handleDeleteItem({ id, status }: { id: string, status: string }): void {
  //   this.form.id = id
  //   if (status === '啟用') {
  //     this.dialog.delete = true
  //   } else {
  //     this.dialog.activate = true
  //   }
  // }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private get textFieldLengths() {
    return {
      label: 48,
      value: 4,
    }
  }

  private fieldValidation() {
    if (this.form.label.length > this.textFieldLengths.label) {
      this.snackbar.text = `Label excceeded length (${this.textFieldLengths.label})`
      this.snackbar.toggle = true
      return false
    }
    if (this.form.value.length > this.textFieldLengths.value) {
      this.snackbar.text = `Initial excceeded length (${this.textFieldLengths.value})`
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
      id: this.form.id,
      name: this.form.label,
      initial: this.form.value,
      type: this.tab.items.find((tab) => tab.key === this.tab.current)?.query
    }
    const result = await $apiPlatform.post('/sku/generation', _payload)
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `Sku Label update failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await this.setTableData()
      this.snackbar.text = 'Sku Label update success.'
      this.dialog.new = false
      this.clearForm()
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

  private async getSkuLabel() {
    const _query = this.tab.items.find((tab) => tab.key === this.tab.current)
    if (_query) {
      const _req = await $apiPlatform.get(`/sku?label=${_query.query}`)
      return httpResponseMapper(_req)?.data
    }
    return []
  }

  private async setTableData() {
    const _rows = await this.getSkuLabel()
    this.tableData = [..._rows]
  }

  private async created() {
    await this.setTableData()
  }
}
</script>
