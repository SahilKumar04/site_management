import React from "react";
import axios from "axios";
import './App.css'
import { useNavigate } from "react-router-dom";
function Home() {
  const [data, setData] = React.useState(null);
  const router = useNavigate();
  async function fetchData() {
    let response = await axios.get("http://localhost:3001/api/get_assigned_electricians_sites");
    let sites = response.data;
    const sortedSites = [...sites].sort((a, b) => b.grievance - a.grievance);
    setData(sortedSites);
  }
  async function assignEnginers() {
    let response = await axios.get("http://localhost:3001/api/assigned_electricians");
    let sites = response.data;
    const sortedSites = [...sites].sort((a, b) => b.grievance - a.grievance);
    setData(sortedSites);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  async function handleAssignButtomClick() {
    await assignEnginers();
  }
  return (
    <>
    
      <div className="siteinfo">
        <h2>Sites Information</h2>
        <button className="button" onClick={() => handleAssignButtomClick()}>
          Auto Assign Electricians 
        </button>
      </div>
      {data && (
        <div className="App">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>City</th>
                <th>Assigned Electrician</th>
                <th>Assigned Electrician Date</th>
                <th>Installation Date</th>
                <th>Site Type</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.name}</td>
                    <td>{val.phone}</td>
                    <td>{val.city}</td>
                    <td>{val.AssignedElectritian.length > 0 ? val.AssignedElectritian[0].electricianName : "Not Assigned"}</td>
                    <td>{val.AssignedElectritian.length > 0 ? new Date(val.AssignedElectritian[0].electricianAssignDate).toDateString() : "-"}</td>
                    <td>{new Date(val.InstallationDate).toDateString()}</td>
                    <td>{val.grievance ? "GRIEVANCE" : "GENERAL"}</td>
                    <td>
                      <button onClick={() => router(`/site_edit?name=${encodeURIComponent(val.name)}`)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Home;
