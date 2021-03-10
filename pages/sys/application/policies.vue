<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Privacy Policies Management</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              color="primary"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
            <div class="ml-8">Select Displaying Privacy Policy:</div>
            <div style="width:150px;" class="mt-6 ml-4">
              <v-select
                @change="handleUpdateActivePolicy"
                :value="activePolicy"
                :items="selectPolicy"
            ></v-select>
            </div>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="tableData"
              :single-select="false"
              :options="tableOptions"
              item-key="id"
              :show-select="false"
              :mobile-breakpoint="1023"
              class="elevation-1 mt-4"
              @click:row="handleRowClick"
              @item-selected="handleSelectItem"
              @toggle-select-all="handleSelectItemAll"
            >
              <template v-slot:top>
                <v-dialog
                  v-model="dialog.new"
                  max-width="50vw"
                  max-height="70vh"
                  persistent
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ form.id === '' ? dialog.newTitle : dialog.editTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" v-if="form.id !== ''">
                            <v-tabs
                              color="primary"
                              center-active
                            >
                              <v-tab v-for="item in tabs" :key="item.value" @click="handleUpdateTab(item.value)">{{ item.text }}</v-tab>
                            </v-tabs>
                          </v-col>
                        </v-row>
                        <v-row v-if="tab === 0">
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.name"
                              label="Name"
                              counter="50"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.version"
                              label="Version"
                              counter="5"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.status"
                              label="Status"
                              disabled
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-show="tab === 1">
                          <v-col
                            cols="12"
                          >
                            <default-editor></default-editor>
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
                        Cancel
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="handleCreateSave"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialog.delete" max-width="50vw">
                  <v-card>
                    <v-card-title class="headline">{{ dialog.deleteConfimationText }}</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="handleDeleteCancel">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="handleDeleteConfirm">Confirm</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip :color="item.status.value === 1 ? 'success' : 'default'">
                  {{ item.status.text }}
                </v-chip>
              </template>
              <template v-slot:item.users="{ item }">
                <div v-for="user in item.users" :key="user.value">{{ user.text }}<br /></div>
              </template>
              <template v-slot:item.misc="{ item }">
                <v-icon
                  small
                  @click.stop="handleDeleteItem(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { DateFactory } from '~/utils/date'
import { sysStore } from '~/store'
import DefaultEditor from '~/components/DefaultEditor.vue'


@Component({
  components: { DefaultEditor },
  layout: 'default'
})
export default class SysApplication extends Vue {
  private headers: Array<any> = [
    { text: 'Name', value: 'name', align: 'start', sortable: true },
    { text: 'Version', value: 'version', align: 'start', sortable: true },
    { text: 'Status', value: 'status', align: 'start', sortable: true },
    { text: 'Last Updated', value: 'lastUpdated', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): Array<any> {
    return [
      {
        id: '123',
        name: 'PP-01',
        version: '1.0.0',
        status: {
          text: 'In Use',
          value: 1
        },
        content: '',
        lastUpdated: new DateFactory(new Date()).yymmddhhmmss()
      },
      {
        id: '1234',
        name: 'PP-02',
        version: '1.0.3',
        status: {
          text: 'Inactive',
          value: 0
        },
        content: '',
        lastUpdated: new DateFactory(new Date()).yymmddhhmmss()
      }
    ]
  }

  private tab: number = 0

  private tabs: Array<any> = [
    { text: 'Info', value: 0 },
    { text: 'Content Editor', value: 1 }
  ]

  private handleUpdateTab(val: number): void {
    this.tab = Number(val)
  }

  private get selectPolicy() {
    return this.tableData.map((item: any) => ({ text: item.name, value: item.id }))
  }

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['date'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private get activePolicy(): any {
    const target = this.tableData.find((item: any) => item.status && item.status.value === 1)
    return { text: target.name, value: target.id }
  }

  private setActivePolicy(id: string): void {
    this.tableData.forEach((item: any) => {
      if(item.id === id) {
        item.status = {...this.selectStatus[1]}
      } else {
        item.status = {...this.selectStatus[0]}
      }
    })
  }

  private handleUpdateActivePolicy(id: string): void {
    this.setActivePolicy(id)
  }

  private selected: Array<any> = []

  private singleSelect: boolean = false

  private selectStatus: Array<any> = [
    {
      text: 'Inactive',
      value: 0
    },
    {
      text: 'In Use',
      value: 1
    }
  ]

  private selectUser: Array<any> = [
    {
      text: 'Seattle-1',
      value: '1'
    },
    {
      text: 'Seattle-2',
      value: '2'
    },
    {
      text: 'Seattle-3',
      value: '3'
    }
  ]

  private form: any = {
    id: '',
    name: '',
    version: '1.0.0',
    content: '',
    status: this.selectStatus[0].text
  }

  private dialog: any = {
    deleteConfimationText: 'Are you sure you want to delete this item?',
    delete: false,
    edit: false,
    editTitle: 'Edit Item',
    new: false,
    newTitle: 'Create Item',
    error: false,
    errorTitle: 'Server Error. Please try again later.'
  }

  private handleSelectItem(obj: any): void {
    const { value, item } = obj
    if(value === true) {
      this.selected = [...item]
    } else {
      this.selected = []
    }
  }

  private handleSelectItemAll(obj: any): void {
    const { value, items } = obj
    if(value === true) {
      this.selected = [...items]
    } else {
      this.selected = []
    }
  }

  private handleRowClick(row: any, col: any): void {
    this.handleEditItem(row)
  }

  private clearForm(): void {
    this.form = {
      id: '',
      name: '',
      version: '',
      content: '',
      status: this.selectStatus[0].text
    }
  }

  private fillForm(item: any): void {
    const { id, name, version, status, content } = item
    this.form = {
      ...this.form,
      id,
      name,
      version,
      content,
      status: status.text
    }
  }

  private handleCreateItem(): void {
    this.dialog.new = true
  }

  private handleEditItem(item: any): void {
    this.fillForm(item)
    this.dialog.new = true
  }

  private handleDeleteItem(item: any): void {
    this.fillForm(item)
    this.dialog.delete = true
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.clearForm()
    this.tab = 0
  }

  private handleCreateSave(): void {
    this.dialog.new = false
    this.clearForm()
    this.tab = 0
  }

  private handleDeleteConfirm(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private async created() {
  }
}
</script>
