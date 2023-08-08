import { createSSRApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "@/router";
import "./global.scss";

router();

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  return {
    app
  };
}
