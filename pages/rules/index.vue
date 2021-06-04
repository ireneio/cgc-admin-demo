<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">條款設定</h2>
        <v-card outlined>
          <v-card-text>
            <v-tabs v-model="tabInfo.tab" color="primary">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab
                v-for="item in tabInfo.items"
                :key="item"
              >
                {{ item }}
              </v-tab>
              <v-tabs-items v-model="tabInfo.tab">
                <v-tab-item
                  v-for="item in tabInfo.items"
                  :key="item"
                >
                  <v-card flat>
                    <div class="mt-4">
                      <v-btn
                        color="primary"
                        @click="handleCreateItem"
                      >
                        <v-icon>mdi-plus</v-icon> 新增
                      </v-btn>
                    </div>
                    <v-data-table
                      :headers="headers"
                      :items="tableData"
                      :single-select="false"
                      :options="tableOptions"
                      item-key="name"
                      :show-select="false"
                      :mobile-breakpoint="1023"
                      class="elevation-1 mt-4"
                      @click:row="handleRowClick"
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
                                      v-model="form.version"
                                      label="版本名稱"
                                      counter="10"
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                              </v-container>
                              <default-editor
                                @update-value="handleEditorUpdate"
                                :preloadValue="form.value"
                              >
                              </default-editor>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="handleCreateCancel"
                              >
                                取消
                              </v-btn>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="handleCreateSave"
                              >
                                儲存
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialog.delete" max-width="50vw">
                          <v-card>
                            <v-card-title class="headline">{{ dialog.deleteConfimationText }}</v-card-title>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text @click="handleDeleteCancel">取消</v-btn>
                              <v-btn color="blue darken-1" text @click="handleDeleteConfirm(false)">確認</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialog.activate" max-width="50vw">
                          <v-card>
                            <v-card-title class="headline">{{ dialog.activateConfimationText }}</v-card-title>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text @click="handleDeleteCancel">取消</v-btn>
                              <v-btn color="blue darken-1" text @click="handleDeleteConfirm(true)">確認</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </template>
                      <template v-slot:item.misc="{ item }">
                        <v-icon
                          small
                          @click.stop="handleDeleteItem(item)"
                        >
                        {{ item.status === '啟用' ? 'mdi-stop' : 'mdi-play' }}
                        </v-icon>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import DefaultEditor from '~/components/DefaultEditor.vue'
import { ruleStore } from '~/store'
import { $api } from '~/utils/api'

@Component({
  layout: 'admin',
  components: {
    DefaultEditor
  }
})
export default class RulesIndex extends Vue {
  private tabInfo = {
    tab: 0,
    tabName: 'play',
    items: [
      '玩法規則', '使用條款'
    ]
  }

  @Watch('tabInfo.tab')
  private async onTabChange(newVal: number) {
    switch (newVal) {
      case 0:
        await ruleStore.getRuleList({ type: 'play' })
        this.tabInfo.tabName = 'play'
        break
      case 1:
        await ruleStore.getRuleList({ type: 'bet' })
        this.tabInfo.tabName = 'bet'
        break
    }
  }

  private get currentTab(): number {
    return this.tabInfo.tab
  }

  private get currentTabName(): string {
    switch (this.currentTab) {
      case 0:
        return '玩法規則'
      case 1:
        return '使用條款'
      default:
        return ''
    }
  }

  private headers: Array<any> = [
    { text: '版本', value: 'version', align: 'start', sortable: true },
    { text: '狀態', value: 'status', align: 'start', sortable: true },
    { text: '', value: 'misc', align: 'start', sortable: false }
  ]

  private get tableData(): Array<any> {
    return ruleStore.ruleList.map((item) => {
      return {
        ...item,
        id: item._id,
        status: item.status ? '啟用' : '停用'
      }
    })
  }

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['status'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private form: any = {
    id: '',
    value: '',
    version: ''
  }

  private clearForm(): void {
    this.form = {
      id: '',
      value: '',
      version: ''
    }
  }

  private handleEditorUpdate(val: string): void {
    this.form.value = val
  }

  private dialog: any = {
    activateConfimationText: `確認啟用此${this.currentTabName}`,
    activate: false,
    deleteConfimationText: `確認停用此${this.currentTabName}`,
    delete: false,
    edit: false,
    editTitle: `編輯${this.currentTabName}`,
    new: false,
    newTitle: `建立${this.currentTabName}`,
    error: false,
    errorTitle: 'Server Error. Please try again later.'
  }

  private handleCreateItem(): void {
    this.dialog.new = true
  }

  private handleDeleteItem({ id, status }: { id: string, status: string }): void {
    this.form.id = id
    if (status === '啟用') {
      this.dialog.delete = true
    } else {
      this.dialog.activate = true
    }
  }

  private handleCreateCancel(): void {
    this.dialog.new = false
    this.clearForm()
  }

  private async handleCreateSave() {
    const { version, value: text, id } = this.form
    if (id === '') {
      await $api.post('/rule', {
        type: this.tabInfo.tabName,
        text,
        version
      })
    } else {
      await $api.post(`/rule/${id}`, {
        text
      })
    }

    await ruleStore.getRuleList({ type: this.tabInfo.tabName })
    this.dialog.new = false
    this.clearForm()
  }

  private async handleDeleteConfirm(flag: boolean) {
    await $api.post('/rule/status', {
      id: this.form.id,
      status: flag ? 1 : 0,
      type: this.tabInfo.tabName
    })
    await ruleStore.getRuleList({ type: this.tabInfo.tabName })
    if (flag) {
      this.dialog.activate = false
    } else {
      this.dialog.delete = false
    }
    this.clearForm()
  }

  private handleDeleteCancel(): void {
    this.dialog.delete = false
    this.dialog.activate = false
    this.clearForm()
  }

  private handleRowClick(row: any, col: any): void {
    this.form.id = row.id
    this.form.value = row.text
    this.form.version = row.version
    this.dialog.new = true
  }

  private async created() {
    await ruleStore.getRuleList({ type: this.tabInfo.tabName })
  }
}
</script>
