export async function callClaudeAPI(userMessage, userData) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a personal finance assistant. The user has:
- Monthly income: $${userData.income}
- Total expenses: $${userData.expenses.reduce((sum, e) => sum + e.amount, 0)}
- Savings goal: $${userData.savingsGoal}

User's question: ${userMessage}

Provide helpful, personalized financial advice. Format your response with:
- Use **bold** for important terms and numbers
- Use numbered lists (1., 2., 3.) for steps or multiple points
- Use emojis for visual appeal
- Keep it conversational but well-structured
- Highlight key takeaways

Be encouraging and actionable.`
          }
        ]
      })
    });

    const data = await response.json();
    const aiResponse = data.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return aiResponse;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}
