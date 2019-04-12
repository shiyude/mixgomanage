<template>
  <div class='choose3dModule'>
    <div class='title'>{{$t('3d_module_upload')}}
    </div>
    <div class='choose_directory'>
      <div class='uploadZipText'>
        <span>{{$t('upload_file')}}</span><br/>
        <span class='uploadPrompt'>（{{$t('upload_condition')}}）</span>
      </div>
      <!-- 由于el-upload需要填写上传路径，所以需要通过http-request覆盖默认的上传行为 -->
      <el-upload class="upload-demo" :http-request="uploadSectionFile" action='' accept='.zip' :before-upload='beforeUploadFile' :show-file-list='false'>
        <el-button type="primary">{{$t('browse')}}</el-button>
        <span class='fileName'>
          {{zipData[0]&&zipData[0].src}}
          <span v-if="zipData[0]&&zipData[0].src" class='el-icon-delete icon_delete' @click.stop='deleteZip'></span>
        </span>
      </el-upload>
    </div>
    <div class='choose3d_switch'>
      <el-tabs type="border-card">
        <el-tab-pane :label="$t('switch_material')">
          <el-button type="primary" style='margin-bottom:10px' @click='addMaterial'>{{$t('add')}}</el-button>
          <div class='switch_content' v-for="(v,i) in materialData">
            <div class='switch_input'>
              <el-input :placeholder="$t('verificate_title')" class='form_input_300' v-model.trim="v.title"></el-input>
              <span class="el-icon-circle-close close_icon" @click="deleteMaterial(v,i)"></span>
            </div>
            <!-- <div class='switch_input'>
              <el-input :placeholder="$t('verificate_key')" class='form_input_300' v-model.trim="v.name"></el-input>
            </div> -->
            <div class="upload_section">
              <uploader :backData="materialData[i].UpImgData" :id="'material'+i" :mixLength='10'> </uploader>
            </div>
            <div class='image_description'>
              <span class="desc_span" v-for="(item,k) in v.UpImgData">
                <el-input size="mini" :placeholder="$t('verificate_desc')" v-model.trim="item.textName"></el-input>
              </span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('switching_model')">
          <el-button type="primary" style='margin-bottom:10px' @click='addModule'>{{$t('add')}}</el-button>
          <div class='switch_content' v-for="(v,i) in moduleData">
            <div class='switch_input'>
              <el-input :placeholder="$t('verificate_title')" class='form_input_300' v-model.trim="v.title"></el-input>
              <span class="el-icon-circle-close close_icon" @click="deleteModule(v,i)"></span>
            </div>
            <!-- <div class='switch_input'>
              <el-input :placeholder="$t('verificate_key')" class='form_input_300' v-model.trim="v.name"></el-input>
            </div> -->
            <div class='upload_section'>
              <uploader :backData="moduleData[i].UpImgData" :id="'module'+i" :mixLength='10'>
              </uploader>
            </div>
            <div class='image_description'>
              <span class="desc_span" v-for="(item,k) in v.UpImgData">
                <el-input size="mini" :placeholder="$t('verificate_desc')" v-model.trim="item.textName"></el-input>
              </span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import uploader from "@/components/uploader.vue";
