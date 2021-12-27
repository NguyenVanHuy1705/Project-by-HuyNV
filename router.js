const CategoryController = require("./controllers/category");

const categoryController = new CategoryController();

function setRouter(app) {

    app.post("/category/create", categoryController.create);

    app.post("/category/category_list", CategoryController.category_list);

    app.post("/category/update", CategoryController.update);

    app.post("/category/delete", CategoryController.delete);

    app.post("/category/category_list/update_status", CategoryController.update_status);

    app.post("/category/detail_category", CategoryController.detail_category);
}

module.exports = setRouter;