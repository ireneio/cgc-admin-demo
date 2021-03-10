<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Customers Management</h2>
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
                            cols="8"
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
                          <v-col cols="4" v-if="form.id !== ''">
                            <v-btn class="mt-4" color="error">Terminate Account</v-btn>
                          </v-col>
                          <v-col cols="12">
                            <div>Basic Information</div>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
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
                              v-model="form.account"
                              label="Account"
                              counter="255"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="form.contact"
                              label="Contact"
                              counter="10"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.address"
                              label="Billing Address"
                              counter="255"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" v-if="form.id !== ''">
                            <div>Contribution</div>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.spent"
                              label="Total Spent"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.spentMonthly"
                              label="Monthly Spent"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.spentDaily"
                              label="Daily Spent"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.spentYearly"
                              label="Yearly Spent"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" v-if="form.id !== ''">
                            <div>Points</div>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.pointBalance"
                              label="Current Balance"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.pointSpent"
                              label="Spent"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.pointTotal"
                              label="Total"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" v-if="form.id !== ''">
                            <div>Visits</div>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.visitTotal"
                              label="Total Visits"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.visitLatest"
                              label="Last Visit"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.visitFirst"
                              label="Account Creation Date"
                              readonly
                              disabled
                              flat
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.id !== ''"
                          >
                            <v-text-field
                              v-model="form.membershipLength"
                              label="Membership Length"
                              readonly
                              disabled
                              flat
                              suffix="year(s)"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-if="tab === 1">
                          <v-col cols="12">
                            <v-btn color="success">Export Excel</v-btn>
                          </v-col>
                          <v-col cols="12">
                            <v-data-table
                              :headers="[
                                { text: 'Status', value: 'account', align: 'start', sortable: true },
                                { text: 'Placed Date', value: 'account', align: 'start', sortable: true },
                                { text: 'Refund Date', value: 'account', align: 'start', sortable: true },
                                { text: 'Points Accumulated', value: 'account', align: 'start', sortable: true },
                                { text: 'Points Deducted', value: 'account', align: 'start', sortable: true }
                              ]"
                            >
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
              <template v-slot:item.spent="{ item }">
                ${{ item.spent.toLocaleString('en-us') }}
              </template>
              <template v-slot:item.pointBalance="{ item }">
                <em>P</em>&nbsp;{{ item.pointBalance.toLocaleString('en-us') }}
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
export default class CustomersIndex extends Vue {
  private headers: Array<any> = [
    { text: 'Account', value: 'account', align: 'start', sortable: true },
    { text: 'Name', value: 'name', align: 'start', sortable: true },
    { text: 'Contact', value: 'contact', align: 'start', sortable: false },
    { text: 'Total Spent', value: 'spent', align: 'start', sortable: true },
    { text: 'Current Points Balance', value: 'pointBalance', align: 'start', sortable: true },
    { text: 'Last Visit', value: 'visitLatest', align: 'start', sortable: true },
    // { text: 'First Visit', value: 'visitFirst', align: 'start', sortable: true },
    { text: 'Total Visits', value: 'visitTotal', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): Array<any> {
    return [
      {
        id: '123',
        account: 'johndoe@gmail.com',
        name: 'John Doe',
        contact: '6171230990',
        address: '123 Blvd. Irvine, CA 02446',
        spent: 999999,
        spentMonthly: 1000,
        spentDaily: 123,
        spentYearly: 356,
        pointTotal: 999999,
        pointBalance: 999999 - 12345,
        pointSpent: 12345,
        visitLatest: new DateFactory(new Date()).yymmddhhmmss(),
        visitFirst: new DateFactory(new Date()).yymmddhhmmss(),
        visitTotal: 123,
        membershipLength: 5,
      }
    ]
  }

  private tab: number = 0

  private tabs: Array<any> = [
    { text: 'Info', value: 0 },
    { text: 'Orders', value: 1 }
  ]

  private handleUpdateTab(val: number): void {
    this.tab = Number(val)
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

  private selectCourses: Array<any> = [
    {
      text: 'Course-1',
      value: '1'
    },
    {
      text: 'Course-2',
      value: '2'
    },
    {
      text: 'Course-3',
      value: '3'
    }
  ]

  private selectStores: Array<any> = [
    {
      text: 'Seattle-1',
      value: '1'
    },
    {
      text: 'Seattle-2',
      value: '2'
    },
    {
      text: 'Seattle-3',
      value: '3'
    }
  ]

  private form: any = {
    id: '',
    account: '',
    name: '',
    contact: '',
    address: '',
    spent: 999999,
    spentMonthly: 0,
    spentDaily: 0,
    spentYearly: 0,
    pointTotal: 0,
    pointBalance: 0,
    pointSpent: 0,
    visitLatest: new DateFactory(new Date()).yymmddhhmmss(),
    visitFirst: new DateFactory(new Date()).yymmddhhmmss(),
    visitTotal: 0,
    membershipLength: 0
  }

  private dialog: any = {
    deleteConfimationText: 'Are you sure you want to delete this customer account?',
    delete: false,
    edit: false,
    editTitle: 'Edit Customer',
    new: false,
    newTitle: 'Create Customer',
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
      memo: '',
      version: '',
      consistedCourses: [],
      includedStores: ''
    }
  }

  private fillForm(item: any): void {
    const { id, name, account, contact, address, spentMonthly, spentDaily, spentYearly, pointTotal, pointBalance, pointSpent, visitLatest, visitFirst, visitTotal, membershipLength } = item
    this.form = {
      ...this.form,
      id,
      name,
      account,
      contact,
      address,
      spentMonthly,
      spentDaily,
      spentYearly,
      pointTotal,
      pointBalance,
      pointSpent,
      visitLatest,
      visitFirst,
      visitTotal,
      membershipLength
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
    this.tab = 0
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.clearForm()
    this.tab = 0
  }

  private handleEditCancel(): void {
    this.dialog.new = false
    this.clearForm()
    this.tab = 0
  }

  private handleEditSave(): void {
    this.dialog.new = false
    this.clearForm()
    this.tab = 0
  }

  private async created() {
  }
}
</script>
