<template>
  <div class="app_children_series">
    <h1 class="hint_site">
      <!-- 当前位置：APP管理 > 分类 > 系列 > 子系列 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('classification')}} > {{$t('series')}} > {{$t('children_series')}}

    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input style="width:200px;" :placeholder="$t('search_children_series')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addData" type="primary" icon="el-icon-circle-plus">{{$t('add_children_series')}}</el-button>
        <el-button icon="el-icon-back" @click="$router.replace('appSeries.html')">{{$t('go_back')}}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="manufacturers_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('children_series_id')">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              {{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('children_series_name1')" v-if="langType == 1 || langType == 3">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryValue }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('children_series_name2')" v-if="langType == 2 || langType == 3">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryValueEn }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('children_series_logo')">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="450">
          <template slot-scope="scope">
            <el-button size="mini" @click="toTop(scope.row)">{{$t("to_top")}}</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="editorBrand(scope.row.id)">{{$t('manage_chilren_goods')}}</el-button>
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
    <el-dialog :title="$t('set_children_series')" :visible.sync="dialogVisible" :before-close="closeDialog" width="600px" center>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="230px">
        <el-form-item :label="$t('children_series_name1')" prop="name" :rules="{
            required: true,
            message: $t('verificate_children_series_name1'),
            trigger: 'blur'
          }" v-if="langType == 1 || langType == 3">
          <el-input v-model.trim="ruleForm.name" :placeholder="$t('children_series_name1')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('children_series_name2')" prop="name1" :rules="{
            required: true,
            message: $t('verificate_children_series_name2'),
            trigger: 'blur'
          }" v-if="langType == 2 || langType == 3">
          <el-input v-model.trim="ruleForm.name1" :placeholder="$t('children_series_name2')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('children_series_logo')" prop="logo" :rules="{
              type:'array',required: true, message: $t('verificate_children_series_logo'), trigger: 'blur'
             }">
          <uploader :backData="ruleForm.logo" :id="'logo0'" :mixLength='1' :folder="'logo'"></uploader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t("submit")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploader from "@/components/uploader.vue";
export default {
  data() {
    return {
      langType: 1,
      tableData: [],
      dialogVisible: false,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      ruleForm: {
        name: "",
        name1: "",
        logo: []
      },
      seek: "", //关键字
      searchStr: "", //点击搜索生成的关键字
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      selectData: null, //添加时selectData置空，编辑时给selectData赋值
      rules: {}
    };
  },
  mounted() {
    this.getListData();
    this.langType = this.$getLangType();
  },
  methods: {
    //置顶分组
    toTop(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_to_top"), this.$t("to_top"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.setTopCustomCategory, {
          id: id,
          categoryId: _this.$route.query.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.getListData(this.searchStr, this.currentPage);
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
    //编辑的方法
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.renderForm(row);
      this.selectData = row;
    },
    //添加的方法
    addData() {
      this.dialogVisible = true;
      this.selectData = null;
    },
    //编辑分组的品牌
    editorBrand(id) {
      this.$router.push({
        path: "childrenSeriesAddGoods.html",
        query: {
          id: id,
          parentId: this.$route.query.id
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
        this.$Posting(this.$api.deleteGoodsCustomCategoryValue, {
          categoryValueId: id
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

      // console.log(index, row);
    },
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getListData(this.searchStr, val);
    },
    //获取列表数据
    getListData(key = "", page = 1) {
      this.$Posting(this.$api.queryGoodsCustomCategoryValueList, {
        // spaceName: key,
        pageNo: page,
        pageSize: this.pageSize,
        categoryId: this.$route.query.id,
        categoryValue: this.searchStr
      }).then(res => {
        // console.log(res);
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
      this.getListData(this.seek);
    },
    //提交数据
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let dataObj = {
            categoryValue: _this.ruleForm.name,
            categoryValueEn: _this.ruleForm.name1,
            logo: _this.ruleForm.logo[0].url,
            categoryId: _this.$route.query.id
          };
          if (this.selectData === null) {
            this.submitData(dataObj, 0);
          } else {
            dataObj.categoryValueId = this.selectData.id;
            this.submitData(dataObj, 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //dialog框消失时清空表单
    closeDialog() {
      this.resetForm();
    },
    //表单渲染的方法
    renderForm(data) {
      this.ruleForm = {
        name: data.categoryValue,
        name1: data.categoryValueEn,
        logo: [
          {
            src: this.hostUrl + data.logo,
            url: data.logo
          }
        ]
      };
    },
    // 重置表单
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
      this.ruleForm = {
        name: "",
        name1: "",
        logo: []
      };
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      this.$Posting(this.$api.saveGoodsCustomCategoryValue, jsonData).then(
        res => {
          if (res.code == 0) {
            let newUploadImg = _this.$changeUploadImg(_this.ruleForm.logo); //获取提交的图片数组
            _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
            _this.resetForm();
            _this.$notify.success({
              title: this.$t("alert_success_title"),
              message: message
            });
            _this.getListData(this.searchStr, this.currentPage);
          } else {
            _this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: res.msg
            });
          }
        }
      );
    }
  },
  components: {
    uploader
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>

<style lang="less"  scoped>
.app_children_series {
  .manufacturers_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
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


