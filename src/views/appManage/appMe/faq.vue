<template lang="html">
  <div class="news needHelp">
    <h1 class="hint_site">
      <!-- 当前位置：内容管理  >  PC管理 > 新闻管理 > 新闻 -->
       {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('me')}} > {{$t('faq')}}
    </h1>
    <div class="needHelp_form" >
            <editor
            class="editor"
            :value="newsFoem.content"
            :setting="editorSetting"
            @show="editors"
            @on-upload-success= "onEditorUploadComplete"></editor>
      <!-- 确定提交 -->
      <div class="addStore_btn">
        <el-button type="primary" @click="submitForm">{{$t('submit')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import editor from "@/components//editor";
import tinymce from "tinymce/tinymce";
import { Base64 } from "js-base64";
export default {
  name: "faq",
  components: {
    editor
  },
  data() {
    return {
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      newsFoem: {
        content: ""
      },
      editorData: null,
      editorArr: [],
      editorSetting: {
        // 配置富文本编辑器高
        height: 400,
        width: 800
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$Geting(this.$api.queryExtend, { type: 1 }).then(res => {
        if (res.code == 0) {
          this.editorData = res.datas;
          this.newsFoem.content = Base64.decode(res.datas.content);
          tinymce.editors[0].setContent(this.newsFoem.content);
          this.editorArr = this.$changeHtmlStr(this.newsFoem.content); //将富文本里面的图片读取
        } else {
          this.$notify.error({
            title: "fail",
            message: res.errcode
          });
          return false;
        }
      });
    },
    submitForm() {
      if (!this.newsFoem.content) {
        this.$message({
          message: this.$t("verificate_news_detail"),
          type: "warning"
        });
        return;
      }
      let datas = {
        content: Base64.encode(this.newsFoem.content),
        type: 1
      };
      if (this.editorData && this.editorData.id) {
        datas.id = this.editorData.id;
      }
      this.submitData(datas);
    },
    editors(content) {
      // editor组件传过来的值赋给content
      this.newsFoem.content = content;
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](json[0].path);
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData) {
      let _this = this;
      let editorImg =
        JSON.parse(window.sessionStorage.getItem("editorImg")) || [];
      this.$Posting(this.$api.editExtend, jsonData, true).then(res => {
        if (res.code == 0) {
          let editorArr = this.$changeHtmlStr(this.newsFoem.content); //将富文本编辑器里面的图片路径拿出来
          let allEditorArr = [...editorImg, ...this.editorArr]; //获取总的富文本编辑器里面的图片
          allEditorArr = [...new Set(allEditorArr)];
          allEditorArr.length &&
            window.sessionStorage.setItem(
              "editorImg",
              JSON.stringify(allEditorArr)
            ); //点击时将之前富文本编辑器里面的图片进行缓存
          _this.$changeSession(editorArr, 1); //富文本编辑器里面的图片对比缓存里面的图片
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("add_success_title")
          });
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
  }
};
</script>

<style lang="less" >
.needHelp {
  .needHelp_form {
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
