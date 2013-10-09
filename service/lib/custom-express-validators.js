/*jslint node: true */

module.exports = function (expressValidator, moment) {
    'use strict';

    expressValidator.Validator.prototype.date8601 = function () {
        if (!moment(this.str, "YYYY-MM-DD").isValid()) {
            this.error(this.msg);
        }

        return this;
    };
};
