<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Orders Management</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              color="primary"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              @click="handleRefund"
            >
              Cancel Selected
            </v-btn>
            <v-btn
              class="ml-4"
              color="error"
              @click="handleRefund"
            >
              Refund Selected
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
              :show-select="true"
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
                              v-model="form.cid"
                              label="Customer ID"
                              :readonly="form.id !== ''"
                              :disabled="form.id !== ''"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-select
                              v-model="form.sid"
                              :items="selectStore"
                              label="Branch (Store)"
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              v-model="form.amount"
                              label="Amount"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-select
                              v-model="form.statusDelivery"
                              :items="selectDelivery"
                              label="Delivery Status"
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-select
                              v-model="form.statusMonetary"
                              :items="selectMonetary"
                              label="Monetary Status"
                            ></v-select>
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
import { Component, Vue } from 'nuxt-property-decorator'
import { DateFactory } from '~/utils/date'
import { sysStore } from '~/store'

@Component({
  layout: 'default'
})
export default class OrdersIndex extends Vue {
  private headers: Array<any> = [
    { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'Branch (Store)', value: 'store', align: 'start', sortable: true },
    { text: 'Customer ID', value: 'cid', align: 'start', sortable: true },
    { text: 'Amount', value: 'amount', align: 'start', sortable: true },
    { text: 'Deliver Status', value: 'statusDelivery', align: 'start', sortable: true },
    { text: 'Monetary Status', value: 'statusMonetary', align: 'start', sortable: true },
    { text: 'Created Date', value: 'date', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): Array<any> {
    return [
      {
        id: '123',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '456',
        store: 'Seattle 1',
        sid: '1',
        cid: '0328402990321',
        amount: 999,
        statusDelivery: 'in progress',
        statusDeliveryId: '1',
        statusMonetary: 'paid',
        statusMonetaryId: '1',
        date: new DateFactory(new Date()).yymmddhhmmss()
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
    sid: '',
    cid: '',
    amount: 0,
    statusDelivery: '',
    statusMonetary: ''
  }

  private dialog: any = {
    deleteConfimationText: 'Are you sure you want to delete this order?',
    delete: false,
    edit: false,
    editTitle: 'Edit Order',
    new: false,
    newTitle: 'Create Order',
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
      sid: '',
      cid: '',
      statusDelivery: '',
      statusMonetary: ''
    }
  }

  private fillForm(item: any): void {
     const { id, sid, cid, amount, statusDeliveryId, statusMonetaryId } = item
      this.form = {
        id,
        sid,
        cid,
        amount,
        statusDelivery: statusDeliveryId,
        statusMonetary: statusMonetaryId
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

  private handleRefund(): void {}

  private async created() {
  }
}
</script>
