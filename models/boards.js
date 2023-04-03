// 게시판

const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            bindex: { // 게시판 번호
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            bname: { // 게시판 이름
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Board',
            tableName: 'boards',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Board.hasMany(db.Post, { foreignKey: 'bindex', sourceKey: 'bindex', onDelete: 'CASCADE' });
    }
};