const User = require("../models/user");
const Shop = require("../models/shop");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const verificationCodes = new Map();

class UserController { // sna3neh bech nab3thou bih msg ll user jdid (bienvenue au bon Plan doub mahowa yaml compte  ) 
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // hedhom ili fl .env 
        pass: process.env.EMAIL_PASS,
      },
    });

    // Bind methods to preserve `this` bech naref eli rani nestaml fl class usecontroller (reférence)
    this.createUser = this.createUser.bind(this); 
    this.signIn = this.signIn.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUserField = this.updateUserField.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }
// lil creation 3anna il 5ir w il barka mil les etapae adhouma ; 
  async createUser(req, res) { // req et res pour gerer les requetes http {request}{response }
    //console.log(this.transporter); 

    try {
      // n7adher les ettribue lkoll elli chykounou les data mte3i illi chyitba3thou fil post bil body comme une request ( requette )
      const { nom, prenom, email, password, localisation } = req.body;
      console.log(req.body);
//lezem nthabtou est ce que howa mawjoud walee bil email mte3ou 
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "Email already exists." });
      }
      // fama res.send(data)/ res.json(obj)/res.status(code).json(obj)/res.redirect(url): rediger vers une autre url 
// el req contient les infos envoyeés par le client // el res permet d'envoyer une reponse au client [kima ki naatiw fl postman donnes fl body o yrj3lna msj json ]

// nhadhi il password mte3ou pour une securitee 
      const hashedPassword = await bcrypt.hash(password, 10);
// il sufiit tla3 moch mawjoud w il password hache w il data tba3thett 3al req.body w jawna a7la jaww nasnou newuser :
      const newUser = await User.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        localisation,
    
      });

      // Send Welcome Email
      const mailOptions = {
        from: `"BonPlan Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to BonPlan 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #007bff; text-align: center;">Welcome to BonPlan! 🎉</h2>
            <p>Hello <strong>${nom}</strong>,</p>
            <p>Your account has been successfully created.</p>
            <p>Enjoy your journey with us!</p>
            <p>Best regards,<br><strong>BonPlan Team</strong></p>
          </div>
        `,
      };

      // ✅ Verify SMTP Connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP Transporter Error:", error);
        } else {
          console.log("✅ SMTP Transporter is ready to send emails!");
        }
      });

      // ✅ Send email and check response
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
      } catch (emailError) {
        console.error("❌ Error sending email:", emailError);
      }
      const token = jwt.sign(
        { email: newUser.email, id: newUser.id }, 
        process.env.JWT_SECRET || "default-secret",
        { expiresIn: "1h" }
      );

      res.status(201).json({ message: `User ${newUser.nom} created successfully.` ,token , id : newUser.id });

    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
}




















// tawa fi login chyda5el des parametre illi houma wadh7in il email w il password krnouhom s7a7 w mawjoudin mara7bee snn il sou9 il jey 
  async signIn(req, res) {
    try {
      //kilaa madem h-chyda5el des donne , donne adhoukom lezemhom ykounou comme un request fil body req.body
      const { email, password } = req.body;

      // lezem tant que login w chyda5el l email w il password lezemnaa nthabtou ken il email aslan mawjoud milloul wallee 
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
// idha il email mawjoud tawa chin9arnou les mt de passe illi da5lhaa w elli fil bd 
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
// snanelou token 
      const token = jwt.sign(
        { email: user.email, id: user._id }, 
        process.env.JWT_SECRET || "default-secret",
        { expiresIn: "1h" }
      );

      res.json({ message: "Sign in successful", token, id: user._id });
    } catch (error) {
      res.status(500).json({ message: "Error signing in", error: error.message });
    }
  }






// tawa affichage ma3ndou ma yda5el donne dinc ma3ndou ma y7ot w mafammech req.body
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  }







  async getUserById(req, res) {
    const userId = req.params.id; // lehne kif nheb njib l user bl id mte3ou il req tnajm te5ou req.pars.id 
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  }






  async deleteUser(req, res) { // PAR ID yaani kif theb tfas5 user lezema l id 
    try {
      await User.findByIdAndRemove(req.params.id);
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  }





  async updateUserField(req, res) {
    try {
      // Récupérer les champs à mettre à jour depuis la requête
      const { nom, prenom, localisation } = req.body;
  
      // Vérifier s'il y a au moins un champ à mettre à jour
      if (!nom && !prenom && (!localisation || !localisation.latitude || !localisation.longitude)) {
        return res.status(400).json({ message: "Veuillez fournir au moins un champ valide à mettre à jour." });
      }
  
      // Construire un objet avec les champs à mettre à jour
      const updateData = {};
      if (nom) updateData.nom = nom;
      if (prenom) updateData.prenom = prenom;
      if (localisation) updateData.localisation = localisation;
  
      // Mise à jour de l'utilisateur dans la base de données
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true } // Retourner l'utilisateur mis à jour
      );
  
      // Vérifier si l'utilisateur existe
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      res.json(updatedUser); // Répondre avec l'utilisateur mis à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: error.message });
    }
  }
  



  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const verificationCode = crypto.randomInt(100000, 999999);
      verificationCodes.set(email, verificationCode);

      console.log(`Verification code for ${email}: ${verificationCode}`);
