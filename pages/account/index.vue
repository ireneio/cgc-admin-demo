<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>登入</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon>mdi-code-tags</v-icon>
            </v-toolbar>
            <validation-observer v-slot="{ invalid }">
              <v-card-text>
                <v-form>
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      label="帳號"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
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
                      v-model="form.password"
                      :error="errors.length > 0"
                      :hint="errors.length ? errors[0] : ''"
                      @keydown.enter="handleSignIn(invalid ? false : true)"
                    ></v-text-field>
                  </validation-provider>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :disabled="invalid"
                  @click="handleSignIn"
                >
                  登入
                </v-btn>
              </v-card-actions>
            </validation-observer>
          </v-card>
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
import { authStore, errorStore } from '~/store'

@Component({
  layout: 'login',
  // middleware: ['auth'],
  components: {
    ValidationObserver,
    ValidationProvider
  }
})
export default class AccountIndex extends Vue {
  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: '關閉',
    text: ''
  }

  private form: any = {
    username: '',
    password: ''
  }

  private async handleSignIn(valid?: boolean): Promise<void> {
    // if (!valid) return
    const result = await authStore.getTokenLocal({
      password: this.form.password,
      email: this.form.username
    })
    if (errorStore.isActive) {
      this.snackbar.text = '登入資訊錯誤'
      errorStore.clearError()
    } else {
      this.snackbar.text = '登入成功'
      this.$router.push('/')
    }
    this.snackbar.toggle = true
  }
}
</script>
