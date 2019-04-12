<template lang="html">
  <div class="GoodsAuditList">
   <h1 class="hint_site">
      当前位置：商品管理  >  审核列表
    </h1>
    <nav-goods-manage 
    :nav-index='navInit' 
    @changeIndex="changeNavIndex" 
    ></nav-goods-manage>
    <furniture v-if='navInit == 0'></furniture>
    <house-type v-else></house-type>
  </div>
</template>

<script>
import navGoodsManage from '@/components/NavGoodsManage';
import furniture from '@/views/goodsManage/GoodsAuditList/furniture';
import houseType from '@/views/goodsManage/GoodsAuditList/houseType';
export default {
  data() {
    return {
      navInit:0
    };
  },
  methods: {
    changeNavIndex(data){
    this.navInit = data
    }
  },
  components:{
   navGoodsManage,
    furniture,
    houseType
  }
};
</script>

<style lang="less"  scoped>
</style>
