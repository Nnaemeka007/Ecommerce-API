import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
    { 
        $match:{
        product:Object("6b04c55318ef82909d0d1f64")
    }
        
    },
  {
    '$group': {
      '_id': null, 
      'averageRating': {
        '$avg': '$rating'
      }, 
      'numOfReviews': {
        '$sum': 1
      }
    }
  }
];

// const client = await MongoClient.connect(
//   'mongodb://ac-vbunqkc-shard-00-02.woy3jcb.mongodb.net,ac-vbunqkc-shard-00-01.woy3jcb.mongodb.net,ac-vbunqkc-shard-00-00.woy3jcb.mongodb.net/?tls=true&authMechanism=MONGODB-X509&authSource=%24external&maxIdleTimeMS=45000&minPoolSize=0&replicaSet=atlas-ha7i9x-shard-0&compressors=zlib&appName=Data+Explorer--6a6b4a611926a0c0a6af8807'
// );
// const coll = client.db('API-FOR-ECOMM').collection('reviews');
// const cursor = coll.aggregate(agg);
// const result = await cursor.toArray();
// await client.close();