<template>
  <div class="houseType">
    <h1 class="hint_site">
      <!-- 当前位置：商家管理 > 楼盘管理 > 所属户型 -->
        {{$t('current_position')}}： {{$t('business_manage')}} > {{$t('building_manage')}} > {{$t('family_type')}}
    </h1>
    <div class="houseType_head">
      <div class="houseType_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_family_type')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="postListmark()">{{$t('seach_btn')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 表格 -->
    <div class="houseType_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('house_type_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.houseTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('family_buliding')">
          <template slot-scope="scope">
            <span>{{ scope.row.houseName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('house_type')">
          <template slot-scope="scope">
            <span>{{ scope.row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('style')">
          <template slot-scope="scope">
            <span :title="scope.row.desc">{{ scope.row.styleName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('building_logo')" >
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging" v-show="tableData.length">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      seek: "", //关键字
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      hostUrl: sessionStorage.getItem("serveUrl") || "",
    }
  },
  mounted() {
    this.getHouseType()
  },
  methods: {
    getHouseType() {
      this.$Get(this.$api.queryHouseTypeList, {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        houseId: this.$route.query.id,
        houseTypeName: this.seek
        }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists
          this.total = res.datas.count
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getHouseType()
    },
    postListmark() { 
      this.currentPage = 1
      this.getHouseType()
    }
  }
}
</script>
<style lang="less" scoped>
.houseType {
  .houseType_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
  }
  .houseType_tab {
    margin-top: 15px;
  }
}
</style>
