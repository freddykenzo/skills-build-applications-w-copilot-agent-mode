import { useEffect, useState } from 'react';

const baseUrl = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';
const endpoint = `${baseUrl}/api/teams/`;

function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  async function fetchTeams() {
    console.log('Teams endpoint:', endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log('Teams data:', data);
    const normalized = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
    setTeams(normalized);
  }

  useEffect(() => {
    fetchTeams().catch((error) => {
      console.error('Teams fetch failed:', error);
      setTeams([]);
    });
  }, []);

  const filteredTeams = teams.filter((team) => {
    const key = `${team.name ?? ''} ${team.city ?? ''}`.toLowerCase();
    return key.includes(search.toLowerCase());
  });

  return (
    <section className="card data-card">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h2 className="h3 mb-0">Teams</h2>
          <a className="btn btn-outline-primary btn-sm" href={endpoint} target="_blank" rel="noreferrer">
            Open API
          </a>
        </div>

        <form className="row g-2 mb-3">
          <div className="col-sm-9">
            <input
              className="form-control"
              type="search"
              placeholder="Search teams by name or city"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-sm-3 d-grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fetchTeams().catch((error) => console.error('Teams refresh failed:', error))}
            >
              Refresh Teams
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>City</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team.id || team.name}>
                  <td>{team.name}</td>
                  <td>{team.city}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(team)}>
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
              <h5 className="modal-title">Team Details</h5>
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

export default Teams;
