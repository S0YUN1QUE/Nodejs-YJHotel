const Sequelize = require('sequelize');

module.exports = class Room extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            rname: {
                type: Sequelize.STRING(20),
                primaryKey: true,
            },
            rmax: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Room', 
            tableName: 'rooms',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Room.hasMany(db.Reserv, { foreignKey: 'rname', sourceKey: 'rname', onDelete: 'CASCADE' });
    }
};