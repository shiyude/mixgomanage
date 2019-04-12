<template>
  <div class="agent_hosue_list">
    <h1 class="hint_site">
      <!-- 当前位置：商家管理 > 开发商 > 关联楼盘 -->
      {{$t('current_position')}}： {{$t('business_manage')}} > {{$t('developers')}} > {{$t('relate_building')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_building')" prefix-icon="el-icon-search" v-model.trim="seek">
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
        <el-table-column :label="$t('building_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.houseName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_of_developer')">
          <template slot-scope="scope">
            <span>{{ scope.row.developersName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_addr')">
          <template slot-scope="scope">
            <span>{{ scope.row.province + scope.row.city + scope.row.district }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('website')">
          <template slot-scope="scope">
            <span>{{ scope.row.website }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_desc')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_logo')">
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
        developersId: this.$route.query.id,
        houseName: this.seek
      };
      this.$Get(this.$api.queryHouseList, { ...data }).then(res => {
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
.agent_hosue_list {
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
