<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">User Accounts</h2>
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
                  label="搜尋帳號或暱稱"
                  class="mx-4"
                ></v-text-field>
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
                              counter="12"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.password"
                              label="密碼"
                              counter="12"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.description"
                              label="暱稱"
                              counter="30"
                            ></v-text-field>
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
                <v-dialog v-model="dialog.fundConfirm" max-width="50vw" persistent>
                  <v-card>
                    <v-card-title class="headline">{{ dialog.fundConfirmText }}</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog.fundConfirm = false">取消</v-btn>
                      <v-btn color="blue darken-1" text @click="handleAddFundConfirm">確認</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog
                  v-model="dialog.detail"
                  max-width="90vw"
                  max-height="70vh"
                  persistent
                >
                  <v-card>
                    <v-card-title>
                      <v-tabs
                        v-model="tab.current"
                      >
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab
                          v-for="item in tab.items"
                          :key="item.key"
                        >
                          {{ item.value }}
                        </v-tab>
                      </v-tabs>
                    </v-card-title>
                    <!-- <v-card-title>
                      <span>{{ dialog.detailTitle }}</span>
                    </v-card-title> -->
                    <v-card-text v-show="tab.current === 0">
                      <v-row v-show="!isUpdateInfoLoading">
                        <!-- <v-col
                          cols="12"
                        >
                          <v-text-field
                            v-model="form.password"
                            label="密碼"
                            counter="12"
                          ></v-text-field>
                        </v-col> -->
                        <v-col
                          cols="12"
                        >
                          <v-text-field
                            v-model="form.description"
                            label="暱稱"
                            counter="30"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-btn color="primary" @click="handleUpdate">更新</v-btn>
                        </v-col>
                      </v-row>
                      <v-row v-show="isUpdateInfoLoading">
                        <v-col cols="12">
                          <div class="d-flex justify-center w-100 align-center" style="height: 200px;">
                            <v-progress-circular
                              indeterminate
                              color="primary"
                            ></v-progress-circular>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-subtitle class="mt-4" v-show="!fundLoading && tab.current === 1">
                      <v-btn
                        color="success"
                        @click="handleAddFund(true)"
                        v-show="!dialog.detailInput"
                      >
                        <v-icon>mdi-plus</v-icon> 充值
                      </v-btn>
                      <v-btn
                        class="ml-2"
                        color="error"
                        @click="handleAddFund(false)"
                        v-show="!dialog.detailInput"
                      >
                        <v-icon>mdi-close</v-icon> 扣除
                      </v-btn>
                      <v-text-field
                        @input="handleFund"
                        :value="fund"
                        label="充值額度"
                        hint="僅限 > 0 的整數"
                        :error="isFundInputError"
                        v-show="dialog.detailInput"
                      ></v-text-field>
                      <!-- <div v-show="dialog.detailInput">
                        <v-chip
                          class="mb-2 mr-2"
                          v-for="(item, index) in fundList"
                          :key="index"
                          :color="fund.split(',').join('') === item ? 'success' : 'default'"
                          @click="handleFund(item)"
                        >
                          {{ item }}
                        </v-chip>
                      </div> -->
                      <v-btn
                        class="mt-2"
                        color="primary"
                        @click="handleAddFundProceed"
                        v-show="dialog.detailInput"
                        :disabled="isFundInputError"
                      >
                        確認
                      </v-btn>
                      <v-btn
                        class="mt-2 ml-2"
                        color="default"
                        @click="handleAddFundCancel"
                        v-show="dialog.detailInput"
                      >
                        取消
                      </v-btn>
                    </v-card-subtitle>
                    <v-card-subtitle v-show="fundLoading && tab.current === 1">
                      <div class="d-flex justify-center w-100 mt-4">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </div>
                    </v-card-subtitle>
                    <v-card-text v-show="!fundLoading && tab.current === 1">
                      <v-simple-table>
                        <template v-slot:default>
                          <tbody>
                            <tr
                              v-for="(value, key) of walletInfoMap"
                              :key="key"
                            >
                              <td>{{ key }}</td>
                              <td>
                                <div>{{ value }}</div>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="handleWalletInfoClose"
                      >
                        關閉
                      </v-btn>
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
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { errorStore, userStore } from '~/store'
import { $api } from '~/utils/api'
import { numberWithCommas, numberWithDollarSign } from '~/utils/formatters'
import { httpResponseMapper } from '~/utils/http'
import { isPositiveInteger } from '~/utils/number'

@Component({
  layout: 'admin'
})
export default class MemberIndex extends Vue {
  private tab = {
    current: 0,
    items: [
      { key: '0', value: '基本資訊' },
      { key: '1', value: '錢包資訊' }
    ]
  }

