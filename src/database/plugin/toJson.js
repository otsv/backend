/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

function removeDefaultFields(schema) {
  delete schema._id;
  delete schema.__v;
  delete schema.createdAt;
  delete schema.updatedAt;
  delete schema.createdBy;
  delete schema.deletedAt;
  delete schema.deletedBy;
  delete schema.updatedBy;
  delete schema.createdBy;
}

export default function toJson(schema) {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      removeDefaultFields(ret);

      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
}
