(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
class Tracker {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Tracker = Tracker;

},{}],3:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./Tracker"), exports);

},{"./Source":1,"./Tracker":2}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);

},{"./base":3,"./models":47}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],6:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],7:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],8:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],9:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],10:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],11:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],12:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],13:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],14:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],15:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],16:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],17:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],18:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],19:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],20:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],21:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],22:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],23:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Button"), exports);
__exportStar(require("./Form"), exports);
__exportStar(require("./Header"), exports);
__exportStar(require("./InputField"), exports);
__exportStar(require("./Label"), exports);
__exportStar(require("./Link"), exports);
__exportStar(require("./MultilineLabel"), exports);
__exportStar(require("./NavigationButton"), exports);
__exportStar(require("./OAuthButton"), exports);
__exportStar(require("./Section"), exports);
__exportStar(require("./Select"), exports);
__exportStar(require("./Switch"), exports);
__exportStar(require("./WebViewButton"), exports);
__exportStar(require("./FormRow"), exports);
__exportStar(require("./Stepper"), exports);

},{"./Button":8,"./Form":9,"./FormRow":10,"./Header":11,"./InputField":12,"./Label":13,"./Link":14,"./MultilineLabel":15,"./NavigationButton":16,"./OAuthButton":17,"./Section":18,"./Select":19,"./Stepper":20,"./Switch":21,"./WebViewButton":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
    MangaStatus[MangaStatus["UNKNOWN"] = 2] = "UNKNOWN";
    MangaStatus[MangaStatus["ABANDONED"] = 3] = "ABANDONED";
    MangaStatus[MangaStatus["HIATUS"] = 4] = "HIATUS";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],27:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],28:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],29:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],30:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],31:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],32:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],33:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],34:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],35:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],36:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],37:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOperator = void 0;
