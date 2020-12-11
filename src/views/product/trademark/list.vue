<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
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

    <!-- 弹出框 -->
    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="品牌名称" prop="tmName">
            <el-input v-model="ruleForm.tmName"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              action="http://182.92.128.115/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <!--
              before-upload:上传图片之前成功的回调函数
              on-success：上传成功之后的回调
              -->
              <img
                v-if="ruleForm.logoUrl"
                :src="ruleForm.logoUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>只能上传jpg/png文件，且不超过50kb</span>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
      visible: false, // 对话框显示&隐藏
      ruleForm: {
        tmName: '',
        logoUrl: '',
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        logoUrl: [{ required: true, message: '请上传品牌图片地址' }],
      },
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
    // 上传图片成功之后的回调
    handleAvatarSuccess(res, file) {
      console.log(res.data)
      this.ruleForm.logoUrl = res.data
    },
    // 在图片上传上传之前，需要进行验证
    beforeAvatarUpload(file) {
      console.log(file)
      // 文件类型
      const imgTypes = ['image/jpg', 'image/png']
      // 检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1
      // 检测文件大小
      const isLt = file.size / 1024 < 50

      if (!isValidType) {
        this.$message.error('上传品牌LOGO只能是 JPG 或 PNG 格式!')
      }
      if (!isLt) {
        this.$message.error('上传品牌LOGO大小不能超过 50 kb!')
      }
      // 成功则return返回出去
      return imgTypes && isLt
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 表单校验通过
          // console.log(this.trademarkForm);
          // 发送请求
          // 如果请求成功，则发送请求，添加到数据库中
          const result = await this.$API.trademark.addPageList(this.ruleForm)
          if (result.code === 200) {
            this.$message.success('添加品牌数据成功')
            // 请求成功后需要隐藏对话框
            this.visible = false
            //添加请求发起成功之后更新数据库，重新发送请求
            this.getPageList(this.page, this.limit) // 请求加载新数据
            this.ruleForm.tmName = ''
            this.ruleForm.logoUrl = ''
          } else {
            this.$message.error(result.message)
          }
        }
      })
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

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

.avatar-uploader .el-upload:hover
  border-color: #409EFF

.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

.avatar
  width: 178px
  height: 178px
  display: block
</style>
