const express = require('express');
const app = express();
// Bruk porten som Azure gir, eller default til 3000 for lokal kjøring 
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, Azure!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});