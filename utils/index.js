const { MongoClient } = require('mongodb');
const axios = require('axios');

// Informations de connexion MongoDB
const mongoURI = 'mongodb+srv://khadijanegra2:RqP99wOOdNa5dFB6@cluster0.hpiy1.mongodb.net/';
const dbName = 'test';
const collectionName = 'shops';

// Informations Meilisearch
const meiliSearchUrl = 'http://localhost:7700';
const meiliSearchApiKey = 'kQ7EZkHiIDQpvYRUGDuYdClz678eShdIgGRql_o6kP4';

async function indexData() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const documents = await collection.find().toArray();

    const indexName = collectionName;

    // Créer l’index avec la clé primaire explicitement définie
    try {
      await axios.post(`${meiliSearchUrl}/indexes`, {
        uid: indexName,
        primaryKey: 'id'
      }, {
        headers: {
          'Authorization': `Bearer ${meiliSearchApiKey}`
        }
      });
      console.log(`✅ Index "${indexName}" créé avec 'id' comme clé primaire.`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`ℹ️ Index "${indexName}" existe déjà.`);
      } else {
        throw error;
      }
    }

    const documentsWithIds = documents.map(doc => ({
      ...doc,
      id: doc._id.toString() // Important : Meilisearch attend un champ 'id' en string
    }));

    console.log(`Nombre de documents à indexer : ${documentsWithIds.length}`);

    const response = await axios.post(`${meiliSearchUrl}/indexes/${indexName}/documents`, documentsWithIds, {
      headers: {
        'Authorization': `Bearer ${meiliSearchApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Réponse Meilisearch:', response.data);
    console.log('✅ Documents indexés avec succès !');

    await client.close();
  } catch (error) {
    console.error('❌ Erreur d\'indexation:', error);
  }
}

indexData();
