var _ = require('lodash');
module.exports = {
  setOptions: function (schema) {

    function setRunValidators() {
      this.setOptions({
        runValidators: true
      });
      this.setOptions({
        new: true
      });
    }
    schema.pre('findOneAndUpdate', setRunValidators);
  },

  timeStamp: function (schema) {

    if (_.isEmpty(schema.path('updatedAt'))) {
      schema.add({
        updatedAt: {
          type: Date,
        }
      });
    }

    if (_.isEmpty(schema.path('createdAt'))) {
      schema.add({
        createdAt: {
          type: Date,
          default: Date.now
        }
      });
    }

    /**
     * Update createdAt and updatedAt
     */
    function updateSchema() {
      this.update(this._conditions, {
        $set: {
          updatedAt: this._update.updatedAt || new Date
        }
      });
    }

    /**
     * Update updatedAt and created at on save
     */
    function updateSaveSchema() {
      if (_.isEmpty(schema.path('createdAt'))) {
        this.update({}, {
          $set: {
            createdAt: new Date
          }
        });
      }
      this.updatedAt = this.updatedAt || new Date;
    }

    schema.pre('findOneAndUpdate', updateSchema);
    schema.pre('save', updateSaveSchema);

  }
}