const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * renameColumn(likes) => "Posts"
 * changeColumn(createdBy) => "Posts"
 * changeColumn(id) => "Posts"
 * changeColumn(id) => "Users"
 *
 */

const info = {
  revision: 2,
  name: "relations",
  created: "2024-01-24T06:59:08.947Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "renameColumn",
    params: ["Posts", "likes", "upvote"],
  },
  {
    fn: "changeColumn",
    params: [
      "Posts",
      "createdBy",
      {
        type: Sequelize.INTEGER,
        field: "createdBy",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Users", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Posts",
      "id",
      {
        type: Sequelize.INTEGER,
        field: "id",
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "id",
      {
        type: Sequelize.INTEGER,
        field: "id",
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "renameColumn",
    params: ["Posts", "upvote", "likes"],
  },
  {
    fn: "changeColumn",
    params: [
      "Posts",
      "createdBy",
      {
        type: Sequelize.UUID,
        field: "createdBy",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Users", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Posts",
      "id",
      { type: Sequelize.UUID, field: "id", primaryKey: true, allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "id",
      { type: Sequelize.UUID, field: "id", primaryKey: true, allowNull: false },
      { transaction },
    ],
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
