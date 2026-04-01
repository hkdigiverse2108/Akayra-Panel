import { KEYS, URL_KEYS } from "../Constants";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";
import type { AppQueryOptions, ResponseParserWrapper } from "../Types/Api";

export const Queries = {
  // ************ User ***********
  useGetUser: (params?: any, options?: AppQueryOptions<ResponseParserWrapper<any>>) => useQueries<ResponseParserWrapper<any>>([KEYS.USER.ALL, params], () => Get(URL_KEYS.USER.ALL, params), options),
  useGetSingleUser: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.USER.BASE, id], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),

  // ************ Category ***********
  useGetCategory: (params?: any, options?: AppQueryOptions<ResponseParserWrapper<any>>) => useQueries<ResponseParserWrapper<any>>([KEYS.CATEGORY.ALL, params], () => Get(URL_KEYS.CATEGORY.ALL, params), options),
  useGetSingleCategory: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.CATEGORY.BASE, id], () => Get(`${URL_KEYS.CATEGORY.BASE}/${id}`), { enabled: !!id }),
  useGetCategoryDropdown: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.CATEGORY.DROPDOWN, params], () => Get(URL_KEYS.CATEGORY.ALL, { ...params })),

  // ************ Brand ***********
  useGetBrand: (params?: any, options?: AppQueryOptions<ResponseParserWrapper<any>>) => useQueries<ResponseParserWrapper<any>>([KEYS.BRAND.ALL, params], () => Get(URL_KEYS.BRAND.ALL, params), options),
  useGetSingleBrand: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.BRAND.BASE, id], () => Get(`${URL_KEYS.BRAND.BASE}/${id}`), { enabled: !!id }),

  // ************ Variation (Size/Color) ***********
  useGetSize: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.SIZE.ALL, params], () => Get(URL_KEYS.SIZE.ALL, params)),
  useGetSingleSize: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.SIZE.BASE, id], () => Get(`${URL_KEYS.SIZE.BASE}/${id}`), { enabled: !!id }),
  useGetColor: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.COLOR.ALL, params], () => Get(URL_KEYS.COLOR.ALL, params)),
  useGetSingleColor: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.COLOR.BASE, id], () => Get(`${URL_KEYS.COLOR.BASE}/${id}`), { enabled: !!id }),

  // ************ Product ***********
  useGetProduct: (params?: any, options?: AppQueryOptions<ResponseParserWrapper<any>>) => useQueries<ResponseParserWrapper<any>>([KEYS.PRODUCT.ALL, params], () => Get(URL_KEYS.PRODUCT.ALL, params), options),
  useGetProductById: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.PRODUCT.BASE, id], () => Get(`${URL_KEYS.PRODUCT.BASE}/${id}`), { enabled: !!id }),

  // ************ Content ***********
  useGetBanner: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.BANNER.ALL, params], () => Get(URL_KEYS.BANNER.ALL, params)),
  useGetSingleBanner: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.BANNER.BASE, id], () => Get(`${URL_KEYS.BANNER.BASE}/${id}`), { enabled: !!id }),
  useGetBlog: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.BLOG.ALL, params], () => Get(URL_KEYS.BLOG.ALL, params)),
  useGetSingleBlog: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.BLOG.BASE, id], () => Get(`${URL_KEYS.BLOG.BASE}/${id}`), { enabled: !!id }),
  useGetReview: (params?: any) =>  useQueries<ResponseParserWrapper<any>>([KEYS.REVIEW.ALL, params], () => Get(URL_KEYS.REVIEW.ALL, params)),
  useGetSingleReview: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.REVIEW.BASE, id], () => Get(`${URL_KEYS.REVIEW.BASE}/${id}`), { enabled: !!id }),

  // ************ FAQ ***********
  useGetFaq: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.FAQ.ALL, params], () => Get(URL_KEYS.FAQ.ALL, params)),
  useGetSingleFaq: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.FAQ.BASE, id], () => Get(`${URL_KEYS.FAQ.BASE}/${id}`), { enabled: !!id }),
  useGetFaqCategory: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.FAQ_CATEGORY.ALL, params], () => Get(URL_KEYS.FAQ_CATEGORY.ALL, params)),
  useGetSingleFaqCategory: (id?: string) => useQueries<ResponseParserWrapper<any>>([KEYS.FAQ_CATEGORY.BASE, id], () => Get(`${URL_KEYS.FAQ_CATEGORY.BASE}/${id}`), { enabled: !!id }),

  // ************ Contact Inquiries ***********
  useGetContactInquiries: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.CONTACT.ALL, params], () => Get(URL_KEYS.CONTACT.ALL, params)),

  // ************ Coupon ***********
  useGetCoupons: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.COUPON.ALL, params], () => Get(URL_KEYS.COUPON.ALL, params)),

  // ************ IG Post ***********
  useGetIgPosts: (params?: any) => useQueries<ResponseParserWrapper<any>>([KEYS.IG_POST.ALL, params], () => Get(URL_KEYS.IG_POST.ALL, params)),
};

