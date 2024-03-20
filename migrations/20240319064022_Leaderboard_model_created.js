const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Leaderboards", deps: [Users]
 *
 */

const info = {
  revision: 6,
  name: "Leaderboard_model_created",
  created: "2024-03-19T06:40:22.451Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Leaderboards",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        totalComments: {
          type: Sequelize.BIGINT,
          field: "totalComments",
          allowNull: false,
          defaultValue: 0,
        },
        totalUpvotes: {
          type: Sequelize.BIGINT,
          field: "totalUpvotes",
          allowNull: false,
          defaultValue: 0,
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
        userId: {
          type: Sequelize.UUID,
          field: "userId",
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
    params: ["Leaderboards", { transaction }],
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
