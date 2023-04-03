// 댓글

const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            cindex: { // 댓글 번호
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            cdate: { // 작성일자
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            comment: { // 내용
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: '내용없음',
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Comment.belongsTo(db.Post, { foreignKey: 'pindex', targetKey: 'pindex', onDelete: 'CASCADE' });
        db.Comment.belongsTo(db.User, { foreignKey: 'commenterid', targetKey: 'uid', onDelete: 'CASCADE' });
        db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'uname', onDelete: 'CASCADE' });
    }
}