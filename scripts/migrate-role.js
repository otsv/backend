if (db.getCollectionNames().includes('roles')) {
  db.runCommand({ drop: 'roles' });
}

db.runCommand({
  create: 'roles',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', '__v'],
      properties: {
        name: {
          enum: ['admin', 'vendor staff', 'employee'],
          description: 'can only be one of the enum values and is required',
        },
        createdAt: {
          bsonType: ['date', 'null'],
          description: 'must be a date',
        },
        updatedAt: {
          bsonType: ['date', 'null'],
          description: 'must be a date',
        },
        deletedAt: {
          bsonType: ['date', 'null'],
          description: 'must be a date',
        },
        createdBy: {
          bsonType: ['objectId', 'null'],
          description: 'must be a objectId',
        },
        updatedBy: {
          bsonType: ['objectId', 'null'],
          description: 'must be a date',
        },
        deletedBy: {
          bsonType: ['objectId', 'null'],
          description: 'must be a date',
        },
        __v: {
          bsonType: 'int',
          description: 'must be a string and is required',
        },
      },
    },
  },
});

db.runCommand({
  insert: 'roles',
  documents: [
    {
      name: 'admin',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      __v: 0,
    },
    {
      name: 'vendor',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      __v: 0,
    },
    {
      name: 'employee',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      __v: 0,
    },
  ],
  ordered: true,
});
