import React, { useEffect } from 'react'
import axios from "axios";
import './App.css'
import { useNavigate, useLocation } from "react-router-dom";

const SiteEdit = () => {
  const location = useLocation();
  const [siteData, setSiteData] = React.useState(null)
  const [installationDate, setInstallationDate] = React.useState(new Date())
  const router = useNavigate();
  const siteName = new URLSearchParams(location.search).get('name');

  async function fetchUser() {
    let response = await axios.get("http://localhost:3001/api/get_assigned_electricians_sites");
    let sites = response.data;
    const siteDetails = sites.filter(site => site.name === siteName);
    setSiteData(siteDetails[0])
    setInstallationDate(new Date(siteDetails[0].InstallationDate).toISOString().split('T')[0])
  }

  const handleDateChangeClick = (event) => {
    setInstallationDate(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputDate = new Date(installationDate);
    const InstallationDate = inputDate.toISOString().split('T')[0] + 'T00:00:00.000Z';
    const response = await axios.post("http://localhost:3001/api/update_site", { siteName, InstallationDate })
    if (response.status === 200) {
      alert("updated successfully!")
      router(`/`)
    } else {
      alert("please try again later!")
    }

  };
  useEffect(() => {
    fetchUser()
  }, [])

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 5);

  return (
    <>
      {siteData &&
        <div>
          <form onSubmit={handleSubmit}>
            <div className='site-heading'>
              <h1>Site Details</h1>
            </div>
            <div className='form-fields'>
              <label for="name">Name:</label>
              <input type="text" name="name" value={siteData.name} readOnly />
            </div>
            <div className='form-fields'>
              <label for="AssignedElectritian">AssignedElectritian:</label>
              <input type="text" name="AssignedElectritian" value={siteData.AssignedElectritian.length > 0 ? siteData.AssignedElectritian[0].electricianName : "N/A"} readOnly />
            </div>
            <div className='form-fields'>
              <label for="city">city:</label>
              <input type="text" name="city" value="GREATER NOIDA" readOnly />
            </div>
            <div className='form-fields'>
              <label for="grievance">Site Type</label>
              <input type="text" name="grievance" value={siteData.grievance ? "GRIEVANCE" : "GENERAL"} readOnly />
            </div>
            <div className='form-fields'>
              <label for="phone">Phone:</label>
              <input type="text" name="phone" value={siteData.phone} readOnly />
            </div>
            <div className='form-fields'>
              <label for="InstallationDate">Installation Date:</label>
              <input type="date" id="InstallationDate" name="InstallationDate" onChange={handleDateChangeClick} value={installationDate} min={minDate.toISOString().split('T')[0]}
                max={maxDate.toISOString().split('T')[0]} required />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </div>}
    </>
  )
}

export default SiteEdit