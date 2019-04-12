<template>
  <div class="edit_version">
    <h1 class="hint_site" style="margin-bottom:15px;">
      {{$t('current_position')}}： {{$t('version_manage')}} > {{$t('version_release')}}
    </h1>
    <div class="version_form">
      <el-form class='demo-ruleForm' label-width="170px">
        <div class="form_section" v-if="isShowSelectCompany">
          <el-form-item :label="$t('company_select')">
            <el-select class='form_input_375' v-model="companyId" filterable :placeholder="$t('verificate_company_select')">
              <el-option v-for="item in companyList" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form_section">
          <div class='form_title'>
            <span>{{$t('ios_set')}}</span>
          </div>
          <el-form-item :label="$t('version_num')">
            <el-input class='form_input_375' v-model="iosVersion" :placeholder="$t('verificate_version_num')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('update_url')">
            <el-input class='form_input_375' v-model="iosUrl" :placeholder="$t('verificate_update_url')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('force_update')">
            <el-radio v-model="iosUpdate" :label="1">{{$t('yes')}}</el-radio>
            <el-radio v-model="iosUpdate" :label="2">{{$t('no')}}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('update_desc')">
            <el-input type="textarea" v-model="iosDesc" style="width:375px" rows="5" :placeholder="$t('verificate_update_desc')"></el-input>
          </el-form-item>
        </div>
        <div class="form_section">
          <div class='form_title'>
            <span>{{$t('android_set')}}</span>
          </div>

          <el-form-item :label="$t('version_num')">
            <el-input class='form_input_375' v-model="androidVersion" :placeholder="$t('verificate_version_num')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('update_url')">
            <el-input class='form_input_375' v-model="androidUrl" :placeholder="$t('verificate_update_url')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('force_update')">
            <el-radio v-model="androidUpdate" :label="1">{{$t('yes')}}</el-radio>
            <el-radio v-model="androidUpdate" :label="2">{{$t('no')}}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('update_desc')">
            <el-input type="textarea" v-model="androidDesc" style="width:375px" rows="5" :placeholder="$t('verificate_update_desc')"></el-input>
          </el-form-item>
        </div>
        <div class="form_section">
          <div class='form_title'>
            <span>{{$t('resource_set')}}</span>
          </div>
          <el-form-item :label="$t('version_num')">
            <el-input class='form_input_375' v-model="webVersion" :placeholder="$t('verificate_version_num')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('upload_web_file')">
            <el-upload class="upload-demo" :before-upload='beforeUploadFile' :http-request="uploadSectionFile" action='' accept='.upk' :show-file-list='false'>
              <el-button type="primary">{{$t('browse')}}</el-button>
              <span class='fileName'>
                {{webZip[0]&&webZip[0].src}}
                <span v-if="webZip[0]&&webZip[0].src" class='el-icon-delete icon_delete' @click.stop='deleteZip'></span>
              </span>
            </el-upload>
          </el-form-item>
        </div>
        <div class="submit_form">
          <el-button type="primary" size="medium" style="width:300px;height:40px" @click='submitVersionForm'>{{$t('release')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      iosVersion: "",
      iosUrl: "",
      iosUpdate: 2,
      iosDesc: "",
      androidVersion: "",
      androidUrl: "",
      androidUpdate: 2,
      androidDesc: "",
      webVersion: "",
      webZip: [],
      verId: "",
      companyId: "",
      companyList: [],
      isShowSelectCompany: false,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      companySessionId: JSON.parse(window.sessionStorage.getItem("userInfo"))
        .companyId
    };
  },
  mounted() {
    if (
      this.companySessionId == 1 &&
      !sessionStorage.getItem("editVersionMsg")
    ) {
      this.isShowSelectCompany = true;
      //公司为mixgo且新增的时候调用
      this.getQueryCompanyList();
    } else {
      if (this.companySessionId == 1) {
        this.companyId = JSON.parse(
          sessionStorage.getItem("editVersionMsg")
        ).companyId;
      } else {
        this.companyId = this.companySessionId;
      }
    }
    this.judgeSession();
  },
  methods: {
    beforeUploadFile() {
      if (this.webZip.length) {
        this.$message({
          message: this.$t("delete_origin_file"),
          type: "warning"
        });
        return false;
      }
    },
    getQueryCompanyList() {
      this.$Get(this.$api.queryCompanyList, {
        pageNo: 1,
        pageSize: 100000
      }).then(res => {
        if (res.code == 0) {
          this.companyList = res.datas.lists;
        }
      });
    },
    //判断是否有缓存
    judgeSession() {
      if (sessionStorage.getItem("editVersionMsg")) {
        //判断缓存里面有没有编辑信息
        let editVersionMsg = JSON.parse(
          sessionStorage.getItem("editVersionMsg")
        );
        this.verId = editVersionMsg.verId;
        this.iosVersion = editVersionMsg.iosVer;
        this.iosUrl = editVersionMsg.iosUrl;
        this.iosUpdate = editVersionMsg.iosUpdate;
        this.iosDesc = editVersionMsg.iosDesc;
        this.androidVersion = editVersionMsg.androidVer;
        this.androidUrl = editVersionMsg.androidUrl;
        this.androidUpdate = editVersionMsg.androidUpdate;
        this.androidDesc = editVersionMsg.androidDesc;
        this.webVersion = editVersionMsg.resourceVer;
        editVersionMsg.resourceUrl &&
          (this.webZip = [
            {
              src: this.hostUrl + editVersionMsg.resourceUrl,
              url: editVersionMsg.resourceUrl
            }
          ]);
      } else {
        return;
      }
    },
    //发布版本
    submitVersionForm() {
      if (this.companyId == "") {
        this.$message({
          message: this.$t("verificate_company_select"),
          type: "warning"
        });
        return;
      }
      if (
        (!this.iosVersion && this.iosUrl) ||
        (this.iosVersion && !this.iosUrl)
      ) {
        this.$message({
          message: this.$t("verificate_ios"),
          type: "warning"
        });
        return;
      }
      if (
        (!this.androidVersion && this.androidUrl) ||
        (this.androidVersion && !this.androidUrl)
      ) {
        this.$message({
          message: this.$t("verificate_android"),
          type: "warning"
        });
        return;
      }
      if (
        (!this.webVersion && this.webZip.length) ||
        (this.webVersion && !this.webZip.length)
      ) {
        this.$message({
          message: this.$t("verificate_resource"),
          type: "warning"
        });
        return;
      }
      this.$Post(this.$api.saveAppVersion, {
        verId: this.verId,
        editCompanyId: this.companyId,
        iosUrl: this.iosUrl,
        iosVer: this.iosVersion,
        iosUpdate: this.iosUpdate,
        iosDesc: this.iosDesc,
        androidUrl: this.androidUrl,
        androidVer: this.androidVersion,
        androidUpdate: this.androidUpdate,
        androidDesc: this.androidDesc,
        resourceVer: this.webVersion,
        resourceUrl: this.webZip[0] ? this.webZip[0].url : ""
      })
        .then(res => {
          if (res.code === "0") {
            if (window.sessionStorage.getItem("uploadedZip")) {
              window.sessionStorage.removeItem("uploadedZip");
            }
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.$router.replace("/home/versionList.html");
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("operate_fail_title")
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("operate_fail_title")
          });
        });
    },
    //删除文件
    deleteZip() {
      let self = this;
      this.$Post(this.$api.deleteFile, { path: self.webZip[0].src })
        .then(res => {
          if (res.code === "0") {
            self.webZip = [];
            if (window.sessionStorage.getItem("uploadedZip")) {
              window.sessionStorage.removeItem("uploadedZip");
            }
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("alert_fail_delete_title")
          });
        });
    },
    //zip文件上传成功后的函数
    uploadSectionFile(file) {
      let user = JSON.parse(window.sessionStorage.getItem("userInfo"));
      let formData = new FormData();
      let self = this;
      formData.append("token", user.token);
      formData.append("userId", user.id);
      formData.append("image", file.file);
      this.$PostFormData(`${this.$api.uploader}?upload_type=resource`, formData)
        .then(res => {
          if (res.code == 0) {
            self.webZip = [
              {
                src: res.path,
                url: res.url
              }
            ];
            window.sessionStorage.setItem(
              "uploadedZip",
              JSON.stringify([res.path])
            );
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("upload_fail_alert")
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("upload_fail_alert")
          });
        });
    }
  },
  beforeDestroy() {
    this.$deleteZip();
    sessionStorage.getItem("editVersionMsg") &&
      sessionStorage.removeItem("editVersionMsg");
  }
};
</script>
<style lang="less" scoped>
.edit_version {
  .form_section {
    padding: 18px 0 1px 20px;
    background-color: #fff;
    margin-bottom: 2px;
    .form_title {
      margin-bottom: 18px;
      span {
        background-color: #f0f0f0;
        font-size: 14px;
        padding: 5px 10px;
        border-radius: 10px;
      }
    }
    .form_input_375 {
      width: 375px;
    }
  }
  .submit_form {
    background-color: #fff;
    padding: 20px;
    text-align: center;
  }
}
</style>


