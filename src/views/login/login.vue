<template>
  <div id="login" @keyup.enter="goToHome('formInline')">
    <el-container>
      <el-header class="clearfix">
        <div class="div_1200">
          <div class="log">
            {{ $t("login.title") }}
          </div>
          <!-- <div class="switch_lang">
            <switch-lang></switch-lang>
          </div> -->
          <div class="nav_head">
            <span @click="toWebsite"> {{ $t("login.website") }}</span>
            <span @click="appDown"> {{ $t("login.app") }}</span>
          </div>
        </div>
      </el-header>
      <el-main class="login_body clearfix">
        <div class="div_1200">
          <div class="publicity_img">
          </div>
          <div class="login_form">
            <el-form ref="formInline" :rules="rules" :model="formInline" class="demo-form-inline">
              <el-form-item prop="user">
                <el-input :placeholder="$t('login.input_phone')" type="text" v-model.trim="formInline.user">
                  <i slot="prefix" class="el-input__icon el-icon-search log_id"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="pwd">
                <el-input :placeholder="$t('login.input_passwords')" type="password" v-model.trim="formInline.pwd">
                  <i slot="prefix" class="el-input__icon el-icon-search log_passwod"></i>
                </el-input>
              </el-form-item>
              <!-- <el-form-item prop="countrys" >
                <el-select style="width:100%" v-model="formInline.countrys" :placeholder="$t('login.select_country')">
                  <el-option v-for="item in Countrys" :key="item.id" :label="item.countryName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item class="form_btn">
                <el-button size="medium" type="primary" @click="goToHome('formInline')"> {{ $t("login.login") }}</el-button>
              </el-form-item> -->
            </el-form>
            <el-select style="width:100%" v-model="formInline.countrys" :placeholder="$t('login.select_country')">
              <el-option v-for="item in Countrys" :key="item.id" :label="item.countryName" :value="item.id">
              </el-option>
            </el-select>
            <el-button class="logBtn" size="medium" type="primary" @click="goToHome('formInline')"> {{ $t("login.login") }}</el-button>
            <!-- <div class="clearfix">
              <el-switch
                v-model="value3"
                active-text="记住密码">
              </el-switch>
              <el-button class="forget_pass" type="text">忘记密码？</el-button>
            </div> -->
          </div>
        </div>
      </el-main>
      <el-footer style="height:100px;">
        <div class="div_1200 clearfix">
          <div class="footer_lf">
            <h1>{{$t('footer.mixgo')}}</h1>
            <p>{{$t('footer.desc1')}}</p>
            <p>{{$t('footer.desc2')}}</p>
            <p>{{$t('footer.desc3')}}</p>
          </div>
          <div class="footer_rt">
            <!-- <h1>F</h1> -->
            <p style="padding-top:20px">{{$t('footer.desc4')}}</p>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import switchLang from "@/components/switchLang";
