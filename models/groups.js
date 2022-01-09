module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Group', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        players: {
            type: DataTypes.STRING,
        },
    });
};