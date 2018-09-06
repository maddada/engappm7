"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var AppPage = /** @class */ (function () {
    function AppPage() {
    }
    AppPage.prototype.navigateTo = function (destination) {
        return protractor_1.browser.get(destination);
    };
    AppPage.prototype.getTitle = function () {
        return protractor_1.browser.getTitle();
    };
    AppPage.prototype.getPageOneTitleText = function () {
        return protractor_1.element(protractor_1.by.tagName('app-home')).element(protractor_1.by.deepCss('ion-title')).getText();
    };
    return AppPage;
}());
exports.AppPage = AppPage;
//# sourceMappingURL=app.po.js.map