export default {
  props: {
    //材质数据
    materialData: {
      type: Array,
      default() {
        return false;
      }
    },
    progress: {
      type: Object
    },
    //模型数据
    moduleData: {
      type: Array,
      default() {
        return false;
      }
    },
    //zip压缩文件数据
    zipData: {
      type: Array,
      default() {
        return false;
      }
    },
    //上传类型
    uploadType: {
      type: String,
      default: "3d_goods"
    }
  },
  data() {
    return {
      isUpResult: false
    };
  },
  watch: {
    isUpResult(now, old) {
      let self = this;
      if (now) {
        setTimeout(() => {
          self.progress.isShowProgress = false;
          self.progress.status = "";
          self.progress.percent = 0;
          self.isUpResult = false;
        }, 1500);
      } else {
        return;
      }
    }
  },
  methods: {
    //添加材质模块
    addMaterial() {
      this.materialData.push({
        title: "",
        // name: "",
        UpImgData: []
      });
    },
    //添加模型模块
    addModule() {
      this.moduleData.push({
        title: "",
        // name: "",
        UpImgData: []
      });
    },
    //删除材质模块
    deleteMaterial(v, i) {
      // if (v.UpImgData.length) {
      //   this.deleteItemImg(this.$changeUploadImg(v.UpImgData), 1, i);
      // } else {
        this.materialData.splice(i, 1);
      // }
    },
    //删除模型模块
    deleteModule(v, i) {
      // if (v.UpImgData.length) {
      //   this.deleteItemImg(this.$changeUploadImg(v.UpImgData), 2, i);
      // } else {
        this.moduleData.splice(i, 1);
      // }
    },
    deleteItemImg(arr, type, i) {
      this.$Post(this.$api.deleteFile, {
        path: arr.join()
      })
        .then(res => {
          if (res.code == 0) {
            this.$changeSession(arr);
            if (type == 1) {
              this.materialData.splice(i, 1);
            } else {
              this.moduleData.splice(i, 1);
            }
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("alert_fail_delete_title")
          });
        });
    },
    //zip文件上传成功后的函数
    uploadSectionFile(file) {
      let user = JSON.parse(window.sessionStorage.getItem("userInfo"));
      let formData = new FormData();
      let self = this;
      formData.append("token", user.token);
      formData.append("userId", user.id);
      formData.append("image", file.file);
      this.progress.isShowProgress = true;
      let timer = setInterval(() => {
        if (self.progress.percent == 85) {
          clearInterval(timer);
        }
        self.progress.percent += 5;
      }, Math.random() * 1000 + 100);
      this.$PostFormData(
        `${this.$api.uploader}?upload_type=${this.uploadType}`,
        formData
      )
        .then(res => {
          if (res.code == 0) {
            self.progress.percent = 100;
            self.progress.status = "success";
            // if (self.zipData.length !== 0) {
            //   self.zipData.splice(0, 1);
            // }
            self.zipData.push({
              src: res.path,
              url: res.url
            });
            window.sessionStorage.setItem(
              "uploadedZip",
              JSON.stringify([res.path])
            );
          } else {
            self.progress.status = "exception";
          }
          clearInterval(timer);
          self.isUpResult = true;

          // let uploadedZip = JSON.parse(
          //   window.sessionStorage.getItem("uploadedZip")
          // );
          // if (uploadedZip) {
          //   uploadedZip.push(res.path);
          //   window.sessionStorage.setItem(
          //     "uploadedZip",
          //     JSON.stringify(uploadedZip)
          //   );
          // } else {
          //   uploadedZip = [];
          //   uploadedZip.push(res.path);
          //   window.sessionStorage.setItem(
          //     "uploadedZip",
          //     JSON.stringify(uploadedZip)
          //   );
          // }
        })
        .catch(err => {
          self.progress.status = "exception";
          clearInterval(timer);
          self.isUpResult = true;
        });
    },

    //zip压缩文件上传前判断文件大小以及文件是否存在
    beforeUploadFile(file) {
      // if (file.size / 1024 / 1024 > 5) {
      // this.$message({
      //   message: "该文件大于5M",
      //   type: "warning"
      // });
      // return false;
      // }
      if (this.zipData.length) {
        this.$message({
          message: this.$t("delete_origin_file"),
          type: "warning"
        });
        return false;
      }
    },
    //删除上传的zip文件
    deleteZip() {
      this.deleteUpZip(this.zipData[0].src);
    },
    deleteUpZip(zipPush) {
      let self = this;
      this.$Post(this.$api.deleteFile, { path: zipPush })
        .then(res => {
          if (res.code === "0") {
            self.zipData.splice(0, 1);
            if (window.sessionStorage.getItem("uploadedZip")) {
              window.sessionStorage.removeItem("uploadedZip");
            }
            // let uploadedZip = JSON.parse(
            //   window.sessionStorage.getItem("uploadedZip")
            // );
            // if (uploadedZip) {
            //   uploadedZip.forEach((item, index) => {
            //     if (item === zipPush) {
            //       uploadedZip.splice(index, 1);
            //       console.log(item, zipPush);
            //     }
            //   });
            //   window.sessionStorage.setItem(
            //     "uploadedZip",
            //     JSON.stringify(uploadedZip)
            //   );
            // }
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("alert_fail_delete_title")
          });
        });
    }
  },
  components: {
    uploader
  }
};
</script>

<style scoped>
.choose3dModule {
  padding: 10px 0 10px 18px;
  background-color: #fff;
  margin-bottom: 2px;
}
.choose_directory {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 10px 0;
}
.uploadZipText {
  width: 220px;
}
.choose_directory span {
  font-size: 14px;
  color: #606266;
}
.choose_directory span.uploadPrompt {
  font-size: 12px;
}
.choose_directory span.fileName {
  margin-left: 10px;
}
.form_input_300 {
  width: 300px;
}
.choose3d_switch {
  padding: 10px 0;
}
.switch_input {
  margin-bottom: 10px;
}
.image_description {
  margin-bottom: 10px;
}
.desc_span {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
}
.icon_delete {
  margin-left: 10px;
}
.close_icon {
  color: red;
  margin-left: 20px;
  font-size: 24px;
  cursor: pointer;
}
</style>
