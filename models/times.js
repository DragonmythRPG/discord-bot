module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Time', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.STRING,
        },
        endTime: {
            type: DataTypes.STRING,
        },
    });
};