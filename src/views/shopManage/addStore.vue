<template lang="html">
  <div  class="addStore">
    <h1 class="hint_site">
      当前位置：门店管理  >  门店列表 > 添加门店
    </h1>
    <div class="addStore_body">
      <el-form label-position="left" 
      :model="addStoreForm" 
      :rules="rules" 
      ref="addStoreForm" label-width="100px" class="demo-ruleForm addStore_body_form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店名称" prop="name">
              <el-input v-model.trim="addStoreForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店地址" prop="site">
              <el-input v-model.trim="addStoreForm.site"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店电话" prop="phone">
              <el-input v-model.trim="addStoreForm.phone"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="代理商" prop="agent">
              <el-select
                v-model="addStoreForm.agent"
                multiple
                collapse-tags
                style=" width:100%"
                placeholder="请选择代理商">
                <el-option
                  v-for="(item,index) in addStoreForm.agentData"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item  label="门店主图" >
              <uploader 
                :backData="addStoreForm.storeImg" 
                :id="'storeImg0'" 
                :mixLength='1'></uploader>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item    label="门店商品" >
              <el-button @click="selectGoods()" type="primary">选择要关联的商品</el-button>
              <el-dialog
                title="添加商品"
                :visible.sync="GoodsListPop"
                width="70%"
                center>
                <listGoods dataType="commodity" ref="subclass"></listGoods>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="GoodsListPop = false">取 消</el-button>
                  <el-button type="primary" @click="receiveSon">确 定</el-button>
                </span>
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 关联商品列表 -->
      <div class="addStore_tab">
        <el-table
          :data="pagingArr"
          border
          style="width: 100%">
          <el-table-column
            label="商品编号"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品主图">
            <template slot-scope="scope">
              <img :src="scope.row.image_urls[0]" alt="">
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品品牌">
          <template slot-scope="scope">{{ scope.row.brand_name }}</template>
        </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block tab_paging">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="contn"
            layout="total,prev, pager, next, jumper"
            :total="AllNum">
          </el-pagination>
        </div>
      </div>

      <!-- 确定提交 -->

      <div class="addStore_btn">
        <el-button type="primary" @click="submitForm('addStoreForm')">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import uploader from '@/components/uploader.vue'
import listGoods from '@/components/listOfGoods.vue'
export default {
  components: {
    uploader,
    listGoods
  },
  data() {
    return {
      addStoreForm: {
        name: '',
        site: '',
        phone: '',
        agent: '',
        storeImg: [],
        tableData: [],
        agentData: [] // 代理商数据
      },
      rules: {
        name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
        site: [{ required: true, message: '请输入门店地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入门店电话', trigger: 'blur' }],
        agent: [{ required: true, message: '请选择代理商', trigger: 'blur' }],   
      },
      GoodsListPop: false,
      page: 1,
      contn: 10,
      AllNum: 0,
      pagingData: [], // 分页容器
      pagingArr: [] // 当前页数据
    };
  },
  mounted() {
    if (this.$refs.subclass) {
      this.$refs.subclass.PostGoodData()
    }
    this.postAgentData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    receiveSon() { // 接收子页面数据

      let SonData = this.$refs.subclass.goodsDataActive
      let data = []
      for (let i = 0 ; i < SonData.length; i++) {
        for (let j = 0; j < SonData[i].length; j++) {
          data.push(SonData[i][j])
        }
      }
      let resultarr = [...new Set(data)] // 去掉重复的
      this.AllNum = resultarr.length
      this.addStoreForm.tableData = this.$pagingFn(resultarr,10)
      this.pagingArr = this.addStoreForm.tableData[0]
      this.GoodsListPop = false

      console.log('转换过的',this.addStoreForm.tableData )
    },
    resetForm() {
    },
    selectGoods() {
      this.GoodsListPop = true
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleCurrentChange(val) { // 商品数据分页显示
      this.page = val
      let num = val - 1
      this.pagingArr = this.addStoreForm.tableData[num]
    },
    postAgentData() { // 获取代理商数据
      this.$Post(this.$api.listseller, { page: 1, count: 10000, key: '' }).then((res) => {
        if (res.status === 0) {
          this.addStoreForm.agentData = res.lists
          console.log(res)
        } else {
          this.$notify.error({
            title: '错误',
            message: res.msg
          })
        }
      })
    }
  }
};
</script>

<style lang="less" >
  .addStore_body{
    margin-top: 15px;
    background-color: #fff;
    padding: 15px;
    .addStore_body_form{
      width: 60%;
      min-width: 750px;
    }
    .addStore_tab{
      border: 1px solid #ddd;
    }
    .addStore_btn{
      margin-top: 15px;
      text-align: center;
    }
  }
</style>
