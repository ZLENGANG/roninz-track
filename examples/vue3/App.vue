<template>
  <div style="background-color: #282828; height: 1000px" track-contaier="容器">
    <button
      track-container="容器btn"
      track-id="123"
      track-name="zl"
      track-age="22"
    >
      <span>点我</span>
    </button>

    <hr />

    <div class="zlzl">
      <button @click="error('code')">代码错误</button>
      <button @click="error('promise')">promise错误</button>
      <button @click="error('console')">console.error错误</button>

      <hr />

      <button @click="add('link')" track-title="我是title">插入link</button>
      <button @click="add('script')">插入script</button>
      <button @click="add('img')">插入img</button>
      <button @click="add('video')">插入video</button>

      <hr />
      <button @click="sendReq('xhr-get')">xhr-get-success</button>
      <button @click="sendReq('xhr-get-error')">xhr-get-error</button>

      <button @click="sendReq('xhr-post')">xhr-post-success</button>
      <button @click="sendReq('xhr-post-error')">xhr-post-error</button>

      <button @click="sendReq('fetch-get')">fetch-get</button>
      <button @click="sendReq('fetch-get-error')">fetch-get-error</button>

      <button @click="sendReq('fetch-post')">fetch-post</button>
      <button @click="sendReq('fetch-post-error')">fetch-post-error</button>
    </div>
  </div>
  <div
    style="
      width: 100px;
      height: 100px;
      background-color: yellowgreen;
      position: absolute;
      right: 0;
      top: 0;
    "
    track-contaier="容器1"
  ></div>

  <img
    track-contaier="容器2"
    src="https://th.bing.com/th/id/R.de7e1dcf98e725ab765c0b61478d8ff5?rik=7yqie%2fa32j2uxA&riu=http%3a%2f%2fb.zol-img.com.cn%2fdesk%2fbizhi%2fstart%2f3%2f1368604511486.jpg&ehk=JGWbrH30aClk4HeRboH7w99%2fMOhMX5m%2f7KepEepxVPE%3d&risl=&pid=ImgRaw&r=0"
    alt="dddd"
    srcset=""
  />

  <svg
    track-contaier="容器3"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    role="img"
    class="iconify iconify--logos"
    width="37.07"
    height="36"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 256 198"
  >
    <path
      fill="#41B883"
      d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"
    ></path>
    <path
      fill="#41B883"
      d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"
    ></path>
    <path
      fill="#35495E"
      d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"
    ></path>
  </svg>
</template>

<script setup lang="ts">
function error(type: string) {
  switch (type) {
    case "code":
      console.log(a);
      break;
    case "promise":
      new Promise((resolve, reject) => {
        reject("promise error");
      });
      break;
    case "console":
      console.error("console error");
      break;

    default:
      break;
  }
}

function add(type: string) {
  switch (type) {
    case "link":
      const link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = "https://dasdasdasd";
      document.head.appendChild(link);
      break;

    case "script":
      const script = document.createElement("script");
      script.src = "https://dfasf";
      document.head.appendChild(script);
      break;

    case "img":
      const img = document.createElement("img");
      img.src = "https://th.bing.com/th/id/R.de7e1dcf98e725ab765c0b61478d8ff5?rik=7yqie%2fa32j2uxA&riu=http%3a%2f%2fb.zol-img.com.cn%2fdesk%2fbizhi%2fstart%2f3%2f1368604511486.jpg&ehk=JGWbrH30aClk4HeRboH7w99%2fMOhMX5m%2f7KepEepxVPE%3d&risl=&pid=ImgRaw&r=0";
      document.body.appendChild(img);
      break;

    case "video":
      const video = document.createElement("video");
      video.src = "https://dasdasdasd";
      document.body.appendChild(video);
      break;

    default:
      break;
  }
}

function sendReq(type: string) {
  function getXhr(url: string) {
    const xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log("xhr-res", xhr.responseText);
      }
    };
  }

  function postXhr(url: string) {
    const xhr = new XMLHttpRequest();
    const body = { username: "example", password: "123456" };
    xhr.open("post", "http://localhost:6657" + url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log("xhr-res", xhr.responseText);
      }
    };
  }

  function getFetch(url: string) {
    fetch(`http://localhost:6657${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("featch-res", res);
      });
  }

  function postFetch(url: string) {
    fetch(`http://localhost:6657${url}`, {
      method: "POST",
      body: JSON.stringify({ test: "测试请求体" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("featch-res", res);
      });
  }

  switch (type) {
    case "xhr-get":
      getXhr("http://localhost:6657/getList?test=123");
      break;

    case "xhr-get-error":
      getXhr("http://localhost:6657/getList2?test=123");
      break;

    case "xhr-post":
      postXhr("/setList");
      break;

    case "xhr-post-error":
      postXhr("/setList2");
      break;

    case "fetch-get":
      getFetch("/getList?test=123");
      break;

    case "fetch-get-error":
      getFetch("/getList1?test=123");
      break;

    case "fetch-post":
      postFetch("/setList");
      break;

    case "fetch-post-error":
      postFetch("/setList1");
      break;

    default:
      break;
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

hr {
  margin: 20px 0;
}
</style>
