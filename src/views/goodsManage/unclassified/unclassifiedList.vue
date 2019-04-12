<template>
  <div class="unclassified_list">
    <h1 class="hint_site">
      <!-- 当前位置：商品管理 > 未分类商品列表 -->
      {{$t('current_position')}}： {{$t('good_manage')}} > {{$t('unclassify_list')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <template v-if="editableTabsValue==1">
            <el-col :span="3">
              <el-input :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="brandSeek">
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-select v-model="brand" filterable @change="brandChange" style="width:100%" :placeholder="$t('verificate_select_brand')">
                <el-option v-for="(v,k) in brandList" :key="k" :value="v.id" :label="v.brandName">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="brandCustom" filterable style="width:100%" :placeholder="$t('select_brand_custom')">
                <el-option v-for="(v,k) in brandCustomList" :key="k" :value="v.id" :label="v.categoryName">
                </el-option>
              </el-select>
            </el-col>

          </template>
          <template v-else>
            <el-col :span="3">
              <el-input :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="classifySeek">
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-select v-model="classifyId" filterable @change="classifyChange" style="width:100%" :placeholder="$t('verificate_list')">
                <el-option v-for="(v,k) in classifyList" :key="k" :value="v.id" :label="v.categoryName">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="classifyCustom" filterable style="width:100%" :placeholder="$t('select_classify_custom')">
                <el-option v-for="(v,k) in classifyCustomList" :key="k" :value="v.id" :label="v.categoryValue">
                </el-option>
              </el-select>
            </el-col>
          </template>
          <el-col :span="4">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
            <el-button @click="resetData">{{$t('reset_btn')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-tabs type="border-card" v-model="editableTabsValue">
        <el-tab-pane :label="$t('brand_custom_goods')" name="1">
          <el-table :data="brandCustomGoodList" border style="width: 100%">
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
                <el-button size="mini" @click="editGood(scope.row)">{{$t("edit")}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block tab_paging" v-show="brandCustomGoodList.length">
            <el-pagination @current-change="brandCustomChange" :page-size="pageBrandCustomSize" layout="total,prev, pager, next, jumper" :current-page.sync="pageBrandCustomNo" :total="brandCustomTotal">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('classify_custom_goods')" name="2">
          <el-table :data="classifyCustomGoodList" border style="width: 100%">
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
                <el-button size="mini" @click="editGood(scope.row)">{{$t("edit")}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block tab_paging" v-show="classifyCustomGoodList.length">
            <el-pagination @current-change="classifyCustomChange" :page-size="pageClassifyCustomSize" layout="total,prev, pager, next, jumper" :current-page.sync="pageClassifyCustomNo" :total="classifyCustomTotal">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      brandSeek: "",
      brandSeekStr: "",
      classifySeek: "",
      classifySeekStr: "",
      brand: "",
      brandId: "",
      brandList: [],
      brandCustom: "",
      brandCustomId: "",
      brandCustomList: [],
      classifyId: "",
      classifyList: [],
      classifyCustom: "",
      classifyCustomId: "",
      classifyCustomList: [],
      pageBrandCustomSize: 10,
      pageBrandCustomNo: 1,
      brandCustomTotal: 0,
      brandCustomGoodList: [],
      classifyCustomGoodList: [],
      pageClassifyCustomSize: 10,
      pageClassifyCustomNo: 1,
      classifyCustomTotal: 0,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      editableTabsValue: "1"
    };
  },
  mounted() {
    this.getBrand();
    this.getClassify();
    this.getbrandCustomGoodList();
    this.getclassifyCustomGoodList();
  },
  methods: {
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
    //获取品牌列表
    getBrand() {
      this.$Get(this.$api.queryBrandList, {
        pageNo: 1,
        pageSize: 10000
      }).then(data => {
        this.brandList = data.datas.lists;
      });
    },
    brandChange(val) {
      this.brandCustom = "";
      this.$Get(this.$api.queryBrandCustomCategory, {
        pageNo: 1,
        pageSize: 10000,
        brandId: val
      }).then(data => {
        if (data.code == 0) {
          this.brandCustomList = data.datas.lists;
          console.log(this.brandCustomList)
        }
      });
    },
    //获取分类列表
    getClassify() {
      this.$Get(this.$api.queryGoodsCustomGategoryList, {
        pageNo: 1,
        pageSize: 10000
      }).then(data => {
        this.classifyList = data.datas.lists;
      });
    },
    classifyChange(val) {
      this.classifyCustom = "";
      this.$Get(this.$api.queryGoodsCustomCategoryValueList, {
        categoryId: val,
        pageSize: 100000,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.classifyCustomList = res.datas.lists;
        }
      });
    },
    searchData() {
      if (this.editableTabsValue == 1) {
        this.brandSeekStr = this.brandSeek;
        this.brandCustomId = this.brandCustom;
        this.brandId = this.brand;
        this.pageBrandCustomNo = 1;
        this.getbrandCustomGoodList();
      } else {
        this.classifySeekStr = this.classifySeek;
        this.classifyCustomId = this.classifyCustom;
        this.pageClassifyCustomNo = 1;
        this.getclassifyCustomGoodList();
      }
    },
    //重置数据
    resetData() {
      if (this.editableTabsValue == 1) {
        this.pageBrandCustomNo = 1;
        this.brandSeek = "";
        this.brandSeekStr = "";
        this.brand = "";
        this.brandId = "";
        this.brandCustom = "";
        this.brandCustomId = "";
        this.brandCustomList = [];
        this.getbrandCustomGoodList();
      } else {
        this.pageClassifyCustomNo = 1;
        this.classifySeek = "";
        this.classifySeekStr = "";
        this.classifyId = "";
        this.classifyCustom = "";
        this.classifyCustomId = "";
        this.classifyCustomList = [];
        this.getclassifyCustomGoodList();
      }
    },
    getbrandCustomGoodList() {
      let data = {
        pageNo: this.pageBrandCustomNo,
        pageSize: this.pageBrandCustomSize,
        brandId: this.brandId,
        brandCategoryId: this.brandCustomId,
        goodsName: this.brandSeekStr,
        action: "add"
      };
      this.$Get(this.$api.queryBrandCustomCategoryGoods, { ...data }).then(
        res => {
          if (res.code == 0) {
            this.brandCustomGoodList = res.datas.lists;
            this.brandCustomTotal = res.datas.count;
          }
        }
      );
    },
    getclassifyCustomGoodList() {
      let data = {
        pageNo: this.pageClassifyCustomNo,
        pageSize: this.pageClassifyCustomSize,
        categoryId: this.classifyCustomId,
        goodsName: this.classifySeekStr
      };
      this.$Get(this.$api.queryGoodsCustomCategoryValueByGoods, {
        ...data,
        action:"add"
      }).then(res => {
        if (res.code == 0) {
          this.classifyCustomGoodList = res.datas.lists;
          this.classifyCustomTotal = res.datas.count;
        }
      });
    },
    brandCustomChange(val) {
      this.pageBrandCustomNo = val;
      this.getbrandCustomGoodList();
    },
    classifyCustomChange(val) {
      this.pageClassifyCustomNo = val;
      this.getclassifyCustomGoodList();
    }
  }
};
</script>
<style lang="less">
.unclassified_list {
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
