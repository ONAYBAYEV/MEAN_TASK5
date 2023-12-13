const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/readdir', async (req, res) => {
    try {
        const files = await fs.readdir('C:\\v7');
        res.send(files);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error reading directory.');
    }
});

const deleteFileOrDirectory = async (filePath) => {
    try {
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            await fs.rmdir(filePath, { recursive: true });
        } else {
            await fs.unlink(filePath);
        }
        console.log(`Successfully deleted: ${filePath}`);
    } catch (error) {
        console.error(`Error deleting ${filePath}: ${error.message}`);
    }
};

const data = [
    { id: 1, name: 'MIta' },
    { id: 2, name: 'Nauryz' },
];

app.use(express.json());

app.get('/api/data', (req, res) => {
    res.json(data);
});

app.post('/api/data', (req, res) => {
    const newItem = req.body;
    newItem.id = data.length + 1;
    data.push(newItem);
    res.status(201).json(newItem);
});

app.put('/api/data/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedItem = req.body;
    const index = data.findIndex(item => item.id === itemId);

    if (index !== -1) {
        data[index] = { ...data[index], ...updatedItem };
        res.json(data[index]);
    } else {
        res.status(404).send('Item not found');
    }
});

app.delete('/api/data/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const index = data.findIndex(item => item.id === itemId);

    if (index !== -1) {
        const deletedItem = data.splice(index, 1)[0];
        res.json(deletedItem);
    } else {
        res.status(404).send('Item not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
