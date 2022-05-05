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
exports.MangaUpdatesInfo = {
    name: 'MangaUpdates',
    author: 'IntermittentlyRupert',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    // TODO: generate an actual proper PNG from the SVG
    icon: 'icon.png',
    version: '0.1.0',
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
            interceptor: {
                interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                    request.cookies = yield sessionUtils.getCookies(this.stateManager);
                    return request;
                }),
                interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () {
                    // NOTE: depends on Paperback 0.7-r36 (currently still in dev)
                    // TODO: clean this up once new paperback-extensions-common is released
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const cookies = this.requestManager.cookieStore.getAllCookies();
                    yield sessionUtils.addCookies(this.stateManager, cookies);
                    return response;
                }),
            },
        });
    }
    ////////////////////
    // Public API
    ////////////////////
    /** TODO */
    getTrackedManga(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('unimplemented');
        });
    }
    /** TODO */
    getMangaForm(mangaId) {
        throw new Error('unimplemented');
    }
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
                const searchResponse = yield this.requestManager.schedule(createRequestObject({
                    url: `https://www.mangaupdates.com/series.html?search=${encodeURIComponent(search)}&page=${encodeURIComponent(page)}`,
                    method: 'GET',
                }), 1);
                if (searchResponse.status > 299) {
                    console.log(`${logPrefix} login error (${searchResponse.status}): ${searchResponse.data}`);
                    throw new Error('Search request failed!');
                }
                const results = searchUtils.parseSearchResults(this.cheerio, searchResponse.data);
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
    /** TODO */
    processActionQueue(actionQueue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve();
        });
    }
    ////////////////////
    // Session Management
    ////////////////////
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
                sessionUtils.clearCookies(this.stateManager),
            ]);
        });
    }
}
exports.MangaUpdates = MangaUpdates;

},{"./utils/mu-search":49,"./utils/mu-session":50,"paperback-extensions-common":4}],49:[function(require,module,exports){
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
        const parsedResultUrl = /series\.html\?.*id=(\d+)/.exec(urlAnchor.attr('href') || '');
        if (!parsedResultUrl) {
            console.log(`${logPrefix} failed to parse serach result (idx=${i}): ${html}`);
            throw new Error('Failed to parse search results!');
        }
        const id = parsedResultUrl[1] || '';
        const title = urlAnchor.text();
        if (!id || !title) {
            console.log(`${logPrefix} failed to extract serach result values (idx=${i}): ${html}`);
            throw new Error('Failed to parse search results!');
        }
        // if the user isn't logged in, adult results won't have an image
        const image = $(SEARCH_RESULT_TILE_IMAGE, tile).attr('src') || '';
        results.push(createMangaTile({
            id,
            title: createIconText({ text: title }),
            image,
        }));
    });
    const nextPageUrl = $(NEXT_PAGE_LINK, html).attr('href') || '';
    const parsedNextPageUrl = /series\.html\?.*page=(\d+)/.exec(nextPageUrl);
    const nextPage = parsedNextPageUrl ? Number(parsedNextPageUrl[0]) || null : null;
    return createPagedResults({ results, metadata: { nextPage } });
}
exports.parseSearchResults = parseSearchResults;

},{}],50:[function(require,module,exports){
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
exports.clearCookies = exports.addCookies = exports.getCookies = exports.clearUserCredentials = exports.setUserCredentials = exports.getUserCredentials = exports.validateCredentials = void 0;
const logPrefix = '[mu-session]';
const STATE_MU_CREDENTIALS = 'mu_credentials';
const STATE_MU_COOKIES = 'mu_cookies';
function isOptionalString(val) {
    return val == null || typeof val === 'string';
}
function isOptionalNumber(val) {
    return val == null || (typeof val === 'number' && !Number.isNaN(val));
}
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
        console.log(`${logPrefix} logout starts`);
        yield stateManager.keychain.store(STATE_MU_CREDENTIALS, undefined);
        console.log(`${logPrefix} logout complete`);
    });
}
exports.clearUserCredentials = clearUserCredentials;
function validateRawCookie(rawCookie) {
    return (rawCookie != null
        && typeof rawCookie === 'object'
        && typeof rawCookie.domain === 'string'
        && typeof rawCookie.name === 'string'
        && typeof rawCookie.value === 'string'
        && isOptionalString(rawCookie.path)
        && isOptionalNumber(rawCookie.created)
        && isOptionalNumber(rawCookie.expires));
}
function serializeCookie(cookie) {
    const rawCookie = {
        domain: cookie.domain,
        name: cookie.name,
        value: cookie.value,
    };
    if (cookie.path) {
        rawCookie.path = cookie.path;
    }
    if (cookie.created) {
        rawCookie.created = cookie.created.getTime();
    }
    if (cookie.expires) {
        rawCookie.expires = cookie.expires.getTime();
    }
    return rawCookie;
}
function deserializeCookie(rawCookie) {
    const cookieInfo = {
        domain: rawCookie.domain,
        name: rawCookie.name,
        value: rawCookie.value,
    };
    if (rawCookie.path) {
        cookieInfo.path = rawCookie.path;
    }
    if (rawCookie.created) {
        cookieInfo.created = new Date(rawCookie.created);
    }
    if (rawCookie.expires) {
        cookieInfo.expires = new Date(rawCookie.expires);
    }
    return createCookie(cookieInfo);
}
function getRawCookies(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookiesString = yield stateManager.keychain.retrieve(STATE_MU_COOKIES);
        if (typeof cookiesString !== 'string') {
            return [];
        }
        const rawCookies = JSON.parse(cookiesString);
        if (!Array.isArray(rawCookies)) {
            return [];
        }
        const validRawCookies = rawCookies.filter(rawCookie => validateRawCookie(rawCookie));
        if (validRawCookies.length < rawCookies.length) {
            console.log(`${logPrefix} store contains invalid cookies!`);
        }
        return validRawCookies;
    });
}
// TODO: take the request URL and filter for cookies on the right domain
function getCookies(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawCookies = yield getRawCookies(stateManager);
        return rawCookies.map(deserializeCookie);
    });
}
exports.getCookies = getCookies;
function addCookies(stateManager, cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cookies.length === 0) {
            // nothing to do
            return;
        }
        const oldCookies = yield getRawCookies(stateManager);
        const newCookies = cookies.map(cookie => serializeCookie(cookie));
        const mergedCookies = {};
        for (const cookie of oldCookies) {
            const key = `${cookie.domain}|${cookie.name}`;
            if (mergedCookies[key]) {
                console.log(`${logPrefix} found unexpected duplicate in oldCookies!`);
            }
            mergedCookies[key] = cookie;
        }
        for (const cookie of newCookies) {
            const key = `${cookie.domain}|${cookie.name}`;
            mergedCookies[key] = cookie;
        }
        const cookiesToStore = Object.values(mergedCookies);
        // paranoid sanity check
        if (cookiesToStore.some(rawCookie => !validateRawCookie(rawCookie))) {
            console.log(`${logPrefix} tried to store invalid mu_cookies: ${JSON.stringify(cookiesToStore)}`);
            throw new Error('tried to store invalid mu_cookies');
        }
        yield stateManager.keychain.store(STATE_MU_COOKIES, JSON.stringify(cookiesToStore));
    });
}
exports.addCookies = addCookies;
function clearCookies(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        yield stateManager.keychain.store(STATE_MU_COOKIES, undefined);
    });
}
exports.clearCookies = clearCookies;

},{}]},{},[48])(48)
});
