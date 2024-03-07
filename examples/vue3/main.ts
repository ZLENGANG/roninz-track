import { createApp } from "vue";
import App from "./App.vue";
import { init } from "@roninz-track/core";

const app = createApp(App);
init({
  dsn: "http:/fsd",
  appName: "vue3",
  appCode: "ddd",
  debug: true,
  cacheMaxLength: 10,
  cacheWatingTime: 6000,
  scopeError: true,
  event:true,
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
// let p = new Promise((resolve, reject) => {
//   reject('error ddd');
// });

app.mount("#app");
