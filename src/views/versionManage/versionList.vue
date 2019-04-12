<template >
  <div class="version_manage">
    <h1 class="hint_site">
      {{$t('current_position')}}： {{$t('version_manage')}} > {{$t('version_lists')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-button type="primary" @click="goVersion(null)" icon="el-icon-circle-plus">{{$t('add_version')}}</el-button>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('ios_ver')">
          <template slot-scope="scope">
            <span>{{ scope.row.iosVer}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ios_url')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.iosUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ios_update')">
          <template slot-scope="scope">
            <span v-if="scope.row.iosUpdate==1">{{$t('yes')}}</span>
            <span v-else>{{$t('no')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('android_ver')">
          <template slot-scope="scope">
            <span>{{ scope.row.androidVer }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('android_url')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.androidUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('android_update')">
          <template slot-scope="scope">
            <span v-if="scope.row.androidUpdate==1">{{$t('yes')}}</span>
            <span v-else>{{$t('no')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resource_ver')">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceVer }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resource_url')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{scope.row.resourceUrl&&(hostUrl+scope.row.resourceUrl) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="300px">
          <template slot-scope="scope">
            <el-button type="success" plain disabled size="mini" v-if="scope.row.status==0">{{$t('now_version')}}</el-button>
            <el-button type="warning" plain v-else size="mini" @click="changeVersion(scope.row)">{{$t('old_version')}}</el-button>
            <el-button size="mini" @click="goVersion(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteVersion(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
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
      tableData: [], // 数据
      pageSize: 10,
      total: 0,
      currentPage: 1,
      hostUrl: sessionStorage.getItem("serveUrl") || ""
      //当前页数
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    //启用当前版本
    changeVersion(row) {
      let id = row.verId;
      let companyId = row.companyId
      let _this = this;
      this.$confirm(this.$t("alert_change_version"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.updateAppVersionStatus, {
          verId: id,
          editCompanyId:companyId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.getListData(this.currentPage);
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
    goVersion(row) {
      if (row) {
        sessionStorage.setItem("editVersionMsg", JSON.stringify(row));
      }
      this.$router.replace("/home/editVersion.html");
    },
    //获取列表数据
    getListData(page = 1) {
      this.$Posting(this.$api.queryAppVersion, {
        pageNo: page,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res);
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
    deleteVersion(row) {
      console.log(row);
      let id = row.verId;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteAppVersion, {
          verId: id
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
    },
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getListData(val);
    }
  }
};
</script>

<style lang="less" >
.version_manage {
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



