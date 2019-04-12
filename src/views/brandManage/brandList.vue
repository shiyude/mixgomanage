<template>
  <div class="brand_list">
    <h1 class="hint_site">
      <!-- 当前位置：品牌管理 > 品牌列表 -->
      {{$t('current_position')}}： {{$t('brand_manage')}} > {{$t('brand_list')}}
    </h1>
    <div class="manufacturers_head clearfix">
      <div class="left">
        <el-input style="width:200px;" :placeholder="$t('search_brand')" prefix-icon="el-icon-search" v-model.trim="seek">
        </el-input>
        <el-button @click="searchData">{{$t('seach_btn')}}</el-button>
      </div>
      <div class="right">
        <el-button @click="addData" type="primary" icon="el-icon-circle-plus">{{$t('add_brand')}}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="manufacturers_tab">
      <el-table :data="tableData" border>
        <el-table-column :label="$t('create_time')">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_origin')">
          <template slot-scope="scope">
            <span>{{ scope.row.origin }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_factory')">
          <template slot-scope="scope">
            <span>{{ scope.row.manufactor }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_type')">
          <template slot-scope="scope">
            <span>{{ scope.row.brandType }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('brand_desc')" show-overflow-tooltip>
          <template slot-scope="scope">
           <span class="line_clamp">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="品牌形象图" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.imgs" style="cursor:pointer" @click="$imgPreview(hostUrl+scope.row.imgs)" />
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('brand_logo')" width="100">
          <template slot-scope="scope">
            <img :src="hostUrl+scope.row.logo" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="400">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t("edit")}}</el-button>
            <el-button size="mini" @click="getBrand(scope.row)">{{$t('relate_store')}}</el-button>
            <el-button size="mini" @click="getBrandclassify(scope.row)">{{$t('brand_category')}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t("delete")}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block tab_paging" v-show="tableData.length">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" :page-sizes="[10,20,50]" layout="total,sizes,prev, pager, next, jumper" :current-page.sync="currentPage" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="$t('set_brand')" :visible.sync="dialogVisible" :before-close="closeDialog" width="50%" center>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="name">
              <el-input v-model.trim="ruleForm.name" :placeholder="$t('brand_name')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="origin">
              <el-input v-model.trim="ruleForm.origin" :placeholder="$t('brand_origin')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="factory">
              <el-input v-model.trim="ruleForm.factory" :placeholder="$t('brand_factory')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="type">
              <el-input v-model.trim="ruleForm.type" :placeholder="$t('brand_type')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <h1>{{$t('brand_logo')}}</h1>
            <el-form-item label="" prop="UpImgData" :rules="{
              type:'array',required: true, message: $t('verificate_brand_logo'), trigger: 'blur'
             }">
              <uploader :backData="ruleForm.UpImgData" :id="'logo0'" :mixLength='1' :folder="'logo'"></uploader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <h1>{{$t('brand_imgs')}}</h1>
            <el-form-item label="" prop="UpImgData1" :rules="{
              type:'array',required: true, message: $t('verificate_brand_imgs'), trigger: 'blur'
             }">
              <uploader :backData="ruleForm.UpImgData1" :id="'logo1'" :mixLength='1' :folder="'imgs'"></uploader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <h1>{{$t('brand_desc')}}</h1>
            <el-form-item label="" prop="desc">
              <el-input type="textarea" v-model.trim="ruleForm.desc" :rows='5'></el-input>
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
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      ruleForm: {
        name: "",
        origin: "",
        factory: "",
        type: "",
        desc: "",
        UpImgData: [],
        UpImgData1: []
      },
      seek: "", //关键字
      searchStr: "", //点击搜索生成的关键字
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 10, //一页显示的条数
      selectData: null, //添加时selectData置空，编辑时给selectData赋值
      rules: {
        name: [
          {
            required: true,
            message: this.$t("verificate_brand_name"),
            trigger: "blur"
          }
        ],
        origin: [
          {
            required: true,
            message: this.$t("verificate_brand_origin"),
            trigger: "blur"
          }
        ],
        factory: [
          {
            required: true,
            message: this.$t("verificate_brand_factory"),
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: this.$t("verificate_brand_type"),
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: this.$t("verificate_brand_desc"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData(this.searchStr, 1);
    },
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
    //查看品牌
    getBrand(row) {
      let { id } = row;
      this.$router.push({
        path: "brandGoods.html",
        query: {
          id: id
        }
      });
    },
    getBrandclassify(row) {
      let { id } = row;
      this.$router.push({
        path: "brandClassify.html",
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
        this.$Posting(this.$api.deleteBrand, {
          brandId: id
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

      console.log(index, row);
    },
    //点击翻页时进行请求
    handleCurrentChange(val) {
      this.getListData(this.searchStr, val);
    },
    //获取列表数据
    getListData(key = "", page = 1) {
      this.$Posting(this.$api.queryBrandList, {
        brandName: key,
        pageNo: page,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res);
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
            brandName: _this.ruleForm.name,
            origin: _this.ruleForm.origin,
            manufactor: _this.ruleForm.factory,
            brandType: _this.ruleForm.type,
            description: _this.ruleForm.desc,
            logo: _this.ruleForm.UpImgData[0].url,
            imgs: _this.ruleForm.UpImgData1[0].url
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
    //dialog框消失时清空表单
    closeDialog() {
      this.resetForm();
    },
    //表单渲染的方法
    renderForm(data) {
      this.ruleForm = {
        name: data.brandName,
        origin: data.origin,
        factory: data.manufactor,
        type: data.brandType,
        desc: data.description,
        UpImgData: [
          {
            src: this.hostUrl + data.logo,
            url: data.logo
          }
        ],
        UpImgData1: [
          {
            src: this.hostUrl + data.imgs,
            url: data.imgs
          }
        ]
      };
    },
    // 重置表单
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
      this.ruleForm = {
        name: "",
        origin: "",
        factory: "",
        type: "",
        desc: "",
        UpImgData: [],
        UpImgData1: []
      };
    },
    //添加和编辑数据后的提交操作 type=0为添加,type=1为编辑
    submitData(jsonData, type = 0) {
      let _this = this;
      let message = type
        ? this.$t("edit_finish_title")
        : this.$t("add_success_title");
      this.$Posting(this.$api.saveBrand, jsonData).then(res => {
        if (res.code == 0) {
          let newUploadImg = _this.$changeUploadImg([
            ..._this.ruleForm.UpImgData,
            ..._this.ruleForm.UpImgData1
          ]); //获取提交的图片数组
          _this.$changeSession(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
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
.brand_list {
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
