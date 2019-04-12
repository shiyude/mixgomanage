<template>
  <div class="navSet">
    <h1 class="hint_site">
      <!-- 当前位置：用户管理 > 导航设置 -->
      {{$t('current_position')}}： {{$t('user_manage')}} > {{$t('nav_manage')}}
    </h1>
    <div class="nav_add">
      <el-button type="primary" icon="el-icon-circle-plus" @click="addNav(1)">{{$t('add_first_nav')}}</el-button>
    </div>
    <div class="nav_content">
      <el-tree :data="navData" node-key="id" :expand-on-click-node="false" :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span style="margin:0 40px;">
            <!-- 一级 二级-->
            <template v-if="(node.parent.parent == null)||(node.parent.parent&&node.parent.parent.parent == null)">
              <el-button size="mini" @click="addNav(1,data)">
                {{$t('add')}}
              </el-button>
            </template>
            <el-button type="primary" size="mini" @click="addNav(2,data)">
              {{$t('edit')}}
            </el-button>
            <el-button type="danger" size="mini" @click="remove(data)">
              {{$t('delete')}}
            </el-button>
          </span>
        </span>
      </el-tree>
      </el-tree>
    </div>
    <!-- 添加菜单 -->
    <el-dialog class="optFor_subject" :title="$t('set_nav')" :visible.sync="isNavShow" center width="700px" :before-close="closeDialog">
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item :label="$t('name1')" label-width="140px" prop="name1" :rules="{
            required: true,
            message: $t('verificate_nav_name1'),
            trigger: 'blur'
          }">
              <el-input v-model.trim="ruleForm.name1" :placeholder="$t('verificate_nav_name1')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="$t('name2')" label-width="140px" prop="name2" :rules="{
            required: true,
            message: $t('verificate_nav_name2'),
            trigger: 'blur'
          }">
              <el-input v-model.trim="ruleForm.name2" :placeholder="$t('verificate_nav_name2')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item :label="$t('operation')" label-width="140px" prop="link">
              <el-input v-model.trim="ruleForm.link" :placeholder="$t('verificate_url')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="$t('nav_order')" label-width="140px" prop="order">
              <el-input v-model.trim="ruleForm.order" :placeholder="$t('is_num')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label-width="140px" :label="$t('nav_logo')">
              <uploader :backData="ruleForm.icon" id="mmark1" :mixLength='1' folder="logo"></uploader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t('cancel')}}</el-button>
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
      navData: [],
      isNavShow: false,
      singNavData: null,
      alertType: null,
      hostUrl: "",
      ruleForm: {
        name1: "",
        link: "",
        name2: "",
        icon: [],
        order: ""
      },
      defaultProps: {
        children: "childMenus",
        label: "menuName"
      },
      rules: {
        link: [
          {
            required: true,
            message: this.$t("verificate_url1"),
            trigger: "blur"
          }
        ],
        order: [
          {
            required: true,
            message: this.$t("verificate_nav_order"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getNavLists()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 验证表单
        if (valid) {
          this.saveNav();
        } else {
          return false;
        }
      });
    },
    remove(data) {
      let { id } = data;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteMenu, {
          menuId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            this.getNavLists();
          } else {
            this.$notify.error({
              title: this.$t("alert_fail_title"),
              message: this.$t("alert_fail_delete_title")
            });
            return false;
          }
        });
      });
    },
    addNav(type, data = null) {
      this.isNavShow = true;
      this.singNavData = data;
      this.alertType = type;
      if (type == 2) {
        this.ruleForm = {
          name1: this.singNavData.menuNameCn,
          name2: this.singNavData.menuNameEn ,
          link: this.singNavData.link,
          order: this.singNavData.showIndex,
          icon: this.singNavData.icon
            ? [
                {
                  src: this.hostUrl + this.singNavData.icon,
                  url: this.singNavData.icon
                }
              ]
            : []
        };
      }
    },
    //dialog框消失时清空表单
    closeDialog(done) {
      this.resetForm();
    },
    // 重置表单
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.isNavShow = false;
      this.ruleForm = {
        name1: "",
        name2: "",
        link: "",
        icon: [],
        order: ""
      };
    },
    getNavLists() {
      this.$Geting(this.$api.navList, {}).then(res => {
        if (res.code == 0) {
          this.changeNavList(res.datas.lists);
          this.hostUrl = res.datas.url;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.errcode
          });
          return false;
        }
      });
    },
    changeNavList(data) {
      this.navData = [...data];
    },
    saveNav() {
      let axiosParamData = {
        menuName: this.ruleForm.name1,
        menuNameEn:this.ruleForm.name2,
        link: this.ruleForm.link,
        icon: this.ruleForm.icon[0] ? this.ruleForm.icon[0].url : "",
        showIndex: this.ruleForm.order
      };
      if (this.alertType == 1) {
        //添加
        if (this.singNavData == null) {
          //添加一级菜单
          axiosParamData.parentId = 0;
        } else {
          axiosParamData.parentId = this.singNavData.id;
        }
      } else if (this.alertType == 2) {
        //编辑
        axiosParamData.parentId = this.singNavData.parentId;
        axiosParamData.menuId = this.singNavData.id;
      }
      this.$Posting(this.$api.saveMenu, axiosParamData).then(res => {
        if (res.code == 0) {
          let newUploadImg = this.$changeUploadImg(this.ruleForm.icon); //获取提交的图片数组
          this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          this.resetForm();
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("save_success")
          });
          this.getNavLists();
        } else {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: res.errcode
          });
          return false;
        }
      });
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>
<style lang='less'>
.navSet {
  .nav_add {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
  }
  .nav_content {
    margin-top: 15px;
    padding: 50px;
    background-color: #fff;
    min-height: 100px;
    .el-button {
      padding: 5px 10px !important;
    }
  }
}
</style>

