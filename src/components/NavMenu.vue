<template>
  <!-- <el-menu class="el-menu-vertical-demo" 
  :unique-opened="true" 
  :default-active="Site"
   @select="handleSelect" 
   background-color="#545c64" 
   text-color="#fff"  
   active-text-color="#ffd04b"> -->
  <div class="sidebar-container">
    <!-- 泰国后台管理导航开始-->
    <template v-if="companyId == 32">
      <el-menu class="el-menu-vertical-demo" :unique-opened="true" :default-active="Site" @select="handleSelect" :show-timeout="200" background-color="#002140" text-color="hsla(0, 0%, 100%, .65)" active-text-color="#409EFF">
        <el-submenu v-for="(item,index) in menuData" :key="index" :index="item.link">
          <div slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.menuName}}</span>
          </div>
          <el-submenu v-if="sonitem.childMenus != null" v-for="(sonitem,index) in item.childMenus" :key="index" :index="sonitem.link">
            <div v-if="sonitem.menuName == 'Discover '" slot="title">Discovery/Inspirations</div>
            <div slot="title" v-else>{{sonitem.menuName}}</div>
            <el-menu-item v-for="(grandson,index) in sonitem.childMenus" :key="index" :index="grandson.link">
              <div v-if="grandson.menuName == 'Discovery List'" slot="title">Page List</div>
              <div v-else-if="grandson.menuName == 'Categories '" slot="title">All Category</div>
              <div slot="title" v-else>{{grandson.menuName}}</div>
            </el-menu-item>
          </el-submenu>

          <el-menu-item v-if="sonitem.childMenus == null" v-for="(sonitem,index) in item.childMenus" :key="index" :index="sonitem.link">
            <div v-if="sonitem.menuName == 'Types'" slot="title">Sub Category</div>
            <div slot="title" v-else>{{sonitem.menuName}}</div>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </template>
    <!-- 泰国后台管理导航结束-->
    <template v-else>
      <el-menu class="el-menu-vertical-demo" :unique-opened="true" :default-active="Site" @select="handleSelect" :show-timeout="200" background-color="#002140" text-color="hsla(0, 0%, 100%, .65)" active-text-color="#409EFF">
        <el-submenu v-for="(item,index) in menuData" :key="index" :index="item.link">
          <div slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.menuName}}</span>
          </div>

          <el-submenu v-if="sonitem.childMenus != null" v-for="(sonitem,index) in item.childMenus" :key="index" :index="sonitem.link">
            <div slot="title">{{sonitem.menuName}}</div>
            <el-menu-item v-for="(grandson,index) in sonitem.childMenus" :key="index" :index="grandson.link">{{grandson.menuName}}</el-menu-item>
          </el-submenu>

          <el-menu-item v-if="sonitem.childMenus == null" v-for="(sonitem,index) in item.childMenus" :key="index" :index="sonitem.link">
            {{sonitem.menuName}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </template>

  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["Site"])
  },
  props: {
    value: {
      type: Object,
      require: false
    }
  },
  data() {
    return {
      activeKey: "",
      companyId: "", //为32时隐藏某些导航
      menuData: [],
      sonIndex: "sonIndex"
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    this.companyId = userInfo.companyId || "";
  },
  mounted() {
    this.GitUserMenu();
    this.$router.replace(this.Site);
    console.log(this.Site);
  },
  methods: {
    ...mapMutations(["changeSite"]),
    handleSelect(key) {
      this.changeSite(key);
      this.$router.replace(key);
      // console.log(key)
    },
    GitUserMenu() {
      this.$Get(this.$api.loadUserMenu, {}).then(res => {
        if (res.code == 0) {
          this.menuData = res.datas.lists;
          console.log(this.menuData);
          console.log(this.menuData.keys("link"));
        }
        // console.log(res)
      });
    }
  }
};
</script>


<style scoped lang="less">
.sidebar-container {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width 0.28s;
  width: 100%;
  height: 100%;
  overflow: hidden;
  a {
    display: inline-block;
    width: 100%;
  }
  .el-menu {
    padding-top: 16px;
    width: 100% !important;
    border: none;
  }
  .el-submenu .el-menu-item {
    min-width: 100%;
    // padding-left: 48px !important;
    // background-color: #002140 !important;
    background-color: #00142a !important;
    &:hover {
      color: #fff !important;
    }
  }
  // .el-submenu .el-menu-item .el-menu-item {
  //   background-color: #002140 !important;
  // }
  .el-menu-item,
  .el-submenu .el-menu-item {
    &.is-active {
      background-color: #188fff !important;
      color: #fff !important;
    }
  }
  .el-submenu__title i {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
