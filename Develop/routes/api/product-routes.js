const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const categoriesWithTags = await Product.findAll({
      include: {
        model: Category,
        as: 'categories', 
        attributes: ['id', 'category_name'],        
      },
      include: {
        model: Tag,
        as: 'tags', 
        attributes: ['id', 'tag_name'],
      },
    });
    res.json(categoriesWithTags);
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: {
        model: Category,
        as: 'categories', 
        attributes: ['id', 'category_name'],        
      },
      include: {
        model: Tag,
        as: 'tags', 
        attributes: ['id', 'tag_name'],
      },
    });
    res.json(productData);
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }

});

// create new product
/* req.body should look like this...
  {
    product_name: "Basketball",
    price: 200.00,
    stock: 3,
    tagIds: [1, 2, 3, 4]
  }
*/
router.post('/', async (req, res) => {
  try {
    // Create the product
    console.log("req.body******************************************************************");
    console.log(req.body);
    console.log("req.body******************************************************************");
    const product = await Product.create(req.body);
    
        if (req.body.tags && req.body.tags.length > 0) {
          console.log('req.body.tags:', req.body.tags);
          const tags = await Tag.findAll({
            where: {
              id: req.body.tags,
            },
          });
          console.log('Fetched Tags:', tags);
          await product.setTags(tags);
    }
    
    // Fetch the product with associated tags
    const productWithTags = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }, { model: Tag, as: 'tags' }],
    });

    // Respond with the created product along with associated tags
    res.status(200).json(productWithTags);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!productData[0]) {
      res.status(404).json({ message: 'Product ID not found, or nothing to update!' });
      return;
    }
    res.status(200).json({ message: 'Product updated!' });
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const prodData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!prodData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    if(res.status(200).json({ message: 'Product deleted!' }));
  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
