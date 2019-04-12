<template>
  <div class="shopClassify">
    <h1 class="hint_site">
      <!-- 当前位置：商家管理 > 门店列表 > 门店自定义分类 -->
      {{$t('current_position')}}： {{$t('business_manage')}} > {{$t('store_list')}} > {{$t('store_custom_classify')}}
    </h1>
    <div class="manufacturers_head clearfix">
      <template v-if="editableTabsValue==1">
        <div class="left">
          <el-input style="width:300px;" :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="goodseek">
          </el-input>
          <el-button @click="searchGoodData">{{$t('seach_btn')}}</el-button>
        </div>
        <div class="right">
          <el-button @click="addGoodsData" type="primary" icon="el-icon-circle-plus">{{$t('add_goods')}}</el-button>
        </div>
      </template>
      <template v-else>
        <div class="left">
          <el-input style="width:300px;" :placeholder="$t('search_store')" prefix-icon="el-icon-search" v-model.trim="seek">
          </el-input>
          <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
        </div>
        <div class="right">
          <el-button @click="addData" type="primary" icon="el-icon-circle-plus">{{$t('add_store_group')}}</el-button>
        </div>
      </template>
    </div>
    <el-dialog :title="$t('add_goods')" :visible.sync="isDialog" width="70%" center>
      <listGoods ref="subclass" :fatherData="fatherData" :tableConfig="tableConfig" :interfaceConfig="interfaceConfig"></listGoods>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="receiveSon">{{$t("submit")}}</el-button>
      </span>
    </el-dialog>
    <div class="manufacturers_tab">
      <el-tabs type="border-card" v-model="editableTabsValue">
        <el-tab-pane :label="$t('add_goods')" name="1">
          <el-table :data="tableGoodsData" border style="width: 100%">
            <el-table-column :label="$t('create_time')">
              <template slot-scope="scope">{{ $dateFormat(scope.row.createTime) }}</template>
            </el-table-column>
            <el-table-column :label="$t('good_name')">
              <template slot-scope="scope">{{ scope.row.goodsName }}</template>
            </el-table-column>
            <el-table-column :label="$t('classify_name')">
              <template slot-scope="scope">{{ scope.row.categoryName }}</template>
            </el-table-column>
            <el-table-column :label="$t('brand_name')">
              <template slot-scope="scope">{{ scope.row.brandName }}</template>
            </el-table-column>
            <el-table-column :label="$t('good_logo')">
              <template slot-scope="scope">
                <img @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
              </template>
            </el-table-column>
            <el-table-column :label="$t('creater')">
              <template slot-scope="scope">
                <span>{{ scope.row.createUserName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleGoodsDelete(scope.row)">{{$t('delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block tab_paging" v-show="tableGoodsData.length">
            <el-pagination @current-change="handleGoodsCurrentChange" :page-size="pageGoodsSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentGoodsPage" :total="goodsTotal">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('add_store_group')" name="2">
          <el-table :data="tableData" border>
            <el-table-column :label="$t('create_time')">
              <template slot-scope="scope">
                <span>{{ $dateFormat(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('store_group_name1')" v-if="langType == 1 || langType == 3">
              <template slot-scope="scope">
                <span>{{ scope.row.categoryName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('store_group_name2')" v-if="langType == 2 || langType == 3">
              <template slot-scope="scope">
                <span>{{ scope.row.categoryNameEn }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('creater')">
              <template slot-scope="scope">
                <span>{{ scope.row.createUserName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')" width="350">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">{{$t('edit')}}</el-button>
                <el-button size="mini" @click="getBrandGoods(scope.row)">{{$t('see_group_goods')}}</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block tab_paging" v-show="tableData.length">
            <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>

    <el-dialog :title="$t('store_group')" :visible.sync="dialogVisible" @close="closeDialog" width="500px" center>
      <el-form label-width="210px" label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item :label="$t('store_group_name1')" prop="categoryName" :rules="{
            required: true,
            message: $t('verificate_store_group_name1'),
            trigger: 'blur'
          }" v-if="langType == 2 || langType == 3">
          <el-input v-model.trim="ruleForm.categoryName" :placeholder="$t('store_group_name1')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('store_group_name2')" prop="categoryNameEn" :rules="{
            required: true,
            message: $t('verificate_store_group_name2'),
            trigger: 'blur'
          }" v-if="langType == 2 || langType == 3">
          <el-input v-model.trim="ruleForm.categoryNameEn" :placeholder="$t('store_group_name2')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t("submit")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import listGoods from "@/components/alertList.vue";
export default {
  components: {
    listGoods
  },
  data() {
    return {
      langType: 1,
      seek: "",
      goodseek: "",
      tableData: [],
      tableGoodsData: [],
      pageGoodsSize: 10,
      pageSize: 10,
      currentGoodsPage: 1,
      currentPage: 1,
      goodsTotal: 0,
      total: 0,
      dialogVisible: false,
      editableTabsValue: "1",
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      fatherData: [], //传入子组件
      isDialog: false,
      tableConfig: [
        {
          type: "text",
          text: this.$t("create_time"),
          keyWord: "createTime"
        },
        {
          type: "text",
          text: this.$t("good_name"),
          keyWord: "goodsName"
        },
        {
          type: "text",
          text: this.$t("classify_name"),
          keyWord: "categoryName"
        },
        {
          type: "text",
          text: this.$t("brand_name"),
          keyWord: "brandName"
        },
        {
          type: "image",
          text: this.$t("good_logo"),
          keyWord: "logo"
        }
      ],
      interfaceConfig: {
        api: this.$api.queryGoodsListByRetailerStore,
        params: {
          storeId: this.$route.query.type,
          action: "add"
        },
        keyWord: "goodsName"
      },
      ruleForm: {
        categoryName: "",
        categoryNameEn: "",
        storeId: "",
        categoryId: ""
      },
      rules: {}
    };
  },
  mounted() {
    this.getBrandCustomCategory();
    this.getGoodsList();
    this.langType = this.$getLangType();
  },
  methods: {
    searchData() {
      this.currentPage = 1;
      this.getBrandCustomCategory();
    },
    searchGoodData() {
      this.currentGoodsPage = 1;
      this.getGoodsList();
    },
    addData() {
      this.dialogVisible = true;
    },
    addGoodsData() {
      this.isDialog = true;
    },
    getGoodsList() {
      this.$Geting(this.$api.queryGoodsListByRetailerStore, {
        goodsName: this.goodseek,
        pageNo: this.currentGoodsPage,
        pageSize: this.pageGoodsSize,
        action: "query",
        storeId: this.$route.query.type
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.tableGoodsData = res.datas.lists;
          this.fatherData = res.datas.lists;
          this.goodsTotal = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.errcode
          });
          return false;
        }
      });
    },
    getBrandCustomCategory() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        storeId: this.$route.query.type,
        categoryName: this.seek
      };
      this.$Geting(this.$api.queryStoreCustomCategory, { ...data }).then(
        res => {
          if (res.code == 0) {
            this.tableData = res.datas.lists;
            this.total = res.datas.count;
          }
        }
      );
    },
    submitGoodsData(jsonData) {
      let data = {
        goodsIds: this.changeTableData(jsonData),
        storeId: this.$route.query.type
      };
      let _this = this;
      this.$Posting(this.$api.saveRetailerStoreGoods, data, true).then(res => {
        if (res.code == 0) {
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("add_success_title")
          });
          _this.isDialog = false;
          _this.getGoodsList();
        } else {
          _this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    receiveSon() {
      // 接收子页面数据
      let SonData = this.$refs.subclass.goodsDataActive;
      let data = this.fatherData.concat(); //合并fatherData的数据
      for (let i = 0; i < SonData.length; i++) {
        for (let j = 0; j < SonData[i].length; j++) {
          data.push(SonData[i][j]);
        }
      }
      this.submitGoodsData(SonData);
      console.log(data);
    },
    changeTableData(data, newTableData = []) {
      //将添加的数据结构变为提交需要的数据格式
      let tableData = data;
      if (tableData.length) {
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i].length) {
            for (let j = 0; j < tableData[i].length; j++) {
              newTableData.push(tableData[i][j].id);
            }
          }
        }
      }
      return newTableData.join();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.storeId = this.$route.query.type;
          this.$Get(this.$api.saveStoreCustomCategory, {
            ...this.ruleForm
          }).then(res => {
            if (res.code == 0) {
              this.$notify.success({
                title: this.$t("alert_success_title"),
                message: ""
              });
              this.getBrandCustomCategory();
              this.dialogVisible = false;
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
      this.dialogVisible = true;
      this.ruleForm = {
        categoryName: row.categoryName,
        categoryNameEn: row.categoryNameEn,
        brandId: row.brandId,
        categoryId: row.id
      };
    },
    handleDelete(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteStoreCustomCategory, {
          categoryId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.currentPage !== 1) {
              this.currentPage = this.currentPage - 1;
            }
            this.getBrandCustomCategory();
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
    handleGoodsDelete(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteRetailerStoreGoods, {
          goodsId: id,
          storeId: this.$route.query.type
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableGoodsData.length == 1 && this.currentGoodsPage > 1) {
              this.currentGoodsPage = this.currentGoodsPage - 1;
              this.getGoodsList();
            } else {
              this.getGoodsList();
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
    getBrandGoods(row) {
      let { id } = row;
      this.$router.push({
        path: "shopGoods.html",
        query: {
          type: id,
          shopId: this.$route.query.type
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBrandCustomCategory();
    },
    handleGoodsCurrentChange(val) {
      this.currentGoodsPage = val;
      this.getGoodsList();
    },
    closeDialog() {
      this.dialogVisible = false;
      this.$refs["ruleForm"].resetFields();
      this.ruleForm = {
        categoryName: "",
        categoryNameEn: "",
        categoryId: "",
        brandId: ""
      };
    }
  }
};
</script>
<style lang="less" scoped>
.shopClassify {
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
