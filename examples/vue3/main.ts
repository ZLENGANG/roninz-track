import { createApp } from "vue";
import App from "./App.vue";
import roninzTrack from "@roninz-track/vue3";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import Home from "./pages/home.vue";
import Pv from "./pages/pv.vue";

const app = createApp(App);

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/pv", component: Pv },
  ],
});

// let p = new Promise((resolve, reject) => {
//   reject('error ddd');
// });

app.use(router);
app.use(roninzTrack, {
  dsn: "http:/fsd",
  appName: "vue3",
  appCode: "ddd",
  debug: true,
  cacheMaxLength: 10,
  cacheWatingTime: 2000,
  scopeError: true,
  event: true,
  performance: true,
  pv: true,
  ext: {
    userName: "roninz",
  },
  beforeSendData(data) {
    return {
      ...data,
      // name: "zlzl",
    };
  },
  afterSendData(data) {
    // console.log(data,'after');

    console.log("发送成功！");
  },
});
app.mount("#app");
