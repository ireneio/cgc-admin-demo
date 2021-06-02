<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">注單紀錄</h2>
        <v-card outlined>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="tableData"
              :single-select="false"
              :options="tableOptions"
              :search="tableSearch"
              :show-select="false"
              :mobile-breakpoint="1023"
              class="elevation-1 mt-4"
              @click:row="handleRowClick"
            >
            <template v-slot:top>
              <v-text-field
                v-model="tableSearch"
                label="搜尋會員帳號"
                class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:item.balance_change="{ value }">
              <v-layout justify-end>
                <div class="success--text" v-if="value.includes('+')">{{ value }}</div>
                <div class="error--text" v-if="value.includes('-')">{{ value }}</div>
              </v-layout>
            </template>
            <template v-slot:item.wallet_balance="{ value }">
              <v-layout justify-end>
                {{ value }}
              </v-layout>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { transactionStore } from '~/store'
import { numberWithCommas } from '~/utils/formatters'

@Component({
  layout: 'default'
})
export default class OrdersIndex extends Vue {
  private headers: Array<any> = [
    { text: '識別碼', value: 'id', align: 'start', sortable: true, filterable: false },
    { text: '會員帳號', value: 'user_email', align: 'start', sortable: true },
    // { text: '會員帳號識別碼', value: 'user_id', align: 'start', sortable: true },
    { text: '異動日期', value: 'created_at', align: 'start', sortable: true, filterable: false },
    { text: '異動類型', value: 'direction', align: 'start', sortable: true, filterable: false },
    { text: '異動額度', value: 'balance_change', align: 'start', sortable: true, filterable: false },
    { text: '剩餘額度', value: 'wallet_balance', align: 'start', sortable: true, filterable: false },
  ]

  private get tableData(): Array<any> {
    return transactionStore.transaction.map((item) => {
      return {
        ...item,
        direction: item.direction ? '新增' : '扣除',
        balance_change: item.direction ? `+ ${numberWithCommas(item.balance_change)}` : `- ${numberWithCommas(item.balance_change)}`,
        wallet_balance: numberWithCommas(item.wallet_balance)
      }
    })
  }

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['created_at'],
      sortDesc: [true],
      // groupBy: string[],
      // groupDesc: boolean[],
      multiSort: true,
      mustSort: false
  }

  private handleRowClick(row: any, col: any): void {
  }

  private async created() {
    await transactionStore.getTransaction()
  }
}
</script>
