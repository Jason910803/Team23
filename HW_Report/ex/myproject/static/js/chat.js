// static/js/chat.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:8001');
    const messagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    let currentResponseDiv = null;
    
    // 連接事件
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // 捲動至聊天視窗底部的函數
    const scrollToBottom = () => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // 發送訊息的函數
    const sendMessage = () => {
      const message = messageInput.value.trim();
      if (message) {
        // 顯示使用者訊息
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        
        // 捲動到底部
        scrollToBottom();
        
        // 發送到服務器
        socket.emit('chat_request', { message });
        
        // 創建 AI 回應容器
        currentResponseDiv = document.createElement('div');
        currentResponseDiv.className = 'ai-message';
        messagesContainer.appendChild(currentResponseDiv);
        
        // 清空輸入
        messageInput.value = '';
      }
    };

    // 點擊按鈕發送
    sendButton.addEventListener('click', sendMessage);
    
    // 按下 Enter 鍵發送
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
        e.preventDefault(); // 防止表單提交或換行
      }
    });
  
    // // 接收逐字回應
    // socket.on('chat_response_chunk', (data) => {
    //   if (currentResponseDiv) {
    //     currentResponseDiv.textContent += data.text;
    //     // 自動滾動到底部
    //     scrollToBottom();
    //   }
    // });
    
    // 接收逐字回應，添加打字效果
    socket.on('chat_response_chunk', (data) => {
        if (currentResponseDiv) {
        // 將文字放入隊列
        typeText(currentResponseDiv, data.text);
        }
    });
    
    // 打字效果函數
    const textQueue = [];
    let isTyping = false;
    
    function typeText(element, text) {
        textQueue.push(...text);
        
        if (!isTyping) {
        isTyping = true;
        typeNextCharacter(element);
        }
    }
    
    function typeNextCharacter(element) {
        if (textQueue.length > 0) {
        const char = textQueue.shift();
        element.textContent += char;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 隨機打字速度，模擬真實感
        const delay = Math.random() * 30 + 10;
        setTimeout(() => typeNextCharacter(element), delay);
        } else {
        isTyping = false;
        }
    }
    
    // 回應完成
    socket.on('chat_response_complete', () => {
      // 可以在這裡添加完成的處理邏輯
      console.log('Response completed');
      // 確保在回應完成後再次捲動到底部
      scrollToBottom();
    });
});