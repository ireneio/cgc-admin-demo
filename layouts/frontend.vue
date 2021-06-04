<template>
  <v-app>
    <div style="width:100vw;height:100vh;">
      <v-toolbar
        dense
        width="100%"
        style="position:fixed;top:0px;left:0;z-index:2;background-color:#fff;"
      >
        <v-toolbar-title class="dark--text">{{ config.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text color="dark">
          <v-icon>mdi-currency-usd</v-icon>
          {{ balanceTotal }}
        </v-btn>
        <v-btn icon color="dark" @click="handleLogout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar>
      <Nuxt style="padding-bottom: 100px;" />
      <v-bottom-navigation
        :value="tabCurrent"
        color="teal"
        grow
        fixed
      >
        <v-btn
          v-for="item in tabList"
          :key="item.value"
          @click="handleTabChange(item.value)"
        >
          <span>{{ item.label }}</span>

          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { authStore, userStore } from '~/store'
import { numberWithCommas } from '~/utils/formatters'

@Component({
  middleware: ['authFrontend'],
  components: {
    ValidationObserver,
    ValidationProvider
  }
})
export default class FrontendLayout extends Vue {
  private get config(): any {
    return {
      title: '前台'
    }
  }

  private get tabCurrent() {
    return userStore.tabCurrent
  }

  private tabList = [
    { label: '聊天室', value: 0, icon: 'mdi-forum' },
    { label: '遊戲', value: 1, icon: 'mdi-gamepad-variant' },
    { label: '我的', value: 2, icon: 'mdi-account' }
  ]

  private get userInfo() {
    return authStore.info
  }

  private handleLogout(): void {
    try {
      // this.$nuxt.$loading.start()
      window.localStorage.removeItem('t')
      this.$router.push('/v1/account')
    } catch (e) {
    } finally {
      // this.$nuxt.$loading.finish()
    }
  }

  private get walletInfo() {
    return userStore.wallets
  }

  private get balanceTotal(): string {
    return userStore.wallets.length ? numberWithCommas(userStore.wallets[0].balance_total) : ''
  }

  @Watch('tabCurrent')
  private onTabChange(newVal: number) {
    switch (newVal) {
      case 1:
      case 0:
        this.$router.push('/v1')
        break
      // case 0:
      //   this.$router.push('/v1/chat')
      //   break
      case 2:
        this.$router.push('/v1/profile')
        break
    }
  }

  private determineTab() {
    switch (this.$route.name) {
      case 'v1-profile':
        userStore.setTabCurrent(2)
        break
      case 'v1-chat':
        userStore.setTabCurrent(0)
        break
      case 'v1':
        userStore.setTabCurrent(1)
        break
    }
  }

  private handleTabChange(val: number) {
    userStore.setTabCurrent(val)
  }

  private async created() {
    this.determineTab()
    await userStore.getWallets(this.userInfo.id)
  }
}
</script>
