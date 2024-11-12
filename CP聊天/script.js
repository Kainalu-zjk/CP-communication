document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const initialPage = document.getElementById('initial-page');
    const memoPage = document.getElementById('memo-page');
    const chatPage = document.getElementById('chat-page');
    const startBtn = document.getElementById('start-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const memoInput = document.getElementById('memo-input');
    const memoList = document.getElementById('memo-list');
    const savedMemos = document.getElementById('saved-memos');

    // 存储备忘录内容
    let memos = [];

    // 拖拽相关变量
    let draggedItem = null;
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatContainer = document.getElementById('chat-container');

    // 设置拖拽事件监听器
    function setDraggable(element) {
        element.draggable = true;
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('click', handleMemoClick); // 添加点击选择功能
    }

    // 拖拽开始
    function handleDragStart(e) {
        draggedItem = this;
        this.style.opacity = '0.4';
    }

    // 拖拽结束
    function handleDragEnd(e) {
        draggedItem = null;
        this.style.opacity = '1';
    }

    // 点击选择备忘录
    function handleMemoClick(e) {
        chatInput.value = this.textContent;
    }

    // 设置输入框拖放区域
    chatInput.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    chatInput.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            chatInput.value = draggedItem.textContent;
        }
    });

    // 发送消息
    sendBtn.addEventListener('click', () => {
        const messageText = chatInput.value.trim();
        if (messageText) {
            // 创建消息元素
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message self';
            messageDiv.textContent = messageText;
            chatContainer.appendChild(messageDiv);

            // 清空输入框
            chatInput.value = '';

            // 滚动到最新消息
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });

    // 切换页面函数
    function showPage(pageToShow) {
        // 隐藏所有页面
        [initialPage, memoPage, chatPage].forEach(page => {
            page.classList.remove('active');
        });
        // 显示指定页面
        pageToShow.classList.add('active');
    }

    // 开始按钮点击事件
    startBtn.addEventListener('click', () => {
        showPage(memoPage);
    });

    // 确认按钮点击事件
    confirmBtn.addEventListener('click', () => {
        const memoText = memoInput.value.trim();
        if (memoText) {
            if (memos.length < 5) {
                memos.push(memoText);
                
                // 创建备忘录项
                const memoItem = document.createElement('div');
                memoItem.className = 'memo-item';
                memoItem.textContent = memoText;
                setDraggable(memoItem); // 添加拖拽功能
                memoList.appendChild(memoItem);

                memoInput.value = '';

                if (memos.length === 5) {
                    // 复制备忘录到聊天页面
                    memos.forEach(memo => {
                        const savedMemoItem = document.createElement('div');
                        savedMemoItem.className = 'memo-item';
                        savedMemoItem.textContent = memo;
                        setDraggable(savedMemoItem); // 添加拖拽功能
                        savedMemos.appendChild(savedMemoItem);
                    });
                    
                    setTimeout(() => {
                        showPage(chatPage);
                        startTimer();
                    }, 1000);
                }
            }
        }
    });

    // 计时器功能
    function startTimer() {
        let timeLeft = 5 * 60; // 5分钟
        const timerElement = document.getElementById('timer');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('聊天时间结束！');
                // 这里可以添加聊天结束后的处理逻辑
            }
            timeLeft--;
        }, 1000);
    }

    // 添加回车键确认功能
    memoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    });

    // 添加发送按钮的回车键功能
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            sendBtn.click();
        }
    });
}); 