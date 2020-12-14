import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
 获取Spu分页列表的数据
 */
  getSpuList ({ category3Id, page, limit }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  /*
  获取销售属性列表
  */
  getBaseSaleAttrList () {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },
  /*
  删除SPU
  */
  deleteSpu (spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: "DELETE"
    });
  },
  /*
  /admin/product/saveSpuInfo
  添加SPU
  */
  saveSpuInfo () {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST"
    });
  },
  /*
  /admin/product/updateSpuInfo
  修改SPU
  */
  updateSpuInfo () {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
    });
  }
};
