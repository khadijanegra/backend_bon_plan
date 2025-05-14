const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const reviewRoutes = require('./routes/reviewRoutes')
const chatbotRoutes = require("./routes/chatbotRoutes");
const eventroutes = require('./routes/eventroutes')
const dashboards = require('./routes/dashboardroute')
const analyseroute = require('./routes/analyseroute')
const webhook=require('./routes/webhook')
const chatgemini=require('./routes/chatgemini')
const commandeRoutes = require('./routes/commanderoute');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json()); // Middleware pour parser le JSON et activer le missleware pour na9raw il JSON 
// le missleware transforme les requette JSON en objet JS accessible dans req.body
require('dotenv').config();


app.post('/payement', async (req, res) => {
  try {
    const { amount } = req.body;  // Tu recevras le montant de la requête du frontend, en centimes (par exemple 1000 pour 10.00 $)

    // Crée un PaymentIntent avec le montant et la devise
    const paymentIntent = await stripe.paymentIntents.create({
      amount,  
      currency: 'usd', 
    });

    // Envoie le client secret au frontend pour compléter le paiement
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});



const fileUpload = require('express-fileupload');
const path = require('path');
app.use(fileUpload());


const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Use the routes
app.use('/user', userRoutes);
app.use('/shops', shopRoutes);
app.use('/review', reviewRoutes);
app.use("/chatbot", chatbotRoutes);
app.use('/event', eventroutes);
app.use('/dashboard',dashboards)
app.use("/web",webhook);
app.use('/analyse-review',analyseroute);
app.use('/chatgemini',chatgemini)
app.use('/commande',commandeRoutes)
//pour l'image de la creation du shop 

app.post('/uploadshopImage', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Access the file through req.files.<input_name>
  let uploadedFile = req.files.file;

  // Set the file upload path
  const uploadPath = path.join(__dirname, 'shopImage', uploadedFile.name);

  // Use the mv() method to place the file in the desired directory
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({ fileName: uploadedFile.name });

  });
});

app.use('/fetchshopImages', express.static(path.join(__dirname, 'shopImage')));







// pour la creation de l'image de l'avis 

app.post('/uploadreviewImage', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Access the file through req.files.<input_name>
  let uploadedFile = req.files.file;

  // Set the file upload path
  const uploadPath = path.join(__dirname, 'reviewImages', uploadedFile.name);

  // Use the mv() method to place the file in the desired directory
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({ fileName: uploadedFile.name });

  });
});

app.use('/fetchreviewImage', express.static(path.join(__dirname, 'reviewImages')));







app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

