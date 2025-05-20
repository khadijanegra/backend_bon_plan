// assignFavorites.js

const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://khadijanegra2:RqP99wOOdNa5dFB6@cluster0.hpiy1.mongodb.net/";

const client = new MongoClient(uri);

const shopIds = [
  new ObjectId("67f05c3130faf53fe508e41e"),
  new ObjectId("67f05d5930faf53fe508e426"),
  new ObjectId("67f05eb130faf53fe508e42e"),
  new ObjectId("67f0600130faf53fe508e436"),
  new ObjectId("67f0611230faf53fe508e43e"),
  new ObjectId("67f0621d30faf53fe508e446"),
  new ObjectId("67f0633e30faf53fe508e44e"),
  new ObjectId("67f0646830faf53fe508e456"),
  new ObjectId("67f0651530faf53fe508e45e"),
  new ObjectId("67f065d630faf53fe508e466"),
  new ObjectId("67f066b230faf53fe508e46e"),
  new ObjectId("67f0693330faf53fe508e477"),
  new ObjectId("67f06a5f30faf53fe508e47f"),
  new ObjectId("67f06b2c30faf53fe508e487"),
  new ObjectId("67f127746ee7f414e75ea028"),
  new ObjectId("67f1282f6ee7f414e75ea030"),
  new ObjectId("67f128fc6ee7f414e75ea038"),
  new ObjectId("67f12a256ee7f414e75ea040"),
  new ObjectId("67f12aea6ee7f414e75ea048"),
  new ObjectId("67f12beb6ee7f414e75ea050"),
  new ObjectId("67f12ce46ee7f414e75ea058"),
  new ObjectId("67f12e666ee7f414e75ea060"),
  new ObjectId("67f12f5f6ee7f414e75ea068"),
  new ObjectId("67f130616ee7f414e75ea070"),
  new ObjectId("67f130ed6ee7f414e75ea078"),
  new ObjectId("67f150e0fd86653366ff77f5"),
  new ObjectId("67f151a9fd86653366ff77fd"),
  new ObjectId("67f155a5fd86653366ff7805"),
  new ObjectId("67f15732fd86653366ff780d"),
  new ObjectId("67f157c1fd86653366ff7815"),
  new ObjectId("67f1584cfd86653366ff781d"),
  new ObjectId("67f159d6fd86653366ff7831"),
  new ObjectId("67f15a61fd86653366ff7839"),
  new ObjectId("67f15af0fd86653366ff7841"),
  new ObjectId("67f15b7efd86653366ff7849"),
  new ObjectId("67f15c34fd86653366ff7851"),
  new ObjectId("67f15da1fd86653366ff7865"),
  new ObjectId("67f15e27fd86653366ff786d"),
  new ObjectId("67f15f42fd86653366ff7876"),
  new ObjectId("67f15fd5fd86653366ff787e"),
  new ObjectId("67f16056fd86653366ff7886"),
  new ObjectId("67f160fbfd86653366ff788e"),
  new ObjectId("67f18e3823e781be7c9c6153"),
  new ObjectId("67f2ba0dc656621316cb3c32"),
  new ObjectId("67f9482cff1df29b32ec50bd"),
  new ObjectId("67f95a48cffab853c8d2626c"),
  new ObjectId("67f95cc2cffab853c8d2632f"),
  new ObjectId("67f95d89cffab853c8d263f4"),
  new ObjectId("67f95e78cffab853c8d264ba"),
  new ObjectId("67f9600dcffab853c8d26582"),
  new ObjectId("67f96176cffab853c8d2664c"),
  new ObjectId("67f96250cffab853c8d266b8"),
  new ObjectId("67f96a11cffab853c8d26fe2"),
  new ObjectId("67fd83121ac78ceb8c6e1e29"),
  new ObjectId("67fd839e1ac78ceb8c6e1e2b"),
  new ObjectId("67fd84881ac78ceb8c6e1e2c"),
  new ObjectId("67fd84da1ac78ceb8c6e1e2d"),
  new ObjectId("67fd85311ac78ceb8c6e1e2e"),
  new ObjectId("67fd85d21ac78ceb8c6e1e2f"),
  new ObjectId("67fd864f1ac78ceb8c6e1e30"),
  new ObjectId("67fd88bd1ac78ceb8c6e1e31"),
  new ObjectId("67ff878607145338a7ef1fd5"),
  new ObjectId("67ff892807145338a7ef2049"),
  new ObjectId("67ff89f507145338a7ef204d"),
];

function getRandomShops() {
  const shuffled = shopIds.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10); // 10 shops aléatoires
}

async function run() {
  try {
    await client.connect();
    const db = client.db("test"); // Remplace si besoin
    const users = db.collection("users");

    const cursor = users.find({});
    while (await cursor.hasNext()) {
      const user = await cursor.next();
      const favoris = getRandomShops();

      await users.updateOne(
        { _id: user._id },
        { $set: { favoris: favoris } } // ✅ C'est ici qu'on change "favorites" → "favoris"
      );

      console.log(`✅ Mise à jour user ${user._id} avec 10 favoris.`);
    }

    console.log("🎉 Terminé !");
  } catch (err) {
    console.error("❌ Erreur :", err);
  } finally {
    await client.close();
  }
}

run();