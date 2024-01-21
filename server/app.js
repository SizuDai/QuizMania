const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
