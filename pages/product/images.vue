<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Product Image Uploader</h2>
        <v-card outlined>
          <v-toolbar flat class="mb-n4">
            <v-row class="mb-n8">
              <v-col cols="6" sm="4" md="4">
                <v-text-field
                  v-model="form.search"
                  placeholder="Search By SKU"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-btn
                  color="info"
                  @click="handleSearch"
                  :disabled="isSearchBtnDisabled"
                >
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </v-toolbar>
          <v-card-text class="pt-0">
            <v-row>
              <v-col class="mt-4 mb-n8">
                <v-text-field
                  v-model="form.selected.sku"
                  placeholder="Selected Product SKU"
                  readonly
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
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
              hide-default-footer
            >
            </v-data-table>
            <v-row class="mt-4" v-show="form.selected.sku !== ''">
              <v-col cols="12" md="6">
                <v-card>
                  <v-img
                    :src="form.display.imgCover"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                  >
                    <v-card-subtitle v-text="'Product Cover Image'"></v-card-subtitle>
                  </v-img>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn icon>
                      <v-icon>mdi-close</v-icon>
                    </v-btn> -->
                    <v-file-input
                      accept="image/png, image/jpeg, image/webp"
                      prepend-icon="mdi-upload"
                      truncate-length="10"
                      placeholder="Select Image"
                      :show-size="1000"
                      :clearable="false"
                      v-model="form.upload.imgCover"
                    ></v-file-input>
                    <v-btn
                      color="info"
                      @click="handleSubmit('img_main')"
                      class="ml-4"
                      :disabled="!form.upload.imgCover"
                    >
                      submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card>
                  <v-img
                    :src="form.display.imgSubOne"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                  >
                    <v-card-subtitle v-text="'Product Sub Image 1'"></v-card-subtitle>
                  </v-img>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn icon>
                      <v-icon>mdi-close</v-icon>
                    </v-btn> -->
                    <v-file-input
                      accept="image/png, image/jpeg, image/webp"
                      prepend-icon="mdi-upload"
                      truncate-length="10"
                      placeholder="Select Image"
                      :show-size="1000"
                      :clearable="false"
                      v-model="form.upload.imgSubOne"
                    ></v-file-input>
                    <v-btn
                      color="info"
                      @click="handleSubmit('img_sub')"
                      class="ml-4"
                      :disabled="!form.upload.imgSubOne"
                    >
                      submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card>
                  <v-img
                    :src="form.display.imgSubTwo"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                  >
                    <v-card-subtitle v-text="'Product Sub Image 2'"></v-card-subtitle>
                  </v-img>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn icon>
                      <v-icon>mdi-close</v-icon>
                    </v-btn> -->
                    <v-file-input
                      accept="image/png, image/jpeg, image/webp"
                      prepend-icon="mdi-upload"
                      truncate-length="10"
                      placeholder="Select Image"
                      :show-size="1000"
                      :clearable="false"
                      v-model="form.upload.imgSubTwo"
                    ></v-file-input>
                    <v-btn
                      color="info"
                      @click="handleSubmit('img_sub_second')"
                      class="ml-4"
                      :disabled="!form.upload.imgSubTwo"
                    >
                      submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card>
                  <v-img
                    :src="form.display.imgSubThree"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                  >
                    <v-card-subtitle v-text="'Product Sub Image 3'"></v-card-subtitle>
                  </v-img>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn icon>
                      <v-icon>mdi-close</v-icon>
                    </v-btn> -->
                    <v-file-input
                      accept="image/png, image/jpeg, image/webp"
                      prepend-icon="mdi-upload"
                      truncate-length="10"
                      placeholder="Select Image"
                      :show-size="1000"
                      :clearable="false"
                      v-model="form.upload.imgSubThree"
                    ></v-file-input>
                    <v-btn
                      color="info"
                      @click="handleSubmit('img_sub_third')"
                      class="ml-4"
                      :disabled="!form.upload.imgSubThree"
                    >
                      submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { $apiPlatform } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Component({
  layout: 'admin'
})
export default class ProductImages extends Vue {
  private async handleSubmit(field: string) {
    const fieldMap: Record<string, string> = {
      img_main: 'imgCover',
      img_sub: 'imgSubOne',
      img_sub_second: 'imgSubTwo',
      img_sub_third: 'imgSubThree'
    }
    const _file = this.form.upload[fieldMap[field]]
    if (_file && this.form.selected.id) {
      const _form = new FormData()
      _form.append('images', _file)
      const _upload = await $apiPlatform.post('/image', _form)
      const _uploadRes = httpResponseMapper(_upload)?.image
      const _url = _uploadRes && _uploadRes.length ? _uploadRes[0] : ''
      const _req = await $apiPlatform.post('/product/images', {
        id: this.form.selected.id,
        fieldName: field,
        value: _url
      })
      const _res = httpResponseMapper(_req)?.data
      if (_res && _res.length) {
        this.snackbar.text = 'Image Upload Success.'
        this.snackbar.toggle = true
      }
    }
  }