  @Watch('tab.current', { immediate: true })
  private onTabChange(newVal: number) {
    this.dialog.detailTitle = this.tab.items[newVal].value
  }

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: '關閉',
    text: ''
  }

  private headers: Array<any> = [
    // { text: '識別碼', value: 'id', align: 'start', sortable: true, filterable: false },
    { text: '暱稱', value: 'description', align: 'start', sortable: true },
    { text: '帳號', value: 'email', align: 'start', sortable: true },
    // { text: '剩餘額度(支)', value: 'balance_total', align: 'start', sortable: true, filterable: false },
    { text: '剩餘額度(局)', value: 'balance_total_raw', align: 'start', sortable: true, filterable: false },
    // { text: '權限等級', value: 'access_level', align: 'start', sortable: true, filterable: false },
    { text: '狀態', value: 'status', align: 'start', sortable: true, filterable: false },
    { text: '最後登入', value: 'last_login', align: 'start', sortable: true, filterable: false },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): any[] {
    return userStore.users
  }

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['last_login'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private form: any = {
    id: '',
    username: '',
    perm: '',
    password: '',
    description: ''
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
    detail: false,
    detailInput: false,
    detailTitle: '錢包資訊',
    fundConfirm: false,
    fundConfirmText: '確認儲值: 0',
    error: false,
    errorTitle: 'Server Error. Please try again later.'
  }

  private get walletInfo(): any {
    if (userStore.wallets.length) {
      const { balance_total: balanceTotal, id, status } = userStore.wallets[0]
      return {
        balance_total_raw: numberWithCommas(balanceTotal),
        balance_total: Number(balanceTotal),
        id,
        status
      }
    }
    return {
      balance_total: 0,
      balance_total_raw: '$0',
      id: '',
      status: false
    }
  }

  private get walletInfoMap() {
    const { balance_total: balanceTotal, id, status, balance_total_raw: balanceTotalRaw } = this.walletInfo
    return {
      // 識別碼: id,
      // '額度(支)': balanceTotal,
      '額度(局)': balanceTotalRaw
      // 狀態: status ? '啟用' : '停用'
    }
  }

  private fund: string = this.fundList[0]

  private get fundList(): any[] {
    return [
      '10',
      '20',
      '50',
      '100',
      '200',
      '500',
      '1000',
      '2000',
      '5000',
      '10000',
      '20000',
      '50000'
    ]
  }

  private fundLoading: boolean = false

  private get isFundInputError(): boolean {
    const _serialized = this.fund.split(',').join('')
    return isPositiveInteger(_serialized)
  }

  private get isInsufficientFundError(): boolean {
    const input = Number(this.fund.split(',').join(''))
    return !this.fundType && input > this.walletInfo.balance_total
  }

  private handleFund(val: string) {
    const _serialized = val.split(',').join('')
    this.fund = isNaN(Number(_serialized)) ? val : numberWithCommas(Number(_serialized))
  }

  private fundType: boolean = true

  private handleAddFund(type: boolean) {
    this.fundType = type
    this.dialog.detailInput = true
  }

  private handleAddFundProceed() {
    if (this.fundType) {
      this.dialog.fundConfirmText = `確認儲值: ${this.fund} (局)`
    } else {
      this.dialog.fundConfirmText = `確認扣除: ${this.fund} (局)`
    }
    this.dialog.fundConfirm = true
  }

  private async handleAddFundConfirm() {
    if (this.isInsufficientFundError) {
      this.snackbar.text = '無法調降額度至 0 以下'
      this.snackbar.toggle = true
      return
    }
    if (!this.isFundInputError) {
      this.dialog.fundConfirm = false
      this.fundLoading = true
      const requestBody = {
        walletId: this.walletInfo.id,
        amount: this.fund.includes(',') ? Number(this.fund.split(',').join('')) : Number(this.fund),
        direction: this.fundType
      }
      const result = await $api.post('/transaction', requestBody)
      httpResponseMapper(result)
      await userStore.getWallets(this.currentUserId)
      this.fundLoading = false
      this.fund = this.fundList[0]
      this.dialog.detailInput = false
      if (this.fundType) {
        this.snackbar.text = '充值成功'
      } else if (!this.fundType) {
        this.snackbar.text = '扣除成功'
      }
      this.snackbar.toggle = true
      await userStore.getUsers()
    }
  }

  private handleAddFundCancel() {
    this.fund = this.fundList[0]
    this.dialog.detailInput = false
  }

  private handleWalletInfoClose() {
    this.dialog.detail = false
    this.currentUserId = ''
    this.dialog.detailInput = false
    this.fund = this.fundList[0]
  }

  private currentUserId: string = ''

  private async handleRowClick(row: any, col: any): Promise<void> {
    const { id, description } = row
    this.dialog.detail = true
    await userStore.getWallets(id)
    this.currentUserId = id
    this.form.description = description
    this.form.id = id
  }

  private isUpdateInfoLoading: boolean = false

  private async handleUpdate() {
    const { id, description } = this.form
    if (description.length > 30) {
      this.snackbar.text = '大於字數限制'
      this.snackbar.toggle = true
      return
    }
    this.isUpdateInfoLoading = true
    const result = await $api.post('/user', { id, description, action: 'update' })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `更新帳號失敗: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await userStore.getUsers()
      this.snackbar.text = '更新帳號成功'
    }
    this.snackbar.toggle = true
    this.isUpdateInfoLoading = false
  }

  private clearForm(): void {
    this.form = {
      id: '',
      username: '',
      perm: '',
      password: '',
      description: ''
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
    if (this.form.description.length > 30) {
      this.snackbar.text = '大於字數限制'
      this.snackbar.toggle = true
      return
    }
    const result = await $api.post('/user', { ...this.form, perm: '2', action: 'create' })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `建立帳號失敗: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await userStore.getUsers()
      this.snackbar.text = '建立帳號成功'
      this.dialog.new = false
      this.clearForm()
    }
    this.snackbar.toggle = true
  }

  private async handleDeleteConfirm(flag: boolean) {
    await $api.post('/user', { id: this.form.id, action: flag ? 'activate' : 'delete' })
    if (errorStore.isActive) {
      this.snackbar.text = '操作失敗'
      errorStore.clearError()
    } else {
       await userStore.getUsers()
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
    this.clearForm()
  }

  private async created() {
    // await userStore.getUsers()
  }
}
</script>
