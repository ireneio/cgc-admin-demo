<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Management</h2>
        <v-card outlined>
          <v-card-text flat class="mb-n4">
            <v-row>
              <v-col cols="12">
                <v-btn
                  color="info"
                  @click="handleCreateItem"
                >
                  <v-icon>mdi-plus</v-icon> Create Wizard
                </v-btn>
              </v-col>
              <v-col cols="12" md="3" lg="2">
                <v-btn
                  color="success"
                  @click="handleCreateItemOrg"
                >
                  <v-icon>mdi-plus</v-icon> Create Org
                </v-btn>
              </v-col>
              <v-col cols="12" md="3" lg="2">
                <v-btn
                  color="primary"
                  @click="handleCreateItemUser"
                >
                  <v-icon>mdi-plus</v-icon> Create User
                </v-btn>
              </v-col>
              <v-col cols="12" md="3" lg="2">
                <v-btn
                  color="secondary"
                  @click="handleCreateItemGame"
                >
                  <v-icon>mdi-plus</v-icon> Create Game
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="pt-2">
            <v-tabs
              v-model="tab.current"
              height="48px"
              color="info"
            >
              <v-tabs-slider color="info"></v-tabs-slider>
              <v-tab
                v-for="item in tab.items"
                :key="item.key"
              >
                {{ item.value }}
              </v-tab>
              <v-tab-item>
                <v-data-table
                  :headers="headersOrg"
                  :items="tableDataOrg"
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
                      label="Search Name"
                      class="mx-4"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>
                <v-data-table
                  :headers="headersUser"
                  :items="tableDataUser"
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
                      label="Search Name"
                      class="mx-4"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>
                <v-data-table
                  :headers="headersGame"
                  :items="tableDataGame"
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
                      label="Search Name"
                      class="mx-4"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs>
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
          <v-stepper v-model="dialog.step">
            <v-stepper-header>
              <v-stepper-step
                :complete="dialog.step > 1"
                step="1"
              >
                Create Organizations
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                :complete="dialog.step > 2"
                step="2"
              >
                Create Users
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3">
                Create Games
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <CreateOrg :dialog="dialog" @click="handleCreateOrg"/>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-btn class="mt-2" color="default" text @click="dialog.step = 1">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <CreateUser :dialog="dialog" @click="handleCreateUser"/>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-btn class="mt-2" color="default" text @click="dialog.step = 2">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <CreateGame :dialog="dialog" @click="handleCreateGame"/>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="handleCreateCancel"
          >
            Close
          </v-btn>
          <!-- <v-btn
            color="blue darken-1"
            text
            @click="handleCreateSave"
          >
            Save
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog.createOrg"
      max-width="700px"
      max-height="70vh"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialog.title }}</span>
        </v-card-title>
        <v-card-text>
          <CreateOrg :dialog="dialog" @click="handleCreateOrg"/>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog.createUser"
      max-width="700px"
      max-height="70vh"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialog.title }}</span>
        </v-card-title>
        <v-card-text>
          <CreateUser :dialog="dialog" @click="handleCreateOrg"/>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog.createGame"
      max-width="700px"
      max-height="70vh"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialog.title }}</span>
        </v-card-title>
        <v-card-text>
          <CreateGame :dialog="dialog" @click="handleCreateOrg"/>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.delete" max-width="50vw">
      <v-card>
        <v-card-title class="headline">{{ dialog.deleteConfimationText }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleDeleteCancel">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="handleDeleteConfirm(false)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.activate" max-width="50vw">
      <v-card>
        <v-card-title class="headline">{{ dialog.activateConfimationText }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleDeleteCancel">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="handleDeleteConfirm(true)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { errorStore } from '~/store'
import { $apiUser } from '~/utils/api'
import DataParser from '~/utils/data'
import { dateDisplayYYYYMMDDHHMMSS } from '~/utils/date'
import { numberWithCommas } from '~/utils/formatters'
import { httpResponseMapper } from '~/utils/http'
import Token from '~/utils/token'
import { getTrimmedAddressEllipsisMiddle, isConnected } from '~/utils/wallet'
import CreateUser from '~/components/CreateUser.vue'
import CreateGame from '~/components/CreateGame.vue'
import CreateOrg from '~/components/CreateOrg.vue'

@Component({
  layout: 'admin',
  components: {
    CreateUser,
    CreateGame,
    CreateOrg
  }
})
export default class Management extends Vue {
  private handleCreateItemOrg() {
    this.dialog.title = "Create Organization"
    this.dialog.createOrg = true
  }

  private handleCreateItemUser() {
    this.dialog.title = "Create User"
    this.dialog.createUser = true
  }

  private handleCreateItemGame() {
    this.dialog.title = "Create Game"
    this.dialog.createGame = true
  }

  private async handleCreateOrg(payload: any) {
    console.log(payload);
    this.dialog.step = 2
  }

  private async handleCreateUser(payload: any) {
    console.log(payload);
    this.dialog.step = 3
  }

  private async handleCreateGame(payload: any) {
    console.log(payload);
    this.handleCreateCancel()
  }

  private tab = {
    current: 0,
    items: [
      { key: 0, value: 'organizations', query: 'organizations' },
      { key: 1, value: 'users', query: 'users' },
      { key: 2, value: 'games', query: 'games' },
    ]
  }

  @Watch('tab.current', { immediate: true })
  private async onTabChange(newVal: number) {
    // TODO
  }

  private async handleSendEth() {
    this.dialog.isDirectDeduct = false
    const { address: from } = await isConnected()
    const transactionParameters = {
      // nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
      gas: '0x2710', // customizable by user during MetaMask confirmation.
      to: this.form.wallet_address, // Required except during contract publications.
      from, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      // data:
      //   '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
      // chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    }

    try {
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      // @ts-ignore
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })
    } catch {

    }
  }

  private getDateText(val: string) {
    return dateDisplayYYYYMMDDHHMMSS(val)
  }

  private getAccessLevelText(val: string) {
    const _find = DataParser.accessLevelList.find((item) => item.value === val)
    if (_find) {
      return `${_find.text}(${_find.value})`
    }
    return 'N/A'
  }

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headersOrg: Array<any> = [
    { text: '#', value: 'id', align: 'start', sortable: true },
    { text: 'Name', value: 'name', align: 'start', sortable: true, filterable: true },
    // { text: 'Permission', value: 'access_level', align: 'start', sortable: true, filterable: false },
    { text: 'Organization Type', value: 'type', align: 'start', sortable: true, filterable: false },
    { text: 'Active', value: 'isActive', align: 'start', sortable: true, filterable: false },
    { text: 'Misc', value: 'misc', align: 'start', sortable: false, filterable: false }
  ]

  private headersUser: Array<any> = [
    { text: '#', value: 'id', align: 'start', sortable: true },
    { text: 'Organization', value: 'orgName', align: 'start', sortable: true, filterable: false },
    { text: 'Name', value: 'username', align: 'start', sortable: true, filterable: true },
    { text: 'Role', value: 'role', align: 'start', sortable: true, filterable: false },
    { text: 'Active', value: 'isActive', align: 'start', sortable: true, filterable: false },
    { text: 'Misc', value: 'misc', align: 'start', sortable: false, filterable: false }
  ]

  private headersGame: Array<any> = [
    { text: '#', value: 'id', align: 'start', sortable: true },
    { text: 'Organization', value: 'orgName', align: 'start', sortable: true, filterable: false },
    { text: 'Logo', value: 'orgName', align: 'start', sortable: false, filterable: false },
    { text: 'Name', value: 'username', align: 'start', sortable: true, filterable: true },
    // { text: 'Permalink', value: 'role', align: 'start', sortable: true, filterable: true },
    { text: 'Active', value: 'isActive', align: 'start', sortable: true, filterable: false },
    { text: 'Misc', value: 'misc', align: 'start', sortable: false, filterable: false }
  ]

  private tableDataOrg: any[] = []

  private tableDataUser: any[] = []

  private tableDataGame: any[] = []

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['email', 'last_login'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private form: any = {
    acount: '',
    role: '',
    org: '',
    password: '',
    name: '',
    isActive: true
  }

  private dialog: any = {
    isEditMode: false,
    isDirectDeduct: false,
    activateConfimationText: 'Activate this account?',
    activate: false,
    deleteConfimationText: 'Deactivate this account?',
    delete: false,
    error: false,
    errorTitle: 'Server Error. Please try again later.',
    new: false,
    title: 'Edit User',
    selectPayment: false,
    selectPaymentText: 'Select Payment Type',
    step: 1,
    createOrg: false,
    createUser: false,
    createGame: false
  }

  private handleRowClick(row: any, col: any) {
    const { id, email, access_level, wallet_address } = row
    this.form.id = id
    this.form.accessLevel = access_level
    this.form.email = email
    this.form.wallet_address = wallet_address
    this.dialog.isEditMode = true
    this.dialog.new = true
    this.dialog.title = 'Edit Artist Account'
  }

  private handleDeleteItem({ id, allowed_login_status }: { id: string, allowed_login_status: string }): void {
    this.form.id = id
    if (allowed_login_status) {
      this.dialog.delete = true
    } else {
      this.dialog.activate = true
    }
  }

  private clearForm(): void {
    this.form = {
      acount: '',
      role: '',
      org: '',
      password: '',
      name: '',
      isActive: true
    }
  }

  private handleCreateItem(): void {
    this.dialog.new = true
    this.dialog.isEditMode = false
    this.dialog.title = 'Create'
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.dialog.isEditMode = false
    this.dialog.createOrg = false
    this.dialog.createUser = false
    this.dialog.createGame = false
    this.clearForm()
  }

  private async handleCreateSave() {
    const { email, wallet_address, id } = this.form
    if (this.dialog.isEditMode) {
      const _payload = {
        user_id: id,
        wallet_address
      }
      const result = await $apiUser.post('/member/artists', _payload, { headers: { authorization: `Bearer ${Token.getValue()}` } })
      httpResponseMapper(result)
    } else {
      const _payload = {
        email,
        accessLevel: '5'
      }
      const result = await $apiUser.post('/admin/member', _payload, { headers: { authorization: `Bearer ${Token.getValue()}` } })
      httpResponseMapper(result)
    }
    if (errorStore.isActive) {
      this.snackbar.text = `Account creation failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await this.init()
      this.snackbar.text = 'Account creation success'
      this.dialog.new = false
      this.dialog.isEditMode = false
      this.clearForm()
    }
    this.snackbar.toggle = true
  }

  private async handleDeleteConfirm(flag: boolean) {
    const result = await $apiUser.post('/admin/member', {
      action: 'status',
      id: this.form.id,
      value: flag
    })
    httpResponseMapper(result)
    const _snackbarText = this.dialog.delete ? 'Deactivate' : 'Activate'
    if (errorStore.isActive) {
      this.snackbar.text = `${_snackbarText} Account Failure.`
      errorStore.clearError()
    } else {
      await this.init()
      this.clearForm()
      this.dialog.activate = false
      this.dialog.delete = false
      this.snackbar.text = `${_snackbarText} Account Success.`
    }
    this.snackbar.toggle = true
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.dialog.activate = false
    this.dialog.isEditMode = false
    this.clearForm()
  }

  private async getUsers() {
    const _req = await $apiUser.get('/member/artists', {
      headers: {
        authorization: `Bearer ${Token.getValue()}`
      }
    })
    return httpResponseMapper(_req)?.data
  }

  private async init() {
    const _rows = await this.getUsers()
    if (_rows && _rows.length) {
      this.tableData = [..._rows].map((item) => ({
        ...item,
        balance_total_display: numberWithCommas(item.balance_total),
        cumulative_earnings_display: numberWithCommas(item.cumulative_earnings),
        wallet_address_display: getTrimmedAddressEllipsisMiddle(item.wallet_address)
      }))
    } else {
      this.tableData = []
    }
  }

  private async created() {
    await this.init()
  }
}
</script>
