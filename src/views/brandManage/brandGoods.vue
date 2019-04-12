<template>
  <div class="brand_shop">
    <h1 class="hint_site">
      <!-- 当前位置：品牌管理 > 品牌列表 > 品牌商品/门店 -->
       {{$t('current_position')}}： {{$t('brand_manage')}} > {{$t('brand_list')}} > {{$t('brand_relate_store')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_store')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <!-- <el-tabs type="border-card" @tab-click="tabClick" v-model="editableTabsValue">
        <el-tab-pane label="商品列表" name="1">
          <el-table :data="goodLists" border style="width: 100%">
            <el-table-column label="创建时间">
              <template slot-scope="scope">{{ $dateFormat(scope.row.createTime) }}</template>
            </el-table-column>
            <el-table-column label="商品名称">
              <template slot-scope="scope">{{ scope.row.goodsName }}</template>
            </el-table-column>
            <el-table-column label="分类名称">
              <template slot-scope="scope">{{ scope.row.categoryName }}</template>
            </el-table-column>
            <el-table-column label="品牌名称">
              <template slot-scope="scope">{{ scope.row.brandName }}</template>
            </el-table-column>
            <el-table-column label="产品主图">
              <template slot-scope="scope">
                <img @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
              </template>
            </el-table-column>
          </el-table>
          <div class="block tab_paging" v-show="goodLists.length">
            <el-pagination @current-change="goodCurrentChange" :page-size="pageGoodsSize" layout="total,prev, pager, next, jumper" :current-page.sync="pageGoodsNo" :total="goodsTotal">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="门店列表" name="2"> -->
          <el-table :data="shopLists" border style="width: 100%">
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
            <el-table-column :label="$t('user_email')">
              <template slot-scope="scope">
                <span>{{ scope.row.contactEmail }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('user_add')">
              <template slot-scope="scope">
                <span>{{ scope.row.contactAddr }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('store_logo')">
              <template slot-scope="scope">
                <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
              </template>
            </el-table-column>
          </el-table>
          <div class="block tab_paging" v-show="shopLists.length">
            <el-pagination @current-change="shopCurrentChange" :page-size="pageShopsSize" layout="total,prev, pager, next, jumper" :current-page.sync="pageShopsNo" :total="shopsTotal">
            </el-pagination>
          </div>
        <!-- </el-tab-pane>
      </el-tabs> -->

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seek: "",
      seekStr: "", //点击搜索生成的关键字
      pageGoodsSize: 10,
      pageGoodsNo: 1,
      goodsTotal: 0,
      goodLists: [],
      shopLists: [],
      pageShopsSize: 10,
      pageShopsNo: 1,
      shopsTotal: 0,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      editableTabsValue: "1"
    };
  },
  mounted() {
    this.getGoodLists();
    this.getShopLists();
  },
  methods: {
    tabClick() {
      console.log(this.editableTabsValue);
    },
    searchData() {
      this.seekStr = this.seek;
      if (this.editableTabsValue == 1) {
        //商品列表
        this.pageShopsNo = 1;
        this.getShopLists();
      } 
      // else {
      //   //门店列表
      //   this.pageShopsNo = 1;
      //   this.getShopLists();
      // }
    },
    getGoodLists() {
      let data = {
        pageNo: this.pageGoodsNo,
        pageSize: this.pageGoodsSize,
        brandId: this.$route.query.id,
        goodsName: this.seekStr
      };
      this.$Get(this.$api.queryGoodsList, { ...data }).then(res => {
        if (res.code == 0) {
          this.goodLists = res.datas.lists;
          this.goodsTotal = res.datas.count;
        }
      });
    },
    getShopLists() {
      let data = {
        pageNo: this.pageShopsNo,
        pageSize: this.pageShopsSize,
        brandId: this.$route.query.id,
        storeName: this.seekStr
      };
      this.$Get(this.$api.queryRetailerStoreList, { ...data }).then(res => {
        if (res.code == 0) {
          this.shopLists = res.datas.lists;
          this.shopsTotal = res.datas.count;
        }
      });
    },
    goodCurrentChange(val) {
      this.pageGoodsNo = val;
      this.getGoodLists();
    },
    shopCurrentChange(val) {
      this.pageShopsNo = val;
      this.getShopLists();
    }
  }
};
</script>
<style lang="less">
.brand_shop {
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
  }
}
</style>
