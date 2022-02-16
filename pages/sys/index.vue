<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Admin Accounts</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              color="primary"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Add
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
                  max-width="90vw"
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
                              v-model="form.username"
                              label="帳號"
                              counter="50"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.password"
                              label="密碼"
                              counter="50"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-select
                              v-model="form.perm"
                              :items="selectPerm"
                              label="權限等級"
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
                        取消
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="handleCreateSave"
                      >
                        儲存
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialog.delete" max-width="50vw">
                  <v-card>
                    <v-card-title class="headline">{{ dialog.deleteConfimationText }}</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="handleDeleteCancel">取消</v-btn>
                      <v-btn color="blue darken-1" text @click="handleDeleteConfirm(false)">確認</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialog.activate" max-width="50vw">
                  <v-card>
                    <v-card-title class="headline">{{ dialog.activateConfimationText }}</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="handleDeleteCancel">取消</v-btn>
                      <v-btn color="blue darken-1" text @click="handleDeleteConfirm(true)">確認</v-btn>
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
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Component({
  layout: 'admin'
})
export default class SysIndex extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: '關閉',
    text: ''
  }

  private headers: Array<any> = [
    { text: '帳號', value: 'email', align: 'start', sortable: true },
    { text: '權限等級', value: 'access_level', align: 'start', sortable: true },
    { text: '建立日期', value: 'created_at', align: 'start', sortable: true },
    { text: '狀態', value: 'status', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): any[] {
    return userStore.adminUsers
  }

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
      text: '後台管理員',
      value: '6'
    },
    {
      text: '管理員',
      value: '5'
    }
  ]

  private form: any = {
    id: '',
    username: '',
    perm: '',
    password: ''
  }

  private dialog: any = {
    activateConfimationText: '確認啟用此帳號',
    activate: false,
    deleteConfimationText: '確認停用此帳號',
    delete: false,
    edit: false,
    editTitle: 'Edit Account',
    new: false,
    newTitle: '建立帳號',
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
    const result = await $api.post('/user/admin', { ...this.form, action: 'create' })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `建立帳號失敗: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await userStore.getAdminUsers()
      this.snackbar.text = '建立帳號成功'
      this.dialog.new = false
      this.clearForm()
    }
    this.snackbar.toggle = true
  }

  private async handleDeleteConfirm(flag: boolean) {
    const result = await $api.post('/user/admin', { id: this.form.id, action: flag ? 'activate' : 'delete' })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = '操作失敗'
      errorStore.clearError()
    } else {
      await userStore.getAdminUsers()
      if (flag) {
        this.dialog.activate = false
      } else {
        this.dialog.delete = false
      }
      this.clearForm()
      this.snackbar.text = '操作成功'
    }
    this.snackbar.toggle = true
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.dialog.activate = false
    this.clearForm()
  }

  private async created() {
    // await userStore.getAdminUsers()
  }
}
</script>
