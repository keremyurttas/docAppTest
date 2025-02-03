import { createRouter, createWebHistory } from "vue-router";

import homePage from "@/views/homePage.vue";

const routes = [
  // {
  //   path: "/admin",
  //   name: "Admin",
  //   component: adminPage,
  //   meta: { requiresAuth: true, title: "Admin Paneli - Kolaylık Elektrik" },
  // },
  {
    path: "/",
    name: "Home",
    component: homePage,
    meta: {
      title: "Kullanıcı Paneli - Kolaylık Elektrik",
    },
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: loginPage,
  //   meta: {
  //     title: "Giriş yap - Kolaylık Elektrik",
  //   },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const title = to.meta.title || "Kolaylık Elektrik";
//   useHead({
//     title,
//   });
//   //auth
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

//   const auth = getAuth();

//   const checkAuth = new Promise((resolve) => {
//     onAuthStateChanged(auth, (user) => {
//       resolve(user);
//     });
//   });
//   checkAuth.then(async (user) => {
//     if (requiresAuth && !user) {
//       next("/login");
//     } else if (requiresAuth && user) {
//       next();
//     } else {
//       next();
//     }
//   });
// });

export default router;
