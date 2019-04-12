<template>
  <div class="agent_list">
    <h1 class="hint_site">
      <!-- 当前位置：商家管理 > 代理商 > 代理商列表 -->
      {{$t('current_position')}}： {{$t('business_manage')}} > {{$t('agent')}} > {{$t('agent_list')}}
    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input style="width:200px;" :placeholder="$t('search_agent')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addData" type="primary" icon="el-icon-circle-plus">{{$t('add_agent')}}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="manufacturers_tab">
      <el-table :data="tableData" border>
        <el-table-column :label="$t('agent_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.retailerName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_phone')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_email')">
          <template slot-scope="scope">
            <span>{{ scope.row.contactEmail }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user_add')" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="line_clamp">{{ scope.row.contactAddr }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="470">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="getShop(scope.row)">{{$t("see_relate_store")}}</el-button>
            <el-button size="mini" @click="manageBrand(scope.row)">{{$t("see_ralate_brand")}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging" v-show="tableData.length">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="$t('set_agent')" :visible.sync="dialogVisible" :before-close="closeDialog" width="500px" center>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
        <el-form-item :label="$t('agent_name')" prop="retailerName">
          <el-input v-model.trim="ruleForm.retailerName" :placeholder="$t('agent_name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user_name')" prop="contactName">
          <el-input v-model.trim="ruleForm.contactName" :placeholder="$t('user_name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user_phone')" prop="contactPhone">
          <el-input v-model.trim="ruleForm.contactPhone" :placeholder="$t('user_phone')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user_email')" prop="contactEmail">
          <el-input v-model.trim="ruleForm.contactEmail" :placeholder="$t('user_email')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user_add')" prop="contactAddr">
          <el-input v-model.trim="ruleForm.contactAddr" :placeholder="$t('user_add')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t("submit")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //电话号码验证
    let phoneValidator = (rule, value, callback) => {
      let regPhone = /^1[34578]\d{9}$/;
      let regFixPhone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
      if (value === "") {
        callback(new Error(this.$t("verificate_user_phone")));
      } else {
        if (!regPhone.test(value) && !regFixPhone.test(value)) {
          callback(new Error(this.$t("verificate_user_phone1")));
        } else {
          callback();
        }
      }
    };
    //邮箱验证
    let emailValidator = (rule, value, callback) => {
      let regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (value === "") {
        callback(new Error(this.$t("verificate_user_email")));
      } else {
        if (!regEmail.test(value)) {
          callback(new Error(this.$t("verificate_user_email1")));
        } else {
          callback();
        }
      }
    };
    return {
      tableData: [],
      dialogVisible: false,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      ruleForm: {
        retailerName: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        contactAddr: ""
      },
      seek: "", //关键字
      searchStr: "", //点击搜索生成的关键字
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      selectData: null, //添加时selectData置空，编辑时给selectData赋值
      rules: {
        retailerName: [
          {
            required: true,
            message: this.$t("verificate_agent_name"),
            trigger: "blur"
          }
        ],
        contactName: [
          {
            required: true,
            message: this.$t("verificate_user_name"),
            trigger: "blur"
          }
        ],
        contactAddr: [
          {
            required: true,
            message: this.$t("verificate_user_add"),
            trigger: "blur"
          }
        ],
        contactPhone: [
          {
            validator: phoneValidator,
            required: true,
            trigger: ["blur"]
          }
        ],
        contactEmail: [
          {
            validator: emailValidator,
            required: true,
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    //编辑的方法
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.renderForm(row);
      this.selectData = row;
    },
    //添加的方法
    addData() {
      this.dialogVisible = true;
      this.selectData = null;
    },
    //查看门店
    getShop(row) {
      let { id } = row;
      this.$router.push({
        path: "agentRelateShop.html",
        query: {
          id: id
        }
      });
    },
    //管理品牌
    manageBrand(row) {
      let { id } = row;
      this.$router.push({
        path: "agentRelateBrand.html",
        query: {
          id: id
        }
      });
    },
    //删除数据的方法
    handleDelete(index, row) {
      let { id } = row;
      let _this = this;
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteRetailer, {
          retailerId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert_success_title"),
              message: this.$t("alert_success_delete_title")
            });
            // 判断数据是否是最后一页的最后一条
            if (this.tableData.length == 1 && this.currentPage !== 1) {
              this.getListData(this.searchStr, this.currentPage - 1);
            } else {
              this.getListData(this.searchStr, this.currentPage);
            }
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
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getListData(this.searchStr, val);
    },
    //获取列表数据
    getListData(key = "", page = 1) {
      this.$Posting(this.$api.queryRetailerList, {
        retailerName: key,
        pageNo: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists;
          this.total = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.errcode
          });
          return false;
        }
      });
    },
    //通过关键字搜索
    searchData() {
      this.currentPage = 1; //page置为1
      this.getListData(this.seek);
      this.searchStr = this.seek;
    },
    //提交数据
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let dataObj = {
            retailerName: _this.ruleForm.retailerName,
            contactName: _this.ruleForm.contactName,
            contactPhone: _this.ruleForm.contactPhone,
            contactEmail: _this.ruleForm.contactEmail,
            contactAddr: _this.ruleForm.contactAddr
          };
          if (this.selectData === null) {
            this.submitData(dataObj, 0);
          } else {
            dataObj.retailerId = this.selectData.id;
            this.submitData(dataObj, 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //dialog框消失时清空表单
    closeDialog() {
      this.resetForm();
    },
    //表单渲染的方法
    renderForm(data) {
      this.ruleForm = {
        retailerName: data.retailerName,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactAddr: data.contactAddr
      };
    },
    // 重置表单
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
      this.ruleForm = {
        retailerName: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        contactAddr: ""
      };
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      this.$Posting(this.$api.saveRetailer, jsonData).then(res => {
        if (res.code == 0) {
          _this.resetForm();
          _this.$notify.success({
            title: this.$t("alert_success_title"),
            message: message
          });
          _this.getListData(this.searchStr, this.currentPage);
        } else {
          _this.$notify.error({
            title: this.$t("alert_fail_title"),
            message: res.msg
          });
        }
      });
    }
  }
};
</script>

<style lang="less"  scoped>
.agent_list {
  .manufacturers_head {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    .right {
      width: 40%;
      text-align: left;
    }
  }
  .manufacturers_tab {
    margin-top: 15px;
  }
}
</style>
