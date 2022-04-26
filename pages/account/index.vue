<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title
                class="d-flex justify-center align-center"
              >
                <img src="/logo.png" alt="logo" width="32px" />
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon>mdi-code-tags</v-icon>
            </v-toolbar>
            <validation-observer v-slot="{ invalid }">
              <v-card-text>
                <v-form>
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      label="Account"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
                      :error="errors.length > 0"
                      :hint="errors.length ? errors[0] : ''"
                      v-model="form.username"
                      disabled
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      id="password"
                      label="Password"
                      name="password"
                      prepend-icon="mdi-lock"
                      type="password"
                      v-model="form.password"
                      :error="errors.length > 0"
                      :hint="errors.length ? errors[0] : ''"
                      @keydown.enter="handleSignIn(invalid ? false : true)"
                      disabled
                    ></v-text-field>
                  </validation-provider>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-menu
                  v-model="menuSetting.i18nValue"
                  :disabled="menuSetting.disabled"
                  :absolute="menuSetting.absolute"
                  :open-on-hover="menuSetting.openOnHover"
                  :close-on-click="menuSetting.closeOnClick"
                  :close-on-content-click="menuSetting.closeOnContentClick"
                  :offset-x="menuSetting.offsetX"
                  :offset-y="menuSetting.offsetY"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" class="ml-2" v-bind="attrs" v-on="on" :style="{ width: '150px' }">
                      {{ $vuetify.lang.current === 'zhHant' ? '繁體中文' : $vuetify.lang.current }}
                    </v-btn>
                  </template>
                  <v-list style="padding:0;margin:0;">
                    <v-list-item v-for="(value, key) of $vuetify.lang.locales" :key="key.toString()" style="cursor:pointer;padding:0;">
                      <v-btn
                        text
                        :color="key === $vuetify.lang.current ? 'primary' : 'default'"
                        style="width:100%;"
                        @click="handleI18nUpdate(key)"
                      >
                        {{ key === 'zhHant' ? '繁體中文' : key.toUpperCase() }}
                        </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-spacer></v-spacer>
                <v-btn
                  color="info"
                  :disabled="invalid"
                  @click="handleSignInArtist"
                  x-large
                >
                  <img src='https://developers-dot-devsite-v2-prod.appspot.com/identity/sign-in/g-normal.png' alt='google_sign_in' />
                  <span class="ml-2">artist sign in</span>
                </v-btn>
                <v-btn
                  color="success"
                  :disabled="false"
                  @click="handleSignIn"
                  x-large
                  v-if="isNonce"
                >
                  <img src='https://developers-dot-devsite-v2-prod.appspot.com/identity/sign-in/g-normal.png' alt='google_sign_in' />
                  <span class="ml-2">sign in</span>
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
import { $apiUser } from '~/utils/api'
import { Firebase } from '~/utils/firebase'
import { httpResponseMapper } from '~/utils/http'
import Token from '~/utils/token'
import { uuid } from 'vue-uuid'

const isValidUuid = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

@Component({
  layout: 'login',
  // middleware: ['auth'],
  components: {
    ValidationObserver,
    ValidationProvider
  }
})
export default class AccountIndex extends Vue {
  private getNonce () {
    return this.$route?.query?.nonce
  }

  private isNonce = false

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private form: any = {
    username: '',
    password: ''
  }

  private showError () {
    this.snackbar.text = 'invalid credentials'
    this.snackbar.toggle = true
    Token.removeValue()
    return
  }

  private async artistRegister (token: string) {
    const _reg = await $apiUser.post('/member/artists/registration', {}, { headers: { authorization: `Bearer ${token}` } })
    const _regRes = httpResponseMapper(_reg)
    return _regRes
  }

  private async artistSignIn (token: string) {
    const _signIn = await $apiUser.post('/member/artists/signIn', {}, { headers: { authorization: `Bearer ${token}` } })
    const _signInRes = httpResponseMapper(_signIn)
    return _signInRes
  }

  private async handleSignInArtist(type: string): Promise<void> {
    const token = await Firebase.signIn({ email: '', password: '' }, 'google')
    try {
      if (token) {
        const _regRes = await this.artistRegister(token)
        if (_regRes?.error && _regRes?.error.includes('account already exist')) {
           const _signInRes = await this.artistSignIn(token)
           if (_signInRes?.error) {
              this.showError()
              return
           }
        } else if (_regRes?.error) {
          this.showError()
          return
        }
        Token.setValue(token)
        this.$router.push('/')
      }
    } catch (e: unknown) {
      // console.log('Error: ' + String(e))
    }
  }

  private async handleFirebaseSignIn(type: string): Promise<void> {
    const token = await Firebase.signIn({ email: '', password: '' }, 'google')
    try {
      if (token) {
        const _signIn = await $apiUser.post('/admin/creation', {}, { headers: { authorization: `Bearer ${token}` } })
        const _signInResult = httpResponseMapper(_signIn)
        if (_signInResult?.error) {
          this.snackbar.text = 'invalid credentials'
          this.snackbar.toggle = true
          Token.removeValue()
          return
        }
        Token.setValue(token)
        this.$router.push('/')
      }
    } catch (e: unknown) {
      // console.log('Error: ' + String(e))
    }
  }

  private async handleSignIn(): Promise<void> {
    await this.handleFirebaseSignIn('google')
  }

  private getLangFromLs(): void {
    const lang = window.localStorage.getItem('lang')
    if (lang) {
      this.$vuetify.lang.current = lang
    } else {
      window.localStorage.setItem('lang', 'en')
    }
  }

  private menuSetting: any = {
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' }
    ],
    disabled: false,
    absolute: false,
    openOnHover: false,
    value: false,
    i18nValue: false,
    closeOnClick: true,
    closeOnContentClick: false,
    offsetX: false,
    offsetY: true
  }

  private handleI18nUpdate(localeStr: string): void {
    this.$vuetify.lang.current = localeStr
    this.menuSetting.i18nValue = false
    localStorage.setItem('lang', localeStr)
  }

  private mounted() {
    const _nonce = this.getNonce()
    if (isValidUuid.test(String(_nonce))) {
      this.isNonce = true
    }
    this.getLangFromLs()
  }
}
</script>
