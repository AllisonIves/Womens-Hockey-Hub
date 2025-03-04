const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//Routes
const projectRoutes = require('./routes/project');

mongoose.connect('mongodb+srv://dleduc1:PWgzHeunLWNH22a3@cluster0.moibf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})