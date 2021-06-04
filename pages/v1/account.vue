<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" v-if="!toggle.loginLocal">
          <v-btn color="teal" block x-large @click="handleLoginLocalToggle">
            <div class="white--text">本地登入</div>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="8" v-if="!toggle.loginLocal">
          <v-btn color="teal" block x-large>LINE 登入</v-btn>
        </v-col>
        <v-col v-if="toggle.loginLocal">
          <validation-observer v-slot="{ invalid }">
            <v-card-text>
              <v-form>
                <validation-provider v-slot="{ errors }" rules="required">
                  <v-text-field
                    label="帳號"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    color="teal"
                    :error="errors.length > 0"
                    :hint="errors.length ? errors[0] : ''"
                    v-model="form.username"
                  ></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" rules="required">
                  <v-text-field
                    id="password"
                    label="密碼"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    color="teal"
                    v-model="form.password"
                    :error="errors.length > 0"
                    :hint="errors.length ? errors[0] : ''"
                    @keydown.enter="handleLoginLocal"
                  ></v-text-field>
                </validation-provider>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col cols="12" sm="8">
                  <v-btn
                    block
                    x-large
                    color="teal"
                    :disabled="invalid"
                    @click="handleLoginLocal"
                  >
                    <div class="white--text">登入</div>
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-btn
                    block
                    x-large
                    color="grey"
                    @click="toggle.loginLocal = false"
                  >
                    <div class="white--text">返回</div>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </validation-observer>
        </v-col>
      </v-row>
    </v-container>
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
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { authStore, errorStore, sysStore } from '~/store'

@Component({
  layout: 'frontendLogin',
  components: {
    ValidationObserver,
    ValidationProvider
  }
})
export default class V1Account extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 5000,
    closeText: '關閉',
    text: ''
  }

  private toggle = {
    loginLocal: false
  }

  private form = {
    username: '',
    password: ''
  }

  private handleLoginLocalToggle() {
    this.toggle.loginLocal = true
  }

  private async handleLoginLocal() {
    const result = await authStore.getTokenLocalUser({
      password: this.form.password,
      email: this.form.username
    })
    if (errorStore.isActive) {
      this.snackbar.text = '登入資訊錯誤'
      errorStore.clearError()
    } else {
      this.snackbar.text = '登入成功'
      this.$router.push('/v1')
    }
    this.snackbar.toggle = true
  }

  private async created() {
  }
}
</script>
