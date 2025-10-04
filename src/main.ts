import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import "./assets/main.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { clearExpiredShortUrlCache } from "./utils/share";

// 应用启动时清理过期的短链缓存
clearExpiredShortUrlCache();

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount("#app");
