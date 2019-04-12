<template>
  <div class="listOfGoods">
    <div class="listOfGoods_head">
      <div>
        关键字：
        <el-input style="width:300px;" placeholder="输入关键字" prefix-icon="el-icon-search" v-model.trim="goodsName">
        </el-input>
        <el-button @click="PostGoodData('seek')">搜索</el-button>
      </div>
    </div>
    <div class="listOfGoods_tab" v-if="(dataType === 'groupbrand')||(dataType === 'agentbrand') ">
      <el-table v-loading="loading" tooltip-effect="dark" ref="multipleTable" :data="pageData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
           {{ $dateFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="品牌名称">
          <template slot-scope="scope">
            <span>{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌产地">
          <template slot-scope="scope">
            <span>{{ scope.row.origin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌厂家">
          <template slot-scope="scope">
            <span>{{ scope.row.manufactor }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌类型">
          <template slot-scope="scope">
            <span>{{ scope.row.brandType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌介绍" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="品牌形象图" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.imgs" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.imgs)" />
          </template>
        </el-table-column>
        <el-table-column label="品牌商标" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" />
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" :page-size="counts" :current-page.sync="currentPageNum" layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="listOfGoods_tab" v-if="dataType === 'furniture' ">
      <el-table v-loading="loading" tooltip-effect="dark" ref="multipleTable" :data="pageData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类图片" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" :page-size="counts" :current-page.sync="currentPageNum" layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fatherData: Array, // 输入父组件的数据做对比
    dataType: String
  },
  data() {
    return {
      goodsName: "",
      goodsData: [],
      goodsDataActive: [], // 选中的数据
      page: 1,
      count: 10000, // 传入服务器的
      counts: 5, // 页面用的
      total: 1,
      pageData: [], // 当前页数据
      loading: true,
      currentPageNum: 1,
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  watch: {
    fatherData: {
      // 父页面数据变化，子页面调动方法
      handler: function(val, oldVal) {
        this.goodsName && (this.goodsName = "");
        this.PostGoodData();
        console.log("当前接收", val);
      },
      deep: true
    }
  },
  mounted() {
    this.PostGoodData();
  },
  methods: {
    PostGoodData(tex) {
      let seft = this;
      let api;
      let axiosParams = { pageNo: 1, pageSize: seft.count };
      switch (this.dataType) {
        case "groupbrand": // 分组下的品牌
          api = this.$api.queryBrandNotExistsGroup;
          axiosParams.groupId = this.$route.query.id;
          axiosParams.brandName = seft.goodsName;

          break;
        case "agentbrand": // 分组下的品牌
          api = this.$api.queryRetailerBrand;
          axiosParams.retailerId = this.$route.query.id;
          axiosParams.brandName = seft.goodsName;
          axiosParams.action = 'add';

          break;
        case "furniture": // 家具分类
          api = this.$api.querySpaceNotExistGoodsGategoryList;
          axiosParams.spaceId = this.$route.query.id;
          axiosParams.gategoryName = seft.goodsName;
          break;
      }
      console.log(api);
      if (tex === "seek") {
        seft.page = 1;
        seft.currentPageNum = 1;
      }
      this.$Posting(api, axiosParams).then(res => {
        if (res.code == 0) {
          console.log(res);
          // let data = seft.resetArr(res.datas.lists, seft.fatherData);
          seft.pagingFn(res.datas.lists);
          seft.goodsDataActive = [];
          seft.loading = false;
          // console.log("data1", data.length);
        } else {
          seft.$notify.error({
            title: "错误",
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
      let pages = this.page - 1; // 记录当前页面，以页面为goodsDataActive下标去装当前页的选中数据

      if (this.goodsData.length > 0) {
        // 当this.goodsData不是空的时候

        // 1、根据this.goodsData的length，确定this.goodsDataActive的length

        if (this.goodsDataActive.length === 0) {
          for (let i = 0; i < this.goodsData.length; i++) {
            this.goodsDataActive.push([]);
          }
        }

        // 2、如果val的数量和this.goodsDataActive[pages]数量不一致，代表用户重新选择

        if (this.goodsDataActive[pages].length != val.length) {
          this.goodsDataActive[pages] = new Array();
          for (let i = 0; i < val.length; i++) {
            this.goodsDataActive[pages].push(val[i]);
          }
          let arr = this.goodsDataActive[pages];
          let resultarr = [...new Set(arr)];
          this.goodsDataActive[pages] = resultarr;
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
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val;
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