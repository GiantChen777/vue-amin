<template>
  <!--
      表单校验：
        1. 整体form表单中
        2. 通过prop属性来定义表单项名称
        3. 定义表单校验规则
          - 在data中定义rules
          - 绑定给form
        4. 校验表单
          - 给form绑定ref
          - this.$refs.spuForm.validate 校验表单
     -->
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu" :rules="rules" ref="spuForm">
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
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spu.description"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="imageList">
        <el-upload
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="imagecomput"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-success="handleAvatarSuccess"
        >
          <!-- :before-upload="beforeAvatarUpload" -->
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
          <!--  saleAttrId 就是点击的时候当前数据的id的值，通过v-model来双向数据绑定
            id:1
           name:"选择颜色" -->
          <!-- saleAttrId的值也就是指el-select的值，而el-select的值就是看下面 :value="sale.id" vlaue的值怎么传 -->
          <el-option
            v-for="sale in filterSaleAttrList"
            :label="sale.name"
            :value="sale.id"
            :key="sale.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spu.saleAttrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
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
              <!-- 我们需要拿的是attrVal遍历小图标的下标， -->
              <el-tag
                @close="deltag(row, index)"
                closable
                style="margin-right: 5px"
                v-for="(attrVal, index) in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
              <el-input
                v-model="text"
                v-if="row.edit"
                size="mini"
                style="width: 100px"
                @blur="editCompleted(row)"
                @keyup.enter.native="editCompleted(row)"
                ref="input"
                autofocus
              ></el-input>
              <el-button
                size="mini"
                icon="el-icon-plus"
                v-else
                @click="show(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row }">
              <el-popconfirm
                :title="`确定删除 ${row.saleAttrName}吗？`"
                @onConfirm="delsale(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sav">保存</el-button>
        <el-button @click="$emit('showList', spu.category3Id)">取消</el-button>
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
  data() {
    return {
      spu: this.item,
      trademarkList: [], // 所有品牌数据
      imageList: [], // 所有图片列表
      previewImgUrl: '', // 图片地址
      visible: false, // 图片对话框显示&隐藏
      saleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], // 当前SPU销售属性列表
      text: '', //定义的input内容
      rules: {
        // 表单校验规则对象
        spuName: [
          {
            required: true,
            message: '请输入SPU名称',
          },
        ],
        tmId: [
          {
            required: true,
            message: '请输入品牌名称',
          },
        ],
        description: [
          {
            required: true,
            message: '请输入SPU描述~~',
          },
        ],
        // 自定义图片表单校验规则
        imageList: [
          {
            validator: this.imageListValidator,
            required: true,
          },
        ],
        // 自定义属性表单校验规则
        saleAttrId: [
          {
            validator: this.saleValidator,
            required: true,
          },
        ],
      },
    }
  },
  computed: {
    // 图片的计算属性
    imagecomput() {
      return this.imageList.map((item) => {
        return {
          uid: item.uid || item.id,
          // 将原数据的id赋值给了当前遍历得到的imagecomput上面的id，
          // id: item.id,
          name: item.imgName,
          url: item.imgUrl,
        }
      })
    },
    filterSaleAttrList() {
      return this.saleAttrList.filter((item) => {
        return !this.spuSaleAttrList.find((em) => {
          // 这里显示的是就是下面的遍历看能不能找到上面遍历数据的id。找到就过滤掉,这样上面的就可以显示它的长度
          return em.baseSaleAttrId === item.id
        })
      })
    },
  },

  methods: {
    // 自定义图片表单验证规则
    imageListValidator(rule, value, callback) {
      if (this.imageList.length > 0) {
        // 如果里面有图片的话，校验通过
        callback()
        return
      }
      // 校验失败
      callback(new Error('请上传至少一张图片~'))
    },
    // 自定义销售属性表单规则
    saleValidator(rule, value, callback) {
      //判断至少选择一个销售属性
      if (this.spuSaleAttrList.length === 0) {
        // 校验失败
        callback(new Error('请上传选择一个属性~'))
        return
      }
      // 判断销售属性中至少添加一个销售属性值
      // 找到就为true，否则为false
      // spuSaleAttrValueList如果为0的话，就为false ,为false 就调用callback展示错误信息
      const isNotOk = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      )
      if (isNotOk) {
        callback(new Error('销售属性值至少选择一个，请添加~~~'))
      }
      callback()
    },
    // 收集spuPdateList的数据，点击保存按钮，发送请求,可以通过展开spu来获取得到
    sav() {
      // 表单验证通过的时候就收集数据，所以先判断表单是否验证通过
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          // valid表示表单验证通过
          console.log('校验通过~')
          const from = {
            ...this.spu,
            spuImageList: this.imageList,
            // spuSaleAttrList: this.saleAttrList,
            spuSaleAttrList: this.spuSaleAttrList,
          }
          // 收集到表单数据，然后点击保存按钮，发送请求
          const result = await this.$API.spu.updateSpu(from)
          // console.log(from)
          if (result.code === 200) {
            console.log(result)
            this.$message.success('修改spu数据成功')
            this.$emit('showList', this.spu.category3Id)
            /*   // 成功之后然后调用展示页面的函数，
        this.$nextTick(() => {
          this.$bus.$emit('change', { category3Id: from.category3Id })
        }) */
          } else {
            this.$message.error('修改数据失败')
          }
        }
      })
    },
    // 删除下面的销售属性列表
    delsale(row) {
      this.spuSaleAttrList = this.spuSaleAttrList.filter((item) => {
        return item.id !== row.id
      })
    },
    // 删除tag的标签
    deltag(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 方便聚焦
    show(row) {
      this.$set(row, 'edit', true)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 添加销售属性值
    editCompleted(row) {
      console.log(row)
      if (this.text) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          spuId: row.spuId,
          saleAttrValueName: this.text,
        })
        // 添加之后清空text的内容
        this.text = ''
      }
      row.edit = false
    },
    // 点击添加属性销售属性列表添加到下面的销售属性列表值中
    addSaleAttr() {
      // 选中当前的销售属性id的值
      const { saleAttrId, id } = this.spu
      // 在所有的销售属性列表找到saleAttrId所对应的值，
      const sale = this.saleAttrList.find((item) => {
        return item.id === saleAttrId
      })
      //找到之后就将数据push到下面的销售属性列表中
      this.spuSaleAttrList.push({
        baseSaleAttrId: sale.id, // 所有销售属性id
        saleAttrName: sale.name, // 所有销售属性名称
        spuId: id, // SPU id
        spuSaleAttrValueList: [], // 销售属性值列表
      })
      // 清空选中的销售属性id
      this.spu.saleAttrId = ''
    },
    // 上传成功之后的回调
    // 上传成功的函数里面的res里面包含了上传图片的地址
    handleAvatarSuccess(res, file) {
      // console.log(file, res)
      this.imageList.push({
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
        uid: file.uid,
      })
    },
    //处理删除
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      /* this.imageList = this.imageList.filter((item) => {
        return item.id !== file.id
      }) */
      this.imageList = this.imageList.filter((item) => {
        return item.imgUrl !== file.url
        // 这里是因为file是就算属性的imagecomput，给改名了url
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
        // console.log('result', result)
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
    // 获取所有销售属性接口数据
    async getSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList()
      console.log(result.data)
      if (result.code === 200) {
        this.$message.success('所有销售属性数据请求成功')
        // console.log(result.data)
        this.saleAttrList = result.data
      } else {
        this.$message.error('请求销售属性数据失败')
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
