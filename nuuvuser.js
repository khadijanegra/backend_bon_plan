const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://khadijanegra2:RqP99wOOdNa5dFB6@cluster0.hpiy1.mongodb.net/";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("test");
    const users = db.collection("users");

    const cursor = users.find({});
    while (await cursor.hasNext()) {
      const user = await cursor.next();

      const favoris = user.favoris || [];
      const favorites = user.favorites || [];

      const favorisStr = favoris.map(f => f.toString());
      const favoritesStr = favorites.map(f => f.toString());

      const fusionSet = new Set([...favorisStr, ...favoritesStr]);

      const fusionFavoris = Array.from(fusionSet)
        .filter(id => typeof id === 'string' && id.length === 24) // ⛔️ évite les IDs invalides
        .map(id => new ObjectId(id));

      await users.updateOne(
        { _id: user._id },
        {
          $set: { favoris: fusionFavoris },
          $unset: { favorites: "" }
        }
      );

      console.log(`✅ User ${user._id} mis à jour.`);
    }

    console.log("🎉 Migration terminée !");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
