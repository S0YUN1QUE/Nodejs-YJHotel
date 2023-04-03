const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            uid: { // 아이디
                type: Sequelize.STRING(50),
                primaryKey: true,
            },
            upwd: { // 비밀번호
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            uname: { // 닉네임
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: '이름없음',
                unique: true,
            },
            uauth: { // 등급 권한
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'User',
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post, { foreignKey: 'writerid', sourceKey: 'uid', onDelete: 'CASCADE' });
        db.User.hasMany(db.Post, { foreignKey: 'writer', sourceKey: 'uname', onDelete: 'CASCADE' });
        db.User.hasMany(db.Comment, { foreignKey: 'commenterid', sourceKey: 'uid', onDelete: 'CASCADE' });
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'uname', onDelete: 'CASCADE' });
        db.User.hasMany(db.Reserv, { foreignKey: 'booker', sourceKey: 'uid', onDelete: 'CASCADE' });
    }
};