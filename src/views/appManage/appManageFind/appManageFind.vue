<template>
  <div class="app_manage_find">
    <h1 class="hint_site">
       {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('find')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input :placeholder="$t('search_find')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="type" style="width:100%" :placeholder="$t('select_module_type')">
              <el-option :label="$t('albums')" :value="0"></el-option>
              <el-option :label="$t('designers')" :value="1"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
            <el-button @click="resetData">{{$t('reset_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button type="primary" @click="goFindCreation" icon="el-icon-circle-plus">{{$t('add_find')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">{{ $dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column :label="$t('find_title')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('module_type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type?$t('designers'):$t('albums')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('theme_logo')">
          <template slot-scope="scope">
            <img style="cursor:pointer" @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactFind(scope.$index, scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="manageGoods(scope.row)">{{$t("manage_Page")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteFind(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging" v-if="tableData.length">
        <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      seek: "", // 搜索关键字
      searchStr: "", //点击搜索生成的关键字
      type: "",
      typeNumber: "",
      tableData: [], // 数据
      pageSize: 10,
      total: 0,
      currentPage: 1
      //当前页数
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    //新增发现
    goFindCreation() {
      this.$router.replace("FindCreation.html");
    },
    //通过关键字搜索
    searchData() {
      this.currentPage = 1;
      this.searchStr = this.seek;
      this.typeNumber = this.type;
      this.getListData();
    },
    //重置搜索字段
    resetData() {
      this.currentPage = 1; //page置为1
      this.seek = "";
      this.type = "";
      this.searchStr = "";
      this.typeNumber = "";
      this.getListData();
    },
    //获取列表数据
    getListData(page = 1) {
      this.$Posting(this.$api.queryDiscoveryList, {
        title: this.searchStr,
        type: this.typeNumber,
        pageNo: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
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
    //编辑发现
    redactFind(index, row) {
      sessionStorage.setItem("editModuleMsg", JSON.stringify(row));
      this.$router.replace("FindCreation.html");
    },
    //管理商品
    manageGoods(row) {
      let { id } = row;
      this.$router.push({
        path: "findManageGoods.html",
        query: {
          id: id
        }
      });
    },
    // 删除发现
    deleteFind(index, row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteDiscovery, {
          id: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.currentPage !== 1) {
              this.getListData(this.currentPage - 1);
            } else {
              this.getListData(this.currentPage);
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
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getListData(val);
    }
  }
};
</script>

<style lang="less" >
.app_manage_find {
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
