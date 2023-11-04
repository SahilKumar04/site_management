const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const fs = require('fs');

const electricianFilePath = './electricianData.json';
const siteDataFilePath = './rawSiteData.json';
const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/assigned_electricians", (req, res) => {
    const electriciansJsonData = fs.readFileSync(electricianFilePath, 'utf-8');
    const siteDataJsonData = fs.readFileSync(siteDataFilePath, 'utf-8');
    const [electricians, sites] = [JSON.parse(electriciansJsonData), JSON.parse(siteDataJsonData)];
    const grievanceElectricians = electricians.filter(electrician => electrician.grievanceElectrician);
    const generalElectricians = electricians.filter(electrician => !electrician.grievanceElectrician);

    let assignedElectriciansSites = [];
    for (const site of sites) {
        let assignedElectritian = []
        const isDateEqual = compareDatesOnly(new Date(site.InstallationDate), new Date())
        if (site.AssignedElectritian.length !== 0 || !isDateEqual) {
            assignedElectriciansSites.push(site);
            continue;
        }
        if (site.grievance) {
            for (const electrician of grievanceElectricians) {
                if (electrician.numberOfSlotsAvailable === 0) continue;
                const assignedElect = {
                    electricianName: electrician.name,
                    electricianAssignDate: new Date().toISOString()
                };
                electrician.numberOfSlotsAvailable = electrician.numberOfSlotsAvailable - 1;
                assignedElectritian.push(assignedElect)
                break
            }
        } else {
            for (const electrician of generalElectricians) {
                if (electrician.numberOfSlotsAvailable === 0) continue;
                const assignedElect = {
                    electricianName: electrician.name,
                    electricianAssignDate: new Date().toISOString()
                };
                electrician.numberOfSlotsAvailable = electrician.numberOfSlotsAvailable - 1;
                assignedElectritian.push(assignedElect)
                break
            }
        }
        site.AssignedElectritian = assignedElectritian
        assignedElectriciansSites.push(site)
    }
    try {
        const allElectricians = grievanceElectricians.concat(generalElectricians)
        fs.writeFile(siteDataFilePath, JSON.stringify(assignedElectriciansSites), (err) => {
            if (err) {
                console.error('error while assigned Electricians Sites :>> ', err);
                res.json({ message: "Failed" }).status(500);

            } else {
                fs.writeFile(electricianFilePath, JSON.stringify(allElectricians), (err) => {

                    if (err) {
                        console.error('error while electrician File Path :>> ', err);
                        res.json({ message: "Failed" }).status(500);
                    } else {
                        res.json(assignedElectriciansSites).status(201);
                    }
                });
            }
        });
    } catch (error) {
        console.error('error :>> ', error);
        res.json({ message: "Failed" }).status(500);
    }
});

app.get("/api/get_assigned_electricians_sites", (req, res) => {
    const jsonData = fs.readFileSync(siteDataFilePath, 'utf-8');
    const assignedElectriciansSitesData = JSON.parse(jsonData);
    res.json(assignedElectriciansSitesData);
});

app.post("/api/update_site", (req, res) => {
    const { siteName, InstallationDate } = req.body;
    const siteDataJsonData = fs.readFileSync(siteDataFilePath, 'utf-8');
    const sites = JSON.parse(siteDataJsonData);
    sites.map((site) => {
        if (site.name === siteName) {
            site.InstallationDate = InstallationDate
        }
    });
    try {
        fs.writeFile(siteDataFilePath, JSON.stringify(sites), (err) => {
            if (err) {
                console.error('error while assigned Electricians Sites :>> ', err);
                res.json({ message: "Failed" }).status(500);
            } else {
                res.json("success").status(201);
            }
        });
    } catch (error) {
        console.error('error :>> ', error);
        res.json({ message: "Failed" }).status(500);

    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

function compareDatesOnly(date1, date2) {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth()+1;
    const day1 = date1.getDate();
  
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth()+1;
    const day2 = date2.getDate();
    return year1 === year2 && month1 === month2 && day1 === day2;
  }
