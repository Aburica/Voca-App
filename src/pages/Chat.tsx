import React, { useState } from 'react';

export function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'VocaBird', text: 'مرحباً بك! كيف يمكنني مساعدتك اليوم في تعلم اللغة؟' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');

    // رد تلقائي بسيط ومؤقت من البوت
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'VocaBird', text: 'فهمت تساؤلك! جاري العمل على تطوير مهاراتنا اللغوية معاً.' }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto bg-white dark:bg-ink-800 rounded-xl shadow-md overflow-hidden border border-ink-100 dark:border-ink-700">
      {/* رأس المحادثة */}
      <div className="p-4 bg-primary text-white font-bold flex items-center justify-between">
        <span>محادثة VocaBird</span>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-ink-100 dark:bg-ink-700 text-ink-900 dark:text-ink-100 rounded-bl-none'
              }`}
            >
              <div className="text-xs opacity-75 mb-1">
                {msg.sender === 'user' ? 'أنت' : 'VocaBird'}
              </div>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* صندوق الإدخال */}
      <form onSubmit={handleSend} className="p-3 border-t border-ink-100 dark:border-ink-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 p-2 border border-ink-200 dark:border-ink-600 rounded-lg bg-transparent text-ink-900 dark:text-ink-100 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          إرسال
        </button>
      </form>
    </div>
  );
}