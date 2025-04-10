var express = require('express');
var router = express.Router();
let productController = require('../controllers/products')
let {CreateErrorRes,
  CreateSuccessRes, CreateFailRes} = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productController.GetAllProducts()
  CreateSuccessRes(res,products,200);
});
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productController.GetProductByID(req.params.id)
    console.log(product)
    if(!product){
        CreateFailRes(res,"Product not found",404);
    }
    CreateSuccessRes(res,product,200);
  } catch (error) {
    next(error)
  }
});
router.post('/', async function(req, res, next) {
  try {
    let body = req.body
    let newProduct = await productController.CreateAProduct(
      body.name,
      body.description,
      body.price,
      body.quantity,
      body.category
    )
    CreateSuccessRes(res,newProduct,201);
  } catch (error) {
    next(error)
  }
});
router.put('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updateProduct = await productController.UpdateAProduct(id,body)
    CreateSuccessRes(res,updateProduct,200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updateProduct = await productModel.findByIdAndUpdate(
      id,{
        isDeleted:true
      },{new:true}
    )
    CreateSuccessRes(res,updateProduct,200);
  } catch (error) {
    next(error)
  }
});

router.get('/:slugcategory/:slugproduct', async function(req, res, next) {
  try {
      const { slugcategory, slugproduct } = req.params;
      
      const category = await categoryModel.findOne({ slug: slugcategory });
      if (!category) {
          return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const product = await productModel.findOne({ slug: slugproduct, category: category._id }).populate('category');
      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      CreateSuccessRes(res, product, 200);
  } catch (error) {
      next(error);
  }
});

router.post('/search', async function(req, res, next) {
  try {
    let body = req.body
    let products = await productController.FindProductByName(body.name)
    CreateSuccessRes(res,products,200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
