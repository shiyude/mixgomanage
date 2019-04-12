<template >
  <div class="mainLcon">
    <h1 class="hint_site">
      <!-- 当前位置：APP管理 > 首页 > 主标模块 -->
      {{$t('current_position')}}： {{$t('app_manage')}} > {{$t('home_page')}} > {{$t('mark_module')}}
    </h1>
    <div class="mainLcon_conter">
      <div class="mainLcon_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_mark')" prefix-icon="el-icon-search" v-model.trim="key">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="postListmark()">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button type="primary" @click="addMark()" icon="el-icon-circle-plus" :disabled="judgeDataLen">{{$t('add_mark')}}</el-button>
            <span style="font-size: 14px;color: #666;">({{$t('no_more_five')}})</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="mainLcon_tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('create_time')" width="180">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column class="find_list_img" :label="$t('mark_logo')">
          <template slot-scope="scope">
            <img @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('name1')" v-if="langType == 1 || langType == 3">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('name2')" v-if="langType == 2 || langType == 3">
          <template slot-scope="scope">
            <span>{{ scope.row.nameEn }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('creater')">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="alterMark(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="toTop(scope.row)">{{$t("to_top")}}</el-button>
            <el-button size="mini" type="danger" @click="deleteMark(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加主标弹窗 -->
    <el-dialog class="optFor_subject" :title="$t('add_mark')" :visible.sync="findType" @close="clearValidate" center width="800px">
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('name1')" label-width="130px" prop="markName" :rules="{
            required: true,
            message: $t('verificate_name1'),
            trigger: 'blur'
          }" v-if="langType == 1 || langType == 3">
              <el-input v-model="ruleForm.markName" :placeholder="$t('name1')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('name2')" label-width="130px" prop="markName1" :rules="{
            required: true,
            message: $t('verificate_name2'),
            trigger: 'blur'
          }" v-if="langType == 2 || langType == 3">
              <el-input v-model="ruleForm.markName1" :placeholder="$t('name2')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label-width="130px" :label="$t('select_type')" prop="ManinType">
              <el-select @change="distinguishApi(ruleForm.ManinType,'1')" style="width:100%;" v-model="ruleForm.ManinType" :placeholder="$t('placeholder_select')">
                <el-option v-for="item in typeData" :key="item.vulue" :label="item.label" :value="item.vulue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="130px" :label="$t('select_list')" prop="classify">
              <el-select style="width:100%;" v-model="ruleForm.classify" :no-data-text="$t('first_select_type')" :placeholder="$t('placeholder_select')">
                <el-option v-for="item in classifyData" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label-width="130px" :label="$t('mark_logo')">
              <uploader :backData="ruleForm.markImg" id="mmark1" :mixLength='1' folder="mmark"></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="findType = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t("submit")}}</el-button>
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
      seek: "", // 搜索关键字
      tableData: [], // 数据
      findType: false, //类型选择弹窗
      key: "",
      page: 1,
      count: 100,
      judgeCondition: null, // 存储编辑数据ID
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      ruleForm: {
        markName: "",
        markName1: "",
        markImg: [],
        ManinType: "",
        classify: ""
      },
      typeData: [
        {
          vulue: "1",
          label: this.$t("category")
        },
        {
          vulue: "2",
          label: this.$t("custom_category")
        },
        {
          vulue: "3",
          label: this.$t("brand")
        },
        {
          vulue: "4",
          label: this.$t("house_type")
        },
        {
          vulue: "5",
          label: this.$t("store")
        },
        {
          vulue: "6",
          label: this.$t("furniture_classification")
        }
      ],
      classifyData: [],
      rules: {
        markName: [
          {
            required: true,
            message: this.$t("verificate_name"),
            trigger: "blur"
          }
        ],
        classify: [
          {
            required: true,
            message: this.$t("verificate_list"),
            trigger: "blur"
          }
        ],
        ManinType: [
          {
            required: true,
            message: this.$t("verificate_type"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.postListmark();
    this.langType = this.$getLangType();
  },
  computed: {
    judgeDataLen() {
      if (this.tableData.length == 5) {
        return true;
      }
    }
  },
  methods: {
    clearValidate() {
      this.$refs.ruleForm.clearValidate();
    },
    distinguishApi(val, info = null) {
      this.classifyData = [];
      if (info) {
        this.ruleForm.classify = "";
      }
      let type = val;
      let api, name;
      switch (type) {
        case "1": // 类目
          api = this.$api.queryGoodsSpaceList;
          name = "spaceName";
          break;
        case "2": // 自定义分类
          api = this.$api.queryGoodsCustomGategoryList;
          name = "categoryName";
          break;
        case "3": // 品牌
          api = this.$api.queryBrandGroup;
          name = "groupName";
          break;
        case "4": // 户型
          api = null;
          name = "spaceName";
          break;
        case "5": // 门店
          api = this.$api.queryRetailerList;
          name = "retailerName";
          break;
        case "6": // 家具分类
          api = this.$api.queryGoodsGategoryList;
          name = "categoryName";
          break;
      }
      this.getclassify(api, name);
    },
    getclassify(api, vlaName) {
      if (api) {
        this.$Get(api, { pageNo: 1, pageSize: 10000 }).then(res => {
          if (res.code == 0) {
            let data = res.datas.lists.map(item => {
              let obj = {
                label: item[vlaName],
                id: item.id
              };
              return obj;
            });
            this.classifyData = data;
            console.log(this.classifyData);
            if (vlaName == "retailerName") {
              this.classifyData.push({
                label: this.$t("all"),
                id: -1
              });
            }
          }
        });
      } else {
        this.classifyData.push({
          label: this.$t("all"),
          id: -1
        });
      }
    },
    //置顶主标
    toTop(row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_to_top"), this.$t("to_top"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.setTopHomeMainmark, {
          mainmarkId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("operate_success_title")
            });
            this.postListmark();
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("operate_fail_title")
            });
            return false;
          }
        });
      });
    },
    submitForm(formName) {
      // 验证表单
      let seft = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (seft.ruleForm.markImg.length === 0) {
            seft.$notify.error({
              title: "fail",
              message: this.$t("verificate_mark_logo")
            });
          } else {
            let ruleFormData = {
              name: seft.ruleForm.markName,
              nameEn: seft.ruleForm.markName1,
              type: seft.ruleForm.ManinType,
              parentValue: seft.ruleForm.classify,
              logo: seft.ruleForm.markImg[0].url
              // childValue: "1"
            };
            if (seft.judgeCondition === null) {
              seft.redactMark(ruleFormData, 1);
            } else {
              ruleFormData.id = seft.judgeCondition;
              seft.redactMark(ruleFormData, 0);
            }
          }
        } else {
          return false;
        }
      });
    },
    redactMark(Data, type = 0) {
      // 上传或编辑接口
      let seft = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      seft.$Post(this.$api.saveHomeMainmark, { ...Data }).then(res => {
        if (res.code == 0) {
          let newUploadImg = seft.$changeUploadImg(seft.ruleForm.markImg); //获取提交的图片数组
          seft.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          seft.$notify.success({
            title: seft.$t("alert_success_title"),
            message: message
          });
          seft.findType = false;
          seft.postListmark();
        } else {
          seft.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    postListmark() {
      // 拉取主标列表
      this.$Post(this.$api.queryHomeMainmark, {
        pageNo: this.page,
        pageSize: this.count,
        name: this.key
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
        }
      });
    },
    alterMark(row) {
      // 编辑
      this.distinguishApi(row.type.toString());
      this.ruleForm = {
        markName: row.name,
        markName1: row.nameEn,
        markImg: [{ src: this.hostUrl + row.logo, url: row.logo }],
        ManinType: row.type.toString(),
        classify: row.parentValue
      };
      this.judgeCondition = row.id;
      this.findType = true;
    },
    addMark() {
      // 增加
      this.ruleForm = {
        markName: "",
        markName1: "",
        markImg: [],
        ManinType: "",
        classify: ""
      };
      this.findType = true;
      this.judgeCondition = null;
    },
    deleteMark(index, row) {
      // 删除
      let { id } = row;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Get(this.$api.deleteHomeMainmark, {
          id: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            this.postListmark();
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
            return false;
          }
        });
      });
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>

<style lang="less" >
.mainLcon_conter_input {
  margin-top: 15px;
  background: #fff;
  padding: 10px;
  .add_find_btn {
    text-align: center;
    min-width: 550px;
  }
}
.mainLcon_tab {
  margin-top: 15px;
  .cell {
    height: 40px;
    line-height: 40px;
    img {
      // width: 60px;;
      height: 100%;
    }
  }
  .find_list_img {
    width: 40px;
    height: 40px;
  }
}
.optFor_subject {
  .el-dialog__body {
    padding: 20px;
    .optFor_subject_btn {
      text-align: center;
    }
  }
}
</style>