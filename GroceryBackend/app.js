const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware (if needed)
require('dotenv').config(); 
const rootRouter = require('./routes/index');


const app = express();

const PORT = process.env.PORT;

app.use(cors()); // Enable CORS for cross-origin requests (optional)
app.use(express.json()); // Parse incoming JSON payloads


require('./conn/conn')


app.use('/api/v1',rootRouter);
app.listen(PORT,()=>{
    console.log(`server starting at ${PORT}`);
});
 