import { mapMutations } from "vuex";
export default {
  components: {
    switchLang
  },
  data() {
    return {
      formInline: {
        user: "",
        pwd: "",
        countrys: ""
      },
      activeCountrys: '',
      Countrys: [],
      value3: true,
      rules: {
        user: [{ required: true, message: this.$t('login.input_phone'), trigger: "blur" }],
        pwd: [{ required: true, message: this.$t('login.input_passwords'), trigger: "blur" }],
        countrys: [
          { required: true, message: this.$t('login.select_country'), trigger: "change" }
        ]
      }
    };
  },
  watch: {
    'formInline.user': function () {
      if (this.formInline.user) {
        this.gitCountrys()
      }
    }
  },
  mounted() {
    // this.gitCountrys();
    this.noUrl()
  },
  methods: {
    ...mapMutations(["changeSite"]),
    goToHome(formName) {
      // this.$router.replace('/home')
      let selt = this;
      this.$refs[formName].validate(valid => {
        console.log(selt.formInline.countrys)
        if (valid) {
          // let pwss = this.$md5(this.$md5('SingMR').slice(10, 30) + this.formInline.pwd)
          this.$Post(this.$api.newLogin, {
            phone: this.formInline.user,
            password: this.formInline.pwd,
            country: this.formInline.countrys
          }).then(res => {
            if (res.code === "0") {
              // document.cookie = `token=${res.token}`;
              // document.cookie = `user=${this.formInline.user}`;
              // document.cookie = `pwd=${this.formInline.pwd}`;
              let userInfo = res;
              sessionStorage.setItem(
                "userInfo",
                JSON.stringify(userInfo.datas)
              );
              sessionStorage.setItem("serveUrl", res.url);
              sessionStorage.setItem("country", this.formInline.countrys);
              if (res.datas.firstLogin) {
                this.$router.replace("/home/changePassword.html");
                this.changeSite('')
              } else {
                this.$router.replace("/home");
              }
            } else {
              this.$notify.error({
                title: "fail",
                message: res.msg
              });
            }
          });

        } else {
          this.$notify.error({
            title: "fail",
            message: this.$t('login.verificate_account_pass')
          });
          return false;
        }
      });
    },
    gitCountrys() {
      this.$Get(this.$api.queryUserCountrys, { phone: this.formInline.user }).then(res => {
        if (res.code == 0) {
          this.Countrys = res.datas;
          if (res.datas.length == 1) {
            this.formInline.countrys = this.Countrys[0].id;
            console.log(1)
          }
          console.log(this.Countrys);
        } else {
          this.Countrys = [];
        }
      });
    },
    toWebsite() {
      window.location.href = "https://www.58mixgo.com";
    },
    appDown() {
      window.location.href =
        "https://itunes.apple.com/cn/app/id1174747257?mt=8";
    },
    noUrl() {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
      console.log('111')
    }
  }
};
</script>

<style lang="less" >
#login {
  height: 100%;
  min-height: 500px;
  position: relative;
  .logBtn {
    margin-top: 50px;
    width: 100%;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }
}
.div_1200 {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  position: relative;
}
.login_body {
  position: absolute;
  top: 60px;
  bottom: 100px;
  background: url(../../images/log_bg.jpg) no-repeat 0 0;
  background-size: cover;
  width: 100%;
  .publicity_img {
    position: absolute;
    top: 50%;
    margin-top: -150px;
    width: 600px;
    height: 300px;
    background: url(../../images/publicity_img.png) no-repeat 0 0;
    background-size: 100% 100%;
  }
  .login_form {
    width: 300px;
    height: 400px;
    background: #fff;
    border-radius: 20px;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    right: 100px;
    padding: 50px 20px;
    .el-form-item {
      width: 100%;
      margin-right: 0;
      margin-bottom: 30px;
      .log_id {
        background: url(../../images/icon/id_icon.png) no-repeat 2px 10px;
        background-size: 18px 18px;
        color: #fff;
      }
      .log_passwod {
        background: url(../../images/icon/passwod_icon.png) no-repeat 2px 10px;
        background-size: 18px 18px;
        color: #fff;
      }
      .log_passwod::before,
      .log_id::before {
        opacity: 0;
      }
      .el-form-item__content {
        width: 100%;
        button {
          width: 100%;
        }
      }
    }
    .form_btn {
      // margin-bottom: 50px;
    }
  }
  .forget_pass {
    float: right;
    padding: 0;
    height: 20px;
    line-height: 20px;
  }
}
.el-header {
  background: #409eff;
  line-height: 60px;
  position: absolute;
  top: 0;
  width: 100%;
}
.el-footer {
  background: #409eff;
  color: #fff;
  // line-height: 60px;
  // text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  .footer_lf {
    float: left;
  }
  .footer_lf,
  .footer_rt {
    margin-top: 10px;
    h1 {
      font-size: 20px;
      color: #fff;
    }
    p {
      font-size: 14px;
      color: #ddd;
    }
  }
  .footer_rt {
    float: right;
  }
}
.log,
.nav_head {
  float: right;
  color: #fff;
}
.log {
  float: left;
  font-size: 22px;
  font-weight: 600;
}
.nav_head {
  span {
    margin-left: 50px;
    cursor: pointer;
  }
}
#login .switch_lang {
  float: right;
  height: 100%;
  line-height: 60px;
  margin-left: 50px;
  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }
}
</style>
