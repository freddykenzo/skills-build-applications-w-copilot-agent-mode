import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  async function fetchActivities() {
    console.log('Activities endpoint:', endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log('Activities data:', data);
    const normalized = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
    setActivities(normalized);
  }

  useEffect(() => {
    fetchActivities().catch((error) => {
      console.error('Activities fetch failed:', error);
      setActivities([]);
    });
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const key = `${activity.activity_type ?? ''} ${activity.calories_burned ?? ''}`.toLowerCase();
    return key.includes(search.toLowerCase());
  });

  return (
    <section className="card data-card">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h2 className="h3 mb-0">Activities</h2>
          <a className="btn btn-outline-primary btn-sm" href={endpoint} target="_blank" rel="noreferrer">
            Open API
          </a>
        </div>

        <form className="row g-2 mb-3">
          <div className="col-sm-9">
            <input
              className="form-control"
              type="search"
              placeholder="Search activities by type"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-sm-3 d-grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fetchActivities().catch((error) => console.error('Activities refresh failed:', error))}
            >
              Refresh Activities
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Type</th>
                <th>Duration (min)</th>
                <th>Calories</th>
                <th>User ID</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.activity_type}</td>
                  <td>{activity.duration_minutes}</td>
                  <td>{activity.calories_burned}</td>
                  <td>{activity.user}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(activity)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal fade ${selected ? 'show d-block' : ''}`} tabIndex="-1" aria-hidden={!selected}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Activity Details</h5>
              <button type="button" className="btn-close" onClick={() => setSelected(null)} />
            </div>
            <div className="modal-body">
              <pre className="mb-0 small">{selected ? JSON.stringify(selected, null, 2) : ''}</pre>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Activities;
