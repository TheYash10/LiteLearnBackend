const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Users", deps: []
 * createTable() => "Posts", deps: [Users]
 *
 */

const info = {
  revision: 1,
  name: "relations",
  created: "2024-01-24T06:55:38.437Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Users",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          allowNull: false,
        },
        userName: { type: Sequelize.STRING, field: "userName" },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        password: { type: Sequelize.STRING, field: "password" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Posts",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          allowNull: false,
        },
        fileType: { type: Sequelize.STRING, field: "fileType" },
        attachment: { type: Sequelize.STRING, field: "attachment" },
        category: { type: Sequelize.STRING, field: "category" },
        tag: { type: Sequelize.STRING, field: "tag" },
        likes: {
          type: Sequelize.JSON,
          field: "likes",
          defaultValue: Sequelize.Array,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        createdBy: {
          type: Sequelize.UUID,
          field: "createdBy",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Posts", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
