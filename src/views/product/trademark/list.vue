<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="id" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logo" class="logo" />
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
      :page-sizes="[3, 6, 9]"
      :page-size="3"
      layout=" prev, pager, next, jumper,sizes,total"
      :total="50"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: 'ipone',
          logo:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607667808621&di=44df8a989ff79b96a3400735ae1d5e84&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F35%2F34%2F19300001295750130986345801104.jpg',
        },
      ],
    }
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
