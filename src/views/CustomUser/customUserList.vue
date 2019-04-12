<template>
  <div class="customUsetList">
    <h1 class="hint_site">
      <!-- 当前位置：定制客户管理 > 定制客户列表 -->
      {{$t('current_position')}}： {{$t('custom_customer_manage')}} > {{$t('custom_customer_list')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_mark')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="getQueryCompanyList">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button type="primary" @click="addCustomUser" icon="el-icon-circle-plus">{{$t('add_customer')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="CustomUserList" border style="width: 100%">
        <el-table-column width="180" :label="$t('create_time')">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('name')">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName }}</span>
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
        <el-table-column :label="$t('user_add')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactAddr }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('company_desc')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactCustomUser(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteCustomUser(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="$t('edit_customer_message')" :visible.sync="isDialog" width="1000px" @close="clearValidate" center>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label-width="180px" :label="$t('customer_name')" prop="companyName">
              <el-input v-model.trim="ruleForm.companyName" :placeholder="$t('verificate_customer_name')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="180px" :label="$t('user_name')" prop="contactName">
              <el-input v-model.trim="ruleForm.contactName" :placeholder="$t('verificate_user_name')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label-width="180px" :label="$t('user_phone')" prop="contactPhone">
              <el-input v-model.trim="ruleForm.contactPhone" :placeholder="$t('verificate_user_phone')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="180px" :label="$t('user_email')" prop="contactEmail">
              <el-input v-model.trim="ruleForm.contactEmail" :placeholder="$t('verificate_user_email')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label-width="180px" :label="$t('user_add')" prop="contactAddr">
              <el-input v-model.trim="ruleForm.contactAddr" :placeholder="$t('verificate_user_add')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="180px" :label="$t('login.verificate_country')" prop="countrys">
              <el-select style="width: 100%;" v-model="ruleForm.countrys" multiple :placeholder="$t('login.verificate_country')">
                <el-option v-for="item in CountrysData" :key="item.id" :label="item.countryName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label-width="180px" prop="imgs">
              <span slot="label">{{$t('customImg')}}<br/>(325*165)</span>
              <uploader :backData="ruleForm.imgs" :id="'I1'" :mixLength='1'></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100px" :label="$t('language')" prop="imgs">
              <el-select style="width: 100%;" v-model="ruleForm.language" :placeholder="$t('language')">
                <el-option v-for="item in languageData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <el-form-item label-width="180px" :label="$t('company_desc')" prop="description">
              <el-input type="textarea" :rows="2" v-model.trim="ruleForm.description" :placeholder="$t('verificate_company_desc')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('submit')}}</el-button>
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
      seek: "",
      CustomUserList: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      isDialog: false,
      ruleForm: {
        companyName: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        contactAddr: "",
        description: "",
        countrys: [],
        imgs: [],
        language: ""
      },
      languageData: [
        {
          id: 1,
          name: this.$t("switch.zh")
        },
        {
          id: 2,
          name: this.$t("switch.en")
        },
        {
          id: 3,
          name: this.$t("switch.all")
        }
      ],
      CountrysData: [],
      activeId: null,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      rules: {
        companyName: [
          {
            required: true,
            message: this.$t("verificate_customer_name"),
            trigger: "blur"
          }
        ],
        contactName: [
          {
            required: true,
            message: this.$t("verificate_user_name"),
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
        description: [
          {
            required: true,
            message: this.$t("verificate_company_desc"),
            trigger: "blur"
          }
        ],
        countrys: [
          {
            required: true,
            message: this.$t("login.verificate_country"),
            trigger: "blur"
          }
        ],
        imgs: [
          {
            required: true,
            message: this.$t("upCustomImg"),
            trigger: "blur"
          }
        ],
        language: [
          {
            required: true,
            message: this.$t("language"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getQueryCompanyList();
    this.getqueryCountrys();
  },
  methods: {
    getqueryCountrys() {
      this.$Get(this.$api.queryCountrys, {}).then(res => {
        if (res.code == 0) {
          this.CountrysData = res.datas;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        let self = this;
        if (valid) {
          let data = {
            companyName: self.ruleForm.companyName,
            contactName: self.ruleForm.contactName,
            contactPhone: self.ruleForm.contactPhone,
            contactEmail: self.ruleForm.contactEmail,
            contactAddr: self.ruleForm.contactAddr,
            description: self.ruleForm.description,
            countrys: self.ruleForm.countrys.join(","),
            imgs: self.ruleForm.imgs[0].url,
            language: self.ruleForm.language
          };
          console.log(data);
          self
            .$Post(self.$api.saveCompany, {
              ...data,
              editCompanyId: self.activeId
            })
            .then(res => {
              if (res.code == 0) {
                self.isDialog = false;
                let newUploadImg = self.$changeUploadImg([
                  ...self.ruleForm.imgs
                ]); //获取提交的图片数组
                self.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
                self.getQueryCompanyList();
                self.$notify({
                  title: self.$t("alert_success_title"),
                  message: self.$t("edit_finish_title"),
                  type: "success"
                });
                self.activeId = null;
              } else {
                self.$notify.error({
                  title: "fail",
                  message: res.msg
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    clearValidate() {
      this.$refs.ruleForm.clearValidate();
    },
    addCustomUser() {
      // 新建
      this.isDialog = true;
      this.activeId = null;
      this.ruleForm = {
        companyName: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        contactAddr: "",
        description: "",
        countrys: [],
        imgs: [],
        language: ""
      };
    },
    redactCustomUser(row) {
      console.log(row.id);
      // 编辑
      this.activeId = row.id;
      this.ruleForm = {
        companyName: row.companyName,
        contactName: row.contactName,
        contactPhone: row.contactPhone,
        contactEmail: row.contactEmail,
        contactAddr: row.contactAddr,
        description: row.description,
        countrys: [],
        imgs: [
          {
            src: this.hostUrl + row.imgs,
            url: row.imgs
          }
        ],
        language: row.language
      };
      this.isDialog = true;
      this.queryCountry(row.id);
    },
    queryCountry(id) {
      this.$Get(this.$api.queryCompanyCountrys, { editCompanyId: id }).then(
        res => {
          if (res.code == 0) {
            for (let i = 0; i < res.datas.length; i++) {
              this.ruleForm.countrys.push(res.datas[i].id);
            }
          }
        }
      );
    },
    deleteCustomUser(row) {
      // 删除
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          this.$Get(this.$api.deleteCompany, { editCompanyId: row.id }).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("alert_success_delete_title")
                });
                if (this.currentPage != 1 && this.CustomUserList.length == 1) {
                  this.currentPage = this.currentPage - 1;
                }
                this.getQueryCompanyList();
              } else {
                this.$notify.error({
                  title: "fail",
                  message: res.msg
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel_delete")
          });
        });
    },
    handleCurrentChange(val) {
      // 分页
      this.currentPage = val;
      this.getQueryCompanyList();
    },
    getQueryCompanyList() {
      this.$Get(this.$api.queryCompanyList, {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        companyName: this.seek
      }).then(res => {
        if (res.code == 0) {
          this.CustomUserList = res.datas.lists;
          this.total = res.datas.count;
          // console.log(this.CustomUserList)
        }
      });
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>

<style lang="less" >
.customUsetList {
  .appFind_conter_input {
    margin-top: 15px;
    background: #fff;
    padding: 10px;
    .add_find_btn {
      text-align: center;
    }
  }
  .find_tab {
    margin-top: 15px;
    .cell {
      img {
        height: 100%;
      }
    }
    .find_list_img {
      height: 40px;
    }
  }
  .tree_head {
    color: red;
    margin-bottom: 10px;
    display: block;
  }
}
</style>