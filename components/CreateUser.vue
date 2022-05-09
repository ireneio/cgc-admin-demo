<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="6"
        >
          <v-select
            v-model="form.role"
            :items="selectRole"
            label="Role"
          ></v-select>
        </v-col>
        <v-col
          cols="6"
        >
          <v-select
            v-model="form.org"
            :items="selectOrg"
            label="Organization"
          ></v-select>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.account"
            label="Account"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.password"
            label="Password"
            counter="50"
            v-show="!dialog.isEditMode"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="form.name"
            label="Display Name"
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
export default class CreateUser extends Vue {
  @Prop({ required: true, default: { isEditMode: true } }) readonly dialog: any
  @Prop({ required: false, default: 'Submit' }) readonly btnText: any

  private handleBtnClick() {
    this.$emit('click', this.form)
  }

  private get isBtnDisabled() {
    return false
    // return this.form.account === '' ||
    //   this.form.role === '' ||
    //   this.form.org === '' ||
    //   this.form.password === '' ||
    //   this.form.name === ''
  }

  private form: any = {
    account: '',
    role: '',
    org: '',
    password: '',
    name: '',
    isActive: true
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

  private get selectRole(): Array<any> {
    const list = [
      {
        text: 'CGC admin',
        value: 2
      },
      {
        text: 'Studio admin',
        value: 3
      },
      {
        text: 'Guild admin',
        value: 4
      },
      {
        text: 'Treasure admin',
        value: 5
      }
    ]
    return list
  }
}
</script>
