'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.TEXT
            }
        },
        {
            timestamps: true
        }
    );
};
