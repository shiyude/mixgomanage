<template>
  <div class="shopRegulate">
    <h1 class="hint_site">
      <!-- 当前位置：商家管理 > 门店列表 -->
      {{$t('current_position')}}： {{$t('business_manage')}} > {{$t('store_list')}}
    </h1>
    <div class="shopRegulate_head clearfix">
      <div class="left">
        <el-input style="width:300px;" :placeholder="$t('search_store')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="GetSeek">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addShop" type="primary" icon="el-icon-circle-plus">{{$t('add_store')}}</el-button>
        <el-button @click="xz" type="primary" icon="el-icon-download">{{$t('download')}}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="shopRegulate_tab">
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column :label="$t('store_name')">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              {{scope.row.storeName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_phone')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('family_agent')">
          <template slot-scope="scope">
            <span>{{ scope.row.retailerName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('family_brand')">
          <template slot-scope="scope">
            <span>{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('store_logo')">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('small_program_code')" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.wxQrcode" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.wxQrcode)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('app_code')" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.appQrcode" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.appQrcode)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="410">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit( scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="editorShop(scope.row.id)">{{$t("see_store_classify")}}</el-button>
            <el-button size="mini" @click="toQrcode(scope.row)">{{$t('get_qrcode')}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="Page" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('set_store')" :visible.sync="isDialog" :before-close="closeDialog" width="900px" @close="clearValidate" center>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('store_name')" prop="storeName">
              <el-input v-model.trim="ruleForm.storeName" :placeholder="$t('verificate_store_name')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('user_name')" prop="contactName">
              <el-input v-model.trim="ruleForm.contactName" :placeholder="$t('verificate_user_name')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('user_phone')" prop="contactPhone">
              <el-input v-model.trim="ruleForm.contactPhone" :placeholder="$t('verificate_user_phone')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('user_email')" prop="contactEmail">
              <el-input v-model.trim="ruleForm.contactEmail" :placeholder="$t('verificate_user_email')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('store_add')" prop="contactAddr">
              <el-input v-model.trim="ruleForm.contactAddr" :placeholder="$t('verificate_user_add')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('business_hours')" prop="working">
              <!-- <el-time-picker style="width:100%;"
                is-range
                format="HH:mm"
                v-model="ruleForm.working"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker> -->
              <el-input v-model.trim="ruleForm.working" :placeholder="$t('verificate_business_hours')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('select_agent')" prop="retailerId">
              <el-select @change="getBrand(ruleForm.retailerId,'1')" style="width:100%;" v-model="ruleForm.retailerId" :placeholder="$t('verificate_select_agent')">
                <el-option v-for="item in agents" :key="item.id" :label="item.retailerName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('select_brand')" prop="brandId">
              <el-select style="width:100%;" v-model="ruleForm.brandId" :no-data-text="$t('verificate_select_agent1')" :placeholder="$t('verificate_select_brand')">
                <el-option v-for="item in brands" :key="item.id" :label="item.brandName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('store_scale')" prop="logo">
              <uploader :backData="ruleForm.logo" :id="'logo0'" :mixLength='1' :folder="'logo'"></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('store_imgs')" prop="imgs">
              <uploader :backData="ruleForm.imgs" :id="'imgs0'" :mixLength='1' :folder="'imgs'"></uploader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="submitForms('ruleForm')">{{$t("submit")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploader from "@/components/uploader.vue";
export default {
  components: {
    uploader
  },
  data() {
    return {
      selectedShops: [],
      tableData: [],
      seek: "",
      pageSize: 10,
      Page: 1,
      total: 0,
      isDialog: false,
      ruleForm: {
        logo: [],
        imgs: [],
        retailerId: "",
        brandId: null
      },
      agents: [],
      brands: [],
      rules: {
        storeName: [
          {
            required: true,
            message: this.$t("verificate_store_name"),
            trigger: "blur"
          }
        ],
        contactName: [
          {
            required: true,
            message: this.$t("verificate_store_name"),
            trigger: "blur"
          }
        ],
        contactPhone: [
          {
            required: true,
            message: this.$t("verificate_user_phone"),
            trigger: "blur"
          }
        ],
        contactEmail: [
          {
            required: true,
            message: this.$t("verificate_user_email"),
            trigger: "blur"
          }
        ],
        contactAddr: [
          {
            required: true,
            message: this.$t("verificate_user_add"),
            trigger: "blur"
          }
        ],
        retailerId: [
          {
            required: true,
            message: this.$t("verificate_select_agent"),
            trigger: "change"
          }
        ],
        brandId: [
          {
            required: true,
            message: this.$t("verificate_select_brand"),
            trigger: "change"
          }
        ],
        logo: [
          {
            type: "array",
            required: true,
            message: this.$t("verificate_store_scale"),
            trigger: "change"
          }
        ],
        imgs: [
          {
            type: "array",
            required: true,
            message: this.$t("verificate_store_imgs"),
            trigger: "change"
          }
        ],
        working: [
          {
            required: true,
            message: this.$t("verificate_business_hours"),
            trigger: "blur"
          }
        ]
      },
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  mounted() {
    this.getShop();
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedShops = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selectedShops.push(val[i].id);
        }
      } else {
        return;
      }
    },
    xz() {
      if (this.selectedShops.length) {
        window.location.href = this.$addDownUrl(
          this.$api.downStoreQrcode,
          this.selectedShops,
          2
        );
      } else {
        return;
      }
    },
    //生成二维码
    toQrcode(row) {
      let _this = this;
      console.log(row);
      this.$Posting(this.$api.genStoreQrcode, {
        storeId: row.id,
        logo: row.logo,
        storeName:row.storeName
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("operate_success_title")
          });
          this.getShop();
        } else {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("operate_fail_title")
          });
          return false;
        }
      });
    },
    clearValidate() {
      this.$refs.ruleForm.clearValidate();
    },
    getShop() {
      // 获取门店列表
      let data = {
        pageNo: this.Page,
        pageSize: this.pageSize,
        storeName: this.seek
      };
      this.$Get(this.$api.queryRetailerStoreList, { ...data }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
          this.total = res.datas.count;
          // console.log(res)
        }
      });
    },
    GetSeek() {
      this.Page = 1;
      this.getShop();
    },
    getRetailer() {
      // 获取代理商
      this.$Get(this.$api.queryRetailerList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        if (res.code == 0) {
          this.agents = res.datas.lists;
          this.brands = [];
        }
      });
    },
    getBrand(val, type = null) {
      // 获取代理商下的品牌
      if (type) {
        this.ruleForm.brandId = null;
      }
      let data = {
        pageNo: 1,
        pageSize: 100,
        retailerId: val,
        action: "query"
      };
      this.$Get(this.$api.queryRetailerBrand, { ...data }).then(res => {
        if (res.code == 0) {
          this.brands = res.datas.lists;
          console.log(this.brands);
        }
      });
    },
    submitForms(formName) {
      // 提交门店信息
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            storeId: this.ruleForm.storeId,
            retailerId: this.ruleForm.retailerId,
            brandId: this.ruleForm.brandId,
            storeName: this.ruleForm.storeName,
            contactName: this.ruleForm.contactName,
            contactPhone: this.ruleForm.contactPhone,
            contactEmail: this.ruleForm.contactEmail,
            contactAddr: this.ruleForm.contactAddr,
            working: this.ruleForm.working,
            logo: this.ruleForm.logo[0].url,
            imgs: this.ruleForm.imgs[0].url
            // startTime: this.$hourFormat(this.ruleForm.working[0]),
            // endTime: this.$hourFormat(this.ruleForm.working[1])
          };
          console.log(data);
          this.$Posting(this.$api.saveRetailerStore, { ...data }).then(res => {
            if (res.code == 0) {
              let newUploadImg = _this.$changeUploadImg([
                ..._this.ruleForm.logo,
                ..._this.ruleForm.imgs
              ]); //获取提交的图片数组
              _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
              this.$notify.success({
                title: this.$t("alert_success_title"),
                message: ""
              });
              this.isDialog = false;
              this.getShop();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleEdit(row) {
      // 编辑
      console.log(row);
      this.getRetailer();
      this.getBrand(row.retailerId);
      this.isDialog = true;
      this.ruleForm = {
        storeName: row.storeName,
        contactName: row.contactName,
        contactPhone: row.contactPhone,
        contactEmail: row.contactEmail,
        contactAddr: row.contactAddr,
        retailerId: row.retailerId,
        brandId: row.brandId,
        working: row.working,
        storeId: row.id,
        logo: [
          {
            src: this.hostUrl + row.logo,
            url: row.logo
          }
        ],
        imgs: [
          {
            src: this.hostUrl + row.imgs,
            url: row.imgs
          }
        ]
      };
    },
    addShop() {
      if (this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
      this.isDialog = true;
      this.getRetailer();
      this.ruleForm = {
        storeName: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        contactAddr: "",
        retailerId: "",
        brandId: null,
        working: "",
        storeId: "",
        logo: [],
        imgs: []
      };
    },
    handleDelete(row) {
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteRetailerStore, {
          storeId: row.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.Page > 1) {
              this.Page = this.Page - 1;
              this.getShop();
            } else {
              this.getShop();
            }
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
            return false;
          }
        });
      });
    },
    editorShop(id) {
      this.$router.push({
        path: "shopClassify.html",
        query: {
          type: id
        }
      });
    },
    handleCurrentChange(val) {
      this.Page = val;
      this.getShop();
    },
    closeDialog() {
      this.isDialog = false;
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>
<style lang="less" >
.shopRegulate {
  .shopRegulate_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
      text-align: left;
    }
  }
  .shopRegulate_tab {
    margin-top: 15px;
  }
  .el-date-editor .el-range-separator {
    width: 7%;
  }
}
</style>
