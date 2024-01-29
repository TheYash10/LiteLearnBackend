"use strict";

module.exports = (sequelize, DataTypes) => {
    const UpvoteModel = sequelize.define("UpvoteModel", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
    });
    return UpvoteModel;
};
