import Task from '../models/Task.js';

// POST /api/ai/recommendations
export const getRecommendations = async (c) => {
  try {
    const user = c.get('user');

    const tasks = await Task.find({ user: user._id, status: { $ne: 'completed' } }).sort({
      dueDate: 1,
    });

    // If OpenAI key is configured, use it
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'You are a productivity assistant. Analyze the user\'s tasks and provide 3-5 concise, actionable recommendations to help them be more productive. Focus on prioritization, time management, and task organization. Return your recommendations as a JSON array of objects with "title" and "description" fields.',
              },
              {
                role: 'user',
                content: `Here are my current tasks:\n${tasks
                  .map(
                    (t) =>
                      `- "${t.title}" (Priority: ${t.priority}, Status: ${t.status}, Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'})`
                  )
                  .join('\n')}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
          try {
            const parsed = JSON.parse(content);
            return c.json({ recommendations: parsed, source: 'ai' });
          } catch {
            return c.json({
              recommendations: [{ title: 'AI Insight', description: content }],
              source: 'ai',
            });
          }
        }
      } catch (aiError) {
        console.error('OpenAI API error:', aiError.message);
        // Fall through to rule-based
      }
    }

    // Rule-based fallback recommendations
    const recommendations = [];
    const now = new Date();

    // Check for overdue tasks
    const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < now);
    if (overdueTasks.length > 0) {
      recommendations.push({
        title: '🚨 Overdue Tasks Alert',
        description: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider addressing "${overdueTasks[0].title}" first as it's past its deadline.`,
      });
    }

    // Check for urgent tasks
    const urgentTasks = tasks.filter((t) => t.priority === 'urgent');
    if (urgentTasks.length > 0) {
      recommendations.push({
        title: '⚡ Urgent Tasks Need Attention',
        description: `You have ${urgentTasks.length} urgent task${urgentTasks.length > 1 ? 's' : ''}. Focus on "${urgentTasks[0].title}" to keep things on track.`,
      });
    }

    // Check for tasks due soon (within 48 hours)
    const soonTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
      return hoursUntilDue > 0 && hoursUntilDue <= 48;
    });
    if (soonTasks.length > 0) {
      recommendations.push({
        title: '⏰ Upcoming Deadlines',
        description: `${soonTasks.length} task${soonTasks.length > 1 ? 's are' : ' is'} due within 48 hours. Plan your schedule to complete them on time.`,
      });
    }

    // Suggest prioritization
    const highPriorityPending = tasks.filter(
      (t) => (t.priority === 'high' || t.priority === 'urgent') && t.status === 'pending'
    );
    if (highPriorityPending.length > 0) {
      recommendations.push({
        title: '📋 Start High Priority Tasks',
        description: `You have ${highPriorityPending.length} high-priority task${highPriorityPending.length > 1 ? 's' : ''} still in pending status. Move them to "In Progress" to start making headway.`,
      });
    }

    // General productivity tip
    if (tasks.length > 5) {
      recommendations.push({
        title: '💡 Break It Down',
        description: `You have ${tasks.length} active tasks. Consider breaking larger tasks into smaller, manageable subtasks for better progress tracking.`,
      });
    }

    // If no specific recommendations, provide general advice
    if (recommendations.length === 0) {
      recommendations.push({
        title: '✨ Looking Good!',
        description:
          "You're all caught up! Consider planning ahead by adding tasks for upcoming projects or goals.",
      });
    }

    return c.json({ recommendations, source: 'rules' });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    return c.json({ message: 'Server error generating recommendations.' }, 500);
  }
};
