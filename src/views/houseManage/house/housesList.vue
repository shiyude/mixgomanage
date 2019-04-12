<template>
  <div class="houses_lists">
    <h1 class="hint_site">
      <!-- 当前位置：商品管理 > 户型列表 -->
      {{$t('current_position')}}： {{$t('house_type_manage')}} > {{$t('house_type_list')}}
    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input style="width:180px;" :placeholder="$t('search_family_type')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-select v-model="house" :placeholder="$t('select_building')" style="width:180px;" filterable>
          <el-option v-for="(v,k) in houseList" :key="k" :value="v.id" :label="v.houseName"></el-option>
        </el-select>
        <el-select v-model="room" :placeholder="$t('select_house_type')" style="width:180px;" filterable>
          <el-option v-for="(v,k) in roomList" :key="k" :value="v.roomId" :label="v.roomName">
          </el-option>
        </el-select>
        <el-select v-model="style" :placeholder="$t('select_style')" style="width:180px;" filterable>
          <el-option v-for="(v,k) in styleList" :key="k" :value="v.styleId" :label="v.styleName">
          </el-option>
        </el-select>
        <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
        <el-button @click="resetData">{{$t('reset_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addGood" type="primary" icon="el-icon-circle-plus">{{$t('add_house_type')}}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="manufacturers_tab">
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
        <el-table-column :label="$t('building_name')">
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
            <span>{{ scope.row.styleName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('house_type_scale')">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="editGood(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t("delete")}}</el-button>
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
      searchStr: "", //点击搜索生成的关键字
      house: "", //开发商id
      houseId: "", //点击搜索生成的开发商id
      room: "", //空间id
      roomId: "", //点击搜索生成的空间id
      style: "", //风格id
      styleId: "", //点击搜索生成的风格id
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      houseList: [], //开发商数据
      roomList: [], //空间数据
      styleList: [] //风格数据
    };
  },
  mounted() {
    this.getListData();
    this.getHouse();
    this.getRoom();
    this.getStyle();
  },
  methods: {
    //添加商品
    addGood() {
      this.$router.replace({
        path: "house.html"
      });
    },
    //编辑商品
    editGood(data) {
      let { id } = data;
      sessionStorage.setItem("editHouseMsg", JSON.stringify(data));
      this.$router.replace({
        path: "house.html",
        query: {
          id: id
        }
      });
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
        this.$Posting(this.$api.deleteHouseType, {
          houseTypeId: id
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
    },
    //获取列表数据
    getListData(page = 1) {
      this.$Posting(this.$api.queryHouseTypeList, {
        houseTypeName: this.searchStr,
        houseId: this.houseId,
        roomId: this.roomId,
        styleId: this.styleId,
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
    //通过关键字搜索
    searchData() {
      this.currentPage = 1; //page置为1
      this.searchStr = this.seek;
      this.houseId = this.house;
      this.roomId = this.room;
      this.styleId = this.style;
      this.getListData();
    },
    //重置数据
    resetData() {
      this.currentPage = 1; //page置为1
      this.seek = "";
      this.house = "";
      this.room = "";
      this.style = "";
      this.searchStr = "";
      this.houseId = "";
      this.roomId = "";
      this.styleId = "";
      this.getListData();
    },
    // 获取楼盘列表
    getHouse() {
      this.$Get(this.$api.queryHouseList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.houseList = res.datas.lists;
      });
    },
    //获取户型列表
    getRoom() {
      this.$Posting(this.$api.queryHouseRoomList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.roomList = res.datas.lists;
      });
    },
    //获取风格列表
    getStyle() {
      this.$Posting(this.$api.queryHouseStyleList, {
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.styleList = res.datas.lists;
      });
    }
  }
};
</script>

<style lang="less"  scoped>
.houses_lists {
  .manufacturers_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 24%;
      text-align: left;
    }
  }
  .manufacturers_tab {
    margin-top: 15px;
  }
  .el-select {
    width: 100%;
  }
}
</style>

