const express = require('express');
const router = express.Router();
const fs = require('fs');

router.use(express.json());

// Route to check file existence
router.get('/filecheck', (req, res) => {
    fs.access('./public/hospitaldb.json', fs.constants.F_OK, (err) => {
        if (err) {
            console.log('File does not exist');
            return res.json({ message: 'File does not exist' });
        } else {
            console.log('File does exist');
            return res.json({ message: 'File exists' });
        }
    });
});

// Route to read the file
router.get('/file', (req, res) => {
    try {
        const data = fs.readFileSync('./public/hospitaldb.json', 'utf-8');
        console.log(data); // You can keep this if you want to log it
        return res.json(JSON.parse(data)); // Send the JSON data as a response
    } catch (err) {
        console.error('Error reading file:', err);
        return res.json({ message: 'Error reading file' });
    }
});


router.post('/insert', (req, res) => {
    const newHospital = req.body; // Get the new hospital data from the request body

    // Read existing data
    fs.readFile('./public/hospitaldb.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.json({ message: 'Error reading file' });
        }

        const hospitals = JSON.parse(data); // Parse the existing data
        hospitals.push(newHospital); // Add the new hospital to the array

        // Write the updated data back to the file
        fs.writeFile('./public/hospitaldb.json', JSON.stringify(hospitals), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.json({ message: 'Error writing file' });
            }

            return res.json(hospitals);
        });
    });
});




router.put('/edit/:hName', (req, res) => {
    const hospitalName = req.params.hName; // Get the hospital name from the request parameters
    const updatedData = req.body; // Get the updated data from the request body

    // Read existing data
    fs.readFile('./public/hospitaldb.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.json({ message: 'Error reading file' });
        }

        const hospitals = JSON.parse(data); // Parse the existing data
        const index = hospitals.findIndex(hospital => hospital.HName === hospitalName); // Find the index of the hospital

        if (index === -1) {
            return res.json({ message: 'Hospital not found' });
        }

        // Update the hospital record
        hospitals[index] = { ...hospitals[index], ...updatedData };

        // Write the updated data back to the file
        fs.writeFile('./public/hospitaldb.json', JSON.stringify(hospitals, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.json({ message: 'Error writing file' });
            }

            return res.json({ message: 'Hospital record updated successfully', updatedHospital: hospitals[index] });
        });
    });
});



router.delete('/delete/:hName', (req, res) => {
    const hospitalName = req.params.hName; // Get the hospital name from the request parameters

    // Read existing data
    fs.readFile('./public/hospitaldb.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.json({ message: 'Error reading file' });
        }

        const hospitals = JSON.parse(data); // Parse the existing data
        const newHospitals = hospitals.filter(hospital => hospital.HName !== hospitalName); // Filter out the hospital to be deleted

        if (hospitals.length === newHospitals.length) {
            return res.json({ message: 'Hospital not found' });
        }

        // Write the updated data back to the file
        fs.writeFile('./public/hospitaldb.json', JSON.stringify(newHospitals, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.json({ message: 'Error writing file' });
            }

            return res.json({ message: 'Hospital record deleted successfully' });
        });
    });
});



module.exports = router;

