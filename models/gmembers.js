// 조원 소개

const Sequelize = require('sequelize');

module.exports = class GMember extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            img: { // 사진
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            gsnum: { // 학번
                type: Sequelize.STRING(7),
                primaryKey: true,
            },
            gname: { // 이름
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            gbirth: { // 생년월일
                type: Sequelize.DATE,
                allowNull: true,
            },
            gcontact: { // 연락처
                type: Sequelize.STRING(11),
                allowNull: true,
                unique: true
            },
            gemail: { // 이메일
                type: Sequelize.STRING(30),
                allowNull: true,
                unique: true,
            },
            gmbti: { // mbti
                type: Sequelize.STRING(4),
                allowNull: true,
            },
            glike: { // 좋아하는 것
                type: Sequelize.STRING(50),
                allowNull: true
            },
            gpart: { // 담당 파트
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            gauth: { // 등급 권한
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'admin',
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'GMember',
            tableName: 'gmembers',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
};