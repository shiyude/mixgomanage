  <template>
  <div class='house_type_section' :style="{'overflow':progress.isShowProgress?'hidden':'auto','height':progress.isShowProgress?'100%':'auto'}">
    <h1 class="hint_site" style="margin-bottom:15px;">
      <!-- 当前位置：商品管理 > 发布户型 -->
      {{$t('current_position')}}： {{$t('good_manage')}} > {{$t('release_house_type')}}
    </h1>
    <div class='house_type_form'>
      <el-form label-width="170px" :model="houseTypeForm" :inline="true" :rules="rules" ref='houseTypeForm' class='demo-ruleForm'>
        <div class='top_form form_section'>
          <el-form-item :label="$t('building')" prop="house">
            <el-select v-model="houseTypeForm.house" :placeholder="$t('select_building')" class='form_input_375'>
              <el-option v-for="(v,k) in houseList" :key="k" :value="v.id" :label="v.houseName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('house_type')" prop="room">
            <el-select v-model="houseTypeForm.room" :placeholder="$t('select_house_type')" class='form_input_375'>
              <el-option v-for="(v,k) in roomList" :key="k" :value="v.roomId" :label="v.roomName"></el-option>
            </el-select>
          </el-form-item>
          <br/>
          <el-form-item :label="$t('style')" prop="style">
            <el-select v-model="houseTypeForm.style" :placeholder="$t('select_style')" class='form_input_375'>
              <el-option v-for="(v,k) in styleList" :key="k" :value="v.styleId" :label="v.styleName"></el-option>
            </el-select>
          </el-form-item><br/>
          <el-form-item label=" ">
            <el-checkbox :label="$t('add_3d_module')" border v-model='houseTypeForm.isShow3dModule'></el-checkbox>
          </el-form-item>
        </div>
        <!-- 引入3d模型选择的组件 -->
        <choose3d-module v-show='houseTypeForm.isShow3dModule' :progress="progress" :material-data='houseTypeForm.materialData' :module-data='houseTypeForm.moduleData' :zip-data='houseTypeForm.zipData' :upload-type="houseTypeForm.uplodType"></choose3d-module>
        <div class='base_message_form form_section'>
          <div class='form_title'>
            <span>{{$t('basic_message')}}</span>
          </div>
          <el-form-item :label="$t('name')" prop="name">
            <el-input class='form_input_375' v-model.trim="houseTypeForm.name" :placeholder="$t('verificate_house_type_name')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('house_type_area')" prop="area">
            <el-input class='form_input_375' v-model.trim="houseTypeForm.area" :placeholder="$t('verificate_house_type_area')"></el-input>
          </el-form-item><br/>
          <el-form-item :label="$t('code')" prop="code">
            <el-input class='form_input_375' v-model.trim="houseTypeForm.code" :placeholder="$t('verificate_code')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('website')" prop="website">
            <el-input class='form_input_375' v-model.trim="houseTypeForm.website" :placeholder="$t('verificate_developer_website')"></el-input>
          </el-form-item>
        </div>
        <div class='base_upload_form form_section'>
          <el-form-item :label="$t('house_type_logo')" prop="scaleImg" :rules="{
            type:'array',required: true, message: $t('verificate_house_type_logo'), trigger: 'change'
          }">
            <uploader :backData="houseTypeForm.scaleImg" :id="'scaleImg0'" :mixLength='1'></uploader>
          </el-form-item><br/>
          <el-form-item :label="$t('house_type_imgs')" prop="mainImg" :rules="{
            type:'array',required: true, message: $t('verificate_house_type_imgs'), trigger: 'change'
          }">
            <uploader :backData="houseTypeForm.mainImg" :id="'mainImg0'" :mixLength='10'></uploader>
          </el-form-item><br/>
          <el-form-item :label="$t('house_type_detail')" prop="detailImg" :rules="{
            type:'array',required: true, message: $t('verificate_house_type_detail'), trigger: 'change'
          }">
            <uploader :backData="houseTypeForm.detailImg" :id="'detailImg0'" :mixLength='10'></uploader>
          </el-form-item>
        </div>
        <div class="submit_form">
          <el-button type="primary" @click='submitFurnitureForm("houseTypeForm")' style="width:300px;height:40px">{{$t('release')}}</el-button>
        </div>
      </el-form>
    </div>
    <div class="mask" v-if="progress.isShowProgress">
      <el-progress type="circle" :percentage="progress.percent" class="mask_progress" :status="progress.status"></el-progress>
    </div>
  </div>
