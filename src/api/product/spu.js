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
  获取所有销售属性列表
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
  /admin/product/saveSpuInfo保存
  添加SPU
  */
  saveSpuInfo (spu) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST",
      data: spu
    });
  },
  /*
  /admin/product/updateSpuInfo
  修改SPU
  */
  /*   updateSpuInfo (spu) {
      return request({
        url: `${api_name}/updateSpuInfo`,
        method: "POST",
        data: spu
      });
    }, */
  updateSpu (spu) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      data: spu
    });
  },

  /*
 获取所有品牌数据
 */
  getTrademarkList () {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: "GET"
    });
  },

  /*
 获取SPU的图片列表
 */
  getSpuImageList (spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },

  /*
获取SPU的销售属性列表
(序号，属性名啥的接口)
*/
  getSpuSaleAttrList (spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET"
    });
  },
};
