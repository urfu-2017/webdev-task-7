'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            login: {
                type: DataTypes.TEXT,
                unique: true
            }
        },
        {
            timestamps: true
        }
    );
};
