import { Message } from "element-ui";
import * as API from "@/api";

export default {
  namespaced: true,
  // 使用命名控件，是为了防止命名冲突
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  getters: {},
  actions: {
    async getCategorys1List ({ commit }) {
      const result = await API.attrs.getCategorys1()
      // console.log(result)
      if (result.code === 200) {
        commit("GET_CATEGORYS1_LIST", result.data)
      } else {
        Message.error(result.message)
      }
    },
    async getCategorys2List ({ commit }, category1Id) {
      const result = await API.attrs.getCategorys2(category1Id)
      if (result.code === 200) {
        commit("GET_CATEGORYS2_LIST", {
          category1Id,
          category2List: result.data
        })
      } else {
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
        Message.error(result.message);
      }
    },
    async getCategorys3List ({ commit }, category2Id) {
      const result = await API.attrs.getCategorys3(category2Id)
      if (result.code === 200) {
        commit("GET_CATEGORYS3_LIST", {
          category2Id,
          category3List: result.data
        })
      } else {
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
        Message.error(result.message);
      }
    },
  },
  mutations: {
    GET_CATEGORYS1_LIST (state, category1List) {
      state.category1List = category1List
    },
    GET_CATEGORYS2_LIST (state, { category2List, category1Id }) {
      // 获取2级分类列表（此时选择了1级分类， 清空2级和3级分类）
      state.category2List = category2List;
      state.category.category1Id = category1Id;
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    // 如果请求失败，就其他的清空，一级分类的重新获取
    GET_CATEGORY2_LIST_ERROR (state, category1Id) {
      // 从新选择了新的category1Id的时候，就重新清空下面的
      state.category.category1Id = category1Id;
      state.category2List = [];
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORYS3_LIST (state, { category3List, category2Id }) {
      // 获取2级分类列表（此时选择了1级分类， 清空2级和3级分类）
      state.category3List = category3List;
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
    },
    // 如果请求失败，就其他的清空，一级分类的重新获取
    GET_CATEGORY3_LIST_ERROR (state, category2Id) {
      // 从新选择了新的category1Id的时候，就重新清空下面的
      state.category.category2Id = category2Id;
      state.category3List = [];
      state.category.category3Id = "";
    },
    SET_CATEGORY3_ID (state, category3Id) {
      state.category.category3Id = category3Id;
    }
  }
}
