<template>
  <div class="AppStore">
    <h1 class="hint_site">
      <!-- 当前位置：APP管理 > 首页 > 门店实体 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('home_page')}} > {{$t('entity_store')}}
    </h1>
    <div class="AppStore_head clearfix">
      <div class="left">
        <el-input style="width:300px;" :placeholder="$t('search_store')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="GetSeek">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="selectedShopPop = true" type="primary" icon="el-icon-circle-plus">{{$t('add_store')}}</el-button>
      </div>
    </div>
    <div class="AppStore_conter">
      <!-- 门店选择框 -->
      <el-dialog :title="$t('add_store')" :visible.sync="selectedShopPop" width="70%" center>
        <!-- <listGoods :fatherData="fatherData" :ApiData="ApiData" dataType="shop" ref="subclass"></listGoods> -->
        <listGoods ref="subclass" :fatherData="fatherData" :tableConfig="tableConfig" :interfaceConfig="interfaceConfig"></listGoods>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectedShopPop = false">{{$t("cancel")}}</el-button>
          <el-button type="primary" @click="receiveSon">{{$t("submit")}}</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="div_table">
      <!-- <h1 style="background:#fff;padding:10px;">已推荐的门店列表</h1> -->
      <el-table border :data="tabData" style="width: 100%">
        <el-table-column :label="$t('brand_name')">
          <template slot-scope="scope">{{ scope.row.brandName }}</template>
        </el-table-column>
        <el-table-column :label="$t('store_logo')">
          <template slot-scope="scope">
            <img @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('store_name')">
          <template slot-scope="scope">{{ scope.row.storeName }}</template>
        </el-table-column>
        <el-table-column :label="$t('store_add')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{scope.row.contactAddr}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('store_phone')">
          <template slot-scope="scope">
            {{scope.row.contactPhone}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="getTop(scope.row)">{{$t("to_top")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteStoreData(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" :page-size="count" layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
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
      fatherData: [], // 输入子组件的数据
      tabData: [], // 当前页数据
      selectedShopPop: false,
      page: 1,
      count: 10, // 传入服务器的
      total: 0,
      ApiData: {},
      seek: "",
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      tableConfig: [
        {
          type: "text",
          text: this.$t("brand_name"),
          keyWord: "brandName"
        },
        {
          type: "image",
          text: this.$t("store_logo"),
          keyWord: "logo"
        },
        {
          type: "text",
          text: this.$t("store_name"),
          keyWord: "storeName"
        },
        {
          type: "text",
          text: this.$t("store_add"),
          keyWord: "contactAddr"
        },
        {
          type: "text",
          text: this.$t("brand_name"),
          keyWord: "contactPhone"
        }
      ],
      interfaceConfig: {
        api: this.$api.queryHomeRetailerStore,
        params: {
          action: "add"
        },
        keyWord: "storeName",
        type: 1
      }
    };
  },
  mounted() {
    this.postStoreData();
  },
  methods: {
    GetSeek() {
      this.page = 1;
      this.postStoreData();
    },
    getTop(row) {
      let { id } = row;
      this.$Get(this.$api.setStoreTop, { storeId: id }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: ""
          });
          this.postStoreData();
        }
      });
    },
    postStoreData() {
      // 获取推荐门店列表
      this.$Post(this.$api.queryHomeRetailerStore, {
        pageNo: this.page,
        pageSize: this.count,
        storeName: this.seek,
        action: "query"
      }).then(res => {
        if (res.code == 0) {
          this.tabData = res.datas.lists;
          this.total = res.datas.count;
          this.fatherData = res.datas.lists;
          this.total = res.datas.count;
          console.log(res);
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    deleteStoreData(index, row) {
      // 删除推荐门店
      let { id } = row;
      let seft = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteHomeRetailerStore, {
          storeId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            this.postStoreData();
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
    handleCurrentChange(val) {
      //分页
      this.page = val;
      this.postStoreData();
    },
    receiveSon() {
      // 接收子组件数据
      let SonData = this.$refs.subclass.goodsDataActive;
      let data = [];
      if (SonData.length > 0) {
        // console.log(SonData)
        for (let i = 0; i < SonData.length; i++) {
          for (let j = 0; j < SonData[i].length; j++) {
            data.push(SonData[i][j].id);
          }
        }
        let resultarr = [...new Set(data)]; // 去掉重复的
        let newData = resultarr.join(",");
        this.$Post(this.$api.saveHomeRetailerStore, { storeId: newData }).then(
          res => {
            if (res.code == 0) {
              this.$notify.success({
                title: this.$t("alert_success_title"),
                message: this.$t("add_success_title")
              });
              this.postStoreData();
              this.selectedShopPop = false;
            } else {
              this.$notify.error({
                title: this.$t("alert_fail_title"),
                message: this.$t("add_fail_title")
              });
            }
          }
        );
        // console.log(newData)
      } else {
        this.$notify({
          title: this.$t("warning"),
          message: this.$t("no_select_store"),
          type: "warning"
        });
        this.selectedShopPop = false;
      }
    }
  }
};
</script>

<style lang="less" >
.AppStore {
  .AppStore_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
      text-align: left;
    }
  }
}
.el-table .warning-row {
  background: oldlace;
}
.AppStore_conter {
  padding: 10px;
  background-color: #fff;
  margin-top: 15px;
}
.AppStore {
  .div_table {
    .cell {
      height: 40px;
      // line-height: 40px;
      img {
        // width: 40px;;
        height: 40px;
      }
    }
  }
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
