<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            :color="isDarkMode ? '#aaa' : 'primary'"
          >
          <!--             v-show="isAllowAccess(item.allowAccess)" -->
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item-group :color="isDarkMode ? 'warning' : 'primary'">
              <v-list-item
                v-for="(child, i) in item.children"
                :key="i"
                link
                @click="handleUpdateRoute(child)"
                :color="isDarkMode ? '#fff' : 'primary'"
              >
              <!--                 v-show="isAllowAccess(child.allowAccess)" -->
                <v-list-item-action v-if="child.icon">
                  <v-icon x-small class="ml-2">{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ child.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list-group>
          <v-list-item v-else :key="item.text" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      :color="isDarkMode ? '#181818' : 'primary'"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down d-flex align-center">
          <!-- <img src="/logo.png" alt="logo" width="32px" /> -->
          <!-- <span class="ml-2" v-if="$vuetify.breakpoint.lgAndUp">{{ info.h1 }}</span> -->
          <span v-if="$vuetify.breakpoint.lgAndUp">{{ info.h1 }}</span>
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
          <v-btn color="default" class="ml-2" text v-bind="attrs" v-on="on" :style="{ width: '150px' }">
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
      <v-menu
        v-model="menuSetting.value"
        :disabled="menuSetting.disabled"
        :absolute="menuSetting.absolute"
        :open-on-hover="menuSetting.openOnHover"
        :close-on-click="menuSetting.closeOnClick"
        :close-on-content-click="menuSetting.closeOnContentClick"
        :offset-x="menuSetting.offsetX"
        :offset-y="menuSetting.offsetY"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="default" text v-bind="attrs" v-on="on">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn large :text="wallet.connected" @click="handleWalletConn" color="default">
            {{ wallet.btnText }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-card flat width="250px">
              <div class="d-flex align-center mt-2">
                <v-btn class="ml-auto" color="primary" x-small fab @click="handleToggleTheme">
                  <v-icon v-if="$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
                  <v-icon v-if="!$vuetify.theme.dark">mdi-moon-waning-crescent</v-icon>
                </v-btn>
                <v-btn color="secondary" text x-small @click="dialog.version = !dialog.version">
                  <v-icon>mdi-xml</v-icon>
                </v-btn>
              </div>
              <v-card-title>
                <v-container>
                  <v-row>
                    <!-- <v-col cols="4" class="px-0 d-flex align-center">
                      <v-img :src="info.dP" height="60" width="60"></v-img>
                      <v-icon x-large class="ml-4">mdi-account-circle</v-icon>
                    </v-col> -->
                    <v-col cols="12" class="px-0 pl-4 d-flex align-center">
                      <div>
                        <!-- <div>{{ info.username }}</div> -->
                        <div :style="{ 'font-size': '14px' }">{{ info.companyName }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-title>
              <v-card-actions class="d-flex">
                <!-- <v-btn
                  v-if="isAllowPasswordUpdate"
                  class="primary"
                  @click="$router.push('/account/updatePassword')"
                >
                  <span>Update Password</span>
                </v-btn> -->
                <!-- <div style="width: 100px;"></div> -->
                <v-btn class="warning ml-auto" @click="handleLogout">sign out</v-btn>
              </v-card-actions>
            </v-card>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid class="pt-0">
        <v-row align="center" justify="center">
          <v-col cols="12">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-dialog
      v-model="dialog.version"
      max-width="700px"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          Version
        </v-card-title>
        <v-card-text class="mt-4">
          v{{ info.version }} <br />
          <strong class="info--text">Last Updated: </strong>
          {{ info.lastUpdated }} <br />
          <div class="mt-7">
            Copyright © {{ info.crDate }}
            <a
              class="info--text text-decoration-none"
              href=""
              target="_blank"
            >
              {{ info.crSource }}.
            </a>
            &nbsp;All rights reserved.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="info" @click="dialog.version = false" large>
            <strong>close</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.error" width="800px">
      <v-card>
        <v-card-title class="primary white--text">
          Hint
        </v-card-title>
        <v-card-text class="mt-4">
          <h2 class="mt-4">Server Error. Please try again later.</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog.error = false" large>
            <strong>Close</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { authStore } from '~/store'
import { addWalletListener, connect, getTrimmedAddressEllipsisMiddle, isConnected } from '~/utils/wallet.js'

@Component({
  middleware: ['auth']
})

export default class DefaultLayout extends Vue {
  private wallet = {
    connected: false,
    address: '',
    btnText: 'connect wallet'
  }

  private get isAllowPasswordUpdate(): boolean {
    return false
  }

  private get isDarkMode(): boolean {
    return this.$vuetify.theme.dark
  }

  private get info(): any {
    return {
      username: 'Welcome,',
      companyName: authStore.info.username ? authStore.info.username : 'user',
      dp: '',
      h1: this.$vuetify.lang.t('$vuetify.headers.title'),
      lastUpdated: new Date().toLocaleDateString('en',
      { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }),
      version: '1.0.0',
      crDate: '2021',
      crSource: 'CGC'
    }
  }

  private menuSetting: any = {
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

  private dialog: any = {
    cog: false,
    version: false,
    error: false
  }

  private drawer: boolean | null = null

  private handleUpdateRoute(item: any) {
    this.$router.push(
      {
        name: item.route,
        params: {
          tabTitle: item.tabTitle
        }
      })
  }

  private handleToggleTheme(): void {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    window.localStorage.setItem('tm', this.$vuetify.theme.dark.toString())
  }

  private items: Array<any> = [
    {
      icon: 'mdi-account-key',
      'icon-alt': 'mdi-account-key-outline',
      text: 'Management',
      model: false,
      allowAccess: '6',
      children: [
        {
          text: 'Accounts',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'management',
          allowAccess: '6'
        }
      ]
    },
    {
      icon: 'mdi-archive',
      'icon-alt': 'mdi-archive-outline',
      text: 'Angrymals(Legacy)',
      model: false,
      allowAccess: '5',
      children: [
        {
          text: 'Tiers',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'angrymals',
          allowAccess: '6'
        },
        {
          text: 'Legacy Whitelist',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'angrymals-whitelist',
          allowAccess: '5'
        },
      ]
    },
    {
      icon: 'mdi-rocket-launch',
      'icon-alt': 'mdi-rocket-launch-outline',
      text: 'Launchpad',
      model: false,
      allowAccess: '5',
      children: [
        {
          text: 'NFT Presale',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'launchpad',
          allowAccess: '5'
        },
        {
          text: 'Token Presale',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'launchpad-token',
          allowAccess: '6'
        },
        {
          text: 'Whitelist',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'launchpad-whitelist',
          allowAccess: '6'
        }
      ]
    },
    {
      icon: 'mdi-bookmark-box-multiple',
      'icon-alt': 'mdi-bookmark-box-multiple-outline',
      text: 'Collections',
      model: false,
      allowAccess: '6',
      children: [
        {
          text: 'Collections',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'collections',
          allowAccess: '6'
        },
        {
          text: 'Activites',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'collections-activities',
          allowAccess: '6'
        }
      ]
    },
    {
      icon: 'mdi-account-group',
      'icon-alt': 'mdi-account-group-outline',
      text: 'Scholarships',
      model: false,
      allowAccess: '=5',
      children: [
        {
          text: 'Assets',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'scholarships',
          allowAccess: '5'
        },
        {
          text: 'Members',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'scholarships-members',
          allowAccess: '5'
        },
        {
          text: 'Activities',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'scholarships-activities',
          allowAccess: '5'
        }
      ]
    },
    {
      icon: 'mdi-treasure-chest',
      'icon-alt': 'mdi-treasure-chest',
      text: 'Treasury',
      model: false,
      allowAccess: '6',
      children: [
        {
          text: 'Stream',
          icon: 'mdi-checkbox-blank-circle-outline',
          route: 'treasury',
          allowAccess: '6'
        },
      ]
    }
  ]

  private handleLogout(): void {
    try {
      window.localStorage.removeItem('creds')
      this.$router.push('/account')
    } catch (e: unknown) {
      this.dialog.error = true
    }
  }

  private handleI18nUpdate(localeStr: string): void {
    this.$vuetify.lang.current = localeStr
    this.menuSetting.i18nValue = false
    window.localStorage.setItem('lang', localeStr)
  }

  private getLangFromLs(): void {
    const lang = window.localStorage.getItem('lang')
    if (lang) {
      this.$vuetify.lang.current = lang
    } else {
      window.localStorage.setItem('lang', 'en')
    }
  }

  private getThemeFromLs(): void {
    const theme = window.localStorage.getItem('tm')
    if (theme) {
      if (theme === 'true') {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    } else {
      window.localStorage.setItem('tm', 'false')
    }
  }

  private get userInfo (): any {
    return authStore.info
  }

  private get userAccessLevel(): string {
    return this.userInfo.access_level
  }

  private isAllowAccess(val: string) {
    // TODO permission
    if (val.includes('=')) {
      return Number(this.userAccessLevel) === Number(val.slice(1))
    }
    return Number(this.userAccessLevel) >= Number(val)
  }

  private async handleWalletConn() {
    const { address, status } = await connect()
    this.wallet.address = address
    this.wallet.connected = true
    this.wallet.btnText = getTrimmedAddressEllipsisMiddle(address)
  }

  private mounted() {
    this.getThemeFromLs()
    this.getLangFromLs()
    if (this.userAccessLevel === '6') {
      addWalletListener(this)
      this.handleWalletConn()
    }
  }
}
</script>
