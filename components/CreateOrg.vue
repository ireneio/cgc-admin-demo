<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="12"
        >
          <v-select
            v-model="form.type"
            :items="selectType"
            label="Type"
          ></v-select>
        </v-col>
        <v-col
          cols="12"
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
export default class CreateOrg extends Vue {
  @Prop({ required: true, default: { isEditMode: true } }) readonly dialog: any
  @Prop({ required: false, default: 'Submit' }) readonly btnText: any

  private handleBtnClick() {
    this.$emit('click', this.form)
  }

  private get isBtnDisabled() {
    return false
    // return this.form.type === '' ||
    //   this.form.name === ''
  }

  private form: any = {
    type: '',
    name: '',
    isActive: true
  }

  private get selectType(): Array<any> {
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
