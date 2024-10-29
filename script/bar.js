// 動態生成導航欄 HTML 結構
navbar.innerHTML = `
    <nav class="navbar">
        <img src="/img/Logo-s.png" alt="">
        <a href="/">首頁</a>
        <!-------------------------------------------->
        <div class="dropdown">
            <button class="dropbtn">工具列表</button>
            <div class="dropdown-content">
                <a href="/Tool/ClassLotterySystem/index.html">班級抽籤</a>
            </div>
        </div>
        <!-------------------------------------------->

        <a href="">關於我</a>
    </nav>
`;