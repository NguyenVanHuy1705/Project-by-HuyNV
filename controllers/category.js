const Category = require("../models/mysql_models/models_category");
const Sequelize = require('sequelize');
const sequelize = require("../connections/mysql_sequelize");
const Op = Sequelize.Op;

class CategoryController {
    constructor() {
    }

    create(req, res) {
        let body = req.body;

        if (!Array.isArray(body.avatar)) {
            return res.json({
                status: false,
                message: "Invalid avatar",
                error_code: 1
            })
        }
        const category = {
            name: body.name,
            qty: body.qty,
            type: body.type,
            avatar: JSON.stringify(body.avatar),
            status: body.status
        };

        Category.create(category)
            .then(data => {
                res.send({
                    status: true,
                    message: "Tạo danh mục thành công",
                    data: data,
                });
            })
            .catch(err => {
                    res.send({
                    message: err.message || "Đã có lỗi xảy ra"
                });
            });
    }

    static async category_list(req, res) {

        try {
            let body = req.body;
            let onclick_checkbox = body.onclick_checkbox;
            const limit = 3;
            let page = body.page;
            let offset = page == 1 ? 0 : (page - 1) * limit;

            let where = {};

            if (onclick_checkbox) {
                if (body.filter) {
                    let filter = body.filter;
                    if (filter.name || filter.name == 0) {
                        where.name = {[Op.substring]: `${filter.name}`};
                    }
                    if (filter.type && typeof filter.type == "number") {
                        where.type = `${filter.type}`;
                    }
                }
                else {
                    res.send({
                        status: true,
                        message: "Not found filter"
                    });
                }
            } else {
                let category_ids = body.category_ids;
                where.ID = {
                    [Sequelize.Op.in]: category_ids
                }
            }
            let option = {
                where: where,
                limit: limit,
                offset: offset
            };

            let data = await Category.findAll(option);
            res.send({
                status: true,
                message: "Show list categories",
                data: data
            });
        }
        catch (e) {
            console.log(e)
        }
    }

    static async update(req, res) {
        try {
            let body = req.body;
            let ID = body.ID;
            let avatar = JSON.stringify(body.avatar);
            let where = {};
            where.ID = ID;
            let option = {
                where: where
            };
            let data = await Category.update({name: body.name, qty: body.qty, type: body.type, avatar: avatar, status: body.status}, option);
            console.log(data);
            res.send({
                status: true,
                message: "Category update successful ",
                data: data
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    static async update_status(req, res) {
        try {
            let update = "update categories set status =if(status =1,0,1)";
            let body = req.body;
            let onclick_checkbox = body.onclick_checkbox;
            let where = {};

            if (onclick_checkbox) {
                if (body.filter) {
                    let filter = body.filter;
                    if (filter.name || filter.name == "") {
                        where.name = {[Op.substring]: `${filter.name}`};
                    }
                    if (filter.type && typeof filter.type == "number") {
                        where.type = `${filter.type}`;
                    }
                }
                else {
                    res.send({
                        status: true,
                        message: "Not found filter"
                    });
                }

            } else {
                let category_ids = body.category_ids;
                where.ID = {
                    [Sequelize.Op.in]: category_ids
                }
            }
            let option = {
                where: where
            };
            let cate_ids = await Category.findAll(option);
            let response = cate_ids.map(item => {
                return item.ID;
            });
            let array = response.toString();
            let data = await sequelize.query(update + "where ID in " + "(" + array + ")");
            console.log(data);
            res.send({
                status: true,
                message: "Show/hide categories"
            });
        }
        catch (e) {
            res.send({
                status: false,
                message: e.message
            });
        }
    }
    static async detail_category(req, res) {
        try {
            let body = req.body;
            let ID = body.ID;
            let where = {};
            where.ID = ID;
            let option = {
                where: where
            };
            let cate_ids = await Category.findAll();
            let response = cate_ids.map(item => {
                return item.ID;
            });
            let check = response.includes(ID);
            if (check == true) {
                let detail = await Category.findOne(option);
                console.log(detail);
                res.send({
                    status: true,
                    message: "Show detail category",
                    data: detail
                });
            }
            else {
                res.send({
                    status: false,
                    message: "Không tồn tại danh mục"
                });
            }

        }
        catch (e) {
            res.send({
                status: false,
                message: e.message
            });
        }
    }
    static async delete(req, res) {
        try {
            let deleteCategories = "delete from categories";
            let body = req.body;
            let onclick_checkbox = body.onclick_checkbox;

            let where = {};

            if (onclick_checkbox) {
                if (body.filter) {
                    let filter = body.filter;
                    if (filter.name || filter.name == "") {
                        where.name = {[Op.substring]: `${filter.name}`};
                    }
                    else {
                        return res.json({
                            message: "Không tìm thấy tên danh mục",
                            error_code: 1
                        })
                    }
                    if (filter.type || typeof filter.type == "number") {
                        where.type = `${filter.type}`;
                    }
                    else {
                        return res.json({
                            message: "Không tìm thấy loại danh mục",
                            error_code: 1
                        })
                    }
                }
                else {
                    res.send({
                        status: true,
                        message: "Not found filter"
                    });
                }

            } else {
                let category_ids = body.category_ids;
                where.ID = {
                    [Sequelize.Op.in]: category_ids
                }
            }
            let option = {
                where: where,
            };
            let cate_ids = await Category.findAll(option);
            let response = cate_ids.map(item => {
                return item.ID;
            });
            let array = response.toString();
            let data = await sequelize.query(deleteCategories + " where ID in " + "(" + array + ")");
            res.send({
                status: true,
                message: "Delete categories successfully"
            });
        }
        catch (e) {
            res.send({
                status: false,
                message: "Delete categories failed"
            })
        }
    }
}
module.exports = CategoryController;