// 게시글

const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            pindex: { // 게시글 번호
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            pdate: { // 작성일자
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            phits: { // 조회수
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            panswer: { // 답변여부(FAQ)
                type: Sequelize.TINYINT,
                allowNull: true,
            },
            ptitle: { // 제목
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            pcontent: { // 내용
                type: Sequelize.TEXT,
                allowNull: true,
            },
            img: { // 첨부사진
                type: Sequelize.STRING(500),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Post.hasMany(db.Comment, { foreignKey: 'pindex', sourceKey: 'pindex', onDelete: 'CASCADE' });
        db.Post.belongsTo(db.User, { foreignKey: 'writerid', targetKey: 'uid', onDelete: 'CASCADE' });
        db.Post.belongsTo(db.User, { foreignKey: 'writer', targetKey: 'uname', onDelete: 'CASCADE' });
        db.Post.belongsTo(db.Board, { foreignKey: 'bindex', targetKey: 'bindex', onDelete: 'CASCADE' });
    }
};