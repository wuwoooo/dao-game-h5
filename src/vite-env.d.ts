/// <reference types="vite/client" />

// UniApp WebView 类型声明
declare global {
  interface Window {
    uni: {
      postMessage: (options: { data: any }) => void;
      navigateTo: (options: { url: string }) => void;
      navigateBack: (options?: { delta?: number }) => void;
      switchTab: (options: { url: string }) => void;
      reLaunch: (options: { url: string }) => void;
      redirectTo: (options: { url: string }) => void;
      getEnv: (callback: (env: any) => void) => void;
    };
    plus: any;
  }

  const uni: Window["uni"];
  const plus: any;
}

export {};
