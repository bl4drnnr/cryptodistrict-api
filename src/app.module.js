"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var auth_module_1 = require("@auth/auth.module");
var user_module_1 = require("@user/user.module");
var prisma_module_1 = require("@prisma/prisma.module");
var shared_module_1 = require("@shared/shared.module");
var config_1 = require("@nestjs/config");
var basic_auth_middleware_1 = require("@middlewares/basic-auth.middleware");
var email_module_1 = require("./email/email.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) {
        consumer.apply(basic_auth_middleware_1.BasicAuthMiddleware).forRoutes({
            path: '*',
            method: common_1.RequestMethod.ALL
        });
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                auth_module_1.AuthModule,
                user_module_1.UserModule,
                prisma_module_1.PrismaModule,
                shared_module_1.SharedModule,
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ".env.".concat(process.env.NODE_ENV)
                }),
                email_module_1.EmailModule
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
