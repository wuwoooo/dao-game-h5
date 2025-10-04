import { createApp } from "vue";
import MessageModal from "../components/MessageModal.vue";

interface MessageOptions {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  confirmText?: string;
  closable?: boolean;
  duration?: number; // 自动关闭时间，0表示不自动关闭
}

class MessageService {
  private app: any = null;
  private container: HTMLElement | null = null;

  private createContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "message-container";
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  private destroyContainer() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  show(options: MessageOptions): Promise<void> {
    return new Promise((resolve) => {
      const container = this.createContainer();

      // 创建Vue应用实例
      const app = createApp(MessageModal, {
        visible: true,
        type: options.type || "info",
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || "确定",
        closable: options.closable !== false,
        onClose: () => {
          this.hide();
          resolve();
        },
        onConfirm: () => {
          this.hide();
          resolve();
        },
      });

      // 挂载到容器
      app.mount(container);
      this.app = app;

      // 自动关闭
      if (options.duration && options.duration > 0) {
        setTimeout(() => {
          this.hide();
          resolve();
        }, options.duration);
      }
    });
  }

  hide() {
    if (this.app) {
      this.app.unmount();
      this.app = null;
    }
    this.destroyContainer();
  }

  // 便捷方法
  success(message: string, title?: string, t?: (key: string) => string) {
    const defaultTitle = t ? t("lottery.common.success") : "成功";
    return this.show({
      type: "success",
      title: title || defaultTitle,
      message,
      duration: 5000,
    });
  }

  error(message: string, title?: string, t?: (key: string) => string) {
    const defaultTitle = t ? t("lottery.common.error") : "错误";
    return this.show({
      type: "error",
      title: title || defaultTitle,
      message,
    });
  }

  warning(message: string, title?: string, t?: (key: string) => string) {
    const defaultTitle = t ? t("lottery.common.warning") : "警告";
    return this.show({
      type: "warning",
      title: title || defaultTitle,
      message,
    });
  }

  info(message: string, title?: string, t?: (key: string) => string) {
    const defaultTitle = t ? t("lottery.common.info") : "提示";
    return this.show({
      type: "info",
      title: title || defaultTitle,
      message,
      duration: 5000,
    });
  }
}

// 创建全局实例
const messageService = new MessageService();

// 导出便捷方法
export const message = {
  success: messageService.success.bind(messageService),
  error: messageService.error.bind(messageService),
  warning: messageService.warning.bind(messageService),
  info: messageService.info.bind(messageService),
  show: messageService.show.bind(messageService),
  hide: messageService.hide.bind(messageService),
};

// 默认导出
export default message;
