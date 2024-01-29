const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * dropTable() => "Upvotes", deps: []
 * createTable() => "UpvoteModel", deps: [Posts, Users]
 *
 */

const info = {
  revision: 2,
  name: "relations",
  created: "2024-01-29T06:08:46.711Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Upvotes", { transaction }],
  },
  {
    fn: "createTable",
    params: [
      "UpvoteModel",
      {
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
        PostId: {
          type: Sequelize.UUID,
          field: "PostId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Posts", key: "id" },
          primaryKey: true,
        },
        UserId: {
          type: Sequelize.UUID,
          field: "UserId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["UpvoteModel", { transaction }],
  },
  {
    fn: "createTable",
    params: [
      "Upvotes",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        upvotes: { type: Sequelize.STRING, field: "upvotes", allowNull: true },
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
        postid: {
          type: Sequelize.UUID,
          field: "postid",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Posts", key: "id" },
          allowNull: true,
        },
      },
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
