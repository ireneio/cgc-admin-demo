<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="12"
        >
          <v-select
            v-model="form.org"
            :items="selectOrg"
            label="Organization"
          ></v-select>
        </v-col>
        <v-col
          cols="6"
        >
          <v-text-field
            v-model="form.symbol"
            label="Symbol"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="6"
        >
          <v-text-field
            v-model="form.name"
            label="Name"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-switch
            v-model="form.isActive"
            label="is Active"
          ></v-switch>
        </v-col>
        <v-divider></v-divider>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.officialWebsite"
            label="Official Website (optional)"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.facebook"
            label="Facebook (optional)"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.instagram"
            label="Instagram (optional)"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.twitter"
            label="Twitter (optional)"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.telegram"
            label="Telegram (optional)"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.discord"
            label="Discord (optional)"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.twitch"
            label="Twitch (optional)"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-divider></v-divider>
        <v-col
          cols="6"
        >
          <v-text-field
            v-model="form.authoritiesAdd"
            label="Address"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="6"
          class="mt-4"
        >
          <v-btn color="info">insert</v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table :items="form.authorites" :headers="[{ text: 'Authorities', value: 'address', align: 'start', sortable: false }]"></v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      color="primary"
      @click="handleBtnClick"
      :disabled="isBtnDisabled"
    >
      {{ btnText }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class CreateGame extends Vue {
  @Prop({ required: true, default: { isEditMode: true } }) readonly dialog: any
  @Prop({ required: false, default: 'Submit' }) readonly btnText: any

  private handleBtnClick() {
    this.$emit('click', this.form)
  }

  private get isBtnDisabled() {
    return false
    // return this.form.org === '' ||
    //   this.form.symbol === '' ||
    //   this.form.name === '' ||
    //   this.form.logo === ''
  }

  private form: any = {
    org: '',
    symbol: '',
    name: '',
    logo: '',
    isActive: true,
    officialWebsite: '',
    facebook: '',
    instagram: '',
    twitter: '',
    telegram: '',
    discord: '',
    twitch: '',
    authorities: [],
    authoritiesAdd: ''
  }

  private get selectOrg(): Array<any> {
    const list = [
      {
        text: 'Catheon Gaming',
        value: 1
      },
      {
        text: 'Studio',
        value: 3
      },
      {
        text: 'Guild',
        value: 4
      }
    ]
    return list
  }
}
</script>
