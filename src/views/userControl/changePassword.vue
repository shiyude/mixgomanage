<template>
  <div class="change_password_wrapper">
    <i class="body__img__close" @click="goHome"></i>
    <div class="change_password">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{$t('change_pass')}}</span>
        </div>
        <div>
          <el-steps :active="activeTitle" finish-status="success" simple>
            <el-step :title="$t('change_pass')"></el-step>
            <el-step :title="$t('change_success')"></el-step>
          </el-steps>
        </div>
        <div class="change_form" v-if="activeTitle==1">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="rules2" status-icon>
            <el-form-item :label="$t('user_num')" prop="userName">
              <el-input type="text" v-model.trim="ruleForm.userName" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('old_pass')" prop="oldPass">
              <el-input :type="passType" v-model.trim="ruleForm.oldPass" @focus="changeType"></el-input>
            </el-form-item>
            <el-form-item :label="$t('new_pass')" prop="newPass">
              <el-input type="password" v-model.trim="ruleForm.newPass"></el-input>
            </el-form-item>
            <el-form-item :label="$t('check_pass')" prop="checkPass">
              <el-input type="password" v-model.trim="ruleForm.checkPass"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center">
              <el-button type="primary" @click="submitForm('ruleForm')" class="button_change_password">{{$t('confirm_change')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="change_success" v-else>
          <el-alert :title="$t('login_again')" type="success" show-icon :closable="false">
            <span class="times"><br/>{{timeS}}s{{$t('later_go')}}
              <span @click="nowGo"> {{$t('now_go')}}>></span>
            </span>
          </el-alert>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    var checkOld = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t("verificate_old_pass")));
      } else if (value.length < 6) {
        callback(new Error(this.$t("verificate_old_pass1")));
      } else {
        callback();
      }
    };
    var validateNewPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("verificate_new_pass")));
      } else if (value.length < 6) {
        callback(new Error(this.$t("verificate_new_pass1")));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("verificate_check_pass")));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error(this.$t("verificate_check_pass1")));
      } else {
        callback();
      }
    };
    return {
      passType: "text",
      timeS: 5,
      activeTitle: 1,
      ruleForm: {
        userName: "",
        oldPass: "",
        newPass: "",
        checkPass: ""
      },
      rules2: {
        oldPass: [{ validator: checkOld, trigger: "blur" }],
        newPass: [{ validator: validateNewPass, trigger: "blur" }],
        checkPass: [{ validator: validateCheckPass, trigger: "blur" }]
      }
    };
  },
  mounted() {
    let userInfo = JSON.parse(
      window.sessionStorage.getItem("userInfo") || "{}"
    );
    this.ruleForm.userName = userInfo.phone;
  },
  methods: {
    ...mapMutations(["changeSite"]),
    goHome() {
      this.$router.replace("/home/appHomeModule.html");
      this.changeSite("/home/appHomeModule.html");
    },
    changeType() {
      this.passType = "password";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.toSend();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toSend() {
      this.$Posting(this.$api.updatePassword, {
        oldPassword: this.ruleForm.oldPass,
        password: this.ruleForm.newPass
      })
        .then(res => {
          if (res.code == "0") {
            this.activeTitle = 2;
            this.reduceTimeS();
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("change_pass_fail")
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("change_pass_fail")
          });
        });
    },
    reduceTimeS() {
      let self = this;
      let timer = setInterval(() => {
        if (self.timeS == 0) {
          self.nowGo();
          clearInterval(timer);
        } else {
          self.timeS--;
        }
      }, 1000);
    },
    nowGo() {
      this.$router.replace("/");
      window.sessionStorage.removeItem("Site");
      window.sessionStorage.removeItem("userInfo");
      window.sessionStorage.removeItem("serveUrl");
      window.sessionStorage.removeItem("country");
    }
  }
};
</script>
<style lang="less" scoped>
.change_password_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  .body__img__close {
    right: 10px;
    top: 10px;
  }
  .change_password {
    width: 900px;
    margin: 100px auto;
    .change_form {
      width: 500px;
      margin: 20px auto;
      .button_change_password {
        width: 300px;
        height: 40px;
      }
    }
    .change_success {
      width: 500px;
      margin: 20px auto;
      .times {
        font-size: 14px;
        span {
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }
}
</style>


