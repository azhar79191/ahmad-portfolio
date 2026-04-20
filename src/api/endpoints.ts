export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
  },
  PORTFOLIO: {
    GET_ALL: '/portfolio/',
    GET_DETAILS: '/portfolio/',
    UPDATE:(id:number)=> `/portfolio/${id}/`,
    DELETE:(id:number)=> `/portfolio/${id}/`,
  },
  QUERIES: {
    POST: '/contact-queries/',
    GET_ALL: '/contact-queries/',
    PATCH: (id: number) => `/contact-queries/${id}/`,
    DELETE: (id: number) => `/contact-queries/${id}/`,
    MARKALLREAD: '/contact-queries/mark-all-read/',
    MARKREAD: (id: number) => `/contact-queries/${id}/mark-read/`,

  },
  TESTEMONIAL:{
    GET_TESTIMONIAL:'/testimonial/',
    POST_TESTIMONIAL:'/testimonial/',
    GET_BYID:(id: number) => `/testimonial/${id}/`,
    PUT_BYID:(id: number) => `/testimonial/${id}/`,
    PATCH_BYID:(id: number) => `/testimonial/${id}/`,
    DELETE_TESTIMONIAL:(id: number) => `/testimonial/${id}/`,
  },
  PROJECTS:
  {
    GET_PROJECTS:"/portfolio/",
    SEND_PROJECTS:"/portfolio/",
    PATCH_PROJECT:(id: number) => `/portfolio/${id}/`,
    DELETE_PROJECTS:(id: number) => `/portfolio/${id}/`,
    SEARCH_PROJECTS:(searchTerm:string)=>`/portfolio/?search=${searchTerm}`,
  },
  SERVICES: {
    GET_ALL: '/services/',
    POST: '/services/',
    PATCH: (id: number) => `/services/${id}/`,
    DELETE: (id: number) => `/services/${id}/`,
    TOGGLE_VISIBLE: (id: number) => `/services/${id}/`,
  },
  ROLES:{
    GETROLES:'/auth/users/',
    POSTROLES:'/auth/users/',
    UPDATEUSER:(id: number) => `/auth/users/${id}/`,
    DELETEUSER:(id: number) => `/auth/users/${id}/`,
    REVOKEACCESS:(id: number) => `/auth/users/${id}/revoke/`,
  },
  NOTIFICATIONS:{
    GET_NOTIFICATIONS:'/notifications/',
    MARK_AS_READ:(id:number)=> `/notifications/${id}/mark-read/`,
    MARK_ALL_AS_READ:'/notifications/mark-all-as-read/',
    UNREAD_COUNT:'/notifications/unread-count/'
  }
}