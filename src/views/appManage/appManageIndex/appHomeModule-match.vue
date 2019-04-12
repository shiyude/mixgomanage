<template>
  <div class="AppMatch">
    <h1 class="hint_site">
      <!-- 当前位置：APP管理 > 首页 > 全景搭配 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('home_page')}} > {{$t('panoramic_collocation')}}
    </h1>
    <div class="AppMatch_conter">
      <div class="AppMatch_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_title')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="pullFindList">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button @click="AddAppMatch" type="primary" icon="el-icon-circle-plus">{{$t('add_panoramic')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="AppMatch_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('id')" width="180">
          <template slot-scope="scope">
            <i class="el-icon-tickets"></i>
            <span style="margin-left: 10px">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column class="find_list_img" :label="$t('theme_logo')">
          <template slot-scope="scope">
            <img @click.stop="$imgPreview(scope.row.image)" :src="scope.row.image" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('name')">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('set')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactFind(scope.$index, scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteFind(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="findPaging" :page-size="count" layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 选择专题确认框 -->
    <el-dialog class="AppMatch_subject" :title="$t('add_panoramic')" :visible.sync="findType" center width="80%">
      <div class="AppMatch_subject_btn">
        <el-form :model="form" label-position="left">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label-width="100px" label="标题" prop="name">
                <el-input placeholder="输入全景图标题" v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="goodsPup=true" icon="el-icon-circle-plus">添加商品</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label-width="100px" label="全景封面" prop="name">
                <uploader :backData="form.AppMatchImg" :id="'AppMatch1'" :mixLength='1'></uploader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="全景3D图" prop="name">
                <uploader :backData="form.AppMatchImg" :id="'AppMatch0'" :mixLength='1'></uploader>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="GoodsDataActive" border style="width: 100%">
          <el-table-column label="商品ID" width="180">
            <template slot-scope="scope">
              <i class="el-icon-tickets"></i>
              <span style="margin-left: 10px">{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column class="find_list_img" label="商品主片">
            <template slot-scope="scope">
              <img @click.stop="$imgPreview(scope.row.image)" :src="scope.row.image" alt="">
            </template>
          </el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品品牌">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="redactFind(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteFind(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block tab_paging">
          <el-pagination @current-change="findPaging" :page-size="count" layout="total,prev, pager, next, jumper" :total="GoodsTotal">
          </el-pagination>
        </div>
        <div class="pup_btn">
          <el-button type="primary">确定</el-button>
        </div>
      </div>
      <el-dialog width="70%" title="添加全景商品" :visible.sync="goodsPup" append-to-body>
        <listGoods dataType="commodity" ref="subclass"></listGoods>
        <div class="pup_btn">
          <el-button type="primary">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import uploader from "@/components/uploader.vue";
import listGoods from "@/components/listOfGoods.vue";
export default {
  components: {
    uploader,
    listGoods
  },
  data() {
    return {
      seek: "", // 搜索关键字
      tableData: [], // 数据
      fatherData: [], // 传入子组件匹配数据
      GoodsData: [], // 全景商品数据
      GoodsDataActive: [], // 当前页全景商品数据
      findType: false, //类型选择弹窗
      goodsPup: false, // 商品弹窗
      page: 1, // 列表分页
      count: 5, // 列表条数
      total: 0, // 列表总数据
      GoodsTotal: 0, // 全景商品总条数
      GoodsPage: 1, // 全景页数
      form: {
        AppMatchImg: []
      }
    };
  },
  mounted() {
    this.pullFindList();
  },
  methods: {
    goFindCreation() {
      this.findType = false;
    },
    pullFindList() {
      // 获取全景搭配列表
      this.$Post(this.$api.listpano, {
        page: this.page,
        count: this.count,
        key: this.seek
      }).then(res => {
        if (res.status === 0) {
          this.tableData = res.lists;
          console.log(this.tableData);
          this.total = res.count;
        } else {
          this.$notify.error({
            title: "错误",
            message: res.msg
          });
        }
      });
    },
    redactFind(index, row) {
      console.log(index, row);
    },
    deleteFind() {},
    AddAppMatch() {
      // 轮播设置
      this.postGroupingGoods();
      this.findType = true;
    },
    postGroupingGoods(id) {
      // 获取全景商品列表
      this.$Post(this.$api.listpnoobj, { id: id }).then(res => {
        if (res.status === 0) {
          this.fatherData = res.lists;
          this.GoodsData = this.$pagingFn(res.lists, 5);
          this.GoodsDataActive = this.GoodsData[0];
          this.GoodsTotal = res.lists.length;
          console.log("传过去的", this.fatherData);
        } else {
          this.$notify.error({
            title: "失败",
            message: res.msg
          });
        }
      });
    },
    findPaging(val) {
      this.page = val;
      this.pullFindList();
    }
  }
};
</script>

<style lang="less" >
.AppMatch_conter_input {
  margin-top: 15px;
  background: #fff;
  padding: 10px;
  .add_find_btn {
    text-align: center;
    min-width: 550px;
  }
}
.AppMatch_tab {
  margin-top: 15px;
  .cell {
    height: 40px;
    line-height: 40px;
    img {
      // width: 60px;;
      height: 100%;
    }
  }
  .find_list_img {
    // width: 40px;
    height: 40px;
  }
}
.AppMatch_subject {
  .el-dialog__body {
    padding: 20px;
    .AppMatch_subject_btn {
      // text-align: left;
      // text-align: center;
    }
  }
}
.pup_btn {
  text-align: center;
  margin-top: 10px;
}
</style>