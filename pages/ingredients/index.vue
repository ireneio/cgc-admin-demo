<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Inventory Management</h2>
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
              item-key="name"
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
                  persistent
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ form.id === '' ? dialog.newTitle : dialog.editTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
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
                          >
                            <v-text-field
                              v-model="form.inventory"
                              label="Inventory"
                              :error="isNaN(parseInt(form.inventory))"
                            ></v-text-field>
                          </v-col>
                          <!-- <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-menu
                              ref="menu"
                              :close-on-content-click="false"
                              :return-value.sync="dates"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-combobox
                                  v-model="form.stockDateNext"
                                  chips
                                  small-chips
                                  label="Next Stocking Date"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-combobox>
                              </template>
                              <v-date-picker
                                v-model="form.stockDateNext"
                                no-title
                                scrollable
                              >
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-menu
                              ref="menu"
                              :close-on-content-click="false"
                              :return-value.sync="dates"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-combobox
                                  v-model="form.stockDateLast"
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
                            </v-menu>
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
              <template v-slot:item.misc="{ item }">
                <!-- <v-icon
                  small
                  class="mr-2"
                  @click="handleEditItem(item)"
                >
                  mdi-pencil
                </v-icon> -->
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
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { DateFactory } from '~/utils/date'
import { sysStore } from '~/store'

@Component({
  layout: 'default'
})
export default class IngredientsIndex extends Vue {
  private headers: Array<any> = [
    { text: 'Name', value: 'name', align: 'start', sortable: true },
    { text: 'Inventory', value: 'inventory', align: 'start', sortable: true },
    // { text: 'Next Stocking Date', value: 'stockDateNext', align: 'start', sortable: true },
    // { text: 'Last Stocking Date', value: 'stockDateLast', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): Array<any> {
    return [
      {
        id: '123',
        name: 'Fresh Pork 1',
        inventory: 999,
        memo: 'some memo here..',
        stockDateNext: new DateFactory(new Date()).yymmddhhmmss(),
        stockDateLast: new DateFactory(new Date()).yymmddhhmmss()
      }
    ]
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

  private selectDelivery: Array<any> = [
    {
      text: 'Delivered',
      value: '1'
    },
    {
      text: 'Pickup Required',
      value: '2'
    },
    {
      text: 'In Progress',
      value: '3'
    }
  ]

  private selectMonetary: Array<any> = [
    {
      text: 'Paid',
      value: '1'
    },
    {
      text: 'Transaction in Progress',
      value: '2'
    },
    {
      text: 'Payment Required',
      value: '3'
    }
  ]

  private selectStore: Array<any> = [
    {
      text: 'Seattle 1',
      value: '1'
    },
    {
      text: 'Seattle 2',
      value: '2'
    },
  ]

  private form: any = {
    id: '',
    name: '',
    inventory: 0,
    stockDateNext: new Date().toISOString().substr(0, 10),
    stockDateLast: new Date().toISOString().substr(0, 10)
  }

  private dates: string = new Date().toISOString().substr(0, 10)

  private dialog: any = {
    deleteConfimationText: 'Are you sure you want to delete this item?',
    delete: false,
    edit: false,
    editTitle: 'Edit Item',
    new: false,
    newTitle: 'Create Item',
    error: false,
    errorTitle: 'Server Error. Please try again later.'
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
      inventory: 0,
      stockDateNext: new Date().toISOString().substr(0, 10),
      stockDateLast: new Date().toISOString().substr(0, 10)
    }
  }

  private fillForm(item: any): void {
    const { id, name, inventory, stockDateNext, stockDateLast } = item
    this.form = {
      id,
      name,
      inventory,
      stockDateNext,
      stockDateLast
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
  }

  private handleCreateSave(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private handleDeleteConfirm(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private handleEditCancel(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private handleEditSave(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private async created() {
  }
}
</script>
