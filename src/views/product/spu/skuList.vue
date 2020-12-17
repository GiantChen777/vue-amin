<template>
  <el-card>
    <el-form label-width="100px" :model="spu" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          align="left"
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="请输入规格描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="skulist-select-container"
          v-for="attrs in attrsList"
          :key="attrs.id"
        >
          <span>{{ attrs.attrName }}</span>
          <el-select placeholder="请选择">
            <el-option v-for="attr in attrs.attrValueList" :key="attr.id">{{
              attr.valueName
            }}</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="skulist-select-container"
          v-for="spuattr in spuSaleAttrList"
          :key="spuattr.id"
        >
          <span>{{ spuattr.saleAttrName }}</span>
          <el-select placeholder="请选择">
            <el-option
              v-for="spu in spuattr.spuSaleAttrValueList"
              :key="spu.id"
              >{{ spu.saleAttrValueName }}</el-option
            >
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img :src="scope.row.imgUrl" :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
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
import { mapState } from 'vuex'
export default {
  props: {
    sku: Object,
  },
  data() {
    return {
      spu: this.sku,
      rules: {},
      imageList: [], //所有请求的图片数据
      spuSaleAttrList: [], //所有请求的属性列表值的数据
      attrsList: [], //所有的平台属性
    }
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    handleSelectionChange() {},
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuImageList(id)
      if (result.code === 200) {
        this.$message.success('所有图片数据请求成功')
        // console.log('result', result)
        // 这里不能改变原数据里面的属性，因为后面还要添加，所以可以使用计算属性来做
        /* this.imageList = result.data.map((item) => {
          return {
            id: item.id,
            name: item.imgName,
            url: item.imgUrl,
          }
        }) */
        this.imageList = result.data
      } else {
        this.$message.error('请求图片数据失败')
      }
    },
    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuSaleAttrList(id)
      // console.log(result.data)
      if (result.code === 200) {
        this.$message.success('获取SPU销售属性列表成功~')
        // 处理数据
        this.spuSaleAttrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    async getAttrList() {
      // 然后进行发送请求
      const result = await this.$API.attrs.getAttrList(this.category)
      if (result.code === 200) {
        // console.log(result.data);
        // 子组件给父组件传递参数 自定义事件
        // 使用全局事件总线，触发的事件的给发送数据，接收数据的给绑定事件
        this.attrsList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
  },

  mounted() {
    this.getSpuImageList()
    this.getSpuSaleAttrList()
    this.getAttrList()
  },
}
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  margin-right: 20px
</style>
