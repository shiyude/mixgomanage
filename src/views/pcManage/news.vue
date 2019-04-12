<template lang="html">
  <div class="news">
    <h1 class="hint_site">
      <!-- 当前位置：内容管理  >  PC管理 > 新闻管理 > 新闻 -->
        {{$t('current_position')}}： {{$t('pc_manage')}} > {{$t('news_manage')}} > {{$t('news')}}
    </h1>
    <div class="FindCreation_form" >
      <el-form label-position="left" 
     :model="newsFoem"  ref="newsFoem" :rules="rules"
      label-width="170px" 
      class="demo-ruleForm">
        <el-form-item :label="$t('news_title')" prop="titleText">
          <el-input :placeholder="$t('verificate_news_title')" style="width:300px;" type="text" v-model.trim="newsFoem.titleText"></el-input>
        </el-form-item>
        <el-form-item :label="$t('news_logo')"
             prop="cover"
             :rules="{
              type:'array',required: true, message:$t('verificate_news_logo'), trigger: 'blur'
             }"
          >
          <uploader 
          :backData="newsFoem.cover" 
          :id="'coverimg0'" 
           :folder="'logo'"
          :mixLength='1'></uploader>
        </el-form-item>
        <el-form-item :label="$t('news_desc')" prop="desc">
           <el-input type="textarea"  style="width:600px" rows="5" v-model.trim="newsFoem.desc" :placeholder="$t('verificate_news_desc')"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('news_detail')"
          :required="true"
          >
            <editor
            class="editor"
            :value="newsFoem.content"
            :setting="editorSetting"
            @show="editors"
            @on-upload-success= "onEditorUploadComplete"></editor>
        </el-form-item>
        </el-form>
      <!-- 确定提交 -->
      <div class="addStore_btn">
        <el-button type="primary" @click="submitForm('newsFoem')">{{$t('submit')}}</el-button>
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
      newsFoem: {
        titleText: "",
        cover: [
          // 封面图片
        ],
        content: "",
        // 富文本编辑器双向绑定的内容
        desc: ""
      },
      editorData: null,
      editorArr: [],
      rules: {
        titleText: [
          {
            required: true,
            message: this.$t("verificate_news_title"),
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: this.$t("verificate_news_desc"),
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
    console.log("hahaahh");
    if (sessionStorage.getItem("editNewsMsg")) {
      //判断缓存里面有没有编辑信息
      let editNewsData = JSON.parse(sessionStorage.getItem("editNewsMsg"));
      this.editorData = editNewsData;
      this.newsFoem.titleText = editNewsData.title;
      this.newsFoem.desc = editNewsData.subject;
      this.newsFoem.cover.push({
        src: this.hostUrl + editNewsData.logo,
        url: editNewsData.logo
      });
      this.newsFoem.content = Base64.decode(editNewsData.content);
      this.editorArr = this.$changeHtmlStr(this.newsFoem.content); //将富文本里面的图片读取
    }
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.newsFoem.content) {
            this.$message({
              message: this.$t("verificate_news_detail"),
              type: "warning"
            });
            return;
          }
          let datas = {
            title: this.newsFoem.titleText,
            //标题,字符串,必填
            logo: this.newsFoem.cover[0].url,
            subject: this.newsFoem.desc,
            content: Base64.encode(this.newsFoem.content)
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
      this.newsFoem.content = content;
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
      this.$Posting(this.$api.saveNews, jsonData, true).then(res => {
        if (res.code == 0) {
          let editorArr = this.$changeHtmlStr(this.newsFoem.content); //将富文本编辑器里面的图片路径拿出来
          let newUploadImg = _this.$changeUploadImg(_this.newsFoem.cover); //获取提交的上传插件的图片数组
          let allEditorArr = [...editorImg, ...this.editorArr]; //获取总的富文本编辑器里面的图片
          allEditorArr = [...new Set(allEditorArr)];
          allEditorArr.length &&
            window.sessionStorage.setItem(
              "editorImg",
              JSON.stringify(allEditorArr)
            ); //点击时将之前富文本编辑器里面的图片进行缓存
          console.log(allEditorArr);
          _this.$changeSession(editorArr, 1); //富文本编辑器里面的图片对比缓存里面的图片
          _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: message
          });
          this.$router.replace("/home/newsManage.html");
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
    sessionStorage.getItem("editNewsMsg") &&
      sessionStorage.removeItem("editNewsMsg");
  }
};
</script>

<style lang="less" >
.news {
  .FindCreation_form {
    margin-top: 15px;
    background-color: #fff;
    padding: 15px;
  }
  // .up_loader_box {
  //   width: 50%;
  // }
  // .up_loader_add_btn {
  //   width: 20%;
  //   // float: right;
  //   min-width: 280px;
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  // }
  .addStore_btn {
    margin-top: 15px;
    border-top: 1px solid #ddd;
    padding: 15px;
  }
}
</style>
