  <template>
  <div class='furniture_section' :style="{'overflow':progress.isShowProgress?'hidden':'auto','height':progress.isShowProgress?'100%':'auto'}">
    <h1 class="hint_site" style="margin-bottom:15px;">
      <!-- 当前位置：商品管理 > 发布商品 -->
      {{$t('current_position')}}： {{$t('good_manage')}} > {{$t('release_good')}}
    </h1>
    <div class='furniture_form'>
      <el-form label-width="170px" :model="furnitureForm" :rules="rules" :inline="true" ref='furnitureForm' class='demo-ruleForm'>
        <div class='top_form form_section'>
          <el-form-item v-if="langName==='zh-CN'" :label="$t('classification')" prop='classify'>
            <el-select v-model='furnitureForm.classify' class='form_input_375' @change="classifyChange">
              <el-option v-for="(v,k) in classifyList" :key="k" :value="v.id" :label="v.categoryName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="langName==='en_US'" :label="$t('classification')" prop='classify'>
            <el-select v-model='furnitureForm.classify' class='form_input_375' @change="classifyChange">
              <el-option v-for="(v,k) in classifyList" :key="k" :value="v.id" :label="v.categoryNameEn"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('brand')" prop='brand'>
            <el-select v-model="furnitureForm.brand" filterable class='form_input_375' @change="brandChange">
              <el-option v-for="(v,k) in brandList" :key="k" :value="v.id" :label="v.brandName">
              </el-option>
            </el-select>
          </el-form-item><br/>
          <el-form-item :label="$t('brand_custom')" v-if="furnitureForm.brand!==''" style="margin-bottom:0">
            <el-checkbox-group v-model="furnitureForm.brandOfCustom" style="width:900px;">
              <el-checkbox v-for="(v,k) in furnitureForm.brandOfCustomList" :label="v.id" :key="v.id" class="checkbox" :checked="v.checked==1">{{v.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item><br/>
          <template v-for="(v,k) in furnitureForm.goodOfCustomList">
            <el-form-item :label="v.name" style="margin-bottom:0">
              <el-checkbox-group v-model="v.defaultVal" style="width:900px;">
                <el-checkbox v-for="(val,index) in v.items" :label="val.id" :key="val.id" class="checkbox" :checked="val.checked==1">{{val.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item><br/>
          </template>
          <el-form-item label=" ">
            <el-checkbox :label="$t('add_3d_module')" border v-model='furnitureForm.isShow3dModule'></el-checkbox>
          </el-form-item>
        </div>
        <!-- 引入3d模型选择的组件 -->
        <choose3d-module v-show='furnitureForm.isShow3dModule' :progress="progress" :material-data='furnitureForm.materialData' :module-data='furnitureForm.moduleData' :zip-data='furnitureForm.zipData'></choose3d-module>
        <!-- 引入3d模型选择的组件 -->
        <div class='base_message_form form_section'>
          <div class='form_title'>
            <span>{{$t('basic_message')}}</span>
          </div>
          <el-form-item :label="$t('good_name')" prop="commodityName">
            <el-input class='form_input_375' v-model.trim="furnitureForm.commodityName" :placeholder="$t('verificate_good_name')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('origin')" prop='commodityOrigin'>
            <el-input class='form_input_375' v-model.trim="furnitureForm.commodityOrigin" :placeholder="$t('auto_get')" disabled></el-input>
          </el-form-item><br/>
          <el-form-item :label="$t('code')" prop='commodityCode'>
            <el-input class='form_input_375' v-model.trim="furnitureForm.commodityCode" :placeholder="$t('verificate_code')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('size')" prop='size'>
            <el-input class='form_input_375' v-model.trim="furnitureForm.size" :placeholder="$t('verificate_size')"></el-input>
          </el-form-item><br/>
          <el-form-item :label="$t('price')" prop='price'>
            <el-input-number class='form_input_375' v-model="furnitureForm.price" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('website')" prop='website'>
            <el-input class='form_input_375' v-model.trim="furnitureForm.website" :placeholder="$t('verificate_developer_website')"></el-input>
          </el-form-item>
        </div>
        <div class='base_message_form form_section' style="padding-bottom:20px">
          <div class='form_title'>
            <span>{{$t('goods_detail')}}</span>
          </div>
          <el-form-item :label="$t('dynamic_panel')">
            <!-- 动态面板表单组件 -->
            <furniture-Detail-form :dymanic-data="dymanicData"></furniture-Detail-form>
          </el-form-item>
        </div>
        <div class='base_upload_form form_section'>
          <el-form-item prop="scaleImg" :rules="{
            type:'array',required: true, message: $t('verificate_house_type_logo'), trigger: 'change'
          }">
            <span slot="label" v-if="companyId == 32">{{$t('house_type_logo')}}<br/>(165*190)</span>
            <span slot="label" v-else>{{$t('house_type_logo')}}</span>
            <uploader :backData="furnitureForm.scaleImg" :id="'scaleImg0'" :mixLength='1' :folder="'logo'" :maxSize="150"></uploader>
          </el-form-item><br/>
          <!-- 商品主图无颜色分类的情况 -->
          <el-form-item :label="$t('house_type_imgs')" prop="mainImg" :rules="{
            type:'array',required: true, message: $t('verificate_house_type_imgs'), trigger: 'change'
          }" v-if="companyId!='32'">
            <uploader :backData="furnitureForm.mainImg" :id="'mainImg0'" :mixLength='10' :folder="'imgs'" :maxSize="150"></uploader>
          </el-form-item><br/>
          <!-- 商品主图无颜色分类的情况 -->
          <!-- 商品主图有颜色分类的情况 -->
          <el-form-item :label="$t('house_type_imgs')" style="margin-bottom:50px" v-if="companyId =='32'">
            <!-- <el-checkbox :label="$t('add_good_main')" border checked class="el-logo-checkbox" disabled></el-checkbox> -->
            <span class="el-logo-span">{{$t('add_good_main')}}</span>
          </el-form-item><br/>
          <color-select v-if="companyId =='32'" :material-data='furnitureForm.colorData'></color-select>
          <!-- 商品主图有颜色分类的情况 -->
          <el-form-item :label="$t('house_type_detail')" prop="detailImg" :rules="{
            type:'array',required: true, message:  $t('verificate_house_type_detail'), trigger: 'change'
          }">
            <uploader :maxSize="150" :backData="furnitureForm.detailImg" :id="'detailImg0'" :mixLength='10' :folder="'imgs'"></uploader>
          </el-form-item>
        </div>
        <div class="submit_form">
          <el-button type="primary" size="medium" style="width:300px;height:40px" @click='submitFurnitureForm("furnitureForm")'>{{$t('release')}}</el-button>
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
import furnitureDetailForm from "@/components/furnitureDetailForm";
import colorSelect from "@/components/colorSelect";
export default {
  data() {
    return {
      companyId: "", //为32时则选择主图颜色
      progress: {
        percent: 0,
        isShowProgress: false,
        status: ""
      },
      furnitureForm: {
        isShow3dModule: false, //3d模型模块初始为隐藏状态
        classify: "", //家具分类
        brand: "", //品牌
        zipData: [], //zip文件
        materialData: [], //材质的数据 须传给子组件
        moduleData: [], //模型的数据 须传给子组件
        commodityName: "", //商品名称
        commodityOrigin: "", //商品产地
        commodityCode: "", //货号
        price: "", //商品价格
        size: "", //尺寸
        website: "", //网址
        scaleImg: [],
        mainImg: [],
        detailImg: [],
        brandOfCustom: [], //品牌自定义选中的值
        brandOfCustomList: [], //品牌自定义的数据
        goodOfCustomList: [], //商品自定义的数据
        colorData: [] //颜色的数据
      },
      langName: sessionStorage.getItem("lang"),
      rules: {
        classify: [
          {
            required: true,
            message: this.$t("verificate_list"),
            trigger: "change"
          }
        ],
        brand: [
          {
            required: true,
            message: this.$t("verificate_select_brand"),
            trigger: "change"
          }
        ],
        commodityName: [
          {
            required: true,
            message: this.$t("verificate_good_name"),
            trigger: "blur"
          }
        ],
        commodityCode: [
          {
            required: true,
            message: this.$t("verificate_code"),
            trigger: "blur"
          }
        ],
        size: [
          {
            required: true,
            message: this.$t("verificate_size"),
            trigger: "blur"
          }
        ]
      },
      classifyList: [], //家具分类选中的值
      brandList: [], //品牌数据
      dymanicData: [],
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      companyId:
        JSON.parse(window.sessionStorage.getItem("userInfo") || "{}")
          .companyId || ""
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    this.companyId = userInfo.companyId || "";
  },
  async mounted() {
    await this.getGategory();
    await this.getBrand();
    await this.getGoodsCustom();
    if (this.companyId == "32" && this.$route.query.id != null) {
      await this.queryGoodsMaterail();
    }
    this.judgeGoodsSession();
  },
  methods: {
    //请求colors的数据
    queryGoodsMaterail() {
      this.$Get(this.$api.queryGoodsMaterail, {
        goodsId: this.$route.query.id
      }).then(res => {
        if (res.code == 0) {
          let data = res.datas;
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              this.furnitureForm.colorData.push({
                title: data[i].title,
                code: data[i].code,
                color: [],
                material: []
              });
              if (data[i].logo) {
                this.furnitureForm.colorData[i].material.push({
                  url: data[i].logo || "",
                  src: data[i].logo ? this.hostUrl + data[i].logo : ""
                });
              }
              let materialItem = data[i].material;
              for (let j = 0; j < materialItem.length; j++) {
                this.furnitureForm.colorData[i].color.push({
                  logo: { code: materialItem[j].code, data: [] },
                  main: []
                });
                if (materialItem[j].logo) {
                  this.furnitureForm.colorData[i].color[j].logo.data.push({
                    url: materialItem[j].logo || "",
                    src: materialItem[j].logo
                      ? this.hostUrl + materialItem[j].logo
                      : ""
                  });
                }
                let mainItem = materialItem[j].imgs;
                for (let k = 0; k < mainItem.length; k++) {
                  this.furnitureForm.colorData[i].color[j].main.push({
                    url: mainItem[k],
                    src: this.hostUrl + mainItem[k]
                  });
                }
              }
            }
          }
        }
      });
    },
    //分类发生改变时
    classifyChange(val) {
      this.classifyList.forEach(item => {
        if (item.id == val) {
          this.redactGategory(item);
          return false;
        } else {
          return true;
        }
      });
    },
    //品牌发生改变时
    brandChange(val) {
      this.getBrandCustomList(val);
      this.brandList.forEach(item => {
        if (item.id == val) {
          this.furnitureForm.commodityOrigin = item.origin;
          return false;
        } else {
          return true;
        }
      });
    },
    //获得品牌下的自定义分类列表
    getBrandCustomList(id) {
      this.furnitureForm.brandOfCustom = [];
      this.$Get(this.$api.queryBrandCustomCategoryTree, {
        goodsId: this.$route.query.id || "",
        brandId: id
      }).then(res => {
        if (res.code == 0) {
          this.furnitureForm.brandOfCustomList = res.datas;
        }
      });
    },
    //获取分类下的动态表单
    redactGategory(row) {
      this.activeId = row.id;
      this.$Get(this.$api.queryGoodsCategoryPropertyValue, {
        goodsId: this.$route.query.id || "",
        categoryId: row.id
      }).then(res => {
        if (res.code == 0) {
          let formArr = res.datas.lists;
          for (let i = 0; i < formArr.length; i++) {
            let propertyValue =
              formArr[i].propertyValue == ""
                ? []
                : formArr[i].propertyValue.split(",");
            let propertyValues =
              formArr[i].propertyValues == ""
                ? []
                : formArr[i].propertyValues.split(",");
            propertyValue = propertyValue.filter(item => {
              return propertyValues.indexOf(item) != -1;
            });
            console.log(propertyValue);
            formArr[i].propertyValue = propertyValue.join();
            if (formArr[i].controlType == 3) {
              if (formArr[i].propertyValue == "") {
                formArr[i].propertyValue = [];
              } else {
                formArr[i].propertyValue = formArr[i].propertyValue.split(",");
              }
            }
          }
          this.dymanicData = formArr;
          console.log(this.dymanicData);
        }
      });
    },
    submitFurnitureForm(formName) {
      let id = this.$route.query.id || "";
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断材质和模型是否填写完毕
          if (
            this.$judge3dModule({
              judgeData: this.furnitureForm.materialData,
              obj: this
            }) &&
            this.$judge3dModule({
              type: 1,
              judgeData: this.furnitureForm.moduleData,
              obj: this
            })
          ) {
            if (
              (this.furnitureForm.moduleData.length !== 0 ||
                this.furnitureForm.materialData.length !== 0) &&
              !this.furnitureForm.zipData.length
            ) {
              this.$message({
                message: this.$t("verificate_model_file"),
                type: "warning"
              });
              return;
            }
            // if (
            //   !this.$judgeColorData(this.furnitureForm.colorData) &&
            //   this.companyId == "32"
            // ) {
            //   this.$message({
            //     message: this.$t("verificate_logo"),
            //     type: "warning"
            //   });
            //   return;
            // }
            let formData = this.$screenDetailData({
              detailData: this.dymanicData
            });
            let materialData = this.$changeModuleData(
              this.furnitureForm.materialData
            );
            let moduleData = this.$changeModuleData(
              this.furnitureForm.moduleData,
              1
            );
            let colorData = this.$changeColorData(this.furnitureForm.colorData);
            let dataObj = {
              goodsName: this.furnitureForm.commodityName,
              brandId: this.furnitureForm.brand,
              categoryId: this.furnitureForm.classify,
              website: this.furnitureForm.website,
              price: this.furnitureForm.price,
              goodsCode: this.furnitureForm.commodityCode,
              goodsSize: this.furnitureForm.size,
              modelPath: this.furnitureForm.zipData[0]
                ? this.furnitureForm.zipData[0].url
                : "",
              propertyValues: JSON.stringify(formData),
              logo: this.furnitureForm.scaleImg[0].url,
              // imgs: this.$changeUploadImgUrl(this.furnitureForm.mainImg),
              detail: this.$changeUploadImgUrl(this.furnitureForm.detailImg),
              categoryValueIds: this.changeGoodsCustomValue().join(),
              brandCategoryIds: this.furnitureForm.brandOfCustom.join(),
              partMat: JSON.stringify(materialData),
              partModel: JSON.stringify(moduleData)
            };
            if (this.companyId == "32") {
              dataObj.materials = JSON.stringify(colorData);
            } else {
              dataObj.imgs = this.$changeUploadImgUrl(
                this.furnitureForm.mainImg
              );
            }
            if (id == "") {
              this.submitData(dataObj, 0);
            } else {
              dataObj.goodsId = id;
              this.submitData(dataObj, 1);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取商品分类列表
    async getGategory() {
      let data = await this.$Get(this.$api.queryGoodsGategoryList, {
        pageNo: 1,
        pageSize: 10000
      });
      this.classifyList = data.datas.lists;
    },
    //获取品牌列表
    async getBrand() {
      let data = await this.$Posting(this.$api.queryBrandList, {
        pageNo: 1,
        pageSize: 10000
      });
      this.brandList = data.datas.lists;
    },
    //获取查询商品自定义分类列表树形结构
    async getGoodsCustom() {
      let data = await this.$Posting(this.$api.queryGoodsCustomCategoryTree, {
        goodsId: this.$route.query.id || ""
      });

      if (data.code == 0) {
        let datas = data.datas;
        if (datas === null) {
          return;
        }
        for (let i = 0; i < datas.length; i++) {
          datas[i].defaultVal = [];
        }
        this.furnitureForm.goodOfCustomList = [...datas];
      }
    },
    //判断是否有缓存
    judgeGoodsSession() {
      if (sessionStorage.getItem("editGoodsMsg")) {
        this.furnitureForm.isShow3dModule = true;
        //判断缓存里面有没有编辑信息
        let editGoodsMsg = JSON.parse(sessionStorage.getItem("editGoodsMsg"));
        this.furnitureForm.classify = editGoodsMsg.categoryId;
        this.furnitureForm.brand = editGoodsMsg.brandId;
        editGoodsMsg.modelPath &&
          (this.furnitureForm.zipData = [
            {
              src: this.hostUrl + editGoodsMsg.modelPath,
              url: editGoodsMsg.modelPath
            }
          ]);
        this.furnitureForm.commodityName = editGoodsMsg.goodsName;
        this.brandChange(editGoodsMsg.brandId);
        this.furnitureForm.commodityCode = editGoodsMsg.goodsCode;
        this.furnitureForm.size = editGoodsMsg.goodsSize;
        this.furnitureForm.price = editGoodsMsg.price;
        this.furnitureForm.website = editGoodsMsg.website;
        this.furnitureForm.scaleImg.push({
          src: this.hostUrl + editGoodsMsg.logo,
          url: editGoodsMsg.logo
        });
        this.companyId != "32" && this.moreImg(editGoodsMsg.imgs);

        this.moreImg(editGoodsMsg.detail, 1);
        this.classifyChange(editGoodsMsg.categoryId);
        this.furnitureForm.materialData = this.$changeEditSessionData(
          editGoodsMsg.partMat
        );
        this.furnitureForm.moduleData = this.$changeEditSessionData(
          editGoodsMsg.partModel
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
      this.$Posting(this.$api.saveGoodsInfo, jsonData).then(res => {
        if (res.code == 0) {
          // let newUploadImg = _this.$changeUploadImg([
          //   ..._this.furnitureForm.scaleImg,
          //   ..._this.furnitureForm.mainImg,
          //   ..._this.furnitureForm.detailImg
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
          this.$router.replace("goodsList.html");
        } else {
          _this.$notify.error({
            title: this.$t("alert_fail_title"),
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
          this.furnitureForm.mainImg = newImgArr;
        } else {
          this.furnitureForm.detailImg = newImgArr;
        }
      }
    },
    //验证商品分类是否被选
    judgeGoodsCustom() {
      let isCheck = true;
      let data = this.furnitureForm.goodOfCustomList;
      for (let i = 0; i < data.length; i++) {
        if (!data[i].defaultVal.length) {
          isCheck = false;
          this.$message({
            message: `${data[i].name}${this.$t("least_one")}`,
            type: "warning"
          });
          break;
        } else {
          continue;
        }
      }
      return isCheck;
    },
    //改变商品自定义值
    changeGoodsCustomValue() {
      let customValue = [];
      let data = this.furnitureForm.goodOfCustomList;
      for (let i = 0; i < data.length; i++) {
        customValue.push(...data[i].defaultVal);
      }
      return customValue;
    }
  },
  components: {
    uploader,
    choose3dModule,
    furnitureDetailForm,
    colorSelect
  },
  beforeDestroy() {
    this.$deleteImg();
    this.$deleteZip();
    sessionStorage.getItem("editGoodsMsg") &&
      sessionStorage.removeItem("editGoodsMsg");
  }
};
</script>
   <style lang='less' scoped>
.furniture_section {
  .el-logo-span {
    padding: 9px 20px 9px 20px;
    border-radius: 4px;
    border: 1px solid #409eff;
    line-height: normal;
    height: 40px;
    display: inline-block;
    color: #409eff;
  }
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
  .form_input_375 {
    width: 375px;
  }
  .submit_form {
    background-color: #fff;
    padding: 20px;
    text-align: center;
  }
  .checkbox {
    margin: 0;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
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