# socketio_server.py
import socketio
import google.generativeai as genai
import os

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

# 初始化 Socket.IO 伺服器
sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio)

# 配置 Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

@sio.event
def connect(sid, environ):
  print(f"客戶端連接: {sid}")

@sio.event
def disconnect(sid):
  print(f"客戶端斷開: {sid}")

@sio.event
def chat_request(sid, data):
  user_message = data.get('message', '')
  
  try:
    # 生成回應，使用流式輸出
    response = model.generate_content(
      user_message,
      generation_config={"response_mime_type": "text/plain"},
      stream=True  # 啟用流式輸出
    )
    
    # 逐字發送回應
    for chunk in response:
      if hasattr(chunk, 'text'):
        # 每個文字塊可能還是較大，進一步分割成單個字元
        text_chunk = chunk.text
        for char in text_chunk:
          sio.emit('chat_response_chunk', {'text': char}, room=sid)
          # 添加小延遲使顯示更自然 (如果需要)
          # import time
          # time.sleep(0.01)
    
    # 發送完成信號
    sio.emit('chat_response_complete', room=sid)
  except Exception as e:
    print(f"Error generating response: {e}")
    sio.emit('chat_response_chunk', {'text': f"Error: {str(e)}"}, room=sid)
    sio.emit('chat_response_complete', room=sid)

# Run the server if executed directly
if __name__ == '__main__':
    import eventlet
    port = 8001
    print(f"Starting Socket.IO server on port {port}...")
    eventlet.wsgi.server(eventlet.listen(('', port)), app)