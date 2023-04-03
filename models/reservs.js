// 예약

const Sequelize = require('sequelize');

module.exports = class Reserv extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            reindex: { // 예약번호
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            rename: { // 예약자명
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            recontact: { // 연락처
                type: Sequelize.STRING(11),
                allowNull: false,
            },
            reci: { // 체크인 날짜
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            reco: { // 체크아웃 날짜
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            renums: { // 예약 객실 수
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            reppl: { // 예약 손님 수
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            rebf: { // 조식 포함 여부
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Reserv',
            tableName: 'reservs',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Reserv.belongsTo(db.User, { foreignKey: 'booker', targetKey: 'uid', onDelete: 'CASCADE' });
        db.Reserv.belongsTo(db.Room, { foreignKey: 'rname', targetKey: 'rname', onDelete: 'CASCADE' });
    }
};