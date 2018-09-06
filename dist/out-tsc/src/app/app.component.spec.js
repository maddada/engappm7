"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new(P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = {
            label: 0,
            sent: function () {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        },
        f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;

    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }

    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];
            y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", {
    value: true
});
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var angular_1 = require("@ionic/angular");
var ngx_1 = require("@ionic-native/splash-screen/ngx");
var ngx_2 = require("@ionic-native/status-bar/ngx");
var testing_2 = require("@angular/router/testing");
var app_component_1 = require("./app.component");
describe('AppComponent', function () {
    var statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;
    beforeEach(testing_1.async(function () {
        statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
        splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
        platformReadySpy = Promise.resolve();
        platformSpy = jasmine.createSpyObj('Platform', {
            ready: platformReadySpy
        });
        testing_1.TestBed.configureTestingModule({
            declarations: [app_component_1.AppComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            providers: [{
                    provide: ngx_2.StatusBar,
                    useValue: statusBarSpy
                },
                {
                    provide: ngx_1.SplashScreen,
                    useValue: splashScreenSpy
                },
                {
                    provide: angular_1.Platform,
                    useValue: platformSpy
                },
            ],
            imports: [testing_2.RouterTestingModule.withRoutes([])],
        }).compileComponents();
    }));
    it('should create the app', function () {
        return __awaiter(_this, void 0, void 0, function () {
            var fixture, app;
            return __generator(this, function (_a) {
                fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
                app = fixture.debugElement.componentInstance;
                expect(app).toBeTruthy();
                return [2 /*return*/ ];
            });
        });
    });
    it('should initialize the app', function () {
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testing_1.TestBed.createComponent(app_component_1.AppComponent);
                        expect(platformSpy.ready).toHaveBeenCalled();
                        return [4 /*yield*/ , platformReadySpy];
                    case 1:
                        _a.sent();
                        expect(statusBarSpy.styleDefault).toHaveBeenCalled();
                        expect(splashScreenSpy.hide).toHaveBeenCalled();
                        return [2 /*return*/ ];
                }
            });
        });
    });
    it('should have menu labels', function () {
        return __awaiter(_this, void 0, void 0, function () {
            var fixture, app, menuItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , testing_1.TestBed.createComponent(app_component_1.AppComponent)];
                    case 1:
                        fixture = _a.sent();
                        return [4 /*yield*/ , fixture.detectChanges()];
                    case 2:
                        _a.sent();
                        app = fixture.nativeElement;
                        menuItems = app.querySelectorAll('ion-label');
                        expect(menuItems.length).toEqual(2);
                        expect(menuItems[0].textContent).toContain('Home');
                        expect(menuItems[1].textContent).toContain('Settings');
                        return [2 /*return*/ ];
                }
            });
        });
    });
    it('should have urls', function () {
        return __awaiter(_this, void 0, void 0, function () {
            var fixture, app, menuItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , testing_1.TestBed.createComponent(app_component_1.AppComponent)];
                    case 1:
                        fixture = _a.sent();
                        return [4 /*yield*/ , fixture.detectChanges()];
                    case 2:
                        _a.sent();
                        app = fixture.nativeElement;
                        menuItems = app.querySelectorAll('ion-item');
                        expect(menuItems.length).toEqual(2);
                        expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
                        expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/list');
                        return [2 /*return*/ ];
                }
            });
        });
    });
});
//# sourceMappingURL=app.component.spec.js.map