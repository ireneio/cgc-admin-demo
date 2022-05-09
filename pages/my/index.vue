<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Edit My Info</h2>
        <v-card outlined>
          <v-toolbar flat class="mt-8">
            <div :style="{ display: 'flex', flexWrap: 'wrap' }">
              <v-btn
                :color="isEditMode ? 'success' : 'warning'"
                @click="handleEditMode"
              >
                <v-icon v-if="!isEditMode">mdi-content-save-edit</v-icon>
                <span v-if="!isEditMode">Edit</span>
                <v-icon v-if="isEditMode">mdi-content-save</v-icon>
                <span v-if="isEditMode">Save</span>
              </v-btn>
              <div :style="{ flexBasis: '100%' }" class="mt-4">
                <v-btn
                  color="info"
                  @click="handleCreateItem"
                  class="ml-0"
                >
                  <v-icon>mdi-plus</v-icon> Add Award
                </v-btn>
              </div>
            </div>
          </v-toolbar>
          <v-card-text class="pt-0">
            <v-container>
              <v-row>
                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="form.name"
                    label="Name"
                    :disabled="!isEditMode"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="form.origin"
                    label="City, Country"
                    :disabled="!isEditMode"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="4"
                >
                  <v-menu
                    v-model="dialog.date"
                    :nudge-right="40"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.dateRange"
                        label="Birthday"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :disabled="!isEditMode"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.dateRange"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-textarea
                    v-model="form.about"
                    label="About Me"
                    :disabled="!isEditMode"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
            <v-data-table
              :headers="headers"
              :items="tableData"
              :single-select="false"
              :options="tableOptions"
              item-key="id"
              :show-select="false"
              :mobile-breakpoint="1023"
              class="elevation-1 mt-4"
              @click:row="handleRowClick"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
    <v-dialog
      v-model="dialog.new"
      max-width="700px"
      max-height="70vh"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialog.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-select
                  :items="[{ text: 'Award', value: 'award' }, { text: 'Expo', value: 'expo' }]"
                  label="Type"
                  v-model="form.award_type"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="form.award_name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="form.award_year"
                  label="Year"
                  maxLength="4"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="handleCreateCancel"
          >
            cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="handleCreateSave"
            :disabled="isSaveBtnDisabled || isSubmitting"
          >
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { authStore, errorStore } from '~/store'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'
import moment from 'moment'
import Token from '~/utils/token'

@Component({
  layout: 'admin'
})
export default class My extends Vue {
  private isEditMode = false

  private async handleEditMode() {
    if (this.isEditMode) {
      await this.handleEditSave()
    }
    this.isEditMode = !this.isEditMode
  }

  private async handleEditSave() {
    if (!this.fieldValidation()) {
      return
    }
    const _payload = {
      ...this.form,
      userId: authStore.id
    }
    const _endpoint = '/member/info'
    const _req = await $apiUser.post(_endpoint, _payload, { headers: { authorization: `Bearer ${Token.getValue()}` } })
    httpResponseMapper(_req)
    if (errorStore.isActive) {
      this.snackbar.text = `Info update failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      this.clearForm()
      this.snackbar.text = 'Info update success.'
      await this.init()
      this.dialog.new = false
    }
    this.snackbar.toggle = true
  }

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'ID', value: 'id', align: 'start', sortable: true },
    { text: 'Year', value: 'award_year', align: 'start', sortable: true, filterable: false },
    { text: 'Name', value: 'award_name', align: 'start', sortable: true, filterable: false },
    { text: 'Type', value: 'award_type', align: 'start', sortable: true, filterable: false },
    // { text: 'Last updated', value: 'last_updated', align: 'start', sortable: true, filterable: false, filterable: false },
    // { text: 'Created At', value: 'created_at', align: 'start', sortable: true, filterable: false, filterable: false },
  ]

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['type', 'year', 'name'],
      sortDesc: [true],
      multiSort: true,
      mustSort: false
  }

  private form: any = {
    id: '',
    name: '',
    origin: '',
    birthday: '',
    award_year: '',
    award_type: '',
    award_name: '',
    about: ''
  }

  private dialog: any = {
    activateConfimationText: 'Enable this Award?',
    activate: false,
    deleteConfimationText: 'Disable this Award?',
    delete: false,
    isEditMode: false,
    new: false,
    title: 'Create Award',
    createTitle: 'Create Award',
    editTitle: 'Edit Award',
    error: false,
    errorTitle: 'Server Error. Please try again later.',
    date: false,
    time: false,
    time2: false,
    dateSearch: false,
  }

  private handleRowClick(row: any, col: any) {
    const {
      id,
      name,
      origin,
      birthday
    } = row
    this.form = {
      ...this.form,
      id,
      name,
      origin,
      birthday
    }
    this.dialog.title = this.dialog.editTitle
    this.dialog.new = true
    this.dialog.isEditMode = true
  }

  private clearForm(): void {
    this.form = {
      ...this.form,
      id: '',
      award_year: '',
      award_type: '',
      award_name: ''
    }
  }

  private handleCreateItem(): void {
    this.dialog.title = this.dialog.createTitle
    this.dialog.new = true
    this.dialog.isEditMode = false
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.dialog.isEditMode = false
    this.dialog.title = this.dialog.createTitle
    this.clearForm()
  }

  private fieldValidation() {
    if (this.form.name.length > 50) {
      return false
    }
    if (this.form.origin.length > 50) {
      return false
    }
    return true
  }

  private get isSaveBtnDisabled() {
    return this.form.award_year === '' || this.form.award_type === '' || this.form.award_name === ''
  }

  private isSubmitting = false

  private async handleCreateSave() {
    const _payload = {
      ...this.form,
      userId: authStore.id,
      itemId: this.form.id
    }
    const _endpoint = '/member/info/award'
    this.isSubmitting = true
    const _req = await $apiUser.post(_endpoint, _payload, { headers: { authorization: `Bearer ${Token.getValue()}` } })
    httpResponseMapper(_req)
    if (errorStore.isActive) {
      this.snackbar.text = `Info update failure: ${errorStore.message}`
      errorStore.clearError()
    } else {
      this.clearForm()
      this.snackbar.text = 'Info update success.'
      await this.init()
      this.dialog.new = false
    }
    this.snackbar.toggle = true
    this.isSubmitting = false
  }

  private async getInfo() {
    const _req = await $apiUser.get(`/member/info?userId=${authStore.id}`, { headers: { authorization: `Bearer ${Token.getValue()}` } })
    return httpResponseMapper(_req).data
  }

  private async setInfo() {
    try {
      const { awards, info } = await this.getInfo()
      if (awards && awards.length) {
        this.tableData = [...awards]
      }
      this.form.name = info?.name
      this.form.origin = info?.origin
      this.form.birthday = info?.birthday ? moment(info?.birthday) : ''
      this.form.about = info?.about
    } catch (e: unknown) {

    }
  }

  private tableData: any[] = []

  private async init() {
    await this.setInfo()
  }

  private async created() {
    await this.init()
  }
}
</script>
