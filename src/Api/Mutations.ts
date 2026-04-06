import { KEYS, URL_KEYS } from "../Constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";
import type { CombinedErrorResponse } from "../Types/Api";

export const Mutations = {
  // ************ Auth ***********
  useLogin: () =>  useMutations([KEYS.USER.BASE], (input: any) => Post(URL_KEYS.AUTH.LOGIN, input)),
  useChangePassword: () => {const queryClient = useQueryClient();return useMutation<any, CombinedErrorResponse, any>({  mutationFn: (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input),  onSuccess: () => {    queryClient.invalidateQueries({ queryKey: [KEYS.USER.BASE] });  },});},

  // ************ User ***********
  useAddUser: () => useMutations([KEYS.USER.ALL, KEYS.USER.BASE], (input: any) => Post(URL_KEYS.USER.ADD, input)),
  useEditUser: () => useMutations([KEYS.USER.ALL, KEYS.USER.BASE], (input: any) => Put(URL_KEYS.USER.EDIT, input)),
  useDeleteUser: () => useMutations([KEYS.USER.ALL, KEYS.USER.BASE], (id: string) => Delete(`${URL_KEYS.USER.BASE}/${id}`)),

  // ************ Category ***********
  useAddCategory: () => useMutations([KEYS.CATEGORY.ALL, KEYS.CATEGORY.BASE, KEYS.CATEGORY.DROPDOWN], (input: any) => Post(URL_KEYS.CATEGORY.ADD, input), { showSuccessToast: false }),
  useEditCategory: () => useMutations([KEYS.CATEGORY.ALL, KEYS.CATEGORY.BASE, KEYS.CATEGORY.DROPDOWN], (input: any) => Put(URL_KEYS.CATEGORY.EDIT, input), { showSuccessToast: false }),
  useDeleteCategory: () => useMutations([KEYS.CATEGORY.ALL, KEYS.CATEGORY.BASE, KEYS.CATEGORY.DROPDOWN], (id: string) => Delete(`${URL_KEYS.CATEGORY.BASE}/${id}`)),

  // ************ Brand ***********
  useAddBrand: () => useMutations([KEYS.BRAND.ALL, KEYS.BRAND.BASE], (input: any) => Post(URL_KEYS.BRAND.ADD, input), { showSuccessToast: false }),
  useEditBrand: () => useMutations([KEYS.BRAND.ALL, KEYS.BRAND.BASE], (input: any) => Put(URL_KEYS.BRAND.EDIT, input), { showSuccessToast: false }),
  useDeleteBrand: () => useMutations([KEYS.BRAND.ALL, KEYS.BRAND.BASE], (id: string) => Delete(`${URL_KEYS.BRAND.BASE}/${id}`)),

  // ************ Size ***********
  useAddSize: () => useMutations([KEYS.SIZE.ALL, KEYS.SIZE.BASE], (input: any) => Post(URL_KEYS.SIZE.ADD, input)),
  useEditSize: () => useMutations([KEYS.SIZE.ALL, KEYS.SIZE.BASE], (input: any) => Put(URL_KEYS.SIZE.EDIT, input)),
  useDeleteSize: () => useMutations([KEYS.SIZE.ALL, KEYS.SIZE.BASE], (id: string) => Delete(`${URL_KEYS.SIZE.BASE}/${id}`)),

  // ************ Color ***********
  useAddColor: () => useMutations([KEYS.COLOR.ALL, KEYS.COLOR.BASE], (input: any) => Post(URL_KEYS.COLOR.ADD, input)),
  useEditColor: () => useMutations([KEYS.COLOR.ALL, KEYS.COLOR.BASE], (input: any) => Put(URL_KEYS.COLOR.EDIT, input)),
  useDeleteColor: () => useMutations([KEYS.COLOR.ALL, KEYS.COLOR.BASE], (id: string) => Delete(`${URL_KEYS.COLOR.BASE}/${id}`)),

  // ************ Product ***********
  useAddProduct: () => useMutations([KEYS.PRODUCT.ALL, KEYS.PRODUCT.BASE], (input: any) => Post(URL_KEYS.PRODUCT.ADD, input), { showSuccessToast: false }),
  useEditProduct: () => useMutations([KEYS.PRODUCT.ALL, KEYS.PRODUCT.BASE], (input: any) => Put(URL_KEYS.PRODUCT.EDIT, input), { showSuccessToast: false }),
  useDeleteProduct: () => useMutations([KEYS.PRODUCT.ALL, KEYS.PRODUCT.BASE], (id: string) => Delete(`${URL_KEYS.PRODUCT.BASE}/${id}`)),

  // ************ Review ***********
  useAddReview: () => useMutations([KEYS.REVIEW.ALL, KEYS.REVIEW.BASE], (input: any) => Post(URL_KEYS.REVIEW.ADD, input)),
  useEditReview: () => useMutations([KEYS.REVIEW.ALL, KEYS.REVIEW.BASE], (input: any) => Put(URL_KEYS.REVIEW.EDIT, input)),
  useDeleteReview: () =>  useMutations([KEYS.REVIEW.ALL, KEYS.REVIEW.BASE], (id: string) => Delete(`${URL_KEYS.REVIEW.BASE}/${id}`)),

  // ************ Banner ***********
  useAddBanner: () => useMutations([KEYS.BANNER.ALL, KEYS.BANNER.BASE], (input: any) => Post(URL_KEYS.BANNER.ADD, input) , { showSuccessToast: false }),
  useEditBanner: () => useMutations([KEYS.BANNER.ALL, KEYS.BANNER.BASE], (input: any) => Put(URL_KEYS.BANNER.EDIT, input), { showSuccessToast: false }),
  useDeleteBanner: () => useMutations([KEYS.BANNER.ALL, KEYS.BANNER.BASE], (id: string) => Delete(`${URL_KEYS.BANNER.BASE}/${id}`)),

  // ************ Blog ***********
  useAddBlog: () => useMutations([KEYS.BLOG.ALL, KEYS.BLOG.BASE], (input: any) => Post(URL_KEYS.BLOG.ADD, input), { showSuccessToast: false }),
  useEditBlog: () => useMutations([KEYS.BLOG.ALL, KEYS.BLOG.BASE], (input: any) => Put(URL_KEYS.BLOG.EDIT, input), { showSuccessToast: false }),
  useDeleteBlog: () => useMutations([KEYS.BLOG.ALL, KEYS.BLOG.BASE], (id: string) => Delete(`${URL_KEYS.BLOG.BASE}/${id}`)),

  // ************ FAQ Category ***********
  useAddFaqCategory: () => useMutations([KEYS.FAQ_CATEGORY.ALL, KEYS.FAQ_CATEGORY.BASE], (input: any) => Post(URL_KEYS.FAQ_CATEGORY.ADD, input)),
  useEditFaqCategory: () => useMutations([KEYS.FAQ_CATEGORY.ALL, KEYS.FAQ_CATEGORY.BASE], (input: any) => Put(URL_KEYS.FAQ_CATEGORY.EDIT, input)),
  useDeleteFaqCategory: () => useMutations([KEYS.FAQ_CATEGORY.ALL, KEYS.FAQ_CATEGORY.BASE], (id: string) => Delete(`${URL_KEYS.FAQ_CATEGORY.BASE}/${id}`)),

  // ************ FAQ ***********
  useAddFaq: () => useMutations([KEYS.FAQ.ALL, KEYS.FAQ.BASE], (input: any) => Post(URL_KEYS.FAQ.ADD, input)),
  useEditFaq: () => useMutations([KEYS.FAQ.ALL, KEYS.FAQ.BASE], (input: any) => Put(URL_KEYS.FAQ.EDIT, input)),
  useDeleteFaq: () => useMutations([KEYS.FAQ.ALL, KEYS.FAQ.BASE], (id: string) => Delete(`${URL_KEYS.FAQ.BASE}/${id}`)),

  //************* Contact Inquiries ***********
  useDeleteContactInquiry: () => useMutations([KEYS.CONTACT.BASE], (id: string) => Delete(`${URL_KEYS.CONTACT.DELETE}/${id}`)),

  //************* Newsletter ***********
  useDeleteNewsletter: () => useMutations([KEYS.NEWSLETTER.BASE], (id: string) => Delete(`${URL_KEYS.NEWSLETTER.DELETE}/${id}`)),

  //************* Coupon ***********
  useDeleteCoupon: () => useMutations([KEYS.COUPON.BASE], (id: string) => Delete(`${URL_KEYS.COUPON.DELETE}/${id}`)),
  useEditCoupon: () => useMutations([KEYS.COUPON.ALL, KEYS.COUPON.BASE], (input: any) => Put(URL_KEYS.COUPON.EDIT, input), { showSuccessToast: false }),
  useAddCoupon: () => useMutations([KEYS.COUPON.ALL, KEYS.COUPON.BASE], (input: any) => Post(URL_KEYS.COUPON.ADD, input), { showSuccessToast: false }),

  //************* IG Post ***********
  useDeleteIgPost: () => useMutations([KEYS.IG_POST.BASE], (id: string) => Delete(`${URL_KEYS.IG_POST.DELETE}/${id}`)),
  useEditIgPost: () => useMutations([KEYS.IG_POST.ALL, KEYS.IG_POST.BASE], (input: any) => Put(URL_KEYS.IG_POST.EDIT, input), { showSuccessToast: false }),
  useAddIgPost: () => useMutations([KEYS.IG_POST.ALL, KEYS.IG_POST.BASE], (input: any) => Post(URL_KEYS.IG_POST.ADD, input), { showSuccessToast: false }),

  //************* About ***********
  useDeleteAboutSection: () => useMutations([KEYS.ABOUT.BASE], (id: string) => Delete(`${URL_KEYS.ABOUT.DELETE}/${id}`)),
  useEditAboutSection: () => useMutations([KEYS.ABOUT.ALL, KEYS.ABOUT.BASE], (input: any) => Put(URL_KEYS.ABOUT.EDIT, input), { showSuccessToast: false }),
  useAddAboutSection: () => useMutations([KEYS.ABOUT.ALL, KEYS.ABOUT.BASE], (input: any) => Post(URL_KEYS.ABOUT.ADD, input), { showSuccessToast: false }),

  //************* Policy ***********
  useAddPolicy: () => useMutations([KEYS.POLICY.ALL, KEYS.POLICY.BASE, KEYS.POLICY.BY_TYPE], (input: any) => Post(URL_KEYS.POLICY.ADD, input)),
  useEditPolicy: () => useMutations([KEYS.POLICY.ALL, KEYS.POLICY.BASE, KEYS.POLICY.BY_TYPE], (input: any) => Put(URL_KEYS.POLICY.EDIT, input)),

  //************* Settings ***********
  useUpdateSettings: () => useMutations([KEYS.SETTINGS.BASE], (input: any) => Put(URL_KEYS.SETTINGS.UPDATE, input)),

  //************* Upload ***********
  useUploadImage: () => useMutations([KEYS.UPLOAD.BASE], (input: FormData) =>   Post(URL_KEYS.UPLOAD.IMAGE, input, { "Content-Type": "multipart/form-data" }) ),
  useDeleteUploadedImage: () =>useMutations([KEYS.UPLOAD.BASE], (pathOrUrl: string) => {  const params = new URLSearchParams();  if (/^https?:\/\//i.test(pathOrUrl)) {    params.set("url", pathOrUrl);  } else {    params.set("path", pathOrUrl);  }  const query = params.toString();  const endpoint = query ? `${URL_KEYS.UPLOAD.IMAGE}?${query}` : URL_KEYS.UPLOAD.IMAGE;  return Delete(endpoint);}),
};
