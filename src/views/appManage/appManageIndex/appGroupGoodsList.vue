<template>
  <div class="appGroupGoodsList">
    <h1 class="hint_site">
      <!-- 当前位置： APP管理 > 首页 > 推荐分组 > 分组商品 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('home_page')}} > {{$t('recommand_group')}} > {{$t('group_goods')}}
    </h1>
    <div class="appGroupGoodsList_conter">
      <div class="appGroupGoodsList_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button type="primary" @click="isDialog = true" icon="el-icon-circle-plus">{{$t('add_goods')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="appGroupGoodsList_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">{{ $dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column :label="$t('good_name')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('classify_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_logo')">
          <template slot-scope="scope">
            <img style="cursor:pointer" @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="topGoods(scope.row)">{{$t("to_top")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteGoods(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="page" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="$t('add_goods')" :visible.sync="isDialog" width="70%" center>
      <!-- <listGoods :fatherData="fatherData" :ApiData="ApiData" dataType="commodity" ref="subclass"></listGoods> -->
      <listGoods ref="subclass" :fatherData="fatherData" :tableConfig="tableConfig" :interfaceConfig="interfaceConfig"></listGoods>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="receiveSon">{{$t("submit")}}</el-button>
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
      seek: "",
      tableData: [],
      pageSize: 5,
      page: 1,
      total: 0,
      isDialog: false,
      fatherData: [],
      hostUrl: sessionStorage.getItem("serveUrl") || "",
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
        api: this.$api.queryHomeRecommand,
        params: {
          groupId: this.$route.query.id,
          action: "add"
        },
        keyWord: "goodsName"
      }
    };
  },
  mounted() {
    this.getGoods();
  },
  methods: {
    getGoods() {
      this.$Get(this.$api.queryHomeRecommand, {
        groupId: this.$route.query.id,
        pageNo: this.page,
        pageSize: this.pageSize,
        action: "query",
        goodsName: this.seek
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
          this.fatherData = res.datas.lists;
          this.total = res.datas.count;
          // console.log(res)
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    topGoods(row) {
      let { id } = row;
      this.$Get(this.$api.setTopRecommand, {
        goodsId: id,
        groupId: this.$route.query.id
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: ""
          });
          this.getGoods();
        }
      });
    },
    deleteGoods(row) {
      let { id } = row;
      let seft = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteHomeRecommand, {
          goodsId: id,
          groupId:this.$route.query.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            this.getGoods();
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
    searchData() {
      this.page = 1;
      this.getGoods();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getGoods();
    },
    receiveSon() {
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
        this.$Post(this.$api.saveHomeRecommand, {
          groupId: this.$route.query.id,
          goodsIds: newData
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t('add_success_title')
            });
            this.getGoods();
            this.isDialog = false;
          } else {
            this.$notify.error({
               title: this.$t("alert_fail_title"),
              message: this.$t('add_fail_title')
            });
          }
        });
      } else {
        this.$notify({
          title: this.$t("warning"),
          message: this.$t("no_choice_good"),
          type: "warning"
        });
        this.selectedShopPop = false;
      }
    }
  }
};
</script>

<style lang="less" >
.appGroupGoodsList {
  .appGroupGoodsList_conter_input {
    margin-top: 15px;
    background: #fff;
    padding: 10px;
    .add_find_btn {
      text-align: center;
    }
  }
  .appGroupGoodsList_tab {
    margin-top: 15px;
  }
}
</style>
