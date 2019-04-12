<template>
  <div class="userList">
    <h1 class="hint_site">
      <!-- 当前位置：用户管理 > 用户列表 -->
      {{$t('current_position')}}： {{$t('user_manage')}} > {{$t('user_list')}}
    </h1>
    <div class="appFind_conter">
      <div class="appFind_conter_input">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input :placeholder="$t('search_phone')" prefix-icon="el-icon-search" v-model.trim="seek">
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
          </el-col>
          <el-col :span="12" class="add_find_btn">
            <el-button type="primary" @click="goUserCreation" icon="el-icon-circle-plus">{{$t('add_user')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="find_tab">
      <el-table :data="userList" border style="width: 100%">
        <el-table-column :label="$t('id')" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('users_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('phone')">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('email')">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" @click="redactUser(scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="jurisdictionUser(scope.row)">{{$t('user_rights')}}</el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="userDialogText" :visible.sync="userInfoDialog" center width="900px">
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item :label="$t('select_company')" label-width="130px" prop="editCompanyId">
              <el-select style="width:100%" v-model="ruleForm.editCompanyId" :placeholder="$t('select')">
                <el-option v-for="item in companysData" :key="item.id" :label="item.companyName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item :label="$t('users_name')" label-width="130px" prop="userName">
              <el-input v-model.trim="ruleForm.userName" :placeholder="$t('name')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('phone')" label-width="130px" prop="phone">
              <el-input v-model.trim="ruleForm.phone" :placeholder="$t('phone')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item :label="$t('email')" label-width="130px" prop="email">
              <el-input v-model.trim="ruleForm.email" :placeholder="$t('email')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('real_name')" label-width="130px" prop="realname">
              <el-input v-model.trim="ruleForm.realname" :placeholder="$t('real_name')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item :label="$t('sex')" label-width="130px" prop="sex">
              <el-select style="width:100%" v-model="ruleForm.sex" :placeholder="$t('sex')">
                <el-option :label="$t('man')" value="0"></el-option>
                <el-option :label="$t('woman')" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('password')" label-width="130px">
              <el-input v-model.trim="ruleForm.userPass" :placeholder="$t('new_building_required')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('submit')}}</el-button>
      </span>
    </el-dialog>
    <!-- 权限管理 -->
    <el-dialog :title="$t('manage_rights')" center :visible.sync="rightVisible" width="30%">
      <span class="tree_head">
        {{$t('rights_prompt')}}
      </span>
      <el-tree check-strictly :data="rightNavList" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="getCheckedKeys">{{$t('submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      seek: "", // 搜索关键字
      userList: [], // 用户列表数据
      userInfoDialog: false, //用户弹窗
      rightVisible: false, // 权限管理弹窗
      userDialogText: "", // 用户弹窗抬头
      rightNavList: [], // 权限导航数据
      editUserId: "", // 编辑用户的ID
      ruleForm: {
        userName: "", // 名称
        phone: "", // 手机
        sex: "", // 性别
        email: "", // 邮箱
        realname: "", // 真实姓名
        userPass: "", // 密码
        editCompanyId: "" // 定制客户ID
      },
      companysData: [], // 定制用户列表
      pageSize: 10,
      total: 0,
      currentPage: 1,
      defaultProps: {
        children: "childMenus",
        label: "menuName"
      },
      rules: {
        userName: [
          {
            required: true,
            message: this.$t("verificate_users_name"),
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t("verificate_users_phone"),
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: this.$t("verificate_sex"),
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: this.$t("verificate_users_email"),
            trigger: "blur"
          }
        ],
        realname: [
          {
            required: true,
            message: this.$t("verificate_real_name"),
            trigger: "blur"
          }
        ],
        userPass: [
          {
            required: true,
            message: this.$t("verificate_password"),
            trigger: "blur"
          }
        ],
        editCompanyId: [
          {
            required: true,
            message: this.$t("verificate_custom_company"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.gitUserList();
    this.gitQueryCompanys();
  },
  methods: {
    submitForm(formName) {
      // 提交资料
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$Post(this.$api.saveSysUser, { ...this.ruleForm }).then(res => {
            if (res.code == 0) {
              this.userInfoDialog = false;
              this.gitUserList();
              this.$notify({
                title: this.$t("alert_success_title"),
                message: this.$t("edit_success_title"),
                type: "success"
              });
            } else {
              this.$notify.error({
                title: "fail",
                message: res.msg
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    redactUser(index) {
      // 编辑
      this.ruleForm = {
        userName: index.userName,
        phone: index.phone,
        sex: index.sex.toString(),
        email: index.email,
        realname: index.realname,
        userPass: index.userPass,
        editUserId: index.id,
        editCompanyId: index.companyId
      };
      this.userInfoDialog = true;
      this.userDialogText = this.$t("edit_user");
    },
    goUserCreation() {
      // 新建
      this.ruleForm = {
        userName: "",
        phone: "",
        sex: "",
        email: "",
        realname: "",
        userPass: "",
        editCompanyId: ""
      };
      this.userInfoDialog = true;
      this.userDialogText = this.$t("add_user");
    },
    deleteUser(index) {
      // 删除
      this.$confirm(this.$t("alert_delete"), this.$t("alert_command"), {
        confirmButtonText: this.$t("submit"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          this.$Get(this.$api.deleteSysUser, { delUserId: index.id }).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("alert_success_delete_title")
                });
                this.gitUserList();
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
      //点击翻页时进行请求
      this.currentPage = val;
      this.gitUserList();
    },
    searchData() {
      //通过关键字搜索
      this.currentPage = 1;
      this.gitUserList(this.seek);
    },
    gitQueryCompanys() {
      // 查询定制客户列表
      this.$Get(this.$api.queryCompanys, {}).then(res => {
        if (res.code == 0) {
          this.companysData = res.datas;
        }
      });
    },
    gitUserList(type) {
      // 用户列表
      this.$Get(this.$api.querySysUsers, {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        phone: type
      }).then(res => {
        if (res.code == 0) {
          this.userList = res.datas.lists;
          this.total = res.datas.count;
        }
      });
    },
    jurisdictionUser(row) {
      // 权限管理
      this.rightVisible = true;
      console.log(row.id);
      this.gitNavList(row.id);
    },
    gitNavList(num) {
      // 获取导航列表
      this.editUserId = num;
      this.$Get(this.$api.loadMenuByUserId, { editUserId: num }).then(res => {
        if (res.code == 0) {
          this.rightNavList = res.datas.lists;
          let data = [];
          for (let i = 0; i < res.datas.lists.length; i++) {
            if (res.datas.lists[i].checked === 1) {
              data.push(res.datas.lists[i].id);
            }
            if (res.datas.lists[i].childMenus) {
              for (let j = 0; j < res.datas.lists[i].childMenus.length; j++) {
                if (res.datas.lists[i].childMenus[j].checked === 1) {
                  data.push(res.datas.lists[i].childMenus[j].id);
                }
                if (res.datas.lists[i].childMenus[j].childMenus) {
                  for (
                    let h = 0;
                    h < res.datas.lists[i].childMenus[j].childMenus.length;
                    h++
                  ) {
                    if (
                      res.datas.lists[i].childMenus[j].childMenus[h].checked ===
                      1
                    ) {
                      data.push(
                        res.datas.lists[i].childMenus[j].childMenus[h].id
                      );
                    }
                  }
                }
              }
            }
          }
          this.$refs.tree.setCheckedKeys(data);
        }
      });
    },
    getCheckedKeys() {
      // 编辑选中导航权限
      let ids = this.$refs.tree.getCheckedKeys().join(",");
      this.$Post(this.$api.saveUserMenu, {
        editUserId: this.editUserId,
        menuIds: ids
      }).then(res => {
        if (res.code == 0) {
          this.rightVisible = false;
          this.$notify({
            title: this.$t("alert_success_title"),
            message: this.$t("edit_success_title"),
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" >
.userList {
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
}
</style>