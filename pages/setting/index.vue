<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">遊戲設定</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              :color="formOption.isEdit ? 'warning' : 'primary'"
              @click="handleEdit"
            >
              <v-icon v-if="!formOption.isEdit">mdi-playlist-edit</v-icon>
              <v-icon v-if="formOption.isEdit">mdi-close</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              @click="handleUpdate"
              v-show="formOption.isEdit"
              class="ml-4"
            >
              <v-icon>mdi-edit</v-icon> 更新
            </v-btn>
          </v-toolbar>
          <v-card-subtitle class="d-flex align-center">
            遊戲狀態:&nbsp;
            <v-chip
              class="ml-2"
              outlined
              :color="isRoundActive ? 'primary' : 'default'"
            >
              {{ roundStatusText }}
            </v-chip>
          </v-card-subtitle>
          <v-card-text>
            <!-- <v-form ref="form"> -->
              <v-row>
                <v-col>
                  <v-combobox
                    v-model="form.hostFee"
                    :items="form.hostFee"
                    :search-input.sync="formOption.hostFeeSearchOption"
                    hide-selected
                    hint="輸入新選項來新增漲幅幅度 (僅限 > 0 整數)"
                    label="底注漲幅"
                    multiple
                    persistent-hint
                    chips
                    :disabled="!formOption.isEdit"
                    :error="isHostFeeError"
                  >
                  </v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="底注漲幅輪數"
                    v-model="form.hostFeeIncreaseIterations"
                    hint="僅限 > 0 整數"
                    :disabled="!formOption.isEdit"
                    :error="isPositiveInt(form.hostFeeIncreaseIterations)"
                  ></v-text-field>
                </v-col>
                 <v-col>
                  <v-text-field
                    label="玩家人數限制"
                    v-model="form.allowedMaxPlayers"
                    hint="僅限 > 0 整數"
                    :disabled="!formOption.isEdit"
                    :error="isPositiveInt(form.allowedMaxPlayers)"
                  ></v-text-field>
                </v-col>
                 <v-col>
                  <v-text-field
                    label="配莊人數限制"
                    v-model="form.allowedCoHosts"
                    hint="僅限 > 0 整數"
                    :disabled="!formOption.isEdit"
                    :error="isPositiveInt(form.allowedCoHosts)"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="每輪莊家次數"
                    v-model="form.roundsPerMatch"
                    hint="僅限 > 0 整數"
                    :disabled="!formOption.isEdit"
                    :error="isPositiveInt(form.roundsPerMatch)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="最低下注 (莊家)"
                    v-model="form.minHostBet"
                    hint="僅限 > 0 整數"
                    :disabled="!formOption.isEdit"
                    :error="isPositiveInt(form.minHostBet)"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="最低下注 (玩家)"
                    v-model="form.minPlayerBet"
                    hint="僅限整數"
                    :disabled="!formOption.isEdit"
                    :error="isInt(form.minPlayerBet)"
                  ></v-text-field>
                </v-col>
              </v-row>
            <!-- </v-form> -->
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
import { errorStore, sysStore } from '~/store'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'
import { isInteger, isPositiveInteger } from '~/utils/number'

@Component({
  layout: 'admin'
})
export default class SettingIndex extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 5000,
    closeText: '關閉',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'Name', value: 'calories', align: 'start', sortable: true },
    { text: 'Type', value: 'carbs', align: 'start', sortable: true },
    { text: 'Status', value: 'carbs', align: 'start', sortable: true },
    { text: 'Memo', value: 'carbs', align: 'start', sortable: false },
    { text: 'Misc', value: 'carbs', align: 'start', sortable: false }
  ]

  private form = {
    allowedCoHosts: 0,
    allowedMaxPlayers: 0,
    hostFee: [],
    minHostBet: 0,
    minPlayerBet: 0,
    roundsPerMatch: 0,
    version: '',
    hostFeeIncreaseIterations: 0
  }

  private formOption = {
    isEdit: false
  }

  private isPositiveInt(val: string) {
    return isPositiveInteger(val)
  }

  private isInt(val: string) {
    return isInteger(val)
  }

  private get isRoundActive(): boolean {
    return sysStore.isRoundActive
  }

  private get roundStatusText(): string {
    return sysStore.isRoundActive ? '進行中' : '已結束'
  }

  private get isHostFeeError(): boolean {
    const errArr = this.form.hostFee.map((item) => this.isPositiveInt(item))
    return errArr.includes(true)
  }

  private handleEdit() {
    if (sysStore.isRoundActive) {
      this.snackbar.text = '遊戲進行中，無法編輯'
      this.snackbar.toggle = true
      return
    }
    if (this.formOption.isEdit) {
      this.formHelper()
    }
    this.formOption.isEdit = !this.formOption.isEdit
  }

  private formHelper() {
    const hostFee = this.list.hostFee.map((item: number) => item.toString())
    this.form = {
      ...this.list,
      hostFee
    }
  }

  private get list(): any {
    return sysStore.settingList
  }

  private async updateSetting(): Promise<void> {
    const result = await $api.post('/setting?id=60b2747875c3d0d42a0a6a35', { ...this.form })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `儲存失敗: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await sysStore.getSettingList()
      this.formHelper()
      this.snackbar.text = '儲存成功'
      this.formOption.isEdit = false
    }
    this.snackbar.toggle = true
  }

  private async handleUpdate() {
    await this.updateSetting()
  }

  private async created() {
    await Promise.all([
      sysStore.getSettingList(),
      sysStore.getConfig()
    ])
    this.formHelper()
  }
}
</script>
