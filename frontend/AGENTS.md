# Dream to Real Agent 前端协作规则

## 项目定位

本项目是 Dream to Real Agent 的 Web 端手机 App Demo。
最终产品是 App，但当前通过浏览器展示。
页面必须看起来像手机 App，不是普通网页。

## 当前展示形态

浏览器页面中间放一个手机 App 容器。
手机容器宽度控制在 390px 到 430px。
不要铺满整个浏览器。
不要做成网页落地页。
不要做成后台系统。

## 最重要规则

1. 不要自由重新设计。
2. 必须严格对照 docs/ui-reference 里的 UI 参考图。
3. light- 开头是浅色版参考图。
4. dark- 开头是深色版参考图。
5. 每次只改一个页面。
6. 如果用户要求修首页，就不要改档案页、详情页、洞察页、我的页。
7. 如果用户要求修视觉，就不要新增功能。
8. 如果视觉和交互冲突，优先视觉还原。
9. 不要把参考图整张贴进页面，要用真实前端组件复刻。
10. 不要接真实后端，先使用 mock API。
11. 不要擅自改 mock API 和数据结构。
12. 不要一次性大改多个组件。
13. 每次修改后必须说明改了哪些文件。
14. 每次修改后必须确认 npm run dev 或 npm run build 是否正常。

## UI 参考图对应关系

浅色版：

docs/ui-reference/light-home.png
docs/ui-reference/light-archive.png
docs/ui-reference/light-detail.png
docs/ui-reference/light-insight.png
docs/ui-reference/light-profile.png

深色版：

docs/ui-reference/dark-home.png
docs/ui-reference/dark-archive.png
docs/ui-reference/dark-detail.png
docs/ui-reference/dark-insight.png
docs/ui-reference/dark-profile.png

## 页面开发顺序

第一阶段：只还原浅色首页 light-home.png。
第二阶段：还原深色首页 dark-home.png。
第三阶段：还原浅色档案页 light-archive.png。
第四阶段：还原深色档案页 dark-archive.png。
第五阶段：还原详情页。
第六阶段：还原洞察页和我的页。
最后再检查交互闭环。

## 视觉还原流程

每次改 UI 前：

1. 先读取对应参考图。
2. 再截取当前浏览器页面。
3. 对比参考图和当前页面。
4. 先输出视觉差异清单。
5. 只修改当前页面相关文件。
6. 修改后再次截图验证。

## 当前优先级

当前只处理浅色首页 light-home.png。
不要继续做其他页面。
不要继续新增功能。
不要继续接后端。
不要继续改深色主题。

## 首页录入流程规则

首页不是一停止录音就创建历史记录。

语音记录正确流程：

1. 用户开始录音，进入 recording 状态。
2. 用户停止录音，只生成 pendingAudio。
3. 停止录音后进入 recorded 状态。
4. recorded 状态显示“本次录音”预览卡片。
5. 用户可以播放或重新录制。
6. 停止录音后不能自动创建 DreamRecord。
7. 停止录音后不能自动跳转详情页。
8. 停止录音后不能自动加入档案页历史。
9. 只有用户点击“确认整理梦境”后，才调用 createDream。
10. createDream 成功后，才进入详情页，并把记录加入档案页。

文字记录正确流程：

1. 用户输入梦境碎片。
2. 输入后只作为 draftText。
3. 不自动创建 DreamRecord。
4. 只有用户点击“确认整理梦境”后，才进入 processing。
5. processing 完成后才创建记录并进入详情页。

重要原则：

录音完成不等于梦境记录完成。
确认整理后，才算生成一条梦境记录。

未确认的录音和文字草稿不能出现在档案页。