</template>
   <script>
import uploader from "@/components/uploader.vue";
import choose3dModule from "@/components/choose3dModule";
export default {
  data() {
    //验证面积的方法
    var validateAreaData = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("verificate_house_type_area1")));
      } else {
        if (isNaN(value)) {
          callback(new Error(this.$t("verificate_house_type_are2")));
        } else {
          callback();
        }
      }
    };
    return {
      progress: {
        percent: 0,
        isShowProgress: false,
        status: ""
      },
      houseTypeForm: {
        isShow3dModule: false, //3d模型模块初始为隐藏状态
        house: "",
        room: "",
        style: "",
        name: "",
        area: "",
        code: "",
        website: "",
        scaleImg: [],
        mainImg: [],
        detailImg: [],
        zipData: [], //zip文件
        materialData: [], //材质的数据 须传给子组件
        moduleData: [], //模型的数据 须传给子组件
        uplodType: "3d_house" //上传模型的类型
      },
      rules: {
        house: [
          {
            required: true,
            message: this.$t("select_building"),
            trigger: "change"
          }
        ],
        room: [
          {
            required: true,
            message: this.$t("select_house_type"),
            trigger: "change"
          }
        ],
        style: [
          {
            required: true,
            message: this.$t("select_style"),
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("verificate_house_type_name"),
            trigger: "blur"
          }
        ],
        area: [
          { required: true, validator: validateAreaData, trigger: "blur" }
        ],
        code: [
          {
            required: true,
            message: this.$t("verificate_code"),
            trigger: "blur"
          }
        ]
      },
      houseList: [], //楼盘数据
      roomList: [], //空间数据
      styleList: [], //风格数据
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  async mounted() {
    await this.getHouse();
    await this.getRoom();
    await this.getStyle();
    this.judgeGoodsSession();
  },
  methods: {
    submitFurnitureForm(formName) {
      let _this = this;
      let id = this.$route.query.id || "";
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断材质和模型是否填写完毕
          if (
            this.$judge3dModule({
              judgeData: this.houseTypeForm.materialData,
              obj: this
            }) &&
            this.$judge3dModule({
              type: 1,
              judgeData: this.houseTypeForm.moduleData,
              obj: this
            })
          ) {
            if (
              (this.houseTypeForm.moduleData.length !== 0 ||
                this.houseTypeForm.materialData.length !== 0) &&
              !this.houseTypeForm.zipData.length
            ) {
              this.$message({
                message: this.$t("verificate_model_file"),
                type: "warning"
              });
              return;
            }
            let materialData = this.$changeModuleData(
              this.houseTypeForm.materialData
            );
            let moduleData = this.$changeModuleData(
              this.houseTypeForm.moduleData,
              1
            );
            let dataObj = {
              houseTypeName: _this.houseTypeForm.name,
              houseId: _this.houseTypeForm.house,
              roomId: _this.houseTypeForm.room,
              houseCode: _this.houseTypeForm.code,
              website: _this.houseTypeForm.website,
              area: _this.houseTypeForm.area,
              styleId: _this.houseTypeForm.style,
              modelPath: _this.houseTypeForm.zipData[0]
                ? _this.houseTypeForm.zipData[0].url
                : "",
              logo: _this.houseTypeForm.scaleImg[0].url,
              imgs: _this.$changeUploadImgUrl(_this.houseTypeForm.mainImg),
              detail: _this.$changeUploadImgUrl(_this.houseTypeForm.detailImg),
              partMat: JSON.stringify(materialData),
              partModel: JSON.stringify(moduleData)
            };
            console.log(dataObj);
            if (id == "") {
              this.submitData(dataObj, 0);
            } else {
              dataObj.houseTypeId = id;
              this.submitData(dataObj, 1);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取楼盘列表
    async getHouse() {
      let data = await this.$Get(this.$api.queryHouseList, {
        pageNo: 1,
        pageSize: 10000
      });
      this.houseList = data.datas.lists;
    },
    //获取空间列表
    async getRoom() {
      let data = await this.$Posting(this.$api.queryHouseRoomList, {
        pageNo: 1,
        pageSize: 10000
      });
      this.roomList = data.datas.lists;
    },
    //获取风格列表
    async getStyle() {
      let data = await this.$Posting(this.$api.queryHouseStyleList, {
        pageNo: 1,
        pageSize: 10000
      });
      this.styleList = data.datas.lists;
    },
    //判断是否有缓存
    judgeGoodsSession() {
      if (sessionStorage.getItem("editHouseMsg")) {
        this.houseTypeForm.isShow3dModule = true;
        //判断缓存里面有没有编辑信息
        let editHouseMsg = JSON.parse(sessionStorage.getItem("editHouseMsg"));
        this.houseTypeForm.house = editHouseMsg.houseId;
        this.houseTypeForm.room = editHouseMsg.roomId;
        this.houseTypeForm.style = editHouseMsg.styleId;
        this.houseTypeForm.name = editHouseMsg.houseTypeName;
        this.houseTypeForm.area = editHouseMsg.area;
        this.houseTypeForm.code = editHouseMsg.houseCode;
        this.houseTypeForm.website = editHouseMsg.website;
        editHouseMsg.modelPath &&
          (this.houseTypeForm.zipData = [
            {
              src: this.hostUrl + editHouseMsg.modelPath,
              url: editHouseMsg.modelPath
            }
          ]);
        this.houseTypeForm.commodityName = editHouseMsg.goodsName;
        this.houseTypeForm.commodityCode = editHouseMsg.goodsCode;
        this.houseTypeForm.size = editHouseMsg.goodsSize;
        this.houseTypeForm.price = editHouseMsg.price;
        this.houseTypeForm.website = editHouseMsg.website;
        this.houseTypeForm.scaleImg.push({
          src: this.hostUrl + editHouseMsg.logo,
          url: editHouseMsg.logo
        });
        this.moreImg(editHouseMsg.imgs);
        this.moreImg(editHouseMsg.detail, 1);
        this.houseTypeForm.materialData = this.$changeEditSessionData(
          editHouseMsg.partMat
        );
        this.houseTypeForm.moduleData = this.$changeEditSessionData(
          editHouseMsg.partModel
        );
      } else {
        return;
      }
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      this.$Posting(this.$api.saveHouseType, jsonData).then(res => {
        if (res.code == 0) {
          // let newUploadImg = _this.$changeUploadImg([
          //   ..._this.houseTypeForm.scaleImg,
          //   ..._this.houseTypeForm.mainImg,
          //   ..._this.houseTypeForm.detailImg
          // ]); //获取提交的图片数组
          // _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          window.sessionStorage.getItem("uploadedImg") &&
            window.sessionStorage.removeItem("uploadedImg");
          window.sessionStorage.getItem("uploadedZip") &&
            window.sessionStorage.removeItem("uploadedZip");
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: message
          });
          this.$router.replace("housesList.html");
        } else {
          _this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    //编辑时多张图片预览 0 表示商品主图 1表示商品详情图 str表示图片链接
    moreImg(str = "", type = 0) {
      if (str == "") {
        return;
      } else {
        let imgArr = str.split(",");
        let newImgArr = [];
        for (let i = 0; i < imgArr.length; i++) {
          newImgArr.push({
            src: this.hostUrl + imgArr[i],
            url: imgArr[i]
          });
        }
        if (type == 0) {
          this.houseTypeForm.mainImg = newImgArr;
        } else {
          this.houseTypeForm.detailImg = newImgArr;
        }
      }
    }
  },
  components: {
    uploader,
    choose3dModule
  },
  beforeDestroy() {
    this.$deleteImg();
    this.$deleteZip();
    sessionStorage.getItem("editHouseMsg") &&
      sessionStorage.removeItem("editHouseMsg");
  }
};
</script>
<style lang='less' scoped>
.house_type_section {
  .form_section {
    padding: 18px 0 0 20px;
    background-color: #fff;
    margin-bottom: 2px;
  }
  .form_title {
    margin-bottom: 18px;
    span {
      background-color: #f0f0f0;
      font-size: 14px;
      padding: 5px 10px;
      border-radius: 10px;
    }
  }
  .form_input_122 {
    width: 122px;
  }
  .form_input_375 {
    width: 375px;
  }
  .submit_form {
    background-color: #fff;
    padding: 20px;
    text-align: center;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.3);
    .mask_progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>