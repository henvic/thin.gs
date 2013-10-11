/*jslint node: true */

module.exports = function (expressValidator, moment) {
    'use strict';

    expressValidator.Validator.prototype.isDate8601 = function () {
        if (!moment(this.str, "YYYY-MM-DD").isValid()) {
            this.error(this.msg || 'Date format is not YYYY-MM-DD as in ISO 8601');
        }

        return this;
    };
};
