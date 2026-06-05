import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { HiChartBar, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import api from '../api/axios';
import './Dashboard.css';

const COLORS = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  completed: '#10b981',
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#f97316',
  urgent: '#ef4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.8125rem',
      }}>
        <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, margin: '4px 0 0' }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/tasks/analytics');
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-stats">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width: 48, height: 48 }}></div>
              <div>
                <div className="skeleton" style={{ width: 60, height: 24, marginBottom: 6 }}></div>
                <div className="skeleton" style={{ width: 80, height: 14 }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const statusData = [
    { name: 'Pending', value: analytics.pendingTasks },
    { name: 'In Progress', value: analytics.inProgressTasks },
    { name: 'Completed', value: analytics.completedTasks },
  ].filter((d) => d.value > 0);

  const priorityData = analytics.priorityDistribution.map((p) => ({
    name: p.priority.charAt(0).toUpperCase() + p.priority.slice(1),
    count: p.count,
    fill: COLORS[p.priority] || '#64748b',
  }));

  return (
    <div className="dashboard" id="dashboard">
      <div className="dashboard-toggle">
        <h3>
          <HiChartBar size={20} />
          Dashboard
        </h3>
        <button
          className="dashboard-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          id="dashboard-toggle"
        >
          {collapsed ? <><HiChevronDown size={14} /> Show</> : <><HiChevronUp size={14} /> Hide</>}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon total">📋</div>
              <div className="stat-info">
                <h4>{analytics.totalTasks}</h4>
                <p>Total Tasks</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">✅</div>
              <div className="stat-info">
                <h4>{analytics.completedTasks}</h4>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-info">
                <h4>{analytics.pendingTasks + analytics.inProgressTasks}</h4>
                <p>In Progress</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon overdue">🚨</div>
              <div className="stat-info">
                <h4>{analytics.overdueTasks}</h4>
                <p>Overdue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon rate">📊</div>
              <div className="stat-info">
                <h4>{analytics.completionRate}%</h4>
                <p>Completion Rate</p>
              </div>
            </div>
          </div>

          <div className="dashboard-charts">
            {statusData.length > 0 && (
              <div className="chart-card">
                <h4>Task Distribution</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      paddingAngle={4}
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[entry.name.toLowerCase().replace(' ', '-')] || '#64748b'}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {priorityData.length > 0 && (
              <div className="chart-card">
                <h4>Priority Breakdown</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border-color)' }}
                    />
                    <YAxis
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border-color)' }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]}>
                      {priorityData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {analytics.weeklyTrend.length > 0 && (
              <div className="chart-card">
                <h4>Weekly Completion Trend</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={analytics.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border-color)' }}
                    />
                    <YAxis
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border-color)' }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Completed"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
