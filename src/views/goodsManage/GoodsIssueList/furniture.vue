  <template>
  <div class='furniture_section'>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="1">已上架</el-menu-item>
  <el-menu-item index="2">已下架</el-menu-item>
</el-menu>
   <div class='list_search_section'>
<el-form :inline="true"  class="demo-form-inline">
  <el-form-item label="关键字">
    <el-input  placeholder="输入产品ID或名称等"></el-input>
  </el-form-item>
  <el-form-item label="按账号过滤" >
    <el-select  placeholder="账号" value=''>
      <el-option label="账号1" value="账号1"></el-option>
      <el-option label="账号2" value="账号2"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label="按系列过滤">
    <el-select  placeholder="系列" style='width:75px' value=''>
      <el-option label="系列1" value="系列1"></el-option>
      <el-option label="系列2" value="系列2"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label="按空间过滤">
    <el-select  placeholder="空间" style='width:90px' value=''>
      <el-option label="空间1" value="空间1"></el-option>
      <el-option label="空间2" value="空间2"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label="按分类过滤">
    <el-select  placeholder="分类" style='width:90px' value=''>
      <el-option label="分类1" value="分类1"></el-option>
      <el-option label="分类2" value="分类2"></el-option>
    </el-select>
  </el-form-item>
     <el-form-item label="按品牌过滤">
    <el-select  placeholder="品牌" value=''>
      <el-option label="品牌1" value="品牌1"></el-option>
      <el-option label="品牌2" value="品牌2"></el-option>
    </el-select>
  </el-form-item>
     <el-form-item label="列表排序">
    <el-select  placeholder="排序" style='width:75px' value=''>
      <el-option label="排序1" value="排序1"></el-option>
      <el-option label="排序2" value="排序2"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item>
      总计2000个
  </el-form-item>
</el-form>
   </div>
   <!-- <div class='table_data_manage'>
        <el-checkbox>全选</el-checkbox>
         <el-button size='mini'>删除</el-button>
         <el-button size='mini'>下架</el-button>
         <el-button size='mini'>置顶</el-button>
         <el-button size='mini'>取消置顶</el-button>
         <el-button size='mini'>今日新选</el-button>
         <el-button size='mini'>特卖好物</el-button>
         <el-input placeholder="将选中的产品顺序调到ID之前" size='mini' style='display:inline-block;width:200px'></el-input>
         <el-button size='mini'>执行</el-button>
   </div> -->
   <div class='sell_table'>
        <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop='id'
      label="产品ID"
      width="180">
       <!-- <template slot-scope="scope">
        <el-checkbox>{{scope.row.id}}</el-checkbox>
      </template> -->
    </el-table-column>
    <el-table-column
      prop="id"
      label="名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="id"
      label="分类"
      width="180">
    </el-table-column>
    <el-table-column
      prop="id"
      label="品牌"
      width="180">
    </el-table-column>
    <el-table-column
      prop="id"
      label="缩略图"
      width="180">
    </el-table-column>
    <el-table-column
      prop="id"
      label="操作时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="id"
      label="关注统计"
      width="120"
      >
    </el-table-column>
    <el-table-column
      prop="id"
      label="点击统计"
      width="120">
    </el-table-column>
    <el-table-column label="编辑">
       <template slot-scope="scope">
         <el-row v-if="activeIndex == '1'">
          <el-button
            size="mini"
            type="danger"
          >下架</el-button>
        </el-row>
        <el-row v-else>
          <el-button
            size="mini"
          >编辑</el-button>
          <el-button
            size="mini"
            type="primary"
          >上架</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="open2"
          >删除</el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
   </div>
   <div class="block tab_paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="total,prev, pager, next, jumper"
          :total="400">
        </el-pagination>
    </div>
  </div>
   </template>
   <script>
export default {
  data() {
    return {
      activeIndex: "1",
      tableData: [
        {
          id: 1111
        }
      ]
    }
  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index;
    },
    handleSizeChange() {},
    handleCurrentChange() {},
     open2() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
  }
};
</script>
   <style lang='less' scoped>
.list_search_section {
  margin-top: 8px;
}
.table_data_manage {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 5px;
}
</style>