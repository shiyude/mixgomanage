<template>
  <div class="alertList">
    <div class="alertList_head">
      <div>
        {{$t('key_word')}}
        <el-input style="width:180px;" :placeholder="$t('search_key')" prefix-icon="el-icon-search" v-model.trim="goodsName">
        </el-input>
        <template v-if="!interfaceConfig.type">
          <el-select v-model="classify" :placeholder="$t('verificate_list')" style="width:180px;" filterable>
            <el-option v-for="(v,k) in classifyList" :key="k" :value="v.id" :label="v.categoryName"></el-option>
          </el-select>
          <el-select v-model="brand" :placeholder="$t('verificate_select_brand')" style="width:180px;" filterable>
            <el-option v-for="(v,k) in brandList" :key="k" :value="v.id" :label="v.brandName">
            </el-option>
          </el-select>
        </template>
        <el-button @click="PostGoodData('seek')">{{$t('seach_btn')}}</el-button>
        <el-button @click="resetGoodData">{{$t('reset_btn')}}</el-button>
      </div>
    </div>
    <div class="alertList_tab">
      <el-table v-loading="loading" tooltip-effect="dark" ref="multipleTable" :data="pageData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column :label="item.text" v-for="(item,index) in tableConfig" :key="index" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.keyWord=='createTime'">
              <span class="line_clamp">{{ $dateFormat(scope.row[item.keyWord]) }}</span>
            </template>
            <template v-else-if="item.keyWord=='description'||item.keyWord=='title'">
              <span class="line_clamp">{{scope.row[item.keyWord] }}</span>
            </template>
            <template v-else-if="item.type=='image'">
              <img :src="hostUrl+scope.row[item.keyWord]" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row[item.keyWord])" />
            </template>
            <template v-else="item.type=='text'">
              <span>{{ scope.row[item.keyWord] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" 
        :page-size="counts" 
        :current-page.sync="currentPageNum" 
        layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fatherData: Array, // 输入父组件的数据做对比
    interfaceConfig: Object, //接口配置
    tableConfig: Array //表格配置
  },
  data() {
    return {
      goodsName: "",
      classify: "", //分类id
      brand: "", //品牌id
      goodsData: [],
      goodsDataActive: [], // 选中的数据
      page: 1,
      count: 10000, // 传入服务器的
      counts: 5, // 页面用的
      total: 1,
      pageData: [], // 当前页数据
      loading: true,
      currentPageNum: 1,
      classifyList: [], //分类数据
      brandList: [], //品牌数据
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  watch: {
    fatherData: {
      // 父页面数据变化，子页面调动方法
      handler: function(val, oldVal) {
        this.goodsName && (this.goodsName = "");
        this.brand && (this.brand = "");
        this.classify && (this.classify = "");
        this.PostGoodData();
        console.log("当前接收", val);
      },
      deep: true
    }
  },
  mounted() {
    this.PostGoodData();
    if (!this.interfaceConfig.type) {
      this.getGategory();
      this.getBrand();
    }
  },
  methods: {
    resetGoodData() {
      this.brand = "";
      this.classify = "";
      this.goodsName = "";
      // this.page = 1;
      this.currentPageNum = 1;
      this.PostGoodData();
    },
    //获取品牌列表
    getBrand() {
      this.$Posting(this.$api.queryBrandList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.brandList = res.datas.lists;
      });
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
    PostGoodData(tex) {
      let seft = this;
      let axiosParams = {
        pageNo: 1,
        pageSize: seft.count,
        ...seft.interfaceConfig.params
      };
      axiosParams[seft.interfaceConfig.keyWord] = seft.goodsName;
      if (!this.interfaceConfig.type) {
        axiosParams.brandId = seft.brand;
        axiosParams.categoryId = seft.classify;
      }
      if (tex === "seek") {
        // seft.page = 1;
        seft.currentPageNum = 1;
      }
      this.$Posting(seft.interfaceConfig.api, axiosParams).then(res => {
        if (res.code == 0) {
          console.log(res);
          seft.pagingFn(res.datas.lists);
          seft.currentPageNum = 1;
          seft.goodsDataActive = [];
          seft.loading = false;
        } else {
          seft.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    pagingFn(arr) {
      // 切分总数据
      let pagingData = [];
      for (let i = 0; i < arr.length; i += 5) {
        pagingData.push(arr.slice(i, i + 5));
      }

      this.goodsData = pagingData;
      this.total = arr.length;
      this.pageData = this.goodsData[0];
    },
    handleSelectionChange(val) {
      // 向父组件发送选中商品
      let seft = this;
      let pages = seft.currentPageNum - 1; // 记录当前页面，以页面为goodsDataActive下标去装当前页的选中数据
      // console.log('page',this.page)
      // console.log('currentPageNum',this.currentPageNum)
      // console.log('当前页面',pages)
      if (this.goodsData.length > 0) {
        // 当this.goodsData不是空的时候

        // 1、根据this.goodsData的length，确定this.goodsDataActive的length

        if (this.goodsDataActive.length === 0) {
          for (let i = 0; i < this.goodsData.length; i++) {
            this.goodsDataActive.push([]);
          }
        }

        // 2、如果val的数量和this.goodsDataActive[pages]数量不一致，代表用户重新选择

        if(this.goodsDataActive[pages]) {
           if (this.goodsDataActive[pages].length != val.length) {
            this.goodsDataActive[pages] = new Array();
            for (let i = 0; i < val.length; i++) {
              this.goodsDataActive[pages].push(val[i]);
            }
            let arr = this.goodsDataActive[pages];
            let resultarr = [...new Set(arr)];
            this.goodsDataActive[pages] = resultarr;
            // console.log('222进来了')
            // console.log('重新选择了',val)
            // console.log(this.goodsDataActive)
          }

           // 3、this.goodsDataActive[pages].length < 1时，用户刚进入这一页
          if (this.goodsDataActive[pages].length < 1) {
            for (let i = 0; i < val.length; i++) {
              this.goodsDataActive[pages].push(val[i]);
            }
            let arr = this.goodsDataActive[pages];
            let resultarr = [...new Set(arr)];
            this.goodsDataActive[pages] = resultarr;
            // console.log('333进来了')
          }
        }
      }
    },
    handleCurrentChange(val) {
      // console.log('currentPageNum',this.currentPageNum)
      let num = val - 1;
      this.pageData = this.goodsData[num];
      let seft = this;
      seft.toggleSelection(seft.goodsDataActive[num]);
    },
    toggleSelection(rows) {
      // 选中数据里有，标记为选中
      this.$nextTick(function() {
        if (rows) {
          rows.forEach((row, index) => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
      });
    },
    resetArr(arr1, arr2) {
      // 比较父组件传入的数据，去掉子组件里含有的父组件相同数据
      if (arr2 === undefined) {
        arr2 = [];
      }
      let obs = arr1
        .map(item1 => {
          arr2.map(item2 => {
            if (item1.id === item2.id) {
              item1.stamp = true;
            }
          });
          return item1;
        })
        .filter(item1 => !item1.stamp);
      return obs;
    }
  }
};
</script>
<style lang="less" >
</style>