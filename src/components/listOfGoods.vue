<template>
  <div class="listOfGoods">
    <div class="listOfGoods_head">
      <div>
        关键字：
        <el-input style="width:300px;" placeholder="输入关键字" prefix-icon="el-icon-search" v-model.trim="goodsName">
        </el-input>
        <el-button @click="PostGoodData('seek')">搜索</el-button>
      </div>
    </div>
    <div v-if="dataType === 'commodity' " class="listOfGoods_tab">
      <el-table v-loading="loading" tooltip-effect="dark" ref="multipleTable" :data="pageData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ $dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column label="分类名称">
          <template slot-scope="scope">{{ scope.row.categoryName }}</template>
        </el-table-column>
        <el-table-column label="品牌名称">
          <template slot-scope="scope">{{ scope.row.brandName }}</template>
        </el-table-column>
        <el-table-column label="产品主图">
          <template slot-scope="scope">
            <img @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" 
        :page-size="counts" 
        :current-page.sync="currentPageNum"
        layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 门店 -->
    <div v-if="dataType === 'shop'" class="listOfGoods_tab">
      <el-table v-loading="loading" tooltip-effect="dark" ref="multipleTable" :data="pageData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="所属品牌">
          <template slot-scope="scope">{{ scope.row.brandName }}</template>
        </el-table-column>
        <el-table-column label="门店主图">
          <template slot-scope="scope">
            <img @click.stop="$imgPreview(hostUrl+scope.row.logo)" :src="hostUrl+scope.row.logo" alt="">
          </template>
        </el-table-column>
        <el-table-column label="门店名称">
          <template slot-scope="scope">{{ scope.row.storeName }}</template>
        </el-table-column>
        <el-table-column label="门店地址">
          <template slot-scope="scope">
            {{scope.row.contactAddr}}
          </template>
        </el-table-column>
        <el-table-column label="门店电话">
          <template slot-scope="scope">
            {{scope.row.contactPhone}}
          </template>
        </el-table-column>
      </el-table>
      <div class="block tab_paging">
        <el-pagination @current-change="handleCurrentChange" 
        :page-size="counts" 
        :current-page.sync="currentPageNum"
        layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    fatherData: Array, // 输入父组件的数据做对比
    dataType: String,
    ApiData:{ // 传入API数据
      type:Object,
    }
  },
  data() {
    return {
      goodsName: '',
      goodsData: [],
      goodsDataActive: [], // 选中的数据
      page: 1,
      count: 10000, // 传入服务器的
      counts: 5, // 页面用的
      total: 1,
      pageData: [], // 当前页数据
      loading: true,
      currentPageNum: 1,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
    }
  },
  watch:{
    fatherData:{ // 父页面数据变化，子页面调动方法
      handler: function (val, oldVal) {
        this.PostGoodData()
        console.log('当前接收',val)
      },
      deep: true
    }
  },
  mounted() {
    this.PostGoodData()
  },
  methods: {
    PostGoodData(tex) {
      let seft = this
      let api = this.ApiData.api

      if(tex === 'seek') {
        seft.page = 1
        seft.currentPageNum = 1
      }
      let data = {
        pageNo:1,
        pageSize: seft.count
      }
      if(this.dataType === 'shop') {
        data.storeName = this.goodsName
      } else {
        data.goodsName = this.goodsName
        data[this.ApiData.parameter] = this.ApiData.id
      }
      if(this.ApiData.action) {
        data.action = this.ApiData.action
      }
      // console.log(data)
      this.$Posting(api, {...data }).then((res) => {
        if (res.code == 0) {
          // console.log('data',res.lists,seft.fatherData)
          // let data = seft.resetArr(res.lists,seft.fatherData)
          let data = res.datas.lists
          seft.pagingFn(data)
          seft.goodsDataActive = []
          seft.loading = false
          // console.log('data1',data.length)
          // console.log(res.datas.lists)
        } else {
          seft.$notify.error({
            title: '错误',
            message: res.msg
          })
        }
      })
    },
    pagingFn(arr) { // 切分总数据
      let pagingData = []
      for(let i = 0 ; i < arr.length; i += 5){
        pagingData.push(arr.slice(i,i+5));
      }

      this.goodsData = pagingData
      this.total = arr.length
      this.pageData = this.goodsData[0]
    },
    handleSelectionChange(val) { // 向父组件发送选中商品
      let seft = this
      let pages = this.page - 1 // 记录当前页面，以页面为goodsDataActive下标去装当前页的选中数据

      if(this.goodsData.length > 0) { // 当this.goodsData不是空的时候

        // 1、根据this.goodsData的length，确定this.goodsDataActive的length

        if (this.goodsDataActive.length === 0) {
          for (let i = 0; i < this.goodsData.length; i++) {
            this.goodsDataActive.push([])
          }
        }

        // 2、如果val的数量和this.goodsDataActive[pages]数量不一致，代表用户重新选择

        if(this.goodsDataActive[pages].length != val.length) {
          this.goodsDataActive[pages] = new Array() 
          for (let i = 0; i < val.length; i++) {
            this.goodsDataActive[pages].push(val[i])
          }
          let arr = this.goodsDataActive[pages];
          let resultarr = [...new Set(arr)];
          this.goodsDataActive[pages] = resultarr
          // console.log('重新选择了',val)
          // console.log(this.goodsDataActive)
        }

        // 3、this.goodsDataActive[pages].length < 1时，用户刚进入这一页

        if (this.goodsDataActive[pages].length < 1) {
          for (let i = 0; i < val.length; i++) {
            this.goodsDataActive[pages].push(val[i])
          }
          let arr = this.goodsDataActive[pages];
          let resultarr = [...new Set(arr)];
          this.goodsDataActive[pages] = resultarr
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val
      let num = val - 1
      this.pageData = this.goodsData[num]
      let seft = this
      seft.toggleSelection(seft.goodsDataActive[num])
    },
    toggleSelection(rows) { // 选中数据里有，标记为选中
      this.$nextTick(function () {
        if (rows) {
          rows.forEach( (row,index) => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        }
      })
    },
    resetArr(arr1, arr2) { // 比较父组件传入的数据，去掉子组件里含有的父组件相同数据
      if (arr2 === undefined) {
        arr2 = []
      }
      let obs =  arr1.map((item1) => {
        arr2.map((item2) => {
          if (item1.id === item2.id) {
            item1.stamp = true;
          } 
        })
        return item1
      }).filter(item1 => !item1.stamp)
      return obs
    }
  }
}
</script>
<style lang="less" >
.listOfGoods {
  .listOfGoods_tab {
    border: 1px solid #ddd;
    margin-top: 15px;
   .cell{
      height: 40px;
      // line-height: 40px;
      img{
        // width: 60px;;
        height: 100%;
      }
    }
  }
}
</style>