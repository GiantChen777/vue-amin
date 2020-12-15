<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <!-- 明早问问这里为什么是tmId -->
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌区域" v-model="spu.tmId">
          <el-option
            v-for="tm in trademarkList"
            :label="tm.tmName"
            :value="tm.id"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spu.description"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="imageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <!--
        prop="saleAttrId" 将来作为表单校验
       -->
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
          v-model="spu.saleAttrId"
        >
          <el-option
            v-for="sale in filterSaleAttrList"
            :label="sale.name"
            :value="sale.id"
            :key="sale.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table
          :data="spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column label="属性值名称列表" prop="saleAttrValueName">
            <template v-slot="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="attrVal in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
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
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImgUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'SpuUpdateList',
  props: {
    item: Object,
  },
  computed: {
    filterSaleAttrList() {
      return this.saleAttrList.filter((item) => {
        return !this.spuSaleAttrList.find((em) => {
          // 这里显示的是就是下面的遍历看能不能找到上面遍历数据的id。找到就过滤掉
          return em.baseSaleAttrId === item.id
        })
      })
    },
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], // 所有品牌数据
      imageList: [], // 所有图片列表
      previewImgUrl: '', // 图片地址
      visible: false, // 图片对话框显示&隐藏
      saleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], // 当前SPU销售属性列表
    }
  },
  methods: {
    //处理删除(这里有bug，明天问问)
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.imageList = this.imageList.filter((item) => {
        return item.id !== file.id
      })
    },
    //放大
    handlePreview(file) {
      this.previewImgUrl = file.url
      this.visible = true
    },
    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList()
      if (result.code === 200) {
        this.$message.success('所有品牌数据请求成功')
        console.log('result', result)
        this.trademarkList = result.data
      } else {
        this.$message.error('请求品牌数据失败')
      }
    },
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuImageList(id)
      if (result.code === 200) {
        this.$message.success('所有图片数据请求成功')
        console.log('result', result)
        this.imageList = result.data.map((item) => {
          return {
            id: item.id,
            name: item.imgName,
            url: item.imgUrl,
          }
        })
      } else {
        this.$message.error('请求图片数据失败')
      }
    },
    // 获取所有销售属性接口数据
    async getSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList()
      console.log(result.data)
      if (result.code === 200) {
        this.$message.success('所有销售属性数据请求成功')
        console.log(result.data)
        this.saleAttrList = result.data
      } else {
        this.$message.error('请求销售属性数据失败')
      }
    },
    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuSaleAttrList(id)
      console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取SPU销售属性列表成功~')
        // 处理数据
        this.spuSaleAttrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
  },
  mounted() {
    //获取所有品牌数据
    this.getTrademarkList()
    // 获取所有图片数据
    this.getSpuImageList()
    // 获取所有销售属性接口
    this.getSaleAttrList()
    // 获取单个spu销售属性列表
    this.getSpuSaleAttrList()
  },
}
</script>
<style lang="less" scoped>
</style>
