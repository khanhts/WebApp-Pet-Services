let categoryModel = require('../schemas/category')
module.exports = {
    GetAllCategories: async function () {
        return await categoryModel.find({
            isDeleted: false
        })
    },
    GetCategoryByID: async function (id) {
        return await categoryModel.findOne({
            _id: id,
            isDeleted: false
        })
    },
    CreateACategory: async function (name, description) {
        try {
            let newCategory = new categoryModel({
                name: name,
                description: description
            })
            return await newCategory.save()
        } catch (error) {
            throw new Error(error.message)
        }
    },
    UpdateACategory: async function (id, updatedInfo) {
        try {
            let category = await categoryModel.findById(id)
            if (category) {
                let allowFields = ["name", "description"]
                for (let key in updatedInfo) {
                    if (allowFields.includes(key)) {
                        category[key] = updatedInfo[key]
                    }
                }
                return await category.save()
            } else {
                throw new Error("Error: Category not found")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteACategory: async function (id) {
        try {
            let category = await categoryModel.findById(id)
            if (category) {
                category.isDeleted = true
                return await category.save()
            } else {
                throw new Error("Error: Category not found")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    GetCategoryBySlug: async function (slug) {
        return await categoryModel.findOne({
            slug: slug
        })
    },
}