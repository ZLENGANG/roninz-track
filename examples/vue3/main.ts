import { createApp } from 'vue';
import App from './App.vue';
import { init } from '@roninz-track/core';

const app = createApp(App);
init({
  dsn: 'http:/fsd',
  appName: 'vue3',
  appCode: 'ddd',
  debug: true,
  beforePushEventList(data) {
    // data 是一个数组，格式：[{}]
    const newData = data.map((item) => {
      if (item.eventType === 'click' && item.params) {
        console.log('item', item);
        item.newParams = {
          dbname: item.params.dbname,
          fieldname: item.params.fieldname,
          tblname: item.params.tblname,
        };
        delete item.params.dbname;
        delete item.params.fieldname;
        delete item.params.tblname;
      }
      return item;
    });

    const arr = ['intersection', 'click'];
    data.forEach((item) => {
      if (arr.includes(item.eventType)) {
        window.vm.sendMessage();
      }
    });

    return newData;
  },
});
// let p = new Promise((resolve, reject) => {
//   reject('error ddd');
// });

app.mount('#app');
