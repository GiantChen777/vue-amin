<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="trademark" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" class="logo" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout=" prev, pager, next, jumper,sizes,total"
      :total="total"
      :current-page.sync="page"
      class="pagination"
    >
      <!-- current-page 为当前点击页数   page-size每次显示的条数-->
      <!-- .sync修饰符是适用于子传父，类似于v-model，会进行数据的双向流动 -->
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      trademark: [],
      total: 0,
      page: 1,
      limit: 3,
    }
  },
  methods: {
    handleCurrentChange(page) {
      console.log(page, this.limit)
      this.getPageList(page, this.limit)
    },
    handleSizeChange(limit) {
      console.log(this.page, limit)
      this.getPageList(this.page, limit)
    },
    // 封装发送请求数据的方法，因为有需要用到公共的方法
    async getPageList(page, limit) {
      try {
        // 需要传page和limit
        const result = await this.$API.trademark.getPageList(page, limit)
        console.log(result)
        if (result.code === 200) {
          this.$message.success('请求数据成功')
          this.trademark = result.data.records
          this.total = result.data.total
          this.currentPage = result.data.current
          this.pageSize = result.data.size
        } else {
          this.$message.error('请求数据失败')
        }
      } catch {
        this.$message.error('请求数据失败')
      }
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit)
  },
}
</script>
<style lang="sass">
.logo
  width: 100px
.pagination
  text-align: right
.el-pagination__sizes
  margin-left: 500px
</style>