var SearchOperator;
(function (SearchOperator) {
    SearchOperator["AND"] = "AND";
    SearchOperator["OR"] = "OR";
})(SearchOperator = exports.SearchOperator || (exports.SearchOperator = {}));

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = void 0;
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],40:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],41:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],43:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],44:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],45:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],46:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],47:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./DynamicUI"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./SourceStateManager"), exports);
__exportStar(require("./RequestInterceptor"), exports);
__exportStar(require("./TrackedManga"), exports);
__exportStar(require("./SourceManga"), exports);
__exportStar(require("./TrackedMangaChapterReadAction"), exports);
__exportStar(require("./TrackerActionQueue"), exports);
__exportStar(require("./SearchField"), exports);
__exportStar(require("./RawData"), exports);
__exportStar(require("./SearchFilter"), exports);

},{"./Chapter":5,"./ChapterDetails":6,"./Constants":7,"./DynamicUI":23,"./HomeSection":24,"./Languages":25,"./Manga":26,"./MangaTile":27,"./MangaUpdate":28,"./PagedResults":29,"./RawData":30,"./RequestHeaders":31,"./RequestInterceptor":32,"./RequestManager":33,"./RequestObject":34,"./ResponseObject":35,"./SearchField":36,"./SearchFilter":37,"./SearchRequest":38,"./SourceInfo":39,"./SourceManga":40,"./SourceStateManager":41,"./SourceTag":42,"./TagSection":43,"./TrackedManga":44,"./TrackedMangaChapterReadAction":45,"./TrackerActionQueue":46}],48:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaUpdates = exports.MangaUpdatesInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const sessionUtils = __importStar(require("./utils/mu-session"));
const searchUtils = __importStar(require("./utils/mu-search"));
const mangaUtils = __importStar(require("./utils/mu-manga"));
const listUtils = __importStar(require("./utils/mu-lists"));
const FALLBACK_PROFILE_IMAGE = 'https://cdn.mangaupdates.com/avatar/a0.gif';
exports.MangaUpdatesInfo = {
    name: 'MangaUpdates',
    author: 'IntermittentlyRupert',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '2.0.0',
    description: 'MangaUpdates Tracker',
    websiteBaseURL: 'https://www.mangaupdates.com',
};
class MangaUpdates extends paperback_extensions_common_1.Tracker {
    constructor() {
        super(...arguments);
        this.stateManager = createSourceStateManager({});
        this.requestManager = createRequestManager({
            requestsPerSecond: 2.5,
            requestTimeout: 20000,
        });
    }
    ////////////////////
    // Public API
    ////////////////////
    getTrackedManga(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[getTrackedManga]';
            console.log(`${logPrefix} starts`);
            try {
                console.log(`${logPrefix} loading id=${mangaId}`);
                const mangaInfo = yield this.getMangaInfo(mangaId);
                const trackedManga = createTrackedManga({
                    id: mangaId,
                    mangaInfo: createMangaInfo(mangaInfo)
                });
                console.log(`${logPrefix} complete`);
                return trackedManga;
            }
            catch (e) {
                console.log(`${logPrefix} error`);
                console.log(e);
                throw e;
            }
        });
    }
    getMangaForm(mangaId) {
        return createForm({
            sections: () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const username = (_a = (yield sessionUtils.getUserCredentials(this.stateManager))) === null || _a === void 0 ? void 0 : _a.username;
                    if (!username) {
                        return [
                            createSection({
                                id: 'notLoggedInSection',
                                rows: () => Promise.resolve([
                                    createLabel({
                                        id: 'notLoggedIn',
                                        label: 'Not Logged In',
                                        value: undefined
                                    })
                                ])
                            })
                        ];
                    }
                    const canonicalId = yield this.getCanonicalId(mangaId);
                    const userProfilePromise = this.request('/v1/account/profile', 'GET', {});
                    const mangaInfoPromise = this.getMangaInfo(canonicalId);
                    const [userProfile, mangaInfo] = yield Promise.all([
                        userProfilePromise,
                        mangaInfoPromise,
                        // TODO: get progress info
                        // TODO: get list info
                    ]);
                    const oldIdWarning = [];
                    if (mangaId !== canonicalId) {
                        oldIdWarning.push(createLabel({
                            id: 'legacyMangaId',
                            label: 'Legacy Manga ID',
                            value: mangaId,
                        }), createLabel({
                            id: 'oldIdWarning',
                            label: 'WARNING',
                            value: 'This manga is tracked using a legacy MangaUpdates ID. Un-track and re-track this manga to improve tracking performance and reliability!',
                        }));
                    }
                    return [
                        createSection({
                            id: 'userInfo',
                            rows: () => {
                                var _a;
                                return Promise.resolve([
                                    createHeader({
                                        id: 'header',
                                        imageUrl: ((_a = userProfile.avatar) === null || _a === void 0 ? void 0 : _a.url) || FALLBACK_PROFILE_IMAGE,
                                        title: username,
                                        subtitle: '',
                                        value: undefined
                                    })
                                ]);
                            }
                        }),
                        createSection({
                            id: 'information',
                            header: 'Information',
                            rows: () => {
                                var _a, _b, _c, _d;
                                return Promise.resolve([
                                    createLabel({
                                        id: 'mangaId',
                                        label: 'Manga ID',
                                        value: canonicalId,
                                    }),
                                    ...oldIdWarning,
                                    createLabel({
                                        id: 'mangaTitle',
                                        label: 'Title',
                                        value: mangaInfo.titles[0],
                                    }),
                                    createLabel({
                                        id: 'mangaRating',
                                        value: (_b = (_a = mangaInfo.rating) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'N/A',
                                        label: 'Rating'
                                    }),
                                    createLabel({
                                        id: 'mangaStatus',
                                        value: mangaInfo.status.toString(),
                                        label: 'Status'
                                    }),
                                    createLabel({
                                        id: 'mangaIsAdult',
                                        value: (_d = (_c = mangaInfo.hentai) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : 'N/A',
                                        label: 'Is Adult'
                                    })
                                ]);
                            }
                        }),
                        createSection({
                            id: 'trackList',
                            header: 'Manga List',
                            footer: 'Warning: Setting this to "None" will delete the listing from MangaUpdates',
                            rows: () => Promise.resolve([
                                createSelect({
                                    id: 'listId',
                                    value: [listId],
                                    allowsMultiselect: false,
                                    label: 'List',
                                    displayLabel: (value) => listNamesById[value] || '<unknown list>',
                                    options: lists.map(list => list.listId)
                                })
                            ])
                        }),
                        createSection({
                            id: 'manage',
                            header: 'Progress',
                            rows: () => Promise.resolve([
                                createStepper({
                                    id: 'chapterProgress',
                                    label: 'Chapter',
                                    value: status.chapterProgress,
                                    min: 0,
                                    step: 1
                                }),
                                createStepper({
                                    id: 'volumeProgress',
                                    label: 'Volume',
                                    value: status.volumeProgress,
                                    min: 0,
                                    step: 1
                                })
                            ])
                        }),
                        // TODO: user rating
                    ];
                }
                catch (e) {
                    console.log('[getMangaForm] failed to render manga form');
                    console.log(e);
                    return [
                        createSection({
                            id: 'errorInfo',
                            rows: () => Promise.resolve([
                                createLabel({
                                    id: 'errorMessage',
                                    label: String(e),
                                    value: undefined
                                })
                            ])
                        }),
                    ];
                }
            }),
            onSubmit: (values) => this.handleMangaFormChanges(values),
            validate: () => Promise.resolve(true)
        });
    }
    // TODO: reimplement getSourceMenu
    getSourceMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return createSection({
                id: 'sourceMenu',
                header: 'Source Menu',
                rows: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const username = (_a = (yield sessionUtils.getUserCredentials(this.stateManager))) === null || _a === void 0 ? void 0 : _a.username;
                    if (username) {
                        return [
                            createLabel({
                                id: 'userInfo',
                                label: 'Logged-in as',
                                value: username,
                            }),
                            createButton({
                                id: 'refresh',
                                label: 'Refresh session',
                                value: undefined,
                                onTap: () => this.refreshSession(),
                            }),
                            createButton({
                                id: 'logout',
                                label: 'Logout',
                                value: undefined,
                                onTap: () => this.logout(),
                            }),
                        ];
                    }
                    return [
                        createNavigationButton({
                            id: 'loginButton',
                            label: 'Login',
                            value: undefined,
                            form: createForm({
                                sections: () => Promise.resolve([
                                    createSection({
                                        id: 'username_section',
                                        header: 'Username',
                                        footer: 'Enter your MangaUpdates account username',
                                        rows: () => Promise.resolve([
                                            createInputField({
                                                id: 'username',
                                                placeholder: 'Username',
                                                value: '',
                                                maskInput: false,
                                            }),
                                        ]),
                                    }),
                                    createSection({
                                        id: 'password_section',
                                        header: 'Password',
                                        footer: 'Enter the password associated with your MangaUpdates account Username',
                                        rows: () => Promise.resolve([
                                            createInputField({
                                                id: 'password',
                                                placeholder: 'Password',
                                                value: '',
                                                maskInput: true,
                                            }),
                                        ]),
                                    }),
                                ]),
                                onSubmit: (values) => this.login(values),
                                validate: () => Promise.resolve(true),
                            }),
                        }),
                    ];
                }),
            });
        });
    }
    // TODO: reimplement getSearchResults
    getSearchResults(query, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[getSearchResults]';
            console.log(`${logPrefix} starts`);
            try {
                const search = query.title || '';
                const page = (metadata === null || metadata === void 0 ? void 0 : metadata.nextPage) || 1;
                // MangaUpdates will return an error for empty search strings
                if (!search) {
                    console.log(`${logPrefix} ignoring empty search`);
                    return createPagedResults({ results: [], metadata: { nextPage: null } });
                }
                console.log(`${logPrefix} searching for "${search}" (page=${page})`);
                const response = yield this.requestManager.schedule(createRequestObject({
                    url: `https://www.mangaupdates.com/series.html?search=${encodeURIComponent(search)}&page=${encodeURIComponent(page)}`,
                    method: 'GET',
                }), 1);
                if (response.status > 299) {
                    console.log(`${logPrefix} failed (${response.status}): ${response.data}`);
                    throw new Error('Search request failed!');
                }
                const results = searchUtils.parseSearchResults(this.cheerio, response.data);
                console.log(`${logPrefix} complete`);
                return results;
            }
            catch (e) {
                console.log(`${logPrefix} error`);
                console.log(e);
                throw e;
            }
        });
    }
    // TODO: reimplement processActionQueue
    processActionQueue(actionQueue) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[processActionQueue]';
            console.log(`${logPrefix} starts`);
            const chapterReadActions = yield actionQueue.queuedChapterReadActions();
            console.log(`${logPrefix} found ${chapterReadActions.length} action(s)`);
            for (const action of chapterReadActions) {
                const mangaId = action.mangaId;
                const volumeProgress = Math.floor(action.volumeNumber) || 1;
                const chapterProgress = Math.floor(action.chapterNumber);
                console.log(`${logPrefix} processing action: ${JSON.stringify({ mangaId, volumeProgress, chapterProgress })}`);
                try {
                    const html = yield this.loadMangaPage(action.mangaId);
                    // We might be tracking the manga using an old (pre-May'22) ID.
                    // Make sure we're using a new ID.
                    const mangaCanonicalId = mangaUtils.getIdFromPage(this.cheerio, html);
                    // If we're tracking the manga but it isn't on any list, then the
                    // progress update will do nothing. Make sure it's on a list.
                    const list = listUtils.getListInfo(this.cheerio, html, action.mangaId);
                    if (list.listName === listUtils.STANDARD_LIST_NAMES.NONE) {
                        console.log(`${logPrefix} manga is not in a list - adding to Reading List`);
                        yield this.setMangaList({
                            mangaId: mangaCanonicalId,
                            listId: listUtils.STANDARD_LIST_IDS.READING,
                        });
                    }
                    yield this.setMangaProgress({ mangaId: mangaCanonicalId, volumeProgress, chapterProgress });
                    yield actionQueue.discardChapterReadAction(action);
                }
                catch (e) {
                    console.log(`${logPrefix} progress update failed`);
                    console.log(e);
                    yield actionQueue.retryChapterReadAction(action);
                }
            }
            console.log(`${logPrefix} complete`);
        });
    }
    ////////////////////
    // Session Management
    ////////////////////
    // TODO: reimplement login
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[login]';
            console.log(`${logPrefix} starts`);
            if (!sessionUtils.validateCredentials(credentials)) {
                console.error(`${logPrefix} tried to store invalid mu_credentials: ${JSON.stringify(credentials)}`);
                throw new Error('Must provide a username and password!');
            }
            try {
                const username = encodeURIComponent(credentials.username);
                const password = encodeURIComponent(credentials.password);
                const loginResponse = yield this.requestManager.schedule(createRequestObject({
                    url: 'https://www.mangaupdates.com/login.html',
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: `act=login&username=${username}&password=${password}`,
                }), 0);
                if (loginResponse.status > 299) {
                    console.log(`${logPrefix} login error (${loginResponse.status}): ${loginResponse.data}`);
                    throw new Error('Incorrect username/password!');
                }
                // Sanity check to make sure the cookies actually work
                const userProfileResponse = yield this.requestManager.schedule(createRequestObject({
                    url: 'https://www.mangaupdates.com/submit.html',
                    method: 'GET',
                }), 0);
                if (userProfileResponse.status > 299 || !userProfileResponse.data.includes(`Welcome back, ${credentials.username}`)) {
                    console.log(`${logPrefix} profile check failed (${userProfileResponse.status}): ${userProfileResponse.data}`);
                    throw new Error('Incorrect username/password!');
                }
                yield sessionUtils.setUserCredentials(this.stateManager, credentials);
            }
            catch (e) {
                console.log(`${logPrefix} failed to log in`);
                console.log(e);
                throw new Error('Login failed!');
            }
            console.log(`${logPrefix} complete`);
        });
    }
    refreshSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[refreshSession]';
            console.log(`${logPrefix} starts`);
            const credentials = yield sessionUtils.getUserCredentials(this.stateManager);
            if (!credentials) {
                console.log(`${logPrefix} no credentials available, unable to refresh`);
                throw new Error('Could not find login credentials!');
            }
            yield this.logout();
            yield this.login(credentials);
            console.log(`${logPrefix} complete`);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                sessionUtils.clearUserCredentials(this.stateManager),
                sessionUtils.clearSessionToken(this.stateManager),
            ]);
        });
    }
    ////////////////////
    // List Management
    ////////////////////
    // TODO: reimplement handleMangaFormChanges
    handleMangaFormChanges(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[handleMangaFormChanges]';
            console.log(`${logPrefix} starts: ${JSON.stringify(values)}`);
            // These requests are all idempotent, so it's fairly safe for us to make
            // them unconditionally. If somebody makes a change via the website
            // between when they load the form and when they submit it, then I'll
            // clobber that change, but also don't do silly things like that.
            try {
                const actions = [
                    this.setMangaList({
                        mangaId: values.mangaId,
                        listId: values.listId[0]
                    }),
                ];
                if (values.listId[0] !== listUtils.STANDARD_LIST_IDS.NONE) {
                    actions.push(this.setMangaProgress({
                        mangaId: values.mangaId,
                        volumeProgress: values.volumeProgress,
                        chapterProgress: values.chapterProgress,
                    }));
                }
                yield Promise.all(actions);
            }
            catch (e) {
                console.log(`${logPrefix} failed`);
                console.log(e);
                throw e;
            }
            console.log(`${logPrefix} complete`);
        });
    }
    ////////////////////
    // Request Handlers
    ////////////////////
    getCanonicalId(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[getCanonicalId]';
            // The shortest new ID I could find was 8 decimal digits
            if (mangaId.length > 6) {
                return mangaId;
            }
            console.log(`${logPrefix} legacy ID detected: ${mangaId}`);
            const response = yield this.requestManager.schedule(createRequestObject({
                url: `https://api.mangaupdates.com/series.html?id=${mangaId}`,
                method: 'GET',
            }), 1);
            if (response.status > 299) {
                console.log(`[${logPrefix}] failed to load page (${response.status}): ${response.data}`);
                throw new Error('failed to load canonical ID for ${mangaId}');
            }
            const canonicalId = mangaUtils.getIdFromPage(this.cheerio, response.data);
            console.log(`${logPrefix} mapped to canonical ID: ${mangaId} --> ${canonicalId}`);
            return canonicalId;
        });
    }
    getMangaInfo(canonicalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[getMangaInfo]';
            console.log(`${logPrefix} start: ${canonicalId}`);
            const series = yield this.request('/v1/series/{id}', 'GET', {
                params: { id: canonicalId },
                query: {},
            });
            const mangaInfo = mangaUtils.parseMangaInfo(series);
            console.log(`${logPrefix} complete: ${JSON.stringify(mangaInfo)}`);
            return mangaInfo;
        });
    }
    request(endpoint, verb, request, failOnErrorStatus = true, retryCount = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const logPrefix = '[request]';
            console.log(`${logPrefix} starts: ${verb} ${endpoint} ${JSON.stringify(request)} (retryCount=${retryCount})`);
            const baseRequest = request;
            const path = Object.entries(baseRequest.params || {})
                .filter((entry) => entry[1] != undefined)
                .map(([name, value]) => [`{${name}}`, String(value)])
                .reduce((partialPath, [token, value]) => {
                if (!partialPath.includes(token)) {
                    console.log(`${logPrefix} endpoint '${endpoint}' does not contain ${token}!`);
                    throw new Error('endpoint is missing path parameter');
                }
                return endpoint.replace(token, String(value));
            }, endpoint);
            const query = Object.entries(baseRequest.query || {})
                .filter((entry) => entry[1] != undefined)
                .map(([name, value]) => `${name}=${encodeURIComponent(String(value))}`)
                .join('&');
            const nonEmptyHeaders = Object.entries(baseRequest.headers || {})
                .filter((entry) => entry[1] != undefined)
                .reduce((acc, [name, value]) => (Object.assign(Object.assign({}, acc), { [name]: value })), {});
            const authHeaders = {};
            if (endpoint !== '/v1/account/login') {
                const sessionToken = yield sessionUtils.getSessionToken(this.stateManager);
                if (!sessionToken) {
                    throw new Error('You must be logged in!');
                }
                authHeaders.authorization = `Bearer ${sessionToken}`;
            }
            const response = yield this.requestManager.schedule(createRequestObject({
                url: `https://api.mangaupdates.com${path}`,
                method: verb,
                param: query,
                data: baseRequest.body,
                headers: Object.assign(Object.assign({}, nonEmptyHeaders), authHeaders)
            }), retryCount);
            if (failOnErrorStatus && response.status > 299) {
                console.log(`${logPrefix} failed (${response.status}): ${response.data}`);
                throw new Error('Request failed!');
            }
            return JSON.parse(response.data);
        });
    }
}
exports.MangaUpdates = MangaUpdates;

},{"./utils/mu-lists":49,"./utils/mu-manga":50,"./utils/mu-search":51,"./utils/mu-session":52,"paperback-extensions-common":4}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomLists = exports.getListInfo = exports.STANDARD_LIST_IDS = exports.STANDARD_LIST_NAMES = exports.STANDARD_LISTS = void 0;
const logPrefix = 'mu-lists';
const MANGA_LIST_NAME = '#showList > .my-auto u';
const MANGA_PROGRESS_VOLUMES = '#chap-links a[title="Increment Volume"]';
const MANGA_PROGRESS_CHAPTERS = '#chap-links a[title="Increment Chapter"]';
const CUSTOM_LIST_NAMES = '#main_content form:last-child .lrow.col-3 input[type="text"]';
exports.STANDARD_LISTS = [
    'NONE',
    'READING',
    'WISH',
    'COMPLETE',
    'UNFINISHED',
    'ON_HOLD',
];
exports.STANDARD_LIST_NAMES = {
    NONE: 'None',
    READING: 'Reading List',
    WISH: 'Wish List',
    COMPLETE: 'Complete List',
    UNFINISHED: 'Unfinished List',
    ON_HOLD: 'On Hold List',
};
exports.STANDARD_LIST_IDS = {
    NONE: '-1',
    READING: '0',
    WISH: '1',
    COMPLETE: '2',
    UNFINISHED: '3',
    ON_HOLD: '4',
};
function getListInfo($, html, mangaId) {
    const info = {
        listName: $(MANGA_LIST_NAME, html).text().trim() || exports.STANDARD_LIST_NAMES.NONE,
        volumeProgress: parseInt($(MANGA_PROGRESS_VOLUMES, html).text().trim().slice(2)) || 0,
        chapterProgress: parseInt($(MANGA_PROGRESS_CHAPTERS, html).text().trim().slice(2)) || 0,
    };
    console.log(`${logPrefix} parsed list info (id=${mangaId}): ${JSON.stringify(info)}`);
    return info;
}
exports.getListInfo = getListInfo;
function getCustomLists($, html) {
    const customLists = [];
    $(CUSTOM_LIST_NAMES, html).map((i, item) => {
        const listIdString = $(item).attr('name') || '';
        const listIdMatches = /lists\[(\d+)\]\[title\]/.exec(listIdString);
        const listId = listIdMatches ? listIdMatches[1] : null;
        const listName = $(item).attr('value');
        if (!listId || !listName) {
            console.log(`${logPrefix} failed to parse custom lists (idx=${i}): ${html}`);
            throw new Error('Failed to parse custom lists!');
        }
        customLists.push({ listId, listName });
    });
    return customLists;
}
exports.getCustomLists = getCustomLists;

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdFromPage = exports.parseMangaInfo = void 0;
const MANGA_CANONICAL_URL = 'link[rel="canonical"]';
const IS_HENTAI_GENRE = {
    Adult: true,
    Hentai: true,
    Smut: true,
};
function parseStatus(status) {
    var _a;
    // NOTE: There can be a decent amount of variation in the format here.
    //
    // Series with multiple seasons (e.g. manhwa) may have something like:
    //
    //   > 38 Chapters (Ongoing)
    //   >
    //   > S1: 38 Chapters (Complete) 1~38
    //   > S2: (TBA)
    //
    // It might also be in reverse order (with the most recent season first)
    //
    // Cancelled series can have something like:
    //
    //   > 4 Volumes (Incomplete due to the artist's death)
    //
    // Make sure to handle everything we reasonably can.
    const statusMatches = ((_a = /\(([a-zA-Z]+)\)/g.exec(status)) === null || _a === void 0 ? void 0 : _a.slice(1).map(match => match.toLowerCase())) || [];
    if (statusMatches.some(match => match.includes('ongoing'))) {
        return 'ONGOING';
    }
    if (statusMatches.some(match => match.includes('hiatus'))) {
        return 'HIATUS';
    }
    if (statusMatches.some(match => match.includes('incomplete') || match.includes('discontinued'))) {
        return 'ABANDONED';
    }
    if (statusMatches.some(match => match.includes('complete'))) {
        return 'COMPLETED';
    }
    return 'UNKNOWN';
}
function isHentai(manga) {
    var _a;
    return ((_a = manga.genres) === null || _a === void 0 ? void 0 : _a.some(genre => IS_HENTAI_GENRE[(genre === null || genre === void 0 ? void 0 : genre.genre) || ''])) || false;
}
function parseMangaInfo(series) {
    var _a, _b, _c, _d;
    return {
        titles: [
            series.title,
            ...(series.associated || []).map(associated => associated === null || associated === void 0 ? void 0 : associated.title)
        ].filter((title) => !!title),
        desc: series.description,
        image: ((_b = (_a = series.image) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.original) || '',
        author: (_c = series.authors) === null || _c === void 0 ? void 0 : _c.filter(author => (author === null || author === void 0 ? void 0 : author.type) === 'Author' && author.name).map(author => author.name).join(', '),
        artist: (_d = series.authors) === null || _d === void 0 ? void 0 : _d.filter(author => (author === null || author === void 0 ? void 0 : author.type) === 'Artist' && author.name).map(author => author.name).join(', '),
        // The type for `status` is lies - it actually expects the string name of the enum value
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: parseStatus(series.status || ''),
        rating: series === null || series === void 0 ? void 0 : series.bayesian_rating,
        hentai: isHentai(series),
    };
}
exports.parseMangaInfo = parseMangaInfo;
function getIdFromPage($, html) {
    const canonicalUrl = $(MANGA_CANONICAL_URL, html).attr('href');
    if (!canonicalUrl) {
        throw new Error('unable to find canonical URL');
    }
    const parsedUrl = /series\/([A-Za-z0-9]+)\//.exec(canonicalUrl);
    if (!parsedUrl) {
        throw new Error('unable to parse canonical URL');
    }
    const base36Id = parsedUrl[1] || '';
    const id = parseInt(base36Id, 36);
    if (!base36Id || isNaN(id)) {
        throw new Error('invalid canonical ID');
    }
    return String(id);
}
exports.getIdFromPage = getIdFromPage;

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchResults = void 0;
const logPrefix = '[mu-search]';
const SEARCH_RESULT_TILES = '#main_content > .p-2 > .row:first-of-type > .col-lg-6';
const SEARCH_RESULT_TILE_URL = '.col.text a[alt="Series Info"]';
const SEARCH_RESULT_TILE_IMAGE = 'img';
const NEXT_PAGE_LINK = '#main_content > .p-2 > .row:last-of-type > .p-1:first-of-type .justify-content-end a';
function parseSearchResults($, html) {
    const results = [];
    $(SEARCH_RESULT_TILES, html).map((i, tile) => {
        const urlAnchor = $(SEARCH_RESULT_TILE_URL, tile);
        const parsedResultUrl = /series\/([A-Za-z0-9]+)\//.exec(urlAnchor.attr('href') || '');
        if (!parsedResultUrl) {
            console.log(`${logPrefix} failed to parse serach result (idx=${i}): ${html}`);
            throw new Error('Failed to parse search results!');
        }
        const base36Id = parsedResultUrl[1] || '';
        const id = parseInt(base36Id, 36);
        const title = urlAnchor.text();
        if (!base36Id || isNaN(id) || !title) {
            console.log(`${logPrefix} failed to extract serach result values (idx=${i}): ${html}`);
            throw new Error('Failed to parse search results!');
        }
        // if the user isn't logged in, adult results won't have an image
        const image = $(SEARCH_RESULT_TILE_IMAGE, tile).attr('src') || '';
        console.log(`${logPrefix} result ${i}: [${base36Id}->${id}] ${title} (${image})`);
        results.push(createMangaTile({
            id: String(id),
            title: createIconText({ text: title }),
            image,
        }));
    });
    const nextPageUrl = $(NEXT_PAGE_LINK, html).attr('href') || '';
    const parsedNextPageUrl = /series\.html\?.*page=(\d+)/.exec(nextPageUrl);
    const nextPage = parsedNextPageUrl ? Number(parsedNextPageUrl[0]) || null : null;
    console.log(`${logPrefix} results parsed (nextPage=${nextPage || '<null>'})`);
    return createPagedResults({ results, metadata: { nextPage } });
}
exports.parseSearchResults = parseSearchResults;

},{}],52:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSessionToken = exports.setSessionToken = exports.getSessionToken = exports.clearUserCredentials = exports.setUserCredentials = exports.getUserCredentials = exports.validateCredentials = void 0;
const logPrefix = '[mu-session]';
const STATE_MU_CREDENTIALS = 'mu_credentials';
const STATE_MU_SESSION = 'mu_sessiontoken';
function validateCredentials(credentials) {
    return (credentials != null
        && typeof credentials === 'object'
        && typeof credentials.username === 'string'
        && typeof credentials.password === 'string');
}
exports.validateCredentials = validateCredentials;
function getUserCredentials(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentialsString = yield stateManager.keychain.retrieve(STATE_MU_CREDENTIALS);
        if (typeof credentialsString !== 'string') {
            return undefined;
        }
        const credentials = JSON.parse(credentialsString);
        if (!validateCredentials(credentials)) {
            console.log(`${logPrefix} store contains invalid credentials!`);
            return undefined;
        }
        return credentials;
    });
}
exports.getUserCredentials = getUserCredentials;
function setUserCredentials(stateManager, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateCredentials(credentials)) {
            console.log(`${logPrefix} tried to store invalid mu_credentials: ${JSON.stringify(credentials)}`);
            throw new Error('tried to store invalid mu_credentials');
        }
        yield stateManager.keychain.store(STATE_MU_CREDENTIALS, JSON.stringify(credentials));
    });
}
exports.setUserCredentials = setUserCredentials;
function clearUserCredentials(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        yield stateManager.keychain.store(STATE_MU_CREDENTIALS, undefined);
    });
}
exports.clearUserCredentials = clearUserCredentials;
function getSessionToken(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionToken = yield stateManager.keychain.retrieve(STATE_MU_SESSION);
        return typeof sessionToken === 'string' ? sessionToken : undefined;
    });
}
exports.getSessionToken = getSessionToken;
function setSessionToken(stateManager, sessionToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof sessionToken !== 'string') {
            console.log(`${logPrefix} tried to store invalid mu_sessiontoken: ${sessionToken}`);
            throw new Error('tried to store invalid mu_sessiontoken');
        }
        yield stateManager.keychain.store(STATE_MU_SESSION, sessionToken);
    });
}
exports.setSessionToken = setSessionToken;
function clearSessionToken(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        yield stateManager.keychain.store(STATE_MU_SESSION, undefined);
    });
}
exports.clearSessionToken = clearSessionToken;

},{}]},{},[48])(48)
});
