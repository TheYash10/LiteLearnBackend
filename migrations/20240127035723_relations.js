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
  created: "2024-01-27T03:57:23.843Z",
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
        username: { type: Sequelize.STRING, field: "username" },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        profile: { type: Sequelize.STRING, field: "profile", allowNull: true },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: true,
        },
        domain: { type: Sequelize.STRING, field: "domain" },
        createdat: {
          type: Sequelize.DATE,
          field: "createdat",
          allowNull: false,
        },
        updatedat: {
          type: Sequelize.DATE,
          field: "updatedat",
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
        filetype: { type: Sequelize.STRING, field: "filetype" },
        attachment: { type: Sequelize.STRING, field: "attachment" },
        tag: { type: Sequelize.STRING, field: "tag" },
        upvote: {
          type: Sequelize.JSON,
          field: "upvote",
          defaultValue: Sequelize.Array,
        },
        domain: { type: Sequelize.STRING, field: "domain" },
        note: { type: Sequelize.STRING, field: "note", allowNull: true },
        createdat: {
          type: Sequelize.DATE,
          field: "createdat",
          allowNull: false,
        },
        updatedat: {
          type: Sequelize.DATE,
          field: "updatedat",
          allowNull: false,
        },
        createdby: {
          type: Sequelize.UUID,
          field: "createdby",
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
