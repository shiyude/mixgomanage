<template>
  <div class="goodThing">
    <h1 class="hint_site">
      <!-- 当前位置：APP管理 > 首页 > 特卖好物 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('home_page')}} > {{$t('better_goods')}}
    </h1>
    <div class="shopGoods_head clearfix">
      <div class="left">
        <el-input style="width:300px;" :placeholder="$t('search_goods')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="GetSeek">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addShopGoods" type="primary" icon="el-icon-circle-plus">{{$t('add_goods')}}</el-button>
      </div>
    </div>
    <el-dialog :title="$t('add_goods')" :visible.sync="isDialog" width="70%" center>
      <listGoods ref="subclass" :fatherData="fatherData" :tableConfig="tableConfig" :interfaceConfig="interfaceConfig"></listGoods>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="receiveSon">{{$t("submit")}}</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <div class="shopGoods_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">{{ $dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column :label="$t('good_name')">
          <template slot-scope="scope">
            <span>{{scope.row.goodsName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_logo')">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('classify_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="toTop(scope.row)">{{$t("to_top")}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="Page" :total="total">
      </el-pagination>
    </div>
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
      tableData: [],
      seek: "",
      pageSize: 10,
      Page: 1,
      total: 0,
      isDialog: false,
      ApiData: {},
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
        api: this.$api.queryHomeHot,
        params: {
          type: 2,
          action: "add"
        },
        keyWord: "goodsName"
      }
    };
  },
  mounted() {
    this.getShopGoodsList();
  },
  methods: {
    addShopGoods() {
      this.isDialog = true;
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
      this.submitData(SonData);
      console.log(data);
    },
    GetSeek() {
      this.Page = 1;
      this.getShopGoodsList();
    },
    getShopGoodsList() {
      this.$Get(this.$api.queryHomeHot, {
        type: 2,
        action: "query",
        pageNo: this.Page,
        pageSize: this.pageSize,
        goodsName: this.seek
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
          this.fatherData = res.datas.lists;
          this.total = res.datas.count;
          console.log(this.fatherData);
        }
      });
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
      let data = {
        goodsIds: this.changeTableData(jsonData),
        type: 2
      };
      let _this = this;
      this.$Posting(this.$api.saveHomeHot, data, true).then(res => {
        if (res.code == 0) {
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("add_success_title")
          });
          _this.isDialog = false;
          _this.getShopGoodsList();
        } else {
          _this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    handleDelete(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteHomeHot, {
          goodsId: id,
          type: 2
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.Page > 1) {
              this.Page = this.Page - 1;
              this.getShopGoodsList();
            } else {
              this.getShopGoodsList();
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
    },
    //置顶发现
    toTop(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_to_top"), this.$t("to_top"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.setTopHomeHot, {
          goodsId: id,
          type: 2
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.getShopGoodsList(this.currentPage);
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("operate_fail_title")
            });
            return false;
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.Page = val;
      this.getShopGoodsList();
    }
  }
};
</script>
<style lang="less">
.goodThing {
  .shopGoods_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
      text-align: left;
    }
  }
  .shopGoods_tab {
    margin-top: 15px;
  }
}
</style>
