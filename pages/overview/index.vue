<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Application Overview</h2>
        <v-card outlined>
          <v-card-title>
            <span>{{ toggleInterval }}'s&nbsp;&nbsp;Performance&nbsp;&nbsp;
              <!-- {{ new Date().toLocaleDateString('en-us')}} -->
            </span>
            <v-select
              v-model="toggleInterval"
              style="position:absolute;top:.25rem;right:1rem;width:150px;"
              :items="[{ text: 'Today', value: 'Today'}, { text: 'This Week', value: 'This Week'}, { text: 'This Month', value: 'This Month'}]"
              label="Intervals"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <div class="d-flex" style="flex-wrap:wrap;">
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '31' : '48'}%`"
              >
                <v-sheet
                  class="v-sheet--offset mx-auto py-4 px-2 mt-4"
                  color="cyan"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :labels="data.siteOrders.labels"
                    :value="data.siteOrders.value"
                    color="white"
                    line-width="3"
                    padding="16"
                    label-size="10"
                  ></v-sparkline>
                </v-sheet>

                <v-card-text class="pt-4">
                  <div class="title font-weight-light mb-2">
                    Site Visits
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex">
                    <v-icon
                      class="mr-2"
                      small
                    >
                      mdi-clock
                    </v-icon>
                    <span class="caption grey--text font-weight-light">last visit 26 minutes ago</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '31' : '48'}%`"
              >
                <v-sheet
                  class="v-sheet--offset mx-auto py-4 px-2 mt-4"
                  color="teal"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :labels="data.visitOrderConversion.labels"
                    :value="data.visitOrderConversion.value"
                    color="white"
                    line-width="3"
                    padding="16"
                    label-size="10"
                  ></v-sparkline>
                </v-sheet>

                <v-card-text class="pt-4">
                  <div class="title font-weight-light mb-2">
                    Site Orders
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex">
                    <v-icon
                      class="mr-2"
                      small
                    >
                      mdi-clock
                    </v-icon>
                    <span class="caption grey--text font-weight-light">last order 26 minutes ago</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '31' : '48'}%`"
              >
                <v-sheet
                  class="v-sheet--offset mx-auto py-4 px-2 mt-4"
                  color="blue"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :labels="data.userRegistration.labels"
                    :value="data.userRegistration.value"
                    color="white"
                    line-width="3"
                    padding="16"
                    label-size="10"
                  ></v-sparkline>
                </v-sheet>

                <v-card-text class="pt-4">
                  <div class="title font-weight-light mb-2">
                    Visit/Order Conversion Rate
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex">
                    <v-icon
                      class="mr-2"
                      small
                    >
                      mdi-align-vertical-top
                    </v-icon>
                    <span class="caption grey--text font-weight-light">avg hour fluctuation 3%</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '20' : '48'}%`"
              >
                <v-card-title style="background-color:teal;align-items:center;justify-content:center;">
                    <div class="px-8 py-8" style="font-size:4rem;color:#fff;">6.96</div>
                </v-card-title>
                <v-card-text class="pt-4">
                  <div class="title font-weight-light mb-2">
                    Average Stay (Seconds)
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex">
                    <v-icon
                      class="mr-2"
                      small
                    >
                      mdi-clock
                    </v-icon>
                    <span class="caption grey--text font-weight-light">+ .33 seconds from last operating day</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '20' : '48'}%`"
              >
                <v-card-title style="background-color:teal;align-items:center;justify-content:center;">
                    <div class="px-8 py-8" style="font-size:4rem;color:#fff;">35.96</div>
                </v-card-title>
                <v-card-text class="pt-4">
                  <div class="title font-weight-light mb-2">
                    New/Re-Visit Rate (%)
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex">
                    <v-icon
                      class="mr-2"
                      small
                    >
                      mdi-alert-circle
                    </v-icon>
                    <span class="caption grey--text font-weight-light">+ 15% from last operating day</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '20' : '48'}%`"
              >
                <v-card-title style="background-color:teal;align-items:center;justify-content:center;">
                    <div class="px-8 py-8" style="font-size:4rem;color:#fff;">35.96</div>
                </v-card-title>
                <v-card-text class="pt-4">
                  <div class="title font-weight-light mb-2">
                    New/Re-Visit Rate (%)
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex">
                    <v-icon
                      class="mr-2"
                      small
                    >
                      mdi-alert-circle
                    </v-icon>
                    <span class="caption grey--text font-weight-light">+ 15% from last operating day</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '31' : '48'}%`"
              >
                <v-sheet
                  class="v-sheet--offset mx-auto py-4 px-2 mt-4"
                  color="blue"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :labels="data.visitOrderConversion.labels"
                    :value="data.visitOrderConversion.value"
                    color="white"
                    line-width="3"
                    padding="16"
                    label-size="10"
                  ></v-sparkline>
                </v-sheet>

                <v-card-text class="pt-4">
                  <div class="title font-weight-light mb-2">
                    Visit/Order Regression
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex">
                    <v-icon
                      class="mr-2"
                      small
                    >
                      mdi-percent
                    </v-icon>
                    <span class="caption grey--text font-weight-light">~0.88 (88%)</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '20' : '48'}%`"
              >
                <v-card-title>Most Sold Courses</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item class="d-flex">
                      <v-list-item-title><b>Name</b></v-list-item-title>
                      <div class="ml-auto"><b>Sold</b></div>
                    </v-list-item>
                    <v-list-item v-for="i in 5" :key="i">
                      <v-list-item-title>Course 00{{i}}</v-list-item-title>
                      <div>{{100 - i }}</div>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '31' : '48'}%`"
              >
                <v-card-title>Google Analytics Data</v-card-title>
                <v-card-text>
                  <bar-chart :data="data.gaData.data" :options="data.gaData.options" :height="200" />
                </v-card-text>
              </v-card>
              <v-card
                class="mt-4 mx-auto"
                :style="`flex: 0 0 ${$vuetify.breakpoint.name === 'md' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'xl' ? '31' : '48'}%`"
              >
                <v-card-title>A/B Testing Data</v-card-title>
                <v-card-text>
                  <bar-chart :data="data.gaData.data" :options="data.gaData.options" :height="200" />
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DateFactory } from '~/utils/date'
import { sysStore } from '~/store'

@Component({
  layout: 'default'
})
export default class OverviewIndex extends Vue {
  private data: any = {
    userRegistration: {
      labels: [
        '12am',
        '3am',
        '6am',
        '9am',
        '12pm',
        '3pm',
        '6pm',
        '9pm',
      ],
      value: [
        200,
        675,
        410,
        390,
        310,
        460,
        250,
        240,
      ]
    },
    siteOrders: {
      labels: [
        '12am',
        '3am',
        '6am',
        '9am',
        '12pm',
        '3pm',
        '6pm',
        '9pm',
      ],
      value: [
        200,
        675,
        410,
        390,
        310,
        460,
        250,
        240,
      ]
    },
    visitOrderConversion: {
      labels: [
        '12am',
        '3am',
        '6am',
        '9am',
        '12pm',
        '3pm',
        '6pm',
        '9pm',
      ],
      value: [
        200,
        675,
        410,
        390,
        310,
        460,
        250,
        240,
      ]
    },
    visitOrderRegression: {
      labels: [
        '12am',
        '3am',
        '6am',
        '9am',
        '12pm',
        '3pm',
        '6pm',
        '9pm',
      ],
      value: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
      ]
    },
    abTestData: {
      data: {
        labels: [
          '2019-06',
          '2019-07',
          '2019-08',
          '2019-09',
          '2019-10',
          '2019-11',
          '2019-12',
          '2020-01',
          '2020-02',
          '2020-03',
          '2020-04',
          '2020-05'
        ],
        datasets: [
          {
            label: 'Visits',
            data: [10, 15, 20, 30, 40, 50, 60, 70, 34, 45, 11, 78, 45],
            backgroundColor: '#003f5c'
          },
          {
            label: 'Pages Views',
            data: [30, 24, 57, 23, 68, 72, 25, 64, 133, 143, 165, 33, 56],
            backgroundColor: '#2f4b7c'
          },
          {
            label: 'Users',
            data: [45, 65, 30, 53, 34, 35, 26, 37, 34, 45, 67, 87, 98],
            backgroundColor: '#665191'
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '',
          fontSize: 24,
          fontColor: '#6b7280'
        },
        tooltips: {
          backgroundColor: '#17BF62'
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    },
    gaData: {
      data: {
        labels: [
          '2019-06',
          '2019-07',
          '2019-08',
          '2019-09',
          '2019-10',
          '2019-11',
          '2019-12',
          '2020-01',
          '2020-02',
          '2020-03',
          '2020-04',
          '2020-05'
        ],
        datasets: [
          {
            label: 'Visits',
            data: [10, 15, 20, 30, 40, 50, 60, 70, 34, 45, 11, 78, 45],
            backgroundColor: '#003f5c'
          },
          {
            label: 'Pages Views',
            data: [30, 24, 57, 23, 68, 72, 25, 64, 133, 143, 165, 33, 56],
            backgroundColor: '#2f4b7c'
          },
          {
            label: 'Users',
            data: [45, 65, 30, 53, 34, 35, 26, 37, 34, 45, 67, 87, 98],
            backgroundColor: '#665191'
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '',
          fontSize: 24,
          fontColor: '#6b7280'
        },
        tooltips: {
          backgroundColor: '#17BF62'
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    }
  }

  private toggleInterval: any = 'Today'

  private dialog: any = {
    detail: false,
    detailTitle: 'Menu Detail'
  }

  private courseDetail: any = {
    headers: [{ text: 'Name', value: 'name' }, ''],
    items: [],
    expanded: [],
    details: [],
    singleExpand: true
  }

  private handleRowClick(obj: any): void {
    this.dialog.detail = true
    this.dialog.detailTitle = obj.name + ' Detail'
    this.courseDetail.items = obj.consistedCourses.map((item: any) => ({
      name: item.text,
      value: item.value,
      children: item.children
    }))
  }

  private getCourseDetail(inventories: any): void {
    this.courseDetail.details = [...inventories]
  }

  private handleCourseDetail(obj: any): void {
    if(obj && obj.item && obj.item.children) {
      const { item: { children } } = obj
      this.getCourseDetail(children)
    } else {
      this.getCourseDetail([])
    }
  }

  private handleDetailDialogClose(): void {
    this.dialog.detail = false
  }

  private async created() {
  }
}
</script>
