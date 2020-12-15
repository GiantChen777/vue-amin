<template>
  <el-card style="margin-top: 20px">
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>

    <el-table
      :data="spuList"
      border
      style="width: 100%; margin: 20px 0"
      v-loading="loading"
    >
      <!-- spuList spuName  description -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'SpuShowList',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      spuList: [],
      loading: false,
    }
  },
  methods: {
    // 获取SPU分页列表
    async getPageList(page, limit) {
      this.loading = true
      const { category3Id } = this.category
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      })
      if (result.code === 200) {
        this.$message.success('请求数据成功')
        console.log(result.data)
        this.spuList = result.data.records
        this.total = result.data.total
        this.page = result.data.pages
        this.limit = result.data.size
      } else {
        this.$message.error('请求数据失败')
      }
      this.loading = false
    },
    handleCategoryChange(category) {
      this.category = category
      // 有了id之后就可以发送请求，请求添加spu下面的数据
      this.getPageList(this.page, this.limit)
    },
    // 当选中1级或2级分类触发
    clearList() {
      this.spuList = []
      this.page = 1
      this.limit = 3
      this.total = 0
      this.category.category3Id = ''
    },
  },
  mounted() {
    // 通过全局事件总线，来获取得到category传过来的id，以便于获取得到数据
    this.$bus.$on('change', this.handleCategoryChange)
    this.$bus.$on('clearList', this.clearList)
  },
  /*  beforeDestroy() {
    // 通常情况下：清除绑定的全局事件
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  }, */
  // 通常情况下，绑定了全局事件总线，就要情况绑定的全局事件总线
  // 所以需要将  this.category = category
  // this.getPageList(this.page, this.limit)定义层一个函数，实现函数的复用性
  beforeDestroy() {
    this.$bus.$off('change', this.handleCategoryChange)
    this.$bus.$off('clearList', this.clearList)
  },
}
</script>

<style>
</style>
