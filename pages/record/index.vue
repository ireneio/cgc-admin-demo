<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">遊戲操作</h2>
        <v-card outlined>
          <v-toolbar flat class="d-flex">
            <v-btn
              color="primary"
              @click="handleCreateRound"
              :disabled="isRoundActive || loading.isCreateRound || loading.isResetRound"
            >
              <v-icon v-show="!loading.isCreateRound">mdi-plus</v-icon>
              <v-progress-circular
                indeterminate
                :width="3"
                :size="20"
                color="primary"
                v-show="loading.isCreateRound"
              ></v-progress-circular>
              <span>&nbsp;建立</span>
            </v-btn>
            <v-btn
              class="ml-2"
              color="primary"
              @click="handleResetRoundConfirm"
              :disabled="!isRoundActive || loading.isCreateRound || loading.isResetRound"
            >
              <v-icon v-show="!loading.isResetRound">mdi-refresh</v-icon>
              <v-progress-circular
                indeterminate
                :width="3"
                :size="20"
                color="primary"
                v-show="loading.isResetRound"
              ></v-progress-circular>
              <span>&nbsp;重置</span>
            </v-btn>
            <!-- <v-btn
              class="ml-2"
              color="info"
              @click="toggle.isShowUpdateHost = ! toggle.isShowUpdateHost"
            >
              <v-icon v-show="!toggle.isShowUpdateHost">mdi-chevron-down</v-icon>
              <v-icon v-show="toggle.isShowUpdateHost">mdi-chevron-up</v-icon>
              <span>設置</span>
            </v-btn> -->
          </v-toolbar>
          <v-card-subtitle class="d-flex align-center">
            <v-row>
              <v-col cols="12">
                遊戲狀態:&nbsp;
                <v-chip
                  class="ml-2"
                  outlined
                  :color="isRoundActive ? isAllowBet ? 'success' : 'error' : 'default'"
                >
                  {{ roundStatusText }}
                </v-chip>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="success"
                  @click="handleHostWait"
                  :disabled="!isRoundActive || loading.isHostWait || roundStatus !== 'round-init'"
                >
                  <v-progress-circular
                    indeterminate
                    :width="3"
                    :size="20"
                    color="white"
                    v-show="loading.isHostWait"
                  ></v-progress-circular>
                  <span v-show="!loading.isHostWait">開放排莊</span>
                </v-btn>
                <v-btn
                  class="ml-2"
                  color="success"
                  @click="handleHostSelect"
                  :disabled="!isRoundActive || loading.isHostSelect || roundStatus !== 'round-host-wait'"
                >
                  <v-progress-circular
                    indeterminate
                    :width="3"
                    :size="20"
                    color="white"
                    v-show="loading.isHostSelect"
                  ></v-progress-circular>
                  <span v-show="!loading.isHostSelect">
                    設置上莊
                    {{ roundStatus === 'round-host-bet' ? '(已下注)' : roundStatus === 'round-host-select' ? '(未下注)' : '' }}
                  </span>
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="success"
                  @click="handleCohostWait"
                  :disabled="!isRoundActive || loading.isCohostWait || roundStatus !== 'round-host-bet'"
                >
                  <v-progress-circular
                    indeterminate
                    :width="3"
                    :size="20"
                    color="white"
                    v-show="loading.isCohostWait"
                  ></v-progress-circular>
                  <span v-show="!loading.isCohostWait">開放配莊</span>
                </v-btn>
                <v-btn
                  class="ml-2"
                  color="error"
                  @click="handleCohostSelect"
                  :disabled="!isRoundActive || loading.isCohostSelect || roundStatus !== 'round-cohost-wait'"
                >
                  <v-progress-circular
                    indeterminate
                    :width="3"
                    :size="20"
                    color="white"
                    v-show="loading.isCohostSelect"
                  ></v-progress-circular>
                  <span v-show="!loading.isCohostSelect">停止配莊</span>
                </v-btn>
              </v-col>
              <v-col cols="12">
                 <v-btn
                  color="success"
                  @click="handleAllowBet(true)"
                  :disabled="!isRoundActive || loading.isPlayerBetAllow || roundStatus !== 'round-cohost-select'"
                >
                  <v-progress-circular
                    indeterminate
                    :width="3"
                    :size="20"
                    color="white"
                    v-show="loading.isPlayerBetAllow"
                  ></v-progress-circular>
                  <span v-show="!loading.isPlayerBetAllow">開放玩家下注</span>
                </v-btn>
                <v-btn
                  class="ml-2"
                  color="error"
                  @click="handleAllowBet(false)"
                  :disabled="!isRoundActive || loading.isPlayerBetDisallow || roundStatus !== 'player-bet-allow'"
                >
                  <v-progress-circular
                    indeterminate
                    :width="3"
                    :size="20"
                    color="white"
                    v-show="loading.isPlayerBetDisallow"
                    :disabled="!isRoundActive || loading.isPlayerBetDisallow"
                  ></v-progress-circular>
                  <span v-show="!loading.isPlayerBetDisallow">鎖盤</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-row>
                  <v-col>
                    <v-switch
                      v-model="form[key]"
                      :label="`${formLabelMap[key]}: ${labelTextResult(value)}`"
                      color="info"
                      :disabled="!isRoundActive || roundStatus !== 'player-bet-disallow'"
                      v-for="(value, key) of form"
                      :key="key"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="info"
                          @click="handleSendResultConfirm"
                          :disabled="!isRoundActive || roundStatus !== 'player-bet-disallow'"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-send</v-icon>&nbsp;提交
                        </v-btn>
                      </template>
                      <span>提交後將結束遊戲</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="8">
                <v-card v-show="toggle.isShowUpdateHost">
                  <v-card-title>手動設置玩家</v-card-title>
                  <v-card-subtitle>輸入玩家識別碼進行設置</v-card-subtitle>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="識別碼"
                          v-model="formSetHost.userId"
                          :disabled="!isRoundActive"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <span>類型</span>
                        <v-chip
                          class="ml-2"
                          v-for="item in playerTypeList"
                          :key="item.value"
                          @click="formSetHost.type = item.value"
                          :color="item.value === formSetHost.type ? 'info' : 'default'"
                        >
                          {{ item.label }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-btn
                          color="info"
                          @click="handleUpdateHostConfirm"
                          :disabled="!isRoundActive || loading.isUpdateHost"
                        >
                          <v-icon v-show="!loading.isUpdateHost">mdi-content-save-edit-outline</v-icon>
                          <v-progress-circular
                            indeterminate
                            :width="3"
                            :size="20"
                            color="info"
                            v-show="loading.isUpdateHost"
                          ></v-progress-circular>
                          <span>&nbsp;設置</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog.sendConfirm" max-width="50vw" persistent>
      <v-card>
        <v-card-title class="headline">{{ dialog.sendConfirmText }}</v-card-title>
        <v-card-text>
          <v-simple-table v-show="!loading.isSendResult">
            <template v-slot:default>
              <tbody>
                <tr
                  v-for="(value, key) of form"
                  :key="key"
                >
                  <td>{{ `${formLabelMap[key]}` }}</td>
                  <td>{{ `${labelTextResult(value)}` }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div
            class="d-flex w-100 justify-center align-center"
            style="height:150px;"
            v-if="loading.isSendResult"
          >
            <v-progress-circular
              indeterminate
              :width="3"
              :size="40"
              color="primary"
              v-show="loading.isSendResult"
            ></v-progress-circular>
          </div>
        </v-card-text>
        <v-card-actions v-show="!loading.isSendResult">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog.sendConfirm = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="handleSendResult">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.resetConfirm" max-width="50vw" persistent>
      <v-card>
        <v-card-title class="headline">{{ dialog.resetConfirmText }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog.resetConfirm = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="handleResetRound">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.updateHostConfirm" max-width="50vw" persistent>
      <v-card>
        <v-card-title class="headline">{{ dialog.updateHostConfirmText }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog.updateHostConfirm = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="handleUpdateHost">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { init, sendMessage } from '~/utils/ws'

@Component({
  layout: 'admin'
})
export default class RecordIndex extends Vue {
  private loading = {
    isCreateRound: false,
    isSendResult: false,
    isResetRound: false,
    isUpdateHost: false,
    isAllowBet: false,
    //
    isHostWait: false,
    isHostSelect: false,
    isCohostWait: false,
    isCohostSelect: false,
    isPlayerBetAllow: false,
    isPlayerBetDisallow: false
  }

  private toggle = {
    isShowUpdateHost: false
  }

  private dialog = {
    sendConfirm: false,
    sendConfirmText: '確認提交',
    resetConfirm: false,
    resetConfirmText: '確認重置遊戲',
    updateHostConfirm: false,
    updateHostConfirmText: '確認手動設置玩家'
  }

  private snackbar = {
    toggle: false,
    timeout: 5000,
    closeText: '關閉',
    text: ''
  }

  private form = {
    switch1: true,
    switch2: true,
    switch3: true
  }

  private resetForm() {
    this.form = {
      switch1: true,
      switch2: true,
      switch3: true
    }
  }

  private formLabelMap = {
    switch1: 'A位',
    switch2: 'B位',
    switch3: 'C位'
  }

  private config(): any {
    return sysStore.config
  }

  private get isRoundActive(): boolean {
    return sysStore.isRoundActive
  }

  private get currentRoundId(): string {
    return sysStore.currentRoundId
  }

  private get isAllowBet(): boolean {
    return sysStore.isAllowBet
  }

  private labelTextResult(val: boolean): string {
    return val ? '贏' : '輸'
  }

  private async handleCreateRound() {
    this.loading.isCreateRound = true
    const result = await $api.post('/bet/round')
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `建立遊戲失敗: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await $api.post('/config/set/status', { roundStatus: 'round-init' })
      await sysStore.getConfig()
      this.loading.isCreateRound = false
      this.snackbar.text = '建立遊戲成功'
    }
    this.snackbar.toggle = true
  }

  private handleSendResultConfirm() {
    this.dialog.sendConfirm = true
  }

  private async handleSendResult() {
    this.loading.isSendResult = true
    await $api.post('/config/set/status', { roundStatus: 'round-result-calculating' })
    const result = await $api.get(`/bet/round/result?roundId=${this.currentRoundId}`)
    httpResponseMapper(result)
    if (errorStore.isActive) {
      await $api.post('/config/set/status', { roundStatus: 'player-bet-disallow' })
      if (errorStore.message === 'round does not have a host') {
        this.snackbar.text = '提交結果失敗: 本局遊戲尚無莊家，無法結算'
        errorStore.clearError()
      } else {
        this.snackbar.text = `提交結果失敗: ${errorStore.message}`
      }
    } else {
      await $api.post('/config/set/status', { roundStatus: 'round-result' })
      await sysStore.getConfig()
      this.resetForm()
      this.dialog.sendConfirm = false
      this.snackbar.text = '提交結果成功'
    }
    this.snackbar.toggle = true
    this.loading.isSendResult = false
  }

  private handleResetRoundConfirm() {
    this.dialog.resetConfirm = true
  }

  private async handleResetRound() {
    this.loading.isResetRound = true
    const result = await $api.post('/config/reset')
    httpResponseMapper(result)
    if (errorStore.isActive) {
      this.snackbar.text = `重置遊戲失敗: ${errorStore.message}`
      errorStore.clearError()
    } else {
      await sysStore.getConfig()
      this.snackbar.text = '重置遊戲成功'
      this.dialog.resetConfirm = false
    }
    this.snackbar.toggle = true
    this.loading.isResetRound = false
  }

  private playerTypeList = [
    { label: '莊家', value: 'host' },
    { label: '配莊', value: 'cohost' },
    { label: 'A 位', value: 'a' },
    { label: 'B 位', value: 'b' },
    { label: 'C 位', value: 'c' }
  ]

  private formSetHost = {
    userId: '',
    type: 'host'
  }

  private resetFormSetHost() {
    this.formSetHost = {
      userId: '',
      type: 'host'
    }
  }

  private handleUpdateHostConfirm() {
    this.dialog.updateHostConfirm = true
  }

  private async handleUpdateHost() {
    this.dialog.updateHostConfirm = false
    this.loading.isUpdateHost = true
    const { userId, type: side } = this.formSetHost
    const result = await $api.post('/bet/player', {
      side,
      userId,
      roundId: this.currentRoundId
    })
    httpResponseMapper(result)
    if (errorStore.isActive) {
      if (errorStore.message === 'host already exists') {
        this.snackbar.text = '設置失敗: 本局遊戲已存在莊家'
      } else if (errorStore.message === 'userId does not exist') {
        this.snackbar.text = '設置失敗: 玩家識別碼不存在'
      } else if (errorStore.message === 'userId is banned') {
        this.snackbar.text = '設置失敗: 玩家帳號已停用'
      } else if (errorStore.message === 'userId already is a player in this round') {
        this.snackbar.text = '設置失敗: 玩家已存在於本局遊戲'
      } else {
        this.snackbar.text = '設置失敗'
      }
      errorStore.clearError()
    } else {
      this.snackbar.text = '設置成功'
      this.resetFormSetHost()
    }
    this.loading.isUpdateHost = false
    this.snackbar.toggle = true
  }

  private get roundStatusTextMap(): { [index: string]: string } {
    return {
      'round-halt': '遊戲未開始',
      'round-init': '遊戲開始，等待中',
      'round-host-wait': '等待上莊',
      'round-host-select': '等待莊家下注中',
      'round-host-bet': '莊家已下注',
      'round-cohost-wait': '配莊中',
      'round-cohost-select': '停止配莊，等待允許玩家下注',
      'player-bet-allow': '下注中',
      'player-bet-disallow': '下注結束，等待結算',
      'round-result-calculating': '結算中',
      'round-result': '已結算'
    }
  }

  private get roundStatusText(): string {
    return this.roundStatusTextMap[this.roundStatus]
  }

  private get roundStatus() {
    return sysStore.config.roundStatus
  }

  private async actionResulthelper() {
    if (errorStore.isActive) {
      this.snackbar.text = '操作失敗'
      errorStore.clearError()
    } else {
      await sysStore.getConfig()
      this.snackbar.text = '操作成功'
    }
    this.snackbar.toggle = true
  }

  private async sendSetConfigStatusRequest(roundStatus: string) {
    const result = await $api.post('/config/set/status', { roundStatus })
    httpResponseMapper(result)
    await this.actionResulthelper()
  }

  private async handleHostWait() {
    this.loading.isHostWait = true
    await this.sendSetConfigStatusRequest('round-host-wait')
    this.loading.isHostWait = false
  }

  private async handleHostSelect() {
    this.loading.isHostSelect = true
    await this.sendSetConfigStatusRequest('round-host-select')
    this.loading.isHostSelect = false
  }

  private async handleCohostWait() {
    this.loading.isCohostWait = true
    await this.sendSetConfigStatusRequest('round-cohost-wait')
    this.loading.isCohostWait = false
  }

  private async handleCohostSelect() {
    this.loading.isCohostSelect = true
    await this.sendSetConfigStatusRequest('round-cohost-select')
    this.loading.isCohostSelect = false
  }

  private async handleAllowBet(val: boolean) {
    if (val) {
      this.loading.isPlayerBetAllow = true
    } else {
      this.loading.isPlayerBetDisallow = true
    }
    const roundStatus = val ? 'player-bet-allow' : 'player-bet-disallow'
    await this.sendSetConfigStatusRequest(roundStatus)
    if (val) {
      this.loading.isPlayerBetAllow = false
    } else {
      this.loading.isPlayerBetDisallow = false
    }
  }

  private ws: WebSocket | null = null

  private wsInit() {
    this.ws = init()
  }

  private async created() {
    await Promise.all([
      sysStore.getSettingList(),
      sysStore.getConfig()
    ])

    this.wsInit()
  }
}
</script>
