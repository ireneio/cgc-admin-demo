<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Update Password</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon>mdi-code-tags</v-icon>
            </v-toolbar>
            <validation-observer v-slot="{ invalid }">
              <v-card-text>
                <v-form>
                  <!-- <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      label="Username"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
                      :error="errors.length > 0"
                      :hint="errors.length ? errors[0] : ''"
                      v-model="form.username"
                    ></v-text-field>
                  </validation-provider> -->
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      label="Old Password"
                      name="login"
                      prepend-icon="mdi-lock"
                      type="password"
                      :error="errors.length > 0"
                      :hint="errors.length ? errors[0] : ''"
                      v-model="form.oldPassword"
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|password:@confirm"
                  >
                    <v-text-field
                      id="password"
                      label="New Password"
                      name="password"
                      prepend-icon="mdi-lock"
                      type="password"
                      :error="errors.length > 0"
                      :hint="errors.length ? errors[0] : ''"
                      v-model="form.password"
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="confirm"
                    vid="confirm"
                    rules="required"
                  >
                    <v-text-field
                      id="rpPassword"
                      label="Confirm New Password"
                      name="rpPassword"
                      prepend-icon="mdi-lock"
                      type="password"
                      :error="errors.length > 0"
                      :hint="errors.length ? errors[0] : ''"
                      v-model="form.repeatPassword"
                      @keydown.enter="handleUpdatePassword"
                    ></v-text-field>
                  </validation-provider>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  :disabled="invalid"
                  @click="handleUpdatePassword"
                >
                  Submit
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="default" text @click="$router.push('/')">
                  Cancel
                </v-btn>
              </v-card-actions>
            </validation-observer>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="errorDialog" width="800px">
      <v-card>
        <v-card-title class="primary white--text">
          Hint
        </v-card-title>
        <v-card-text class="mt-4">
          <h2 class="mt-4">Server Error. Please try again later.</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="errorDialog = false" large>
            <strong>Close</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { $api } from '~/utils/api'
import { authStore } from '~/store'

@Component({
  layout: 'login',
  components: {
    ValidationObserver,
    ValidationProvider
  }
})
export default class AccountUpdatePassword extends Vue {
  private errorDialog: boolean = false

  private handleDialogClose(): void {
    this.errorDialog = false
  }

  private form: any = {
    username: '',
    oldPassword: '',
    password: '',
    repeatPassword: ''
  }

  private async handleUpdatePassword(): Promise<any> {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Auth/UpdatePassword',
      method: 'post',
      token: this.$cookies.get('accessToken'),
      data: {
        acct: this.form.username,
        _newpassword: this.form.password,
        _confirmpassword: this.form.repeatPassword,
        token: this.form.oldPassword
      }
    }

    try {
      this.$nuxt.$loading.start()
      const result: ResponseObject = await $api.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          this.form = {
            email: '',
            oldPassword: '',
            password: '',
            repeatPassword: ''
          }
          break
        default:
          throw new Error('Error fetching')
      }
    } catch (e) {
      this.errorDialog = true
    } finally {
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
