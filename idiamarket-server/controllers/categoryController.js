const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product");

// Create a new Category
async function buildUri(parentId, slugifiedTitle) {
  if (!parentId) {
    return slugifiedTitle;
  }

  const parentCategory = await Category.findById(parentId);

  if (!parentCategory) {
    throw new Error("Parent category not found");
  }

  const parentUri = await buildUri(parentCategory.parent, parentCategory.category_code);

  return `${parentUri}/${slugifiedTitle}`;
}

exports.createCategory = async (req, res) => {
  try {
    const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });
    let categoryUri = slugifiedTitle;

    if (req.body.parent) {
      categoryUri = await buildUri(req.body.parent, slugifiedTitle);
    }

    const category = new Category({
      ...req.body,
      category_code: slugifiedTitle,
      uri: categoryUri,
    });

    await category.save();

    if (req.body.parent) {
      await Category.findByIdAndUpdate(req.body.parent, {
        $push: { children: category._id },
      });
    }

    res.status(201).send(category);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get all Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a Category by ID
exports.updateCategory = async (req, res) => {
  try {
    const updates = req.body;

    // If title is being updated, regenerate category_code
    if (updates.title) {
      updates.category_code = slugify(updates.title, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    res.send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a Category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    if (category.parent) {
      await Category.findByIdAndUpdate(category.parent, {
        $pull: { children: category._id },
      });
    }

    res.send({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get Products by Category Code
exports.getCategoryAndProductsByCategoryCode = async (req, res) => {
  try {
    const categoryCode = req.params.category_code;

    const page = parseInt(req.query.page, 10);

    const limit = parseInt(req.query.limit, 10);

    const skip = (page - 1) * limit;

    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Infinity;

    const category = await Category.findOne({ category_code: categoryCode }).populate({
      path: "children",
      model: "Category",
    });

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    const products = await Product.find({
      categories: category._id,
      price: { $gte: minPrice, $lte: maxPrice },
    })
      .populate("color")
      .populate("categories")
      .populate("short_description")
      .populate({
        path: "attributes",
        populate: {
          path: "items",
          model: "AttributeItem",
        },
      })
      .populate("variants.attributes")
      .populate("stickers")
      .populate("meta_data")
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      categories: category._id,
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    res.send({
      category,
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get All Products for Filters by Category Code
exports.getAllProductsForFiltersByCategoryCode = async (req, res) => {
  try {
    const categoryCode = req.params.category_code;

    const category = await Category.findOne({ category_code: categoryCode }).populate({
      path: "children",
      model: "Category",
    });

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    const products = await Product.find({
      categories: category._id,
    })
      .populate("color")
      .populate("attributes.items");

    if (!products) {
      return res.status(404).send({ error: "No products found" });
    }

    // Extract unique values for filters (price range, colors, attributes)
    const prices = products.map((product) => parseFloat(product.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const colors = Array.from(new Set(products.map((product) => product.color?.title).filter(Boolean)));

    const attributes = {};
    products.forEach((product) => {
      product.attributes.forEach((attr) => {
        if (!attributes[attr.code]) {
          attributes[attr.code] = new Set();
        }
        attr.items.forEach((item) => attributes[attr.code].add(item.title));
      });
    });

    // Convert Set to Array
    Object.keys(attributes).forEach((key) => {
      attributes[key] = Array.from(attributes[key]);
    });

    res.send({
      minPrice,
      maxPrice,
      colors,
      attributes,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Count Products by Category Code
exports.countProductsByCategoryCodes = async (req, res) => {
  try {
    const categoryCodes = req.body.category_codes;
    const categories = await Category.find({ category_code: { $in: categoryCodes } });
    const counts = {};

    for (const category of categories) {
      const productCount = await Product.countDocuments({ categories: category._id });
      counts[category.category_code] = productCount;
    }

    res.send(counts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Controller function to get breadcrumbs by category_code
exports.getBreadcrumbs = async (req, res) => {
  const { category_code } = req.params;

  try {
    const breadcrumbs = await buildBreadcrumbs(category_code);
    res.json(breadcrumbs);
  } catch (error) {
    console.error("Error fetching breadcrumbs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const buildBreadcrumbs = async (category_code) => {
  let breadcrumbs = [];

  let category = await Category.findOne({ category_code }).populate("parent");

  while (category) {
    breadcrumbs.unshift({
      name: category.title,
      path: `/${category.source}/${category.uri}`,
    });

    if (category.parent) {
      category = await Category.findById(category.parent._id).populate("parent");
    } else {
      category = null;
    }
  }

  return breadcrumbs;
};
