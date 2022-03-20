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
              <template v-slot:item.access_level="{ item }">
                {{ item.access_level === '6' ? 'Root' : 'Admin' }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status? 'success': 'warning'"
                >
                  {{ item.status ? 'Enabled' : 'Disabled' }}
                </v-chip>
              </template>
              <template v-slot:item.misc="{ item }">
                <v-chip @click.stop="handleDeleteItem(item)">
                  <v-icon small>
                    {{ item.status ? 'mdi-stop' : 'mdi-play' }}
                  </v-icon>
                </v-chip>
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
                  disabled
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
import { errorStore, userStore } from '~/store'
import { $apiUser } from '~/utils/api'
import DataParser from '~/utils/data'
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
    // { text: 'Access Level', value: 'access_level', align: 'start', sortable: true },
    { text: 'Created At', value: 'created_at', align: 'start', sortable: true },
    { text: 'Status', value: 'status', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private tableData: any[] = []

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

  private selectPerm: Array<any> = DataParser.accessLevelListAdmin

  private form: any = {
    id: '',
    email: '',
    accessLevel: '6'
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
      email: '',
      accessLevel: '6'
    }
  }

  private handleCreateItem(): void {
    this.dialog.new = true
  }

  private handleDeleteItem({ id, status }: { id: string, status: string }): void {
    this.form.id = id
    if (status) {
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
      await this.init()
      this.snackbar.text = 'Account creation success'
      this.dialog.new = false
      this.clearForm()
    }
    this.snackbar.toggle = true
  }

  private async handleDeleteConfirm(flag: boolean) {
    const result = await $apiUser.post('/admin/whitelist', {
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

  private async getWhitelist() {
    const _result = await $apiUser.get('/admin/whitelist')
    return httpResponseMapper(_result).data
  }

  private async init() {
    const rows = await this.getWhitelist()
    this.tableData = [...rows]
  }

  private async created() {
    await this.init()
  }
}
</script>
