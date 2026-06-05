import { useState, useEffect, useCallback } from 'react';
import { HiX } from 'react-icons/hi';
import './SearchFilter.css';

const SearchFilter = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  const emitChange = useCallback(() => {
    onFilterChange({ search, status, priority, sortBy });
  }, [search, status, priority, sortBy, onFilterChange]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(emitChange, 300);
    return () => clearTimeout(timer);
  }, [emitChange]);

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setSortBy('order');
  };

  const hasActiveFilters = search || status !== 'all' || priority !== 'all' || sortBy !== 'order';

  return (
    <div className="search-filter" id="search-filter">
      <div className="search-filter-input">
        <input
          type="text"
          className="form-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search-input"
        />
      </div>

      <div className="search-filter-selects">
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          id="filter-status"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          id="filter-priority"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="filter-sort"
        >
          <option value="order">Default Order</option>
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          {search && (
            <span className="active-filter-badge">
              Search: "{search}" <button onClick={() => setSearch('')}><HiX /></button>
            </span>
          )}
          {status !== 'all' && (
            <span className="active-filter-badge">
              Status: {status} <button onClick={() => setStatus('all')}><HiX /></button>
            </span>
          )}
          {priority !== 'all' && (
            <span className="active-filter-badge">
              Priority: {priority} <button onClick={() => setPriority('all')}><HiX /></button>
            </span>
          )}
          <button className="clear-filters" onClick={clearFilters}>Clear all</button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
