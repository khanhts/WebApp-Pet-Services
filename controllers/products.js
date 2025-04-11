var productModel = require("../schemas/products");
var categoryModel = require("../schemas/category");
var tagModel = require("../schemas/tags");
module.exports = {
  GetAllProducts: async function () {
    return await productModel
      .find({
        isDeleted: false,
      })
      .populate("category")
      .populate("tags");
  },
  GetProductByID: async function (id) {
    return await productModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("category")
      .populate("tags");
  },
  CreateAProduct: async function (
    name,
    description,
    price,
    quantity,
    category,
    tags
  ) {
    try {
      let cate = await categoryModel.findOne({
        name: category,
      });
      if (!cate) {
        throw new Error("Error: Category not found");
      }

      let validTags = [];
      if (tags && tags.length > 0) {
        const tagModel = require("../schemas/tag");
        validTags = await tagModel.find({ _id: { $in: tags } });
        if (validTags.length !== tags.length) {
          throw new Error("Error: Some tags are invalid");
        }
      }
      let newProduct = new productModel({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        category: cate._id,
        tags: validTags.map((tag) => tag._id),
      });
      return await newProduct.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateAProduct: async function (id, updatedInfo) {
    try {
      let product = await productModel.findById(id);
      if (!product) {
        throw new Error("Error: Product not found");
      }
      let allowFields = [
        "name",
        "description",
        "price",
        "quantity",
        "category",
        "tags",
      ];
      if (updatedInfo.category) {
        let cate = await categoryModel.findOne({
          _id: updatedInfo.category._id,
        });
        if (!cate) {
          throw new Error("Error: Category not found");
        }
        updatedInfo.category = cate._id;
      }
      if (updatedInfo.tags && updatedInfo.tags.length > 0) {
        const validTags = await tagModel.find({
          _id: { $in: updatedInfo.tags },
        });
        if (validTags.length !== updatedInfo.tags.length) {
          throw new Error("Error: Some tags are invalid");
        }
        updatedInfo.tags = validTags.map((tag) => tag._id);
      }
      for (let key in updatedInfo) {
        if (allowFields.includes(key)) {
          if (key === "price" || key === "quantity") {
            updatedInfo[key] = Number(updatedInfo[key]);
          }
          product[key] = updatedInfo[key];
        }
      }
      return await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  DeleteAProduct: async function (id) {
    try {
      return await productModel
        .findByIdAndUpdate(
          id,
          {
            isDeleted: true,
          },
          { new: true }
        )
        .populate("category");
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetProductBySlug: async function (slug) {
    return await productModel
      .findOne({
        slug: slug,
      })
      .populate("category");
  },
  GetProductByCategory: async function (category) {
    return await productModel
      .find({
        category: category,
      })
      .populate("category");
  },
  FindProductByName: async function (name) {
    let regex = new RegExp(name, "i");
    return await productModel
      .find({
        name: regex,
      })
      .populate("category");
  },
};
