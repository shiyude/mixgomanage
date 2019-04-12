<template lang="html">
  <div id="home" class="home">
    <!-- 主容器 -->
    <el-container class="home_conter">
      <!-- 左侧导航 -->
      <el-aside class="home_conter_nav" width="230px">
        <div class="home_conter_nav_conter">
          <div class="nav_portrait">
            <div class="logo">
              <img src="https://img.alicdn.com/tfs/TB13UQpnYGYBuNjy0FoXXciBFXa-242-134.png" width="40">
              <span class="site-name">MIX GO</span>
            </div>
            <!-- <div class="nav_portrait_name clearfix">
              <div class="nav_portrait_name_lf">
                <img :src="userpic" alt="">
              </div>
              <div class="nav_portrait_name_rt">
                <h1>欢迎~</h1>
                <p>{{userName}}</p>
              </div>
            </div> -->
          </div>
          <nav-menu></nav-menu>
        </div>
      </el-aside>
      <!-- 右侧内容 -->
      <el-container class="home_conter_by">
        <!-- 内容头 -->
        <el-header>
          <div class="home_head clearfix">
            <div class="home_head_text">
              {{$t('mixgo_title')}}
            </div>
            <div class="home_head_info">
              <el-dropdown class="clearfix" @command="handleCommand" trigger="click">
                <div class="home_head_info_conter clearfix">
                  <span class="log_head_img">
                  <img :src="userpic" alt="">
                  </span>
                  <span class="el-dropdown-link">
                    {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </div>
                <el-dropdown-menu style="margin-top:0" slot="dropdown" >
                  <!-- <el-dropdown-item command="a">{{$t('user_message')}}</el-dropdown-item> -->
                  <el-dropdown-item command="b">{{$t('change_password')}}</el-dropdown-item>
                  <!-- <el-dropdown-item command="c">{{$t('change_logo')}}</el-dropdown-item> -->
                  <el-dropdown-item command="退出">{{$t('login_out')}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="switch_lang">
              <switch-lang></switch-lang>
            </div>
             
          </div>
        </el-header>
        <!-- 内容容器 -->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import switchLang from "@/components/switchLang";
import { mapMutations } from "vuex";
export default {
  components: {
    switchLang,
    NavMenu: () => import("@/components/NavMenu.vue") // 左侧导航组件
  },
  data() {
    return {
      userName:
        JSON.parse(window.sessionStorage.getItem("userInfo") || "{}")
          .userName || "",
      userpic: JSON.parse(window.sessionStorage.getItem("userInfo")).pic
        ? JSON.parse(window.sessionStorage.getItem("userInfo")).pic
        : require("../images/log_head.jpg")
    };
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  methods: {
    ...mapMutations(["changeSite"]),
    handleCommand(command) {
      if (command === "退出") {
        this.$router.replace("/");
        window.sessionStorage.removeItem("Site");
        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.removeItem("serveUrl");
        window.sessionStorage.removeItem("country");
        history.go(0);
        // window.location.reload();
      } else if (command == "b") {
        this.$router.replace("/home/changePassword.html");
      }
    },
    goBack() {
      console.log(11111111)
      this.$router.replace({ path: "/home/appHomeModule.html" });
      this.changeSite("/home/appHomeModule.html");
    }
  }
};
</script>

<style lang="less"  scoped>
.home,
.home_conter {
  height: 100%;
}
.home_conter {
  position: relative;
  min-height: 500px;
  min-width: 1200px;
  .el-submenu__title i {
    color: #fff;
  }
  .home_conter_nav {
    height: 100%;
    background-color: #002140;
    .nav_portrait {
      // padding: 20px 10px 0 10px;
      // color: #fff;
      // h1 {
      //   font-size: 20px;
      //   font-weight: 600;
      // }
      // .nav_portrait_name {
      //   margin: 30px 0;
      //   div {
      //     float: left;
      //   }
      //   .nav_portrait_name_lf {
      //     width: 30%;
      //     height: 60px;
      //     img {
      //       height: 100%;
      //       width: 100%;
      //       border-radius: 50%;
      //     }
      //   }
      //   .nav_portrait_name_rt {
      //     width: 65%;
      //     height: 60px;
      //     padding-left: 10px;
      //     padding-top: 5px;
      //     h1 {
      //       font-size: 14px;
      //       color: #ddd;
      //     }
      //     p {
      //       overflow: hidden;
      //       text-overflow: ellipsis;
      //       white-space: nowrap;
      //     }
      //   }
      // }
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        line-height: 64px;
        background: #00142a;
        color: #fff;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        overflow: hidden;
      }
      .site-name {
        margin-left: 10px;
      }
    }
    .el-menu {
      border-right: 0;
      .el-submenu__title i {
        color: #fff;
      }
    }
  }
  .home_conter_by {
    height: 100%;
    position: relative;
    min-width: 1250px;
    .el-header {
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      .home_head {
        height: 100%;
        padding-right: 100px;
        .home_head_text {
          float: left;
          height: 100%;
          line-height: 60px;
          font-size: 20px;
          font-weight: 600;
          color: #188fff;
        }
        .home_head_info {
          float: right;
          height: 100%;
          .el-dropdown {
            position: relative;
            .home_head_info_conter {
              cursor: pointer;
              span {
                height: 100%;
                line-height: 60px;
                float: left;
                padding-left: 10px;
                color: #000;
              }
              .log_head_img {
                img {
                  width: 40px;
                  height: 40px;
                  margin-top: 10px;
                  border-radius: 5px;
                }
              }
            }
          }
        }
      }
    }
    .el-main {
      background: #f0f2f5;
      position: absolute;
      top: 62px;
      bottom: 0;
      width: 100%;
      padding: 15px;
    }
  }
  .switch_lang {
    float: right;
    height: 100%;
    line-height: 60px;
    margin-right: 50px;
    cursor: pointer;
  }
}
</style>
