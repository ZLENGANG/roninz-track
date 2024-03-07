<template>
  <div style="background-color: #282828;height: 1000px;">
    <button @click="error('code')">代码错误</button>
    <button @click="error('promise')">promise错误</button>
    <button @click="error('console')">console.error错误</button>

    <hr />

    <button @click="add('link')">插入link</button>
    <button @click="add('script')">插入script</button>
    <button @click="add('img')">插入img</button>
    <button @click="add('video')">插入video</button>
  </div>
</template>

<script setup lang="ts">
function error(type: string) {
  switch (type) {
    case 'code':
      console.log(a);
      break;
    case 'promise':
      new Promise((resolve, reject) => {
        reject('promise error');
      });
      break;
    case 'console':
      console.error('console error');
      break;

    default:
      break;
  }
}

function add(type: string) {
  switch (type) {
    case 'link':
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = 'https://dasdasdasd';
      document.head.appendChild(link);
      break;

    case 'script':
      const script = document.createElement('script');
      script.src = 'https://dfasf';
      document.head.appendChild(script);
      break;

    case 'img':
      const img = document.createElement('img');
      img.src = 'https://dasdasdasd';
      document.body.appendChild(img);
      break;

    case 'video':
      const video = document.createElement('video');
      video.src = 'https://dasdasdasd';
      document.body.appendChild(video);
      break;

    default:
      break;
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
</style>
