<template>
  <el-form label-width="90px" :inline="true" class='demo-ruleForm'>
    <div class='dynamic_section'>
      <template v-if="dymanicData.length">
        <el-row v-for="(v,i) in dymanicData" :key="i">
          <el-form-item :label="v.propertyName">
            <!-- 判断动态数据是否通过select控件展示 -->
            <template v-if="v.controlType=='2'">
              <el-select v-model="v.propertyValue" class="form_input_375">
                <el-option v-for="(item,k) in v.propertyValues.split(',')" :label="item" :value="item" :key="k"></el-option>
              </el-select>
            </template>
            <!-- 判断动态数据是否通过多选框展示 -->
            <template v-if="v.controlType=='3'">
              <el-checkbox-group v-model="v.propertyValue" >
                <el-checkbox v-for="(item,k) in v.propertyValues.split(',')" :key="k" :label="item"></el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-row>
      </template>
    </div>
  </el-form>
</template>
<script>
export default {
  props: {
    dymanicData: {
      type: Array,
      default() {
        return false;
      }
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.dynamic_section {
  min-height: 250px;
  border: 1px solid #f0f0f0;
  padding-top: 22px;
  width: 600px;
}
.form_input_375 {
  width: 375px;
}
.el-form-item {
  margin-bottom: 22px !important;
}
</style>

