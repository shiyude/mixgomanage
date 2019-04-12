<template>
  <div class="foundGoods">
    <h1 class="hint_site" style="margin-bottom:15px;">
      当前位置：商品管理 > 发布商品
    </h1>
    <!-- <nav-goods-manage 
      :nav-index='navInit' 
      @changeIndex="changeNavIndex" 
      ></nav-goods-manage>
    <furniture v-if='navInit == 0'></furniture>
    <house-type v-else></house-type> -->
    <furniture></furniture>
  </div>
</template>

<script>
import navGoodsManage from "@/components/NavGoodsManage";
import furniture from "@/views/goodsManage/foundGoods/furniture";
import houseType from "@/views/goodsManage/foundGoods/houseType";
export default {
  data() {
    return {
      navInit: 0
    };
  },
  mounted() {},
  methods: {
    changeNavIndex(data) {
      this.navInit = data;
    }
  },
  components: {
    navGoodsManage,
    furniture,
    houseType
  }
};
</script>

<style lang="less"  scoped>
</style>