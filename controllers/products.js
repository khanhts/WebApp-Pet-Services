var productModel = require('../schemas/products')
var categoryModel = require('../schemas/category')
module.exports = {
    GetAllProducts: async function(){
        return await productModel.find({
            isDeleted:false
          }).populate("category")
    },
    GetProductByID: async function(id){
        return await productModel.findOne({
            _id:id, isDeleted:false
        }).populate("category")
    },
    CreateAProduct:async function(name, description, price, quantity, category){
       try {
        let cate = await categoryModel.findOne({
            name:category
        })
        if(cate){
            let newProduct = new productModel({
                name:name,
                description:description,
                price:price,
                quantity:quantity,
                category:cate._id
            })
            return await newProduct.save()
        }else{
            throw new Error("Error: Category not found")
        }
       } catch (error) {
        throw new Error(error.message)
       }
    },
    UpdateAProduct: async function(id, updatedInfo){
        try {
            let product = await productModel.findById(id)
            if(product){
                let allowFields = ["name", "description","price","quantity","category"]
                let cate = await categoryModel.findOne({
                    name:updatedInfo.category
                })
                if(cate){
                    for(let key in updatedInfo){
                        if(allowFields.includes(key)){
                            product[key] = updatedInfo[key]
                        }
                    }
                    product.category = cate._id
                    return await product.save()
                }else{
                    throw new Error("Error: Category not found")
                }
            }else{
                throw new Error("Error: Product not found")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteAProduct: async function(id){
        return await productModel.findByIdAndUpdate(
            id,{
                isDeleted:true
            },{new:true}
        ).populate("category")
    },
    GetProductBySlug: async function(slug){
        return await productModel.findOne({
            slug:slug
        }).populate("category")
    },
    GetProductByCategory: async function(category){
        return await productModel.find({
            category:category
        }).populate("category")
    },
    FindProductByName: async function(name){
        let regex = new RegExp(name, 'i');
        return await productModel.find({
            name:regex
        }).populate("category")
    }
}