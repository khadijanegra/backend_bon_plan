const { MongoClient } = require("mongodb");

async function benchmarkIndex() {
  const uri = "mongodb+srv://khadijanegra2:RqP99wOOdNa5dFB6@cluster0.hpiy1.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("test");
    const collection = db.collection("shops");
    
    const query = { region: "Sousse" }; // filtre sur "Sousse"
    const indexName = "region_1";

    let result = {
      indexDeleted: false,
      indexCreated: false,
      measures: {
        beforeIndexing: {},
        afterIndexing: {}
      }
    };

    // Supprimer l'index s'il existe avant mesure
    const indexes = await collection.indexes();
    if (indexes.find(idx => idx.name === indexName)) {
      result.indexDeleted = true;
      await collection.dropIndex(indexName);
    }

    // 1. Mesure avant indexation
    const explainAvant = await collection.find(query).explain("executionStats");
    const timeAvant = explainAvant.executionStats.executionTimeMillis;
    const docsAvant = explainAvant.executionStats.totalDocsExamined || explainAvant.executionStats.docsExamined;
    result.measures.beforeIndexing = {
      executionTimeMillis: timeAvant,
      documentsExamined: docsAvant
    };

    // 2. Création de l'index sur le champ "region"
    await collection.createIndex({ region: 1 });
    result.indexCreated = true;

    // 3. Mesure après indexation avec la même requête sur "region: Sousse"
    const explainApres = await collection.find(query).explain("executionStats");
    const timeApres = explainApres.executionStats.executionTimeMillis;
    const docsApres = explainApres.executionStats.totalDocsExamined || explainApres.executionStats.docsExamined;
    result.measures.afterIndexing = {
      executionTimeMillis: timeApres,
      documentsExamined: docsApres
    };

    console.log(JSON.stringify(result, null, 2));

  } catch (err) {
    console.error("Erreur pendant le benchmark :", err);
  } finally {
    await client.close();
  }
}

benchmarkIndex();
