import { createRouter, createWebHistory } from "vue-router";
import { getUserInfoFromCache } from "../utils/auth";
import { getLocaleFromUrl, saveLocale, isValidLocale } from "../utils/locale";
import { setLocale } from "../i18n";

const router = createRouter({
  history: createWebHistory("/h5/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
      meta: {
        title: "首页",
      },
    },
    {
      path: "/game/:id",
      name: "game-detail",
      component: () => import("../views/GameDetail.vue"),
      meta: {
        title: "游戏详情",
      },
    },
    {
      path: "/game/:id/play",
      name: "game-play",
      component: () => import("../views/GamePlay.vue"),
      meta: {
        title: "游戏",
        hideNavigation: true,
      },
    },
    {
      path: "/my-games",
      name: "my-games",
      component: () => import("../views/MyGames.vue"),
      meta: {
        title: "我的游戏",
        requiresAuth: true,
      },
    },
    {
      path: "/search",
      name: "search-results",
      component: () => import("../views/SearchResults.vue"),
      meta: {
        title: "搜索结果",
      },
    },
    {
      path: "/lottery",
      name: "lottery-list",
      component: () => import("../views/lottery/LotteryList.vue"),
      meta: {
        title: "抽奖活动",
      },
    },
    {
      path: "/lottery/:id",
      name: "lottery-detail",
      component: () => import("../views/lottery/LotteryDetail.vue"),
      meta: {
        title: "抽奖详情",
      },
    },
    {
      path: "/my-lottery",
      name: "my-lottery",
      component: () => import("../views/lottery/MyLottery.vue"),
      meta: {
        title: "我的抽奖",
        requiresAuth: true,
      },
    },
    {
      path: "/lottery/help/invite/:code",
      name: "help-assist",
      component: () => import("../views/lottery/HelpAssist.vue"),
      meta: {
        title: "好友助力",
      },
    },
  ],
});

// 声明全局事件总线，用于在路由守卫中触发登录提醒
export const eventBus = {
  // 触发登录提醒的方法
  triggerLogin: () => {
    window.dispatchEvent(new CustomEvent("open-login-reminder"));
  },
};

// 路由守卫
router.beforeEach((to, from, next) => {
  // 处理locale参数
  const localeParam = getLocaleFromUrl();
  if (localeParam && isValidLocale(localeParam)) {
    setLocale(localeParam);
    console.log("路由守卫 - 设置语言为:", localeParam);
  }

  // 设置页面标题
  document.title = to.meta.title
    ? `${to.meta.title} - Aisky DaoGame`
    : "Aisky DaoGame";

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    console.log("=== 路由守卫检查登录状态 ===");
    console.log("目标路由:", to.path);
    const cachedUserInfo = getUserInfoFromCache();
    console.log("路由守卫 - 缓存用户信息:", cachedUserInfo);

    if (
      !cachedUserInfo ||
      !cachedUserInfo.token ||
      !cachedUserInfo.uuid ||
      !cachedUserInfo.uid
    ) {
      console.log("路由守卫 - 用户未登录，重定向到首页");
      // 触发登录模态框并重定向到首页
      eventBus.triggerLogin();
      next({ name: "home" });
      return;
    }
    console.log("路由守卫 - 用户已登录，允许访问");
  }
  next();
});

export default router;
