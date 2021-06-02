<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">遊戲紀錄操作</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              color="primary"
              @click="handleCreateRound"
              :disabled="isRoundActive || isCreateRoundLoading"
            >
              <v-icon v-show="!isCreateRoundLoading">mdi-plus</v-icon>
              <v-progress-circular
                indeterminate
                :width="3"
                :size="20"
                color="primary"
                v-show="isCreateRoundLoading"
              ></v-progress-circular>
              <span>&nbsp;建立遊戲</span>
            </v-btn>
          </v-toolbar>
          <v-card-subtitle>遊戲狀態:&nbsp;{{ roundStatusText }}</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col>
                <v-switch
                  v-model="form[key]"
                  :label="`${formLabelMap[key]}: ${labelTextResult(value)}`"
                  color="success"
                  :disabled="!isRoundActive"
                  v-for="(value, key) of form"
                  :key="key"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="success"
                  @click="handleSendResultConfirm"
                  :disabled="!isRoundActive"
                >
                  <v-icon>mdi-send</v-icon>&nbsp;提交
                </v-btn>
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
          <v-simple-table>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog.sendConfirm = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="handleSendResult">確認</v-btn>
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
import { sysStore } from '~/store'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Component({
  layout: 'default'
})
export default class RecordIndex extends Vue {
  private dialog = {
    sendConfirm: false,
    sendConfirmText: '確認提交'
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

  private get roundStatusText(): string {
    return sysStore.isRoundActive ? '進行中' : '已結束'
  }

  private labelTextResult(val: boolean): string {
    return val ? '贏' : '輸'
  }

  private isCreateRoundLoading: boolean = false

  private isSendResultLoading: boolean = false

  private async handleCreateRound() {
    this.isCreateRoundLoading = true
    const result = await $api.post('/bet/round')
    httpResponseMapper(result)
    await sysStore.getConfig()
    this.isCreateRoundLoading = false
    this.snackbar.text = '成功建立遊戲'
    this.snackbar.toggle = true
  }

  private handleSendResultConfirm() {
    // const resultA = this.labelTextResult(this.form.switch1)
    // const resultB = this.labelTextResult(this.form.switch2)
    // const resultC = this.labelTextResult(this.form.switch3)
    // this.dialog.sendConfirmText = `確認提交: A位 ${resultA}, B位 ${resultB}, C位 ${resultC}`
    this.dialog.sendConfirm = true
  }

  private handleSendResult() {
    this.isSendResultLoading = true
    this.resetForm()
    this.dialog.sendConfirm = false
    this.snackbar.text = '成功提交結果'
    this.snackbar.toggle = true
  }

  private async created() {
    await Promise.all([
      sysStore.getSettingList(),
      sysStore.getConfig()
    ])
  }
}
</script>
