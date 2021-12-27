const sequelize_connection = require("../../connections/mysql_sequelize");
const {DataTypes} = require("sequelize");

const Category = sequelize_connection.define("categories", {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    qty: {
        type: DataTypes.INTEGER
    },
    type: {
        type: DataTypes.INTEGER,
        defaultValue: true
    },
    avatar: {
        type: DataTypes.TEXT,
        get() {
            let result = [];
            let value = this.getDataValue("avatar");
            if (value) {
                result = JSON.parse(value);
            }
            return result
        }
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: true
    }
},{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Category;