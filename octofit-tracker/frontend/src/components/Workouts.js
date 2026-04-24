import { useEffect, useState } from 'react';

const baseUrl = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';
const endpoint = `${baseUrl}/api/workouts/`;

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  async function fetchWorkouts() {
    console.log('Workouts endpoint:', endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log('Workouts data:', data);
    const normalized = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
    setWorkouts(normalized);
  }

  useEffect(() => {
    fetchWorkouts().catch((error) => {
      console.error('Workouts fetch failed:', error);
      setWorkouts([]);
    });
  }, []);

  const filteredWorkouts = workouts.filter((workout) => {
    const key = `${workout.title ?? ''} ${workout.intensity ?? ''}`.toLowerCase();
    return key.includes(search.toLowerCase());
  });

  return (
    <section className="card data-card">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h2 className="h3 mb-0">Workouts</h2>
          <a className="btn btn-outline-primary btn-sm" href={endpoint} target="_blank" rel="noreferrer">
            Open API
          </a>
        </div>

        <form className="row g-2 mb-3">
          <div className="col-sm-9">
            <input
              className="form-control"
              type="search"
              placeholder="Search workouts by title or intensity"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-sm-3 d-grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fetchWorkouts().catch((error) => console.error('Workouts refresh failed:', error))}
            >
              Refresh Workouts
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Intensity</th>
                <th>User ID</th>
                <th>Notes</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.title}</td>
                  <td>{workout.intensity}</td>
                  <td>{workout.user}</td>
                  <td>{workout.notes}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(workout)}>
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
              <h5 className="modal-title">Workout Details</h5>
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

export default Workouts;
