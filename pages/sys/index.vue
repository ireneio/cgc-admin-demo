<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Accounts Management</h2>
        <v-card outlined>
          <v-toolbar flat>
            <v-btn
              color="primary"
              @click="handleCreateItem"
            >
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
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
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              v-model="form.username"
                              label="Username"
                              counter="50"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-select
                              v-model="form.perm"
                              :items="selectPerm"
                              label="Permission Level"
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-select
                              v-model="form.users"
                              :items="selectUser"
                              label="Assigned User(s)"
                              multiple
                            ></v-select>
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
              <template v-slot:item.perm="{ item }">
                {{ item.perm.text }}
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

@Component({
  layout: 'default'
})
export default class SysIndex extends Vue {
  private headers: Array<any> = [
    { text: 'Username', value: 'username', align: 'start', sortable: true },
    { text: 'Permission Level', value: 'perm', align: 'start', sortable: true },
    { text: 'Assigned User(s)', value: 'users', align: 'start', sortable: true },
    { text: 'Last Login', value: 'lastLogin', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): Array<any> {
    return [
      {
        id: '123',
        username: 'test123@gmail.com',
        perm: {
          text: 'root',
          value: '1'
        },
        users: [
          {
            text: 'Seattle-1',
            value: '1'
          },
          {
            text: 'Seattle-2',
            value: '2'
          }
        ],
        lastLogin: new DateFactory(new Date()).yymmddhhmmss()
      }
    ]
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

  private selected: Array<any> = []

  private singleSelect: boolean = false

  private selectPerm: Array<any> = [
    {
      text: 'root',
      value: '1'
    },
    {
      text: 'mgr',
      value: '2'
    },
    {
      text: 'emp',
      value: '3'
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
    username: '',
    perm: '',
    users: '',
    lastLogin: ''
  }

  private dialog: any = {
    deleteConfimationText: 'Are you sure you want to delete this account?',
    delete: false,
    edit: false,
    editTitle: 'Edit Account',
    new: false,
    newTitle: 'Create Account',
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
      username: '',
      perm: '',
      users: '',
      lastLogin: ''
    }
  }

  private fillForm(item: any): void {
    const { id, username, perm, users, lastLogin } = item
    this.form = {
      ...this.form,
      id,
      username,
      perm,
      users,
      lastLogin
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
  }

  private handleCreateSave(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private handleDeleteConfirm(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.clearForm()
  }

  private handleEditCancel(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private handleEditSave(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private async created() {
  }
}
</script>
