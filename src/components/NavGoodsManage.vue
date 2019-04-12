<template>
    <div class='navGoodsManage'>
        <ul>
            <li v-for='(v,k) in navData' :class='navIndex==k?"active":""'>
            <span @click='switchNav(k)'>{{v}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props:['navIndex'],
    data(){
        return{
            navData:['家具','户型']
        }
    },
    mounted(){
       
    },
    methods:{
        switchNav(i){
          this.$emit('changeIndex',i); 
        }
    }
}
</script>
<style>
    .navGoodsManage{
        background-color: #fff;
        margin:10px 0;
    }
    .navGoodsManage li{
        display: inline-block;
        width:49%;
        padding-top:10px;
        padding-bottom:10px;
    }
    .navGoodsManage li:first-child{
        text-align: right;
        padding-right:20px;

    }
    .navGoodsManage li:last-child{
        padding-left:20px;
    }
    .navGoodsManage span{
        display: inline-block;
        width:60px;
        cursor: pointer;
        text-align: center;
        padding-bottom:10px;
        font-size: 20px;
    }
    .navGoodsManage li.active span{
        border-bottom:2px solid #3F51B5;
        color:#3F51B5
    }
</style>
