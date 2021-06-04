var db = require('../config/connection')
var collection = require('../config/collections')
var Promise = require('promise')
const bcrypt = require('bcrypt')
var objectID = require('mongodb').ObjectID

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let lofinStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Username })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                })
            }
            else {
                console.log('login failed 2');
                resolve({ status: false })
            }
        })
    },
    addToCart: (productId, userId) => {
        let productObj = {
            item: objectID(productId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectID(userId) })
            if (userCart) {
                let productExist = userCart.products.findIndex(product => product.item == productId)
                if (productExist != -1) {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectID(userId), 'products.item': objectID(productId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }).then((response) => {
                            resolve()
                        })
                } else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectID(userId) },
                        {
                            // $push: { products: objectID(productId) }
                            $push: { products: productObj }
                        }).then((response) => {
                            resolve()
                        })
                }
            } else {
                let cartObj = {
                    user: objectID(userId),
                    // products: [objectID(productId)]
                    products: [productObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectID(userId) }
                },
                //     {                    //aggression method-1
                //             $lookup: {
                //                 from: collection.PRODUCT_COLLECTION,
                //                 let: { productList: '$products' },
                //                 pipeline: [
                //                     {
                //                         $match: {
                //                             $expr: {
                //                                 $in: ['$_id', "$$productList"]
                //                             }
                //                         }
                //                     }
                //                 ],
                //                 as: 'cartItems'
                //             }
                //    },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()
            console.log(cartItems);
            resolve(cartItems)
        })
    },
    getCartCount: (userID) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectID(userID) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeProductQuantity: (details) => {
        console.log(details);
        let count = parseInt(details.count)
        console.log(count);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectID(details.cart), 'products.item': objectID(details.product) },
                {
                    $inc: { 'products.$.quantity': count }
                }).then((response) => {
                    resolve()
                })
        })
    }
}
