<template>
  <div class="manufacturers">
    <h1 class="hint_site">
      <!-- 当前位置：商家管理 > 楼盘管理 -->
      {{$t('current_position')}}： {{$t('business_manage')}} > {{$t('building_manage')}}
    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input style="width:300px;" :placeholder="$t('search_building')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addData" type="primary" icon="el-icon-circle-plus">{{$t('add_building')}}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="manufacturers_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('building_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.houseName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_of_developer')">
          <template slot-scope="scope">
            <span>{{ scope.row.developersName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_addr')">
          <template slot-scope="scope">
            <span>{{ scope.row.province + scope.row.city + scope.row.district }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('website')">
          <template slot-scope="scope">
            <span>{{ scope.row.website }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_desc')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_logo')" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="320">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="goHouse(scope.row)">{{$t('family_type')}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="isDialog" @close="clearValidate" width="1000px" center>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('building_name')" prop="name">
              <el-input v-model.trim="ruleForm.name" :placeholder="$t('building_name')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('website')" prop="website">
              <el-input v-model.trim="ruleForm.website" :placeholder="$t('website')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('developers')" prop="developers">
              <el-select style="width:100%;" v-model="ruleForm.developers" :placeholder="$t('verificate_select_developer')">
                <el-option v-for="item in developersList" :key="item.id" :label="item.developersName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('province')" prop="province">
              <el-select style="width:100%;" @change="getCity(ruleForm.province,'1')" v-model="ruleForm.province" :placeholder="$t('verificate_select_province')">
                <el-option v-for="item in provinceData" :key="item.proId" :label="item.proName" :value="item.proId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('city')" prop="city">
              <el-select style="width:100%;" :no-data-text="$t('verificate_select_province1')" @change="getRegion(ruleForm.city,'1')" v-model="ruleForm.city" :placeholder="$t('verificate_select_city')">
                <el-option v-for="item in cityData" :key="item.cityId" :label="item.cityName" :value="item.cityId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('area')" prop="region">
              <el-select style="width:100%;" :no-data-text="$t('verificate_select_city1')" v-model="ruleForm.region" :placeholder="$t('verificate_select_area')">
                <el-option v-for="item in regionData" :key="item.id" :label="item.disName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('building_scale')" prop="logo" :rules="{
                type:'array',required: true, message: $t('verificate_building_scale'), trigger: 'blur'
              }">
              <uploader :backData="ruleForm.logo" :id="'logo0'" :mixLength='1' :folder="'unit'"></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('building_imgs')" prop="img" :rules="{
                type:'array',required: true, message: $t('verificate_building_imgs'), trigger: 'blur'
              }">
              <uploader :backData="ruleForm.img" :id="'img1'" :mixLength='1' :folder="'unit'"></uploader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('building_desc')" prop="desc">
              <el-input type="textarea" v-model.trim="ruleForm.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog=false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t("submit")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploader from "@/components/uploader.vue";
export default {
  data() {
    return {
      tableData: [],
      isDialog: false,
      ruleForm: {
        name: "",
        city: "",
        region: "",
        province: "",
        website: "",
        developers: "",
        desc: "",
        img: [],
        logo: [],
        houseId: ""
      },
      seek: "", //关键字
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      dialogTitle: "", //弹框的title
      selectData: null, //添加时selectData置空，编辑时给selectData赋值
      developersList: [], //开发商select数据
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      provinceData: [], // 省份
      cityData: [], // 城市
      regionData: [], // 区域
      rules: {
        name: [
          {
            required: true,
            message: this.$t("verificate_building_name"),
            trigger: "blur"
          }
        ],
        city: [
          {
            required: true,
            message: this.$t("verificate_select_city"),
            trigger: "blur"
          }
        ],
        region: [
          {
            required: true,
            message: this.$t("verificate_select_area"),
            trigger: "blur"
          }
        ],
        province: [
          {
            required: true,
            message: this.$t("verificate_select_province"),
            trigger: "blur"
          }
        ],
        website: [
          {
            required: true,
            message: this.$t("verificate_developer_website"),
            trigger: "blur"
          }
        ],
        developers: [
          {
            required: true,
            message: this.$t("verificate_select_developer"),
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: this.$t("verificate_building_desc"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getListData();
    this.getProvince();
    this.getDevelopers();
  },
  methods: {
    getProvince() {
      // 获得省份
      this.$Get(this.$api.queryProvince, {}).then(res => {
        if (res.code == 0) {
          this.provinceData = res.datas;
        }
      });
    },
    getCity(vla, type = null) {
      // 获得城市
      if (type) {
        this.ruleForm.city = "";
        this.ruleForm.region = "";
      }
      this.$Get(this.$api.queryCity, { provinceId: vla }).then(res => {
        if (res.code == 0) {
          this.cityData = res.datas;
        }
      });
    },
    getRegion(vla, type = null) {
      // 获得区域
      if (type) {
        this.ruleForm.region = "";
      }
      this.$Get(this.$api.queryDistrict, { cityId: vla }).then(res => {
        if (res.code == 0) {
          this.regionData = res.datas;
        }
      });
    },
    getDevelopers() {
      // 获得开发商
      this.$Get(this.$api.queryDevelopersList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        if (res.code == 0) {
          this.developersList = res.datas.lists;
        }
      });
    },
    //编辑时的显示情况
    handleEdit(index, row) {
      this.isDialog = true;
      this.dialogTitle = this.$t("edit_building");
      this.ruleForm = {
        name: row.houseName,
        city: row.cityId,
        region: row.districtId,
        province: row.provinceId,
        website: row.website,
        developers: row.developersId,
        desc: row.detail,
        logo: [
          {
            src: this.hostUrl + row.logo,
            url: row.logo
          }
        ],
        img: [
          {
            src: this.hostUrl + row.imgs,
            url: row.imgs
          }
        ],
        houseId: row.id
      };
      this.getCity(row.provinceId);
      this.getRegion(row.cityId);
    },
    //添加时的显示情况
    addData() {
      this.isDialog = true;
      this.dialogTitle = this.$t("add_building");
      this.resetForm();
    },
    clearValidate() {
      this.$refs.ruleForm.clearValidate();
    },
    //删除数据的方法
    handleDelete(index, row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteHouse, {
          houseId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }
            this.getListData();
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
            return false;
          }
        });
      });

      console.log(index, row);
    },
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListData();
    },
    //获取列表数据
    getListData() {
      this.$Posting(this.$api.queryHouseList, {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        houseName: this.seek
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
          this.total = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.errcode
          });
          return false;
        }
      });
    },
    //通过关键字搜索
    searchData() {
      this.currentPage = 1;
      this.getListData();
    },
    //提交数据
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let dataObj = {
            houseId: _this.ruleForm.houseId,
            houseName: _this.ruleForm.name,
            developersId: _this.ruleForm.developers,
            provinceId: _this.ruleForm.province,
            cityId: _this.ruleForm.city,
            districtId: _this.ruleForm.region,
            detail: _this.ruleForm.desc,
            website: _this.ruleForm.website,
            logo: _this.ruleForm.logo[0].url,
            imgs: _this.ruleForm.img[0].url
          };
          if (dataObj.houseId === "") {
            this.submitData(dataObj, 0);
          } else {
            this.submitData(dataObj, 1);
          }
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.ruleForm = {
        name: "",
        city: "",
        region: "",
        province: "",
        website: "",
        developers: "",
        desc: "",
        logo: [],
        img: [],
        houseId: ""
      };
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      this.$Posting(this.$api.saveHouse, {
        ...jsonData
      }).then(res => {
        if (res.code == 0) {
          let newUploadImg = _this.$changeUploadImg([
            ..._this.ruleForm.logo,
            ..._this.ruleForm.img
          ]); //获取提交的图片数组
          _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          _this.resetForm();
          _this.isDialog = false;
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: message
          });
          _this.getListData();
        } else {
          _this.$notify.error({
           title: this.$t("alert_fail_title"),
            message: res.msg
          });
        }
      });
    },
    goHouse(row) {
      let { id } = row;
      this.$router.push({
        path: "houseType.html",
        query: {
          id: id
        }
      });
    }
  },
  components: {
    uploader
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>

<style lang="less"  scoped>
.manufacturers {
  .manufacturers_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
      text-align: left;
    }
  }
  .manufacturers_tab {
    margin-top: 15px;
  }
}
</style>
