// 用戶資料輸入
var inputContent = document.querySelector("#inputContent");
var spinSpeedInput = document.querySelector("#customSpinSpeed");
const DEFAULT_CONTENT = "1\n2\n3\n4\n5\n6";
const displayResultElement = document.querySelector("#resultDisplay");
const prizeRecordTable = document.querySelector("#recordList");

let wheelSegments = []; // 將 segments 定義為全局變量

// 更新轉盤的選項
function updateWheelSegments() {
    wheelSegments = inputContent.value.split('\n').filter(segment => segment.trim() !== ""); // 更新全局的 segments
    if(wheelSegments == ""){
        wheelSegments = "#"
    }
}

// 初始化轉盤內容
function initializeWheelContent() {
    spinSpeedMultiplier = (0.9 + spinSpeedInput.value);
    inputContent.value = DEFAULT_CONTENT;
    prizeRecordTable.innerHTML = ``
    displayResultElement.textContent = "#"
    updateWheelSegments();
}

// 監聽用戶輸入事件
inputContent.addEventListener("keyup", () => {
    updateWheelSegments();
    renderWheel();
});
spinSpeedInput.addEventListener("change", () => {
    spinSpeedMultiplier = (0.9 + spinSpeedInput.value);
    console.log(spinSpeedMultiplier);
});

// 轉盤區
const wheelCanvas = document.getElementById("wheelCanvas");
const wheelContext = wheelCanvas.getContext("2d");
const segmentColors = ["#FFB6C1", "#8A2BE2", "#3CB371", "#FFD700", "#FF4500", "#1E90FF"];

// 渲染轉盤
function renderWheel() {
    wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = 200;

    const numSegments = wheelSegments.length; // 在這裡獲取 numSegments
    const segmentAngle = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
        wheelContext.beginPath();
        wheelContext.moveTo(centerX, centerY);
        wheelContext.arc(centerX, centerY, radius, segmentAngle * i + rotationAngle, segmentAngle * (i + 1) + rotationAngle);
        wheelContext.closePath();
        wheelContext.fillStyle = segmentColors[i % segmentColors.length]; // 確保顏色數量不會出錯
        wheelContext.fill();

        // 標記每個區塊的文字
        wheelContext.save();
        wheelContext.translate(centerX, centerY);
        wheelContext.rotate(segmentAngle * i + rotationAngle + segmentAngle / 2);
        wheelContext.textAlign = "center";
        wheelContext.fillStyle = "#000";
        wheelContext.font = "24px Arial";
        wheelContext.fillText(wheelSegments[i], radius * 0.65, 10);
        wheelContext.restore();
    }

    // 繪製指針
    wheelContext.fillStyle = 'red';
    wheelContext.beginPath();
    wheelContext.moveTo(420, 252); // 頂端點
    wheelContext.lineTo(464, 242); // 左上角
    wheelContext.lineTo(464, 262); // 左下角
    wheelContext.fill();
}

// 開始旋轉
let rotationAngle = 0;
let currentSpinSpeed = 0;

// 開始旋轉轉盤
function startWheelSpin() {
    currentSpinSpeed = Math.random() * 0.3 + 0.2; // 設置初始旋轉速度
    animateRotation();
}

// 旋轉動畫
function animateRotation() {
    rotationAngle += currentSpinSpeed;
    currentSpinSpeed *= spinSpeedMultiplier; // 逐漸減速
    if (currentSpinSpeed < 0.001) { // 停止條件
        currentSpinSpeed = 0;
        showSpinResult();
    } else {
        requestAnimationFrame(animateRotation);
    }
    renderWheel();
}

// 記錄區
function recordPrize() {
    var checkbox = document.getElementById('auto-record');

    if (checkbox.checked) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `<th>${prizeRecordTable.children.length + 1}.</th><td>${displayResultElement.textContent}</td>`;
        prizeRecordTable.appendChild(newRow);
        console.log(prizeRecordTable.innerHTML);
    }
}

// 顯示結果
function showSpinResult() {
    if(wheelSegments != "#"){
        const numSegments = wheelSegments.length; // 獲取段數
        const winningSegmentIndex = Math.floor((numSegments - (rotationAngle % (2 * Math.PI)) / (2 * Math.PI / numSegments)) % numSegments);
        displayResultElement.textContent = wheelSegments[winningSegmentIndex];
        recordPrize();
        autoRemove();
    }else{
        displayResultElement.textContent = "請輸入選項";
    }
}
// 自動刪除
function autoRemove() {
    var checkbox = document.getElementById('auto-content-remove');

    if (checkbox.checked) {
        // 獲取贏得的區段索引
        const numSegments = wheelSegments.length;
        const winningSegmentIndex = Math.floor((numSegments - (rotationAngle % (2 * Math.PI)) / (2 * Math.PI / numSegments)) % numSegments);
        
        // 刪除贏得的區段
        wheelSegments.splice(winningSegmentIndex, 1); // 從 wheelSegments 中刪除該段
        inputContent.value = wheelSegments.join('\n'); // 更新 inputContent 的值

        // 重新渲染轉盤
        renderWheel();
    }
}

// Console
function start() {
    startWheelSpin();
}
function reset(){
    initializeWheelContent();
    renderWheel();

}


// 初始化轉盤
initializeWheelContent();
renderWheel();
