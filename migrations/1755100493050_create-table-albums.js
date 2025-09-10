exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(22)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
      check: 'year >= 1000 AND year <= 9999',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
