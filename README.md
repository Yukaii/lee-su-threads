# Lee-Su-Threads 你是誰

一個 Chrome 擴充功能，自動顯示 Threads 貼文作者的地點資訊，不需要點進每個人的個人檔案。

> **[English](#english)** below

## 功能

- **自動擷取**：瀏覽動態時自動載入作者的地點資訊
- **地點標籤**：在貼文時間旁顯示作者所在地點
- **快取機制**：已擷取的資料會快取 24 小時
- **匯出資料**：可將所有資料匯出為 JSON
- **速率限制保護**：被 Threads 限制時會自動暫停並提醒

## 擷取的資訊

- **地點**：作者設定的所在地（例如：台灣）
- **加入時間**：加入 Threads 的時間

## 安裝方式

1. 開啟 Chrome，前往 `chrome://extensions/`
2. 開啟右上角的「**開發人員模式**」
3. 點擊「**載入未封裝項目**」
4. 選擇 `lee-su-thread` 資料夾
5. 擴充功能圖示會出現在工具列

## 使用方式

1. 前往 [threads.com](https://www.threads.com)
2. 正常瀏覽動態
3. 擴充功能會自動在貼文旁顯示地點標籤
4. 點擊擴充功能圖示可查看所有已擷取的資料

## 隱私說明

- 所有資料僅儲存在本機 Chrome 儲存空間
- 不會將任何資料傳送到外部伺服器
- 快取會在 24 小時後自動清除

## 限制

- 需要 Threads 載入個人資料 API 才能擷取（通常瀏覽動態時會自動載入）
- 若 Threads 更改 API 格式，可能需要更新擴充功能
- 部分使用者可能未設定地點資訊

---

<a name="english"></a>

## English

A Chrome extension that automatically displays location info for Threads post authors without visiting each profile.

### Features

- **Auto-fetch**: Automatically loads author location while browsing the feed
- **Location badges**: Shows location next to post timestamp
- **Caching**: Extracted data is cached for 24 hours
- **Export**: Export all data as JSON
- **Rate limit protection**: Auto-pauses and notifies when rate limited by Threads

### Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `lee-su-thread` folder
5. The extension icon should appear in your toolbar

### Usage

1. Navigate to [threads.com](https://www.threads.com)
2. Browse your feed normally
3. Location badges will automatically appear next to posts
4. Click the extension icon to view all extracted profiles

### Privacy

- All data is stored locally in Chrome's storage
- No data is sent to external servers
- Cache is automatically cleared after 24 hours

## License

MIT License
