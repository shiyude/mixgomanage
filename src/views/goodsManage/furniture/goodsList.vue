<template>
  <div class="goods_lists">
    <h1 class="hint_site">
      <!-- 当前位置：商品管理 > 商品列表 -->
      {{$t('current_position')}}： {{$t('good_manage')}} > {{$t('goods_lists')}}
    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input style="width:180px;" :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="seek"></el-input>
        <el-select v-if="lang === 'zh-CN'" v-model="classify" :placeholder="$t('verificate_list')" style="width:180px;" filterable>
          <el-option v-for="(v,k) in classifyList" :key="k" :value="v.id" :label="v.categoryName"></el-option>
        </el-select>
        <el-select v-if="lang === 'en_US'" v-model="classify" :placeholder="$t('verificate_list')" style="width:180px;" filterable>
          <el-option v-for="(v,k) in classifyList" :key="k" :value="v.id" :label="v.categoryNameEn"></el-option>
        </el-select>
        <el-select v-model="brand" :placeholder="$t('verificate_select_brand')" style="width:180px;" filterable>
          <el-option v-for="(v,k) in brandList" :key="k" :value="v.id" :label="v.brandName"></el-option>
        </el-select>
        <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
        <el-button @click="resetData">{{$t('reset_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addGood" type="primary" icon="el-icon-circle-plus">{{$t('add_goods')}}</el-button>
        <el-button @click="xz" type="primary" icon="el-icon-download" v-if="companyId!=32">{{$t('download')}}</el-button>
      </div>
    </div>

    <div class="parities manufacturers_head" v-if="companyId === 32">
      <el-row>
        <el-col :span="9"> {{$t('exchange')}}:
          <el-input style="width:250px;" :placeholder="$t('Set_the_dollar_exchange_rate')" v-model="parities"></el-input>
          <el-button @click="paritiesFn" type="primary">{{$t('submit')}}</el-button>
        </el-col>
        <el-col :span="15">
          <span class="file_name" v-if="fileName" :title="fileName">{{fileName}}
          </span>
          <input type="file" id="fileId" style="display:none" @change="fileChange" accept=".xls,.xlsx">
          <i class="el-icon-delete" style="margin-left:5px;cursor:pointer" @click="removeFile" v-if="fileName"></i>
          <el-button type="primary" @click="selectFile">{{$t('selectFile')}}</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="uploadFile">{{$t('import')}}</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportData">{{$t('export')}}</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="batchdelete">{{$t('Batchdelete')}}</el-button>
        </el-col>
      </el-row>

    </div>
    <!-- 表格 -->
    <div class="manufacturers_tab">
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('classify_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_logo')" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)">
          </template>
        </el-table-column>
        <template v-if="companyId!=32">
          <el-table-column :label="$t('small_program_code')" width="100">
            <template slot-scope="scope">
              <img :src="hostUrl+scope.row.wxQrcode" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.wxQrcode)">
            </template>
          </el-table-column>
          <el-table-column :label="$t('app_code')" width="100">
            <template slot-scope="scope">
              <img :src="hostUrl+scope.row.appQrcode" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.appQrcode)">
            </template>
          </el-table-column>
        </template>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="390">
          <template slot-scope="scope">
            <el-button size="mini" @click="toTop(scope.row)">{{$t("Up")}}</el-button>
            <el-button size="mini" @click="downGood(scope.row)" v-if="scope.row.status == 0">{{$t("Inactive")}}</el-button>
            <el-button size="mini" @click="upGood(scope.row)" v-else>{{$t("Active")}}</el-button>
            <el-button size="mini" @click="editGood(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="toQrcode(scope.row)" v-if="companyId!=32">{{$t('get_qrcode')}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging" v-show="tableData.length">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" :page-sizes="[10,20,50]" layout="total,sizes,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total"></el-pagination>
    </div>
    <div class="mask" v-if="progress.isShowProgress">
      <el-progress type="circle" :percentage="progress.percent" class="mask_progress" :status="progress.status"></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      seek: "", //关键字
      searchStr: "", //点击搜索生成的关键字
      classify: "", //分类id
      classifyId: "", //点击搜索生成的分类id
      brand: "", //品牌id
      brandId: "", //点击搜索生成的品牌id
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      lang: sessionStorage.getItem("lang") || "",
      classifyList: [], //分类数据
      brandList: [], //品牌数据
      selectedGoods: [],
      parities: "",
      fileName: "",
      progress: {
        percent: 0,
        isShowProgress: false,
        status: "text"
      },
      isUpResult: false,
      companyId:
        JSON.parse(window.sessionStorage.getItem("userInfo") || "{}")
          .companyId || ""
    };
  },
  mounted() {
    this.getListData();
    this.getGategory();
    this.getBrand();
    this.queryExchange();
  },
  watch: {
    isUpResult(now, old) {
      let self = this;
      if (now) {
        setTimeout(() => {
          self.progress.isShowProgress = false;
          self.progress.status = "text";
          self.progress.percent = 0;
          self.isUpResult = false;
        }, 1500);
      } else {
        return;
      }
    }
  },
  methods: {
    batchdelete() {
      if (!this.selectedGoods.length) {
        this.$message({
          message: this.$t("pleaseGoods"),
          type: "warning"
        });
        return;
      } else {
        let goodsId = this.selectedGoods.join();
        let _this = this;
        this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
          confirmButtonText: this.$t("submit"),
          cancelButtonText: this.$t("cancel"),
          type: "warning"
        }).then(() => {
          this.$Posting(this.$api.deleteGoods, {
            goodsId: goodsId
          }).then(res => {
            if (res.code == 0) {
              this.$notify.success({
                title: this.$t("alert_success_title"),
                message: this.$t("alert_success_delete_title")
              });
              this.selectedGoods = [];
              // 判断数据是否是最后一页的最后一条
              if (this.tableData.length == 1 && this.currentPage !== 1) {
                this.getListData(this.currentPage - 1);
              } else {
                this.getListData(this.currentPage);
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
      }
    },
    exportData() {
      window.location.href = this.$addDownUrl(this.$api.exportGoods, [], 3);
    },
    removeFile() {
      this.fileName = "";
      document.getElementById("fileId").value = "";
    },
    selectFile() {
      let domEle = document.getElementById("fileId");
      domEle.click();
    },
    fileChange() {
      let domEle = document.getElementById("fileId");
      if (domEle.files.length) {
        //选择了文件
        if (domEle.files[0].size / 1024 / 1024 > 10) {
          this.$message({
            message: this.$t("fileMoreThan10"),
            type: "warning"
          });
          domEle.value = "";
          return;
        } else {
          this.fileName = domEle.files[0].name;
        }
      } else {
        //取消了文件
        this.fileName = "";
      }
    },
    uploadFile() {
      if (!this.fileName) {
        return;
      }

      let formData = new FormData();
      let self = this;
      let userInfo = JSON.parse(
        window.sessionStorage.getItem("userInfo") || "{}"
      );
      formData.append("lang", window.sessionStorage.getItem("lang") || "zh-CN");
      formData.append("userId", userInfo.id | "");
      formData.append("token", userInfo.token || "");
      formData.append("companyId", userInfo.companyId || "");
      formData.append(
        "country",
        window.sessionStorage.getItem("country") || ""
      );
      formData.append("language", userInfo.language || "");
      formData.append("file", document.getElementById("fileId").files[0]);
      if (this.uploadParam) {
        for (let i = 0; i < this.uploadParam.length; i++) {
          formData.append(this.uploadParam[i].name, this.uploadParam[i].value);
        }
      }
      this.progress.isShowProgress = true;
      let timer = setInterval(() => {
        if (self.progress.percent == 85) {
          clearInterval(timer);
        }
        self.progress.percent += 5;
      }, Math.random() * 1000 + 100);
      this.$PostFormData(self.$api.importGoods, formData)
        .then(res => {
          if (res.code == 0) {
            this.currentPage = 1;
            this.getListData();
            this.removeFile();
            self.progress.percent = 100;
            self.progress.status = "success";
          } else {
            self.progress.status = "exception";
          }
          clearInterval(timer);
          self.isUpResult = true;
        })
        .catch(err => {
          self.progress.status = "exception";
          clearInterval(timer);
          self.isUpResult = true;
        });
    },
    paritiesFn() {
      if (this.parities) {
        this.$Get(this.$api.saveExchange, { exchange: this.parities }).then(
          res => {
            if (res.code == 0) {
              this.$notify.success({
                title: this.$t("alert_success_title"),
                message: this.$t("saveExchange")
              });
              this.queryExchange();
            }
          }
        );
      } else {
        this.$notify.error({
          title: this.$t("alert_fail_title"),
          message: this.$t("The_exchange_rate_cannot_be_short")
        });
      }
    },
    queryExchange() {
      this.$Get(this.$api.queryExchange, {}).then(res => {
        if (res.code == 0) {
          this.parities = res.datas.exchange;
        }
      });
    },
    handleSelectionChange(val) {
      this.selectedGoods = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selectedGoods.push(val[i].id);
        }
      } else {
        return;
      }
    },
    xz() {
      if (this.selectedGoods.length) {
        window.location.href = this.$addDownUrl(
          this.$api.downGoodsQrcode,
          this.selectedGoods
        );
      } else {
        this.$message({
          message: this.$t("pleaseGoods"),
          type: "warning"
        });
        return;
      }
    },
    //生成二维码
    toQrcode(row) {
      let _this = this;
      console.log(row);
      this.$Posting(this.$api.genGoodsQrcode, {
        goodsId: row.id,
        logo: row.logo,
        goodsName: row.goodsName
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("operate_success_title")
          });
          this.getListData(this.currentPage);
        } else {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("operate_fail_title")
          });
          return false;
        }
      });
    },
    //下架
    downGood(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("IsitInactive"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.updateGoodsStatus, {
          goodsId: id,
          status: 1
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.getListData(this.currentPage);
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("operate_fail_title")
            });
            return false;
          }
        });
      });
    },
    //上架
    upGood(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("Isitactive"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.updateGoodsStatus, {
          goodsId: id,
          status: 0
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.getListData(this.currentPage);
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("operate_fail_title")
            });
            return false;
          }
        });
      });
    },
    //置顶
    toTop(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_to_top"), this.$t("to_top"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.setTopGoods, {
          goodsId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.getListData(this.currentPage);
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("operate_fail_title")
            });
            return false;
          }
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //添加商品
    addGood() {
      this.$router.replace({
        path: "furniture.html"
      });
    },
    //编辑商品
    editGood(data) {
      let { id } = data;
      sessionStorage.setItem("editGoodsMsg", JSON.stringify(data));
      this.$router.replace({
        path: "furniture.html",
        query: {
          id: id
        }
      });
    },
    //删除数据的方法
    handleDelete(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteGoods, {
          goodsId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.currentPage !== 1) {
              this.getListData(this.currentPage - 1);
            } else {
              this.getListData(this.currentPage);
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
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getListData(val);
    },
    //获取列表数据
    getListData(page = 1) {
      this.$Posting(this.$api.queryGoodsList, {
        goodsName: this.searchStr,
        brandId: this.brandId,
        categoryId: this.classifyId,
        pageNo: page,
        pageSize: this.pageSize
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
      this.currentPage = 1; //page置为1
      this.searchStr = this.seek;
      this.classifyId = this.classify;
      this.brandId = this.brand;
      this.getListData();
    },
    //重置数据
    resetData() {
      this.currentPage = 1; //page置为1
      this.seek = "";
      this.classify = "";
      this.brand = "";
      this.searchStr = "";
      this.classifyId = "";
      this.brandId = "";
      this.getListData();
    },
    // 获取商品分类列表
    getGategory() {
      this.$Get(this.$api.queryGoodsGategoryList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.classifyList = res.datas.lists;
      });
    },
    //获取品牌列表
    getBrand() {
      this.$Posting(this.$api.queryBrandList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.brandList = res.datas.lists;
      });
    }
  }
};
</script>

<style lang="less"  scoped>
.goods_lists {
  .manufacturers_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 38%;
      text-align: left;
    }
  }
  .file_name {
    font-size: 13px;
    padding-left: 10px;
    color: #000;
    display: inline-block;
    max-width: 240px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
  }
  .manufacturers_tab {
    margin-top: 15px;
  }
  .el-select {
    width: 100%;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.3);
    .mask_progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

