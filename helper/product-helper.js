var db = require('../config/connection')
var Promise = require('promise')
var collection = require('../config/collections')
var objectID = require('mongodb').ObjectID

module.exports = {

    addproduct: (product, callback) => {
        // console.log(product);
        db.get().collection('product').insertOne(product).then((data) => {
            // console.log(data);
            callback(data.ops[0]._id)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (productID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectID(productID) }).then((response) => {
                resolve(response)
            })
        })
    },
    getAllProductDetails: (productID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectID(productID) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (productID, productData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: objectID(productID) }, {
                    $set: {
                        Name: productData.Name,
                        Category: productData.Category,
                        Discription: productData.Discription,
                        Price: productData.Price
                    }
                }).then((response) => {
                    resolve()
                })
        })
    }
}