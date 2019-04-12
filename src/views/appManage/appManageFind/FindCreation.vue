<template>
  <div class="Find_creation">
    <h1 class="hint_site">
      <!-- 当前位置：APP管理 > 发现 > 专题模板 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('find')}} > {{$t('find_module')}}
    </h1>
    <div class="FindCreation_form">
      <el-form label-position="left" :model="moduleFoem" ref="moduleFoem" :rules="rules" label-width="150px" class="demo-ruleForm">
        <el-form-item :label="$t('title')" prop="titleText">
          <el-input :placeholder="$t('verificate_name')" style="width:300px;" type="text" v-model.trim="moduleFoem.titleText"></el-input>
        </el-form-item>
        <el-form-item :label="$t('module_type')" prop="type">
          <el-select v-model="moduleFoem.type" style="width:300px;">
            <el-option :label="$t('albums')" :value="0"></el-option>
            <el-option :label="$t('designers')" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cover" :rules="{
              type:'array',required: true, message: $t('verificate_find_logo'), trigger: 'blur'
             }">
          <span slot="label">{{$t('find_logo')}}<br/>(350*210)</span>
          <uploader :backData="moduleFoem.cover" :id="'coverimg0'" :folder="'logo'" :mixLength='1'></uploader>
        </el-form-item>
        <el-form-item :label="$t('showUrl')" required>
          <div>
            <el-checkbox v-model="moduleFoem.isShowEdit" :true-label="1" :false-label="0">{{$t('isShowEdit')}}</el-checkbox>
          </div>
          <el-input :placeholder="$t('verificate_url')" style="width:300px;" type="text" v-model.trim="moduleFoem.url"></el-input>
        </el-form-item>
        <el-form-item :label="$t('find_module_content')" :required="true">
          <editor class="editor" :value="moduleFoem.content" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
        </el-form-item>
      </el-form>
      <!-- 确定提交 -->
      <div class="addStore_btn">
        <el-button type="primary" @click="submitForm('moduleFoem')">{{$t('submit')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploader from "@/components/uploader.vue";
import editor from "@/components//editor";
import { Base64 } from "js-base64";
export default {
  components: {
    uploader,
    editor
  },
  data() {
    return {
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      moduleFoem: {
        titleText: "",
        type: 0, //模板类型
        cover: [], // 封面图片
        isShowEdit: 0,
        url: "",
        content: "" // 富文本编辑器双向绑定的内容
      },
      editorData: null,
      editorArr: [],
      rules: {
        titleText: [
          {
            required: true,
            message: this.$t("verificate_name"),
            trigger: "blur"
          }
        ]
      },
      editorSetting: {
        // 配置富文本编辑器高
        height: 250,
        width: 750
      }
    };
  },
  created() {
    if (sessionStorage.getItem("editModuleMsg")) {
      //判断缓存里面有没有编辑信息
      let editModulesData = JSON.parse(sessionStorage.getItem("editModuleMsg"));
      this.editorData = editModulesData;
      this.moduleFoem.titleText = editModulesData.title;
      this.moduleFoem.type = editModulesData.type;
      this.moduleFoem.isShowEdit = editModulesData.discoveryType;
      this.moduleFoem.url = editModulesData.url;
      this.moduleFoem.cover.push({
        src: this.hostUrl + editModulesData.logo,
        url: editModulesData.logo
      });
      this.moduleFoem.content = Base64.decode(editModulesData.content);
      this.editorArr = this.$changeHtmlStr(this.moduleFoem.content); //将富文本里面的图片读取
    }
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.moduleFoem.content && !this.moduleFoem.url) {
            console.log(this.moduleFoem.content);
            console.log(this.moduleFoem.url);
            this.$message({
              message: this.$t("verificate__module_or_url_contnet"),
              type: "warning"
            });
            return;
          }
          let datas = {
            title: this.moduleFoem.titleText,
            type: this.moduleFoem.type,
            //标题,字符串,必填
            logo: this.moduleFoem.cover[0].url,
            discoveryType: this.moduleFoem.isShowEdit,
            url: this.moduleFoem.url,
            content: Base64.encode(this.moduleFoem.content)
          };
          if (this.editorData === null) {
            this.submitData(datas, 0);
          } else {
            datas.id = this.editorData.id;
            this.submitData(datas, 1);
          }
        } else {
          console.log("error submit!!");
          return;
        }
      });
    },
    editors(content) {
      // editor组件传过来的值赋给content
      this.moduleFoem.content = content;
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](json[0].path);
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      let editorImg =
        JSON.parse(window.sessionStorage.getItem("editorImg")) || [];
      this.$Posting(this.$api.saveDiscovery, jsonData, true).then(res => {
        if (res.code == 0) {
          let editorArr = this.$changeHtmlStr(this.moduleFoem.content); //将富文本编辑器里面的图片路径拿出来
          let newUploadImg = _this.$changeUploadImg(_this.moduleFoem.cover); //获取提交的上传插件的图片数组
          let allEditorArr = [...editorImg, ...this.editorArr]; //获取总的富文本编辑器里面的图片
          allEditorArr = [...new Set(allEditorArr)];
          allEditorArr.length &&
            window.sessionStorage.setItem(
              "editorImg",
              JSON.stringify(allEditorArr)
            ); //点击时将之前富文本编辑器里面的图片进行缓存
          _this.$changeSession(editorArr, 1); //富文本编辑器里面的图片对比缓存里面的图片
          _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: message
          });
          this.$router.replace("appManageFind.html");
        } else {
          _this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    }
  },
  beforeDestroy() {
    this.$deleteImg();
    sessionStorage.getItem("editModuleMsg") &&
      sessionStorage.removeItem("editModuleMsg");
  }
};
</script>

<style lang="less" >
.Find_creation {
  .FindCreation_form {
    margin-top: 15px;
    background-color: #fff;
    padding: 15px;
  }
  .addStore_btn {
    margin-top: 15px;
    border-top: 1px solid #ddd;
    padding: 15px;
  }
}
</style>
