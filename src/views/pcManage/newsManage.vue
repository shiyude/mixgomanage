<template >
  <div class="news_manage">
    <h1 class="hint_site">
      <!-- 当前位置：内容管理 > PC管理 > 新闻管理 -->
      {{$t('current_position')}}： {{$t('pc_manage')}} > {{$t('news_manage')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_title')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button type="primary" @click="goFindCreation" icon="el-icon-circle-plus">{{$t('add_news')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('id')" width="180">
          <template slot-scope="scope">
            <i class="el-icon-tickets"></i>
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('theme_logo')">
          <template slot-scope="scope">
            <img style="cursor:pointer" @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('find_title')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactFind(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteFind(scope.$index, scope.row)">{{$t("delete")}}</el-button>
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
      seek: "", // 搜索关键字
      searchStr: "",
      //点击搜索生成的关键字
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
    goFindCreation() {
      this.$router.replace("/home/news.html");
    },
    //通过关键字搜索
    searchData() {
      this.currentPage = 1;
      this.getListData(this.seek);
      this.searchStr = this.seek;
    },
    //获取列表数据
    getListData(key = "", page = 1) {
      this.$Posting(this.$api.newsList, {
        title: key,
        pageNo: page,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          console.log(111);
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
    redactFind(row) {
      console.log(row);
      sessionStorage.setItem("editNewsMsg", JSON.stringify(row));
      this.$router.replace("/home/news.html");
    },
    deleteFind(index, row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteNews, {
          id: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.currentPage !== 1) {
              this.getListData(this.searchStr, this.currentPage - 1);
            } else {
              this.getListData(this.searchStr, this.currentPage);
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
      this.getListData(this.searchStr, val);
    }
  }
};
</script>

<style lang="less" >
.news_manage {
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


