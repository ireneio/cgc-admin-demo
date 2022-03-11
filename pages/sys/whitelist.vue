<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Email Whitelist</h2>
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
              <template v-slot:top>
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
import { Component, Vue } from 'nuxt-property-decorator'
import { errorStore, userStore } from '~/store'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Component({
  layout: 'admin'
})
export default class SysWhitelist extends Vue {
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
    { text: 'Status', value: 'status', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private tableData: any[] = []

  // private get tableData(): any[] {
  //   return this._tableData
  // }

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['status'],
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

  private async handleCreateSave() {
    const result = await $apiUser.post('/admin/whitelist', { ...this.form })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `Account creation failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await this.initWhiteList()
      this.snackbar.text = 'Account creation success'
      this.dialog.new = false
      this.clearForm()
    }
    this.snackbar.toggle = true
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

  private async getWhitelist() {
    const _result = await $apiUser.get('/admin/whitelist')
    return httpResponseMapper(_result).data
  }

  private async initWhiteList() {
    const rows = await this.getWhitelist()
    this.tableData = [...rows]
  }

  private async created() {
    await this.initWhiteList()
  }
}
</script>
