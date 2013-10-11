/*jslint node: true */

module.exports = function (expressValidator, moment) {
    'use strict';

    expressValidator.Validator.prototype.isDate8601 = function () {
        if (!moment(this.str, "YYYY-MM-DD").isValid()) {
            this.error(this.msg || 'Date format is not YYYY-MM-DD as in ISO 8601');
        }

        return this;
    };

    expressValidator.Validator.prototype.isBloodType = function (allowEmpty) {
        var values = ['A', 'B', 'AB', 'O'];

        if (allowEmpty) {
            values.push('');
        }

        if (!this.msg) {
            this.msg = 'Invalid blood type';
        }

        return this.isIn(values);
    };
};
