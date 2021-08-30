if (db.getCollectionNames().includes('users')) {
  db.runCommand({ drop: 'users' });
}

db.runCommand({
  create: 'users',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password', 'role', 'status', '__v'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be string and is required',
        },
        email: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        role: {
          bsonType: 'objectId',
          description: 'must be objectId and is required',
        },
        status: {
          enum: ['activate', 'deactivate'],
          description: 'can only be one of the enum values and is required',
        },
        __v: {
          bsonType: 'int',
          description: 'must be a string and is required',
        },
      },
    },
  },
});

const roleCursor = db.runCommand({
  find: 'roles',
  filter: { name: 'admin' },
  limit: 1,
}).cursor;
const adminRole = roleCursor.firstBatch[0];

db.runCommand({
  insert: 'users',
  bypassDocumentValidation: false,
  documents: [
    {
      name: 'otsv admin',
      email: process.env.ROOT_USER_EMAIL,
      password: process.env.ROOT_USER_PASSWORD,
      role: adminRole._id,
      status: 'activate',
      __v: 0,
    },
  ],
});

const firstUserCursor = db.runCommand({ find: 'users', filter: {} }).cursor;
const firstUser = firstUserCursor.firstBatch[0];

db.runCommand({
  update: 'roles',
  updates: [
    {
      q: {},
      u: { $set: { createdBy: firstUser._id } },
      multi: true,
    },
  ],
});