  private createImageBlob(file: any) {
    const binaryData = []
    binaryData.push(file)
    return window.URL.createObjectURL(new Blob(binaryData, { type: 'application/zip' }))
  }

  @Watch('form.upload.imgCover')
  onImgCoverChange(newVal: any) {
    if (newVal) {
      this.form.display.imgCover = this.createImageBlob(this.form.upload.imgCover)
    } else {
      this.form.display.imgCover = this.form.selected.imgCover
    }
  }

  @Watch('form.upload.imgSubOne')
  onImgSubOneChange(newVal: any) {
    if (newVal) {
      this.form.display.imgSubOne = this.createImageBlob(this.form.upload.imgSubOne)
    } else {
      this.form.display.imgSubOne = this.form.selected.imgSubOne
    }
  }

  @Watch('form.upload.imgSubTwo')
  onImgSubTwoChange(newVal: any) {
    if (newVal) {
      this.form.display.imgSubTwo = this.createImageBlob(this.form.upload.imgSubTwo)
    } else {
      this.form.display.imgSubTwo = this.form.selected.imgSubTwo
    }
  }

  @Watch('form.upload.imgSubThree')
  onImgSubThreeChange(newVal: any) {
    if (newVal) {
      this.form.display.imgSubThree = URL.createObjectURL(this.form.upload.imgSubThree)
    } else {
      this.form.display.imgSubThree = this.form.selected.imgSubThree
    }
  }

  private form: any = {
    search: '',
    selected: {
      id: '',
      sku: '',
      imgCover: '',
      imgSubOne: '',
      imgSubTwo: '',
      imgSubThree: ''
    },
    display: {
      imgCover: '',
      imgSubOne: '',
      imgSubTwo: '',
      imgSubThree: ''
    },
    upload: {
      imgCover: '',
      imgSubOne: '',
      imgSubTwo: '',
      imgSubThree: ''
    }
  }

  private get isSearchBtnDisabled() {
    return this.form.search === ''
  }

  private async handleSearch() {
    await this.setProducts()
  }

  private snackbar = {
    toggle: false,
    timeout: 2000,
    closeText: 'close',
    text: ''
  }

  private headers: Array<any> = [
    { text: 'SKU', value: 'sku', align: 'start', sortable: false },
    { text: 'Title', value: 'description_main', align: 'start', sortable: false }
  ]

  private tableSearch = ''

  private tableOptions: any = {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['is_shelf', 'is_purchase_allowed', 'is_featured', 'is_recommended'],
      sortDesc: [true],
      multiSort: true,
      mustSort: false
  }

  private handleRowClick(row: any, col: any) {
    const { id, sku, img_main, img_sub, img_sub_second, img_sub_third } = row
    this.form.selected = {
      id,
      sku,
      imgCover: img_main,
      imgSubOne: img_sub,
      imgSubTwo: img_sub_second,
      imgSubThree: img_sub_third
    }
    this.form.display = {
      imgCover: img_main,
      imgSubOne: img_sub,
      imgSubTwo: img_sub_second,
      imgSubThree: img_sub_third
    }
  }

  private tableData: any[] = []

  private async getProducts() {
    const _req = await $apiPlatform.get(`/product/sku?value=${this.form.search}`)
    return httpResponseMapper(_req)?.data
  }

  private async setProducts() {
    try {
      const _rows = await this.getProducts()
      if (_rows && _rows.length) {
        this.tableData = [..._rows]
      }
    } catch (e: unknown) {

    }
  }
}
</script>
