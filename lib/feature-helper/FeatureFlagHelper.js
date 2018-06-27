"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
require("es7-object-polyfill");
var transformer_1 = require("./transformer");
var FeatureFlagResult_1 = require("./FeatureFlagResult");
var FeatureFlagHelper = /** @class */ (function () {
    /**
     * Constructor - add all of your feature flag sources here.
     * Beware, they will go through validation, so make sure you check your sources
     * by manually validating them from FeatureFlagHelper.isValidFeatureSource(sourceName);
     * @param {Array<IFeatureSource<any>>} featureSources
     */
    function FeatureFlagHelper(featureSources) {
        if (featureSources === void 0) { featureSources = []; }
        this.enabledFeatures = {};
        this.sourceRegistry = {};
        for (var _i = 0, featureSources_1 = featureSources; _i < featureSources_1.length; _i++) {
            var source = featureSources_1[_i];
            this.addFeatureSource(source);
        }
        FeatureFlagHelper.instance = this;
    }
    FeatureFlagHelper.getInstance = function () {
        if (FeatureFlagHelper.instance) {
            return FeatureFlagHelper.instance;
        }
        return new FeatureFlagHelper();
    };
    /**
     * A Validator function to verify the validity of a Feature Flag sourceName.
     * Source names may not contain exclamation marks.
     * @param source
     * @returns {boolean}
     */
    FeatureFlagHelper.isValidFeatureSource = function (source) {
        if (typeof source === 'object') {
            var sourceName = source.sourceName, fetcher = source.fetcher;
            return ((typeof sourceName === 'string' && FeatureFlagHelper.isValidSourceName(sourceName))
                && typeof fetcher === 'function');
        }
        return false;
    };
    FeatureFlagHelper.isValidSourceName = function (name) {
        if (name === '') {
            return false;
        }
        var regex = new RegExp(/!/g);
        return !regex.test(name);
    };
    Object.defineProperty(FeatureFlagHelper.prototype, "allSourcesAreFetched", {
        /**
         * Are all sources fetched and joined into the feature registry?
         * @returns {boolean}
         */
        get: function () {
            for (var key in this.sourceRegistry) {
                if (!this.isSourceFetched(key)) {
                    return false;
                }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add a new sourceName into the mix.
     * @param {IFeatureSource<any>} source
     */
    FeatureFlagHelper.prototype.addFeatureSource = function (source) {
        if (!FeatureFlagHelper.isValidFeatureSource(source)) {
            throw Error("The Source " + JSON.stringify(source) + " is not valid.");
        }
        else if (source.sourceName in this.sourceRegistry) {
            throw Error("Source " + source.sourceName + " has already been registered.");
        }
        var sourceName = source.sourceName, fetcher = source.fetcher, _a = source.transformer, transformer = _a === void 0 ? transformer_1.transformer(sourceName) : _a;
        this.sourceRegistry[sourceName] = {
            isFetched: false,
            fetchPromise: null,
            fetcher: fetcher,
            transformer: transformer,
            fetchResult: null,
        };
    };
    FeatureFlagHelper.prototype.isSourceFetched = function (sourceName) {
        if (!this.sourceRegistry.hasOwnProperty(sourceName)) {
            throw Error("Source Name " + sourceName + " does not exist in our registry. Are you sure you added it?");
        }
        return this.sourceRegistry[sourceName].isFetched;
    };
    /**
     * Triggers an asynchronous fetching of flag feature sources. If the user specifies
     * which source our sources they want to fetch in particular, this will only fetch
     * those sources.
     * Otherwise, if no param is passed, it'll fetch all sources.
     * @param {undefined | string | string[]} specificSourceNames
     * @param {boolean | undefined} force
     * @returns {Promise<void>}
     */
    FeatureFlagHelper.prototype.fetchSources = function (specificSourceNames, force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, specificSourceNames_1, key, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        if (Array.isArray(specificSourceNames)) {
                            for (_i = 0, specificSourceNames_1 = specificSourceNames; _i < specificSourceNames_1.length; _i++) {
                                key = specificSourceNames_1[_i];
                                if (this.sourceRegistry.hasOwnProperty(key)) {
                                    promises.push(this.retrieveFeaturesFromSource(key, force));
                                }
                                else {
                                    throw Error(key + " is not a valid feature flag source");
                                }
                            }
                        }
                        else if (typeof specificSourceNames === 'string') {
                            if (this.sourceRegistry.hasOwnProperty(specificSourceNames)) {
                                promises.push(this.retrieveFeaturesFromSource(specificSourceNames, force));
                            }
                            else {
                                throw Error(specificSourceNames + " is not a valid feature flag source");
                            }
                        }
                        else {
                            // Fetch all of them.
                            promises = promises.concat(Object.keys(this.sourceRegistry).map(function (key) { return _this.retrieveFeaturesFromSource(key, force); }));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        results = _a.sent();
                        this.combineFeatures(results);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * The function that returns the result of whether a feature flag is open or not.
     * There is an option to specify which feature source(s) you are looking for the feature.
     * e.g. isFeaturePublished('widget.open-platform.bill-payment', 'launch darkley')
     * e.g. isFeaturePublished('widget.open-platform.bill-payment', ['launch darkley', 'localstorage'])
     * will only look for the feature from that source; whereas,
     * isFeaturePublished('widget.open-platform.bill-payment') might look at every source,
     * if available.
     *
     * NOTE: If called without a specificSource, all sources need to be fetched, otherwise,
     * it throws an error. So call fetchSources() beforehand.
     * NOTE: Similar to the aforementioned note, if you do specify sources, those sources
     * needs to have been fetched, otherwise, it'll throw an error.
     * @param {string} featureName
     * @param {string | string[]} specificSource
     * @returns {FeatureFlagResult | false}
     */
    FeatureFlagHelper.prototype.isFeaturePublished = function (featureName, specificSource) {
        if (specificSource) {
            // guard for string or string array
            if (typeof specificSource !== 'string' && !Array.isArray(specificSource)) {
                throw Error('The Source to search needs to be a string or a string array');
            }
            if (typeof specificSource === 'string') {
                if (specificSource + "!" + featureName in this.enabledFeatures) {
                    var f = this.enabledFeatures[specificSource + "!" + featureName];
                    return new FeatureFlagResult_1.FeatureFlagResult(f.value);
                }
                return false;
            }
        }
        var sourcesToSearch = Object.keys(this.sourceRegistry);
        if (Array.isArray(specificSource)) {
            sourcesToSearch = sourcesToSearch.filter(function (s) {
                return specificSource.indexOf(s) > -1;
            });
        }
        for (var _i = 0, sourcesToSearch_1 = sourcesToSearch; _i < sourcesToSearch_1.length; _i++) {
            var source = sourcesToSearch_1[_i];
            if (!this.sourceRegistry[source].isFetched) {
                throw Error('The Sources are not yet fetched. You need to fetch them first!');
            }
        }
        var feature;
        var weHaveIt = false;
        for (var _a = 0, sourcesToSearch_2 = sourcesToSearch; _a < sourcesToSearch_2.length; _a++) {
            var source = sourcesToSearch_2[_a];
            if (source + "!" + featureName in this.enabledFeatures) {
                weHaveIt = true;
                feature = this.enabledFeatures[source + "!" + featureName];
                break;
            }
        }
        if (weHaveIt) {
            return new FeatureFlagResult_1.FeatureFlagResult(feature.value);
        }
        return false;
    };
    /**
     * This function is responsible for calling the Fetcher function of the sourceName,
     * retrieving the results asynchronously, and then, calling the transformer function
     * of the sourceName in order to Transform them into IFeature[] schema.
     * @param {string} name
     * @param {boolean} force
     * @returns {Promise<TFeatures>}
     */
    FeatureFlagHelper.prototype.retrieveFeaturesFromSource = function (name, force) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, isFetched, fetcher, existingPromise, transformer, fetchPromise, fetchResult, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.sourceRegistry[name], isFetched = _a.isFetched, fetcher = _a.fetcher, existingPromise = _a.fetchPromise, transformer = _a.transformer;
                        if (isFetched && !force) {
                            return [2 /*return*/, []];
                        }
                        if (!isFetched
                            && !util_1.isNull(existingPromise)
                            && (existingPromise instanceof Promise || existingPromise.then)) {
                            return [2 /*return*/, existingPromise];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        fetchPromise = fetcher();
                        this.sourceRegistry[name].fetchPromise = fetchPromise;
                        return [4 /*yield*/, fetchPromise];
                    case 2:
                        fetchResult = _b.sent();
                        this.sourceRegistry[name].isFetched = true;
                        this.sourceRegistry[name].fetchPromise = null;
                        this.sourceRegistry[name].fetchResult = fetchResult;
                        return [2 /*return*/, transformer(fetchResult)];
                    case 3:
                        e_1 = _b.sent();
                        this.sourceRegistry[name].isFetched = true;
                        this.sourceRegistry[name].fetchPromise = null;
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This function takes results of calls, iterates over these results and adds them
     * to the local feature flag registry.
     * @param {TFeatures[]} result
     */
    FeatureFlagHelper.prototype.combineFeatures = function (result) {
        var _a;
        // Maybe let's do conflict resolution?
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var featureArr = result_1[_i];
            for (var _b = 0, featureArr_1 = featureArr; _b < featureArr_1.length; _b++) {
                var feature = featureArr_1[_b];
                Object.assign(this.enabledFeatures, (_a = {},
                    _a[feature.source + "!" + feature.name] = feature,
                    _a));
            }
        }
    };
    Object.defineProperty(FeatureFlagHelper.prototype, "TEST_allEnabledFeatures", {
        /**
         * TEST Function: returns the internal feature flag registry.
         * throws Errors.
         * @returns {string[]}
         * @constructor
         */
        get: function () {
            if (process.env.TEST) {
                return Object.values(this.enabledFeatures)
                    .filter(function (feat) {
                    return !util_1.isNullOrUndefined(feat.value);
                })
                    .map(function (feat) { return feat.name; });
            }
            throw Error('This is only allowed in Test Environments');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeatureFlagHelper.prototype, "TEST_allResources", {
        /**
         * TEST Function: returns the internal feature sourceName registry.
         * throws Errors
         * @returns {Array<ISourceItem<any>>}
         * @constructor
         */
        get: function () {
            if (process.env.TEST) {
                return Object.values(this.sourceRegistry);
            }
            throw Error('This is only allowed in Test Environments');
        },
        enumerable: true,
        configurable: true
    });
    return FeatureFlagHelper;
}());
exports.FeatureFlagHelper = FeatureFlagHelper;
