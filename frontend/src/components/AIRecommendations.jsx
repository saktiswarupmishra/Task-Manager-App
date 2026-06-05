import { useState, useEffect } from 'react';
import { HiRefresh } from 'react-icons/hi';
import api from '../api/axios';
import './AIRecommendations.css';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/recommendations');
      setRecommendations(res.data.recommendations || []);
      setSource(res.data.source || 'rules');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([{
        title: '💡 Tip',
        description: 'Create some tasks to get personalized recommendations!',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-panel" id="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <span className="ai-sparkle">✨</span>
          AI Insights
          {source && <span className="ai-source">{source === 'ai' ? 'GPT' : 'Smart'}</span>}
        </div>
        <button
          className="ai-refresh-btn"
          onClick={fetchRecommendations}
          disabled={loading}
          id="ai-refresh"
        >
          <HiRefresh size={14} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="ai-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ai-skeleton-card">
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: '100%', height: 14 }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ai-recommendations">
          {recommendations.map((rec, index) => (
            <div className="ai-rec-card" key={index} id={`ai-rec-${index}`}>
              <div className="ai-rec-title">{rec.title}</div>
              <p className="ai-rec-desc">{rec.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
