  <template>
  <div class='house_type_section'>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="1">等待审核</el-menu-item>
  <el-menu-item index="2">审核未通过</el-menu-item>
</el-menu>
   <div class='list_search_section'>
<el-form :inline="true"  class="demo-form-inline">
  <el-form-item label="关键字">
    <el-input  placeholder="楼盘名/开发商等"></el-input>
  </el-form-item>
  <el-form-item label="区域" >
    <el-select  placeholder="按区域" value=''>
      <el-option label="区域1" value="账号1"></el-option>
      <el-option label="区域2" value="账号2"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label="开发商">
    <el-select  placeholder="按开发商名称"  value=''>
      <el-option label="开发商1" value="系列1"></el-option>
      <el-option label="开发商2" value="系列2"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label="楼盘">
    <el-select  placeholder="按楼盘名称"  value=''>
      <el-option label="楼盘1" value="空间1"></el-option>
      <el-option label="楼盘2" value="空间2"></el-option>
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
   <div class='audite_table'>
        <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="产品ID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="id"
      label="名称"
      width="100">
    </el-table-column>
    <el-table-column
      prop="id"
      label="户型"
      width="180">
    </el-table-column>
    <el-table-column
      prop="id"
      label="建筑面积"
      width="100">
    </el-table-column>
    <el-table-column
      prop="id"
      label="区域"
      width="120">
    </el-table-column>
    <el-table-column
      prop="id"
      label="开发商"
      width="120">
    </el-table-column>
    <el-table-column
      prop="id"
      label="楼盘"
      width="120">
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
      label="审核消息"
      width="180">
    </el-table-column>
    <el-table-column label="审核">
       <template slot-scope="scope">
        <el-row v-if="activeIndex == '1'">
          <el-button
            size="mini"
            type="primary"
          >审核</el-button>
        </el-row>
        <el-row v-else>
          <el-button 
           size="mini"
          >编辑</el-button>
          <el-button 
            size="mini" 
            type="primary"
          >发布</el-button>
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
    };
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
</style>
