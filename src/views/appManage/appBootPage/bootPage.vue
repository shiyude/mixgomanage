<template>
  <div class="bootPage">
    <h1 class="hint_site">
      <!-- 当前位置：内容管理  >  APP管理 > 启动页管理 > 启动页管理 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('boot_page_management')}} > {{$t('boot_page_management')}}
    </h1>
    <div class="bootPage_conter">
      <div class="bootPage_conter_input">
        <el-button @click="addBoot" type="primary" icon="el-icon-circle-plus">{{$t('add_boot_page')}}</el-button>
      </div>
    </div>
    <div class="bootPage_table">
      <el-table border :data="bootData" style="width: 100%">
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">{{ scope.row.updateTime }}</template>
        </el-table-column>
        <el-table-column :label="$t('website')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.url}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('boot_page_img')" >
          <template slot-scope="scope">
            <img style="cursor:pointer" @click.stop="$imgPreview(hostUrl+scope.row.img)" :src="hostUrl+scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            {{scope.row.updateUserName}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="350px">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactBoot(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" type="danger" v-if="scope.row.status == 0" @click="operateStatus(scope.row,'1')">{{$t("prohibit")}}</el-button>
            <el-button size="mini" type="primary" v-else @click="operateStatus(scope.row,'0')">{{$t("enable")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog class="optFor_subject" :title="$t('create_boot_page')" :visible.sync="bootPup" center width="500px" @close="clearValidate">
      <div class="optFor_subject_btn">
        <el-form label-position="left" ref="ruleForm" :model="ruleForm">
          <el-form-item :label="$t('website')" label-width="110px" prop="url" :rules="{
            required: true,
            message: $t('verificate_developer_website'),
            trigger: 'blur'
          }">
            <el-input :placeholder="$t('verificate_developer_website')" v-model="ruleForm.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('boot_page_img')" label-width="110px" prop="UpImgData" :rules="{
              type:'array',required: true, message: $t('verificate_boot_page'), trigger: 'blur'
             }">
            <uploader :backData="ruleForm.UpImgData" :id="'groupLogo'" :mixLength='1' :folder="'logo'" :maxSize="300"></uploader>
          </el-form-item>
        </el-form>
        <div style="text-align:center">
          <el-button type="primary" @click="upBoot('ruleForm')" plain>{{$t("submit")}}</el-button>
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
        url: "", // 链接
        UpImgData: []
      },

      bootId: "",
      bootPup: false, // 创建分组弹窗
      bootgoodsPup: false,
      bootData: [] // 分组列表数据
    };
  },
  mounted() {
    this.postBoot();
  },
  methods: {
    clearValidate() {
      this.$refs.ruleForm.clearValidate();
    },
    postBoot() {
      // 拉取分组列表
      this.$Get(this.$api.queryAppStart, {}).then(res => {
        if (res.code == 0) {
          this.bootData = res.datas;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    upBoot(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        // 验证表单
        if (valid) {
          this.$Post(this.$api.saveAppStart, {
            url: this.ruleForm.url,
            img: this.ruleForm.UpImgData[0].url,
            id: this.bootId
          }).then(res => {
            if (res.code == 0) {
              let newUploadImg = _this.$changeUploadImg(
                _this.ruleForm.UpImgData
              ); //获取提交的图片数组
              _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
              this.postBoot();
              this.$notify.success({
                title: this.$t("alert_success_title"),
                message: this.$t("add_success_title")
              });
              this.bootPup = false;
              this.bootId = "";
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
    addBoot() {
      // 新增
      this.bootPup = true;
      this.bootId = "";
      this.ruleForm.url = "";
      this.ruleForm.UpImgData = [];
    },
    redactBoot(row) {
      // 编辑弹框
      this.bootPup = true;
      this.bootId = row.id;
      this.ruleForm.url = row.url;
      this.ruleForm.UpImgData = [
        {
          src: this.hostUrl + row.img,
          url: row.img
        }
      ];
    },
    operateStatus(row,status) {
      //启用
      this.$Geting(this.$api.udpateStart, {
        id: row.id,
        status:status
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("operate_success_title")
          });
          this.postBoot();
        } else {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("operate_fail_title")
          });
          return false;
        }
      });
    },
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
.bootPage {
  .bootPage_conter_input {
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
  .bootPage_table {
    margin-top: 15px;
  }
}
</style>
