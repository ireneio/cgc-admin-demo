<template>
<div class="w-100" style="height: calc(100vh + 48px + 56px);">
  <v-container fluid>
    <v-row>
      <v-col cols="12" style="position:fixed;top:48px;left:0;z-index:2;background-color:#fff;padding:0;">
        <div style="padding-top:1px;padding-bottom:1px;background-color:teal;color:white;">
          <marquee-text :repeat="1" :duration="30">
            <!-- {{ dialog.errorText }} -->
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum id omnis repudiandae delectus autem cumque, fuga nobis deleniti quam voluptate, quaerat sapiente? Ullam ad voluptatem quaerat ab assumenda aperiam provident.
          </marquee-text>
        </div>
        <v-card
          height="45vh"
          width="100%"
          fixed
          rounded="0"
        >
           直播畫面
        </v-card>
      </v-col>
      <v-col
        cols="12"
        style="margin-top:calc(45vh + 48px + 10px);padding-top:0;padding-bottom:0;"
        v-show="tabCurrent === 1"
      >
        <v-row class="px-0">
          <v-col cols="12">
            <div class="d-flex w-100 pb-2" style="border-bottom:1px solid #eee;">
              <span class="d-flex align-center">
                <span class="grey--text">遊戲狀態: </span>
                <span class="ml-2 teal--text">{{ gameStatusText }}</span>
              </span>
              <span class="ml-auto d-flex align-center">
                <v-icon class="grey--text">mdi-account-multiple</v-icon>
                <span class="ml-2">65</span>
              </span>
            </div>
          </v-col>
          <v-col cols="6" class="py-1">
            <div class="w-100">
              <v-chip label color="teal" style="min-width:calc(22% - 12px);">
                <span class="white--text">莊</span>
              </v-chip>
              <v-chip label color="teal" style="min-width:calc(78% - 12px);">
                <v-icon class="white--text" small>mdi-currency-usd</v-icon>
                <span class="white--text">{{ gameInfo.poolHost.toFixed(0) }}</span>
              </v-chip>
            </div>
          </v-col>
          <v-col cols="6" class="py-1 d-flex">
            <v-chip label color="teal" style="min-width:calc(100%);">
              <span class="white--text">上莊費</span>
              <v-icon class="white--text" small>mdi-currency-usd</v-icon>
              <span class="white--text">{{ gameInfo.hostFee.toFixed(0) }}</span>
            </v-chip>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-chip label color="teal" style="min-width:100%;">
              <span class="white--text">最高下注(玩家): </span>
              <v-icon class="white--text" small>mdi-currency-usd</v-icon>
              <span class="white--text">{{ gameInfo.threshold.toFixed(0) }}</span>
            </v-chip>
          </v-col>
          <v-subheader class="py-1 mx-0 my-0" style="height:auto;">當前剩餘下注額度</v-subheader>
          <v-col
            cols="12"
            class="py-1"
            v-for="item in sideBetDetailMap"
            :key="item.label"
          >
            <div>
              <v-chip
                label
                color="primary"
              >
              {{ item.label }}
              </v-chip>
              <v-chip
                label
                color="info"
                style="min-width:150px;"
              >
                <v-icon class="white--text" small>mdi-currency-usd</v-icon>
                <span class="white--text">
                  {{ item.value }}
                </span>
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-bottom-sheet v-model="sheet.toggle">
      <v-sheet
        class="text-center pb-1"
        height="auto"
      >
        <v-btn
          class="mt-0"
          text
          small
          color="dark"
          block
          @click="sheet.toggle = !sheet.toggle"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <v-row class="px-4 py-0" v-show="!loading.placeBet">
          <v-col cols="9" class="py-0">
            <v-text-field
              type="number"
              prepend-icon="mdi-currency-usd"
              color="teal"
              x-large
              hint="請輸入下注金額"
              v-model="form.amount"
              style="padding-top:0;"
              :error="isAmountError"
              :disabled="loading.placeBet || !playerBetAllow || side === 'cohost'"
              validate-on-blur
            >
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-btn text color="primary" small disabled class="mt-0">00:00</v-btn>
          </v-col>
        </v-row>
        <v-row class="px-4 py-0" v-show="!loading.placeBet">
          <v-col cols="2" class="py-2">
            <v-btn
              :color="sideColor(sideMap.a)"
              :large="screenWidth > 320"
              :disabled="loading.placeBet || !playerBetAllow"
              block
            >
              <div class="white--text" @click="side = sideMap.a">A</div>
            </v-btn>
          </v-col>
          <v-col cols="2" class="py-2">
            <v-btn
              :color="sideColor(sideMap.b)"
              :large="screenWidth > 320"
              :disabled="loading.placeBet || !playerBetAllow"
              block
            >
              <div class="white--text" @click="side = sideMap.b">B</div>
            </v-btn>
          </v-col>
          <v-col cols="2" class="py-2">
            <v-btn
              :color="sideColor(sideMap.c)"
              :large="screenWidth > 320"
              :disabled="loading.placeBet || !playerBetAllow"
              block
            >
              <div class="white--text" @click="side = sideMap.c">C</div>
            </v-btn>
          </v-col>
          <v-col cols="3" class="py-2">
            <v-btn
              :color="sideColor(sideMap.cohost)"
              :large="screenWidth > 320"
              :disabled="loading.placeBet || !playerBetAllow"
              block
            >
              <div class="white--text" @click="handleSelectSide('cohost')">配莊</div>
            </v-btn>
          </v-col>
          <v-col cols="3" class="py-2">
            <v-btn
              :color="sideColor(sideMap.host)"
              :large="screenWidth > 320"
              :disabled="loading.placeBet || playerBetAllow"
              block
            >
              <div class="white--text" @click="side = sideMap.host">排莊</div>
            </v-btn>
          </v-col>
          <v-col cols="12" class="py-2">
            <v-btn
              color="error"
              :large="screenWidth > 320"
              @click="handlePlaceBet"
              :disabled="loading.placeBet || isSideError || isAmountError"
              block
            >
              <v-icon>mdi-cash-multiple</v-icon>
              <div class="white--text">&nbsp;下注</div>
            </v-btn>
          </v-col>
        </v-row>
        <div
          class="d-flex align-center justify-center"
          style="height:238px;width:100%;"
          v-if="loading.placeBet"
        >
          <v-progress-circular
            :size="50"
            color="teal"
            indeterminate
            v-show="loading.placeBet"
          ></v-progress-circular>
        </div>
      </v-sheet>
    </v-bottom-sheet>
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
  <v-btn
    color="teal"
    fab
    dark
    bottom
    right
    fixed
    style="z-index:3;margin-bottom:50px;"
    @click="sheet.toggle = !sheet.toggle"
  >
    <v-icon>mdi-gamepad-variant</v-icon>
  </v-btn>
