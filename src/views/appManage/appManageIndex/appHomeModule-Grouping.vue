<template>
  <div class="Grouping">
    <h1 class="hint_site">
      <!-- 当前位置：内容管理  >  APP管理 > 首页 > 推荐分组 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('home_page')}} > {{$t('recommand_group')}}
    </h1>
    <div class="Grouping_conter">
      <div class="Grouping_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_title')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="getSeek">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button @click="addGroup" type="primary" icon="el-icon-circle-plus">{{$t('add_group')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="Grouping_table">
      <el-table border :data="groupingData" style="width: 100%">
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">{{ $dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column :label="$t('name1')" v-if="langType == 1 || langType == 3">
          <template slot-scope="scope">
            {{scope.row.groupName}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('name2')" v-if="langType == 2 || langType == 3">
          <template slot-scope="scope">
            {{scope.row.groupNameEn}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('backgorund_img')">
          <template slot-scope="scope">
            <img style="cursor:pointer" @click.stop="$imgPreview(hostUrl+scope.row.img)" :src="hostUrl+scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            {{scope.row.createUserName}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="350px">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactGrouping(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="goGroupGoods(scope.row)">{{$t("manage_goods")}}</el-button>
            <el-button size="mini" @click="topGroup(scope.row)">{{$t("to_top")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteGroup(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog class="optFor_subject" :title="$t('create_group')" :visible.sync="groupingPup" center width="500px" @close="clearValidate">
      <div class="optFor_subject_btn">
        <el-form label-position="left" ref="ruleForm" :model="ruleForm">
          <el-form-item :label="$t('title1')" label-width="110px" prop="groupingText" :rules="{
            required: true,
            message: $t('verificate_name1'),
            trigger: 'blur'
          }" v-if="langType == 1 || langType == 3">
            <el-input :placeholder="$t('verificate_name1')" v-model="ruleForm.groupingText" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('title2')" label-width="110px" prop="groupingText1" :rules="{
            required: true,
            message: $t('verificate_name2'),
            trigger: 'blur'
          }" v-if="langType == 2 || langType == 3">
            <el-input :placeholder="$t('verificate_name2')" v-model="ruleForm.groupingText1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('backgorund_img')" label-width="110px" prop="UpImgData" :rules="{
              type:'array',required: true, message: $t('verfivate_background_img'), trigger: 'blur'
             }">
            <uploader :backData="ruleForm.UpImgData" :id="'groupLogo'" :mixLength='1' :folder="'logo'"></uploader>
          </el-form-item>
        </el-form>
        <div style="text-align:center">
          <el-button type="primary" @click="upGrouping('ruleForm')" plain>{{$t("submit")}}</el-button>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploader from "@/components/uploader.vue";
export default {
  data() {
    return {
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      ruleForm: {
        groupingText: "", // 分组标题
        groupingText1: "", // 分组标题
        UpImgData: []
      },
      langType: 1,
      groupId: "",
      groupingPup: false, // 创建分组弹窗
      groupinggoodsPup: false,
      seek: "", // 搜索关键字
      groupingData: [], // 分组列表数据
      count: 10, // 每页显示
      total: 0, // 总条数
      pege: 1
    };
  },
  mounted() {
    this.postGrouping();
    this.langType = this.$getLangType();
  },
  methods: {
    clearValidate() {
      this.$refs.ruleForm.clearValidate();
    },
    getSeek() {
      this.pege = 1;
      this.postGrouping();
    },
    postGrouping() {
      // 拉取分组列表
      this.$Get(this.$api.queryHomeRecommandGroup, {
        pageNo: this.pege,
        pageSize: this.count,
        groupName: this.seek
      }).then(res => {
        if (res.code == 0) {
          this.groupingData = res.datas.lists;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    upGrouping(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        // 验证表单
        if (valid) {
          this.$Post(this.$api.saveHomeRecommandGroup, {
            groupName: this.ruleForm.groupingText,
            groupNameEn: this.ruleForm.groupingText1,
            img: this.ruleForm.UpImgData[0].url,
            groupId: this.groupId
          }).then(res => {
            if (res.code == 0) {
              let newUploadImg = _this.$changeUploadImg(_this.ruleForm.UpImgData); //获取提交的图片数组
              _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
              this.postGrouping();
              this.$notify.success({
                title: this.$t("alert_success_title"),
                message: this.$t("add_success_title")
              });
              this.groupingPup = false;
              this.groupId = "";
            } else {
              this.$notify.error({
                title: "fail",
                message: res.msg
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    addGroup() {
      // 新增
      this.groupingPup = true;
      this.groupId = "";
      this.ruleForm.groupingText = "";
      this.ruleForm.groupingText1 = "";
      this.ruleForm.UpImgData = [];
    },
    redactGrouping(row) {
      // 编辑弹框
      this.groupingPup = true;
      this.groupId = row.id;
      this.ruleForm.groupingText = row.groupName;
      this.ruleForm.groupingText1 = row.groupNameEn;
      this.ruleForm.UpImgData = [
        {
          src: this.hostUrl + row.img,
          url: row.img
        }
      ];
    },
    topGroup(row) {
      // 置顶
      this.$Get(this.$api.setTopGroup, { groupId: row.id }).then(res => {
        if (res.code == 0) {
          this.postGrouping();
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("operate_success_title")
          });
        } else {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("operate_fail_title")
          });
        }
      });
    },
    goGroupGoods(row) {
      // 去商品
      this.$router.push({
        path: "appGroupGoodsList.html",
        query: {
          id: row.id
        }
      });
    },
    deleteGroup(row) {
      // 删除分组
      let seft = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteHomeRecommandGroup, {
          groupId: row.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            this.postGrouping();
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
            return false;
          }
        });
      });
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
.Grouping {
  .Grouping_conter_input {
    margin-top: 15px;
    background: #fff;
    padding: 10px;
    .add_find_btn {
      text-align: center;
      min-width: 550px;
    }
  }
  .optFor_subject {
    .el-dialog__body {
      padding: 20px;
      .optFor_subject_btn {
        text-align: left;
      }
    }
  }
  .pup_btn {
    text-align: center;
    margin-top: 10px;
    button {
      width: 100px;
    }
  }
  .Grouping_table {
    margin-top: 15px;
  }
}
</style>
