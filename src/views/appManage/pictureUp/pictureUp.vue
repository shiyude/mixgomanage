<template>
  <div class="pictureUp">
    <div class="pictureUp_nav">
      <h1 class="hint_site">{{$t('current_position')}}： {{$t('app_manage')}} > {{$t('flashview')}} > {{$t('flashview')}}</h1>
      <div class="pictureUp_head clearfix">
        <el-button @click="addData" type="primary" icon="el-icon-circle-plus">{{$t('Add_images')}}</el-button>
      </div>
    </div>
    <div class="manufacturers_tab">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="ID" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('mark_logo')">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.logo)">
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="$t('Add_images')" :visible.sync="dialogVisible" :before-close="closeDialog" width="600px" :show-close="true" :close-on-click-modal="false" center>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="190px">
        <el-form-item prop="logo" :rules="{
              type:'array',required: true, message: $t('Please_upload_pictures'), trigger: 'blur'
             }">
          <span slot="label" v-if="companyId == 32">{{$t('By_the_picture')}}<br/>(375*755)</span>
          <span slot="label" v-else>{{$t('By_the_picture')}}</span>
          <uploader :maxSize="1500" :backData="ruleForm.logo" :id="'120'" :mixLength="1" :folder="'logo'"></uploader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
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
      tableData: [],
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      ruleForm: {
        logo: []
      },
      rules: {},
      selectData: null,
      dialogVisible: false,
      companyId:
        JSON.parse(window.sessionStorage.getItem("userInfo") || "{}")
          .companyId || ""
    };
  },
  mounted() {
    this.queryHomeLogo();
  },
  methods: {
    queryHomeLogo() {
      this.$Get(this.$api.queryHomeLogo, { companyId: this.companyId }).then(
        res => {
          if (res.code == 0) {
            this.tableData = res.datas;
          }
        }
      );
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.ruleForm = {
        logo: [
          {
            src: this.hostUrl + row.logo,
            url: row.logo
          }
        ]
      };
      this.selectData = row;
    },
    handleDelete(index, row) {
      this.$Get(this.$api.delHomeLogo, {
        companyId: this.companyId,
        id: row.id
      }).then(res => {
        if (res.code == 0) {
          this.queryHomeLogo();
          this.$notify.success({
            title: this.$t("alert_success_title"),
            message: this.$t("alert_success_delete_title")
          });
        } else {
          this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: this.$t("alert_fail_delete_title")
          });
        }
      });
    },
    addData() {
      this.dialogVisible = true;
      this.selectData = null;
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
      this.ruleForm = {
        logo: []
      };
    },
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let dataObj = {
            logo: _this.ruleForm.logo[0].url,
            companyId: _this.companyId
          };
          if (this.selectData === null) {
            this.submitData(dataObj, 0);
          } else {
            dataObj.id = this.selectData.id;
            this.submitData(dataObj, 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      this.$Posting(this.$api.editHomeLogo, jsonData).then(res => {
        if (res.code == 0) {
          let newUploadImg = _this.$changeUploadImg(_this.ruleForm.logo); //获取提交的图片数组
          _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          _this.closeDialog();
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: message
          });
          _this.queryHomeLogo();
        } else {
          _this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: res.msg
          });
        }
      });
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>
<style lang="less">
.pictureUp {
  .pictureUp_nav {
    margin-bottom: 15px;
  }
  .pictureUp_head {
    margin: 15px 0;
    background-color: #fff;
    padding: 10px;
  }
}
</style>

