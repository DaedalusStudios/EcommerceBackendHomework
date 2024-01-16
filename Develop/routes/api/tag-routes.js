const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const Tags = await Tag.findAll({
      include: {
        model: ProductTag,
        as: 'product_tags', 
        attributes: ['id', 'product_id', 'tag_id'],        
      },
      include: {
        model: Product,
        as: 'products', 
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],        
      },
    });
    res.json(Tags);
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const Tags = await Tag.findByPk(req.params.id, {
      include: {
        model: ProductTag,
        as: 'product_tags', 
        attributes: ['id', 'product_id', 'tag_id'],        
      },
      include: {
        model: Product,
        as: 'products', 
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],        
      },
    });
    res.json(Tags);
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagData[0]) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.status(200).json(tagData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    if(res.status(200).json({ message: 'Tag deleted!' }));
  }
  catch (err) {
    res.status(500).json(err);
  }
  
});

module.exports = router;
