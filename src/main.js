import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { createHead } from "@vueuse/head";
import "@/assets/styles/fonts.css";
import "@/assets/styles/globals.css";
import "@/assets/styles/main.css";
// import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure you are using css-loader

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDW1lldETOsJJtp5ZLEBybzhe83vGg9X2Q",
//   authDomain: "doganleddocumentation.firebaseapp.com",
//   projectId: "doganleddocumentation",
//   storageBucket: "doganleddocumentation.appspot.com",
//   messagingSenderId: "249405329750",
//   appId: "1:249405329750:web:50ca1cf898a1d1497006f7",
//   measurementId: "G-2F8NHP6JSS",
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // Use Material Design Icons
  },
});
const head = createHead();
// const storage = getStorage(app, "bucket1");
// const auth = getAuth(app);
createApp(App)
  .use(head)
  .use(vuetify)

  .use(router)

  .mount("#app");
