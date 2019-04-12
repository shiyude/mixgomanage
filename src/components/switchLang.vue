<template>
  <div class="lang">
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{lang}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="language == 3 || language == 1" command="zh">{{ $t("switch.zh") }}</el-dropdown-item>
        <el-dropdown-item v-if="language == 3 || language == 2" command="es">{{ $t("switch.en") }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      language: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').language || ''
    };
  },
  created() {
    const lang = sessionStorage.getItem("lang");
    if (this.language) {
      if (!lang) {
        if ((this.language == 3) || (this.language == 1)) {
          this.$setLang("zh");
          this.lang = "中文";
        }
        else {
          this.lang = "EN_US";
          this.$setLang("en");
        }
      } else {
        switch (lang) {
          case 'zh-CN':
            this.$setLang("zh");
            this.lang = "中文";
            break;
        
          default:
            this.lang = "EN_US";
            this.$setLang("en");
            break;
        }
      }
    }
    // if((!lang && language == 3) || (!lang && language == 1) || lang === "zh-CN") {
    //   this.$setLang("zh");
    //   this.lang = "中文";
    //   console.log('111')
    // } else {
    //   this.lang = "EN_US";
    //   this.$setLang("en");
    //   console.log('2222')
    // }


    // if (!lang || lang === "zh-CN") {
    //   this.$setLang("zh");
    //   this.lang = "中文";
    // } else {
    //   this.lang = "EN_US";
    //   this.$setLang("en");
    // }
  },
  methods: {
    handleCommand(command) {
      if (command == "zh") {
        this.$setLang("zh");
        this.lang = "中文";
        window.location.reload()
      } else {
        this.$setLang("en");
        this.lang = "EN_US";
        window.location.reload()
      }
    }
  }
};
</script>

<style>
</style>

