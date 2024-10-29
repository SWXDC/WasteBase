// 預設內容，包括多行數字
const DEFAULT_CONTENT = "1\n2\n3\n4"; // 使用換行符號而非 %0A
let isBatchMode = true; // 記錄是否處於批量生成模式
let drawCount = 1; // 計數抽籤次數
const content = document.querySelector("#content"); // 獲取 textarea 元素
const number = document.querySelector("#display-number"); // 獲取顯示隨機數字的元素

// 讀取指定名稱的 cookie
function readCookie(name) {
    const value = `; ${document.cookie}`; // 為了處理 cookie，添加分號
    console.log('Current cookies:', document.cookie); // Debug log，顯示當前 cookie
    const parts = value.split(`; ${name}=`); // 根據 cookie 名稱拆分
    // 返回 cookie 值，或返回 null
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

// 設置 cookie
function setCookie(name, value, days) {
    // 計算過期時間並設置
    const expires = `expires=${new Date(Date.now() + days * 864e5).toUTCString()}`;
    // 設置 cookie，包括編碼的值和有效期
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
    console.log(`Cookie set: ${name}=${value}`); // 檢查設置的 cookie
}

// 初始化 textarea 的內容
function initializeContent() {
    // 嘗試從 cookie 中讀取已保存的內容
    const savedContent = readCookie("savedContent");
    // 如果有保存的內容，則解碼並設置；否則使用預設內容
    content.value = savedContent ? decodeURIComponent(savedContent) : DEFAULT_CONTENT;
}

// 儲存 textarea 的內容到 cookie
function save() {
    setCookie("savedContent", content.value, 3650); // 儲存 cookie，有效期 3650 天
    alert("內容已儲存!"); // 提示用戶內容已儲存
}

// 讀取 cookie 中的內容並顯示在 textarea 中
function load() {
    const savedContent = readCookie("savedContent"); // 讀取已保存的內容
    reset();
    if (savedContent) {
        // 解碼並設置 textarea 的內容
        content.value = decodeURIComponent(savedContent);
        alert("內容已讀取!"); // 提示用戶內容已讀取
    } else {
        alert("沒有找到儲存的內容!"); // 如果沒有找到，則顯示提示
    }
}

// 批量生成數字
function batch() {
    if (isBatchMode) {
        content.value = ""; // 如果處於批量模式，清空內容
    }
    isBatchMode = false; // 退出批量模式

    // 獲取用戶輸入的起始和結束數字
    const start = parseInt(document.querySelector("#start").value);
    const end = parseInt(document.querySelector("#end").value);

    // 驗證輸入的數字
    if (isNaN(start) || isNaN(end)) {
        alert("請輸入有效的數字！"); // 提示用戶輸入有效數字
        return; // 退出函數
    }

    // 從起始數字到結束數字進行迴圈
    for (let i = start; i <= end; i++) {
        content.value += `${i}\n`; // 使用 \n 來進行換行
    }
}

// 將 textarea 內容轉換為列表
function convertToList() {
    return content.value.split('\n').filter(Boolean); // 使用換行符號分割並過濾空行
}

// 隨機選擇數字
function random() {
    const list = convertToList(); // 獲取數字列表
    if (list.length === 0) return null; // 如果列表為空，返回 null

    const randomIndex = Math.floor(Math.random() * list.length); // 隨機生成索引
    const randomValue = list[randomIndex]; // 根據索引獲取隨機數字
    // 更新內容，刪除選中的數字
    content.value = list.filter((_, index) => index !== randomIndex).join('\n');
    return randomValue; // 返回隨機數字
}

// 開始隨機選擇的功能
function start() {
    const randomResult = random(); // 隨機選擇一個數字

    if (randomResult !== null) {
        // 若有結果，顯示數字並添加到結果列表
        number.textContent = randomResult;
        const resultList = document.getElementById("result-list");
        const listItem = document.createElement("li");
        listItem.textContent = `No.${drawCount++} 是 ${randomResult}`;
        resultList.appendChild(listItem);

        // 若自動抽籤選中，繼續抽直到抽完
        if (document.getElementById("auto-draw").checked) {
            setTimeout(start, 100); // 每0.5秒抽一次
        }
    } else {
        number.textContent = "#"; // 若無數字可抽，顯示#
    }
}

// 重置內容
function reset() {
    isBatchMode = true; // 重設為批量模式
    content.value = DEFAULT_CONTENT; // 恢復預設內容
    number.textContent = "#"; // 重設顯示
    document.getElementById("result-list").innerHTML = ""; // 清空結果列表
    drawCount = 1; // 重設抽籤次數
}

// 初始化內容
initializeContent(); 

// 監聽 keyup 事件，當 textarea 內容變化時輸出當前值
content.addEventListener("keyup", () => {
    console.log(content.value); // Debug log，顯示當前 textarea 內容
});
