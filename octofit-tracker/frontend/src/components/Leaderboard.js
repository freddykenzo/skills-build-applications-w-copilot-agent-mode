import { useEffect, useState } from 'react';

const baseUrl = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';
const endpoint = `${baseUrl}/api/leaderboard/`;

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  async function fetchLeaderboard() {
    console.log('Leaderboard endpoint:', endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log('Leaderboard data:', data);
    const normalized = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
    setEntries(normalized);
  }

  useEffect(() => {
    fetchLeaderboard().catch((error) => {
      console.error('Leaderboard fetch failed:', error);
      setEntries([]);
    });
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const key = `${entry.rank ?? ''} ${entry.points ?? ''}`.toLowerCase();
    return key.includes(search.toLowerCase());
  });

  return (
    <section className="card data-card">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h2 className="h3 mb-0">Leaderboard</h2>
          <a className="btn btn-outline-primary btn-sm" href={endpoint} target="_blank" rel="noreferrer">
            Open API
          </a>
        </div>

        <form className="row g-2 mb-3">
          <div className="col-sm-9">
            <input
              className="form-control"
              type="search"
              placeholder="Search leaderboard by rank or points"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-sm-3 d-grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fetchLeaderboard().catch((error) => console.error('Leaderboard refresh failed:', error))}
            >
              Refresh Leaderboard
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Points</th>
                <th>User ID</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.rank}</td>
                  <td>{entry.points}</td>
                  <td>{entry.user}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(entry)}>
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
              <h5 className="modal-title">Leaderboard Entry Details</h5>
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

export default Leaderboard;
