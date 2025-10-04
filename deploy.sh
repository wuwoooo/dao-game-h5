#!/bin/bash

# === Vue.js 前端项目配置 ===
VUE_APP_NAME="daogame-h5" # 应用名称，用于打包文件名等
VUE_BUILD_COMMAND="npm run build:staging" # 或者 yarn build，根据你的项目配置
# Vue 构建后静态文件通常在项目下的 'dist' 目录
VUE_OUTPUT_DIR="./dist" # <--- 修改这里：构建产物目录相对于当前目录

# === 服务器配置 (可以从你之前的Java部署脚本中复用) ===
SERVER_USER="swu"
SERVER_IP="8.217.196.251"
SERVER_PORT="17296" # 如果 SSH 端口不是默认的 22
PRIVATE_KEY_PATH="$HOME/ssh/id_rsa" # SSH 私钥路径

# === 远程服务器路径配置 ===
REMOTE_UPLOAD_TMP_DIR="/home/${SERVER_USER}/tmp_vue_upload" # 服务器上用于临时存放上传压缩包的目录
REMOTE_TARGET_DIR="/data/www/daogame/h5" # Vue 项目最终部署的目录

# === 打包文件名 ===
ARCHIVE_NAME="${VUE_APP_NAME}-$(date +%Y%m%d%H%M%S).tar.gz"

echo "==== 🚀 开始部署 Vue.js 前端项目: ${VUE_APP_NAME} ===="
echo "✅ 脚本在项目根目录执行。"

# --- 步骤 1: (可选) 安装依赖 ---
# echo "📦 [1/4] 安装项目依赖 (npm install)..."
# npm install # 或者 yarn install
# if [ $? -ne 0 ]; then
#   echo "❌ 依赖安装失败，请检查错误"
#   exit 1
# fi
# echo "✅ 依赖安装完成"

# --- 步骤 2: 构建 Vue.js 项目 ---
echo "🛠️ [2/4] 构建 Vue.js 项目 (${VUE_BUILD_COMMAND})..."
${VUE_BUILD_COMMAND}
if [ $? -ne 0 ]; then
  echo "❌ Vue.js 项目构建失败，请检查构建日志"
  exit 1
fi

if [ ! -d "${VUE_OUTPUT_DIR}" ]; then # 检查 ./dist 是否存在
  echo "❌ 构建产物目录未找到：${VUE_OUTPUT_DIR}"
  exit 1
fi
echo "✅ Vue.js 项目构建完成，产物目录：${VUE_OUTPUT_DIR}"

# --- 步骤 3: 打包并上传构建产物 ---
echo "📦 [3/4] 打包构建产物并上传到服务器..."
# -C "${VUE_OUTPUT_DIR}" 表示切换到 VUE_OUTPUT_DIR (./dist) 目录内进行打包
tar -czf "${ARCHIVE_NAME}" -C "${VUE_OUTPUT_DIR}" .
if [ $? -ne 0 ]; then
  echo "❌ 打包构建产物失败"
  rm -f "${ARCHIVE_NAME}" # 清理本地压缩包 (会在项目根目录创建和删除)
  exit 1
fi
echo "✅ 构建产物已打包为 ${ARCHIVE_NAME} (位于项目根目录)"

echo "📤 上传 ${ARCHIVE_NAME} 到 ${SERVER_USER}@${SERVER_IP}:${REMOTE_UPLOAD_TMP_DIR}/"
ssh -p ${SERVER_PORT} -i "${PRIVATE_KEY_PATH}" ${SERVER_USER}@${SERVER_IP} "mkdir -p ${REMOTE_UPLOAD_TMP_DIR}"
scp -P ${SERVER_PORT} -i "${PRIVATE_KEY_PATH}" "${ARCHIVE_NAME}" "${SERVER_USER}@${SERVER_IP}:${REMOTE_UPLOAD_TMP_DIR}/"
if [ $? -ne 0 ]; then
  echo "❌ 上传失败，请检查 SSH 连接、权限、路径"
  rm -f "${ARCHIVE_NAME}"
  exit 1
fi
echo "✅ 上传成功"

rm -f "${ARCHIVE_NAME}" # 清理本地的压缩包

# --- 步骤 4: 在服务器上解压部署 ---
echo "🔧 [4/4] 在服务器上解压并部署到 ${REMOTE_TARGET_DIR}"
SSH_COMMANDS="
echo '密码提示（如果sudo需要）...'; \
sudo mkdir -p ${REMOTE_TARGET_DIR}; \
echo '清除旧的部署文件...'; \
sudo rm -rf ${REMOTE_TARGET_DIR}/*; \
echo '解压新的部署文件到目标目录...'; \
sudo tar -xzf ${REMOTE_UPLOAD_TMP_DIR}/${ARCHIVE_NAME} -C ${REMOTE_TARGET_DIR}; \
echo '清理服务器上的临时压缩包...'; \
sudo rm ${REMOTE_UPLOAD_TMP_DIR}/${ARCHIVE_NAME}; \
echo '设置文件权限 (示例，可能需要根据你的web服务器用户调整)...'; \
sudo chown -R root:root ${REMOTE_TARGET_DIR}; \
sudo chmod -R 755 ${REMOTE_TARGET_DIR}; \
echo '✅ 远程部署操作完成。'
"

ssh -p ${SERVER_PORT} -i "${PRIVATE_KEY_PATH}" ${SERVER_USER}@${SERVER_IP} "${SSH_COMMANDS}"
if [ $? -ne 0 ]; then
  echo "❌ 远程部署操作失败，请检查服务器上的输出和权限"
  exit 1
fi

echo "🎉 🎉 🎉 Vue.js 前端项目部署流程完成! 🎉 🎉 🎉"
echo "请访问你的网站，并确保 Web 服务器配置正确指向 ${REMOTE_TARGET_DIR}"