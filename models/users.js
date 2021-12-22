module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        userID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userXP: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    })
};