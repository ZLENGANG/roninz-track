import { createApp } from "vue";
import App from "./App.vue";
import { init } from "@roninz-track/core";

const app = createApp(App);
init({
  dsn: "http:/fsd",
  appName: "vue3",
  appCode: "ddd",
  debug: true,
});
// let p = new Promise((resolve, reject) => {
//   reject('error ddd');
// });

app.mount("#app");
