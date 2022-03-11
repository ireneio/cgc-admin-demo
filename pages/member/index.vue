<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">User Accounts</h2>
        <v-card outlined>
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
    <v-dialog v-model="dialog.delete" max-width="50vw">
      <v-card>
        <v-card-title class="headline">{{ dialog.deleteConfimationText }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleDeleteCancel">cancel</v-btn>
          <v-btn color="blue darken-1" text @click="handleDeleteConfirm(false)">confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.activate" max-width="50vw">
      <v-card>
        <v-card-title class="headline">{{ dialog.activateConfimationText }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleDeleteCancel">cancel</v-btn>
          <v-btn color="blue darken-1" text @click="handleDeleteConfirm(true)">confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { errorStore } from '~/store'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'
import Token from '~/utils/token'

@Component({
  layout: 'admin'
})
export default class MemberIndex extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'Email', value: 'email', align: 'start', sortable: true },
    { text: 'Active', value: 'allowed_login_status', align: 'start', sortable: true, filterable: false },
    { text: 'Permission', value: 'access_level', align: 'start', sortable: true, filterable: false },
    { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false },
    { text: 'Last Login', value: 'last_login', align: 'start', sortable: true, filterable: false },
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
    id: ''
  }

  private dialog: any = {
    activateConfimationText: 'Activate this account?',
    activate: false,
    deleteConfimationText: 'Deactivate this account?',
    delete: false,
    error: false,
    errorTitle: 'Server Error. Please try again later.'
  }

  private async handleRowClick(row: any, col: any): Promise<void> {
    const { id, email } = row
    this.form.id = id
  }

  private handleDeleteItem({ id, status }: { id: string, status: string }): void {
    this.form.id = id
    if (status) {
      this.dialog.delete = true
    } else {
      this.dialog.activate = true
    }
  }

  private clearForm(): void {
    this.form = {
      id: ''
    }
  }

  // private handleCreateItem(): void {
  //   this.dialog.new = true
  // }

  // private handleCreateCancel(): void {
  //   this.dialog.new = false
  //   this.clearForm()
  // }

  // private async handleCreateSave() {
  //   if (this.form.description.length > 30) {
  //     this.snackbar.text = '大於字數限制'
  //     this.snackbar.toggle = true
  //     return
  //   }
  //   const result = await $apiUser.post('/user', { ...this.form, perm: '2', action: 'create' })
  //   httpResponseMapper(result)
  //   if (errorStore.isActive) {
  //     this.snackbar.text = `建立帳號失敗: ${errorStore.message}`
  //     errorStore.clearError()
  //   } else {
  //     await userStore.getUsers()
  //     this.snackbar.text = '建立帳號成功'
  //     this.dialog.new = false
  //     this.clearForm()
  //   }
  //   this.snackbar.toggle = true
  // }

  private async handleDeleteConfirm(flag: boolean) {
    const _req = await $apiUser.post(`/admin/user/info?id=${this.form.id}`, { fieldName: 'allowed_login_status', value: flag })
    httpResponseMapper(_req)
    if (errorStore.isActive) {
      this.snackbar.text = 'Update user info failure.'
      errorStore.clearError()
    } else {
      this.clearForm()
      this.dialog.activate = false
      this.dialog.delete = false
      this.snackbar.text = 'Update user info success.'
      await this.init()
    }
    this.snackbar.toggle = true
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
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
