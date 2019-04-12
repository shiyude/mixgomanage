<template>
  <div class="categoryList">
    <h1 class="hint_site">
      <!-- 当前位置：家具分类 > 分类列表 -->
      {{$t('current_position')}}： {{$t('furniture_classification')}} > {{$t('classify_list')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input
              :placeholder="$t('search_classify')"
              prefix-icon="el-icon-search"
              v-model.trim="seek"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button
              type="primary"
              @click="addCategory"
              icon="el-icon-circle-plus"
            >{{$t('add_furniture_classify')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="CategoryList" border style="width: 100%">
        <el-table-column :label="$t('create_time')" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('classify_name1')" v-if="langType == 1 || langType == 3">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('sub_category')" v-if="langType == 2 || langType == 3">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryNameEn }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('classify_logo')">
          <template slot-scope="scope">
            <img
              :src="hostUrl+scope.row.logo"
              style="cursor:pointer"
              @click="$imgPreview(hostUrl+scope.row.logo)"
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('add_furniture_classify_to_product')" width="380">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactGategory(scope.row)">{{$t('edit')}}</el-button>
            <el-button
              size="mini"
              @click="redactSonGategory(scope.row)"
            >{{$t('see_classify_goods')}}</el-button>
            <el-button size="mini" type="danger" @click="deleteGategory(scope.row)">{{$t('delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="total,prev, pager, next, jumper"
          :current-page.sync="currentPage"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      @close="deleteDom"
      :title="$t('set_classify')"
      :visible.sync="isDialog"
      width="1000px"
      center
    >
      <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0"
      >
        <el-row :gutter="20" v-if="langType == 1 || langType == 3">
          <el-col :span="13">
            <el-form-item
              label-width="190px"
              :label="$t('classify_name1')"
              prop="categoryName"
              :rules="{
            required: true,
            message: $t('verificate_classify_name1'),
            trigger: 'blur'
          }"
            >
              <el-input
                v-model.trim="ruleForm.categoryName"
                :placeholder="$t('verificate_classify_name1')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="langType == 2 || langType == 3">
          <el-col :span="13">
            <el-form-item
              label-width="190px"
              :label="$t('sub_category')"
              prop="categoryName1"
              :rules="{
            required: true,
            message: $t('verificate_classify_name2'),
            trigger: 'blur'
          }"
            >
              <el-input
                v-model.trim="ruleForm.categoryName1"
                :placeholder="$t('verificate_classify_name2')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" >
          <el-col :span="13">
            <el-form-item
              label-width="190px"
              :label="$t('Introduction')"
             >
              <el-input
                type="textarea"
                :rows="2"
                v-model.trim="ruleForm.description"
                :placeholder="$t('Please_fill_in_the_introduction')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label-width="190px" :label="$t('classify_logo')" prop="logo">
              <uploader :backData="ruleForm.logo" :id="'logo1'" :mixLength="1" :folder="'logo'"></uploader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-for="(item,index) in itemTypeData"
          :key="index"
          label-width="190px"
          :label="$t('attribute_name')"
        >
          <div class="typeConter">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input
                  v-model.trim="item.propertyName"
                  :placeholder="$t('verificate_classify_name')"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="item.controlType" :placeholder="$t('verificate_select_type')">
                  <el-option
                    v-for="i in optionsType"
                    :key="i.value"
                    :label="i.label"
                    :value="i.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-button
                  v-if="index == 0"
                  size="mini"
                  type="primary"
                  @click="addTypeArr()"
                >{{$t('add_one')}}</el-button>
                <!-- <el-button v-if="index > 0" size="mini" type="danger" @click="deleteTypeArr(index)">删除</el-button> -->
              </el-col>
            </el-row>
            <div>
              <el-tag
                :key="tag"
                v-for="tag in item.propertyValues"
                closable
                :disable-transitions="false"
                @close="handleClose(tag,index)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="item.inputVisible"
                v-model.trim="item.inputValue"
                :ref="`i${item.propertyId}${index}`"
                size="small"
                @keyup.enter.native="handleInputConfirm(index)"
                @blur="handleInputConfirm(index)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(index,`i${item.propertyId}${index}`)"
              >{{$t('add_label')}}</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uploader from "@/components/uploader.vue";
export default {
  components: {
    uploader
  },
  data() {
    return {
      langType: 1,
      seek: "",
      seekStr: "",
      CategoryList: [],
      ruleForm: {
        categoryName: "",
        categoryName1: "",
        logo: [],
        description: ""
      },
      pageSize: 10,
      total: 0,
      currentPage: 1,
      rules: {
        logo: [
          {
            type: "array",
            required: true,
            message: this.$t("verificate_classify_logo"),
            trigger: "blur"
          }
        ]
      },
      optionsType: [
        {
          value: 2,
          label: this.$t("radio")
        },
        {
          value: 3,
          label: this.$t("checkbox")
        }
      ],
      isDialog: false,
      activeId: null,
      itemTypeData: [
        {
          propertyValues: [], // 属性值
          controlType: "", // 展示类型
          propertyName: "", // 属性名称
          inputValue: "", // 当前输入
          inputVisible: false,
          propertyId: ""
        }
      ],
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  mounted() {
    this.getCategoryList();
    this.langType = this.$getLangType();
  },
  methods: {
    handleClose(tag, index) {
      // 删除分类属性值
      this.itemTypeData[index].propertyValues.splice(
        this.itemTypeData[index].propertyValues.indexOf(tag),
        1
      );
      console.log(tag);
    },

    showInput(index, name) {
      // 获取input的焦点
      this.itemTypeData[index].inputVisible = true;
      this.itemTypeData = Object.assign([], this.itemTypeData);
      let str = `this.$refs.${name}[0].focus()`;
      this.$nextTick(_ => {
        eval(str);
      });
    },
    handleInputConfirm(index) {
      // 增加分类属性值
      let inputValue = this.itemTypeData[index].inputValue;
      if (inputValue) {
        this.itemTypeData[index].propertyValues.push(inputValue);
      }
      this.itemTypeData[index].inputVisible = false;
      this.itemTypeData[index].inputValue = "";
    },
    addTypeArr() {
      // 增加一组属性
      this.itemTypeData.push({
        propertyValues: [],
        controlType: "",
        propertyName: "",
        inputValue: "",
        inputVisible: false
      });
    },
    deleteDom() {
      this.$refs.ruleForm.clearValidate();
      this.itemTypeData = [
        {
          propertyValues: [],
          controlType: "",
          propertyName: "",
          inputValue: "",
          inputVisible: false,
          propertyId: ""
        }
      ];
    },
    deleteTypeArr(key) {
      // 删除一组属性
      this.itemTypeData.splice(key, 1);
    },
    searchData() {
      this.seekStr = this.seek;
      this.currentPage = 1;
      this.getCategoryList();
      // 搜索
    },
    getCategoryList() {
      // 获取商品分类列表
      this.$Get(this.$api.queryGoodsGategoryList, {
        categoryName: this.seekStr,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == 0) {
          this.CategoryList = res.datas.lists;
          this.total = res.datas.count;
        }
      });
    },
    submitForm(formName) {
      // 提交表单
      let seft = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let typeData = [];
          // console.log(this.itemTypeData)
          for (let i = 0; i < this.itemTypeData.length; i++) {
            if (this.itemTypeData[i].propertyName == "") {
              this.$notify.error({
                title: "error",
                message: this.$t("attribute") + i + this.$t("name_is_empty")
              });
              return;
            } else if (this.itemTypeData[i].controlType == "") {
              this.$notify.error({
                title: "error",
                message: this.$t("attribute") + i + this.$t("type_is_empty")
              });
              return;
            } else if (this.itemTypeData[i].propertyValues.length == 0) {
              this.$notify.error({
                title: "error",
                message: this.$t("attribute") + i + this.$t("val_is_empty")
              });
              return;
            } else {
              typeData[i] = {
                propertyName: this.itemTypeData[i].propertyName,
                controlType: this.itemTypeData[i].controlType,
                propertyValues: this.itemTypeData[i].propertyValues.toString()
              };
              if (this.itemTypeData[i].propertyId) {
                typeData[i].id = this.itemTypeData[i].propertyId;
              }
            }
          }
          // console.log(typeData)
          let data = {
            categoryName: seft.ruleForm.categoryName,
            categoryNameEn: seft.ruleForm.categoryName1,
            logo: seft.ruleForm.logo[0].url,
            description: seft.ruleForm.description
          };
          if (this.activeId) {
            data.categoryId = this.activeId;
          }
          this.$Post(this.$api.saveGoodsGategory, {
            ...data,
            propertyValues: JSON.stringify(typeData)
          }).then(res => {
            if (res.code == 0) {
              seft.getCategoryList();
              seft.isDialog = false;
              let newUploadImg = seft.$changeUploadImg([...seft.ruleForm.logo]); //获取提交的图片数组
              seft.$changeSession(newUploadImg);
              this.activeId = null;
              this.$message({
                type: "success",
                message: "success!"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    addCategory() {
      // 增加分类
      this.activeId = null;
      this.ruleForm = {
        categoryName: "",
        categoryName1: "",
        logo: [],
        description: ""
      };
      this.isDialog = true;
    },
    redactGategory(row) {
      // 编辑商品分类
      this.activeId = row.id;
      this.$Get(this.$api.queryGoodsCategoryProperty, {
        pageSize: 100,
        pageNo: 1,
        categoryId: row.id
      }).then(res => {
        if (res.code == 0) {
          for (let i = 0; i < res.datas.lists.length; i++) {
            this.itemTypeData[i] = {
              propertyName: res.datas.lists[i].propertyName,
              controlType: res.datas.lists[i].controlType,
              propertyValues: res.datas.lists[i].propertyValues.split(","),
              propertyId: res.datas.lists[i].id,
              inputVisible: false,
              inputValue: ""
            };
          }
          // console.log(this.itemTypeData)
          this.isDialog = true;
          this.ruleForm = {
            categoryName: row.categoryName,
            categoryName1: row.categoryNameEn,
            logo: [
              {
                src: this.hostUrl + row.logo,
                url: row.logo
              }
            ],
            description: row.description
          };
        }
      });
    },
    redactSonGategory(row) {
      // 编辑子分类
      let { id } = row;
      this.$router.push({
        path: "categoryList.html",
        query: {
          id: id
        }
      });
    },
    deleteGategory(row) {
      // 删除分类
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          this.$Get(this.$api.deleteGoodsGategory, { categoryId: row.id }).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("alert_success_delete_title")
                });
                this.getCategoryList();
              } else {
                this.$notify.error({
                  title: "fail",
                  message: res.msg
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel_delete")
          });
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCategoryList();
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>
<style lang="less" >
.categoryList {
  .appFind_conter_input {
    margin-top: 15px;
    background: #fff;
    padding: 10px;
    .add_find_btn {
      text-align: center;
    }
  }
  .find_tab {
    margin-top: 15px;
    .cell {
      height: 60px;
      // line-height: 60px;
      img {
        height: 100%;
      }
    }
    .find_list_img {
      height: 40px;
    }
  }
  .tree_head {
    color: red;
    margin-bottom: 10px;
    display: block;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .select_box {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .el-input__icon {
      line-height: 30px;
    }
  }
}
</style>