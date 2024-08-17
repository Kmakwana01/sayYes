(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  ['layout-auth-auth-module'],
  {
    /***/ K7e5:
      /*!********************************************!*\
  !*** ./src/app/layout/auth/auth.module.ts ***!
  \********************************************/
      /*! exports provided: AuthModule */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'AuthModule',
          function () {
            return AuthModule;
          }
        );
        /* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! @angular/core */ '8Y7J');
        /* harmony import */ var _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./auth-routing.module */ 'rXac');
        /* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./login/login.component */ 'Q8t4');
        /* harmony import */ var src_app_shared_module_shared_module__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! src/app/shared/module/shared.module */ 'YEJG'
          );

        class AuthModule {}
        AuthModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__[
          'ɵɵdefineNgModule'
        ]({ type: AuthModule });
        AuthModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__[
          'ɵɵdefineInjector'
        ]({
          factory: function AuthModule_Factory(t) {
            return new (t || AuthModule)();
          },
          imports: [
            [
              src_app_shared_module_shared_module__WEBPACK_IMPORTED_MODULE_3__[
                'SharedModule'
              ],
              _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__[
                'AuthRoutingModule'
              ],
            ],
          ],
        });
        (function () {
          (typeof ngJitMode === 'undefined' || ngJitMode) &&
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵsetNgModuleScope'](
              AuthModule,
              {
                declarations: [
                  _login_login_component__WEBPACK_IMPORTED_MODULE_2__[
                    'LoginComponent'
                  ],
                ],
                imports: [
                  src_app_shared_module_shared_module__WEBPACK_IMPORTED_MODULE_3__[
                    'SharedModule'
                  ],
                  _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__[
                    'AuthRoutingModule'
                  ],
                ],
              }
            );
        })();
        /*@__PURE__*/ (function () {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵsetClassMetadata'](
            AuthModule,
            [
              {
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__['NgModule'],
                args: [
                  {
                    declarations: [
                      _login_login_component__WEBPACK_IMPORTED_MODULE_2__[
                        'LoginComponent'
                      ],
                    ],
                    imports: [
                      src_app_shared_module_shared_module__WEBPACK_IMPORTED_MODULE_3__[
                        'SharedModule'
                      ],
                      _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__[
                        'AuthRoutingModule'
                      ],
                    ],
                  },
                ],
              },
            ],
            null,
            null
          );
        })();

        /***/
      },

    /***/ Q8t4:
      /*!******************************************************!*\
  !*** ./src/app/layout/auth/login/login.component.ts ***!
  \******************************************************/
      /*! exports provided: LoginComponent */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'LoginComponent',
          function () {
            return LoginComponent;
          }
        );
        /* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! @angular/core */ '8Y7J');
        /* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! @angular/forms */ 's7LF');
        /* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ngx-toastr */ 'EApP');
        /* harmony import */ var src_app_shared_services_auth_service__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! src/app/shared/services/auth.service */ 'IYfF'
          );
        /* harmony import */ var src_app_shared_services_api_service__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! src/app/shared/services/api.service */ 'nm5K'
          );
        /* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(/*! @angular/router */ 'iInd');
        /* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(/*! @angular/common */ 'SVse');

        function LoginComponent_small_13_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
              0,
              'small',
              23
            );
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
              1,
              'Phone Number required'
            );
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
          }
        }
        function LoginComponent_small_19_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
              0,
              'small',
              23
            );
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
              1,
              'Password required'
            );
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
          }
        }
        class LoginComponent {
          constructor(_toastr, _authService, _apiService, fb, _router) {
            this._toastr = _toastr;
            this._authService = _authService;
            this._apiService = _apiService;
            this.fb = fb;
            this._router = _router;
            this.submitted = false;
          }
          ngOnInit() {
            this.createForm();
          }
          createForm() {
            this.loginForm = this.fb.group({
              username: [
                '',
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__['Validators']
                  .required,
              ],
              password: [
                '',
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__['Validators']
                  .required,
              ],
            });
          }
          login() {
            this.submitted = true;
            if (!this.loginForm.valid) return;
            this._apiService
              .Post('auth', 'login', this.loginForm.value)
              .subscribe(
                (res) => {
                  if (res.success) {
                    if (res.data.isAdmin === 0) {
                      this._toastr.error('No record exists');
                      this.loginForm.reset();
                      this.submitted = false;
                    } else {
                      this._authService.saveUser(res.data);
                      this._toastr.success('Welcome Admin!');
                      this._router.navigateByUrl('/dashboard');
                    }
                  } else {
                    this._toastr.error(res.message);
                  }
                },
                (err) => {
			console.log(err);
                  this._toastr.error('Connection Problem');
                }
              );
          }
        }
        LoginComponent.ɵfac = function LoginComponent_Factory(t) {
          return new (t || LoginComponent)(
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵdirectiveInject'](
              ngx_toastr__WEBPACK_IMPORTED_MODULE_2__['ToastrService']
            ),
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵdirectiveInject'](
              src_app_shared_services_auth_service__WEBPACK_IMPORTED_MODULE_3__[
                'AuthService'
              ]
            ),
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵdirectiveInject'](
              src_app_shared_services_api_service__WEBPACK_IMPORTED_MODULE_4__[
                'ApiService'
              ]
            ),
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵdirectiveInject'](
              _angular_forms__WEBPACK_IMPORTED_MODULE_1__['FormBuilder']
            ),
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵdirectiveInject'](
              _angular_router__WEBPACK_IMPORTED_MODULE_5__['Router']
            )
          );
        };
        LoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__[
          'ɵɵdefineComponent'
        ]({
          type: LoginComponent,
          selectors: [['app-login']],
          decls: 32,
          vars: 3,
          consts: [
            [1, 'd-flex', 'flex-column', 'flex-root'],
            [
              'id',
              'kt_login',
              1,
              'login',
              'login-2',
              'login-signin-on',
              'd-flex',
              'flex-column',
              'flex-lg-row',
              'flex-column-fluid',
              'bg-white',
            ],
            [
              1,
              'login-aside',
              'order-2',
              'order-lg-1',
              'd-flex',
              'flex-row-auto',
              'position-relative',
              'overflow-hidden',
            ],
            [
              1,
              'd-flex',
              'flex-column-fluid',
              'flex-column',
              'justify-content-between',
              'py-9',
              'px-7',
              'py-lg-13',
              'px-lg-35',
            ],
            ['href', '#', 1, 'text-center', 'pt-2'],
            ['src', 'assets/media/logos/logo.png', 'alt', '', 1, 'max-h-75px'],
            [1, 'd-flex', 'flex-column-fluid', 'flex-column', 'flex-center'],
            [1, 'login-form', 'login-signin', 'py-11'],
            [1, 'form', 3, 'formGroup', 'ngSubmit'],
            [1, 'form-group'],
            [1, 'font-size-h6', 'font-weight-bolder', 'text-dark'],
            [
              'type',
              'text',
              'formControlName',
              'username',
              'autocomplete',
              'off',
              1,
              'form-control',
            ],
            ['class', 'text-danger', 4, 'ngIf'],
            [1, 'd-flex', 'justify-content-between', 'mt-n5'],
            [1, 'font-size-h6', 'font-weight-bolder', 'text-dark', 'pt-5'],
            [
              'type',
              'password',
              'formControlName',
              'password',
              'autocomplete',
              'off',
              1,
              'form-control',
            ],
            [1, 'text-center', 'pt-2'],
            [
              'id',
              'kt_login_signin_submit',
              'type',
              'submit',
              1,
              'btn',
              'btn-primary',
              'font-weight-bolder',
              'font-size-h6',
              'px-8',
              'py-4',
              'my-3',
              'mx-4',
            ],
            [
              1,
              'content',
              'order-1',
              'order-lg-2',
              'd-flex',
              'flex-column',
              'w-100',
              'pb-0',
              2,
              'background-color',
              '#B1DCED',
            ],
            [
              1,
              'd-flex',
              'flex-column',
              'justify-content-center',
              'text-center',
              'pt-lg-40',
              'pt-md-5',
              'pt-sm-5',
              'px-lg-0',
              'pt-5',
              'px-7',
            ],
            [
              1,
              'display4',
              'font-weight-bolder',
              'my-7',
              'text-dark',
              2,
              'color',
              '#986923',
            ],
            [
              1,
              'font-weight-bolder',
              'font-size-h2-md',
              'font-size-lg',
              'text-dark',
              'opacity-70',
            ],
            [
              1,
              'content-img',
              'd-flex',
              'flex-row-fluid',
              'bgi-no-repeat',
              'bgi-position-y-bottom',
              'bgi-position-x-center',
              2,
              'background-image',
              'url(assets/media/svg/illustrations/login-visual-2.svg)',
            ],
            [1, 'text-danger'],
          ],
          template: function LoginComponent_Template(rf, ctx) {
            if (rf & 1) {
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                0,
                'div',
                0
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                1,
                'div',
                1
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                2,
                'div',
                2
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                3,
                'div',
                3
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                4,
                'a',
                4
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelement'](
                5,
                'img',
                5
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                6,
                'div',
                6
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                7,
                'div',
                7
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                8,
                'form',
                8
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵlistener'](
                'ngSubmit',
                function LoginComponent_Template_form_ngSubmit_8_listener() {
                  return ctx.login();
                }
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                9,
                'div',
                9
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                10,
                'label',
                10
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
                11,
                'Phone Number'
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelement'](
                12,
                'input',
                11
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtemplate'](
                13,
                LoginComponent_small_13_Template,
                2,
                0,
                'small',
                12
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                14,
                'div',
                9
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                15,
                'div',
                13
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                16,
                'label',
                14
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
                17,
                'Password'
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelement'](
                18,
                'input',
                15
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtemplate'](
                19,
                LoginComponent_small_19_Template,
                2,
                0,
                'small',
                12
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                20,
                'div',
                16
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                21,
                'button',
                17
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
                22,
                'Sign In'
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                23,
                'div',
                18
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                24,
                'div',
                19
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                25,
                'h3',
                20
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
                26,
                'Amazing Wireframes'
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementStart'](
                27,
                'p',
                21
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
                28,
                'User Experience & Interface Design, Product Strategy '
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelement'](29, 'br');
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵtext'](
                30,
                'Web Application SaaS Solutions'
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelement'](
                31,
                'div',
                22
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵelementEnd']();
            }
            if (rf & 2) {
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵadvance'](8);
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵproperty'](
                'formGroup',
                ctx.loginForm
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵadvance'](5);
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵproperty'](
                'ngIf',
                ctx.submitted &&
                  ctx.loginForm.get('username').hasError('required')
              );
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵadvance'](6);
              _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵproperty'](
                'ngIf',
                ctx.submitted &&
                  ctx.loginForm.get('password').hasError('required')
              );
            }
          },
          directives: [
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__[
              'ɵangular_packages_forms_forms_y'
            ],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__['NgControlStatusGroup'],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__['FormGroupDirective'],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__['DefaultValueAccessor'],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__['NgControlStatus'],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__['FormControlName'],
            _angular_common__WEBPACK_IMPORTED_MODULE_6__['NgIf'],
          ],
          styles: [
            '\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJsb2dpbi5jb21wb25lbnQuc2NzcyJ9 */',
          ],
        });
        /*@__PURE__*/ (function () {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵsetClassMetadata'](
            LoginComponent,
            [
              {
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__['Component'],
                args: [
                  {
                    selector: 'app-login',
                    templateUrl: './login.component.html',
                    styleUrls: ['./login.component.scss'],
                  },
                ],
              },
            ],
            function () {
              return [
                {
                  type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__[
                    'ToastrService'
                  ],
                },
                {
                  type: src_app_shared_services_auth_service__WEBPACK_IMPORTED_MODULE_3__[
                    'AuthService'
                  ],
                },
                {
                  type: src_app_shared_services_api_service__WEBPACK_IMPORTED_MODULE_4__[
                    'ApiService'
                  ],
                },
                {
                  type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__[
                    'FormBuilder'
                  ],
                },
                {
                  type: _angular_router__WEBPACK_IMPORTED_MODULE_5__['Router'],
                },
              ];
            },
            null
          );
        })();

        /***/
      },

    /***/ nm5K:
      /*!************************************************!*\
  !*** ./src/app/shared/services/api.service.ts ***!
  \************************************************/
      /*! exports provided: ApiService */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'ApiService',
          function () {
            return ApiService;
          }
        );
        /* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! @angular/core */ '8Y7J');
        /* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! @angular/common/http */ 'IheW');
        /* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! src/environments/environment */ 'AytR');

        const httpoptions = {
          headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__[
            'HttpHeaders'
          ]({
            'Content-Type': 'application/json',
          }),
        };
        class ApiService {
          constructor(http) {
            this.http = http;
          }
          Get(controller, action, options) {
            return this.http.get(
              `${src_environments_environment__WEBPACK_IMPORTED_MODULE_2__['environment'].baseUrl}/${controller}/${action}`,
              options
            );
          }
          Post(controller, action, body, options) {
            return this.http.post(
              `${src_environments_environment__WEBPACK_IMPORTED_MODULE_2__['environment'].baseUrl}/${controller}/${action}`,
              body,
              options
            );
          }
          Put(controller, action, body, options) {
            return this.http.put(
              `${src_environments_environment__WEBPACK_IMPORTED_MODULE_2__['environment'].baseUrl}/${controller}/${action}`,
              body,
              options
            );
          }
          Delete(controller, action, body, options) {
            return this.http.delete(
              `${src_environments_environment__WEBPACK_IMPORTED_MODULE_2__['environment'].baseUrl}/${controller}/${action}`,
              options
            );
          }
        }
        ApiService.ɵfac = function ApiService_Factory(t) {
          return new (t || ApiService)(
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵinject'](
              _angular_common_http__WEBPACK_IMPORTED_MODULE_1__['HttpClient']
            )
          );
        };
        ApiService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__[
          'ɵɵdefineInjectable'
        ]({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' });
        /*@__PURE__*/ (function () {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵsetClassMetadata'](
            ApiService,
            [
              {
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__['Injectable'],
                args: [
                  {
                    providedIn: 'root',
                  },
                ],
              },
            ],
            function () {
              return [
                {
                  type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__[
                    'HttpClient'
                  ],
                },
              ];
            },
            null
          );
        })();

        /***/
      },

    /***/ rXac:
      /*!****************************************************!*\
  !*** ./src/app/layout/auth/auth-routing.module.ts ***!
  \****************************************************/
      /*! exports provided: AuthRoutingModule */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'AuthRoutingModule',
          function () {
            return AuthRoutingModule;
          }
        );
        /* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! @angular/core */ '8Y7J');
        /* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! @angular/router */ 'iInd');
        /* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./login/login.component */ 'Q8t4');

        const routes = [
          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full',
          },
          {
            path: 'login',
            component:
              _login_login_component__WEBPACK_IMPORTED_MODULE_2__[
                'LoginComponent'
              ],
          },
        ];
        class AuthRoutingModule {}
        AuthRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__[
          'ɵɵdefineNgModule'
        ]({ type: AuthRoutingModule });
        AuthRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__[
          'ɵɵdefineInjector'
        ]({
          factory: function AuthRoutingModule_Factory(t) {
            return new (t || AuthRoutingModule)();
          },
          imports: [
            [
              _angular_router__WEBPACK_IMPORTED_MODULE_1__[
                'RouterModule'
              ].forChild(routes),
            ],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__['RouterModule'],
          ],
        });
        (function () {
          (typeof ngJitMode === 'undefined' || ngJitMode) &&
            _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵɵsetNgModuleScope'](
              AuthRoutingModule,
              {
                imports: [
                  _angular_router__WEBPACK_IMPORTED_MODULE_1__['RouterModule'],
                ],
                exports: [
                  _angular_router__WEBPACK_IMPORTED_MODULE_1__['RouterModule'],
                ],
              }
            );
        })();
        /*@__PURE__*/ (function () {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__['ɵsetClassMetadata'](
            AuthRoutingModule,
            [
              {
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__['NgModule'],
                args: [
                  {
                    imports: [
                      _angular_router__WEBPACK_IMPORTED_MODULE_1__[
                        'RouterModule'
                      ].forChild(routes),
                    ],
                    exports: [
                      _angular_router__WEBPACK_IMPORTED_MODULE_1__[
                        'RouterModule'
                      ],
                    ],
                  },
                ],
              },
            ],
            null,
            null
          );
        })();

        /***/
      },
  },
]);
//# sourceMappingURL=layout-auth-auth-module.js.map
