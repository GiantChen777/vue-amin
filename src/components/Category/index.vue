<template>
  <div>
    <el-card>
      <el-form inline :model="category">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="headerChange1"
            :disabled="disabled"
          >
            <el-option
              v-for="category1 in category1List"
              :key="category1.id"
              :label="category1.name"
              :value="category1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="headerChange2"
            :disabled="disabled"
          >
            <el-option
              v-for="category2 in category2List"
              :key="category2.id"
              :label="category2.name"
              :value="category2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="headerChange3"
            :disabled="disabled"
          >
            <el-option
              v-for="category3 in category3List"
              :key="category3.id"
              :label="category3.name"
              :value="category3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      category1List: [], // 1级分类数据
      category2List: [],
      category3List: [],
    }
  },
  props: ['disabled'],
  methods: {
    // 处理输入框的表单事件，传1id，进行发起请求
    async headerChange1(category1Id) {
      this.category2List = []
      this.category3List = []
      this.category.category2Id = ''
      this.category.category3Id = ''
      // console.log(category1Id)
      const result = await this.$API.attrs.getCategorys2(category1Id)
      if (result.code === 200) {
        this.category2List = result.data
      } else {
        this.$message.error(result.data)
      }
      // 清空父组件的数据
      // 因为这边是发起请求，需要请求id，从而获取到数据，这边不请空父组件的数据的话，点击的时候id是不一样的，
      this.$emit('clearList')
    },
    async headerChange2(category2Id) {
      this.category3List = []
      this.category.category3Id = ''
      // console.log(category1Id)
      const result = await this.$API.attrs.getCategorys3(category2Id)
      if (result.code === 200) {
        this.category3List = result.data
      } else {
        this.$message.error(result.data)
      }
      // 清空父组件的数据
      this.$emit('clearList')
    },
    // 通过点击获取得到3Id,然后进行传参数三个参数，进行发送请求，
    async headerChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      }
      //这里只触发事件，将id给传给父组件（list），父组件进行发送请求，遍历数据
      this.$emit('change', category)
      /*  // 然后进行发送请求
      const result = await this.$API.attrs.getAttrList(category)
      if (result.code === 200) {
        // console.log(result.data);
        // 子组件给父组件传递参数 自定义事件
        // 使用全局事件总线，触发的事件的给发送数据，接收数据的给绑定事件

      } else {
        this.$message.error(result.message)
      } */
    },
  },
  async mounted() {
    const result = await this.$API.attrs.getCategorys1()
    // console.log(result)
    if (result.code === 200) {
      this.category1List = result.data
    } else {
      this.$message.error(result.message)
    }
  },
}
</script>
