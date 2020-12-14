<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="SPU描述"> </el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :action="`${$BASE_API}/admin/product/fileUpload`"
        >
          <img class="avatar" />
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="还剩3个未选择">
          <el-option>11</el-option>
          <el-option>22</el-option>
          <el-option>33</el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table :data="xxx" border style="width: 100%; margin: 20px 0">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="yyy" label="属性名" width="150">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template>
              <el-tag></el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="zzz" label="操作" width="150">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'SpuUpdateList',
  data() {
    return {}
  },
}
</script>
<style lang="less" scoped>
</style>
