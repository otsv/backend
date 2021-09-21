/* eslint-disable @typescript-eslint/no-var-requires */
const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');
const download = require('download');
const fs = require('fs-extra');
async function seedProduct() {
  const uri =
    'mongodb://' +
    process.env.MONGO_USERNAME +
    ':' +
    process.env.MONGO_PASSWORD +
    '@' +
    process.env.MONGO_DBHOST +
    ':' +
    process.env.MONGO_DBPORT +
    '/' +
    process.env.MONGO_DBNAME +
    '?authSource=admin';

  const count = process.env.PRODUCTS_COUNT || 0;

  console.log(uri);
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DBNAME);
    const products = db.collection('products');
    const category = db.collection('categories');
    const imagePath = 'src/public/drink';

    //Drop old db
    if (
      (await db.collections()).filter(
        (collections) => collections.collectionName == 'products',
      ).length > 0
    ) {
      await products.drop();
    }

    fs.emptyDirSync(imagePath);

    const fakeProducts = [];
    const categories = await category
      .find({}, { projection: { __v: 0 } })
      .toArray();
    console.log('===GENERATING===');
    for (let i = 0; i < count; i++) {
      let price = faker.commerce.price(10000, 100000, 0);

      let generateImages = async (count) => {
        let image = () =>
          faker.image.unsplash.imageUrl(640, 960, 'beverage', 'coffee');
        let images = [];
        for (let i = 0; i < count; i++) {
          const filename = uuid.v4() + '.jpg';
          await download(image(), imagePath, { filename });
          images.push(filename);
        }
        return images;
      };

      fakeProducts.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: price - (price % 100),
        status: 'instock',
        type: faker.random.arrayElement(categories),
        images: await generateImages(1),
      });
    }
    await products.insertMany(fakeProducts);
    console.log(fakeProducts);
    console.log('===GENERATED===');
    process.exit(0);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
}

seedProduct();
