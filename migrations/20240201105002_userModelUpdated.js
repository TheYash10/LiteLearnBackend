const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Users", deps: []
 * createTable() => "Posts", deps: [Users]
 * createTable() => "UpvoteModels", deps: [Posts, Users]
 *
 */

const info = {
  revision: 1,
  name: "userModelUpdated",
  created: "2024-02-01T10:50:02.147Z",
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
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        username: { type: Sequelize.STRING, field: "username" },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        profile: { type: Sequelize.STRING, field: "profile", allowNull: true },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: true,
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
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        filetype: { type: Sequelize.STRING, field: "filetype" },
        attachment: { type: Sequelize.STRING, field: "attachment" },
        tag: { type: Sequelize.STRING, field: "tag" },
        domain: { type: Sequelize.STRING, field: "domain" },
        note: { type: Sequelize.TEXT("long"), field: "note", allowNull: true },
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
  {
    fn: "createTable",
    params: [
      "UpvoteModels",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
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
        PostId: {
          type: Sequelize.UUID,
          field: "PostId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Posts", key: "id" },
          unique: "UpvoteModels_UserId_PostId_unique",
        },
        UserId: {
          type: Sequelize.UUID,
          field: "UserId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          unique: "UpvoteModels_UserId_PostId_unique",
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
    params: ["UpvoteModels", { transaction }],
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
