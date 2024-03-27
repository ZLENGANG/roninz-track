import { init, InitOptions, intersectionObserver } from "@roninz-track/core";

function install(app: any, options: InitOptions) {
  app.directive("observer", {
    mounted(el, data) {
      intersectionObserver([
        {
          target: el,
          threshold: 0.5,
          params: data.value,
        },
      ]);
    },
  });
  init(options);
}

export default { install };
export * from "@roninz-track/core";
