<template>
  <div class="categoryList">
    <h1 class="hint_site">
      <!-- 当前位置：家具分类 > 分类列表 > 分类商品 -->
       {{$t('current_position')}}： {{$t('furniture_classification')}} > {{$t('classify_list')}} > {{$t('classify_goods')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_goods')"  prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="CategoryList" border style="width: 100%">
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
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" 
        :page-size="pageSize" layout="total,prev, pager, next, jumper" 
        :current-page.sync="pageNo" 
        :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seek: '',
      pageSize: 10,
      pageNo: 1,
      total: 0,
      CategoryList: [],
      hostUrl: sessionStorage.getItem("serveUrl") || "",
    }
  },
  mounted() {
    this.getCategorList()
  },
  methods: {
    searchData() {
      this.pageNo = 1
      this.getCategorList()
    },
    getCategorList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        categoryId: this.$route.query.id,
        goodsName: this.seek
      }
      this.$Get(this.$api.queryGoodsList, {...data}).then((res) => {
        if (res.code == 0) {
          console.log(res)
          this.CategoryList = res.datas.lists
          this.total = res.datas.count
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getCategorList()
    }
  }
}
</script>
<style lang="less">
.categoryList {
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
      height: 60px;
      // line-height: 60px;
      img {
        height: 100%;
      }
    }
    .find_list_img {
      height: 40px;
    }
  }
}
</style>