</div>

</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import MarqueeText from 'vue-marquee-text-component'
import { authStore, errorStore, sysStore, userStore } from '~/store'
import { $apiFe } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'
import { init, sendMessage } from '~/utils/ws'

@Component({
  layout: 'frontend',
  components: {
    MarqueeText
  }
})
export default class V1Index extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 5000,
    closeText: '關閉',
    text: ''
  }

  private sheet = {
    toggle: false
  }

  private dialog = {
    errorConfirm: false,
    errorText: ''
  }

  private side: string = ''

  private sideMap = {
    a: 'a',
    b: 'b',
    c: 'c',
    cohost: 'cohost',
    host: 'host'
  }

  private get sideBetDetailMap() {
    const { poolA, poolB, poolC, threshold } = sysStore.gameInfo
    const limit = threshold.toFixed(0)
    const poolALeft = (threshold - poolA).toFixed(0)
    const poolBLeft = (threshold - poolB).toFixed(0)
    const poolCLeft = (threshold - poolC).toFixed(0)
    return [
      { label: 'A位', name: 'a', value: poolALeft, limit },
      { label: 'B位', name: 'b', value: poolBLeft, limit },
      { label: 'C位', name: 'c', value: poolCLeft, limit }
    ]
  }

  private sideColor(val: string) {
    return val === this.side ? 'warning' : 'teal'
  }

  private loading = {
    placeBet: false
  }

  private form = {
    amount: 1
  }

  private get isAmountError(): boolean {
    return this.form.amount.toString().includes('.') || this.form.amount <= 0
  }

  private get isSideError(): boolean {
    return this.side === ''
  }

  private get screenWidth(): number {
    return window.innerWidth
  }

  private get currentRoundId(): string {
    return sysStore.currentRoundId
  }

  private get userInfo() {
    return authStore.info
  }

  private handleSelectSide(side: string) {
    switch (side) {
      case 'cohost':
        this.side = this.sideMap.cohost
        this.form.amount = this.gameInfo.poolHost
        break
      case 'a':
        this.side = this.sideMap.a
        this.form.amount = 1
        break
      case 'b':
        this.side = this.sideMap.b
        this.form.amount = 1
        break
      case 'c':
        this.side = this.sideMap.c
        this.form.amount = 1
        break
    }
  }

  private async handlePlaceBet() {
    if (this.isAmountError) {
      this.snackbar.text = '請輸入 > 0 的整數'
    } else if (this.isSideError) {
      this.snackbar.text = '請選擇下注對象'
    } else {
      this.loading.placeBet = true
      const createPlayerResult = await $apiFe.post('/bet/player', {
        side: this.side,
        userId: this.userInfo.id,
        roundId: this.currentRoundId
      })

      const data = httpResponseMapper(createPlayerResult)
      if (errorStore.isActive) {
        this.snackbar.text = '下注失敗: 系統錯誤'
        errorStore.clearError()
      } else {
        const { id: pid } = data
        const makeBetResult = await $apiFe.post('/bet', {
          amount: this.form.amount,
          userId: this.userInfo.id,
          roundId: this.currentRoundId,
          playerId: pid
        })
        httpResponseMapper(makeBetResult)
        if (errorStore.isActive) {
          if (errorStore.message === 'host has not maken bet yet') {
            this.snackbar.text = '下注失敗: 莊家尚未下注'
          } else if (errorStore.message === 'bet exceeds limit') {
            this.snackbar.text = '下注失敗: 金額大於剩餘額度'
          } else {
            this.snackbar.text = '下注失敗: 系統錯誤'
          }
          errorStore.clearError()
        } else {
          this.side = ''
          this.snackbar.text = '下注成功'
        }
      }
      this.loading.placeBet = false
    }
    this.snackbar.toggle = true
  }

  private hostBet: number = 0

  private async getRoundDetail() {
    const result = await $apiFe.get(`/bet/round/${this.currentRoundId}`)
    const data = httpResponseMapper(result)
    if (data && data.hostBet === 0) {
      this.dialog.errorText = '等待莊家下注中'
      this.dialog.errorConfirm = true
    }
  }

  private get tabCurrent(): number {
    return userStore.tabCurrent
  }

  private ws: WebSocket | null = null

  private wsInit() {
    this.ws = init()
    const self = this.ws
    this.ws.onopen = () => {
      // self.send(JSON.stringify({ message: 'game-lobby-join' }))
      sendMessage(self, { message: 'game-lobby-join', data: { userId: this.userInfo.id } })
    }
  }

  private get playerBetAllow(): boolean {
    return sysStore.playerBetAllow
  }

  private get gameStatusText(): string {
    if (!sysStore.playerBetAllow) {
      return '等待莊家下注中'
    } else if (sysStore.playerBetAllow) {
      return '玩家下注中'
    }
    return ''
  }

  private get gameInfo() {
    return sysStore.gameInfo
  }

  private async created() {
    await sysStore.getConfig()
    if (this.currentRoundId === '') {
      this.dialog.errorText = '遊戲尚未開始'
      this.dialog.errorConfirm = true
    } else {
      await this.getRoundDetail()
    }
    this.wsInit()
  }
}
</script>
