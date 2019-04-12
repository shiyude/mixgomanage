<template>
  <div class="brandclassifyGoods">
    <h1 class="hint_site">
      <!-- 当前位置：品牌管理 > 自定义分组 > 分组商品 -->
      {{$t('current_position')}}： {{$t('brand_manage')}} > {{$t('classify_group')}} > {{$t('group_goods')}}
    </h1>
    <div class="FindCreation_form">
      <div class="manufacturers_head clearfix">
        <div class="left">
          <el-input style="width:300px;" :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="seek">
          </el-input>
          <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
        </div>
        <div class="right">
          <!-- <el-button @click="GoodsListPop = true" type="primary" icon="el-icon-circle-plus">添加分组品牌</el-button> -->
          <el-button icon="el-icon-back" @click="goBack">{{$t('go_back')}}</el-button>
        </div>
      </div>
    </div>
    <!-- 关联品牌列表 -->
    <div class="addStore_tab">
      <el-table :data="tableData" border style="width: 100%">
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
        <el-table-column :label="$t('operation')" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging" v-show="tableData.length">
        <el-pagination :page-size="pageSize" :current-page.sync="currentPage" layout="total,prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seek: "",
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  mounted() {
    this.getClassifyGood();
  },
  methods: {
    goBack() {
      this.$router.replace({
        path: "brandClassify.html",
        query: {
          id: this.$route.query.parentId
        }
      });
    },
    searchData() {
      this.currentPage = 1;
      this.getClassifyGood();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getClassifyGood();
    },
    handleDelete(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteBrandCustomCategoryGoods, {
          categoryId: this.$route.query.id,
          goodsId: id
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
            this.getClassifyGood();
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
    getClassifyGood() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        brandCategoryId: this.$route.query.id,
        action: "query",
        goodsName: this.seek
      };
      this.$Get(this.$api.queryBrandCustomCategoryGoods, { ...data }).then(
        res => {
          if (res.code == 0) {
            this.tableData = res.datas.lists;
            this.total = res.datas.count;
            console.log(res);
          }
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.brandclassifyGoods {
  .manufacturers_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
      text-align: left;
    }
  }
  .addStore_tab {
    margin-top: 15px;
  }
}
</style>
