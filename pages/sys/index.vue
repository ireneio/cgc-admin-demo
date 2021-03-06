<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Admin Accounts</h2>
        <v-card outlined>
          <!-- <v-toolbar flat>
            <v-btn
              color="primary"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
          </v-toolbar> -->
          <v-card-text class="pt-0">
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
            >
              <template v-slot:item.access_level="{ item }">
                {{ item.access_level === '6' ? 'Root' : 'Admin' }}
              </template>
              <template v-slot:item.misc="{ item }">
                <v-icon
                  small
                  @click.stop="handleDeleteItem(item)"
                >
                {{ item.status === '啟用' ? 'mdi-stop' : 'mdi-play' }}
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
  </v-container>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Vue } from 'nuxt-property-decorator'
import { errorStore, userStore } from '~/store'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'
import Token from '~/utils/token'

@Component({
  layout: 'admin'
})
export default class SysIndex extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'Email', value: 'email', align: 'start', sortable: true },
    { text: 'Access Level', value: 'access_level', align: 'start', sortable: true },
    { text: 'Created At', value: 'created_at', align: 'start', sortable: true },
    // { text: 'Status', value: 'status', align: 'start', sortable: true },
    // { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private tableData: any[] = []

  // private get tableData(): any[] {
  //   return this._tableData
  // }

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['created_at'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private selected: Array<any> = []

  private singleSelect: boolean = false

  private selectPerm: Array<any> = [
    {
      text: 'Root',
      value: '6'
    },
    {
      text: 'Admin',
      value: '5'
    }
  ]

  private form: any = {
    email: '',
    accessLevel: ''
  }

  private dialog: any = {
    activateConfimationText: 'Enable this account?',
    activate: false,
    deleteConfimationText: 'Disable this account?',
    delete: false,
    edit: false,
    editTitle: 'Edit Account',
    new: false,
    newTitle: 'Create Account',
    error: false,
    errorTitle: 'Server Error. Please try again later.'
  }

  private handleRowClick(row: any, col: any): void {
    // this.handleEditItem(row)
  }

  private clearForm(): void {
    this.form = {
      id: '',
      username: '',
      perm: '',
      password: ''
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
    this.clearForm()
  }

  private async handleDeleteConfirm(flag: boolean) {
    // const result = await $apiUser.post('/user/admin', { id: this.form.id, action: flag ? 'activate' : 'delete' })
    // httpResponseMapper(result)
    // if (errorStore.isActive) {
    //   this.snackbar.text = 'error'
    //   errorStore.clearError()
    // } else {
    //   await userStore.getAdminUsers()
    //   if (flag) {
    //     this.dialog.activate = false
    //   } else {
    //     this.dialog.delete = false
    //   }
    //   this.clearForm()
    //   this.snackbar.text = 'success'
    // }
    // this.snackbar.toggle = true
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.dialog.activate = false
    this.clearForm()
  }

  private async getAccounts() {
    const _result = await $apiUser.get('/admin', { headers: { authorization: `Bearer ${Token.getValue()}` } })
    return httpResponseMapper(_result).data
  }

  private async init() {
    const rows = await this.getAccounts()
    this.tableData = [...rows].map((item) => ({
      ...item,
      created_at: moment(item.created_at).toLocaleString()
    }))
  }

  private async created() {
    await this.init()
  }
}
</script>
