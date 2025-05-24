from flask import Flask, render_template
import os

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # هذا الجزء مخصص للتشغيل المباشر لـ app.py (اختياري)
    # الخادم الرئيسي هو simple_server.py
    port = int(os.environ.get('PORT', 5001)) # استخدام منفذ مختلف إذا تم تشغيله مباشرة
    app.run(debug=True, host='0.0.0.0', port=port)
