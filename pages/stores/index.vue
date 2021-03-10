<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Stores Management</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              color="primary"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="tableData"
              :single-select="false"
              :options="tableOptions"
              item-key="id"
              :show-select="false"
              :mobile-breakpoint="1023"
              class="elevation-1 mt-4"
              @click:row="handleRowClick"
              @item-selected="handleSelectItem"
              @toggle-select-all="handleSelectItemAll"
            >
              <template v-slot:top>
                <v-dialog
                  v-model="dialog.new"
                  max-width="50vw"
                  max-height="70vh"
                  persistent
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ form.id === '' ? dialog.newTitle : dialog.editTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" v-if="form.id !== ''">
                            <v-tabs
                              color="primary"
                              center-active
                            >
                              <v-tab v-for="item in tabs" :key="item.value" @click="handleUpdateTab(item.value)">{{ item.text }}</v-tab>
                            </v-tabs>
                          </v-col>
                        </v-row>
                        <v-row v-if="tab === 0">
                          <v-col
                            cols="12"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.id"
                              label="ID"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.name"
                              label="Name"
                              counter="255"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="form.email"
                              label="Email"
                              counter="255"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="form.phone"
                              label="Phone"
                              counter="10"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.address"
                              label="Address"
                              counter="255"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-select
                              v-model="form.includedMenus"
                              :items="selectMenus"
                              label="Included Menus"
                              multiple
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-select
                              v-model="form.inUseMenu"
                              :items="selectIncludedMenus"
                              label="Menu In Use"
                              :disabled="form.includedMenus.length === 0"
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.memo"
                              label="Memo"
                              counter="255"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-if="tab === 1">
                          <v-col cols="12">
                            <v-btn color="success">Export Excel</v-btn>
                          </v-col>
                          <v-col cols="12">
                            <v-data-table
                              :headers="inventoryTableHeaders"
                              :items="inventoryTableData"
                            >
                            <template v-slot:top>
                              <v-text-field
                                v-model="inventorySearch"
                                label="Search"
                              ></v-text-field>
                              <v-dialog
                                v-model="dialog.inventory"
                                max-width="50vw"
                              >
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">{{ dialog.inventoryTitle }}</span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col
                                          cols="12"
                                        >
                                          <v-text-field
                                            v-model="formInventory.name"
                                            label="Name"
                                            readonly
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                        >
                                          <v-text-field
                                            v-model="formInventory.inventory"
                                            label="Inventory"
                                            :error="isNaN(parseInt(formInventory.inventory))"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                        >
                                          <!-- <v-menu
                                            ref="menu"
                                            :close-on-content-click="false"
                                            :return-value.sync="formInventory.stockDateNext"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                          >
                                            <template v-slot:activator="{ on, attrs }">
                                              <v-combobox
                                                v-model="formInventory.stockDateNext"
                                                chips
                                                small-chips
                                                label="Next Stocking Date"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                              ></v-combobox>
                                            </template>
                                            <v-date-picker
                                              v-model="formInventory.stockDateNext"
                                              no-title
                                              scrollable
                                            >
                                            </v-date-picker>
                                          </v-menu> -->
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                        >
                                          <!-- <v-menu
                                            ref="menu"
                                            :close-on-content-click="false"
                                            :return-value.sync="formInventory.stockDateLast"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                          >
                                            <template v-slot:activator="{ on, attrs }">
                                              <v-combobox
                                                v-model="formInventory.stockDateLast"
                                                chips
                                                small-chips
                                                label="Last Stocking Date"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                              ></v-combobox>
                                            </template>
                                            <v-date-picker
                                              v-model="form.stockDateLast"
                                              no-title
                                              scrollable
                                            >
                                            </v-date-picker>
                                          </v-menu> -->
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="blue darken-1"
                                      text
                                      @click="handleEditInventoryCancel"
                                    >
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      color="blue darken-1"
                                      text
                                      @click="handleEditInventorySave"
                                    >
                                      Save
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </template>
                            <template v-slot:item.misc="{ item }">
                              <v-icon
                                small
                                @click.stop="handleEditInventory(item)"
                              >
                                mdi-pencil
                              </v-icon>
                            </template>
                            </v-data-table>
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
                        Cancel
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="handleCreateSave"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialog.delete" max-width="50vw">
                  <v-card>
                    <v-card-title class="headline">{{ dialog.deleteConfimationText }}</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="handleDeleteCancel">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="handleDeleteConfirm">Confirm</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.contact="{ item }">
                {{ item.contact.email }}
                <br />
                {{ item.contact.phone }}
                <!-- <br />
                {{ item.contact.address }} -->
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="storeStatusColor(item)"
                >
                  {{ item.status.toUpperCase() }}
                </v-chip>
              </template>
              <template v-slot:item.revenueDay="{ item }">
                ${{ item.revenueDay.toLocaleString('en-us') }}
              </template>
              <template v-slot:item.inUseMenu="{ item }">
                {{ item.inUseMenu.text }}
              </template>
              <template v-slot:item.misc="{ item }">
                <v-icon
                  small
                  @click.stop="handleDeleteItem(item)"
                >
                  mdi-delete
                </v-icon>
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
import { DateFactory } from '~/utils/date'
import { sysStore } from '~/store'

