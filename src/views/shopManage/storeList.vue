<template lang="html">
  <div class="storeList">
    <h1 class="hint_site">
      当前位置：门店管理  >  门店列表
    </h1>
    <!-- 头部 -->
    <div class="storeList_head clearfix">
      <div class="left">
        <el-input
          style="width:300px;"
          placeholder="输入门店名称"
          prefix-icon="el-icon-search"
          v-model="seek">
        </el-input>
        <el-button  @click="postListData">搜索</el-button>
      </div>
      <div class="right">
        <el-button @click="goToaddStore" type="primary" icon="el-icon-circle-plus">添加门店</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="storeList_tab">
       <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          label="门店编号"
          width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="门店主图">
          <template slot-scope="scope">
  <img @click.stop="$imgPreview(scope.row.pic)" :src="scope.row.pic" alt="">
</template>
        </el-table-column>
         <el-table-column
          label="门店名称">
          <template slot-scope="scope">
  <span>{{ scope.row.name }}</span>
</template>
        </el-table-column>
         <el-table-column
          label="门店地址">
          <template slot-scope="scope">
  <span>{{ scope.row.addr }}</span>
</template>
        </el-table-column>
        <el-table-column
          label="门店电话">
          <template slot-scope="scope">
  <span>{{ scope.row.phone }}</span>
</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
  <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="count"
        layout="total,prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["Site"])
  },
  data() {
    return {
      tableData: [],
      seek: "", // 搜索关键字
      page: 1, // 分页
      count: 10, // 每页条数
      total: 20 // 总条数
    };
  },
  mounted() {
    this.postListData();
  },
  methods: {
    ...mapMutations(["changeSite"]),
    goToaddStore() {
      this.$router.replace("/home/addStore.html");
      this.changeSite("/home/addStore.html");
    },
    postListData() {
      this.$Post(this.$api.listshop, {
        page: this.page,
        count: this.count,
        key: this.seek
      }).then(res => {
        if (res.status === 0) {
          this.tableData = res.lists;
          this.total = res.count;
          console.log(res);
        } else {
          this.$notify.error({
            title: "错误",
            message: res.msg
          });
        }
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.postListData();
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="less" >
.storeList {
  .storeList_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
      text-align: left;
    }
  }
  .storeList_tab {
    margin-top: 15px;
  }
}
</style>
