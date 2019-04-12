<template>
  <div class="color_select">
    <div class="color_content">
      <el-tabs type="border-card">
        <el-tab-pane :label="$t('good_logo_list')">
          <el-button type="primary" @click='addMaterial' icon="el-icon-circle-plus-outline">{{$t('addMaterial')}}</el-button>
          <div class="color_item" v-for="(item,key) in materialData">
            <div class="delete_color" @click="deleteMaterial(key)">
              <span class="el-icon-circle-close close_icon"></span>
            </div>
            <div class="material_img_div">
              <el-row>
                <el-col :span="16">
                  <el-form-item>
                    <span slot="label">{{$t('goodmaterial')}}<br/>(40*40)</span>
                    <div class="upload_section">
                      <uploader :id="'color'+key" :mixLength='1' :backData="item.material" :maxSize="150"></uploader>
                    </div>
                    <div class='image_description'>
                      <span class="desc_span">
                        <el-input size="mini" :placeholder="$t('desc_verificate')" v-model.trim="item.title"></el-input>
                        <el-input size="mini" class="code_input" :placeholder="$t('code_verificate')" v-model.trim="item.code"></el-input>
                      </span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" @click='addColor(key)' icon="el-icon-circle-plus-outline">{{$t('addColor')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <template v-if="item.color&&item.color.length">
              <div class="color_main_div" v-for="(color,colorI) in item.color">
                <div class="delete_color" @click="deleteColor(key,colorI)">
                  <span class="el-icon-circle-close close_icon"></span>
                </div>
                <div class="color_img_div">
                  <el-form-item>
                    <span slot="label">{{$t('good_color')}}<br/>(40*40)</span>
                    <div class="upload_section">
                      <uploader :id="'logo'+key+colorI" :mixLength='1' :backData="color.logo.data" :maxSize="150"></uploader>
                    </div>
                    <div class='image_description'>
                      <span class="desc_span">
                        <el-input size="mini" :placeholder="$t('code_verificate')" v-model.trim="color.logo.code"></el-input>
                      </span>
                    </div>
                  </el-form-item>
                </div>
                <div class="main_img_div">
                  <el-form-item>
                    <span slot="label">{{$t('good_logo')}}<br/>(375*350)</span>
                    <uploader :id="'mainImg'+key+colorI" :mixLength='5' :backData="color.main" :maxSize="150"></uploader>
                  </el-form-item>
                </div>
              </div>
            </template>

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
    materialData: {
      //颜色的数据
      type: Array,
      default() {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  components: {
    uploader
  },
  methods: {
    addColor(k) {
      if (this.materialData[k].color.length > 9) {
        return;
      }
      this.materialData[k].color.push({
        logo: { data: [], code: "" },
        main: []
      });
    },
    addMaterial() {
      if (this.materialData.length > 9) {
        return;
      }
      this.materialData.push({
        material: [],
        title: "",
        code: "",
        color: [
          {
            logo: { data: [], code: "" },
            main: []
          }
        ]
      });
    },
    deleteMaterial(i) {
      this.materialData.splice(i, 1);
    },
    deleteColor(k, i) {
      this.materialData[k].color.splice(i, 1);
    }
  }
};
</script>
<style lang="less">
.color_select {
  .color_content {
    margin: 0 170px 50px 170px;
    .color_item {
      border: 1px solid #ccc;
      padding: 40px 0 10px;
      margin: 20px 0;
      position: relative;
      .el-form-item__content {
        line-height: 0;
      }
      .desc_span {
        display: inline-block;
        width: 80px;
        margin-right: 10px;
        .code_input {
          margin-top: 10px;
        }
      }
      .color_main_div {
        border: 1px solid #ccc;
        margin: 0 20px 20px 20px;
        padding-top: 30px;
        border-radius: 20px;
        position: relative;
      }
      .delete_color {
        position: absolute;
        height: 24px;
        width: 24px;
        top: -12px;
        right: -12px;
        .close_icon {
          color: red;
          font-size: 24px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