@Component({
  layout: 'default'
})
export default class StoresIndex extends Vue {
  private headers: Array<any> = [
    // { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'Name', value: 'name', align: 'start', sortable: true },
    { text: 'Contact', value: 'contact', align: 'start', sortable: false },
    { text: 'Status', value: 'status', align: 'start', sortable: true },
    { text: 'Revenue (Day)', value: 'revenueDay', align: 'start', sortable: true },
    { text: 'Menu In Use', value: 'inUseMenu', align: 'start', sortable: true },
    { text: 'Memo', value: 'memo', align: 'start', sortable: false },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): Array<any> {
    return [
      {
        id: '123',
        name: 'Seattle-001',
        memo: 'some memo',
        status: 'open',
        contact: {
          phone: '6176029916',
          email: 'seattle001@gmail.com',
          address: '123 Blvd. Irvine, CA 02446'
        },
        revenueDay: 99999,
        includedMenus: [
          {
            text: 'Menu-1',
            value: '1'
          },
          {
            text: 'Menu-2',
            value: '2'
          }
        ],
        inUseMenu: {
          text: 'Menu-1',
          value: '1'
        }
      }
    ]
  }

  private inventoryTableHeaders: Array<any> = [
    { text: 'Name', value: 'name', align: 'start', sortable: true },
    { text: 'Inventory', value: 'inventory', align: 'start', sortable: true },
    { text: 'Next Supply Arrival', value: 'stockDateNext', align: 'start', sortable: true },
    { text: 'Last Supply Arrival', value: 'stockDateLast', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get inventoryTableData(): Array<any> {
    return [
      {
        id: '123',
        name: 'Pork-001',
        inventory: 999.5,
        stockDateNext: new DateFactory(new Date()).yymmddhhmm(),
        stockDateLast: new DateFactory(new Date()).yymmddhhmm()
      }
    ]
  }

  private inventorySearch: string = ''

  private formInventory: any = {
    id: '',
    name: '',
    inventory: 0,
    stockDateNext: '',
    stockDateLast: ''
  }

  private fillFormInventory(item: any): void {
    const { id, name, inventory, stockDateNext, stockDateLast } = item
    this.formInventory = {
      ...this.formInventory,
      id,
      name,
      inventory,
      stockDateNext,
      stockDateLast
    }
  }

  private clearFormInventory(): void {
    this.formInventory = {
      id: '',
      name: '',
      inventory: 0,
      stockDateNext: '',
      stockDateLast: ''
    }
  }

  private handleEditInventory(obj: any): void {
    this.fillFormInventory(obj)
    this.dialog.inventory = true
  }

  private handleEditInventoryCancel(): void {
    this.dialog.inventory = false
    this.clearFormInventory()
  }

  private handleEditInventorySave(): void {
    this.dialog.inventory = false
    this.clearFormInventory()
  }



  private tab: number = 0

  private tabs: Array<any> = [
    { text: 'Info', value: 0 },
    { text: 'Inventory', value: 1 }
  ]

  private handleUpdateTab(val: number): void {
    this.tab = Number(val)
  }

  private storeStatusColor(item: any): string {
    return item.status === 'open' ? 'success' : item.status === 'closed' ? 'warning' : 'danger'
  }

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['date'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private selected: Array<any> = []

  private singleSelect: boolean = false

  private selectMenus: Array<any> = [
    {
      text: 'Menu-1',
      value: '1'
    },
    {
      text: 'Menu-2',
      value: '2'
    },
    {
      text: 'Menu-3',
      value: '3'
    }
  ]

  private get selectIncludedMenus(): Array<any> {
    return this.form.includedMenus.map((item: any) => {
      return {
        value: item,
        text: this.selectMenus.find((menu: any) => menu.value === item).text
      }
    })
  }

  private form: any = {
    id: '',
    name: '',
    memo: '',
    phone: '',
    email: '',
    address: '',
    inUseMenu: '',
    includedMenus: []
  }

  private dialog: any = {
    deleteConfimationText: 'Are you sure you want to delete this store?',
    delete: false,
    edit: false,
    editTitle: 'Edit Store',
    new: false,
    newTitle: 'Create Store',
    error: false,
    errorTitle: 'Server Error. Please try again later.',
    inventory: false,
    inventoryTitle: 'Edit Store Inventory'
  }

  private handleSelectItem(obj: any): void {
    const { value, item } = obj
    if(value === true) {
      this.selected = [...item]
    } else {
      this.selected = []
    }
  }

  private handleSelectItemAll(obj: any): void {
    const { value, items } = obj
    if(value === true) {
      this.selected = [...items]
    } else {
      this.selected = []
    }
  }

  private handleRowClick(row: any, col: any): void {
    this.handleEditItem(row)
  }

  private clearForm(): void {
    this.form = {
      id: '',
      name: '',
      memo: '',
      phone: '',
      email: '',
      address: '',
      inUseMenu: '',
      includedMenus: []
    }
  }

  private fillForm(item: any): void {
    const { id, name, contact: { email, phone, address }, memo, includedMenus, inUseMenu } = item
    this.form = {
      ...this.form,
      id,
      name,
      phone,
      email,
      address,
      memo,
      includedMenus: includedMenus.map((item: any) => item.value),
      inUseMenu
    }
  }

  private handleCreateItem(): void {
    this.dialog.new = true
  }

  private handleEditItem(item: any): void {
    this.fillForm(item)
    this.dialog.new = true
  }

  private handleDeleteItem(item: any): void {
    this.fillForm(item)
    this.dialog.delete = true
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.clearForm()
    this.tab = 0
  }

  private handleCreateSave(): void {
    this.dialog.new = false
    this.clearForm()
    this.tab = 0
  }

  private handleDeleteConfirm(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private async created() {
  }
}
</script>
