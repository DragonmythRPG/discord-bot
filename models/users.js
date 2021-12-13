module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        userID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userName: {
            type: DataTypes.STRING,
        },
        userXP: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    })
};