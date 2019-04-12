<template>
  <div class="children_series_add_goods">
    <h1 class="hint_site">
      <!-- 当前位置：APP管理 > 分类 > 系列 > 子系列 > 商品管理 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('classification')}} > {{$t('series')}} > {{$t('children_series')}} > {{$t('manage_goods')}}
    </h1>
    <div class="FindCreation_form">
      <div class="manufacturers_head clearfix">
        <div class="left">
          <el-input style="width:200px;" :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="seek">
          </el-input>
          <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
        </div>
        <div class="right">
          <el-button @click="GoodsListPop = true" type="primary" icon="el-icon-circle-plus">{{$t('add_goods')}}</el-button>
          <el-button icon="el-icon-back" @click="goBack">{{$t('go_back')}}</el-button>
        </div>
      </div>
      <el-dialog :title="$t('add_goods')" :visible.sync="GoodsListPop" width="70%" center>
        <!-- <listGoods ref="subclass" :ApiData="ApiData" :fatherData="fatherData" dataType="commodity"></listGoods> -->
        <listGoods ref="subclass" :fatherData="fatherData" :tableConfig="tableConfig" :interfaceConfig="interfaceConfig"></listGoods>
        <span slot="footer" class="dialog-footer">
          <el-button @click="GoodsListPop = false">{{$t("cancel")}}</el-button>
          <el-button type="primary" @click="receiveSon">{{$t("submit")}}</el-button>
        </span>
      </el-dialog>

      <!-- 关联商品列表 -->
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
          <el-table-column :label="$t('operation')">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t("delete")}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block tab_paging" v-show="tableData.length">
          <el-pagination :page-size="pageSize" :current-page.sync="currentPage" layout="total,prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import listGoods from "@/components/listOfGoods.vue";
import listGoods from "@/components/alertList.vue";
export default {
  components: {
    listGoods
  },
  data() {
    return {
      tableData: [],
      GoodsListPop: false,
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      fatherData: [], //传入子组件
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      seek: "", //关键字
      searchStr: "", //点击搜索生成的关键字
      // ApiData: {}
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
        api: this.$api.queryGoodsCustomCategoryValueByGoods,
        params: {
          categoryValueId: this.$route.query.id,
          action:"add"
        },
        keyWord: "goodsName"
      }
    };
  },
  created() {
    this.getDataList();
  },
  mounted() {
    // this.ApiData = {
    //   api: this.$api.queryGoodsCustomCategoryValueNotJoin,
    //   parameter: "categoryValueId",
    //   id: this.$route.query.id
    // };
    // console.log(this.ApiData);
  },
  methods: {
    goBack(){
      this.$router.replace({
        path:"appChildrenSeries.html",
        query:{
          id:this.$route.query.parentId
        }
      })
    },
    //通过关键字搜索
    searchData() {
      this.currentPage = 1; //page置为1
      this.searchStr = this.seek;
      this.getDataList();
    },
    submitForm(data) {
      let datas = {
        goodsIds: this.changeTableData(data), //产品ID列表,字符串,选填(用逗号隔开)
        categoryValueId: this.$route.query.id
      };
      this.submitData(datas);
    },
    getDataList(page = 1) {
      this.$Posting(this.$api.queryGoodsCustomCategoryValueByGoods, {
        goodsName: this.searchStr,
        pageNo: page,
        pageSize: this.pageSize,
        categoryValueId: this.$route.query.id,
        action:"query"
      }).then(res => {
        // console.log(res);
        if (res.code == 0) {
          this.tableData = res.datas.lists;
          this.fatherData = res.datas.lists;
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
    receiveSon() {
      // 接收子页面数据
      let SonData = this.$refs.subclass.goodsDataActive;
      let data = this.fatherData.concat(); //合并fatherData的数据
      for (let i = 0; i < SonData.length; i++) {
        for (let j = 0; j < SonData[i].length; j++) {
          data.push(SonData[i][j]);
        }
      }
      this.submitForm(SonData);
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
        this.$Posting(this.$api.deleteGoodsCustomCategoryValueJion, {
          goodsId: id,
          categoryValueId: this.$route.query.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.currentPage !== 1) {
              this.getDataList(this.currentPage - 1);
            } else {
              this.getDataList(this.currentPage);
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

      console.log(index, row);
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
    submitData(jsonData) {
      let _this = this;
      this.$Posting(
        this.$api.insertGoodsCustomCategoryValueJoin,
        jsonData,
        true
      ).then(res => {
        if (res.code == 0) {
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("add_success_title")
          });
          _this.GoodsListPop = false;
          _this.seek = "";
          this.searchStr = "";
          _this.getDataList();
        } else {
          _this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    }, //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getDataList(val);
    }
  }
};
</script>

<style lang="less" >
.children_series_add_goods {
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
