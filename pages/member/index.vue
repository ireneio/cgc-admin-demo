<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">User Accounts</h2>
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
                  label="Search ID, Email"
                  class="mx-4"
                ></v-text-field>
              </template>
              <template v-slot:item.id="{ item }">
                <v-layout justify-end>
                  {{ item.id }}
                </v-layout>
              </template>
              <template v-slot:item.access_level="{ item }">
                {{ getAccessLevelText(item.access_level) }}
              </template>
              <template v-slot:item.allowed_login_status="{ item }">
                <v-chip
                  :color="item.allowed_login_status ? 'success': 'warning'"
                >
                  {{ item.allowed_login_status ? 'Enabled' : 'Disabled' }}
                </v-chip>
              </template>
              <template v-slot:item.created_at="{ item }">
                {{ getDateText(item.created_at) }}
              </template>
               <template v-slot:item.last_login="{ item }">
                {{ getDateText(item.last_login) }}
              </template>
              <template v-slot:item.misc="{ item }">
                <v-icon
                  small
                  @click.stop="handleDeleteItem(item)"
                >
                  {{ item.allowed_login_status ? 'mdi-stop' : 'mdi-play' }}
                </v-icon>
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
          <span class="headline">{{ form.id === '' ? dialog.newTitle : dialog.editTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  counter="50"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-select
                  v-model="form.accessLevel"
                  :items="selectPerm"
                  label="Permission"
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
import { Component, Vue } from 'nuxt-property-decorator'
import { errorStore } from '~/store'
import { $apiUser } from '~/utils/api'
import DataParser from '~/utils/data'
import { dateDisplayYYYYMMDDHHMMSS } from '~/utils/date'
import { httpResponseMapper } from '~/utils/http'
import Token from '~/utils/token'

@Component({
  layout: 'admin'
})
export default class MemberIndex extends Vue {
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

  private selectPerm: Array<any> = DataParser.accessLevelList

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'Email', value: 'email', align: 'start', sortable: true },
    { text: 'Permission', value: 'access_level', align: 'start', sortable: true, filterable: false },
    { text: 'Last Login', value: 'last_login', align: 'start', sortable: true, filterable: false },
    { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false },
    { text: 'Active', value: 'allowed_login_status', align: 'start', sortable: true, filterable: false },
    { text: 'Misc', value: 'misc', align: 'start', sortable: false, filterable: false }
  ]

  private tableData: any[] = []

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['email', 'permission', 'last_login'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private form: any = {
    email: '',
    accessLevel: '',
    id: ''
  }

  private dialog: any = {
    isEditMode: false,
    activateConfimationText: 'Activate this account?',
    activate: false,
    deleteConfimationText: 'Deactivate this account?',
    delete: false,
    error: false,
    errorTitle: 'Server Error. Please try again later.',
    new: false
  }

  private handleRowClick(row: any, col: any) {
    const { id, email, access_level } = row
    this.form.id = id
    this.form.accessLevel = access_level
    this.form.email = email
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
      email: '',
      accessLevel: '',
      id: ''
    }
  }

  private handleCreateItem(): void {
    this.dialog.new = true
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.dialog.isEditMode = false
    this.clearForm()
  }

  private async handleCreateSave() {
    const { accessLevel, email } = this.form
    const _payload = {
      email,
      accessLevel
    }
    const result = await $apiUser.post('/admin/member', _payload)
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `Account creation failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await this.init()
      this.snackbar.text = 'Account creation success'
      this.dialog.new = false
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
    const _req = await $apiUser.get('/member', {
      headers: {
        authorization: `Bearer ${Token.getValue()}`
      }
    })
    return httpResponseMapper(_req)?.data
  }

  private async init() {
    const _rows = await this.getUsers()
    if (_rows && _rows.length) {
      this.tableData = [..._rows]
    } else {
      this.tableData = []
    }
  }

  private async created() {
    await this.init()
  }
}
</script>
