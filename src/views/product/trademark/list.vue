<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
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
        <!-- 作用域插槽slot-scope 也可以重新命名为v-slot -->
        <template v-slot="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="update(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(row.id)"
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
    <!-- 通过ruleForm的id有没有来进行判断 标题是否是添加或者修改两个字 -->
    <el-dialog
      :title="`${ruleForm.id ? '修改品牌' : '添加品牌'}`"
      :visible.sync="visible"
      width="50%"
    >
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <!-- action="http://182.92.128.115/admin/product/fileUpload" -->
          <!--  action="/dev-api/admin/product/fileUpload" -->
          <el-form-item label="品牌名称" prop="tmName">
            <el-input v-model="ruleForm.tmName"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              :action="`${$BASE_API}/admin/product/fileUpload`"
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
      console.log(res)
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
          // 提交表单数据，通过就修改，没有就不修改原数据，所以需要进行判断
          const { ruleForm } = this
          // 定义变量，强制转换为boolear值
          const isUpdate = !!ruleForm.id
          // 如果ruleForm存在，则表示有数据
          if (isUpdate) {
            const tm = this.trademark.find((item) => {
              return item.id === ruleForm.id
            })
            if (
              tm.tmName === ruleForm.tmName &&
              tm.logoUrl === ruleForm.logoUrl
            ) {
              this.$message.warning('不能提交与之前一样的数据')
              return
            }
          }
          // 然后点击确定之后需要发送请求
          let result
          if (isUpdate) {
            result = await this.$API.trademark.updatePageList(ruleForm)
          } else {
            result = await this.$API.trademark.addPageList(ruleForm)
          }
          if (result.code === 200) {
            // 这里修改数据成功之后就不能是添加，而应该显示修改数据
            //如果是就修改，不是就添加
            this.$message.success(`${isUpdate ? '修改' : '添加'}品牌数据成功`)
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
    // 添加表单
    add() {
      // 首先点击修改需要将数据显示出来，
      this.visible = true
      this.ruleForm = {
        tmName: '',
        logoUrl: '',
      }
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
    },
    // 删除表单数据
    del(id) {
      console.log(id)
      {
        this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            // 这里是删除当前获取数据的id，通过id将数据给删除掉，然后重新在发个请求，更新系统数据，这样用户界面就可以更新出来，然后如果不请求更新用户界面数据的时候，数据也会进行删除，但是界面不会更新，所以需要发送两个请求
            await this.$API.trademark.delPageList(id)
            await this.getPageList(this.page, this.limit)
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },
    // 修改表单数据
    update(row) {
      // 首先点击修改需要将数据显示出来，
      this.visible = true
      // 然后显示的时候需要将数据进行传过去显示
      // 这里应该重新结构赋值一个新对象，因为是ruleForm和trademark是地址值的赋值，一旦修改，就会也将trademark的值也给修改了，所以需要重新结构赋值一个新的对象
      this.ruleForm = { ...row }
      //退出之后需要清空里面的验证
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
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
