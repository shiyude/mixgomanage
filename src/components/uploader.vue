<template>
  <div class="vue-uploader">
    <div class="file-list">
      <section v-for="(item, index) of backData" class="file-item draggable-item">
        <img @click.stop="$imgPreview(item.src)" :src="item.src" alt="">
        <!-- <p class="file-name">{{item.name}}</p> -->
        <span class="file-remove el-icon-error" @click="remove(index,item)"></span>
      </section>
      <section v-if="backData.length < mixLength" class="file-item">
        <div @click="add" class="add">
          <span>+</span>
        </div>
      </section>
    </div>
    <input :id="id" type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
  </div>
</template>
<script>
export default {
  props: {
    mixLength: Number, // 限制数量
    id: String, // input ID 必填
    backData: Array, // 父组件容器，必填
    folder: String, // 传入图片类型 type：3d(3d模型)，logo(logo图），imgs（形象图）
    maxSize: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      files: [],
      percent: 0,
      imgUrl: []
    };
  },
  mounted() {
    console.log(this.backData);
  },
  methods: {
    add() {
      this.$refs.file.click();
    },
    remove(index, item) {
      this.deleteUpImg(item.src);
      this.backData.splice(index, 1);
    },

    fileChanged() {
      let self = this;
      const list = this.$refs.file.files;
      for (let i = 0; i < list.length; i++) {
        if (!this.isContain(list[i])) {
          if (list[i].size / 1024 > self.maxSize) {
            this.$message({
              message: `${self.$t('uploadmorethan')} ${self.maxSize}k ${self.$t('picture')}`,
              type: "warning"
            });
          } else {
            this.html5Reader(list[i]);
          }
        } else {
          this.$message({
            message: self.$t('hasbeenuploaded'),
            type: "warning"
          });
        }
      }
      let num = this.id.replace(/[^0-9]/gi, "");
      let iDs = this.id;
      this.$refs.file.value = "";
    },

    // 将图片文件转成BASE64格式 压缩
    html5Reader(file) {
      let self = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // console.log(file)
      reader.onloadend = function() {
        let result = this.result;
        let img = new Image();
        img.src = result;
        // console.log("********未压缩前的图片大小********");
        // console.log(result.length);
        img.onload = function() {
          // 压缩
          let data;
          // if (img.src.length / 1024 / 1024 > 2) {
          //   data = self.compress(img);
          // } else {
            data = img.src;
          // }
          // 转成blob模式
          let blob = self.dataURItoBlob(data);
          let item = {
            name: file.name,
            upImgData: blob,
            textName: ""
          };
          if (self.files.length < self.mixLength) {
            //不能超过限定图片数量
            self.UpLoadImg(item);
          }
        };
      };
    },
    compress(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.3);
      // console.log("*******压缩后的图片大小*******");
      // console.log(ndata.length / 1024 / 1024 + 'k');
      return ndata;
    },
    // base64转成bolb对象

    UpLoadImg(imgBlob) {
      let user = JSON.parse(window.sessionStorage.getItem("userInfo"));
      let formData = new FormData();
      formData.append("token", user.token);
      // formData.append('upload_type',this.folder)
      formData.append("userId", user.id);
      formData.append("image", imgBlob.upImgData);
      this.$PostFormData(
        `${this.$api.uploader}?upload_type=img`,
        formData
      ).then(res => {
        if (res.code === "0") {
          let item = {
            src: res.path,
            textName: imgBlob.textName,
            name: imgBlob.name,
            url: res.url
          };
          // console.log(item)
          this.backData.push(item);
          let uploadedImg = JSON.parse(
            window.sessionStorage.getItem("uploadedImg")
          );
          if (uploadedImg) {
            uploadedImg.push(res.path);
            window.sessionStorage.setItem(
              "uploadedImg",
              JSON.stringify(uploadedImg)
            );
          } else {
            uploadedImg = [];
            uploadedImg.push(res.path);
            window.sessionStorage.setItem(
              "uploadedImg",
              JSON.stringify(uploadedImg)
            );
          }
        }
      });
    },
    deleteUpImg(imgPush) {
      this.$Post(this.$api.deleteFile, { path: imgPush }).then(res => {
        if (res.code === "0") {
          let uploadedImg = JSON.parse(
            window.sessionStorage.getItem("uploadedImg")
          );
          if (uploadedImg) {
            uploadedImg.forEach((item, index) => {
              if (item === imgPush) {
                uploadedImg.splice(index, 1);
                console.log(item, imgPush);
              }
            });
            window.sessionStorage.setItem(
              "uploadedImg",
              JSON.stringify(uploadedImg)
            );
          }
        }
      });
    },

    dataURItoBlob(base64Data) {
      let byteString;
      if (base64Data.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(base64Data.split(",")[1]);
      else byteString = unescape(base64Data.split(",")[1]);
      let mimeString = base64Data
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      let ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },

    isContain(file) {
      return this.backData.find(item => item.name === file.name);
    },

    uploadProgress(evt) {
      const component = this;
      if (evt.lengthComputable) {
        const percentComplete = Math.round(evt.loaded * 100 / evt.total);
        component.percent = percentComplete / 100;
      } else {
        console.warn("upload progress unable to compute");
      }
    }
  }
};
</script>
<style>
.vue-uploader {
  display: inline-block;
  /* border: 1px solid #e5e5e5; */
}
.vue-uploader .file-list {
  padding: 10px 0px;
  padding-top: 0;
}
.vue-uploader .file-list:after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
  font-size: 0;
}
.vue-uploader .file-list .file-item {
  float: left;
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  text-align: center;
  margin-right: 10px;
}
.vue-uploader .file-list .file-item img {
  width: 100%;
  height: 100%;
  /* border: 1px solid #ececec; */
}
.vue-uploader .file-list .file-item .file-remove {
  position: absolute;
  right: 0px;
  display: none;
  top: 0px;
  font-size: 20px;
  color: red;
  cursor: pointer;
  border-radius: 100%;
}
.vue-uploader .file-list .file-item:hover .file-remove {
  display: inline;
}
.vue-uploader .file-list .file-item .file-name {
  margin: 0;
  height: 20px;
  line-height: 20px;
  word-break: break-all;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.vue-uploader .add {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  float: left;
  text-align: center;
  line-height: 80px;
  /* border: 1px dashed #ececec; */
  font-size: 30px;
  cursor: pointer;
}
.vue-uploader .upload-func {
  display: flex;
  padding: 10px;
  margin: 0px;
  background: #f8f8f8;
  border-top: 1px solid #ececec;
}
.vue-uploader .upload-func .progress-bar {
  flex-grow: 1;
}
.vue-uploader .upload-func .progress-bar section {
  margin-top: 5px;
  background: #00b4aa;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  transition: all 0.5s ease;
}
.vue-uploader .upload-func .operation-box {
  flex-grow: 0;
  padding-left: 10px;
}
.vue-uploader .upload-func .operation-box button {
  padding: 4px 12px;
  color: #fff;
  background: #007acc;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.vue-uploader > input[type="file"] {
  display: none;
}
</style>