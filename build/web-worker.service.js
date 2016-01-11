System.register(['angular2/core', './web-worker'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, web_worker_1;
    var WebWorkerService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (web_worker_1_1) {
                web_worker_1 = web_worker_1_1;
            }],
        execute: function() {
            WebWorkerService = (function (_super) {
                __extends(WebWorkerService, _super);
                function WebWorkerService() {
                    _super.apply(this, arguments);
                }
                WebWorkerService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], WebWorkerService);
                return WebWorkerService;
            })(web_worker_1.WebWorkerService);
            exports_1("WebWorkerService", WebWorkerService);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLXdvcmtlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vd2ViLXdvcmtlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbIldlYldvcmtlclNlcnZpY2UiLCJXZWJXb3JrZXJTZXJ2aWNlLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQUdBO2dCQUNzQ0Esb0NBQVNBO2dCQUQvQ0E7b0JBQ3NDQyw4QkFBU0E7Z0JBQy9DQSxDQUFDQTtnQkFGREQ7b0JBQUNBLGlCQUFVQSxFQUFFQTs7cUNBRVpBO2dCQUFEQSx1QkFBQ0E7WUFBREEsQ0FBQ0EsQUFGRCxFQUNzQyw2QkFBUyxFQUM5QztZQUZELCtDQUVDLENBQUEifQ==