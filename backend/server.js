require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
app.use(express.json()); 
app.use(cors()); 
app.get('/', (req, res) =
  res.send('Board App Backend Running!'); 
}); 
app.listen(PORT, () =
  console.log(\`Server running on port \${PORT}\`); 
}); 
