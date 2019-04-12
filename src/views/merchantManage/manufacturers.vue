<template lang="html">
  <div class="manufacturers">
    <h1 class="hint_site">
      当前位置：商家管理  >  厂家管理
    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input
          style="width:300px;"
          placeholder="输入关键字进行筛选"
          prefix-icon="el-icon-search"
          v-model="seek">
        </el-input>
        <el-button @click="searchData">搜索</el-button>
      </div>
      <div class="right">
        <el-button @click="addData"  type="primary" icon="el-icon-circle-plus">添加厂家</el-button>
      </div>
    </div>
     <!-- 表格 -->
    <div class="manufacturers_tab">
       <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column label="id" width="80">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区/国家">
          <template slot-scope="scope">
            <span>{{ scope.row.country }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            <span  :title="scope.row.address">{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="网址">
          <template slot-scope="scope">
            <span>{{ scope.row.website }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业介绍">
          <template slot-scope="scope">
            <span  :title="scope.row.desc">{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业LOGO" width="100px">
          <template slot-scope="scope">
            <img :src="scope.row.image"/>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging" v-show="tableData.length">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close = "closeDialog"
      width="50%"
      center>
      <el-form label-position="left"  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="name">
              <el-input v-model.trim="ruleForm.name" placeholder="企业名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="country">
              <el-select style="width:100%;" v-model="ruleForm.country" placeholder="地区国家">
                <el-option label="china" value="china"></el-option>
                <el-option label="singapore" value="singapore"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="address">
              <el-input v-model.trim="ruleForm.address" placeholder="地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="" prop="phone">
                <el-input v-model.trim="ruleForm.phone" placeholder="电话"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="website">
              <el-input v-model.trim="ruleForm.website" placeholder="网址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="email">
              <el-input v-model.trim="ruleForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
             <h1>企业LOGO</h1>
            <el-form-item label=""
             prop="UpImgData"
             :rules="{
              type:'array',required: true, message: '请上传企业LOGO', trigger: 'blur'
             }"
            >
             <uploader 
              :backData="ruleForm.UpImgData" 
              :id="'logo0'" 
              :mixLength='1'
              :folder="'vendor'"
              ></uploader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <h1>企业介绍</h1>
            <el-form-item label="" prop="desc">
             <el-input type="textarea" v-model.trim="ruleForm.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploader from "@/components/uploader.vue";
export default {
  data() {
    return {
      type: 0,
      //厂家管理的接口type参数
      tableData: [],
      dialogVisible: false,
      ruleForm: {
        name: "",
        country: "",
        address: "",
        phone: "",
        website: "",
        email: "",
        desc: "",
        UpImgData: []
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "blur"
          }
        ],
        country: [
          {
            required: true,
            message: "请选择地区国家",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur"
          }
        ],
        website: [
          {
            required: true,
            message: "请输入网址",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: "请输入企业介绍",
            trigger: "blur"
          }
        ]
      },
      seek: "",
      //关键字
      searchStr: "",
      //点击搜索生成的关键字
      total: 0,
      //数据总条数
      currentPage: 1,
      //当前页数
      pageSize: 10,
      //一页显示的条数
      dialogTitle: "",
      //弹框的title
      id: null //添加时id置空，编辑时给id赋值
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    //编辑时的显示情况
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑厂家";
      this.renderForm(row);
      this.id = row.id;
    },
    //添加时的显示情况
    addData() {
      this.dialogVisible = true;
      this.dialogTitle = "添加厂家";
      this.id = null;
    },
    //删除数据的方法
    handleDelete(index, row) {
      let { id } = row;
      let _this = this;
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.delvendor, {
          id: id,
          type: _this.type
        }).then(res => {
          if (res.status == 0) {
            this.$notify.success({
              title: "成功",
              message: "删除成功"
            });
            // 判断数据是否是最后一页的最后一条
            if (
              this.tableData.length == 1 &&
              this.currentPage == Math.ceil(this.total / this.pageSize)
            ) {
              this.getListData(this.searchStr, this.currentPage - 1);
            } else {
              this.getListData(this.searchStr, this.currentPage);
            }
          } else {
            this.$notify.error({
              title: "失败",
              message: "删除失败"
            });
            return false;
          }
        });
      });

      console.log(index, row);
    },
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getListData(this.searchStr, val);
    },
    //获取列表数据
    getListData(key = "", page = 1, type = this.type) {
      this.$Posting(this.$api.listvendor, {
        key: key,
        page: page,
        type: type,
        count: this.pageSize
      }).then(res => {
        if (res.status == 0) {
          this.tableData = res.lists;
          this.total = res.count;
        } else {
          this.$notify.error({
            title: "错误",
            message: res.errcode
          });
          return false;
        }
      });
    },
    //通过关键字搜索
    searchData() {
      this.currentPage = 1;
      this.getListData(this.seek);
      this.searchStr = this.seek;
    },
    //提交数据
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let dataObj = {
            name: this.ruleForm.name,
            country: this.ruleForm.country,
            address: this.ruleForm.address,
            phone: this.ruleForm.phone,
            website: this.ruleForm.website,
            email: this.ruleForm.email,
            desc: this.ruleForm.desc,
            photo: this.ruleForm.UpImgData[0].url,
            type: this.type
          };
          if (this.id === null) {
            this.submitData(dataObj, 0);
          } else {
            dataObj.id = this.id;
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
      this.ruleForm.UpImgData = [];
      ({
        name: this.ruleForm.name,
        country: this.ruleForm.country,
        address: this.ruleForm.address,
        phone: this.ruleForm.phone,
        website: this.ruleForm.website,
        email: this.ruleForm.email,
        desc: this.ruleForm.desc
      } = {
        ...data
      });
      this.ruleForm.UpImgData.push({
        src: data.image,
        url: data.image_url
      });
    },
    // 重置表单
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
      this.ruleForm = {
        name: "",
        country: "",
        address: "",
        phone: "",
        website: "",
        email: "",
        desc: "",
        UpImgData: []
      };
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type ? "编辑完成！" : "添加成功！";
      let url = type ? this.$api.editvendor : this.$api.addvendor;
      this.$Posting(url, {
        data: JSON.stringify(jsonData)
      }).then(res => {
        if (res.status == 0) {
          let newUploadImg = _this.$changeUploadImg(_this.ruleForm.UpImgData); //获取提交的图片数组
          _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
          _this.resetForm();
          _this.$notify.success({
            title: "成功",
            message: message
          });
          _this.getListData(this.searchStr, this.currentPage);
        } else {
          _this.$notify.error({
            title: "错误",
            message: res.msg
          });
        }
      });
    }
  },
  components: {
    uploader
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>

<style lang="less"  scoped>
.manufacturers {
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