// bech tab3ath code ll user wakt mdp oublieé 
      const mailOptions = {
        from: `"BonPlan Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "BonPlan - Password Reset Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #007bff; text-align: center;">BonPlan - Password Reset</h2>
            <p>Your verification code:</p>
            <p style="font-size: 24px; text-align: center; font-weight: bold; color: #007bff;">${verificationCode}</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br><strong>BonPlan Team</strong></p>
          </div>
        `,
      };

      // ✅ Verify SMTP Connection before sending
      this.transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP Transporter Error:", error);
        } else {
          console.log("✅ SMTP Transporter is ready to send emails!");
        }
      });

      // ✅ Send email and check response
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
      } catch (emailError) {
        console.error("❌ Error sending email:", emailError);
      }

      res.json({ message: "Verification code sent" });

    } catch (error) {
      res.status(500).json({ message: "Error sending email", error: error.message });
    }
}







  async resetPassword(req, res) {
    try {
      const { email, verificationCode, newPassword } = req.body;

      if (verificationCodes.get(email) !== parseInt(verificationCode)) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });

      verificationCodes.delete(email);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error: error.message });
    }
  }

  async loginadmin(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Email reçu :", email); // Debug

        const user = await User.findOne({ email });
        if (!user) {
            console.log("Utilisateur non trouvé !");
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        console.log("Utilisateur trouvé :", user.email, "Role :", user.role);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Mot de passe incorrect !");
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // Vérifier le rôle
        if (user.role === "admin" || user.role === "manager") {
          // Générer un token avec le rôle
          const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });
        
          res.json({ token, role: user.role });
        } else {
          return res.status(403).json({ message: "Accès refusé, vous n'êtes pas autorisé." });
        }
        

        console.log("Authentification réussie, rôle :", user.role);

        // Générer un token
        const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (err) {
        console.error("Erreur serveur :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

  async  addToFavorites(req, res) {
  try {
    const { userId, shop_id } = req.body;  // Assurez-vous de recevoir `shop_id` dans le corps de la requête

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier si le shop existe
    const shop = await Shop.findById(shop_id);  // Utilisez `Shop` avec une majuscule comme modèle
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé." });
    }

    // Vérifier si le shop est déjà dans les favoris de l'utilisateur
    if (user.favoris.includes(shop_id)) {
      return res.status(400).json({ message: "Ce shop est déjà dans vos favoris." });
    }

    // Ajouter le shop aux favoris de l'utilisateur
    user.favoris.push(shop_id);
    await user.save();  // Sauvegarder les modifications

    res.status(200).json({ message: "Shop ajouté aux favoris avec succès.", favoris: user.favoris });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout aux favoris", error: error.message });
  }
}

async getUserFavorites(req, res) {
  try {
      const userId = req.params.id;
      console.log("User ID:", userId); // 🟢 Vérifier si on récupère bien l'ID

      const user = await User.findById(userId).populate("favoris"); // Récupérer les détails des favoris
      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      console.log("User trouvé:", user); // 🟢 Vérifier

      res.status(200).json({ favoris: user.favoris });
  } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}






async getallfavorites (req , res){
  try {
    const userfavoris = await User.find(userId).populate('userId', 'email'); 
    res.status(200).json(userfavoris);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

async getAllFavorites(req, res) {
  try {
    const userId = req.params.userId; // Récupère l'ID de l'utilisateur depuis les paramètres de la requête
    const userFavorites = await User.find({ _id: userId }) // Trouve l'utilisateur par son ID
      .populate('favorites', 'shop_name'); // Récupère les favoris avec le nom du shop

    if (!userFavorites) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(userFavorites); // Retourne les favoris de l'utilisateur
  } catch (error) {
    res.status(500).json({ message: error.message }); // En cas d'erreur, renvoie un message d'erreur
  }
}

}




module.exports = new UserController();
