const slugify = require("slugify");
const Product = require("../models/product");
const Category = require("../models/category");

// Create a new Product
exports.createProduct = async (req, res) => {
    try {
        const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });
        const productUri = `${slugifiedTitle}-${req.body.sku}`;

        const product = new Product({
            ...req.body,
            uri: productUri,
        });

        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get all Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate("color").populate("categories").populate("short_description").populate("attributes").populate("variants.attributes").populate("stickers").populate("meta_data");
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update a Product by ID
exports.updateProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // If title or SKU is being updated, regenerate the `uri`
        let updatedData = { ...req.body };
        if (req.body.title || req.body.sku) {
            const slugifiedTitle = slugify(req.body.title || req.body.originalTitle, { lower: true, strict: true });
            const productUri = `${slugifiedTitle}-${req.body.sku || req.body.originalSku}`;
            updatedData.uri = productUri;
        }

        const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true, runValidators: true });

        if (!product) {
            return res.status(404).send({ error: error.message });
        }

        res.send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Update a Product by SKU
exports.updateProductBySku = async (req, res) => {
    try {
        const productSku = req.params.sku;

        // If title is being updated, regenerate the `uri`
        let updatedData = { ...req.body };
        if (req.body.title) {
            const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });
            const productUri = `${slugifiedTitle}-${productSku}`;
            updatedData.uri = productUri;
        }

        const product = await Product.findOneAndUpdate({ sku: productSku }, updatedData, { new: true, runValidators: true });

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get a single Product by URI
exports.getProductByUri = async (req, res) => {
    try {
        const product = await Product.findOne({ uri: req.params.uri })
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
            .populate({
                path: "variants",
                populate: [
                    {
                        path: "attributes",
                        populate: {
                            path: "attribute",
                            model: "AttributeItem",
                        },
                    },
                    {
                        path: "colors",
                        populate: {
                            path: "color",
                            model: "Color",
                        },
                    },
                ],
            })
            .populate("stickers")
            .populate("meta_data");

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get the most popular products by view count
exports.getPopularProducts = async (req, res) => {
    try {
        const popularProducts = await Product.find({})
            .sort({ view_count: -1 }) // Sort by view_count in descending order
            .limit(6) // Limit the results to 6 products
            .populate("color")
            .populate("categories")
            .populate("short_description")
            .populate("attributes")
            .populate("variants.attributes")
            .populate("stickers")
            .populate("meta_data");

        res.send(popularProducts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get 4 random products that refresh daily
exports.getDayProducts = async (req, res) => {
    try {
        // Select 4 random products using aggregation
        const randomDayProducts = await Product.aggregate([{ $sample: { size: 4 } }]).exec();

        // Populate the necessary fields
        const populatedProducts = await Product.populate(randomDayProducts, [{ path: "color" }, { path: "categories" }, { path: "short_description" }, { path: "attributes" }, { path: "variants.attributes" }, { path: "stickers" }, { path: "meta_data" }]);

        res.send(populatedProducts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Search Products by query
exports.searchProducts = async (req, res) => {
    try {
        const searchQuery = req.query.query;

        if (!searchQuery) {
            return res.status(400).send({ error: "Search query is required." });
        }

        // Perform the search using a regular expression for partial matching
        const products = await Product.find({
            title: { $regex: searchQuery, $options: "i" }, // 'i' makes the search case-insensitive
        })
            .populate("color")
            .populate("categories")
            .populate("short_description")
            .populate("attributes")
            .populate("attributes.items")
            .populate("variants.attributes")
            .populate("stickers")
            .populate("meta_data");

        res.send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Delete a Product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
