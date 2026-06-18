function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// 语言切换功能
document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  var languageBtn, languageDropdown, updateSelectOptions, updateManualPlanningPreview, originalApplyLanguage, updateConnectButtonAfterLanguageChange, fixButtonStyles, updateRecipeListLabels, updateRecipePreviewTitle, originalSetLanguage;
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        updateRecipePreviewTitle = function _updateRecipePreviewT() {
          var previewTitle = document.querySelector('.recipe-preview h2');
          if (previewTitle) {
            var text = previewTitle.textContent;
            // 检查是否包含配方预览标题
            var match = text.match(/^(.+?)\s*-\s*(.+?)(\((.+?)\))?$/);
            if (match) {
              var recipeName = match[2];
              var isManualPlanning = match[4] !== undefined;
              if (isManualPlanning) {
                previewTitle.textContent = "".concat(t('recipe_preview'), " - ").concat(recipeName, "(").concat(t('menu_manual_planning'), ")");
              } else {
                previewTitle.textContent = "".concat(t('recipe_preview'), " - ").concat(recipeName);
              }
            }
          }
        };
        updateRecipeListLabels = function _updateRecipeListLabe() {
          var recipeListItems = document.querySelectorAll('#recipe-list li');
          recipeListItems.forEach(function (li) {
            var recipeNameSpan = li.querySelector('.recipe-name');
            if (recipeNameSpan) {
              var text = recipeNameSpan.textContent;
              // 检查是否包含手动规划标签（可能是任何语言的）
              var match = text.match(/^(.+?)\((.+?)\)$/);
              if (match) {
                var recipeName = match[1];
                // 重新获取配方信息以判断类型
                fetch('/get_recipe', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    recipeName: recipeName
                  })
                }).then(function (response) {
                  return response.json();
                }).then(function (recipeData) {
                  if (recipeData.isManualPlanning === true) {
                    recipeNameSpan.textContent = "".concat(recipeName, "(").concat(t('menu_manual_planning'), ")");
                  } else {
                    recipeNameSpan.textContent = recipeName;
                  }
                }).catch(function (error) {
                  console.error('更新配方标签失败:', error);
                });
              }
            }
          });
        };
        fixButtonStyles = function _fixButtonStyles() {
          // 修复连接按钮
          var connectButton = document.getElementById('robot_connect_button');
          if (connectButton) {
            // 先保存当前文本内容
            var currentText = connectButton.textContent;

            // 强制设置固定宽度，与CSS样式保持一致
            connectButton.style.setProperty('width', '60px', 'important');
            connectButton.style.setProperty('flex-shrink', '0', 'important');
            connectButton.style.setProperty('flex-grow', '0', 'important');
            connectButton.style.setProperty('min-width', '60px', 'important');
            connectButton.style.setProperty('max-width', '60px', 'important');

            // 确保文本不会消失
            if (currentText && currentText.trim()) {
              connectButton.textContent = currentText;
            }

            // 触发重排
            void connectButton.offsetWidth;

            // 在多个时机确保按钮宽度固定和文本不消失
            // 使用setTimeout确保在所有DOM更新后再次设置
            setTimeout(function () {
              connectButton.style.setProperty('width', '60px', 'important');
              connectButton.style.setProperty('min-width', '60px', 'important');
              connectButton.style.setProperty('max-width', '60px', 'important');

              // 再次确保文本存在
              if (!connectButton.textContent.trim() && currentText && currentText.trim()) {
                connectButton.textContent = currentText;
              }
            }, 50);
          }

          // 修复读取P点按钮
          var readPDataButton = document.getElementById('read_p_data_button');
          if (readPDataButton) {
            readPDataButton.style.setProperty('width', 'max-content', 'important');
            readPDataButton.style.setProperty('flex-shrink', '0', 'important');
            readPDataButton.style.setProperty('flex-grow', '0', 'important');
            readPDataButton.style.setProperty('min-width', 'auto', 'important');
            readPDataButton.style.setProperty('max-width', 'none', 'important');
            void readPDataButton.offsetWidth;
          }
        };
        updateConnectButtonAfterLanguageChange = function _updateConnectButtonA() {
          var connectButton = document.getElementById('robot_connect_button');
          if (connectButton) {
            // 优先检查robot_status是否显示来判断连接状态，这样更可靠
            var robotStatus = document.getElementById('robot_status');
            var isActuallyConnected = robotStatus && robotStatus.style.display !== 'none';

            // 如果无法从状态判断，再检查按钮文本
            if (!isActuallyConnected) {
              var currentText = connectButton.textContent.trim();
              var isDisconnected = currentText === t('connect') || currentText === '连接' || currentText === 'Connect' || currentText === 'Kết Nối' || currentText === '接続' || currentText === '연결';
              var isConnected = currentText === t('disconnect') || currentText === '断开连接' || currentText === 'Disconnect' || currentText === 'Ngắt Kết Nối' || currentText === '切断' || currentText === '연결 해제';
              if (isConnected) {
                connectButton.textContent = t('disconnect');
                return;
              }
            }

            // 根据实际连接状态更新按钮文本
            if (isActuallyConnected) {
              connectButton.textContent = t('disconnect');
            } else {
              connectButton.textContent = t('connect');
            }
          }
        };
        updateManualPlanningPreview = function _updateManualPlanning() {
          var manualPreviewElement = document.querySelector('.manual-planning-preview');
          if (manualPreviewElement && manualPreviewElement.style.display !== 'none') {
            // 尝试从存储的数据属性中获取完整数据
            var storedData = manualPreviewElement._recipeData;
            if (storedData && window.showManualPlanningPreview) {
              // 使用存储的数据重新显示，这样会使用新的语言
              // 增加延迟确保翻译函数已经更新
              setTimeout(function () {
                window.showManualPlanningPreview(storedData);
              }, 150);
            }
          }
        };
        updateSelectOptions = function _updateSelectOptions() {
          document.querySelectorAll('select[data-i18n-options]').forEach(function (select) {
            var optionsKey = select.getAttribute('data-i18n-options');
            var options = optionsKey.split(',');
            var currentLang = translations[getCurrentLanguage()] || translations['zh'];
            options.forEach(function (optionKey, index) {
              var option = select.options[index];
              if (option && currentLang[optionKey.trim()]) {
                option.textContent = currentLang[optionKey.trim()];
              }
            });
          });
        };
        if (!window.initLanguageFromApp) {
          _context.next = 11;
          break;
        }
        _context.next = 9;
        return window.initLanguageFromApp();
      case 9:
        _context.next = 12;
        break;
      case 11:
        applyLanguage(getCurrentLanguage());
      case 12:
        // 语言切换按钮事件
        languageBtn = document.getElementById('language-btn');
        languageDropdown = document.getElementById('language-dropdown');
        if (languageBtn && languageDropdown) {
          // 点击按钮显示/隐藏下拉菜单
          languageBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
          });

          // 点击语言选项
          languageDropdown.querySelectorAll('.language-option').forEach(function (option) {
            option.addEventListener('click', function (e) {
              e.stopPropagation();
              var lang = this.getAttribute('data-lang');
              console.log('切换语言到:', lang);
              if (window.setLanguage) {
                window.setLanguage(lang);
              } else {
                // 如果setLanguage不存在，直接调用applyLanguage
                if (window.applyLanguage) {
                  window.applyLanguage(lang);
                }
                if (window.getCurrentLanguage) {
                  localStorage.setItem('language', lang);
                }
              }
              languageDropdown.classList.remove('show');
            });
          });

          // 点击页面其他地方关闭下拉菜单
          document.addEventListener('click', function (e) {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
              languageDropdown.classList.remove('show');
            }
          });
        }

        // 更新select选项的翻译

        // 更新手动规划预览（如果当前正在显示）

        // 更新P点数据表格中的坐标系方向（如果表格正在显示）
        // 将函数暴露到window对象，以便在语言切换时可以调用
        window.updatePDataTableCoordinates = function updatePDataTableCoordinates() {
          var tableContainer = document.getElementById('p_data_table_container');
          if (!tableContainer || tableContainer.style.display !== 'block') {
            return; // 表格未显示，不需要更新
          }
          var tableBody = document.querySelector('#p_data_table tbody');
          if (tableBody) {
            var rows = tableBody.querySelectorAll('tr');
            rows.forEach(function (row) {
              var coordCell = row.cells[7];
              if (coordCell) {
                // 优先使用data属性中的原始值（最可靠的方法）
                var leftRightValueAttr = coordCell.getAttribute('data-left-right-value');
                if (leftRightValueAttr !== null) {
                  var leftRightValue = parseInt(leftRightValueAttr, 10);
                  // 注意：arm_left_right 的值为 1 表示右手坐标系，0 或其他值表示左手坐标系
                  var leftRightText = leftRightValue === 1 ? t('left_right_right') : t('left_right_left');
                  // 确保翻译文本有效
                  var safeLeftRightText = leftRightText && leftRightText !== 'left_right_right' && leftRightText !== 'left_right_left' && leftRightText !== 'undefined' ? leftRightText : leftRightValue === 1 ? '右手坐标系' : '左手坐标系';
                  coordCell.textContent = safeLeftRightText;
                } else if (tableBody._pDataTableData) {
                  // 如果没有data属性，尝试从存储的原始数据中获取
                  var rowIndex = Array.from(rows).indexOf(row);
                  if (tableBody._pDataTableData[rowIndex]) {
                    var pose = tableBody._pDataTableData[rowIndex];
                    var _leftRightValue = pose.poseData.cartData.baseCart.posture.arm_left_right;
                    var _leftRightText = _leftRightValue === 1 ? t('left_right_right') : t('left_right_left');
                    var _safeLeftRightText = _leftRightText && _leftRightText !== 'left_right_right' && _leftRightText !== 'left_right_left' && _leftRightText !== 'undefined' ? _leftRightText : _leftRightValue === 1 ? '右手坐标系' : '左手坐标系';
                    coordCell.textContent = _safeLeftRightText;
                    // 同时设置data属性，方便下次使用
                    coordCell.setAttribute('data-left-right-value', _leftRightValue);
                  }
                } else {
                  // 如果都没有，尝试从当前文本推断
                  var currentText = coordCell.textContent.trim();
                  // 检查当前文本是右手还是左手（支持多种语言）
                  var isRightHanded = currentText === '右手' || currentText === '右手坐标系' || currentText === 'Right-Handed' || currentText === 'Hệ Tọa Độ Tay Phải' || currentText === '오른손 좌표계';
                  var isLeftHanded = currentText === '左手' || currentText === '左手坐标系' || currentText === 'Left-Handed' || currentText === 'Hệ Tọa Độ Tay Trái' || currentText === '왼손 좌표계';
                  if (isRightHanded) {
                    var rightText = t('left_right_right');
                    coordCell.textContent = rightText && rightText !== 'left_right_right' && rightText !== 'undefined' ? rightText : '右手坐标系';
                    coordCell.setAttribute('data-left-right-value', '1');
                  } else if (isLeftHanded) {
                    var leftText = t('left_right_left');
                    coordCell.textContent = leftText && leftText !== 'left_right_left' && leftText !== 'undefined' ? leftText : '左手坐标系';
                    coordCell.setAttribute('data-left-right-value', '0');
                  }
                }
              }
            });
          }
        };

        // 重写applyLanguage函数以包含select选项更新
        originalApplyLanguage = window.applyLanguage;
        window.applyLanguage = function (lang) {
          if (originalApplyLanguage) {
            originalApplyLanguage(lang);
          }
          updateSelectOptions();
          // 延迟更新手动规划预览和P点数据表格，确保翻译已加载
          setTimeout(function () {
            updateManualPlanningPreview();
            updatePDataTableCoordinates();
          }, 200);
        };

        // 更新连接按钮文本（在语言切换后调用）

        // 修复按钮样式（防止按钮在语言切换后变成长条）

        // 更新配方列表中的手动规划标签

        // 更新配方预览标题
        // 重写setLanguage函数，在语言切换后更新连接按钮和修复样式
        originalSetLanguage = window.setLanguage;
        window.setLanguage = function (lang) {
          // 在语言切换前，先保存连接按钮的状态和文本
          var connectButton = document.getElementById('robot_connect_button');
          var robotStatus = document.getElementById('robot_status');
          var isActuallyConnected = robotStatus && robotStatus.style.display !== 'none';
          var savedButtonText = connectButton ? connectButton.textContent : '';
          if (originalSetLanguage) {
            originalSetLanguage(lang);
          }

          // 使用requestAnimationFrame确保在DOM更新后执行
          requestAnimationFrame(function () {
            // 先修复按钮样式，确保宽度固定
            fixButtonStyles();

            // 立即更新连接按钮文本，避免闪烁
            if (connectButton) {
              if (isActuallyConnected) {
                connectButton.textContent = t('disconnect');
              } else {
                connectButton.textContent = t('connect');
              }
            }

            // 更新配方列表和预览标题
            updateRecipeListLabels();
            updateRecipePreviewTitle();

            // 更新P点数据表格中的坐标系方向
            updatePDataTableCoordinates();

            // 使用双重requestAnimationFrame确保样式修复在布局更新后执行
            requestAnimationFrame(function () {
              fixButtonStyles();

              // 最后再次确保按钮状态正确
              if (connectButton) {
                connectButton.style.setProperty('width', '60px', 'important');
                connectButton.style.setProperty('min-width', '60px', 'important');
                connectButton.style.setProperty('max-width', '60px', 'important');

                // 确保按钮文本不会为空
                if (!connectButton.textContent.trim()) {
                  connectButton.textContent = isActuallyConnected ? t('disconnect') : t('connect');
                }
              }

              // 再次更新P点数据表格，确保在DOM完全更新后执行
              updatePDataTableCoordinates();
            });
          });
        };
      case 20:
      case "end":
        return _context.stop();
    }
  }, _callee);
})));
