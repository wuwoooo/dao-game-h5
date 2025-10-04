<template>
  <div
    class="lottery-detail min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] relative overflow-hidden w-full max-w-full"
    :class="appTopOffsetClass"
  >
    <!-- 宇宙星空背景 -->
    <div class="stars-container absolute inset-0 z-0 overflow-hidden">
      <div
        v-for="i in 50"
        :key="`star-${i}`"
        class="star absolute rounded-full"
        :style="{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * 10 + 10}s`,
        }"
      ></div>
    </div>

    <!-- 顶部导航 -->
    <header
      class="sticky top-0 z-30 backdrop-blur-md bg-[#0f172a]/70 border-b border-indigo-500/20 w-full"
    >
      <div
        class="max-w-7xl mx-auto px-2 sm:px-4 py-4 flex justify-between items-center"
      >
        <div class="flex items-center">
          <div
            @click="handleBackClick"
            class="text-indigo-300 mr-3 hover:text-indigo-200 transition-colors flex items-center cursor-pointer"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <h1
            class="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300"
          >
            {{ lottery?.name || "Web3抽奖" }}
          </h1>
        </div>
        <div class="flex space-x-3">
          <button
            v-if="isLoggedIn()"
            @click="goToMyLottery"
            class="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-lg text-indigo-100 hover:from-purple-500/30 hover:to-indigo-500/30 transition-all border border-indigo-400/20 flex items-center"
          >
            <svg
              class="w-4 h-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"
              ></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <path d="M12 11v6"></path>
              <path d="M9 14h6"></path>
            </svg>
          </button>
          <!-- 分享按钮 -->
          <button
            @click="openShareModal"
            class="px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg text-indigo-100 hover:from-green-500/30 hover:to-blue-500/30 transition-all border border-indigo-400/20 flex items-center"
          >
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            分享
          </button>
          <button
            v-if="!isLoggedIn()"
            @click="() => openLoginReminder()"
            class="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-lg text-indigo-100 hover:from-purple-500/30 hover:to-indigo-500/30 transition-all border border-indigo-400/20 flex items-center"
          >
            <svg
              class="w-4 h-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            连接钱包
          </button>
        </div>
      </div>
    </header>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="max-w-7xl mx-auto px-2 sm:px-4 py-24 z-10 relative"
    >
      <div
        class="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-lg p-6 text-center max-w-md mx-auto"
      >
        <svg
          class="w-16 h-16 mx-auto mb-4 text-red-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 class="text-xl font-bold text-red-200 mb-2">星际通讯受阻</h2>
        <p class="text-red-300 mb-4">{{ error }}</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="retryFetch"
            class="px-5 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-100 rounded-lg transition-all flex items-center"
          >
            <svg
              class="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path
                d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
              />
            </svg>
            重新连接
          </button>
          <router-link
            :to="backButtonConfig.to"
            class="px-5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-100 rounded-lg transition-all flex items-center"
          >
            <svg
              class="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {{ backButtonConfig.text }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <div
      v-else-if="loading"
      class="flex justify-center items-center min-h-[70vh] z-10 relative"
    >
      <div class="cosmos-loader text-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="#8b5cf6"
            stroke-width="2"
            stroke-dasharray="80,60"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 40 40"
              to="360 40 40"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="40"
            cy="40"
            r="20"
            stroke="#a78bfa"
            stroke-width="2"
            stroke-dasharray="50,40"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 40 40"
              to="0 40 40"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <p class="text-indigo-300 mt-4 animate-pulse">星际定位中...</p>
      </div>
    </div>

    <!-- 活动不存在 -->
    <div
      v-else-if="!lottery"
      class="flex flex-col items-center justify-center min-h-[70vh] z-10 relative"
    >
      <div class="empty-state-illustration mb-6">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="#8b5cf6"
            stroke-width="1.5"
          />
          <line
            x1="12"
            y1="9"
            x2="12"
            y2="13"
            stroke="#8b5cf6"
            stroke-width="1.5"
          />
          <line
            x1="12"
            y1="17"
            x2="12.01"
            y2="17"
            stroke="#8b5cf6"
            stroke-width="1.5"
          />
          <path
            opacity="0.2"
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            fill="#8b5cf6"
          />
        </svg>
      </div>
      <div class="text-2xl text-indigo-200 mb-4">星域已坍缩</div>
      <p class="text-indigo-300/70 mb-6">该活动已消失于宇宙尘埃，或从未存在</p>
      <router-link
        :to="backButtonConfig.to"
        class="px-6 py-3 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-indigo-500/30 rounded-lg text-indigo-100 transition-all flex items-center"
      >
        <svg
          class="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {{ backButtonConfig.text }}
      </router-link>
    </div>

    <div v-else class="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <!-- 大转盘抽奖 -->
      <div
        v-if="lottery?.lotteryType === 'wheel'"
        class="wheel-container mb-10"
      >
        <div class="max-w-lg mx-auto">
          <!-- 转盘装饰外圈 -->
          <div class="relative mx-auto max-w-md">
            <div
              class="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full bg-gradient-to-br from-indigo-600/60 to-purple-600/60 animate-[spin_10s_linear_infinite] blur-[2px] z-0"
            ></div>
            <div
              class="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full bg-gradient-to-tl from-pink-500/30 to-indigo-500/30 animate-[spin_15s_linear_infinite_reverse] blur-[3px] z-0"
            ></div>

            <div class="relative">
              <!-- 大转盘背景 -->
              <div
                class="w-full relative aspect-square overflow-hidden rounded-full bg-gradient-to-b from-slate-900 to-gray-900 p-3 border border-indigo-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                <!-- 光效元素 -->
                <div
                  class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.2)_0%,transparent_70%)] z-[1]"
                ></div>
                <div class="absolute inset-0 overflow-hidden">
                  <div
                    class="absolute top-0 left-1/2 h-[1px] w-[40%] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent blur-[2px] animate-[shine_4s_ease-in-out_infinite]"
                  ></div>
                  <div
                    class="absolute bottom-0 left-1/2 h-[1px] w-[40%] -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-400 to-transparent blur-[2px] animate-[shine_4s_ease-in-out_infinite_1s]"
                  ></div>
                </div>

                <!-- SVG转盘实现 -->
                <div class="absolute inset-3 z-10">
                  <svg
                    ref="wheelRef"
                    class="w-full h-full transition-transform duration-5000 ease-out"
                    :style="{ transform: `rotate(${wheelRotation}deg)` }"
                    viewBox="0 0 100 100"
                  >
                    <!-- 转盘中心点 -->
                    <circle cx="50" cy="50" r="50" fill="none" />

                    <!-- 动态生成转盘扇形 -->
                    <g
                      v-for="(prize, index) in lottery?.prizes"
                      :key="prize.id"
                    >
                      <!-- 扇形背景 -->
                      <path
                        :d="getWheelSectorPath(index)"
                        :fill="getPrizeColor(index)"
                        class="hover:opacity-90 transition-opacity"
                      />

                      <!-- 扇形分隔线 -->
                      <line
                        :x1="50"
                        :y1="50"
                        :x2="
                          50 +
                          50 *
                            Math.sin(
                              ((index + 1) * sectorAngle * Math.PI) / 180
                            )
                        "
                        :y2="
                          50 -
                          50 *
                            Math.cos(
                              ((index + 1) * sectorAngle * Math.PI) / 180
                            )
                        "
                        stroke="#ffffff"
                        stroke-width="0.3"
                        stroke-opacity="0.5"
                      />

                      <!-- 奖品图片 (如果有且不是谢谢参与) -->
                      <image
                        v-if="
                          prize.name !== '谢谢参与' &&
                          getSafeImageUrl(prize.image)
                        "
                        :href="getSafeImageUrl(prize.image)"
                        :x="getImagePosition(index).x"
                        :y="getImagePosition(index).y"
                        height="15"
                        width="15"
                        preserveAspectRatio="xMidYMid meet"
                      />

                      <!-- 奖品名称 - 沿弧线显示 -->
                      <path
                        :id="`textPath-${prize.id}`"
                        :d="getTextArcPath(index)"
                        fill="none"
                      />
                      <text
                        fill="white"
                        font-size="4"
                        font-weight="bold"
                        class="wheel-prize-text"
                      >
                        <textPath
                          :href="`#textPath-${prize.id}`"
                          startOffset="50%"
                          text-anchor="middle"
                        >
                          {{ prize.name }}
                        </textPath>
                      </text>
                    </g>

                    <!-- 中心圆 -->
                    <circle cx="50" cy="50" r="8" fill="url(#centerGradient)" />

                    <!-- 中心渐变 -->
                    <defs>
                      <radialGradient
                        id="centerGradient"
                        cx="50%"
                        cy="50%"
                        r="50%"
                        fx="50%"
                        fy="50%"
                      >
                        <stop offset="0%" stop-color="#FFD700" />
                        <stop offset="100%" stop-color="#FFA500" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>

                <!-- 指针和中心按钮 -->
                <div
                  class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                >
                  <!-- 指针 -->
                  <div
                    class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-16"
                  >
                    <div
                      class="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-yellow-500 relative"
                    >
                      <div
                        class="absolute -inset-1 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-yellow-300 blur-[8px] opacity-70"
                      ></div>
                    </div>
                  </div>

                  <!-- 中心按钮 -->
                  <div
                    class="w-24 h-24 relative rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.8),0_0_40px_rgba(255,193,7,0.6),inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    :class="{
                      'animate-pulse-button': !isDrawing,
                    }"
                    style="
                      background: linear-gradient(
                        135deg,
                        #ffd700 0%,
                        #ffa500 50%,
                        #ff8c00 100%
                      );
                    "
                  >
                    <div
                      class="absolute inset-1 rounded-full flex items-center justify-center shadow-inner"
                      style="
                        background: linear-gradient(
                          135deg,
                          #fff8dc 0%,
                          #ffd700 50%,
                          #ffa500 100%
                        );
                      "
                    >
                      <div
                        class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner"
                      >
                        <div
                          class="font-bold text-xl"
                          :class="{
                            'animate-text-glow': !isDrawing,
                          }"
                          style="
                            color: #ffd700;
                            text-shadow: 2px 2px 0px #b8860b,
                              4px 4px 8px rgba(0, 0, 0, 0.6), 0 0 15px #ffd700,
                              0 0 25px #ffa500;
                            font-weight: 900;
                            letter-spacing: 1px;
                          "
                        >
                          抽奖
                        </div>
                      </div>
                    </div>
                    <!-- 旋转光效 -->
                    <div
                      class="absolute inset-0 rounded-full border-2"
                      :class="{
                        'animate-[spin_5s_linear_infinite]': !isDrawing,
                      }"
                      style="border-color: rgba(255, 215, 0, 0.9)"
                    ></div>
                    <div
                      class="absolute inset-2 rounded-full border-2 border-dashed"
                      :class="{
                        'animate-[spin_8s_linear_infinite_reverse]': !isDrawing,
                      }"
                      style="border-color: rgba(255, 193, 7, 0.7)"
                    ></div>
                    <!-- 外层光环效果 -->
                    <div
                      class="absolute -inset-4 rounded-full border-2"
                      :class="{
                        'animate-[spin_3s_linear_infinite]': !isDrawing,
                      }"
                      style="border-color: rgba(255, 165, 0, 0.8)"
                    ></div>
                    <div
                      class="absolute -inset-6 rounded-full border"
                      :class="{
                        'animate-[spin_4s_linear_infinite_reverse]': !isDrawing,
                      }"
                      style="border-color: rgba(255, 215, 0, 0.6)"
                    ></div>
                    <!-- 脉冲光环 -->
                    <div
                      class="absolute -inset-8 rounded-full"
                      :class="{
                        'animate-pulse-ring': !isDrawing,
                      }"
                      style="
                        background: linear-gradient(
                          to right,
                          rgba(255, 215, 0, 0.6),
                          rgba(255, 165, 0, 0.6)
                        );
                      "
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 抽奖按钮 -->
              <button
                @click="handleDrawClick"
                :disabled="isDrawing"
                class="absolute inset-0 m-auto w-24 h-24 rounded-full flex items-center justify-center text-indigo-900 font-bold text-xl transform hover:scale-110 hover:shadow-[0_0_25px_rgba(234,179,8,0.8)] active:scale-95 transition-all duration-300 z-30 focus:outline-none focus:ring focus:ring-yellow-300/50 cursor-pointer button-hover-effect"
                :class="{
                  'opacity-50 cursor-not-allowed': isDrawing,
                  'button-click-effect': !isDrawing,
                }"
              >
                <span class="sr-only">抽奖按钮</span>
              </button>
            </div>
          </div>

          <!-- 抽奖信息 -->
          <div class="mt-8 space-y-2">
            <div v-if="isLoggedIn()" class="relative inline-block mx-auto">
              <!-- 次数显示框 -->
              <div class="bg-white/5 backdrop-blur-sm p-3 rounded-lg">
                <div class="grid grid-cols-3 gap-4">
                  <div class="flex flex-col items-center">
                    <div class="text-xs text-indigo-300 mb-1">今日可抽次数</div>
                    <div class="text-xl font-bold text-white">
                      {{ drawInfo.remainingDrawsToday || 0 }}
                    </div>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="text-xs text-indigo-300 mb-1">剩余可抽总数</div>
                    <div class="text-xl font-bold text-white">
                      {{ drawInfo.remainingDraws || 0 }}
                    </div>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="text-xs text-indigo-300 mb-1">获得助力次数</div>
                    <div class="text-xl font-bold text-green-400">
                      {{ totalHelpDraws || 0 }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 刷新按钮 -->
              <button
                @click="refreshDrawCounts"
                :disabled="refreshing"
                class="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-10"
                title="刷新次数"
                style="margin-top: 8px; margin-right: -35px"
              >
                <svg
                  :class="[
                    'w-4 h-4 text-white',
                    { 'animate-spin': refreshing },
                  ]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <div v-else>
              <button
                @click="() => openLoginReminder()"
                class="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex mx-auto items-center shadow-lg shadow-indigo-900/30"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                连接Web3钱包
              </button>
            </div>

            <!-- 邀请好友助力按钮 -->
            <div v-if="helpConfig?.helpEnabled" class="mt-4 relative z-10">
              <button
                @click="openHelpModal"
                class="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center mx-auto relative z-10"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                邀请好友助力
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 盲盒抽奖 -->
      <div
        v-else-if="lottery?.lotteryType === 'box'"
        class="box-container mb-10"
      >
        <div class="max-w-lg mx-auto">
          <div class="text-center mb-6 text-indigo-200 text-lg">
            点击盲盒，开启链上奇遇
          </div>

          <div class="relative">
            <!-- 特效背景 -->
            <div
              class="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_80%)] pointer-events-none"
            ></div>

            <div class="flex flex-wrap justify-center gap-6">
              <!-- 盲盒容器 -->
              <div
                class="relative w-80 h-80 perspective-1000"
                :class="{ 'pointer-events-none': isDrawing }"
              >
                <!-- 盲盒动画阶段控制 -->
                <div
                  ref="boxRef"
                  class="relative w-full h-full transform-style-3d transition-all duration-1000"
                  :class="{
                    'opacity-50 cursor-not-allowed': isDrawing,
                    'cursor-pointer': !isDrawing,
                  }"
                  @click="handleDrawClick"
                >
                  <!-- 阶段1: 初始状态 - 关闭的盲盒 -->
                  <div
                    v-if="blindboxStage === 'initial'"
                    class="absolute inset-0 backface-hidden rounded-lg shadow-2xl flex items-center justify-center border border-indigo-500/30 overflow-hidden"
                    :class="{
                      'animate-pulse-glow': !isDrawing,
                    }"
                  >
                    <!-- 关闭的盲盒背景图片 -->
                    <img
                      src="/blindbox1.png"
                      alt="关闭的盲盒"
                      class="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
                      :class="{
                        'scale-105 brightness-110': !isDrawing,
                        'scale-100 brightness-100': isDrawing,
                      }"
                    />

                    <!-- 中心内容 -->
                    <div class="relative z-10 text-center">
                      <div
                        class="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center animate-pulse-glow"
                      >
                        <div
                          class="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <i
                            class="fas fa-gift text-white text-3xl animate-bounce"
                          ></i>
                        </div>
                      </div>
                      <div
                        class="text-white font-bold text-xl mb-2 drop-shadow-lg"
                      >
                        神秘盲盒
                      </div>
                      <div class="text-white/80 text-sm">点击开启神秘礼物</div>
                    </div>

                    <!-- 装饰粒子效果 -->
                    <div class="absolute inset-0 pointer-events-none">
                      <div
                        v-for="i in 12"
                        :key="`decoration-particle-${i}`"
                        class="decoration-particle absolute w-1 h-1 rounded-full bg-white/60"
                        :style="{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${Math.random() * 2 + 1}s`,
                        }"
                      ></div>
                    </div>
                  </div>

                  <!-- 阶段2: 开启动效 - 星爆能量效果 -->
                  <div
                    v-if="blindboxStage === 'opening'"
                    class="absolute inset-0 backface-hidden rounded-lg shadow-2xl flex items-center justify-center border border-indigo-500/30 overflow-hidden animate-box-opening"
                  >
                    <!-- 星爆能量背景图片 - 多层旋转效果 -->
                    <div class="absolute inset-0 overflow-hidden">
                      <!-- 外层旋转 -->
                      <img
                        src="/blindbox3.png"
                        alt="星爆能量"
                        class="absolute inset-0 w-full h-full object-cover animate-spin-reverse brightness-200"
                        style="transform: scale(1.2)"
                      />
                      <!-- 中层旋转 -->
                      <img
                        src="/blindbox3.png"
                        alt="星爆能量"
                        class="absolute inset-0 w-full h-full object-cover animate-spin-slow brightness-175"
                        style="transform: scale(1.1); opacity: 0.9"
                      />
                      <!-- 内层旋转 -->
                      <img
                        src="/blindbox3.png"
                        alt="星爆能量"
                        class="absolute inset-0 w-full h-full object-cover animate-spin-fast brightness-150"
                        style="transform: scale(1); opacity: 0.8"
                      />
                    </div>

                    <!-- 移除遮罩层，让图片更亮 -->

                    <!-- 中心能量核心 - 放大缩小效果 -->
                    <div class="relative z-10 flex items-center justify-center">
                      <!-- 外层光环 -->
                      <div
                        class="absolute w-32 h-32 border-2 border-yellow-400/40 rounded-full animate-spin-reverse"
                      ></div>

                      <!-- 中层光环 -->
                      <div
                        class="absolute w-28 h-28 border border-orange-400/50 rounded-full animate-spin-slow"
                      ></div>

                      <!-- 内层核心 -->
                      <div
                        class="w-24 h-24 mx-auto bg-black/60 rounded-full flex items-center justify-center animate-pulse-scale"
                      >
                        <div
                          class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-spin-slow brightness-110"
                        ></div>
                      </div>
                    </div>

                    <!-- 能量粒子效果 - 增强版 -->
                    <div class="absolute inset-0 pointer-events-none">
                      <div
                        v-for="i in 25"
                        :key="`energy-particle-${i}`"
                        class="energy-particle absolute w-2 h-2 rounded-full"
                        :style="{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          backgroundColor: [
                            '#FCD34D',
                            '#F97316',
                            '#EC4899',
                            '#8B5CF6',
                          ][Math.floor(Math.random() * 4)],
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${Math.random() * 2 + 1}s`,
                        }"
                      ></div>
                    </div>

                    <!-- 旋转光环效果 -->
                    <div class="absolute inset-0 pointer-events-none">
                      <div
                        class="absolute inset-4 border-2 border-yellow-400/50 rounded-full animate-spin-slow"
                      ></div>
                      <div
                        class="absolute inset-8 border border-orange-400/40 rounded-full animate-spin-reverse"
                      ></div>
                      <div
                        class="absolute inset-12 border border-red-400/30 rounded-full animate-spin-slow"
                      ></div>
                    </div>
                  </div>

                  <!-- 阶段3: 开盒结果 - 打开的盲盒 -->
                  <div
                    v-if="blindboxStage === 'opened'"
                    class="absolute inset-0 backface-hidden rounded-lg shadow-2xl flex items-center justify-center border border-yellow-300/30 overflow-hidden"
                  >
                    <!-- 打开的盲盒背景图片 -->
                    <img
                      src="/blindbox2.png"
                      alt="打开的盲盒"
                      class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 brightness-125"
                      :class="{
                        'scale-105': true,
                      }"
                    />

                    <!-- 移除结果光效遮罩 -->

                    <!-- 结果内容 - 只显示简单的状态图标 -->
                    <!-- 庆祝粒子效果 - 只在背景层 -->
                    <div
                      v-if="drawResult && drawResult.win"
                      class="absolute inset-0 pointer-events-none"
                    >
                      <div
                        v-for="i in 30"
                        :key="`celebration-particle-${i}`"
                        class="celebration-particle absolute w-3 h-3 rounded-full"
                        :style="{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          backgroundColor: [
                            '#FCD34D',
                            '#F97316',
                            '#EC4899',
                            '#8B5CF6',
                            '#06B6D4',
                            '#10B981',
                          ][Math.floor(Math.random() * 6)],
                          opacity: Math.random() * 0.8 + 0.2,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${Math.random() * 3 + 2}s`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 抽奖信息 -->
            <div class="mt-8 space-y-2">
              <div v-if="isLoggedIn()" class="relative inline-block mx-auto">
                <!-- 次数显示框 -->
                <div class="bg-white/5 backdrop-blur-sm p-3 rounded-lg">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="flex flex-col items-center">
                      <div class="text-xs text-indigo-300 mb-1">
                        今日剩余次数
                      </div>
                      <div class="text-xl font-bold text-white">
                        {{ drawInfo.remainingDrawsToday || 0 }}
                      </div>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="text-xs text-indigo-300 mb-1">总剩余次数</div>
                      <div class="text-xl font-bold text-white">
                        {{ drawInfo.remainingDraws || 0 }}
                      </div>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="text-xs text-indigo-300 mb-1">
                        助力抽奖次数
                      </div>
                      <div class="text-xl font-bold text-green-400">
                        {{ helpDraws || 0 }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 刷新按钮 -->
                <button
                  @click="refreshDrawCounts"
                  :disabled="refreshing"
                  class="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-10"
                  title="刷新次数"
                  style="margin-top: 8px; margin-right: -35px"
                >
                  <svg
                    :class="[
                      'w-4 h-4 text-white',
                      { 'animate-spin': refreshing },
                    ]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              <div v-else>
                <button
                  @click="() => openLoginReminder()"
                  class="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex mx-auto items-center shadow-lg shadow-indigo-900/30"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  连接Web3钱包
                </button>
              </div>

              <!-- 邀请好友助力按钮 -->
              <div v-if="helpConfig?.helpEnabled" class="mt-4">
                <button
                  @click="openHelpModal"
                  class="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center mx-auto"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  邀请好友助力
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动名称显示 -->
      <div v-if="lottery?.activityName" class="mb-8 text-center">
        <div
          @click="navigateToActivityDetail(lottery.activityId)"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-indigo-400/30 hover:from-indigo-500/30 hover:to-purple-500/30 transition-all cursor-pointer group"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <div class="text-left">
              <div
                class="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors"
              >
                {{ lottery.activityName }}
              </div>
            </div>
            <div
              class="w-5 h-5 text-indigo-300 group-hover:text-indigo-200 transition-colors"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动详情 -->
      <div class="relative mb-10 overflow-hidden rounded-xl">
        <!-- 背景图层（模糊） -->
        <div
          class="absolute inset-0"
          :style="{
            backgroundImage: `url(${getSafeImageUrl(lottery?.background)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px)',
            transform: 'scale(1.1)',
            zIndex: 0,
          }"
        ></div>

        <!-- 半透明遮罩层（让内容更清晰） -->
        <div class="absolute inset-0 bg-black/40 z-[1]"></div>

        <!-- Glassmorphism 内容容器 -->
        <div
          class="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg ring-1 ring-white/10 transition-all"
        >
          <img
            :src="getSafeImageUrl(lottery?.icon)"
            alt="活动图标"
            class="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-xl mb-4 md:mb-0 md:mr-6"
          />

          <div class="flex-1 text-center md:text-left text-white">
            <h1 class="text-3xl md:text-4xl font-bold mb-2">
              {{ lottery.name }}
            </h1>
            <div
              class="mb-2 flex flex-wrap justify-center md:justify-start gap-2"
            >
              <span class="text-xs px-3 py-1 rounded-full bg-indigo-600">
                {{ lottery.lotteryType === "wheel" ? "大转盘" : "盲盒" }}
              </span>
              <span class="text-xs px-3 py-1 rounded-full bg-purple-600">
                主办方: {{ lottery.sponsor }}
              </span>
            </div>
            <p class="opacity-80 mb-4">{{ lottery.description }}</p>
            <div class="opacity-60 text-sm">
              <div>
                活动时间: {{ formatDate(lottery.startTime) }} 至
                {{ formatDate(lottery.endTime) }}
              </div>
              <div v-if="lottery.rule">
                <span
                  >每人总共 {{ lottery.rule.drawLimit }} 次机会，每天限
                  {{ lottery.rule.dailyLimit }} 次</span
                >
                <span v-if="lottery.rule.additionalInfo">
                  · {{ lottery.rule.additionalInfo }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 抽奖结果展示 -->
      <div
        v-if="showResultModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      >
        <div
          class="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all animate-bounce-in border border-indigo-500/40"
        >
          <div class="text-center">
            <div
              class="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
              :class="drawResult.win ? 'bg-yellow-500' : 'bg-gray-600'"
            >
              <i
                :class="[
                  drawResult.win
                    ? 'fas fa-trophy text-yellow-200'
                    : 'fas fa-heart-broken text-white',
                  'text-4xl',
                ]"
              ></i>
            </div>

            <h3 class="text-2xl font-bold text-white mb-3">
              {{ drawResult.win ? "恭喜中奖!" : "未中奖" }}
            </h3>

            <div
              v-if="drawResult.win && drawResult.prize"
              class="bg-white bg-opacity-10 rounded-lg p-4 mb-6 border border-indigo-500/30"
            >
              <div class="text-lg font-bold text-white">
                {{ drawResult.prize.name }}
              </div>
              <div class="text-sm text-white opacity-80">
                {{ drawResult.prize.level }}
              </div>
            </div>
            <div v-else-if="!drawResult.win" class="text-white opacity-80 mb-6">
              很遗憾，本次未中奖，再接再厉！
            </div>

            <div class="text-sm text-white opacity-80 mb-4">
              <div>
                今日剩余抽奖次数:
                {{ drawInfo.remainingDrawsToday || 0 }}
              </div>
              <div>
                总共剩余抽奖次数:
                {{ drawInfo.remainingDraws || 0 }}
              </div>
              <div class="text-green-300">
                助力抽奖次数: {{ helpDraws || 0 }}
              </div>
            </div>

            <div class="flex justify-center space-x-3">
              <button
                v-if="canDraw"
                @click="handleContinueDraw"
                class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                继续抽奖
              </button>
              <button
                v-if="drawResult.win"
                @click="goToMyLottery"
                class="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                查看奖品
              </button>
              <button
                v-if="!canDraw"
                @click="closeResultModal"
                class="px-5 py-2 bg-gray-600 text-white rounded-lg"
              >
                明日再来
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 好友助力弹窗 -->
      <div
        v-if="showHelpModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="closeHelpModal"
      >
        <div
          class="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-indigo-500/20"
          @click.stop
        >
          <!-- 弹窗头部 -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-white">好友助力</h3>
            <button
              @click="closeHelpModal"
              class="text-indigo-300 hover:text-white transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 助力面板内容 -->
          <HelpInvite
            v-if="lottery"
            :lottery-id="lottery.id"
            :activity-id="lottery.activityId"
            :auto-create="true"
            @invite-created="onInviteCreated"
          />
        </div>
      </div>

      <!-- 剩余次数为0的提示弹窗 -->
      <div
        v-if="showNoDrawsModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="closeNoDrawsModal"
      >
        <div
          class="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-2xl p-6 max-w-md w-full mx-4 border border-indigo-500/20"
          @click.stop
        >
          <!-- 弹窗头部 -->
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">抽奖次数不足</h3>
            <p class="text-indigo-300 text-sm">
              您今日剩余抽奖次数为
              {{ drawInfo.remainingDrawsToday || 0 }}，总剩余次数为
              {{ drawInfo.remainingDraws || 0 }}，助力抽奖次数为
              {{ helpDraws || 0 }}
            </p>
          </div>

          <!-- 弹窗内容 -->
          <div class="space-y-4">
            <!-- 助力按钮 -->
            <div v-if="helpConfig?.helpEnabled" class="text-center">
              <button
                @click="openHelpModalFromNoDraws"
                class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                邀请好友助力
              </button>
            </div>

            <!-- 关闭按钮 -->
            <div class="text-center">
              <button
                @click="closeNoDrawsModal"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 奖品列表 -->
      <div
        class="prize-list bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 mb-10"
      >
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
          <svg
            class="w-6 h-6 mr-2 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          奖品池详情
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="prize in displayPrizes"
            :key="prize.id"
            class="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-indigo-500/20 transform transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          >
            <!-- 奖品图片 -->
            <div class="relative h-36 overflow-hidden">
              <!-- 谢谢参与奖项显示特殊占位符 -->
              <div
                v-if="prize.name === '谢谢参与'"
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800"
              >
                <div class="text-center text-white">
                  <svg
                    class="w-12 h-12 mx-auto mb-2 opacity-60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <p class="text-sm opacity-80">谢谢参与</p>
                </div>
              </div>
              <!-- 其他奖项显示图片 -->
              <img
                v-else
                :src="getSafeImageUrl(prize.image)"
                alt="奖品图片"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-900/80 text-white"
              >
                {{ prize.level }}
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
              ></div>
            </div>

            <div class="p-4">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-bold text-white">{{ prize.name }}</h3>
                <div
                  class="flex items-center bg-indigo-900/50 rounded px-2 py-1"
                >
                  <svg
                    class="w-4 h-4 text-indigo-300 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span class="text-xs text-indigo-300">
                    {{ formatProbability(prize.probability) }}
                  </span>
                </div>
              </div>

              <div class="flex justify-between items-center mt-2 text-sm">
                <div class="flex items-center text-indigo-300">
                  <!-- 稀有度图标 -->
                  <div
                    :class="[
                      getRarityIconAndColor(prize.probability).color,
                      'mr-1 flex items-center',
                    ]"
                  >
                    <!-- 传说 - 皇冠图标 -->
                    <svg
                      v-if="prize.probability < 1"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M11.9999 1L17.1962 7.6085L24.0005 8.2626L17.9951 13.3167L19.392 20L11.9999 16.8501L4.60787 20L6.0048 13.3167L-0.000488281 8.2626L6.8037 7.6085L11.9999 1Z"
                      ></path>
                    </svg>
                    <!-- 史诗 - 宝石图标 -->
                    <svg
                      v-else-if="prize.probability < 5"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L6 7L12 22L18 7L12 2Z"></path>
                    </svg>
                    <!-- 稀有 - 星星图标 -->
                    <svg
                      v-else-if="prize.probability < 10"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                      ></path>
                    </svg>
                    <!-- 高级 - 徽章图标 -->
                    <svg
                      v-else-if="prize.probability < 20"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
                      ></path>
                    </svg>
                    <!-- 普通 - 圆形图标 -->
                    <svg
                      v-else
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                      ></path>
                    </svg>
                  </div>
                  <span>稀有度: {{ formatRarity(prize.probability) }}</span>
                </div>
                <div class="text-indigo-300">
                  {{
                    formatQuantity(prize.totalQuantity, prize.remainQuantity)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享弹窗 -->
    <ShareModal
      :visible="showShareModal"
      :share-url="shareUrl"
      :share-title="shareTitle"
      :share-text="shareText"
      :share-image="shareImage"
      :user-info="shareUserInfo"
      @close="closeShareModal"
    />

    <!-- 悬浮进群按钮 -->
    <div
      class="fixed right-0 top-3/4 transform -translate-y-1/2 z-40"
      v-if="!loading && lottery"
    >
      <button
        @click="enterChatroom"
        class="group relative flex flex-col items-center justify-center bg-gradient-to-b from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm"
        style="width: 80px; height: 80px; border-radius: 40px 0 0 40px"
      >
        <div
          class="flex flex-col items-center justify-center h-full px-2 py-1"
          style="font-family: system-ui, Avenir, Helvetica, Arial, sans-serif"
        >
          <div class="flex items-center space-x-1 mb-0.5">
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span class="text-sm font-medium" style="font-family: inherit"
              >进群</span
            >
          </div>
          <div class="text-sm font-medium" style="font-family: inherit">
            享福利
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  inject,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  clearTempToken,
  getLotteryDetail,
  participateLottery,
  getHelpStats,
  getHelpConfig,
  getThirdPartyUserInfo,
  assistLottery,
  getActivityChatroomId,
  joinChatroom,
} from "../../api/lottery";
import {
  getUserInfoFromCache,
  getQueryParams,
  saveUserInfo,
  clearUserInfo,
} from "../../utils/auth";
import { getUserInfo } from "../../api/user";
import { getAppTopOffsetClass } from "../../utils/app";
import HelpInvite from "../../components/HelpInvite.vue";
import ShareModal from "../../components/ShareModal.vue";
import message from "../../utils/message";

const route = useRoute();
const router = useRouter();
const openLoginReminder = inject("openLoginReminder") as (
  message?: string,
  helpMode?: boolean
) => void;
const isLoggedIn = inject("isLoggedIn") as () => boolean;

const lottery = ref<any>(null);
const loading = ref(true);
const error = ref("");
const isDrawing = ref(false);
const refreshing = ref(false);
const wheelRef = ref<HTMLElement | null>(null);
const boxRef = ref<HTMLElement | null>(null);
const wheelRotation = ref(0);
const boxOpened = ref(false);
const blindboxStage = ref<"initial" | "opening" | "opened">("initial");
const showResultModal = ref(false);
const drawResult = ref<any>({
  win: false,
  prize: null,
  remainingDraws: 0,
  remainingDrawsToday: 0,
});

// 抽奖限制信息
const drawInfo = reactive({
  remainingDraws: 0,
  remainingDrawsToday: 0,
});

// 助力抽奖次数
const helpDraws = ref(0);
// 获得助力次数（总助力次数）
const totalHelpDraws = ref(0);

// 助力配置
const helpConfig = ref<any>(null);

// 助力弹窗显示状态
const showHelpModal = ref(false);

// 剩余次数为0的提示弹窗状态
const showNoDrawsModal = ref(false);

// 分享弹窗状态
const showShareModal = ref(false);

// 聊天室ID缓存
const cachedRoomId = ref<string | null>(null);

// 获取用户信息用于短链生成
const shareUserInfo = computed(() => {
  const userInfo = getUserInfoFromCache();
  if (userInfo && userInfo.uuid && userInfo.token && userInfo.uid) {
    return {
      uuid: userInfo.uuid,
      token: userInfo.token,
      uid: userInfo.uid,
    };
  }
  return undefined;
});

// App模式下的顶部偏移
const appTopOffsetClass = computed(() => getAppTopOffsetClass());

// 计算当前是否可以抽奖
const canDraw = computed(() => {
  return (
    isLoggedIn() &&
    (drawInfo.remainingDraws > 0 || drawInfo.remainingDrawsToday > 0)
  );
});

// 计算每个扇形的角度
const sectorAngle = computed(() => {
  if (
    !lottery.value ||
    !lottery.value.prizes ||
    lottery.value.prizes.length === 0
  )
    return 0;
  return 360 / lottery.value.prizes.length;
});

// 计算分享相关数据
const shareUrl = computed(() => {
  if (!lottery.value?.id) {
    console.warn("Lottery ID is undefined, using fallback URL");
    return window.location.origin + "/h5/lottery/";
  }

  // 使用新的分享链接格式：VITE_Aisky_URL + pages/lottery/index?page=h5/lottery/{lotteryId}
  const aiskyUrl = import.meta.env.VITE_Aisky_URL;
  if (aiskyUrl) {
    const finalUrl = `${aiskyUrl}pages/lottery/index?page=h5/lottery/${lottery.value.id}`;
    console.log("Generated share URL:", finalUrl);
    return finalUrl;
  }

  // 如果 VITE_Aisky_URL 不存在，使用原来的逻辑作为后备
  const currentUrl = new URL(window.location.href);
  const basePath = currentUrl.pathname;

  // 确保路径格式正确
  let sharePath = basePath;
  if (!sharePath.includes("/h5/lottery/")) {
    sharePath = `/h5/lottery/${lottery.value.id}`;
  }

  const finalUrl = `${window.location.origin}${sharePath}`;
  console.log("Generated fallback share URL:", finalUrl);
  return finalUrl;
});

const shareTitle = computed(() => {
  return lottery.value?.name || "精彩抽奖活动";
});

const shareText = computed(() => {
  return (
    lottery.value?.description || "快来参与这个精彩的抽奖活动，赢取丰厚奖品！"
  );
});

const shareImage = computed(() => {
  return lottery.value?.icon || lottery.value?.background;
});

// 返回按钮的逻辑
const backButtonConfig = computed(() => {
  const direct = route.query.direct as string;
  if (direct === "1") {
    return {
      to: "/lottery",
      text: "返回抽奖列表",
    };
  } else {
    return {
      to: "/",
      text: "返回星际港",
    };
  }
});

// 处理返回按钮点击
function handleBackClick() {
  const direct = route.query.direct as string;
  if (direct === "1") {
    router.push("/lottery");
  } else {
    router.back();
  }
}

// 检查是否在uniapp环境
function isInUniApp(): Promise<boolean> {
  return Promise.resolve(true);
  /*return new Promise((resolve) => {
    if (typeof (window as any).uni !== "undefined") {
      // 使用uni.getEnv()进行准确的环境检测
      (window as any).uni.getEnv(function (res: any) {
        console.log("当前环境：" + JSON.stringify(res));
        // 如果返回了环境信息，说明在uniapp环境中
        resolve(res && (res.uvue || res.nvue || res.plus));
      });
    } else {
      // uni对象不存在，检查其他标识
      const isUniApp =
        typeof (window as any).plus !== "undefined" ||
        /uni-app/i.test(navigator.userAgent);
      resolve(isUniApp);
    }
  });*/
}

// 等待UniAppJSBridgeReady事件的Promise
function waitForUniAppJSBridge(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof (window as any).uni !== "undefined") {
      // uni对象已存在，直接resolve
      resolve();
    } else {
      // 等待UniAppJSBridgeReady事件
      const handleReady = () => {
        console.log("UniAppJSBridgeReady 事件触发，uni对象已可用");
        document.removeEventListener("UniAppJSBridgeReady", handleReady);
        resolve();
      };
      document.addEventListener("UniAppJSBridgeReady", handleReady);

      // 设置超时，避免无限等待
      setTimeout(() => {
        console.warn("等待UniAppJSBridgeReady超时，尝试直接调用");
        document.removeEventListener("UniAppJSBridgeReady", handleReady);
        resolve();
      }, 5000);
    }
  });
}

// 跳转到Aisky活动详情页
async function navigateToActivityDetail(activityId: string) {
  uni.navigateTo({
    url: "/pages/activity/details/index?activityId=" + activityId,
  });
}

// 检查URL参数并获取用户信息
async function checkUrlParamsAndGetUserInfo() {
  const queryParams = getQueryParams();
  const { uid, uuid, token } = queryParams;

  // 如果URL中包含这三个参数，则清除现有缓存并执行自动登录
  if (uid && uuid && token) {
    try {
      console.log("检测到URL参数，清除现有缓存并执行自动登录...", {
        uid,
        uuid,
        token,
      });

      // 清除现有缓存
      clearUserInfo();
      console.log("已清除现有用户缓存");

      // 调用接口获取用户信息
      const response = await getUserInfo({ uid, uuid, token });

      if (
        response.data &&
        response.data.status === 200 &&
        response.data.attachment
      ) {
        const userData = response.data.attachment;
        console.log("获取用户信息成功:", userData);

        // 保存用户信息到本地缓存
        saveUserInfo({
          uuid: userData.uuid,
          token: token,
          uid: userData.uid,
          openName: userData.openName || "用户",
        });

        console.log("用户信息已保存到本地缓存");
      } else {
        console.error("获取用户信息失败:", response.data);
      }
    } catch (error) {
      console.error("调用用户信息接口失败:", error);
    }
  }
}

// 处理help参数和helpcode参数
async function handleHelpParam() {
  const helpParam = route.query.help as string;
  const helpcode = route.query.helpcode as string;

  // 处理helpcode参数 - 执行助力操作
  if (helpcode) {
    console.log("检测到helpcode参数:", helpcode);
    await performHelpAssist(helpcode);

    // 清除URL中的helpcode参数
    const newQuery = { ...route.query };
    delete newQuery.helpcode;
    router.replace({ query: newQuery });
    return;
  }

  // 处理help参数 - 显示提示信息
  if (helpParam) {
    console.log("检测到help参数:", helpParam);

    if (helpParam === "ok") {
      message.success("助力成功！");
    } else {
      message.info(helpParam);
    }

    // 清除URL中的help参数，避免刷新页面时重复显示
    const newQuery = { ...route.query };
    delete newQuery.help;
    router.replace({ query: newQuery });
  }
}

// 执行助力操作
async function performHelpAssist(helpcode: string) {
  try {
    console.log("开始执行助力操作，helpcode:", helpcode);

    // 获取当前用户信息
    const userInfo = getUserInfoFromCache();
    if (!userInfo?.uid) {
      console.log("用户未登录，弹出登录提醒");
      openLoginReminder("您还没有登录，请登录后再助力好友", true);
      return;
    }

    // 调用助力API
    const response = await assistLottery(helpcode, userInfo.uid);

    console.log("助力API响应:", response);

    if (response.data?.code === 0) {
      // 助力成功
      message.success("助力成功！");

      // 刷新助力统计信息
      if (lottery.value?.id) {
        try {
          const helpStatsRes = await getHelpStats(
            lottery.value.id,
            userInfo.uid
          );
          if (helpStatsRes.data?.code === 0) {
            helpDraws.value = helpStatsRes.data.data?.remainingHelpDraws || 0;
            totalHelpDraws.value = helpStatsRes.data.data?.totalHelpDraws || 0;
            console.log("助力统计已刷新:", helpDraws.value);
            console.log("获得助力次数已刷新:", totalHelpDraws.value);
          }
        } catch (error) {
          console.error("刷新助力统计失败:", error);
        }
      }
    } else {
      // 助力失败
      const errorMsg = response.data?.msg || "助力失败，请重试";
      message.info(errorMsg);
    }
  } catch (error) {
    console.error("助力操作失败:", error);
    message.info("网络错误，请稍后再试");
  }
}

// 校验用户信息（异步操作）
async function validateUserInfo() {
  const userInfo = getUserInfoFromCache();

  // 如果用户已登录，则进行数据校验
  if (userInfo && userInfo.uuid && userInfo.token && userInfo.uid) {
    try {
      console.log("开始校验用户信息...", {
        uuid: userInfo.uuid,
        uid: userInfo.uid,
      });

      const response = await getThirdPartyUserInfo(
        userInfo.uuid,
        userInfo.token,
        userInfo.uid
      );

      if (response.data && response.data.status === 200) {
        console.log("用户信息校验成功:", response.data.attachment);

        // 校验成功，更新缓存中的用户信息
        const userData = response.data.attachment;
        saveUserInfo({
          uuid: userData.uuid,
          token: userInfo.token, // 保持原有token
          uid: userData.uid,
          openName: userData.openName || userInfo.openName,
        });

        return true;
      } else {
        console.warn("用户信息校验失败:", response.data);
        return false;
      }
    } catch (error: any) {
      console.error("用户信息校验异常:", error);

      // 检查是否是Token相关错误
      if (
        error.response?.data?.status === 9999 ||
        error.response?.data?.message?.includes("token") ||
        error.response?.data?.message?.includes("Token")
      ) {
        console.log("检测到Token错误，需要重新登录");
        return false;
      }

      // 其他错误也返回false，触发重新登录
      return false;
    }
  }

  return true; // 未登录用户不需要校验
}

// 检查URL是否有效
function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    // 检查协议是否为http或https
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

// 获取安全的图片URL
function getSafeImageUrl(url: string | null | undefined): string {
  if (!url || !isValidUrl(url)) {
    return "https://img.aisky.io/api/aQAdzWGNitaaleNn.png";
  }
  return url;
}

// 获取聊天室roomId（带缓存）
async function getChatroomId(): Promise<string> {
  try {
    // 如果已有缓存，直接返回
    if (cachedRoomId.value) {
      return cachedRoomId.value;
    }

    let roomId: string;

    // 如果抽奖详情绑定了活动，即activityId不为空
    if (lottery.value?.activityId) {
      const userInfo = getUserInfoFromCache();
      if (!userInfo || !userInfo.uid || !userInfo.uuid || !userInfo.token) {
        throw new Error("用户信息不完整，无法获取聊天室ID");
      }

      // 调用第三方接口获取chatroomId
      const res = await getActivityChatroomId(
        userInfo.uuid,
        userInfo.token,
        userInfo.uid,
        lottery.value.activityId
      );

      if (
        res.data &&
        res.data.status === 200 &&
        res.data.attachment?.activity?.chatroomId
      ) {
        roomId = res.data.attachment.activity.chatroomId.toString();
      } else {
        // 如果第三方接口返回的chatroomId为空，则使用默认值
        console.log("第三方接口返回的chatroomId为空，使用默认聊天室ID");
        const defaultChatroomId = import.meta.env.VITE_Lottery_ChatRoomId;
        if (!defaultChatroomId) {
          throw new Error("未配置默认聊天室ID");
        }
        roomId = defaultChatroomId;
      }
    } else {
      // 如果未绑定活动，则直接使用环境变量中的值
      const defaultChatroomId = import.meta.env.VITE_Lottery_ChatRoomId;
      if (!defaultChatroomId) {
        throw new Error("未配置默认聊天室ID");
      }
      roomId = defaultChatroomId;
    }

    // 缓存roomId
    cachedRoomId.value = roomId;
    return roomId;
  } catch (error) {
    console.error("获取聊天室ID失败:", error);
    throw error;
  }
}

// 静默加入聊天室
async function silentlyJoinChatroom() {
  try {
    const userInfo = getUserInfoFromCache();
    if (!userInfo || !userInfo.uid || !userInfo.uuid || !userInfo.token) {
      return; // 用户信息不完整，静默跳过
    }

    const roomId = await getChatroomId();

    // 静默调用第三方接口，不处理成功/失败
    joinChatroom(
      userInfo.uuid,
      userInfo.token,
      userInfo.uid,
      roomId,
      userInfo.openName || "用户"
    ).catch((error) => {
      // 静默处理错误，不显示给用户
      console.log("静默加入聊天室失败:", error);
    });
  } catch (error) {
    // 静默处理错误，不显示给用户
    console.log("获取聊天室ID失败，跳过加入聊天室:", error);
  }
}

// 进入聊天室
async function enterChatroom() {
  try {
    const roomId = await getChatroomId();

    // 检查是否在uni-app环境中
    if (
      typeof (window as any).uni !== "undefined" &&
      (window as any).uni.navigateTo
    ) {
      (window as any).uni.navigateTo({
        url: `/pages/chatroom/chat/index?roomId=${roomId}&back=1`,
      });
    } else {
      // 如果不在uni-app环境中，可以显示提示或跳转到其他页面
      message.warning("当前环境不支持聊天室功能");
    }
  } catch (error) {
    console.error("进入聊天室失败:", error);
    message.error("进入聊天室失败，请稍后再试");
  }
}

// 获取抽奖活动详情
async function fetchLotteryDetail() {
  loading.value = true;
  error.value = "";

  try {
    const lotteryId = Number(route.params.id);
    if (isNaN(lotteryId)) {
      lottery.value = null;
      return;
    }

    // 获取用户信息，如果已登录则传递uid
    const userInfo = getUserInfoFromCache();
    const uid = userInfo?.uid || null;

    const res = await getLotteryDetail(lotteryId, uid);
    if (res.data && res.data.code === 0) {
      lottery.value = res.data.data;
      console.log("获取到的抽奖详情:", lottery.value);
      console.log("activityId:", lottery.value?.activityId);

      // 检查是否存在"谢谢参与"奖项
      const hasThanksItem =
        lottery.value.prizes &&
        lottery.value.prizes.some(
          (p: any) => p.name.includes("谢谢参与") || p.level.includes("未中奖")
        );

      // 如果没有"谢谢参与"奖项，添加一个到前端展示（不会保存到后端）
      if (
        !hasThanksItem &&
        lottery.value.prizes &&
        lottery.value.prizes.length > 0
      ) {
        console.warn("抽奖活动添加前端'谢谢参与'奖项，请在后台配置正式添加");

        // 为转盘添加"谢谢参与"奖项
        lottery.value.prizes.push({
          id: "thanks-item-" + Date.now(), // 生成一个临时ID
          lotteryId: lottery.value.id,
          level: "未中奖",
          name: "谢谢参与",
          probability: 50, // 设一个高概率值
          image: null,
        });
      }

      // 如果接口返回了剩余次数，则使用接口返回的值
      if (lottery.value.remainingDraws !== undefined) {
        drawInfo.remainingDraws = lottery.value.remainingDraws;
      } else if (lottery.value.rule) {
        // 否则使用规则中的默认值
        drawInfo.remainingDraws = lottery.value.rule.drawLimit;
      }

      if (lottery.value.remainingDrawsToday !== undefined) {
        drawInfo.remainingDrawsToday = lottery.value.remainingDrawsToday;
      } else if (lottery.value.rule) {
        // 否则使用规则中的默认值
        drawInfo.remainingDrawsToday = lottery.value.rule.dailyLimit;
      }

      // 获取助力配置
      try {
        const configRes = await getHelpConfig(lotteryId);
        if (configRes.data?.code === 0) {
          helpConfig.value = configRes.data.data;
        }
      } catch (error) {
        console.error("获取助力配置失败:", error);
      }

      // 获取助力统计信息
      if (isLoggedIn()) {
        try {
          const userInfo = getUserInfoFromCache();
          if (userInfo?.uid) {
            const helpStatsRes = await getHelpStats(lotteryId, userInfo.uid);
            if (helpStatsRes.data?.code === 0) {
              helpDraws.value = helpStatsRes.data.data?.remainingHelpDraws || 0;
              totalHelpDraws.value =
                helpStatsRes.data.data?.totalHelpDraws || 0;
            }
          }
        } catch (error) {
          console.error("获取助力统计失败:", error);
        }
      }
    } else {
      lottery.value = null;
      throw new Error(res.data?.msg || "获取抽奖活动详情失败");
    }
  } catch (err: any) {
    console.error("获取抽奖活动详情失败:", err);

    // 处理临时token错误
    if (err.message.includes("临时授权")) {
      error.value = "无法获取临时授权，请刷新页面重试";
      clearTempToken(); // 清除可能失效的token
    } else {
      error.value = err.message || "网络错误，请稍后再试";
    }

    lottery.value = null;
  } finally {
    loading.value = false;
  }
}

// 重试获取数据
function retryFetch() {
  clearTempToken(); // 清除可能失效的token
  fetchLotteryDetail();
}

// 刷新抽奖次数
async function refreshDrawCounts() {
  if (refreshing.value) return;

  refreshing.value = true;
  try {
    console.log("开始刷新抽奖次数");

    // 重新获取抽奖详情
    await fetchLotteryDetail();

    // 如果用户已登录，重新获取助力统计
    if (isLoggedIn()) {
      const userInfo = getUserInfoFromCache();
      if (userInfo?.uid) {
        try {
          const helpStatsRes = await getHelpStats(
            lottery.value.id,
            userInfo.uid
          );
          if (helpStatsRes.data?.code === 0) {
            helpDraws.value = helpStatsRes.data.data?.remainingHelpDraws || 0;
            totalHelpDraws.value = helpStatsRes.data.data?.totalHelpDraws || 0;
            console.log("助力抽奖次数已刷新:", helpDraws.value);
            console.log("获得助力次数已刷新:", totalHelpDraws.value);
          }
        } catch (error) {
          console.error("刷新助力统计失败:", error);
        }
      }
    }

    console.log("抽奖次数刷新完成");
  } catch (error) {
    console.error("刷新抽奖次数失败:", error);
  } finally {
    refreshing.value = false;
  }
}

// 日期格式化
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

// 获取奖品颜色
function getPrizeColor(index: number) {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA5A5",
    "#845EC2",
    "#D65DB1",
    "#FF9671",
    "#FFC75F",
    "#F9F871",
    "#B39CD0",
    "#00C9A7",
    "#C34A36",
  ];
  return colors[index % colors.length];
}

// 格式化概率显示
function formatProbability(probability?: number): string {
  if (probability === undefined || probability === null) return "未知";
  // 概率已经是百分比，不需要再乘以100
  return `${Number(probability).toFixed(2)}%`;
}

// 格式化稀有度
function formatRarity(probability?: number): string {
  if (probability === undefined || probability === null) return "未知";

  // 概率已经是百分比，所以判断条件也需要调整
  if (probability < 1) return "传说";
  if (probability < 5) return "史诗";
  if (probability < 10) return "稀有";
  if (probability < 20) return "优秀";
  return "普通";
}

// 获取稀有度图标和颜色
function getRarityIconAndColor(probability?: number): {
  icon: string;
  color: string;
} {
  if (probability === undefined || probability === null) {
    return { icon: "question-circle", color: "text-gray-400" };
  }

  if (probability < 1) {
    return { icon: "crown", color: "text-yellow-500" }; // 传说 - 皇冠图标，金色
  }
  if (probability < 5) {
    return { icon: "gem", color: "text-purple-500" }; // 史诗 - 宝石图标，紫色
  }
  if (probability < 10) {
    return { icon: "star", color: "text-blue-500" }; // 稀有 - 星星图标，蓝色
  }
  if (probability < 20) {
    return { icon: "certificate", color: "text-green-500" }; // 优秀 - 证书图标，绿色
  }
  return { icon: "circle", color: "text-gray-400" }; // 普通 - 圆形图标，灰色
}

// 格式化数量信息
function formatQuantity(quantity?: number, remaining?: number): string {
  if (quantity === undefined || quantity === null) return "无限制";

  if (remaining !== undefined && remaining !== null) {
    return `${remaining}/${quantity}`;
  }

  return `总量: ${quantity}`;
}

// 计算属性：过滤后的奖品列表（不包括"谢谢参与"）
const displayPrizes = computed(() => {
  if (!lottery.value?.prizes) return [];
  return lottery.value.prizes.filter(
    (prize: any) =>
      !prize.name?.includes("谢谢参与") && !prize.level?.includes("未中奖")
  );
});

// 参与抽奖
async function startDraw() {
  console.log(
    "isDrawing.value",
    isDrawing.value,
    "canDraw.value",
    canDraw.value
  );
  if (isDrawing.value || !canDraw.value) return;

  isDrawing.value = true;

  // 立即更新前端显示（自动减一）
  if (drawInfo.remainingDrawsToday > 0) {
    drawInfo.remainingDrawsToday -= 1;
    drawInfo.remainingDraws -= 1;
  }

  // 立即开始转盘动画（不等待API返回）
  if (lottery.value.lotteryType === "wheel") {
    // 先随机旋转，等API返回后再调整到正确位置
    spinWheelRandom();
  } else if (lottery.value.lotteryType === "box") {
    openBox();
  }

  try {
    const userInfo = getUserInfoFromCache();
    if (!userInfo || !userInfo.uid || !userInfo.uuid || !userInfo.token) {
      console.error("用户信息不完整，无法参与抽奖");
      openLoginReminder();
      isDrawing.value = false;
      return;
    }

    const lotteryId = Number(route.params.id);
    const res = await participateLottery(
      lotteryId,
      userInfo.uid,
      userInfo.uuid,
      userInfo.token
    );

    if (res.data && res.data.code === 0) {
      const result = res.data.data;

      // 使用后端返回的准确数据更新抽奖次数
      drawInfo.remainingDraws = result.remainingDraws;
      drawInfo.remainingDrawsToday = result.remainingDrawsToday;

      // 更新助力抽奖次数
      if (result.remainingHelpDraws !== undefined) {
        helpDraws.value = result.remainingHelpDraws;
      }

      // 抽奖成功后，静默调用加入聊天室接口
      silentlyJoinChatroom();

      // 存储抽奖结果
      drawResult.value = {
        win: result.win,
        prize: result.prize,
        winnerId: result.winnerId,
        remainingDraws: result.remainingDraws,
        remainingDrawsToday: result.remainingDrawsToday,
        helpDraws: result.helpDraws,
      };

      // 根据抽奖形式调整到正确结果位置
      if (lottery.value.lotteryType === "wheel") {
        // 如果未中奖，找到转盘上的"谢谢参与"奖项
        if (!result.win) {
          const thanksItem = lottery.value.prizes.find(
            (p: any) =>
              p.name.includes("谢谢参与") || p.level.includes("未中奖")
          );
          if (thanksItem) {
            spinWheelToResult(thanksItem);
          } else {
            // 如果转盘上没有"谢谢参与"，随机指向一个位置
            const randomIndex = Math.floor(
              Math.random() * lottery.value.prizes.length
            );
            spinWheelToResult(lottery.value.prizes[randomIndex]);
            console.warn('转盘上没有"谢谢参与"奖项，请在后台配置添加');
          }
        } else {
          spinWheelToResult(result.prize);
        }
      }
    } else {
      // 抽奖失败，回滚前端预更新的次数
      rollbackDrawCounts();
      message.error("抽奖失败，请稍后再试");
      isDrawing.value = false;
    }
  } catch (error) {
    console.error("参与抽奖失败:", error);
    // 网络错误，回滚前端预更新的次数
    rollbackDrawCounts();
    message.error("网络错误，请稍后再试");
    isDrawing.value = false;
  }
}

// 回滚抽奖次数（当抽奖失败时使用）
function rollbackDrawCounts() {
  // 回滚逻辑：将减去的次数加回来
  drawInfo.remainingDrawsToday += 1;
  drawInfo.remainingDraws += 1;
}

// 随机旋转转盘（点击时立即开始）
function spinWheelRandom() {
  if (!wheelRef.value || !lottery.value?.prizes) return;

  // 从当前位置继续旋转，增加随机角度
  // 使用较大的随机角度，确保转盘有明显的旋转效果
  const currentRotation = wheelRotation.value;
  const additionalRotation = 3600 + Math.random() * 1800; // 10-15圈随机旋转
  wheelRotation.value = currentRotation + additionalRotation;
}

// 旋转转盘到指定结果位置
function spinWheelToResult(prize: any) {
  if (!wheelRef.value || !lottery.value?.prizes) return;

  // 确定要旋转到的位置
  let targetIndex = 0;
  if (prize) {
    targetIndex = lottery.value.prizes.findIndex((p: any) => p.id === prize.id);
    if (targetIndex === -1) targetIndex = 0;
  }

  // 计算目标角度
  // 指针固定在12点钟方向，转盘需要反向旋转来让指针指向目标奖项
  // 目标奖项的中心角度 = targetIndex * sectorAngle + sectorAngle/2
  // 转盘需要旋转的角度 = 360 - 目标奖项的中心角度
  const targetPrizeCenterAngle =
    targetIndex * sectorAngle.value + sectorAngle.value / 2;
  const finalTargetRotation = 360 - targetPrizeCenterAngle;

  // 简化逻辑：直接计算最终目标角度
  // 在随机旋转的基础上，继续旋转到最终位置
  const currentRotation = wheelRotation.value;
  const additionalRotation = finalTargetRotation - (currentRotation % 360);

  // 确保 additionalRotation 为正数，避免反向转动
  const normalizedAdditionalRotation =
    additionalRotation < 0 ? additionalRotation + 360 : additionalRotation;
  const targetRotation = currentRotation + normalizedAdditionalRotation;

  // 设置旋转动画到正确位置
  wheelRotation.value = targetRotation;

  // 动画结束后显示结果（等待完整的5秒动画完成）
  setTimeout(() => {
    showResultModal.value = true;
    isDrawing.value = false;
  }, 5000); // 与CSS动画时长保持一致
}

// 旋转转盘（保留原函数用于兼容）
function spinWheel(prize: any) {
  if (!wheelRef.value || !lottery.value?.prizes) return;

  // 确定要旋转到的位置
  let targetIndex = 0;
  if (prize) {
    targetIndex = lottery.value.prizes.findIndex((p: any) => p.id === prize.id);
    if (targetIndex === -1) targetIndex = 0;
  }

  // 计算目标角度（多转几圈再停在目标位置）
  const baseRotation = 3600; // 多转10圈
  const targetRotation = baseRotation + (360 - targetIndex * sectorAngle.value);

  // 设置旋转动画
  wheelRotation.value = targetRotation;

  // 动画结束后显示结果
  setTimeout(() => {
    showResultModal.value = true;
    isDrawing.value = false;
  }, 5000); // 动画时长
}

// 打开盲盒 - 新的多阶段动画
function openBox() {
  if (!boxRef.value) return;

  // 阶段1: 开启动效 - 星爆能量 (1.5秒)
  blindboxStage.value = "opening";

  setTimeout(() => {
    // 阶段2: 开盒结果 - 打开的盲盒 (2.5秒)
    blindboxStage.value = "opened";

    // 显示结果弹窗
    setTimeout(() => {
      showResultModal.value = true;
      isDrawing.value = false;
    }, 2500);

    // 重置盲盒状态（为下次抽奖做准备）
    setTimeout(() => {
      blindboxStage.value = "initial";
    }, 4000);
  }, 1500);
}

// 处理继续抽奖按钮点击
function handleContinueDraw() {
  // 关闭结果弹窗
  showResultModal.value = false;

  // 检查今日剩余次数
  if (drawInfo.remainingDrawsToday <= 0) {
    console.log("今日剩余次数为0，打开助力邀请窗口");
    // 如果助力功能开启，直接显示助力邀请窗口
    if (helpConfig.value?.helpEnabled) {
      showHelpModal.value = true;
    } else {
      message.info("今日抽奖次数已用完，请明天再来");
    }
  }
  // 如果不为0，用户可以继续抽奖（不重置转盘状态）
}

// 关闭结果弹窗
function closeResultModal() {
  showResultModal.value = false;
  // 不重置转盘状态，让转盘保持在当前位置
  // 下次抽奖时会从当前位置继续旋转
}

// 跳转到"我的抽奖"页面
function goToMyLottery() {
  showResultModal.value = false;
  router.push("/my-lottery");
}

// 参与抽奖按钮点击事件
function handleDrawClick() {
  console.log("点击抽奖按钮");
  console.log("canDraw:", canDraw.value);
  console.log("drawInfo:", drawInfo);
  console.log("helpDraws:", helpDraws.value);

  // 检查登录状态
  if (!isLoggedIn()) {
    // 未登录时，打开登录窗口
    openLoginReminder();
    return;
  }

  // 检查是否完全没有抽奖次数（包括助力次数）
  if (drawInfo.remainingDrawsToday <= 0) {
    console.log("今日剩余次数为0且助力次数为0，显示助力邀请窗口");
    // 如果助力功能开启，直接显示助力邀请窗口
    if (helpConfig.value?.helpEnabled) {
      showHelpModal.value = true;
    } else {
      showNoDrawsModal.value = true;
    }
    return;
  }

  // 如果不可抽奖，直接返回
  if (!canDraw.value) {
    console.log("不可抽奖，检查原因");

    // 已登录但剩余次数为0，显示提示弹窗
    if (
      drawInfo.remainingDraws <= 0 &&
      drawInfo.remainingDrawsToday <= 0 &&
      helpDraws.value <= 0
    ) {
      console.log("剩余次数为0，显示提示弹窗");
      showNoDrawsModal.value = true;
      return;
    }

    return;
  }

  // 已登录且有剩余次数，开始抽奖
  console.log("开始抽奖");
  startDraw();
}

// 助力邀请创建成功回调
async function onInviteCreated(invite: any) {
  // 更新助力抽奖次数
  try {
    const userInfo = getUserInfoFromCache();
    if (userInfo?.uid) {
      const helpStatsRes = await getHelpStats(lottery.value.id, userInfo.uid);
      if (helpStatsRes.data?.code === 0) {
        helpDraws.value = helpStatsRes.data.data?.remainingHelpDraws || 0;
        totalHelpDraws.value = helpStatsRes.data.data?.totalHelpDraws || 0;
      }
    }
  } catch (error) {
    console.error("更新助力统计失败:", error);
  }
}

// 打开助力弹窗
function openHelpModal() {
  if (!isLoggedIn()) {
    openLoginReminder();
    return;
  }
  showHelpModal.value = true;
}

// 关闭助力弹窗
function closeHelpModal() {
  showHelpModal.value = false;
}

// 关闭剩余次数为0的提示弹窗
function closeNoDrawsModal() {
  showNoDrawsModal.value = false;
}

// 从剩余次数为0的弹窗中打开助力弹窗
function openHelpModalFromNoDraws() {
  closeNoDrawsModal();
  openHelpModal();
}

// 打开分享弹窗
function openShareModal() {
  showShareModal.value = true;
}

// 关闭分享弹窗
function closeShareModal() {
  showShareModal.value = false;
}

// 根据索引获取转盘扇区SVG路径
function getWheelSectorPath(index: number): string {
  const startAngle = index * sectorAngle.value;
  const endAngle = (index + 1) * sectorAngle.value;

  // SVG圆形中，0度在东方(3点钟方向)，顺时针旋转
  // 转换为数学角度，0度在北方(12点钟方向)，顺时针旋转
  const x1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
  const y1 = 50 - 50 * Math.cos((startAngle * Math.PI) / 180);
  const x2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
  const y2 = 50 - 50 * Math.cos((endAngle * Math.PI) / 180);

  // 使用大圆弧标志 (大于180度时为1，否则为0)
  const largeArcFlag = sectorAngle.value > 180 ? 1 : 0;

  // 构建路径: 从中心点到第一个角度，然后画弧到第二个角度，然后回到中心点
  return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

// 获取奖品图片位置
function getImagePosition(index: number) {
  const angle =
    ((index * sectorAngle.value + sectorAngle.value / 2) * Math.PI) / 180;
  const r = 30; // 从中心点算起的半径距离

  return {
    x: 50 + r * Math.sin(angle) - 7.5, // 7.5是图片宽度的一半
    y: 50 - r * Math.cos(angle) - 7.5, // 7.5是图片高度的一半
  };
}

// 获取文字弧线路径
function getTextArcPath(index: number) {
  const startAngle = index * sectorAngle.value;
  const endAngle = (index + 1) * sectorAngle.value;

  // 计算弧线的中心角度
  const midAngle = (startAngle + endAngle) / 2;

  // 生成文字弧线半径（更靠近转盘边缘，与图片保持距离）
  // 转盘半径是50，图片在35位置，文字放在42位置，与图片保持7个单位的距离
  const textRadius = 42;

  // 调整弧长，使其比扇区短一些，避免文字太贴近边缘
  const arcAngleSpan = sectorAngle.value * 0.6; // 稍微缩短弧长，避免文字过于分散
  const textStartAngle = midAngle - arcAngleSpan / 2;
  const textEndAngle = midAngle + arcAngleSpan / 2;

  // 转换为弧度
  const startRad = (textStartAngle * Math.PI) / 180;
  const endRad = (textEndAngle * Math.PI) / 180;

  // 计算弧线起点和终点
  const x1 = 50 + textRadius * Math.sin(startRad);
  const y1 = 50 - textRadius * Math.cos(startRad);
  const x2 = 50 + textRadius * Math.sin(endRad);
  const y2 = 50 - textRadius * Math.cos(endRad);

  // 判断是否需要反向绘制（确保文字方向正确）
  const needReverse = midAngle > 90 && midAngle < 270;

  // 生成路径
  return needReverse
    ? `M ${x2} ${y2} A ${textRadius} ${textRadius} 0 0 0 ${x1} ${y1}`
    : `M ${x1} ${y1} A ${textRadius} ${textRadius} 0 0 1 ${x2} ${y2}`;
}

// 监听登录成功事件
function handleLoginSuccess(event: any) {
  console.log("收到登录成功事件:", event.detail);
  const { token, uuid, uid } = event.detail;

  // 更新缓存中的用户信息
  saveUserInfo({
    uuid,
    token,
    uid,
    openName: "用户", // 这里可以后续通过API获取完整信息
  });

  // 重新获取抽奖详情
  fetchLotteryDetail();
}

onMounted(async () => {
  // 首先检查URL参数并获取用户信息
  await checkUrlParamsAndGetUserInfo();

  // 处理help参数和helpcode参数
  await handleHelpParam();

  // 然后进行用户信息校验（异步操作，不阻塞页面加载）
  validateUserInfo()
    .then((isValid) => {
      if (!isValid) {
        console.log("用户信息校验失败，需要重新登录");
        // 如果校验失败，打开登录弹窗
        if (isLoggedIn()) {
          openLoginReminder();
        }
      }
    })
    .catch((error) => {
      console.error("用户信息校验过程中发生错误:", error);
    });

  // 监听登录成功事件
  window.addEventListener("login-success", handleLoginSuccess);

  // 获取抽奖详情
  fetchLotteryDetail();
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener("login-success", handleLoginSuccess);
});
</script>

<style scoped>
/* 星空背景动画 */
.stars-container {
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

.star {
  background: white;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.cosmos-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheel-circle {
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* 转盘文字效果增强 */
.wheel-prize-text {
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8), 0 1px 1px #000;
  letter-spacing: 0.1px;
  dominant-baseline: middle;
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.7));
}

.duration-5000 {
  transition-duration: 5000ms;
}

.transform-gpu {
  transform: translateZ(0);
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotateY-180 {
  transform: rotateY(180deg);
}

.box-open {
  transform: rotateY(180deg);
}

.perspective-1000 {
  perspective: 1000px;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s;
}

/* 粒子动画效果 */
.particle {
  animation: floating ease-in-out infinite;
}

.win-particle {
  animation: winFloating ease-in-out infinite;
}

@keyframes floating {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(0) translateX(10px);
  }
  75% {
    transform: translateY(10px) translateX(5px);
  }
}

@keyframes winFloating {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-15px) translateX(10px) scale(1.2);
    opacity: 0.9;
  }
  100% {
    transform: translateY(-30px) translateX(20px) scale(0.5);
    opacity: 0;
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 抽奖按钮动画效果 */
@keyframes pulse-button {
  0% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 193, 7, 0.6),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  25% {
    transform: scale(1.008);
    box-shadow: 0 0 25px rgba(255, 215, 0, 1), 0 0 50px rgba(255, 193, 7, 0.8),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.015);
    box-shadow: 0 0 30px rgba(255, 215, 0, 1.2), 0 0 60px rgba(255, 193, 7, 1),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  75% {
    transform: scale(1.008);
    box-shadow: 0 0 25px rgba(255, 215, 0, 1), 0 0 50px rgba(255, 193, 7, 0.8),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 193, 7, 0.6),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

@keyframes text-glow {
  0% {
    text-shadow: 2px 2px 0px #b8860b, 4px 4px 8px rgba(0, 0, 0, 0.6),
      0 0 15px #ffd700, 0 0 25px #ffa500;
  }
  25% {
    text-shadow: 2px 2px 0px #b8860b, 4px 4px 8px rgba(0, 0, 0, 0.6),
      0 0 20px #ffd700, 0 0 35px #ffa500;
  }
  50% {
    text-shadow: 2px 2px 0px #b8860b, 4px 4px 8px rgba(0, 0, 0, 0.6),
      0 0 25px #ffd700, 0 0 45px #ffa500, 0 0 65px rgba(255, 215, 0, 0.8);
  }
  75% {
    text-shadow: 2px 2px 0px #b8860b, 4px 4px 8px rgba(0, 0, 0, 0.6),
      0 0 20px #ffd700, 0 0 35px #ffa500;
  }
  100% {
    text-shadow: 2px 2px 0px #b8860b, 4px 4px 8px rgba(0, 0, 0, 0.6),
      0 0 15px #ffd700, 0 0 25px #ffa500;
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

@keyframes button-hover {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes button-click {
  0% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1.1);
  }
}

/* 应用动画类 */
.animate-pulse-button {
  animation: pulse-button 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-text-glow {
  animation: text-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-out infinite;
}

.button-hover-effect:hover {
  animation: button-hover 0.3s ease-out forwards;
}

.button-click-effect:active {
  animation: button-click 0.2s ease-out;
}

/* 盲盒动画效果 */
@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.6),
      0 0 60px rgba(236, 72, 153, 0.4);
  }
  100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-fast {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes pulse-scale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes rainbow-shift {
  0% {
    background: linear-gradient(
      45deg,
      rgba(139, 92, 246, 0.2),
      rgba(236, 72, 153, 0.2),
      rgba(6, 182, 212, 0.2)
    );
  }
  33% {
    background: linear-gradient(
      45deg,
      rgba(236, 72, 153, 0.2),
      rgba(6, 182, 212, 0.2),
      rgba(16, 185, 129, 0.2)
    );
  }
  66% {
    background: linear-gradient(
      45deg,
      rgba(6, 182, 212, 0.2),
      rgba(16, 185, 129, 0.2),
      rgba(245, 158, 11, 0.2)
    );
  }
  100% {
    background: linear-gradient(
      45deg,
      rgba(139, 92, 246, 0.2),
      rgba(236, 72, 153, 0.2),
      rgba(6, 182, 212, 0.2)
    );
  }
}

@keyframes energy-float {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-10px) translateX(5px) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-5px) translateX(10px) scale(1.2);
    opacity: 1;
  }
  75% {
    transform: translateY(-15px) translateX(5px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes hologram-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-8px) translateX(8px) scale(1.1);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-12px) translateX(12px) scale(1.2);
    opacity: 1;
  }
  75% {
    transform: translateY(-8px) translateX(16px) scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0) translateX(20px) scale(1);
    opacity: 0.7;
  }
}

@keyframes celebration-burst {
  0% {
    transform: translateY(0) translateX(0) scale(0.5);
    opacity: 0;
  }
  20% {
    transform: translateY(-10px) translateX(5px) scale(1);
    opacity: 1;
  }
  40% {
    transform: translateY(-20px) translateX(10px) scale(1.2);
    opacity: 0.9;
  }
  60% {
    transform: translateY(-30px) translateX(15px) scale(1.1);
    opacity: 0.7;
  }
  80% {
    transform: translateY(-40px) translateX(20px) scale(0.8);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-50px) translateX(25px) scale(0.3);
    opacity: 0;
  }
}

/* 应用动画类 */
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-spin-fast {
  animation: spin-fast 1.5s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 4s linear infinite;
}

.animate-pulse-scale {
  animation: pulse-scale 1s ease-in-out infinite;
}

.animate-box-opening {
  animation: box-opening 1.5s ease-in-out;
}

.animate-rainbow-shift {
  animation: rainbow-shift 3s ease-in-out infinite;
}

.energy-particle {
  animation: energy-float ease-in-out infinite;
}

.hologram-particle {
  animation: hologram-float ease-in-out infinite;
}

.celebration-particle {
  animation: celebration-burst ease-out infinite;
}

.decoration-particle {
  animation: decoration-float ease-in-out infinite;
}

@keyframes decoration-float {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-5px) translateX(3px) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-8px) translateX(6px) scale(1.2);
    opacity: 1;
  }
  75% {
    transform: translateY(-5px) translateX(9px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes box-opening {
  0% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
  20% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
  }
  40% {
    transform: scale(1.1);
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.7),
      0 0 60px rgba(236, 72, 153, 0.4);
  }
  60% {
    transform: scale(1.15);
    box-shadow: 0 0 50px rgba(139, 92, 246, 0.8),
      0 0 80px rgba(236, 72, 153, 0.6);
  }
  80% {
    transform: scale(1.1);
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.7),
      0 0 60px rgba(236, 72, 153, 0.4);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
  }
}
</style>
