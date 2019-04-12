<template>
  <div class="agent_shop_list">
    <h1 class="hint_site">
      <!-- 当前位置：商家管理 > 代理商 > 关联门店 -->
      {{$t('current_position')}}： {{$t('business_manage')}} > {{$t('agent')}} > {{$t('relate_store')}}

    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_store')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('store_name')">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              {{scope.row.storeName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_phone')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_email')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactEmail }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_add')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactAddr }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('store_logo')">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging" v-show="tableData.length">
        <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="pageNo" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seek: "",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      tableData: [],
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  mounted() {
    this.getCategorList();
  },
  methods: {
    searchData() {
      this.pageNo = 1;
      this.getCategorList();
    },
    getCategorList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        retailerId: this.$route.query.id,
        storeName: this.seek
      };
      this.$Get(this.$api.queryRetailerStoreList, { ...data }).then(res => {
        if (res.code == 0) {
          console.log(res);
          this.tableData = res.datas.lists;
          this.total = res.datas.count;
        }
      });
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getCategorList();
    }
  }
};
</script>
<style lang="less">
.agent_shop_list {
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
    .cell {
      height: 60px;
      // line-height: 60px;
      img {
        height: 100%;
      }
    }
    .find_list_img {
      height: 40px;
    }
  }
}
</style>
