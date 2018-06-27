"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default Transformer Function Generator that is supplied.
 * It needs to be called with the source name, and it will return a
 * function that can transform a string array into an array of IFeature.
 * @param {string} sourceName
 * @returns {TTransformer<string[]>}
 */
exports.transformer = function (sourceName) {
    return function (remoteResults) {
        if (Array.isArray(remoteResults)) {
            return remoteResults.map(function (feat) {
                return {
                    name: feat,
                    value: feat,
                    source: sourceName,
                };
            });
        }
        return [];
    };
};
