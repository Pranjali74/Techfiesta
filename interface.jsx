import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import SpendingOverview from './SpendingOverview';
import MessageBubble from './MessageBubble';
import { callClaudeAPI } from '../services/aiService';
import { generateFinancialAdvice } from '../utils/financeCalculations';

export default function ChatInterface({ userData, updateUserData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `👋 **Welcome Back!**

**Your Profile:**
- Monthly Income: **$${userData.income.toLocaleString()}**
- Total Expenses: **$${userData.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}**

How can I help you with your finances today?`,
      formatted: true
    }]);
  }, []);

  const handleExpenseTracking = (userMessage) => {
    const expenseMatch = userMessage.match(/spent?\s+\$?(\d+\.?\d*)\s+on\s+(.+)/i);
    if (!expenseMatch) return false;

    const amount = parseFloat(expenseMatch[1]);
    const category = expenseMatch[2].split(/\s+(for|in)\s+/i)[0].trim();
    
    const newExpense = {
      amount,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      date: new Date().toISOString()
    };

    const newExpenses = [...userData.expenses, newExpense];
    const newData = { ...userData, expenses: newExpenses };
    updateUserData(newData);

    const { advice } = generateFinancialAdvice(newExpenses, userData.income);
    
    const formattedResponse = `✅ **Expense Recorded**

**Amount:** $${amount}
**Category:** ${newExpense.category}
**Date:** ${new Date().toLocaleDateString()}

💡 **Quick Insight:**
${advice[0]}`;
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: formattedResponse,
      formatted: true
    }]);

    return true;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Check for expense tracking
      if (handleExpenseTracking(userMessage)) {
        setLoading(false);
        return;
      }

      // Call AI for other queries
      const aiResponse = await callClaudeAPI(userMessage, userData);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        formatted: true
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        formatted: false
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[600px] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={28} />
            <h1 className="text-2xl font-bold">AI Finance Assistant</h1>
          </div>
          <p className="text-purple-100 text-sm">Your personal financial advisor powered by AI</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <SpendingOverview userData={userData} />
          
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 bg-slate-750 border-t border-slate-700">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setInput('I spent $50 on groceries')}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-full whitespace-nowrap transition"
            >
              Track Expense
            </button>
            <button
              onClick={() => setInput('Give me budgeting tips')}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-full whitespace-nowrap transition"
            >
              Budget Tips
            </button>
            <button
              onClick={() => setInput('How can I save more money?')}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-full whitespace-nowrap transition"
            >
              Savings Ideas
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Track expense or ask for advice..."
              className="flex-1 bg-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-2 text-center">
            Try: "I spent $50 on food" or "Give me savings tips"
          </p>
        </div>
      </div>
    </div>
  );
}
