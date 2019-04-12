<template>
  <div class="brandClassify">
    <h1 class="hint_site">
      <!-- 当前位置：品牌管理 > 品牌列表 > 品牌自定义分类 -->
      {{$t('current_position')}}： {{$t('brand_manage')}} > {{$t('brand_list')}} > {{$t('brand_custom_classify')}}
    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input style="width:300px;" :placeholder="$t('search_brand_group')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addData" type="primary" icon="el-icon-circle-plus">{{$t('add_brand_custom_group')}}</el-button>
      </div>
    </div>
    <div class="manufacturers_tab">
      <el-table :data="tableData" border>
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_group_name1')" v-if="langType == 1 || langType == 3">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_group_name2')" v-if="langType == 2 || langType == 3">
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
            <el-button size="mini" @click="handleEdit(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="getBrandGoods(scope.row)">{{$t('see_group_goods')}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging" v-show="tableData.length">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="$t('brand_group')" :visible.sync="dialogVisible" @close="closeDialog" width="600px" center>
      <el-form label-width="180px" label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item :label="$t('brand_group_name1')" prop="categoryName" :rules="{
            required: true,
            message: $t('brand_custom_group_name1'),
            trigger: 'blur'
          }" v-if="langType == 1 || langType == 3">
          <el-input v-model.trim="ruleForm.categoryName" :placeholder="$t('brand_group_name1')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('brand_group_name2')" prop="categoryNameEn" :rules="{
            required: true,
            message: $t('brand_custom_group_name2'),
            trigger: 'blur'
          }" v-if="langType == 2 || langType == 3">
          <el-input v-model.trim="ruleForm.categoryNameEn" :placeholder="$t('brand_group_name2')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      langType: 1,
      seek: "",
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogVisible: false,
      ruleForm: {
        categoryName: "",
        categoryNameEn: "",
        brandId: "",
        categoryId: ""
      },
      rules: {}
    };
  },
  mounted() {
    this.getBrandCustomCategory();
    this.langType = this.$getLangType();
  },
  methods: {
    searchData() {
      this.currentPage = 1;
      this.getBrandCustomCategory();
    },
    addData() {
      this.dialogVisible = true;
    },
    getBrandCustomCategory() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        brandId: this.$route.query.id,
        categoryName: this.seek
      };
      this.$Get(this.$api.queryBrandCustomCategory, { ...data }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
          this.total = res.datas.count;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.brandId = this.$route.query.id;
          this.$Get(this.$api.saveBrandCustomCategory, {
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
        this.$Get(this.$api.deleteBrandCustomCategory, {
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
    getBrandGoods(row) {
      let { id } = row;
      this.$router.push({
        path: "brandclassifyGoods.html",
        query: {
          id: id,
          parentId: this.$route.query.id
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBrandCustomCategory();
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
.brandClassify {
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
