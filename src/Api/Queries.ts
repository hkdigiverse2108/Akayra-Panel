import { KEYS, URL_KEYS } from "../Constants";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";
import type { AppQueryOptions } from "../Types/Api";

export const Queries = {
  // ************ User ***********
  useGetUser: (params?: any, options?: AppQueryOptions<any>) => 
    useQueries([KEYS.USER.ALL, params], () => Get(URL_KEYS.USER.ALL, params), options),
  
  useGetSingleUser: (id?: string) => 
    useQueries([KEYS.USER.BASE, id], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),

  // ************ Category ***********
  useGetCategory: (params?: any, options?: AppQueryOptions<any>) => 
    useQueries([KEYS.CATEGORY.ALL, params], () => Get(URL_KEYS.CATEGORY.ALL, params), options),
  
  useGetSingleCategory: (id?: string) => 
    useQueries([KEYS.CATEGORY.BASE, id], () => Get(`${URL_KEYS.CATEGORY.BASE}/${id}`), { enabled: !!id }),

  useGetCategoryDropdown: (params?: any) => 
    useQueries([KEYS.CATEGORY.DROPDOWN, params], () => Get(URL_KEYS.CATEGORY.ALL, { ...params, limit: 'All' })),

  // ************ Brand ***********
  useGetBrand: (params?: any, options?: AppQueryOptions<any>) => 
    useQueries([KEYS.BRAND.ALL, params], () => Get(URL_KEYS.BRAND.ALL, params), options),
  
  useGetSingleBrand: (id?: string) => 
    useQueries([KEYS.BRAND.BASE, id], () => Get(`${URL_KEYS.BRAND.BASE}/${id}`), { enabled: !!id }),

  // ************ Variation (Size/Color) ***********
  useGetSize: (params?: any) => 
    useQueries([KEYS.SIZE.ALL, params], () => Get(URL_KEYS.SIZE.ALL, params)),
  
  useGetSingleSize: (id?: string) => 
    useQueries([KEYS.SIZE.BASE, id], () => Get(`${URL_KEYS.SIZE.BASE}/${id}`), { enabled: !!id }),
  
  useGetColor: (params?: any) => 
    useQueries([KEYS.COLOR.ALL, params], () => Get(URL_KEYS.COLOR.ALL, params)),
  
  useGetSingleColor: (id?: string) => 
    useQueries([KEYS.COLOR.BASE, id], () => Get(`${URL_KEYS.COLOR.BASE}/${id}`), { enabled: !!id }),

  // ************ Product ***********
  useGetProduct: (params?: any, options?: AppQueryOptions<any>) => 
    useQueries([KEYS.PRODUCT.ALL, params], () => Get(URL_KEYS.PRODUCT.ALL, params), options),
  
  useGetProductById: (id?: string) => 
    useQueries([KEYS.PRODUCT.BASE, id], () => Get(`${URL_KEYS.PRODUCT.BASE}/${id}`), { enabled: !!id }),

  // ************ Content ***********
  useGetBanner: (params?: any) => 
    useQueries([KEYS.BANNER.ALL, params], () => Get(URL_KEYS.BANNER.ALL, params)),
  
  useGetSingleBanner: (id?: string) => 
    useQueries([KEYS.BANNER.BASE, id], () => Get(`${URL_KEYS.BANNER.BASE}/${id}`), { enabled: !!id }),
  
  useGetBlog: (params?: any) => 
    useQueries([KEYS.BLOG.ALL, params], () => Get(URL_KEYS.BLOG.ALL, params)),
  
  useGetSingleBlog: (id?: string) => 
    useQueries([KEYS.BLOG.BASE, id], () => Get(`${URL_KEYS.BLOG.BASE}/${id}`), { enabled: !!id }),
  
  useGetReview: (params?: any) => 
    useQueries([KEYS.REVIEW.ALL, params], () => Get(URL_KEYS.REVIEW.ALL, params)),
  
  useGetSingleReview: (id?: string) => 
    useQueries([KEYS.REVIEW.BASE, id], () => Get(`${URL_KEYS.REVIEW.BASE}/${id}`), { enabled: !!id }),

  // ************ FAQ ***********
  useGetFaq: (params?: any) => 
    useQueries([KEYS.FAQ.ALL, params], () => Get(URL_KEYS.FAQ.ALL, params)),
  
  useGetSingleFaq: (id?: string) => 
    useQueries([KEYS.FAQ.BASE, id], () => Get(`${URL_KEYS.FAQ.BASE}/${id}`), { enabled: !!id }),
  
  useGetFaqCategory: (params?: any) => 
    useQueries([KEYS.FAQ_CATEGORY.ALL, params], () => Get(URL_KEYS.FAQ_CATEGORY.ALL, params)),
  
  useGetSingleFaqCategory: (id?: string) => 
    useQueries([KEYS.FAQ_CATEGORY.BASE, id], () => Get(`${URL_KEYS.FAQ_CATEGORY.BASE}/${id}`), { enabled: !!id }),
};
