"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class FeatureFlagResult
 */
var FeatureFlagResult = /** @class */ (function () {
    function FeatureFlagResult(value) {
        this.defaultValue = value;
    }
    Object.defineProperty(FeatureFlagResult.prototype, "default", {
        /**
         * Returns the default value of the feature flag.
         * @returns {any}
         */
        get: function () {
            return this.defaultValue;
        },
        set: function (value) {
            throw Error('Illegal Action! Cannot set ' + value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calls the toString method on the default value of the feature flag and then returns it.
     * NOTE: If it fails to cast the value to string, it will return the default value.
     * @returns {string | any}
     */
    FeatureFlagResult.prototype.asString = function () {
        try {
            return this.defaultValue.toString();
        }
        catch (e) {
            return this.default;
        }
    };
    /**
     * Casts the default value of the feature flag to Number (e.g. Number(true)).
     * NOTE: If it fails to cast, it will return the default value.
     * @returns {number | any}
     */
    FeatureFlagResult.prototype.asNumber = function () {
        try {
            var value = Number(this.defaultValue);
            if (isNaN(value)) {
                throw Error('NaN');
            }
            return value;
        }
        catch (e) {
            return this.default;
        }
    };
    /**
     * Casts the default value of the feature flag to Boolean (e.g. Boolean(false)).
     * NOTE: If it fails to cast, it will return the default value.
     * @returns {boolean}
     */
    FeatureFlagResult.prototype.asBoolean = function () {
        return Boolean(this.defaultValue);
    };
    return FeatureFlagResult;
}());
exports.FeatureFlagResult = FeatureFlagResult;
