<template>
  <textarea :id='id' :value='value'></textarea>
</template>
<script>
// Import TinyMCE
import tinymce from "tinymce/tinymce";
import editorConfig from "@/util/editor.js";
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    setting: {}
  },
  data() {
    return {
      id: "editor-" + new Date().getMilliseconds(),

      accept: "image/jpeg, image/png"
    };
  },
  mounted() {
    const _this = this;
    const setting = {
      selector: "#" + _this.id,
      init_instance_callback: function(editor) {
        editor.on("input change undo redo", () => {
          var content = editor.getContent();
          //  tinymce.activeEditor.setContent(content)
          _this.$emit("show", content);
        });
      },
      // 图片上传
      images_upload_handler: function(blobInfo, success, failure) {
        if (blobInfo.blob().size / 1024 / 1024 > 3) {
          failure("文件体积过大");
        }
        if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
          _this.uploadPic(blobInfo, success, failure);
        } else {
          failure("图片格式错误");
        }
      }
    };
    Object.assign(setting, editorConfig, _this.setting);
    tinymce.init(setting);
  },
  methods: {
    uploadPic(blobInfo, success, failure) {
      let _this = this;
      // 发送请求
      const formData = new FormData();
      let user = JSON.parse(window.sessionStorage.getItem("userInfo"));
      let editorImg = [];
      formData.append("token", user.token);
      formData.append("site", "jingxuan");
      formData.append("version", "1");
      formData.append("appver", "1");
      formData.append("lang", "zh-cn");
      formData.append("modelver", "2");
      formData.append("size", "1920*1080");
      formData.append("userId", user.id);
      formData.append("func", "editor");
      formData.append("image", blobInfo.blob());
      _this
        .$PostFormData("/uploader", formData)
        .then(function(data) {
          if (data.status == 1) {
            failure("上传失败: " + data.status);
            return;
          }
          if (window.sessionStorage.getItem("editorImg")) {
            editorImg = JSON.parse(window.sessionStorage.getItem("editorImg"));
          }
          editorImg.push(data.path);
          window.sessionStorage.setItem("editorImg", JSON.stringify(editorImg));
          _this.$emit("on-upload-success", [data, success, failure]);
        })
        .catch(err => {
          failure("网络繁忙");
        });
    }
  },
  beforeDestroy: function() {
    tinymce.get(this.id).destroy();
  }
};
</script>