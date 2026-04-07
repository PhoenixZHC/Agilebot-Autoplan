function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// 判断当前环境是否运行在插件中，选择不同的提示框
var isExtension = gbtExtension.isInExtension();
// 是否处在TP中，两种情况，1. 插件环境 2. 直接访问此插件的端口
var isTP = window.isTP;

// TP插件环境中，alert无法使用
var alertSuccess = !isExtension ? alert : gbtExtension.rtmNotification.success;
var alertError = !isExtension ? alert : gbtExtension.rtmNotification.error;
var alertInfo = !isExtension ? alert : gbtExtension.rtmNotification.info;
// TP插件环境中，confirm无法使用
var myConfirm = function myConfirm(message) {
  if (!isExtension) {
    return confirm(message);
  }
  return new Promise(function (resolve) {
    gbtExtension.rtmMessageBox.confirm(message).then(function () {
      resolve(true);
    }).catch(function () {
      resolve(false);
    });
  });
};

// 页面加载时初始化菜单栏
document.addEventListener('DOMContentLoaded', function () {
  // 默认显示机器人设置
  showSection('robot-settings-content');
  document.getElementById('robot-settings-btn').classList.add('active');

  // 初始化菜单栏状态
  var sidebar = document.querySelector('.sidebar');
  var content = document.querySelector('.content');

  // 点击菜单按钮时展开菜单
  document.querySelectorAll('.sidebar button').forEach(function (button) {
    button.addEventListener('click', function () {
      sidebar.classList.add('expanded');
    });
  });

  // 点击内容区域时缩回菜单
  content.addEventListener('click', function () {
    sidebar.classList.remove('expanded');
  });

  // 初始化 shape_type 输入框显示状态
  var shapeType = document.getElementById('shape_type').value;
  updateInputFields(shapeType);

  // 初始化底边长输入框的显示状态
  var triangleType = document.getElementById('triangle_type').value;
  var baseLengthInput = document.getElementById('triangle_base_length_input');
  if (triangleType === 'isosceles') {
    baseLengthInput.style.display = 'block'; // 显示底边长输入框
  } else {
    baseLengthInput.style.display = 'none'; // 隐藏底边长输入框
  }
  loadRecipeList(); // 初始加载所有配方

  // 重置配方预览状态，确保智能规划预览元素可见
  resetRecipePreview();

  // 设置默认配方类型为智能规划
  window.currentRecipeType = 'smart';
  var recipeListItems = document.querySelectorAll("#recipe-list li");
  recipeListItems.forEach(function (li) {
    var textNodes = Array.from(li.childNodes).filter(function (node) {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "";
    });
    if (textNodes.length > 0) {
      var recipeName = textNodes[0].textContent.trim();
      var span = document.createElement("span");
      span.className = "recipe-name";
      span.textContent = recipeName;
      li.insertBefore(span, li.firstChild); // 将包裹后的配方名插入到最前面
    }
  });

  // 监听工具布局选项的变化
  document.getElementById('tool_layout').addEventListener('change', function () {
    var toolLayout = this.value;
    var toolCountInput = document.getElementById('tool_count');
    if (toolLayout === 'double') {
      toolCountInput.value = 2; // 双向布局时，工具数量固定为2
      toolCountInput.disabled = true; // 禁用工具数量输入框
    } else {
      toolCountInput.disabled = false; // 单侧布局时，启用工具数量输入框
    }
  });

  // 添加配方号输入框的事件监听器
  var recipeNumberInput = document.getElementById('recipe-number');
  if (recipeNumberInput) {
    recipeNumberInput.addEventListener('input', updateExternalCallVisibility);
  }

  // 添加调用信号DI输入框的事件监听器
  var callSignalInput = document.getElementById('call-signal');
  if (callSignalInput) {
    callSignalInput.addEventListener('input', updateExternalCallVisibility);
  }

  // 添加完成信号DO输入框的事件监听器
  var finishSignalInput = document.getElementById('finish-signal');
  if (finishSignalInput) {
    finishSignalInput.addEventListener('input', updateExternalCallVisibility);
  }

  // 初始化显示状态
  updateExternalCallVisibility();

  // 添加外部调用选择框的事件监听器
  var externalCallSelect = document.getElementById('external-call');
  if (externalCallSelect) {
    externalCallSelect.addEventListener('change', handleExternalCallChange);
  }

  // 页面卸载时清理监控
  window.addEventListener('beforeunload', function () {
    stopExternalCallMonitor();
  });

  // 在示教器环境中自动获取机器人IP并连接
  if (isExtension) {
    gbtExtension.enableShortcut();
    autoConnectRobot();
  }

  // 添加配方操作按钮事件监听器
  setupRecipeOperationListeners();
});

// 自动连接机器人函数
function autoConnectRobot() {
  console.log('检测到示教器环境，开始自动获取机器人IP...');

  // 获取机器人IP地址
  fetch('/get_robot_ip', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.success && data.robot_ip) {
      console.log('自动获取到机器人IP:', data.robot_ip);

      // 将IP地址填入输入框
      document.getElementById('robot_ip').value = data.robot_ip;

      // 自动点击连接按钮
      console.log('自动连接机器人...');
      document.getElementById('robot_connect_button').click();
    } else {
      console.log('无法自动获取机器人IP，需要手动输入:', data.message);
    }
  }).catch(function (error) {
    console.error('自动获取机器人IP失败:', error);
  });
}

// 处理外部调用选择框变化
function handleExternalCallChange() {
  var externalCallValue = document.getElementById('external-call').value;
  var recipeNumber = document.getElementById('recipe-number').value;
  var callSignal = document.getElementById('call-signal').value;
  var finishSignal = document.getElementById('finish-signal').value;
  if (externalCallValue === '1' && recipeNumber && callSignal && finishSignal) {
    // 开启外部调用监控
    startExternalCallMonitor();
  } else {
    // 停止外部调用监控
    stopExternalCallMonitor();
  }
}

// 外部调用监控相关变量
var externalCallInterval = null;
var isMonitoring = false;
var lastTriggerTime = 0; // 记录上次触发时间
var isAutoWriting = false; // 记录是否正在自动写入
var TRIGGER_COOLDOWN = 3000; // 3秒冷却时间

// 开始外部调用监控
function startExternalCallMonitor() {
  if (isMonitoring) {
    return; // 已经在监控中
  }
  var recipeNumber = document.getElementById('recipe-number').value;
  var callSignal = document.getElementById('call-signal').value;
  var finishSignal = document.getElementById('finish-signal').value;
  if (!recipeNumber || !callSignal || !finishSignal) {
    alertError(t('error_input_required'));
    return;
  }
  isMonitoring = true;
  console.log('开始外部调用监控...');
  updateStatusDisplay(t('monitoring_status_monitoring', {
    signal: callSignal
  }), 'monitoring');

  // 每0.3秒检查一次DI信号
  externalCallInterval = setInterval(function () {
    checkExternalCall();
  }, 300);
}

// 停止外部调用监控
function stopExternalCallMonitor() {
  if (externalCallInterval) {
    clearInterval(externalCallInterval);
    externalCallInterval = null;
  }
  isMonitoring = false;
  isAutoWriting = false; // 重置写入状态
  console.log('停止外部调用监控');
  updateStatusDisplay(t('monitoring_status_stopped_text'));
}

// 检查外部调用
function checkExternalCall() {
  var recipeNumber = document.getElementById('recipe-number').value;
  var callSignal = document.getElementById('call-signal').value;
  var finishSignal = document.getElementById('finish-signal').value;

  // 如果正在自动写入，则跳过此次检查
  if (isAutoWriting) {
    console.log('正在自动写入中，跳过此次配方调用检查');
    updateStatusDisplay(t('monitoring_status_processing'), 'processing');
    return;
  }
  fetch('/start_external_call_monitor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mh_number: recipeNumber,
      di_number: callSignal,
      do_number: finishSignal
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.error) {
      console.error('外部调用监控错误:', data.error);
      updateStatusDisplay(t('error_monitoring_failed', {
        error: data.error
      }), 'error');
      stopExternalCallMonitor();
      return;
    }

    // 打印DI信号状态
    console.log("DI".concat(callSignal, " \u4FE1\u53F7\u72B6\u6001: ").concat(data.di_value));
    if (data.triggered) {
      // 再次检查是否正在自动写入（双重保险）
      if (isAutoWriting) {
        console.log('正在自动写入中，忽略此次触发');
        return;
      }

      // 检查是否在冷却时间内
      var currentTime = Date.now();
      if (currentTime - lastTriggerTime < TRIGGER_COOLDOWN) {
        console.log('触发信号在冷却时间内，忽略此次触发');
        return;
      }

      // 更新触发时间
      lastTriggerTime = currentTime;

      // DI信号为1，读取到MH值，加载对应配方
      console.log("\u68C0\u6D4B\u5230\u89E6\u53D1\u4FE1\u53F7\uFF0CMH".concat(recipeNumber, " \u5BC4\u5B58\u5668\u503C: ").concat(data.mh_value));
      updateStatusDisplay(t('monitoring_status_triggered', {
        mh: data.mh_value
      }), 'triggered');

      // 加载配方但不停止监控
      loadRecipeByMHValue(data.mh_value);

      // 延迟一下再继续监控，避免重复触发
      setTimeout(function () {
        if (isMonitoring) {
          updateStatusDisplay(t('monitoring_status_monitoring', {
            signal: callSignal
          }), 'monitoring');
        }
      }, 2000); // 2秒后恢复监控状态显示
    }
  }).catch(function (error) {
    console.error('外部调用监控请求失败:', error);
    updateStatusDisplay(t('error_monitoring_failed', {
      error: error.message
    }), 'error');
    stopExternalCallMonitor();
  });
}

// 根据MH值加载配方
function loadRecipeByMHValue(mhValue) {
  console.log('开始根据MH值加载配方，MH值:', mhValue);

  // 首先获取所有配方列表
  fetch('/get_recipe_list', {
    method: 'GET'
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.error) {
      console.error('获取配方列表失败:', data.error);
      updateStatusDisplay("\u83B7\u53D6\u914D\u65B9\u5217\u8868\u5931\u8D25: ".concat(data.error), 'error');
      return;
    }
    console.log('获取到的配方列表:', data.recipes);

    // 查找配方编号匹配的配方
    var targetRecipe = data.recipes.find(function (recipe) {
      console.log('检查配方:', recipe.recipeName, '配方编号:', recipe.recipeId, '目标MH值:', mhValue);
      return recipe.recipeId == mhValue; // 使用==进行类型转换比较
    });
    if (targetRecipe) {
      console.log('找到匹配的配方:', targetRecipe.recipeName, '配方编号:', targetRecipe.recipeId);

      // 检查是否开启自动写入
      var autoWriteValue = document.getElementById('auto-write').value;
      console.log('自动写入设置:', autoWriteValue);
      if (autoWriteValue === '1') {
        // 自动写入模式：先跳转到数据清单页面，然后执行自动写入
        console.log('执行自动写入模式，跳转到数据清单页面...');
        updateStatusDisplay("\u627E\u5230\u914D\u65B9: ".concat(targetRecipe.recipeName, "\uFF0C\u8DF3\u8F6C\u5230\u6570\u636E\u6E05\u5355\u9875\u9762..."), 'processing');

        // 跳转到数据清单页面
        showSection('data-list-content');
        setActiveButton('data-list-btn');

        // 然后执行自动写入
        performAutoWrite(targetRecipe.recipeName);
      } else {
        // 手动模式：加载到数据清单页面并显示配方数据
        console.log('执行手动模式，加载配方到数据清单页面');
        window.isFromExternalCall = true; // 设置标志位
        loadRecipeToPlanning(targetRecipe.recipeName);
        updateStatusDisplay(t('success_recipe_loaded') + targetRecipe.recipeName, 'success');
        alertSuccess(t('success_recipe_loaded') + targetRecipe.recipeName);
      }
    } else {
      console.log('未找到配方编号为', mhValue, '的配方');
      console.log('可用的配方编号:', data.recipes.map(function (r) {
        return r.recipeId;
      }));
      updateStatusDisplay(t('error_load_recipe_failed', {
        error: mhValue
      }), 'error');
      alertError(t('error_load_recipe_failed', {
        error: mhValue
      }));
    }
  }).catch(function (error) {
    console.error('根据MH值加载配方失败:', error);
    updateStatusDisplay(t('error_load_recipe_failed', {
      error: error.message
    }), 'error');
  });
}

// 全局变量，用于跟踪写入P点操作的状态
var isWriteOperationInProgress = false;
var writeOperationPromise = null;
var writeOperationCount = 0; // 跟踪需要完成的写入操作数量
var completedOperations = 0; // 已完成的写入操作数量
var writeOperationResults = []; // 存储所有写入操作的结果

// 执行自动写入功能
function performAutoWrite(recipeName) {
  console.log('开始执行自动写入功能，配方名称:', recipeName);

  // 设置正在自动写入标志
  isAutoWriting = true;
  updateStatusDisplay("\u6B63\u5728\u52A0\u8F7D\u914D\u65B9\u5230\u6570\u636E\u6E05\u5355\u9875\u9762...", 'processing');

  // 重置写入操作计数器
  writeOperationCount = 0;
  completedOperations = 0;
  writeOperationResults = [];

  // 1. 首先加载配方到数据清单页面
  window.isFromExternalCall = true; // 设置标志位
  loadRecipeToPlanning(recipeName);

  // 2. 等待页面加载完成后，检查机器人状态
  setTimeout(function () {
    updateStatusDisplay("\u6B63\u5728\u68C0\u67E5\u673A\u5668\u4EBA\u72B6\u6001...", 'processing');

    // 检查机器人状态
    fetch('/check_robot_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.error) {
        console.error('检查机器人状态失败:', data.error);
        updateStatusDisplay(t('error_robot_status_check_failed') + data.error, 'error');
        alertError(t('error_robot_status_check_failed') + data.error);
        isAutoWriting = false; // 重置写入状态
        throw new Error(data.error);
      }
      console.log('机器人状态:', data.status, '是否空闲:', data.is_idle);
      if (!data.is_idle) {
        updateStatusDisplay("\u673A\u5668\u4EBA\u5F53\u524D\u72B6\u6001: ".concat(data.status, "\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5199\u5165"), 'error');
        alertError("\u673A\u5668\u4EBA\u5F53\u524D\u72B6\u6001: ".concat(data.status, "\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5199\u5165"));
        isAutoWriting = false; // 重置写入状态
        throw new Error("\u673A\u5668\u4EBA\u5F53\u524D\u72B6\u6001: ".concat(data.status, "\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5199\u5165"));
      }

      // 3. 检查运行中的程序
      updateStatusDisplay("\u673A\u5668\u4EBA\u72B6\u6001\u6B63\u5E38\uFF0C\u68C0\u67E5\u8FD0\u884C\u4E2D\u7684\u7A0B\u5E8F...", 'processing');
      return fetch('/check_running_programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.error) {
        console.error('检查运行程序失败:', data.error);
        updateStatusDisplay(t('error_check_running_program_failed') + data.error, 'error');
        alertError(t('error_check_running_program_failed') + data.error);
        isAutoWriting = false; // 重置写入状态
        throw new Error(data.error);
      }
      console.log('运行中的程序:', data.running_programs, '是否有程序运行:', data.has_running_programs);
      if (data.has_running_programs) {
        updateStatusDisplay("\u5F53\u524D\u6709\u7A0B\u5E8F\u5728\u8FD0\u884C: ".concat(data.running_programs.join(', '), "\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5199\u5165"), 'error');
        alertError("\u5F53\u524D\u6709\u7A0B\u5E8F\u5728\u8FD0\u884C: ".concat(data.running_programs.join(', '), "\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5199\u5165"));
        isAutoWriting = false; // 重置写入状态
        throw new Error("\u5F53\u524D\u6709\u7A0B\u5E8F\u5728\u8FD0\u884C: ".concat(data.running_programs.join(', '), "\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5199\u5165"));
      }

      // 4. 状态检查通过，开始写入P点操作
      updateStatusDisplay("\u72B6\u6001\u68C0\u67E5\u901A\u8FC7\uFF0C\u5F00\u59CB\u81EA\u52A8\u5199\u5165P\u70B9...", 'processing');

      // 确保程序名称输入框有值
      var programNameInput = document.getElementById('write_program_name');
      if (!programNameInput.value) {
        programNameInput.value = recipeName; // 使用配方名称作为程序名称
      }

      // 创建一个Promise来等待所有写入操作完成
      writeOperationPromise = new Promise(function (resolve, reject) {
        // 设置写入操作完成后的回调
        // 注意：P点写入和R寄存器写入总是会执行，TF写入只有在自动TF功能开启时才会执行
        window.onWriteOperationComplete = function (success, message, operationType) {
          console.log("\u5199\u5165\u64CD\u4F5C\u5B8C\u6210: ".concat(operationType, ", \u6210\u529F: ").concat(success, ", \u6D88\u606F: ").concat(message));

          // 记录操作结果
          writeOperationResults.push({
            type: operationType,
            success: success,
            message: message
          });
          completedOperations++;

          // 检查是否所有操作都完成了
          if (completedOperations >= writeOperationCount) {
            // 检查是否有失败的操作
            var failedOperations = writeOperationResults.filter(function (op) {
              return !op.success;
            });
            if (failedOperations.length > 0) {
              // 有失败的操作
              var errorMessages = failedOperations.map(function (op) {
                return "".concat(op.type, ": ").concat(op.message);
              }).join('; ');
              reject(new Error(errorMessages));
            } else {
              // 所有操作都成功
              var successMessages = writeOperationResults.map(function (op) {
                return "".concat(op.type, ": ").concat(op.message);
              }).join('; ');
              resolve(successMessages);
            }
          }
        };

        // 模拟点击写入P点按钮
        console.log('模拟点击写入P点按钮');
        document.getElementById('write_p_data_button').click();
      });

      // 等待写入操作完成
      return writeOperationPromise;
    }).then(function (message) {
      console.log('自动写入完成:', message);
      updateStatusDisplay(t('monitoring_status_auto_write_complete'), 'success');
      alertSuccess(t('success_recipe_auto_write', {
        name: recipeName
      }));
      isAutoWriting = false; // 重置写入状态

      // 自动写入完成后，触发DO信号
      triggerFinishSignal();
    }).catch(function (error) {
      console.error('自动写入过程出错:', error);
      updateStatusDisplay(t('monitoring_status_auto_write_failed') + error.message, 'error');
      alertError(t('error_auto_write_failed') + error.message);
      isAutoWriting = false; // 重置写入状态
    });
  }, 1000); // 等待1秒，确保页面加载完成
}

// 菜单栏按钮点击事件
document.getElementById('robot-settings-btn').addEventListener('click', function () {
  showSection('robot-settings-content');
  setActiveButton('robot-settings-btn');
});
document.getElementById('smart-planning-btn').addEventListener('click', function () {
  showSection('smart-planning-content');
  setActiveButton('smart-planning-btn');
});
document.getElementById('data-list-btn').addEventListener('click', function () {
  showSection('data-list-content');
  setActiveButton('data-list-btn');
});
document.getElementById('interval-calculator-btn').addEventListener('click', function () {
  showSection('interval-calculator-content');
  setActiveButton('interval-calculator-btn');
});

// 显示对应的内容区域
function showSection(sectionId) {
  // 隐藏所有内容区域
  document.querySelectorAll('.content-section').forEach(function (section) {
    section.style.display = 'none';
  });

  // 显示选中的内容区域
  document.getElementById(sectionId).style.display = 'block';

  // 重新应用当前语言,确保新显示的内容区域中的元素文字正确
  if (typeof getCurrentLanguage === 'function' && typeof applyLanguage === 'function') {
    var currentLang = getCurrentLanguage();
    applyLanguage(currentLang);
  }

  // 如果切换到配方库，重置预览状态
  if (sectionId === 'recipe-library-content') {
    resetRecipePreview();
  }
}

// 设置当前选中的菜单按钮
function setActiveButton(buttonId) {
  // 移除所有按钮的 active 类
  document.querySelectorAll('.sidebar button').forEach(function (button) {
    button.classList.remove('active');
  });

  // 为选中的按钮添加 active 类
  document.getElementById(buttonId).classList.add('active');
}

// 动态显示或隐藏底边长输入框
document.getElementById('triangle_type').addEventListener('change', function () {
  var triangleType = this.value;
  var baseLengthInput = document.getElementById('triangle_base_length_input');
  if (triangleType === 'isosceles') {
    baseLengthInput.style.display = 'block'; // 显示底边长输入框
  } else {
    baseLengthInput.style.display = 'none'; // 隐藏底边长输入框
  }
});

// 动态显示图形输入框
document.getElementById('shape_type').addEventListener('change', function () {
  var shapeType = this.value;
  updateInputFields(shapeType);
});
function updateInputFields(shapeType) {
  // 隐藏所有形状特定的输入字段
  document.getElementById('circle_input').style.display = 'none';
  document.getElementById('rectangle_input').style.display = 'none';
  document.getElementById('polygon_input').style.display = 'none';
  document.getElementById('triangle_input').style.display = 'none';
  document.getElementById('polygon_arrangement_input').style.display = 'none';

  // 显示所选形状的输入字段
  if (shapeType === 'circle') {
    document.getElementById('circle_input').style.display = 'block';
  } else if (shapeType === 'rectangle') {
    document.getElementById('rectangle_input').style.display = 'block';
  } else if (shapeType === 'polygon') {
    document.getElementById('polygon_input').style.display = 'block';
    // 检查当前边数
    var sides = parseInt(document.getElementById('polygon_sides').value);
    if (sides === 6) {
      document.getElementById('polygon_arrangement_input').style.display = 'block';
    }
  } else if (shapeType === 'triangle') {
    document.getElementById('triangle_input').style.display = 'block';
  }
}

// 添加多边形边数变化的事件监听器
document.getElementById('polygon_sides').addEventListener('change', function () {
  var sides = parseInt(this.value);
  if (sides === 6) {
    document.getElementById('polygon_arrangement_input').style.display = 'block';
  } else {
    document.getElementById('polygon_arrangement_input').style.display = 'none';
  }
});
var shapeCenters = []; // 全局变量，用于存储图形的中心位置
// 在全局变量中存储行数和列数
var rows = 0;
var cols = 0;

// 获取表单数据并发送请求
document.getElementById('inputForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // 获取参数设置表单的数据
  var frame_length = document.getElementById('frame_length').value;
  var frame_width = document.getElementById('frame_width').value;
  var frame_depth = document.getElementById('frame_depth').value;
  var shape_type = document.getElementById('shape_type').value;
  var shape_height = document.getElementById('shape_height').value;
  var shape_length, shape_width, polygon_sides, triangle_type, triangle_orientation, polygon_arrangement;
  if (shape_type === 'circle') {
    shape_length = document.getElementById('circle_diameter').value;
    shape_width = shape_length;
  } else if (shape_type === 'rectangle') {
    shape_length = document.getElementById('rectangle_length').value;
    shape_width = document.getElementById('rectangle_width').value;
  } else if (shape_type === 'polygon') {
    polygon_sides = document.getElementById('polygon_sides').value;
    shape_length = document.getElementById('polygon_side_length').value;
    shape_width = shape_length;
    // 获取多边形排布方式
    polygon_arrangement = document.getElementById('polygon_arrangement').value;
  } else if (shape_type === 'triangle') {
    triangle_type = document.getElementById('triangle_type').value;
    shape_length = document.getElementById('triangle_side_length').value;
    triangle_orientation = document.getElementById('triangle_orientation').value;

    // 如果是等腰三角形，传递底边长；否则传递边长作为底边长
    if (triangle_type === 'isosceles') {
      shape_width = document.getElementById('triangle_base_length').value;
    } else {
      shape_width = shape_length; // 等边三角形的底边长等于边长
    }
  }

  // 获取摆放设置表单的数据
  var horizontal_spacing = document.getElementById('horizontal_spacing').value;
  var vertical_spacing = document.getElementById('vertical_spacing').value;
  var horizontal_border_distance = document.getElementById('horizontal_border_distance').value;
  var vertical_border_distance = document.getElementById('vertical_border_distance').value;
  var material_thickness = document.getElementById('material_thickness').value;
  var placement_layers = document.getElementById('placement_layers').value;
  var layout_type = document.getElementById('layout_type').value;
  var place_type = document.getElementById('place_type').value;
  var remainder_turn = document.getElementById('remainder_turn').value;

  // 发送请求到后端
  fetch('/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      frame_length: frame_length,
      frame_width: frame_width,
      frame_depth: frame_depth,
      shape_length: shape_length,
      shape_width: shape_width,
      horizontal_spacing: horizontal_spacing,
      vertical_spacing: vertical_spacing,
      horizontal_border_distance: horizontal_border_distance,
      vertical_border_distance: vertical_border_distance,
      material_thickness: material_thickness,
      placement_layers: placement_layers,
      shape_type: shape_type,
      layout_type: layout_type,
      polygon_sides: polygon_sides,
      triangle_type: triangle_type,
      triangle_orientation: triangle_orientation,
      shape_height: shape_height,
      place_type: place_type,
      remainder_turn: remainder_turn,
      polygon_arrangement: polygon_arrangement // 添加多边形排布方式参数
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '请求失败');
      });
    }
    // 获取填充的图形数量和中心位置数据
    var totalShapes = response.headers.get('X-Total-Shapes');
    var shapeCentersData = response.headers.get('X-Shape-Centers');
    var shapesPerRowOrCol = response.headers.get('X-Shapes-Per-Row-Or-Col'); // 获取单行/列填充数量
    var rowColInfo = JSON.parse(response.headers.get('X-Row-Col-Info')); // 获取行号和列号信息
    rows = response.headers.get('X-Rows'); // 获取行数
    cols = response.headers.get('X-Cols'); // 获取列数
    shapeCenters = JSON.parse(shapeCentersData); // 将中心位置数据存储到全局变量中
    rowColInfoGlobal = rowColInfo; // 将行号和列号信息存储到全局变量中

    // 如果是三角形，将 totalShapes 除以 2
    var adjustedTotalShapes = shape_type === 'triangle' ? Math.floor(totalShapes / 2) : totalShapes;

    // 显示填充的图形数量
    document.getElementById('shape-count').style.display = 'block';
    document.getElementById('shape-count-value').textContent = adjustedTotalShapes;
    document.getElementById('shapes-per-row-or-col').style.display = 'block';
    document.getElementById('shapes-per-row-or-col-value').textContent = shapesPerRowOrCol;

    // 返回图像数据
    return response.blob();
  }).then(function (blob) {
    // 创建图像URL
    var imageUrl = URL.createObjectURL(blob);
    var plotImage = document.getElementById('plot');
    if (!plotImage) {
      console.error('plot element not found');
      return;
    }
    plotImage.src = imageUrl;
    plotImage.style.display = 'block';

    // 将 blob 转换为 Base64 字符串
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          plotImage.setAttribute('data-base64', reader.result);
          console.log('Base64 data set successfully:', reader.result.substring(0, 50) + '...');
        } else {
          console.error('Failed to convert image to base64');
        }
        resolve();
      };
      reader.onerror = function (error) {
        console.error('Error converting image to base64:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }).then(function () {
    // 获取PR寄存器ID
    var pr_register_id = document.getElementById('pr_register_id').value;

    // 读取PR寄存器的C值
    return fetch('/read_pr_register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pr_register_id: pr_register_id
      })
    });
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('读取PR寄存器失败');
    }
    return response.json();
  }).then(function (data) {
    var cValue = parseFloat(data.c); // 获取PR寄存器的C值并转换为浮点数
    console.log('从后端读取的C值:', cValue); // 打印C值

    // 填充数据清单表格
    var tableBody = document.querySelector('#data-list-content table tbody');
    tableBody.innerHTML = ''; // 清空表格内容

    // 遍历所有图形中心位置，填充到表格中
    shapeCenters.forEach(function (center, index) {
      var row = document.createElement('tr');

      // 行号
      var cell1 = document.createElement('td');
      cell1.textContent = rowColInfoGlobal[index][0]; // 行号
      cell1.style.border = '1px solid #ddd';
      cell1.style.padding = '8px';
      row.appendChild(cell1);

      // 列号
      var cell2 = document.createElement('td');
      cell2.textContent = rowColInfoGlobal[index][1]; // 列号
      cell2.style.border = '1px solid #ddd';
      cell2.style.padding = '8px';
      row.appendChild(cell2);

      // P_ID
      var cell3 = document.createElement('td');
      cell3.textContent = index + 1; // P_ID从1开始
      cell3.style.border = '1px solid #ddd';
      cell3.style.padding = '8px';
      row.appendChild(cell3);

      // X坐标
      var cell4 = document.createElement('td');
      cell4.textContent = center[0].toFixed(2); // X坐标
      cell4.style.border = '1px solid #ddd';
      cell4.style.padding = '8px';
      row.appendChild(cell4);

      // X补偿（初始为0）
      var cell5 = document.createElement('td');
      cell5.textContent = '0.00';
      cell5.style.border = '1px solid #ddd';
      cell5.style.padding = '8px';
      row.appendChild(cell5);

      // Y坐标
      var cell6 = document.createElement('td');
      cell6.textContent = center[1].toFixed(2); // Y坐标
      cell6.style.border = '1px solid #ddd';
      cell6.style.padding = '8px';
      row.appendChild(cell6);

      // Y补偿（初始为0）
      var cell7 = document.createElement('td');
      cell7.textContent = '0.00';
      cell7.style.border = '1px solid #ddd';
      cell7.style.padding = '8px';
      row.appendChild(cell7);

      // C坐标（使用从PR寄存器读取的C值）
      var cell8 = document.createElement('td');
      cell8.textContent = isNaN(cValue) ? '0.00' : cValue.toFixed(2); // 使用读取到的C值，如果无效则显示0.00
      cell8.style.border = '1px solid #ddd';
      cell8.style.padding = '8px';
      row.appendChild(cell8);

      // C补偿（初始为0）
      var cell9 = document.createElement('td');
      cell9.textContent = '0.00';
      cell9.style.border = '1px solid #ddd';
      cell9.style.padding = '8px';
      row.appendChild(cell9);
      tableBody.appendChild(row);
    });

    // 跳转到数据清单页面
    showSection('data-list-content');
    setActiveButton('data-list-btn');
  }).catch(function (error) {
    alertError(error.message);
  });
});

// 绘制图形
function drawShapes(shape_centers, shape_type, frame_length, frame_width) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 设置画布尺寸与边框尺寸一致
  var scale_factor = 4; // 放大4倍
  canvas.width = frame_length * scale_factor;
  canvas.height = frame_width * scale_factor;

  // 绘制边框
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, frame_length * scale_factor, frame_width * scale_factor);
  shape_centers.forEach(function (center) {
    var _center = _slicedToArray(center, 2),
      x = _center[0],
      y = _center[1];
    if (shape_type === 'circle') {
      ctx.beginPath();
      ctx.arc(x * scale_factor, y * scale_factor, 5 * scale_factor / 2, 0, 2 * Math.PI); // 半径为5，放大4倍
      ctx.fillStyle = 'blue';
      ctx.fill();
    } else if (shape_type === 'rectangle') {
      ctx.fillStyle = 'green';
      ctx.fillRect(x * scale_factor - 5 * scale_factor / 2, y * scale_factor - 5 * scale_factor / 2, 10 * scale_factor / 2, 10 * scale_factor / 2); // 10x10 的矩形，放大4倍
    } else if (shape_type === 'polygon') {
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.moveTo(x * scale_factor + 5 * scale_factor / 2, y * scale_factor);
      ctx.lineTo(x * scale_factor + 2.5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
      ctx.lineTo(x * scale_factor - 2.5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
      ctx.lineTo(x * scale_factor - 5 * scale_factor / 2, y * scale_factor);
      ctx.lineTo(x * scale_factor - 2.5 * scale_factor / 2, y * scale_factor - 5 * scale_factor / 2);
      ctx.lineTo(x * scale_factor + 2.5 * scale_factor / 2, y * scale_factor - 5 * scale_factor / 2);
      ctx.closePath();
      ctx.fill();
    } else if (shape_type === 'triangle') {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(x * scale_factor, y * scale_factor - 5 * scale_factor / 2);
      ctx.lineTo(x * scale_factor - 5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
      ctx.lineTo(x * scale_factor + 5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
      ctx.closePath();
      ctx.fill();
    }
  });
}

// 处理机器人连接和断开连接
function fetchWithTimeout(url, options) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;
  return Promise.race([fetch(url, options), new Promise(function (_, reject) {
    return setTimeout(function () {
      return reject(new Error('请求超时'));
    }, timeout);
  })]);
}

// 在机器人连接成功后显示程序输入框
document.getElementById('robot_connect_button').addEventListener('click', function () {
  var robotIp = document.getElementById('robot_ip').value;
  var connectButton = document.getElementById('robot_connect_button');
  var isConnected = connectButton.textContent === t('disconnect') || connectButton.textContent === '断开连接';
  if (isConnected) {
    // 如果当前是"断开连接"状态，则发送断开连接请求
    fetchWithTimeout('/disconnect_robot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, 5000) // 设置超时时间为 5 秒
    .then(function (response) {
      if (!response.ok) {
        return response.json().then(function (err) {
          throw new Error(err.error || '断开连接失败');
        });
      }
      return response.json();
    }).then(function (data) {
      // 更新按钮状态和显示
      connectButton.setAttribute('data-i18n', 'connect');
      connectButton.textContent = t('connect');
      document.getElementById('robot_status').style.display = 'none';
      document.getElementById('program_input').style.display = 'none'; // 隐藏程序输入框
      document.getElementById('p_data_table_container').style.display = 'none'; // 隐藏P点数据表格
      console.log('机器人已断开连接');

      // 确保按钮文本正确显示
      if (window.applyLanguage && window.getCurrentLanguage) {
        setTimeout(function () {
          window.applyLanguage(window.getCurrentLanguage());
        }, 10);
      }
    }).catch(function (error) {
      console.error('断开连接失败:', error.message);
      alertError(t('error_disconnect_failed') + error.message);
    });
  } else {
    // 如果当前是"连接"状态，则发送连接请求
    if (!robotIp) {
      alertError('请输入机器人IP地址');
      return;
    }
    fetchWithTimeout('/connect_robot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        robot_ip: robotIp
      })
    }, 5000) // 设置超时时间为 5 秒
    .then(function (response) {
      if (!response.ok) {
        // 连接失败时，重置按钮状态
        connectButton.textContent = t('connect');
        return response.json().then(function (err) {
          throw new Error(err.error || '连接失败');
        });
      }
      return response.json();
    }).then(function (data) {
      // 更新按钮状态和显示
      connectButton.setAttribute('data-i18n', 'disconnect');
      connectButton.textContent = t('disconnect');
      var robotStatus = document.getElementById('robot_status');
      var robotIpDisplay = document.getElementById('robot_ip_display');
      var robotModel = document.getElementById('robot_model');
      var controllerVersion = document.getElementById('controller_version');
      robotIpDisplay.textContent = robotIp;
      robotModel.textContent = data.model_info;
      controllerVersion.textContent = data.controller_version; // 显示控制柜版本
      robotStatus.style.display = 'block';
      document.getElementById('program_input').style.display = 'block'; // 显示程序输入框

      console.log('机器人连接成功');

      // 确保按钮文本正确显示
      if (window.applyLanguage && window.getCurrentLanguage) {
        setTimeout(function () {
          window.applyLanguage(window.getCurrentLanguage());
        }, 10);
      }
    }).catch(function (error) {
      console.error('连接失败:', error.message);
      // 连接失败时，先重置按钮状态
      connectButton.setAttribute('data-i18n', 'connect');
      connectButton.textContent = t('connect');

      // 确保按钮文本正确显示
      if (window.applyLanguage && window.getCurrentLanguage) {
        setTimeout(function () {
          window.applyLanguage(window.getCurrentLanguage());
        }, 10);
      }

      // 然后根据错误类型显示不同的提示
      if (error.message === '请求超时' || error.message.includes('timeout')) {
        alertError(t('error_timeout'));
      } else {
        alertError(t('error_connect_failed') + error.message);
      }
    });
  }
});

// 处理读取P点数据的按钮点击事件
document.getElementById('read_p_data_button').addEventListener('click', function () {
  var programName = document.getElementById('program_name').value || 'PUT';
  // 如果用户没有输入，则使用默认值 'PUT'

  if (!programName) {
    alertError('请输入程序名称');
    return;
  }

  // 发送请求到后端获取P点数据
  fetch('/get_p_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      program_name: programName
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '获取P点数据失败');
      });
    }
    return response.json();
  }).then(function (data) {
    // 显示P点数据表格
    var tableContainer = document.getElementById('p_data_table_container');
    var tableBody = document.querySelector('#p_data_table tbody');
    tableBody.innerHTML = ''; // 清空之前的表格数据

    // 存储原始数据以便语言切换时使用
    tableBody._pDataTableData = data.poses;

    // 填充表格数据
    data.poses.forEach(function (pose, index) {
      var row = document.createElement('tr');

      // 序号
      var cell1 = document.createElement('td');
      cell1.textContent = index + 1;
      cell1.style.border = '1px solid #ddd';
      cell1.style.padding = '8px';
      row.appendChild(cell1);

      // X坐标
      var cell2 = document.createElement('td');
      cell2.textContent = pose.poseData.cartData.baseCart.position.x.toFixed(2);
      cell2.style.border = '1px solid #ddd';
      cell2.style.padding = '8px';
      row.appendChild(cell2);

      // Y坐标
      var cell3 = document.createElement('td');
      cell3.textContent = pose.poseData.cartData.baseCart.position.y.toFixed(2);
      cell3.style.border = '1px solid #ddd';
      cell3.style.padding = '8px';
      row.appendChild(cell3);

      // Z坐标
      var cell4 = document.createElement('td');
      cell4.textContent = pose.poseData.cartData.baseCart.position.z.toFixed(2);
      cell4.style.border = '1px solid #ddd';
      cell4.style.padding = '8px';
      row.appendChild(cell4);

      // C坐标
      var cell5 = document.createElement('td');
      cell5.textContent = pose.poseData.cartData.baseCart.position.c.toFixed(2);
      cell5.style.border = '1px solid #ddd';
      cell5.style.padding = '8px';
      row.appendChild(cell5);

      // UF值
      var cell6 = document.createElement('td');
      cell6.textContent = pose.poseData.cartData.uf; // 直接显示UF值
      cell6.style.border = '1px solid #ddd';
      cell6.style.padding = '8px';
      row.appendChild(cell6);

      // TF值
      var cell7 = document.createElement('td');
      cell7.textContent = pose.poseData.cartData.tf; // 直接显示TF值
      cell7.style.border = '1px solid #ddd';
      cell7.style.padding = '8px';
      row.appendChild(cell7);

      // 坐标系方向值
      var cell8 = document.createElement('td');
      var leftRightValue = pose.poseData.cartData.baseCart.posture.arm_left_right;
      // 存储原始值到data属性，方便语言切换时更新
      cell8.setAttribute('data-left-right-value', leftRightValue);

      // 获取当前语言并使用对应的翻译
      // 注意：arm_left_right 的值为 1 表示右手坐标系，0 或其他值表示左手坐标系
      var currentLang = getCurrentLanguage();
      var leftRightText;
      if (leftRightValue === 1) {
        // 右手坐标系
        if (currentLang === 'zh') {
          leftRightText = '右手坐标系';
        } else if (currentLang === 'en') {
          leftRightText = 'Right-Handed';
        } else if (currentLang === 'vi') {
          leftRightText = 'Hệ Tọa Độ Tay Phải';
        } else if (currentLang === 'ko') {
          leftRightText = '오른손 좌표계';
        } else {
          leftRightText = '右手坐标系'; // 默认中文
        }
      } else {
        // 左手坐标系
        if (currentLang === 'zh') {
          leftRightText = '左手坐标系';
        } else if (currentLang === 'en') {
          leftRightText = 'Left-Handed';
        } else if (currentLang === 'vi') {
          leftRightText = 'Hệ Tọa Độ Tay Trái';
        } else if (currentLang === 'ko') {
          leftRightText = '왼손 좌표계';
        } else {
          leftRightText = '左手坐标系'; // 默认中文
        }
      }
      cell8.textContent = leftRightText;
      cell8.style.border = '1px solid #ddd';
      cell8.style.padding = '8px';
      row.appendChild(cell8);
      tableBody.appendChild(row);
    });

    // 显示表格
    tableContainer.style.display = 'block';
  }).catch(function (error) {
    console.error('获取P点数据失败:', error.message);
    alertError('获取P点数据失败: ' + error.message);
  });
});

// 处理写入P点数据的按钮点击事件
document.getElementById('write_p_data_button').addEventListener('click', function () {
  var programName = document.getElementById('write_program_name').value || 'PUT'; // 如果用户没有输入，则使用默认值 'PUT'
  var startPPoint = parseInt(document.getElementById('start_p_point').value, 10);
  var prRegisterId = parseInt(document.getElementById('pr_register_id').value, 10); // 将PR寄存器ID转换为整数
  var ufValue = parseInt(document.getElementById('uf_value').value, 10); // 将UF值转换为整数
  var toolCount = parseInt(document.getElementById('tool_count').value, 10); // 获取工具数量
  var left_right = parseInt(document.getElementById('left_right').value, 10); // 获取工具数量

  if (!programName) {
    alertError('请输入程序名称');
    return;
  }
  if (isNaN(prRegisterId)) {
    // 检查PR寄存器ID是否为有效数字
    alertError('请输入有效的PR寄存器ID');
    return;
  }
  if (isNaN(startPPoint) || startPPoint < 1) {
    alertError(t('error_invalid_start_p_point'));
    return;
  }

  // 获取数据清单表格中的数据
  var tableBody = document.querySelector('#data-list-content table tbody');
  var rows = tableBody.querySelectorAll('tr');
  if (rows.length === 0) {
    alertError('没有可用的数据');
    return;
  }

  // 如果是自动写入模式，增加操作计数器
  if (isAutoWriting) {
    writeOperationCount++;
    console.log("\u589E\u52A0P\u70B9\u5199\u5165\u64CD\u4F5C\u8BA1\u6570\u5668\uFF0C\u5F53\u524D\u603B\u6570: ".concat(writeOperationCount));
  }

  // 准备要写入的P点数据
  var pData = [];
  rows.forEach(function (row, index) {
    var pId = startPPoint + index; // 以起始P点为基准连续写入
    var x = parseFloat(row.cells[3].textContent); // X坐标
    var xCompensation = parseFloat(row.cells[4].textContent); // X补偿
    var y = parseFloat(row.cells[5].textContent); // Y坐标
    var yCompensation = parseFloat(row.cells[6].textContent); // Y补偿
    var c = parseFloat(row.cells[7].textContent); // C坐标
    var cCompensation = parseFloat(row.cells[8].textContent); // C补偿

    // 将XYC与对应的补偿值相加
    var finalX = x + xCompensation;
    var finalY = y + yCompensation;
    var finalC = c + cCompensation;
    pData.push({
      id: pId,
      x: finalX,
      y: finalY,
      z: 0,
      // 暂时设置为0，稍后从PR寄存器中读取Z值并更新
      c: finalC,
      uf: ufValue,
      tf: index % toolCount + 1,
      // 根据工具数量循环设置TF值
      left_right: left_right
    });
  });

  // 发送请求到后端读取PR寄存器的Z和C值
  fetch('/read_pr_register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pr_register_id: prRegisterId // 传递整数类型的PR寄存器ID
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '读取PR寄存器失败');
      });
    }
    return response.json();
  }).then(function (data) {
    var zValue = data.z; // 获取PR寄存器的Z值

    // 更新pData中的Z值
    pData.forEach(function (p) {
      p.z = zValue;
    });

    // 发送请求到后端写入P点数据
    return fetch('/write_p_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        program_name: programName,
        p_data: pData
      })
    });
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '写入P点数据失败');
      });
    }
    return response.json();
  }).then(function (data) {
    console.log('P点数据写入成功');
    alertSuccess('P点数据写入成功');

    // 如果有自动写入的回调函数，调用它
    if (window.onWriteOperationComplete) {
      window.onWriteOperationComplete(true, 'P点数据写入成功', 'P点写入');
    }
  }).catch(function (error) {
    console.error('写入P点数据失败:', error.message);
    alertError('写入P点数据失败: ' + error.message);

    // 如果有自动写入的回调函数，调用它
    if (window.onWriteOperationComplete) {
      window.onWriteOperationComplete(false, '写入P点数据失败: ' + error.message, 'P点写入');
    }
  });
});

// 在"写入P点"按钮点击事件中，新增R逻辑
document.getElementById('write_p_data_button').addEventListener('click', function () {
  // 如果是自动写入模式，增加操作计数器
  if (isAutoWriting) {
    writeOperationCount++;
    console.log("\u589E\u52A0R\u5BC4\u5B58\u5668\u5199\u5165\u64CD\u4F5C\u8BA1\u6570\u5668\uFF0C\u5F53\u524D\u603B\u6570: ".concat(writeOperationCount));
  }

  // 检查当前配方类型
  var currentRecipeType = window.currentRecipeType || 'smart'; // 默认为智能规划

  if (currentRecipeType === 'manual') {
    // 手动规划配方：只写入三个基本参数
    var tableBody = document.querySelector('#data-list-content table tbody');
    var _rows = tableBody.querySelectorAll('tr');
    var totalPoints = _rows.length; // 点位总数

    // 从手动规划信息中获取行数和列数
    var rowCount = 0;
    var colCount = 0;
    var calculationMethod = 'row_priority';

    // 尝试从手动规划输入框获取行数和列数
    var rowCountInput = document.getElementById('row_count');
    var colCountInput = document.getElementById('col_count');
    var calculationMethodInput = document.getElementById('calculation_method');
    if (rowCountInput && colCountInput) {
      rowCount = parseInt(rowCountInput.value) || 0; // 行数
      colCount = parseInt(colCountInput.value) || 0; // 列数
    }
    if (calculationMethodInput) {
      calculationMethod = calculationMethodInput.value || 'row_priority';
    }

    // 获取工具数量（从机器人设置页面）
    var _toolCount = document.getElementById('tool_count').value || 1;

    // 计算单行列数量
    // 行优先：单行列数量 = 列数
    // 列优先：单行列数量 = 行数
    var singleRowOrColCount = calculationMethod === 'row_priority' ? colCount : rowCount;

    // 发送请求到后端写入R寄存器（手动规划模式）
    fetch('/write_r_registers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipe_type: 'manual',
        total_points: totalPoints,
        // R4寄存器：点位总数
        row_count: rowCount,
        // R11寄存器：行数
        col_count: colCount,
        // R12寄存器：列数
        tool_count: _toolCount,
        // R5寄存器：工具数量
        single_row_or_col_count: singleRowOrColCount // R10寄存器：单行列数量
      })
    }).then(function (response) {
      if (!response.ok) {
        return response.json().then(function (err) {
          throw new Error(err.error || '写入R寄存器失败');
        });
      }
      return response.json();
    }).then(function (data) {
      console.log('手动规划R寄存器写入成功');
      alertSuccess('手动规划R寄存器写入成功');

      // 如果有自动写入的回调函数，调用它
      if (window.onWriteOperationComplete) {
        window.onWriteOperationComplete(true, '手动规划R寄存器写入成功', 'R寄存器写入');
      }
    }).catch(function (error) {
      console.error('手动规划R寄存器写入失败:', error.message);
      alertError('手动规划R寄存器写入失败: ' + error.message);

      // 如果有自动写入的回调函数，调用它
      if (window.onWriteOperationComplete) {
        window.onWriteOperationComplete(false, '手动规划R寄存器写入失败: ' + error.message, 'R寄存器写入');
      }
    });
    return; // 手动规划配方处理完毕，直接返回
  }

  // 智能规划配方：写入所有参数
  var frame_length = document.getElementById('frame_length').value;
  var frame_width = document.getElementById('frame_width').value;
  var frameDepth = document.getElementById('frame_depth').value;
  var shapeHeight = document.getElementById('shape_height').value;
  var materialThickness = document.getElementById('material_thickness').value;
  var placementLayers = document.getElementById('placement_layers').value;
  var shapeCountValue = document.getElementById('shape-count-value').textContent;
  var toolCount = document.getElementById('tool_count').value;
  var drop_Count = document.getElementById('drop_Count').value;
  var shapesPerRowOrColValue = document.getElementById('shapes-per-row-or-col-value').textContent;

  // 检查填充数量和工具数量是否有效
  if (!shapeCountValue || !toolCount) {
    alertError('请先进行计算并确保工具数量已选择');
    return;
  }

  // 发送请求到后端写入R寄存器（智能规划模式）
  fetch('/write_r_registers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipe_type: 'smart',
      frame_length: frame_length,
      frame_width: frame_width,
      frame_depth: frameDepth,
      shape_height: shapeHeight,
      material_thickness: materialThickness,
      placement_layers: placementLayers,
      total_shapes: shapeCountValue,
      // 填充数量
      tool_count: toolCount,
      // 工具数量
      drop_Count: drop_Count,
      numofsingle_row_or_col_value: shapesPerRowOrColValue,
      rows: rows,
      // 行数
      cols: cols // 列数
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '写入R寄存器失败');
      });
    }
    return response.json();
  }).then(function (data) {
    console.log('智能规划R寄存器写入成功');
    alertSuccess('智能规划R寄存器写入成功');

    // 如果有自动写入的回调函数，调用它
    if (window.onWriteOperationComplete) {
      window.onWriteOperationComplete(true, '智能规划R寄存器写入成功', 'R寄存器写入');
    }
  }).catch(function (error) {
    console.error('智能规划R寄存器写入失败:', error.message);
    alertError('智能规划R寄存器写入失败: ' + error.message);

    // 如果有自动写入的回调函数，调用它
    if (window.onWriteOperationComplete) {
      window.onWriteOperationComplete(false, '智能规划R寄存器写入失败: ' + error.message, 'R寄存器写入');
    }
  });
});

// 在"写入P点"按钮点击事件中，新增tf逻辑
document.getElementById('write_p_data_button').addEventListener('click', function () {
  var toolCount = parseInt(document.getElementById('tool_count').value, 10); // 获取工具数量
  var toolSpacing = parseFloat(document.getElementById('tool_spacing').value); // 获取工具间距
  var autoTF = parseInt(document.getElementById('auto_tf').value, 10); // 获取自动TF功能开关状态
  var toolLayout = document.getElementById('tool_layout').value; // 获取工具布局选项
  var toolDirection = document.getElementById('tool_direction').value;

  // 如果是自动写入模式且自动TF功能开启，增加操作计数器
  if (isAutoWriting && autoTF === 1) {
    writeOperationCount++;
    console.log("\u589E\u52A0TF\u5199\u5165\u64CD\u4F5C\u8BA1\u6570\u5668\uFF0C\u5F53\u524D\u603B\u6570: ".concat(writeOperationCount));
  }
  if (isNaN(toolSpacing)) {
    // 检查工具间距是否为有效数字
    alertError('请输入有效的工具间距');
    return;
  }

  // 如果工具数量为 1，直接返回，不需要修改 TF
  if (toolCount === 1) {
    return;
  }

  // 如果自动TF功能关闭，直接返回，不调整TF
  if (autoTF === 0) {
    return;
  }

  // 发送请求到后端读取TF1的值
  fetch('/get_tf_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tf_id: 1 // 读取TF1的值
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '读取TF1数据失败');
      });
    }
    return response.json();
  }).then(function (data) {
    var tf1 = data.tf; // 获取TF1的值

    // 复制TF1的值给其他TF，并根据工具布局和方向调整坐标值
    var tfUpdates = [];
    if (toolLayout === 'double') {
      // 双向布局时，工具数量只能为2
      if (toolCount !== 2) {
        alertError('双向布局时，工具数量必须为2');
        return;
      }

      // 计算TF1和TF2的偏移值
      var offset = toolSpacing / 2;

      // TF1的偏移值为正
      var tf1Update = {
        coordinate_info: {
          coordinate_id: 1,
          name: tf1.coordinate_info.name,
          group_id: tf1.coordinate_info.group_id
        },
        position: {
          x: toolDirection === 'x' ? offset : tf1.position.x,
          y: toolDirection === 'y' ? offset : tf1.position.y,
          z: tf1.position.z
        },
        orientation: {
          r: tf1.orientation.r,
          p: tf1.orientation.p,
          y: tf1.orientation.y
        }
      };
      tfUpdates.push(tf1Update);

      // TF2的偏移值为负
      var tf2Update = {
        coordinate_info: {
          coordinate_id: 2,
          name: tf1.coordinate_info.name,
          group_id: tf1.coordinate_info.group_id
        },
        position: {
          x: toolDirection === 'x' ? -offset : tf1.position.x,
          y: toolDirection === 'y' ? -offset : tf1.position.y,
          z: tf1.position.z
        },
        orientation: {
          r: tf1.orientation.r,
          p: tf1.orientation.p,
          y: tf1.orientation.y
        }
      };
      tfUpdates.push(tf2Update);
    } else {
      // 单侧布局时，根据工具方向调整坐标值
      for (var i = 2; i <= toolCount; i++) {
        var newTf = {
          coordinate_info: {
            coordinate_id: i,
            name: tf1.coordinate_info.name,
            group_id: tf1.coordinate_info.group_id
          },
          position: {
            x: toolDirection === 'x' ? tf1.position.x + (i - 1) * toolSpacing : tf1.position.x,
            y: toolDirection === 'y' ? tf1.position.y + (i - 1) * toolSpacing : tf1.position.y,
            z: tf1.position.z
          },
          orientation: {
            r: tf1.orientation.r,
            p: tf1.orientation.p,
            y: tf1.orientation.y
          }
        };
        tfUpdates.push(newTf);
      }
    }

    // 调试输出，检查 tfUpdates 的内容
    console.log('tfUpdates:', tfUpdates);

    // 发送请求到后端更新TF
    return fetch('/update_tf_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tf_updates: tfUpdates
      })
    });
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '更新TF数据失败');
      });
    }
    return response.json();
  }).then(function (data) {
    console.log('TF数据更新成功');
    alertSuccess('TF数据更新成功');

    // 如果有自动写入的回调函数且自动TF功能开启，调用它
    if (window.onWriteOperationComplete && autoTF === 1) {
      window.onWriteOperationComplete(true, 'TF数据更新成功', 'TF写入');
    }
  }).catch(function (error) {
    console.error('更新TF数据失败:', error.message);
    alertError('更新TF数据失败: ' + error.message);

    // 如果有自动写入的回调函数且自动TF功能开启，调用它
    if (window.onWriteOperationComplete && autoTF === 1) {
      window.onWriteOperationComplete(false, '更新TF数据失败: ' + error.message, 'TF写入');
    }
  });
});

// 新的手动规划功能
// 读取参考点按钮事件
document.getElementById('read_reference_points').addEventListener('click', function () {
  var rowCount = parseInt(document.getElementById('row_count').value, 10);
  var colCount = parseInt(document.getElementById('col_count').value, 10);
  var pr1Id = parseInt(document.getElementById('manual_pr1_id').value, 10);
  var pr2Id = parseInt(document.getElementById('manual_pr2_id').value, 10);
  var pr3Id = parseInt(document.getElementById('manual_pr3_id').value, 10);
  if (isNaN(rowCount) || isNaN(colCount) || rowCount < 1 || colCount < 1) {
    alertError('请输入有效的行数和列数（必须大于0）');
    return;
  }
  if ([pr1Id, pr2Id, pr3Id].some(function (id) {
    return isNaN(id) || id < 1;
  })) {
    alertError(t('error_invalid_manual_pr_id'));
    return;
  }

  // 显示计算状态
  document.getElementById('calculation-status').style.display = 'block';
  document.getElementById('status-text').textContent = '正在读取参考点...';

  // 根据输入的PR ID读取参考点
  Promise.all([readPRRegister(pr1Id), readPRRegister(pr2Id), readPRRegister(pr3Id)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
      pr1 = _ref2[0],
      pr2 = _ref2[1],
      pr3 = _ref2[2];
    // 显示参考点坐标
    document.getElementById('pr1-x').textContent = pr1.x.toFixed(2);
    document.getElementById('pr1-y').textContent = pr1.y.toFixed(2);
    document.getElementById('pr1-z').textContent = pr1.z.toFixed(2);
    document.getElementById('pr2-x').textContent = pr2.x.toFixed(2);
    document.getElementById('pr2-y').textContent = pr2.y.toFixed(2);
    document.getElementById('pr2-z').textContent = pr2.z.toFixed(2);
    document.getElementById('pr3-x').textContent = pr3.x.toFixed(2);
    document.getElementById('pr3-y').textContent = pr3.y.toFixed(2);
    document.getElementById('pr3-z').textContent = pr3.z.toFixed(2);

    // 显示参考点表格和计算按钮
    document.querySelector('.reference-points-section').style.display = 'block';
    document.getElementById('calculate_points').disabled = false;

    // 隐藏计算状态
    document.getElementById('calculation-status').style.display = 'none';

    // 存储参考点数据和PR ID供后续计算使用（行列数在计算时实时读取）
    window.referencePoints = {
      pr1: pr1,
      pr2: pr2,
      pr3: pr3,
      pr1Id: pr1Id,
      pr2Id: pr2Id,
      pr3Id: pr3Id
    };

    // alertSuccess('参考点读取成功！'); // 已禁用成功提示弹窗
  }).catch(function (error) {
    console.error('读取参考点失败:', error);
    alertError('读取参考点失败: ' + error.message);
    document.getElementById('calculation-status').style.display = 'none';
  });
});

// 计算所有点位按钮事件
document.getElementById('calculate_points').addEventListener('click', function () {
  if (!window.referencePoints) {
    alertError('请先读取参考点');
    return;
  }

  // 重新读取当前输入框中的行数和列数
  var currentRowCount = parseInt(document.getElementById('row_count').value, 10);
  var currentColCount = parseInt(document.getElementById('col_count').value, 10);

  // 验证输入值
  if (!currentRowCount || !currentColCount || currentRowCount < 1 || currentColCount < 1) {
    alertError('请输入有效的行数和列数');
    return;
  }

  // 清除智能规划界面的所有参数和图片，防止保存时误判为智能规划配方
  clearSmartPlanningInterface();

  // 设置当前配方类型为手动规划
  window.currentRecipeType = 'manual';
  var _window$referencePoin = window.referencePoints,
    pr1 = _window$referencePoin.pr1,
    pr2 = _window$referencePoin.pr2,
    pr3 = _window$referencePoin.pr3;

  // 显示计算状态
  document.getElementById('calculation-status').style.display = 'block';
  document.getElementById('status-text').textContent = '正在计算所有点位...';

  // 获取计算方式选择
  var calculationMethod = document.getElementById('calculation_method').value;

  // 计算所有点的坐标（使用当前输入框中的最新值）
  var allPoints = calculateAllPoints(pr1, pr2, pr3, currentRowCount, currentColCount, calculationMethod);

  // 读取Z&C参考寄存器对应的PR寄存器的C值
  var prRegisterId = parseInt(document.getElementById('pr_register_id').value, 10);
  readPRRegister(prRegisterId).then(function (prData) {
    var cValue = prData.c;

    // 将计算结果填入数据清单表格
    fillDataListTable(allPoints, cValue);

    // 隐藏计算状态
    document.getElementById('calculation-status').style.display = 'none';

    // 切换到数据清单页面
    showSection('data-list-content');
    setActiveButton('data-list-btn');
    alertSuccess("\u8BA1\u7B97\u5B8C\u6210\uFF01\u5171\u751F\u6210 ".concat(allPoints.length, " \u4E2A\u70B9\u4F4D"));
  }).catch(function (error) {
    console.error('读取C值失败:', error);
    alertError('读取C值失败: ' + error.message);
    document.getElementById('calculation-status').style.display = 'none';
  });
});

// 读取PR寄存器的函数
function readPRRegister(prId) {
  return fetch('/read_pr_register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pr_id: prId
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '读取PR寄存器失败');
      });
    }
    return response.json();
  }).then(function (data) {
    return {
      x: data.x,
      y: data.y,
      z: data.z,
      c: data.c
    };
  });
}

// 计算所有点位的函数
// rowCount代表行数（Y方向），colCount代表列数（X方向）
function calculateAllPoints(pr1, pr2, pr3, rowCount, colCount) {
  var calculationMethod = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'row_priority';
  var points = [];

  // 计算行间距和列间距
  // rowCount是行数，所以用rowSpacing计算Y方向间距
  // colCount是列数，所以用colSpacing计算X方向间距
  var rowSpacing = (pr2.y - pr1.y) / (rowCount - 1); // Y方向间距，使用行数
  var colSpacing = (pr3.x - pr1.x) / (colCount - 1); // X方向间距，使用列数

  // 根据计算方式生成不同顺序的点位
  if (calculationMethod === 'row_priority') {
    // 行优先：先按行遍历，再按列遍历
    for (var row = 1; row <= rowCount; row++) {
      // 行数使用rowCount
      for (var col = 1; col <= colCount; col++) {
        // 列数使用colCount
        var x = pr1.x + (col - 1) * colSpacing;
        var y = pr1.y + (row - 1) * rowSpacing;
        var z = pr1.z; // Z值保持与PR1相同

        points.push({
          row: row,
          col: col,
          x: x,
          y: y,
          z: z
        });
      }
    }
  } else if (calculationMethod === 'col_priority') {
    // 列优先：先按列遍历，再按行遍历
    for (var _col = 1; _col <= colCount; _col++) {
      // 列数使用colCount
      for (var _row = 1; _row <= rowCount; _row++) {
        // 行数使用rowCount
        var _x = pr1.x + (_col - 1) * colSpacing;
        var _y = pr1.y + (_row - 1) * rowSpacing;
        var _z = pr1.z; // Z值保持与PR1相同

        points.push({
          row: _row,
          col: _col,
          x: _x,
          y: _y,
          z: _z
        });
      }
    }
  }
  return points;
}

// 填充数据清单表格的函数
function fillDataListTable(points, cValue) {
  var tableBody = document.querySelector('#data-list-content table tbody');
  tableBody.innerHTML = ''; // 清空现有数据

  points.forEach(function (point, index) {
    var row = document.createElement('tr');

    // 行号
    var cell1 = document.createElement('td');
    cell1.textContent = point.row;
    cell1.style.border = '1px solid #ddd';
    cell1.style.padding = '8px';
    row.appendChild(cell1);

    // 列号
    var cell2 = document.createElement('td');
    cell2.textContent = point.col;
    cell2.style.border = '1px solid #ddd';
    cell2.style.padding = '8px';
    row.appendChild(cell2);

    // P_ID (点位编号)
    var cell3 = document.createElement('td');
    cell3.textContent = index + 1;
    cell3.style.border = '1px solid #ddd';
    cell3.style.padding = '8px';
    row.appendChild(cell3);

    // X值
    var cell4 = document.createElement('td');
    cell4.textContent = point.x.toFixed(2);
    cell4.style.border = '1px solid #ddd';
    cell4.style.padding = '8px';
    row.appendChild(cell4);

    // X补偿 (初始为0)
    var cell5 = document.createElement('td');
    cell5.textContent = '0.00';
    cell5.style.border = '1px solid #ddd';
    cell5.style.padding = '8px';
    row.appendChild(cell5);

    // Y值
    var cell6 = document.createElement('td');
    cell6.textContent = point.y.toFixed(2);
    cell6.style.border = '1px solid #ddd';
    cell6.style.padding = '8px';
    row.appendChild(cell6);

    // Y补偿 (初始为0)
    var cell7 = document.createElement('td');
    cell7.textContent = '0.00';
    cell7.style.border = '1px solid #ddd';
    cell7.style.padding = '8px';
    row.appendChild(cell7);

    // C值
    var cell8 = document.createElement('td');
    cell8.textContent = cValue.toFixed(2);
    cell8.style.border = '1px solid #ddd';
    cell8.style.padding = '8px';
    row.appendChild(cell8);

    // C补偿 (初始为0)
    var cell9 = document.createElement('td');
    cell9.textContent = '0.00';
    cell9.style.border = '1px solid #ddd';
    cell9.style.padding = '8px';
    row.appendChild(cell9);
    tableBody.appendChild(row);
  });
}

// 更新补偿值的事件处理
document.getElementById('update-compensation').addEventListener('click', function () {
  var compensationType = document.getElementById('compensation-type').value;
  var rowColNumber = parseInt(document.getElementById('row-col-number').value, 10);
  var compensationValue = parseFloat(document.getElementById('compensation-value').value);
  var angleCompensation = parseFloat(document.getElementById('angle-compensation').value);
  if (isNaN(rowColNumber) || isNaN(compensationValue) || isNaN(angleCompensation)) {
    alertError('请输入有效的行号/列号、补偿值和角度补偿值');
    return;
  }
  var tableBody = document.querySelector('#data-list-content table tbody');
  var rows = tableBody.querySelectorAll('tr');
  rows.forEach(function (row) {
    var rowNumber = parseInt(row.cells[0].textContent, 10);
    var colNumber = parseInt(row.cells[1].textContent, 10);
    if (compensationType === 'row' && rowNumber === rowColNumber || compensationType === 'col' && colNumber === rowColNumber) {
      // 更新Y补偿值（行补偿）或X补偿值（列补偿）
      if (compensationType === 'row') {
        row.cells[6].textContent = compensationValue.toFixed(2); // Y补偿
      } else {
        row.cells[4].textContent = compensationValue.toFixed(2); // X补偿
      }

      // 更新C补偿值
      row.cells[8].textContent = angleCompensation.toFixed(2); // C补偿
    }
  });
  alertSuccess('补偿值更新成功');
});
document.getElementById('save_recipe_button').addEventListener('click', function () {
  var recipeName = document.getElementById('recipe_name').value;
  var recipeId = document.getElementById('recipe_id').value; // 获取配方编号

  if (!recipeName || !recipeId) {
    alertError('请输入配方名和配方编号');
    return;
  }

  // 检查是否为手动规划配方（没有预览图片）
  var plotImg = document.getElementById('plot');
  var isManualPlanning = !plotImg || !plotImg.getAttribute('data-base64');
  if (isManualPlanning) {
    // 手动规划配方：检查是否有数据清单数据
    var table = document.querySelector('#data-list-content table');
    var _rows2 = table.getElementsByTagName('tr');
    if (_rows2.length <= 1) {
      // 只有表头，没有数据
      alertError('请先计算手动规划点位数据');
      return;
    }
    // 手动规划配方可以继续保存，不需要预览图片
  } else {
    // 智能规划配方：检查图片是否已经生成
    if (!plotImg || !plotImg.getAttribute('data-base64')) {
      alertError('请先生成规划结果图片');
      return;
    }
  }

  // 先检查是否存在重名的配方文件
  fetch('/check_recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipeName: recipeName,
      recipeId: recipeId // 将配方编号发送到后端
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '检查配方失败');
      });
    }
    return response.json();
  }).then(/*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
      var finalRecipeName, finalRecipeId, result, _result;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            finalRecipeName = recipeName;
            finalRecipeId = recipeId; // 处理配方名冲突
            if (!data.exists) {
              _context.next = 8;
              break;
            }
            _context.next = 5;
            return showNameConflictDialog(recipeName);
          case 5:
            result = _context.sent;
            if (!result.cancelled) {
              _context.next = 8;
              break;
            }
            return _context.abrupt("return");
          case 8:
            if (!data.id_exists) {
              _context.next = 15;
              break;
            }
            _context.next = 11;
            return showIdConflictDialog(data);
          case 11:
            _result = _context.sent;
            if (!_result.cancelled) {
              _context.next = 14;
              break;
            }
            return _context.abrupt("return");
          case 14:
            if (_result.useNewId) {
              finalRecipeId = _result.newId;
              // 更新界面上的配方ID显示
              document.getElementById('recipe_id').value = finalRecipeId;
            }
          case 15:
            // 继续保存配方的逻辑
            saveRecipeData(finalRecipeName, finalRecipeId);
          case 16:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }()).catch(function (error) {
    console.error('检查配方失败:', error.message);
    alertError('检查配方失败: ' + error.message);
  });
});
function saveRecipeData(recipeName, recipeId) {
  var _document$getElementB4, _document$getElementB5, _document$getElementB6, _document$getElementB7, _document$getElementB8, _document$getElementB9, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13, _document$getElementB14, _document$getElementB15, _document$getElementB16, _document$getElementB17, _document$getElementB18, _document$getElementB19, _document$getElementB20, _document$getElementB21, _document$getElementB22, _document$getElementB23, _document$getElementB24, _document$getElementB25, _document$getElementB26, _document$getElementB27, _document$getElementB28, _document$getElementB29, _document$getElementB30, _document$getElementB31, _document$getElementB32, _document$getElementB33, _document$getElementB34, _document$getElementB35, _document$getElementB36;
  // 获取数据清单表格中的数据
  var tableData = [];
  var table = document.querySelector('#data-list-content table');
  var rows = table.getElementsByTagName('tr');
  for (var i = 1; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName('td');
    tableData.push({
      rowNumber: cells[0].textContent,
      colNumber: cells[1].textContent,
      pId: cells[2].textContent,
      x: parseFloat(cells[3].textContent),
      xCompensation: parseFloat(cells[4].textContent),
      y: parseFloat(cells[5].textContent),
      yCompensation: parseFloat(cells[6].textContent),
      c: parseFloat(cells[7].textContent),
      cCompensation: parseFloat(cells[8].textContent)
    });
  }

  // 检查是否为手动规划配方（没有预览图片）
  var plotImg = document.getElementById('plot');
  var isManualPlanning = !plotImg || !plotImg.getAttribute('data-base64');
  if (isManualPlanning) {
    var _document$getElementB, _document$getElementB2, _document$getElementB3;
    // 手动规划配方：只保存基本数据和表格数据
    var _recipeData = {
      recipeName: recipeName,
      recipeId: recipeId,
      tableData: tableData,
      isManualPlanning: true,
      // 标记为手动规划配方
      // 手动规划配方的其他必要信息
      manualPlanningInfo: {
        rowCount: ((_document$getElementB = document.getElementById('row_count')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || 0,
        colCount: ((_document$getElementB2 = document.getElementById('col_count')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value) || 0,
        calculationMethod: ((_document$getElementB3 = document.getElementById('calculation_method')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || 'row_priority',
        referencePoints: window.referencePoints || {}
      }
    };

    // 发送请求到后端保存手动规划配方
    fetch('/save_recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_recipeData)
    }).then(function (response) {
      if (!response.ok) {
        return response.json().then(function (err) {
          throw new Error(err.error || '保存配方失败');
        });
      }
      return response.json();
    }).then(function (data) {
      console.log('手动规划配方保存成功');
      if (data.id_reassigned) {
        document.getElementById('recipe_id').value = data.new_id;
        alertSuccess(data.message);
      } else {
        alertSuccess('手动规划配方保存成功');
      }
    }).catch(function (error) {
      console.error('保存手动规划配方失败:', error.message);
      alertError('保存手动规划配方失败: ' + error.message);
    });
    return; // 提前返回，不执行智能规划配方的保存逻辑
  }

  // 智能规划配方：获取所有表单数据
  var frameLength = ((_document$getElementB4 = document.getElementById('frame_length')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || 0;
  var frameWidth = ((_document$getElementB5 = document.getElementById('frame_width')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || 0;
  var frameDepth = ((_document$getElementB6 = document.getElementById('frame_depth')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || 0;
  var shapeHeight = ((_document$getElementB7 = document.getElementById('shape_height')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) || 0;
  var materialThickness = ((_document$getElementB8 = document.getElementById('material_thickness')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || 0;
  var placementLayers = ((_document$getElementB9 = document.getElementById('placement_layers')) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.value) || 1;
  var toolCount = ((_document$getElementB10 = document.getElementById('tool_count')) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value) || 1;
  var toolSpacing = ((_document$getElementB11 = document.getElementById('tool_spacing')) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || 0;
  var toolLayout = ((_document$getElementB12 = document.getElementById('tool_layout')) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value) || 'single';
  var autoTF = ((_document$getElementB13 = document.getElementById('auto_tf')) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.value) || 1;
  var leftRight = ((_document$getElementB14 = document.getElementById('left_right')) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.value) || 1;

  // 获取智能规划界面的所有参数
  var shapeType = ((_document$getElementB15 = document.getElementById('shape_type')) === null || _document$getElementB15 === void 0 ? void 0 : _document$getElementB15.value) || 'circle';
  var shapeLength = ((_document$getElementB16 = document.getElementById('shape_length')) === null || _document$getElementB16 === void 0 ? void 0 : _document$getElementB16.value) || 0;
  var shapeWidth = ((_document$getElementB17 = document.getElementById('shape_width')) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.value) || 0;
  var dropCount = document.getElementById('drop_Count').value || 0;
  var horizontalSpacing = ((_document$getElementB18 = document.getElementById('horizontal_spacing')) === null || _document$getElementB18 === void 0 ? void 0 : _document$getElementB18.value) || 0;
  var verticalSpacing = ((_document$getElementB19 = document.getElementById('vertical_spacing')) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) || 0;
  var horizontalBorderDistance = ((_document$getElementB20 = document.getElementById('horizontal_border_distance')) === null || _document$getElementB20 === void 0 ? void 0 : _document$getElementB20.value) || 0;
  var verticalBorderDistance = ((_document$getElementB21 = document.getElementById('vertical_border_distance')) === null || _document$getElementB21 === void 0 ? void 0 : _document$getElementB21.value) || 0;
  var layoutType = ((_document$getElementB22 = document.getElementById('layout_type')) === null || _document$getElementB22 === void 0 ? void 0 : _document$getElementB22.value) || 'array';
  var placeType = ((_document$getElementB23 = document.getElementById('place_type')) === null || _document$getElementB23 === void 0 ? void 0 : _document$getElementB23.value) || 'row';
  var remainderTurn = ((_document$getElementB24 = document.getElementById('remainder_turn')) === null || _document$getElementB24 === void 0 ? void 0 : _document$getElementB24.value) || 'off';
  var polygonArrangement = ((_document$getElementB25 = document.getElementById('polygon_arrangement')) === null || _document$getElementB25 === void 0 ? void 0 : _document$getElementB25.value) || 'diagonal'; // 添加多边形排布方式参数

  // 获取预览结果图的Base64编码
  var plotImageBase64 = plotImg.getAttribute('data-base64'); // 使用存储的 Base64 数据
  console.log('Saving smart planning recipe with base64 data:', plotImageBase64.substring(0, 50) + '...');

  // 获取填充数量和单行/列数量
  var shapeCountValue = ((_document$getElementB26 = document.getElementById('shape-count-value')) === null || _document$getElementB26 === void 0 ? void 0 : _document$getElementB26.textContent) || 0;
  var shapesPerRowOrColValue = ((_document$getElementB27 = document.getElementById('shapes-per-row-or-col-value')) === null || _document$getElementB27 === void 0 ? void 0 : _document$getElementB27.textContent) || 0;

  // 将所有数据打包成一个对象
  var recipeData = {
    recipeName: recipeName,
    recipeId: recipeId,
    // 保存配方编号
    tableData: tableData,
    frameLength: frameLength,
    frameWidth: frameWidth,
    frameDepth: frameDepth,
    shapeHeight: shapeHeight,
    materialThickness: materialThickness,
    placementLayers: placementLayers,
    shapeType: shapeType,
    shapeLength: shapeLength,
    shapeWidth: shapeWidth,
    dropCount: dropCount,
    horizontalSpacing: horizontalSpacing,
    verticalSpacing: verticalSpacing,
    horizontalBorderDistance: horizontalBorderDistance,
    verticalBorderDistance: verticalBorderDistance,
    layoutType: layoutType,
    placeType: placeType,
    remainderTurn: remainderTurn,
    plotImageBase64: plotImageBase64,
    // 使用Base64编码的图片数据
    shapeCountValue: shapeCountValue,
    shapesPerRowOrColValue: shapesPerRowOrColValue,
    circleDiameter: ((_document$getElementB28 = document.getElementById('circle_diameter')) === null || _document$getElementB28 === void 0 ? void 0 : _document$getElementB28.value) || 0,
    rectangleLength: ((_document$getElementB29 = document.getElementById('rectangle_length')) === null || _document$getElementB29 === void 0 ? void 0 : _document$getElementB29.value) || 0,
    rectangleWidth: ((_document$getElementB30 = document.getElementById('rectangle_width')) === null || _document$getElementB30 === void 0 ? void 0 : _document$getElementB30.value) || 0,
    polygonSides: ((_document$getElementB31 = document.getElementById('polygon_sides')) === null || _document$getElementB31 === void 0 ? void 0 : _document$getElementB31.value) || 0,
    polygonSideLength: ((_document$getElementB32 = document.getElementById('polygon_side_length')) === null || _document$getElementB32 === void 0 ? void 0 : _document$getElementB32.value) || 0,
    polygonArrangement: polygonArrangement,
    // 添加多边形排布方式参数
    triangleType: ((_document$getElementB33 = document.getElementById('triangle_type')) === null || _document$getElementB33 === void 0 ? void 0 : _document$getElementB33.value) || 'equilateral',
    triangleSideLength: ((_document$getElementB34 = document.getElementById('triangle_side_length')) === null || _document$getElementB34 === void 0 ? void 0 : _document$getElementB34.value) || 0,
    triangleBaseLength: ((_document$getElementB35 = document.getElementById('triangle_base_length')) === null || _document$getElementB35 === void 0 ? void 0 : _document$getElementB35.value) || 0,
    triangleOrientation: ((_document$getElementB36 = document.getElementById('triangle_orientation')) === null || _document$getElementB36 === void 0 ? void 0 : _document$getElementB36.value) || 'up',
    isManualPlanning: false // 标记为智能规划配方
  };

  // 发送请求到后端保存配方
  fetch('/save_recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipeData)
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw new Error(err.error || '保存配方失败');
      });
    }
    return response.json();
  }).then(function (data) {
    console.log('配方保存成功');
    if (data.id_reassigned) {
      // 如果有ID重新分配，更新界面上的配方ID显示
      document.getElementById('recipe_id').value = data.new_id;
      alertSuccess(data.message);
    } else {
      alertSuccess('配方保存成功');
    }
  }).catch(function (error) {
    console.error('保存配方失败:', error.message);
    alertError('保存配方失败: ' + error.message);
  });
}

// 新增配方库按钮点击事件
document.getElementById('recipe-library-btn').addEventListener('click', function () {
  showSection('recipe-library-content');
  setActiveButton('recipe-library-btn');
  loadRecipeList(); // 加载配方列表
});

// 输入框内容变化时自动查找
document.getElementById('recipe-search').addEventListener('input', function () {
  var keyword = this.value;
  loadRecipeList(keyword); // 根据关键字加载配方列表
});

// 加载配方列表，支持关键字过滤
function loadRecipeList() {
  var keyword = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  fetch('/get_recipe_list').then(function (response) {
    return response.json();
  }).then(function (data) {
    var recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // 清空列表

    // 过滤配方列表
    var filteredRecipes = data.recipes.filter(function (recipe) {
      return recipe.recipeName.toLowerCase().includes(keyword.toLowerCase());
    });

    // 填充过滤后的配方列表
    filteredRecipes.forEach(function (recipe) {
      var li = document.createElement('li');

      // 创建勾选框（仅在插件环境中创建）
      var checkbox = null;
      checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'recipe-checkbox';
      checkbox.value = recipe.recipeId;
      checkbox.id = "recipe-".concat(recipe.recipeName);

      // 为每个配方复选框添加变更事件监听器
      checkbox.addEventListener('change', updateSelectAllState);

      // 创建 <span> 并设置配方编号和配方名
      var recipeIdSpan = document.createElement('span');
      recipeIdSpan.className = 'recipe-id'; // 添加类名
      recipeIdSpan.textContent = recipe.recipeId; // 设置配方编号

      var recipeNameSpan = document.createElement('span');
      recipeNameSpan.className = 'recipe-name'; // 添加类名

      // 获取配方详细信息来判断类型
      fetch('/get_recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipeName: recipe.recipeName
        })
      }).then(function (response) {
        return response.json();
      }).then(function (recipeData) {
        // 检查是否为手动规划配方
        if (recipeData.isManualPlanning === true) {
          var manualPlanningText = t('menu_manual_planning');
          // 确保翻译文本不是 undefined
          if (manualPlanningText && manualPlanningText !== 'menu_manual_planning' && manualPlanningText !== 'undefined') {
            recipeNameSpan.textContent = "".concat(recipe.recipeName, "(").concat(manualPlanningText, ")");
          } else {
            // 如果翻译失败，使用中文作为后备
            recipeNameSpan.textContent = "".concat(recipe.recipeName, "(\u624B\u52A8\u89C4\u5212)");
          }
        } else {
          recipeNameSpan.textContent = recipe.recipeName;
        }
      }).catch(function (error) {
        console.error('获取配方详细信息失败:', error);
        recipeNameSpan.textContent = recipe.recipeName; // 失败时显示原始名称
      });

      // 将勾选框和 <span> 添加到 <li> 中
      if (checkbox) {
        li.appendChild(checkbox);
      }
      li.appendChild(recipeIdSpan);
      li.appendChild(recipeNameSpan);

      // 添加读取按钮
      var readButton = document.createElement('button');
      readButton.className = 'recipe-read-btn';
      // 使用data-i18n属性确保语言切换时能正确更新
      readButton.setAttribute('data-i18n', 'read_recipe');
      // 直接使用t()函数获取翻译，如果翻译不存在则使用key作为默认值
      readButton.textContent = t('read_recipe');
      readButton.addEventListener('click', function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        loadRecipeToPlanning(recipe.recipeName);
      });

      // 添加删除按钮
      var deleteButton = document.createElement('button');
      deleteButton.className = 'recipe-delete-btn';
      // 使用data-i18n属性确保语言切换时能正确更新
      deleteButton.setAttribute('data-i18n', 'delete_recipe');
      // 直接使用t()函数获取翻译，如果翻译不存在则使用key作为默认值
      deleteButton.textContent = t('delete_recipe');
      deleteButton.addEventListener('click', function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        deleteRecipe(recipe.recipeName);
      });

      // 将按钮添加到 <li> 中
      li.appendChild(readButton);
      li.appendChild(deleteButton);

      // 将 <li> 添加到 <ul> 中
      recipeList.appendChild(li);

      // 绑定点击事件到 <li>，点击配方名时触发预览
      li.addEventListener('click', function (e) {
        // 如果点击的是勾选框，不触发预览（仅在插件环境中显示勾选框）
        if (isTP && e.target.type === 'checkbox') {
          return;
        }
        // 获取干净的配方名称（移除可能存在的括号内容）
        var recipeNameSpan = li.querySelector('.recipe-name');
        var fullText = recipeNameSpan ? recipeNameSpan.textContent : recipe.recipeName;
        var cleanRecipeName = fullText.split('(')[0].trim();
        previewRecipe(cleanRecipeName);
      });
    });

    // 确保按钮文本正确显示
    if (window.applyLanguage && window.getCurrentLanguage) {
      setTimeout(function () {
        window.applyLanguage(window.getCurrentLanguage());
      }, 10);
    }
  }).catch(function (error) {
    return console.error('加载配方列表失败:', error);
  });
}

// 将图形类型的英文转换为当前语言
function getShapeTypeText(shapeType) {
  switch (shapeType) {
    case 'circle':
      return t('workpiece_type_circle');
    case 'rectangle':
      return t('workpiece_type_rectangle');
    case 'polygon':
      return t('workpiece_type_polygon');
    case 'triangle':
      return t('workpiece_type_triangle');
    default:
      return shapeType;
  }
}

// 将三角形类型转换为当前语言
function getTriangleTypeText(triangleType) {
  switch (triangleType) {
    case 'equilateral':
      return t('triangle_type_equilateral');
    case 'isosceles':
      return t('triangle_type_isosceles');
    default:
      return triangleType;
  }
}

// 将三角形朝向转换为当前语言
function getTriangleOrientationText(orientation) {
  switch (orientation) {
    case 'up':
      return t('triangle_orientation_up');
    case 'down':
      return t('triangle_orientation_down');
    case 'left':
      return t('triangle_orientation_left');
    case 'right':
      return t('triangle_orientation_right');
    default:
      return orientation;
  }
}

// 动态显示或隐藏配方预览页面的几何尺寸输入框
function updatePreviewInputFields(shapeType) {
  // 隐藏所有图形输入框
  document.querySelectorAll('.shape-input-preview').forEach(function (div) {
    return div.style.display = 'none';
  });
  if (shapeType === 'circle') {
    document.getElementById('preview-circle-input').style.display = 'block';
  } else if (shapeType === 'rectangle') {
    document.getElementById('preview-rectangle-input').style.display = 'block';
  } else if (shapeType === 'polygon') {
    document.getElementById('preview-polygon-input').style.display = 'block';
  } else if (shapeType === 'triangle') {
    document.getElementById('preview-triangle-input').style.display = 'block';
    // 如果是等腰三角形，显示底边长输入框
    var triangleType = document.getElementById('triangle_type').value;
    if (triangleType === 'isosceles') {
      document.getElementById('preview-triangle-base-length').style.display = 'inline-block';
    } else {
      document.getElementById('preview-triangle-base-length').style.display = 'none';
    }
  }
}

// 预览配方
function previewRecipe(recipeName) {
  // 清理配方名称，移除可能存在的括号内容（如 "shou24(undefined)" -> "shou24"）
  var cleanRecipeName = recipeName.split('(')[0].trim();
  fetch('/get_recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipeName: cleanRecipeName
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    // 检查是否为手动规划配方
    var isManualPlanning = data.isManualPlanning === true;

    // 更新预览标题，显示配方名称和类型标识
    var previewTitle = document.querySelector('.recipe-preview h2');
    if (previewTitle) {
      var recipePreviewText = t('recipe_preview');
      var manualPlanningText = t('menu_manual_planning');
      // 确保翻译文本不是 undefined 或 key 本身
      var safeRecipePreviewText = recipePreviewText && recipePreviewText !== 'recipe_preview' && recipePreviewText !== 'undefined' ? recipePreviewText : '配方预览';
      var safeManualPlanningText = manualPlanningText && manualPlanningText !== 'menu_manual_planning' && manualPlanningText !== 'undefined' ? manualPlanningText : '手动规划';
      if (isManualPlanning) {
        previewTitle.textContent = "".concat(safeRecipePreviewText, " - ").concat(cleanRecipeName, "(").concat(safeManualPlanningText, ")");
      } else {
        previewTitle.textContent = "".concat(safeRecipePreviewText, " - ").concat(cleanRecipeName);
      }
    }

    // 如果是手动规划配方，显示简化的预览信息
    if (isManualPlanning) {
      showManualPlanningPreview(data);
      return;
    }

    // 智能规划配方：隐藏手动规划预览，显示智能规划预览
    var manualPreviewElement = document.querySelector('.manual-planning-preview');
    if (manualPreviewElement) {
      manualPreviewElement.style.display = 'none';
    }

    // 显示智能规划相关的元素
    var previewContainer = document.querySelector('.recipe-preview .preview-container');
    if (previewContainer) {
      var smartPlanningElements = previewContainer.querySelectorAll('.input-container, .preview-image-container');
      smartPlanningElements.forEach(function (element) {
        element.style.display = 'block';
      });
    }

    // 填充料框设置
    document.getElementById('preview-frame-length').textContent = data.frameLength;
    document.getElementById('preview-frame-width').textContent = data.frameWidth;
    document.getElementById('preview-frame-depth').textContent = data.frameDepth;

    // 填充工件设置
    var shapeTypeText = getShapeTypeText(data.shapeType); // 将图形类型转换为当前语言
    document.getElementById('preview-shape-type').textContent = shapeTypeText;

    // 根据工件类型显示对应的输入框
    updatePreviewInputFields(data.shapeType);

    // 填充工件参数
    if (data.shapeType === 'circle') {
      document.getElementById('preview-circle-diameter').textContent = data.circleDiameter || 'N/A';
    } else if (data.shapeType === 'rectangle') {
      document.getElementById('preview-rectangle-length').textContent = data.rectangleLength || 'N/A';
      document.getElementById('preview-rectangle-width').textContent = data.rectangleWidth || 'N/A';
    } else if (data.shapeType === 'polygon') {
      document.getElementById('preview-polygon-sides').textContent = data.polygonSides || 'N/A';
      document.getElementById('preview-polygon-side-length').textContent = data.polygonSideLength || 'N/A';
    } else if (data.shapeType === 'triangle') {
      var triangleTypeText = getTriangleTypeText(data.triangleType); // 转换为当前语言
      var triangleOrientationText = getTriangleOrientationText(data.triangleOrientation); // 转换为当前语言
      document.getElementById('preview-triangle-type').textContent = triangleTypeText || 'N/A';
      document.getElementById('preview-triangle-side-length').textContent = data.triangleSideLength || 'N/A';
      document.getElementById('preview-triangle-orientation').textContent = triangleOrientationText || 'N/A';
      // 如果是等腰三角形，显示底边长
      if (data.triangleType === 'isosceles') {
        document.getElementById('preview-triangle-base-length').textContent = data.triangleBaseLength || 'N/A';
        document.getElementById('preview-triangle-base-length-input').style.display = 'inline-block'; // 显示底边长输入框
      } else {
        document.getElementById('preview-triangle-base-length-input').style.display = 'none'; // 隐藏底边长输入框
      }
    }

    // 填充工件高度和下料数量
    document.getElementById('preview-shape-height').textContent = data.shapeHeight || 'N/A';
    document.getElementById('preview-drop-count').textContent = data.dropCount || 'N/A';

    // 填充摆放设置
    document.getElementById('preview-horizontal-spacing').textContent = data.horizontalSpacing;
    document.getElementById('preview-vertical-spacing').textContent = data.verticalSpacing;
    document.getElementById('preview-horizontal-border-distance').textContent = data.horizontalBorderDistance;
    document.getElementById('preview-vertical-border-distance').textContent = data.verticalBorderDistance;
    document.getElementById('preview-material-thickness').textContent = data.materialThickness;
    document.getElementById('preview-placement-layers').textContent = data.placementLayers;
    var layoutTypeText = data.layoutType === 'array' ? t('layout_type_array') : t('layout_type_honeycomb');
    var placeTypeText = data.placeType === 'row' ? t('place_type_row') : t('place_type_col');
    var remainderTurnText = data.remainderTurn === 'off' ? t('remainder_turn_off') : data.remainderTurn === 'left' ? t('remainder_turn_left') : t('remainder_turn_right');
    document.getElementById('preview-layout-type').textContent = layoutTypeText;
    document.getElementById('preview-place-type').textContent = placeTypeText;
    document.getElementById('preview-remainder-turn').textContent = remainderTurnText;

    // 显示预览图片
    var plotImg = document.getElementById('preview-plot');
    plotImg.src = data.plotImageBase64;
    plotImg.setAttribute('data-base64', data.plotImageBase64); // 添加这行，设置data-base64属性
    plotImg.style.display = 'block';
  }).catch(function (error) {
    return console.error('加载配方失败:', error);
  });
}

// 显示手动规划配方预览（全局函数，供语言切换时调用）
window.showManualPlanningPreview = function (data) {
  // 隐藏智能规划相关的预览元素
  var previewContainer = document.querySelector('.recipe-preview .preview-container');
  if (previewContainer) {
    // 隐藏智能规划相关的元素
    var smartPlanningElements = previewContainer.querySelectorAll('.input-container, .preview-image-container');
    smartPlanningElements.forEach(function (element) {
      element.style.display = 'none';
    });

    // 检查是否已存在手动规划预览元素，如果不存在则创建
    var manualPreviewElement = previewContainer.querySelector('.manual-planning-preview');
    if (!manualPreviewElement) {
      manualPreviewElement = document.createElement('div');
      manualPreviewElement.className = 'manual-planning-preview';
      previewContainer.appendChild(manualPreviewElement);
    }

    // 存储数据以便语言切换时使用
    manualPreviewElement._recipeData = data;

    // 更新手动规划预览内容（使用翻译函数）
    // 获取所有翻译文本，确保不是undefined
    var manualPlanningRecipeInfoText = t('manual_planning_recipe_info');
    var recipeNameText = t('recipe_name');
    var recipeIdText = t('recipe_id');
    var pointTotalCountText = t('point_total_count');
    var rowCountText = t('row_count');
    var colCountText = t('col_count');
    var calculationMethodText = t('calculation_method');
    var calculationMethodRowText = t('calculation_method_row');
    var calculationMethodColText = t('calculation_method_col');

    // 确保所有翻译文本都不是undefined，如果是则使用中文作为后备
    // 检查翻译是否成功（不是key本身，不是undefined，不是null）
    // 如果翻译返回的是key本身，说明翻译不存在，使用后备文本
    var isTranslationValid = function isTranslationValid(text, key) {
      return text && text !== key && text !== 'undefined' && text !== 'null' && typeof text === 'string' && text.length > 0;
    };
    var currentLang = getCurrentLanguage();
    var getFallbackText = function getFallbackText(key, zhText, enText, viText) {
      var koText = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : enText;
      if (currentLang === 'ko') return koText;
      if (currentLang === 'vi') return viText;
      if (currentLang === 'en') return enText;
      return zhText;
    };
    var safeManualPlanningRecipeInfo = isTranslationValid(manualPlanningRecipeInfoText, 'manual_planning_recipe_info') ? manualPlanningRecipeInfoText : getFallbackText('manual_planning_recipe_info', '手动规划配方信息', 'Manual Planning Recipe Info', 'Thông Tin Công Thức Lập Kế Hoạch Thủ Công', '수동 계획 레시피 정보');
    var safeRecipeName = isTranslationValid(recipeNameText, 'recipe_name') ? recipeNameText : getFallbackText('recipe_name', '配方名:', 'Recipe Name:', 'Tên Công Thức:', '레시피 이름:');
    var safeRecipeId = isTranslationValid(recipeIdText, 'recipe_id') ? recipeIdText : getFallbackText('recipe_id', '配方编号:', 'Recipe ID:', 'ID Công Thức:', '레시피 ID:');
    var safePointTotalCount = isTranslationValid(pointTotalCountText, 'point_total_count') ? pointTotalCountText : getFallbackText('point_total_count', '点位总数:', 'Total Points:', 'Tổng Số Điểm:', '총 점 개수:');
    var safeRowCount = isTranslationValid(rowCountText, 'row_count') ? rowCountText : getFallbackText('row_count', '行数:', 'Row Count:', 'Số Hàng:', '행 수:');
    var safeColCount = isTranslationValid(colCountText, 'col_count') ? colCountText : getFallbackText('col_count', '列数:', 'Column Count:', 'Số Cột:', '열 수:');
    var safeCalculationMethod = isTranslationValid(calculationMethodText, 'calculation_method') ? calculationMethodText : getFallbackText('calculation_method', '计算方式:', 'Calculation Method:', 'Phương Pháp Tính Toán:', '계산 방식:');
    var safeCalculationMethodRow = isTranslationValid(calculationMethodRowText, 'calculation_method_row') ? calculationMethodRowText : getFallbackText('calculation_method_row', '行优先', 'Row Priority', 'Ưu Tiên Hàng', '행 우선');
    var safeCalculationMethodCol = isTranslationValid(calculationMethodColText, 'calculation_method_col') ? calculationMethodColText : getFallbackText('calculation_method_col', '列优先', 'Column Priority', 'Ưu Tiên Cột', '열 우선');
    var finalCalculationMethodText = data.manualPlanningInfo && data.manualPlanningInfo.calculationMethod === 'row_priority' ? safeCalculationMethodRow : safeCalculationMethodCol;
    manualPreviewElement.innerHTML = "\n            <h3>".concat(safeManualPlanningRecipeInfo, "</h3>\n            <div class=\"manual-planning-info\">\n                <p><strong>").concat(safeRecipeName, "</strong> ").concat(data.recipeName || '', "</p>\n                <p><strong>").concat(safeRecipeId, "</strong> ").concat(data.recipeId || '', "</p>\n                <p><strong>").concat(safePointTotalCount, "</strong> ").concat(data.tableData ? data.tableData.length : 0, "</p>\n                ").concat(data.manualPlanningInfo ? "\n                    <p><strong>".concat(safeRowCount, "</strong> ").concat(data.manualPlanningInfo.rowCount || '', "</p>\n                    <p><strong>").concat(safeColCount, "</strong> ").concat(data.manualPlanningInfo.colCount || '', "</p>\n                    <p><strong>").concat(safeCalculationMethod, "</strong> ").concat(finalCalculationMethodText, "</p>\n                ") : '', "\n            </div>\n        ");

    // 显示手动规划预览
    manualPreviewElement.style.display = 'block';
  }
};

// 清除智能规划界面的所有参数和图片
function clearSmartPlanningInterface() {
  // 清除所有输入框的值
  var inputFields = ['frame_length', 'frame_width', 'frame_depth', 'shape_height', 'material_thickness', 'placement_layers', 'shape_type', 'shape_length', 'shape_width', 'drop_count', 'horizontal_spacing', 'vertical_spacing', 'horizontal_border_distance', 'vertical_border_distance', 'layout_type', 'place_type', 'remainder_turn', 'shape_count_value', 'shapes_per_row_or_col_value', 'circle_diameter', 'rectangle_length', 'rectangle_width', 'polygon_sides', 'polygon_side_length', 'polygon_arrangement', 'triangle_type', 'triangle_side_length', 'triangle_base_length', 'triangle_orientation'];
  inputFields.forEach(function (fieldId) {
    var element = document.getElementById(fieldId);
    if (element) {
      if (element.type === 'select-one') {
        element.selectedIndex = 0; // 重置为第一个选项
      } else {
        element.value = '';
      }
    }
  });

  // 清除预览图片
  var plotImg = document.getElementById('plot');
  if (plotImg) {
    plotImg.src = '';
    plotImg.style.display = 'none';
    plotImg.removeAttribute('data-base64');
  }

  // 清除预览图片
  var previewPlotImg = document.getElementById('preview-plot');
  if (previewPlotImg) {
    previewPlotImg.src = '';
    previewPlotImg.style.display = 'none';
    previewPlotImg.removeAttribute('data-base64');
  }
  console.log('智能规划界面已清除');
}

// 重置配方预览状态
function resetRecipePreview() {
  var previewContainer = document.querySelector('.recipe-preview .preview-container');
  if (previewContainer) {
    // 隐藏手动规划预览
    var manualPreviewElement = previewContainer.querySelector('.manual-planning-preview');
    if (manualPreviewElement) {
      manualPreviewElement.style.display = 'none';
    }

    // 显示智能规划相关的元素
    var smartPlanningElements = previewContainer.querySelectorAll('.input-container, .preview-image-container');
    smartPlanningElements.forEach(function (element) {
      element.style.display = 'block';
    });
  }
}

// 从配方数据填充数据清单表格
function fillDataListTableFromRecipe(tableData) {
  var tableBody = document.querySelector('#data-list-content table tbody');
  tableBody.innerHTML = ''; // 清空现有数据

  if (tableData && Array.isArray(tableData)) {
    tableData.forEach(function (rowData) {
      var row = document.createElement('tr');

      // 行号
      var cell1 = document.createElement('td');
      cell1.textContent = rowData.rowNumber || '';
      cell1.style.border = '1px solid #ddd';
      cell1.style.padding = '8px';
      row.appendChild(cell1);

      // 列号
      var cell2 = document.createElement('td');
      cell2.textContent = rowData.colNumber || '';
      cell2.style.border = '1px solid #ddd';
      cell2.style.padding = '8px';
      row.appendChild(cell2);

      // P_ID
      var cell3 = document.createElement('td');
      cell3.textContent = rowData.pId || '';
      cell3.style.border = '1px solid #ddd';
      cell3.style.padding = '8px';
      row.appendChild(cell3);

      // X坐标
      var cell4 = document.createElement('td');
      cell4.textContent = (parseFloat(rowData.x) || 0).toFixed(2);
      cell4.style.border = '1px solid #ddd';
      cell4.style.padding = '8px';
      row.appendChild(cell4);

      // X补偿
      var cell5 = document.createElement('td');
      cell5.textContent = (parseFloat(rowData.xCompensation) || 0).toFixed(2);
      cell5.style.border = '1px solid #ddd';
      cell5.style.padding = '8px';
      row.appendChild(cell5);

      // Y坐标
      var cell6 = document.createElement('td');
      cell6.textContent = (parseFloat(rowData.y) || 0).toFixed(2);
      cell6.style.border = '1px solid #ddd';
      cell6.style.padding = '8px';
      row.appendChild(cell6);

      // Y补偿
      var cell7 = document.createElement('td');
      cell7.textContent = (parseFloat(rowData.yCompensation) || 0).toFixed(2);
      cell7.style.border = '1px solid #ddd';
      cell7.style.padding = '8px';
      row.appendChild(cell7);

      // C坐标
      var cell8 = document.createElement('td');
      cell8.textContent = (parseFloat(rowData.c) || 0).toFixed(2);
      cell8.style.border = '1px solid #ddd';
      cell8.style.padding = '8px';
      row.appendChild(cell8);

      // C补偿
      var cell9 = document.createElement('td');
      cell9.textContent = (parseFloat(rowData.cCompensation) || 0).toFixed(2);
      cell9.style.border = '1px solid #ddd';
      cell9.style.padding = '8px';
      row.appendChild(cell9);
      tableBody.appendChild(row);
    });
  }
}

// 删除配方
function deleteRecipe(_x3) {
  return _deleteRecipe.apply(this, arguments);
} // 读取配方到智能规划页面
function _deleteRecipe() {
  _deleteRecipe = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(recipeName) {
    var confirmDelete;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return myConfirm("\u786E\u5B9A\u8981\u5220\u9664\u914D\u65B9 \"".concat(recipeName, "\" \u5417\uFF1F"));
        case 2:
          confirmDelete = _context2.sent;
          if (confirmDelete) {
            fetch('/delete_recipe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                recipeName: recipeName
              })
            }).then(function (response) {
              return response.json();
            }).then(function (data) {
              if (data.success) {
                loadRecipeList(); // 重新加载配方列表
              } else {
                alertError('删除配方失败');
              }
            }).catch(function (error) {
              return console.error('删除配方失败:', error);
            });
          }
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _deleteRecipe.apply(this, arguments);
}
function loadRecipeToPlanning(recipeName) {
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
  }).then(function (data) {
    // 检查是否为手动规划配方
    var isManualPlanning = data.isManualPlanning === true;
    if (isManualPlanning) {
      // 清除智能规划界面的所有参数和图片，防止干扰
      clearSmartPlanningInterface();

      // 设置全局状态标记，标识当前为手动规划配方
      window.currentRecipeType = 'manual';

      // 手动规划配方：只填充数据清单表格
      fillDataListTableFromRecipe(data.tableData);

      // 填充配方名和配方编号到数据清单的输入框中
      document.getElementById('recipe_name').value = recipeName;
      document.getElementById('recipe_id').value = data.recipeId;

      // 填充手动规划的行数、列数和计算方式到输入框中，确保写入R寄存器时能正确获取
      if (data.manualPlanningInfo) {
        var rowCountInput = document.getElementById('row_count');
        var colCountInput = document.getElementById('col_count');
        var calculationMethodInput = document.getElementById('calculation_method');
        if (rowCountInput && colCountInput) {
          rowCountInput.value = data.manualPlanningInfo.rowCount || '';
          colCountInput.value = data.manualPlanningInfo.colCount || '';
        }
        if (calculationMethodInput) {
          calculationMethodInput.value = data.manualPlanningInfo.calculationMethod || 'row_priority';
        }
      }

      // 显示数据清单页面
      showSection('data-list-content');
      setActiveButton('data-list-btn');
      return;
    }

    // 智能规划配方：设置全局状态标记
    window.currentRecipeType = 'smart';

    // 智能规划配方：填充所有参数
    document.getElementById('frame_length').value = data.frameLength;
    document.getElementById('frame_width').value = data.frameWidth;
    document.getElementById('frame_depth').value = data.frameDepth;
    document.getElementById('shape_type').value = data.shapeType;
    document.getElementById('shape_height').value = data.shapeHeight;
    document.getElementById('drop_Count').value = data.dropCount;
    document.getElementById('horizontal_spacing').value = data.horizontalSpacing;
    document.getElementById('vertical_spacing').value = data.verticalSpacing;
    document.getElementById('horizontal_border_distance').value = data.horizontalBorderDistance;
    document.getElementById('vertical_border_distance').value = data.verticalBorderDistance;
    document.getElementById('material_thickness').value = data.materialThickness;
    document.getElementById('placement_layers').value = data.placementLayers;
    document.getElementById('layout_type').value = data.layoutType;
    document.getElementById('place_type').value = data.placeType;
    document.getElementById('remainder_turn').value = data.remainderTurn;

    // 根据工件类型填充相应的参数
    if (data.shapeType === 'circle') {
      document.getElementById('circle_diameter').value = data.circleDiameter;
    } else if (data.shapeType === 'rectangle') {
      document.getElementById('rectangle_length').value = data.rectangleLength;
      document.getElementById('rectangle_width').value = data.rectangleWidth;
    } else if (data.shapeType === 'polygon') {
      document.getElementById('polygon_sides').value = data.polygonSides;
      document.getElementById('polygon_side_length').value = data.polygonSideLength;
      document.getElementById('polygon_arrangement').value = data.polygonArrangement || 'diagonal'; // 添加多边形排布方式参数
    } else if (data.shapeType === 'triangle') {
      document.getElementById('triangle_type').value = data.triangleType;
      document.getElementById('triangle_side_length').value = data.triangleSideLength;
      // 如果是等腰三角形，填充底边长
      if (data.triangleType === 'isosceles') {
        document.getElementById('triangle_base_length').value = data.triangleBaseLength;
        document.getElementById('triangle_base_length_input').style.display = 'block'; // 显示底边长输入框
      } else {
        document.getElementById('triangle_base_length_input').style.display = 'none'; // 隐藏底边长输入框
      }
      document.getElementById('triangle_orientation').value = data.triangleOrientation;
    }

    // 手动触发工件类型的 change 事件，以更新输入框显示状态
    var shapeTypeSelect = document.getElementById('shape_type');
    shapeTypeSelect.dispatchEvent(new Event('change'));

    // 填充结果预览图片
    var plotImg = document.getElementById('plot');
    plotImg.src = data.plotImageBase64;
    plotImg.setAttribute('data-base64', data.plotImageBase64); // 添加这行，设置data-base64属性
    plotImg.style.display = 'block';

    // 填充填充数量和单行/列数量
    document.getElementById('shape-count-value').textContent = data.shapeCountValue;
    document.getElementById('shapes-per-row-or-col-value').textContent = data.shapesPerRowOrColValue;

    // 显示填充数量和单行/列数量
    document.getElementById('shape-count').style.display = 'block';
    document.getElementById('shapes-per-row-or-col').style.display = 'block';

    // 填充数据清单页面
    var tableBody = document.querySelector('#data-list-content table tbody');
    tableBody.innerHTML = ''; // 清空表格内容

    if (data.tableData && Array.isArray(data.tableData)) {
      data.tableData.forEach(function (rowData) {
        var row = document.createElement('tr');

        // 行号
        var cell1 = document.createElement('td');
        cell1.textContent = rowData.rowNumber || '';
        cell1.style.border = '1px solid #ddd';
        cell1.style.padding = '8px';
        row.appendChild(cell1);

        // 列号
        var cell2 = document.createElement('td');
        cell2.textContent = rowData.colNumber || '';
        cell2.style.border = '1px solid #ddd';
        cell2.style.padding = '8px';
        row.appendChild(cell2);

        // P_ID
        var cell3 = document.createElement('td');
        cell3.textContent = rowData.pId || '';
        cell3.style.border = '1px solid #ddd';
        cell3.style.padding = '8px';
        row.appendChild(cell3);

        // X坐标
        var cell4 = document.createElement('td');
        cell4.textContent = (parseFloat(rowData.x) || 0).toFixed(2);
        cell4.style.border = '1px solid #ddd';
        cell4.style.padding = '8px';
        row.appendChild(cell4);

        // X补偿
        var cell5 = document.createElement('td');
        cell5.textContent = (parseFloat(rowData.xCompensation) || 0).toFixed(2);
        cell5.style.border = '1px solid #ddd';
        cell5.style.padding = '8px';
        row.appendChild(cell5);

        // Y坐标
        var cell6 = document.createElement('td');
        cell6.textContent = (parseFloat(rowData.y) || 0).toFixed(2);
        cell6.style.border = '1px solid #ddd';
        cell6.style.padding = '8px';
        row.appendChild(cell6);

        // Y补偿
        var cell7 = document.createElement('td');
        cell7.textContent = (parseFloat(rowData.yCompensation) || 0).toFixed(2);
        cell7.style.border = '1px solid #ddd';
        cell7.style.padding = '8px';
        row.appendChild(cell7);

        // C坐标
        var cell8 = document.createElement('td');
        cell8.textContent = (parseFloat(rowData.c) || 0).toFixed(2);
        cell8.style.border = '1px solid #ddd';
        cell8.style.padding = '8px';
        row.appendChild(cell8);

        // C补偿
        var cell9 = document.createElement('td');
        cell9.textContent = (parseFloat(rowData.cCompensation) || 0).toFixed(2);
        cell9.style.border = '1px solid #ddd';
        cell9.style.padding = '8px';
        row.appendChild(cell9);
        tableBody.appendChild(row);
      });
    }

    // 填充配方名和配方编号到数据清单的输入框中
    document.getElementById('recipe_name').value = recipeName;
    document.getElementById('recipe_id').value = data.recipeId; // 填充配方编号

    // 检查是否来自外部调用监控
    var isFromExternalCall = window.isFromExternalCall;
    if (isFromExternalCall) {
      // 如果是外部调用，显示数据清单页面
      showSection('data-list-content');
      setActiveButton('data-list-btn');
      window.isFromExternalCall = false; // 重置标志位
    } else {
      // 如果是手动加载，也显示数据清单页面
      showSection('data-list-content');
      setActiveButton('data-list-btn');
    }
  }).catch(function (error) {
    return console.error('加载配方失败:', error);
  });
}

// 配方库界面选择框显示控制
function updateExternalCallVisibility() {
  var recipeNumber = document.getElementById('recipe-number').value;
  var callSignal = document.getElementById('call-signal').value;
  var finishSignal = document.getElementById('finish-signal').value;
  var externalCallContainer = document.getElementById('external-call-container');
  var autoWriteContainer = document.getElementById('auto-write-container');
  var externalCallStatus = document.getElementById('external-call-status');

  // 只有当配方号、调用信号DI、完成信号DO都输入了值时才显示选择框
  if (recipeNumber && callSignal && finishSignal) {
    externalCallContainer.style.display = 'block';
    autoWriteContainer.style.display = 'block';
    externalCallStatus.style.display = 'block';
  } else {
    externalCallContainer.style.display = 'none';
    autoWriteContainer.style.display = 'none';
    externalCallStatus.style.display = 'none';
    // 如果隐藏选择框，也要停止监控
    stopExternalCallMonitor();
  }
}

// 更新状态显示
function updateStatusDisplay(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'normal';
  var statusText = document.getElementById('status-text');
  var statusContainer = document.getElementById('external-call-status');
  if (statusText) {
    statusText.textContent = message;
  }
  if (statusContainer) {
    // 移除所有状态类
    statusContainer.classList.remove('monitoring', 'triggered', 'error', 'processing', 'success');

    // 根据类型添加相应的类
    if (type === 'monitoring') {
      statusContainer.classList.add('monitoring');
    } else if (type === 'triggered') {
      statusContainer.classList.add('triggered');
    } else if (type === 'error') {
      statusContainer.classList.add('error');
    } else if (type === 'processing') {
      statusContainer.classList.add('processing');
    } else if (type === 'success') {
      statusContainer.classList.add('success');
    }
  }
}

// 触发完成信号
function triggerFinishSignal() {
  var finishSignal = document.getElementById('finish-signal').value;
  if (!finishSignal) {
    console.log('未设置完成信号DO，跳过DO信号触发');
    return;
  }
  console.log("\u81EA\u52A8\u5199\u5165\u5B8C\u6210\uFF0C\u5F00\u59CB\u89E6\u53D1DO".concat(finishSignal, "\u4FE1\u53F7"));

  // 设置DO信号为1
  fetch('/set_do_signal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      do_number: finishSignal,
      do_value: 1
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.success) {
      console.log("DO".concat(finishSignal, "\u4FE1\u53F7\u8BBE\u7F6E\u4E3A1\u6210\u529F"));
      updateStatusDisplay("DO".concat(finishSignal, "\u4FE1\u53F7\u5DF2\u8BBE\u7F6E\u4E3A1\uFF0C1\u79D2\u540E\u5C06\u91CD\u7F6E\u4E3A0"), 'processing');

      // 1秒后将DO信号设为0
      setTimeout(function () {
        fetch('/set_do_signal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            do_number: finishSignal,
            do_value: 0
          })
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.success) {
            console.log("DO".concat(finishSignal, "\u4FE1\u53F7\u91CD\u7F6E\u4E3A0\u6210\u529F"));
            updateStatusDisplay("DO".concat(finishSignal, "\u4FE1\u53F7\u5DF2\u91CD\u7F6E\u4E3A0\uFF0C\u81EA\u52A8\u5199\u5165\u6D41\u7A0B\u5B8C\u6210"), 'success');
          } else {
            console.error("DO".concat(finishSignal, "\u4FE1\u53F7\u91CD\u7F6E\u4E3A0\u5931\u8D25:"), data.error);
            updateStatusDisplay("DO".concat(finishSignal, "\u4FE1\u53F7\u91CD\u7F6E\u5931\u8D25: ").concat(data.error), 'error');
          }
        }).catch(function (error) {
          console.error("DO".concat(finishSignal, "\u4FE1\u53F7\u91CD\u7F6E\u4E3A0\u8BF7\u6C42\u5931\u8D25:"), error);
          updateStatusDisplay("DO".concat(finishSignal, "\u4FE1\u53F7\u91CD\u7F6E\u8BF7\u6C42\u5931\u8D25: ").concat(error.message), 'error');
        });
      }, 1000); // 1秒延迟
    } else {
      console.error("DO".concat(finishSignal, "\u4FE1\u53F7\u8BBE\u7F6E\u4E3A1\u5931\u8D25:"), data.error);
      updateStatusDisplay("DO".concat(finishSignal, "\u4FE1\u53F7\u8BBE\u7F6E\u5931\u8D25: ").concat(data.error), 'error');
    }
  }).catch(function (error) {
    console.error("DO".concat(finishSignal, "\u4FE1\u53F7\u8BBE\u7F6E\u4E3A1\u8BF7\u6C42\u5931\u8D25:"), error);
    updateStatusDisplay("DO".concat(finishSignal, "\u4FE1\u53F7\u8BBE\u7F6E\u8BF7\u6C42\u5931\u8D25: ").concat(error.message), 'error');
  });
}

// 配方操作相关函数
function setupRecipeOperationListeners() {
  // 全选/取消全选（仅在插件环境中显示和工作）
  var selectAllCheckbox = document.getElementById('select-all-recipes');
  var operateDiv = document.querySelector('.recipe-operations');
  if (selectAllCheckbox) {
    if (isTP) {
      selectAllCheckbox.addEventListener('change', function () {
        var _this = this;
        var recipeCheckboxes = document.querySelectorAll('.recipe-checkbox');
        recipeCheckboxes.forEach(function (checkbox) {
          checkbox.checked = _this.checked;
        });
      });
    } else {
      // 在非插件环境中隐藏全选勾选框
      operateDiv.style.display = 'none';
    }
  }

  // 导出选中配方
  var exportButton = document.getElementById('export-selected-recipes');
  if (exportButton) {
    exportButton.addEventListener('click', exportSelectedRecipes);
    // 如果不是在插件环境中，隐藏导出按钮
    if (!isTP) {
      exportButton.style.display = 'none';
    }
  }

  // 导入配方
  var importButton = document.getElementById('import-recipes');
  if (importButton) {
    importButton.addEventListener('click', importRecipes);
    // 如果不是在插件环境中，隐藏导入按钮
    if (!isTP) {
      importButton.style.display = 'none';
    }
  }
}

// 获取选中的配方
function getSelectedRecipes() {
  var selectedCheckboxes = document.querySelectorAll('.recipe-checkbox:checked');
  return Array.from(selectedCheckboxes).map(function (checkbox) {
    return checkbox.value;
  });
}

// 导出选中的配方
function exportSelectedRecipes() {
  var selectedRecipes = getSelectedRecipes();
  if (selectedRecipes.length === 0) {
    alertError('请选择要导出的配方');
    return;
  }
  console.log(selectedRecipes);
  fetch('/export_recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipe_ids: selectedRecipes
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.error) {
      alertError("\u5BFC\u51FA\u914D\u65B9\u5931\u8D25: ".concat(data.error));
      return;
    }

    // 导出成功
    alertSuccess(data.message || "\u6210\u529F\u5BFC\u51FA ".concat(selectedRecipes.length, " \u4E2A\u914D\u65B9\u5230U\u76D8"));
  }).catch(function (error) {
    alertError("\u5BFC\u51FA\u914D\u65B9\u5931\u8D25: ".concat(error.message));
  });
}

// 导入配方
function importRecipes() {
  // 首先获取U盘中的备份时间目录列表
  fetch('/get_backup_timestamps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.error) {
      alertError("\u8BFB\u53D6U\u76D8\u5907\u4EFD\u76EE\u5F55\u5931\u8D25: ".concat(data.error));
      return;
    }
    if (data.count === 0) {
      alertInfo('U盘中没有找到配方备份目录');
      return;
    }

    // 显示时间目录选择对话框
    showTimestampSelectionDialog(data.timestamps);
  }).catch(function (error) {
    alertError("\u8BFB\u53D6U\u76D8\u5907\u4EFD\u76EE\u5F55\u5931\u8D25: ".concat(error.message));
  });
}

// 显示时间目录选择对话框
function showTimestampSelectionDialog(timestamps) {
  var dialog = document.createElement('div');
  dialog.className = 'modal-overlay';
  dialog.innerHTML = "\n        <div class=\"modal-content import-dialog\">\n            <div class=\"modal-header\">\n                <h3>\u9009\u62E9\u5907\u4EFD\u65F6\u95F4</h3>\n                <button class=\"close-modal\" onclick=\"closeImportDialog()\">&times;</button>\n            </div>\n            <div class=\"modal-body\">\n                <p>\u8BF7\u9009\u62E9\u8981\u5BFC\u5165\u7684\u914D\u65B9\u5907\u4EFD\u65F6\u95F4\uFF1A</p>\n                <div class=\"timestamp-list\">\n                    ".concat(generateTimestampList(timestamps), "\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button class=\"btn btn-secondary\" onclick=\"closeImportDialog()\">\u53D6\u6D88</button>\n            </div>\n        </div>\n    ");
  document.body.appendChild(dialog);
  dialog.classList.add('show');
}

// 生成时间目录列表HTML
function generateTimestampList(timestamps) {
  return timestamps.map(function (timestamp) {
    return "\n            <div class=\"timestamp-item\" onclick=\"selectTimestamp('".concat(timestamp.timestamp, "')\">\n                <div class=\"timestamp-info\">\n                    <div class=\"timestamp-display\">").concat(timestamp.display_time, "</div>\n                    <div class=\"timestamp-details\">\n                        <span class=\"recipe-count\">").concat(timestamp.recipe_count, " \u4E2A\u914D\u65B9</span>\n                        ").concat(timestamp.export_date ? "<span class=\"export-date\">\u5BFC\u51FA\u65F6\u95F4: ".concat(timestamp.export_date, "</span>") : '', "\n                    </div>\n                </div>\n            </div>\n        ");
  }).join('');
}

// 选择时间戳并获取该目录下的配方
function selectTimestamp(timestamp) {
  // 获取指定时间目录中的配方列表
  fetch('/get_usb_recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timestamp: timestamp
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.error) {
      alertError("\u8BFB\u53D6\u914D\u65B9\u5931\u8D25: ".concat(data.error));
      return;
    }
    if (data.count === 0) {
      alertInfo('该时间目录中没有找到配方文件');
      return;
    }

    // 关闭时间选择对话框，显示配方导入对话框
    closeImportDialog();
    showImportDialog(data.recipes, timestamp);
  }).catch(function (error) {
    alertError("\u8BFB\u53D6\u914D\u65B9\u5931\u8D25: ".concat(error.message));
  });
}

// 显示导入对话框
function showImportDialog(usbRecipes, timestamp) {
  // 创建模态对话框
  var dialog = document.createElement('div');
  dialog.className = 'modal-overlay';
  dialog.innerHTML = "\n        <div class=\"modal-content import-dialog\">\n            <div class=\"modal-header\">\n                <h3>\u4ECEU\u76D8\u5BFC\u5165\u914D\u65B9</h3>\n                <button class=\"close-modal\" onclick=\"closeImportDialog()\">&times;</button>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"import-recipe-controls\">\n                    <label class=\"checkbox-wrapper\">\n                        <input type=\"checkbox\" id=\"import-select-all\" onchange=\"toggleAllImportRecipes()\">\n                        <span class=\"checkbox-text\">\u5168\u9009</span>\n                    </label>\n                    <div class=\"import-info\">\n                        \u6765\u6E90: ".concat(timestamp, " | \u627E\u5230 ").concat(usbRecipes.length, " \u4E2A\u914D\u65B9\u6587\u4EF6\n                    </div>\n                </div>\n                <div class=\"import-recipe-list\" id=\"import-recipe-list\">\n                    ").concat(generateImportRecipeList(usbRecipes), "\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button class=\"btn btn-secondary\" onclick=\"closeImportDialog()\">\u53D6\u6D88</button>\n                <button class=\"btn btn-primary\" onclick=\"confirmImportRecipes('").concat(timestamp, "')\">\u5BFC\u5165\u9009\u4E2D\u914D\u65B9</button>\n            </div>\n        </div>\n    ");
  document.body.appendChild(dialog);
  dialog.classList.add('show');
}

// 生成导入配方列表HTML
function generateImportRecipeList(usbRecipes) {
  return usbRecipes.map(function (recipe) {
    var errorText = recipe.error ? " <span class=\"error-text\">(".concat(recipe.error, ")</span>") : '';
    return "\n            <div class=\"import-recipe-item\">\n                <label class=\"checkbox-wrapper\">\n                    <input type=\"checkbox\" class=\"import-recipe-checkbox\" value=\"".concat(recipe.filename, "\"\n                           onchange=\"updateImportSelectAllState()\" ").concat(recipe.error ? 'disabled' : '', ">\n                    <div class=\"recipe-info\">\n                        <div class=\"recipe-name\">").concat(recipe.recipeName).concat(errorText, "</div>\n                        <div class=\"recipe-details\">\n                            <span class=\"recipe-id\">ID: ").concat(recipe.recipeId || '无', "</span>\n                        </div>\n                    </div>\n                </label>\n            </div>\n        ");
  }).join('');
}

// 全选/取消全选导入配方
function toggleAllImportRecipes() {
  var selectAllCheckbox = document.getElementById('import-select-all');
  var recipeCheckboxes = document.querySelectorAll('.import-recipe-checkbox:not(:disabled)');
  recipeCheckboxes.forEach(function (checkbox) {
    checkbox.checked = selectAllCheckbox.checked;
  });
}

// 更新导入全选状态
function updateImportSelectAllState() {
  var selectAllCheckbox = document.getElementById('import-select-all');
  var allRecipeCheckboxes = document.querySelectorAll('.import-recipe-checkbox:not(:disabled)');
  var checkedRecipeCheckboxes = document.querySelectorAll('.import-recipe-checkbox:checked');
  if (selectAllCheckbox) {
    if (checkedRecipeCheckboxes.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedRecipeCheckboxes.length === allRecipeCheckboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }
}

// 确认导入配方
function confirmImportRecipes(_x4) {
  return _confirmImportRecipes.apply(this, arguments);
} // 执行导入操作
function _confirmImportRecipes() {
  _confirmImportRecipes = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(timestamp) {
    var selectedCheckboxes, selectedFilenames, confirmed;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          selectedCheckboxes = document.querySelectorAll('.import-recipe-checkbox:checked');
          selectedFilenames = Array.from(selectedCheckboxes).map(function (cb) {
            return cb.value;
          });
          if (!(selectedFilenames.length === 0)) {
            _context3.next = 5;
            break;
          }
          alertError('请选择要导入的配方');
          return _context3.abrupt("return");
        case 5:
          _context3.next = 7;
          return myConfirm("\u786E\u8BA4\u5BFC\u5165 ".concat(selectedFilenames.length, " \u4E2A\u914D\u65B9\uFF1F"));
        case 7:
          confirmed = _context3.sent;
          if (confirmed) {
            executeImport(selectedFilenames, timestamp);
          }
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _confirmImportRecipes.apply(this, arguments);
}
function executeImport(_x5, _x6) {
  return _executeImport.apply(this, arguments);
} // 检查导入冲突
function _executeImport() {
  _executeImport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(filenames, timestamp) {
    var conflictResult, conflictAction, continueImport, resolvedConflicts, originalFileCount, skippedConflicts, response, data, message, parts;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // 初始化跳过计数
          window.manuallySkippedCount = 0;

          // 1. 先检查重名冲突（配方号冲突会自动处理）
          _context4.next = 4;
          return checkImportConflicts(filenames, timestamp);
        case 4:
          conflictResult = _context4.sent;
          conflictAction = 'proceed'; // 默认继续导入
          // 2. 如果有配方号重新分配的情况，先显示信息
          if (!conflictResult.hasIdReassignments) {
            _context4.next = 12;
            break;
          }
          _context4.next = 9;
          return showIdReassignmentDialog(conflictResult.idReassignments);
        case 9:
          continueImport = _context4.sent;
          if (continueImport) {
            _context4.next = 12;
            break;
          }
          return _context4.abrupt("return");
        case 12:
          if (!conflictResult.hasNameConflicts) {
            _context4.next = 26;
            break;
          }
          _context4.next = 15;
          return resolveNameConflictsOneByOne(conflictResult.nameConflicts);
        case 15:
          resolvedConflicts = _context4.sent;
          if (!resolvedConflicts.cancelled) {
            _context4.next = 18;
            break;
          }
          return _context4.abrupt("return");
        case 18:
          // 根据用户的决定过滤要导入的文件
          originalFileCount = filenames.length;
          skippedConflicts = resolvedConflicts.decisions.filter(function (d) {
            return d.action === 'skip';
          });
          filenames = filenames.filter(function (filename) {
            var conflict = resolvedConflicts.decisions.find(function (d) {
              return d.filename === filename;
            });
            return !conflict || conflict.action !== 'skip';
          });
          if (!(filenames.length === 0)) {
            _context4.next = 24;
            break;
          }
          alertInfo('所有配方都被跳过，导入已取消');
          return _context4.abrupt("return");
        case 24:
          conflictAction = 'overwrite'; // 剩余的文件都是要覆盖的

          // 记录跳过的重名配方数量，用于最后的结果显示
          window.manuallySkippedCount = skippedConflicts.length;
        case 26:
          _context4.next = 28;
          return fetch('/import_recipes_from_usb', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filenames: filenames,
              timestamp: timestamp,
              conflict_action: conflictAction
            })
          });
        case 28:
          response = _context4.sent;
          _context4.next = 31;
          return response.json();
        case 31:
          data = _context4.sent;
          if (!data.error) {
            _context4.next = 35;
            break;
          }
          alertError("\u5BFC\u5165\u5931\u8D25: ".concat(data.error));
          return _context4.abrupt("return");
        case 35:
          // 显示导入结果
          message = data.message; // 添加手动跳过的重名配方信息
          if (window.manuallySkippedCount && window.manuallySkippedCount > 0) {
            parts = message.split('成功导入');
            if (parts.length === 2) {
              message = parts[0] + "\u6210\u529F\u5BFC\u5165".concat(parts[1].split('个配方')[0], "\u4E2A\u914D\u65B9\uFF0C\u624B\u52A8\u8DF3\u8FC7 ").concat(window.manuallySkippedCount, " \u4E2A\u91CD\u540D\u914D\u65B9").concat(parts[1].substring(parts[1].indexOf('个配方') + 3));
            }
            delete window.manuallySkippedCount; // 清理全局变量
          }

          // 添加重新分配的配方号信息
          if (data.reassigned_list && data.reassigned_list.length > 0) {
            message += '\n\n配方号自动重新分配详情:\n' + data.reassigned_list.join('\n');
          }
          if (data.errors && data.errors.length > 0) {
            message += '\n\n错误详情:\n' + data.errors.join('\n');
          }
          alertSuccess(message);
          closeImportDialog();

          // 刷新配方列表
          loadRecipeList();
          _context4.next = 47;
          break;
        case 44:
          _context4.prev = 44;
          _context4.t0 = _context4["catch"](0);
          alertError("\u5BFC\u5165\u5931\u8D25: ".concat(_context4.t0.message));
        case 47:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 44]]);
  }));
  return _executeImport.apply(this, arguments);
}
function checkImportConflicts(_x7, _x8) {
  return _checkImportConflicts.apply(this, arguments);
} // 显示配方号重新分配确认对话框
function _checkImportConflicts() {
  _checkImportConflicts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(filenames, timestamp) {
    var response, data;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return fetch('/check_import_conflicts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filenames: filenames,
              timestamp: timestamp
            })
          });
        case 3:
          response = _context5.sent;
          _context5.next = 6;
          return response.json();
        case 6:
          data = _context5.sent;
          if (!data.error) {
            _context5.next = 9;
            break;
          }
          throw new Error(data.error);
        case 9:
          return _context5.abrupt("return", {
            hasNameConflicts: data.hasNameConflicts,
            hasIdReassignments: data.hasIdReassignments,
            nameConflicts: data.nameConflicts,
            idReassignments: data.idReassignments
          });
        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error('检查导入冲突失败:', _context5.t0);
          return _context5.abrupt("return", {
            hasNameConflicts: false,
            hasIdReassignments: false,
            nameConflicts: [],
            idReassignments: []
          });
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 12]]);
  }));
  return _checkImportConflicts.apply(this, arguments);
}
function showIdReassignmentDialog(_x9) {
  return _showIdReassignmentDialog.apply(this, arguments);
} // 逐个解决重名冲突
function _showIdReassignmentDialog() {
  _showIdReassignmentDialog = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(idReassignments) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", new Promise(function (resolve) {
            var dialog = document.createElement('div');
            dialog.className = 'modal-overlay';
            dialog.innerHTML = "\n            <div class=\"modal-content conflict-dialog\">\n                <div class=\"modal-header\">\n                    <h3>\u914D\u65B9\u53F7\u81EA\u52A8\u5206\u914D\u901A\u77E5</h3>\n                    <button class=\"close-modal\" onclick=\"resolveIdReassignment(false)\">&times;</button>\n                </div>\n                <div class=\"modal-body\">\n                    <p class=\"conflict-message\">\u4EE5\u4E0B\u914D\u65B9\u5B58\u5728\u914D\u65B9\u53F7\u91CD\u590D\uFF0C\u7CFB\u7EDF\u5C06\u81EA\u52A8\u5206\u914D\u65B0\u7684\u914D\u65B9\u53F7\uFF1A</p>\n                    <div class=\"conflict-list\">\n                        ".concat(generateIdReassignmentList(idReassignments), "\n                    </div>\n                    <div class=\"conflict-note\">\n                        <p><strong>\u8BF4\u660E\uFF1A</strong>\u8FD9\u4E9B\u914D\u65B9\u7684\u5185\u5BB9\u4E0D\u4F1A\u6539\u53D8\uFF0C\u53EA\u662F\u914D\u65B9\u53F7\u4F1A\u88AB\u91CD\u65B0\u5206\u914D\u5230\u53EF\u7528\u7684\u53F7\u7801\u3002</p>\n                    </div>\n                </div>\n                <div class=\"modal-footer\">\n                    <button class=\"btn btn-secondary\" onclick=\"resolveIdReassignment(false)\">\u53D6\u6D88\u5BFC\u5165</button>\n                    <button class=\"btn btn-primary\" onclick=\"resolveIdReassignment(true)\">\u786E\u8BA4\u7EE7\u7EED</button>\n                </div>\n            </div>\n        ");

            // 添加全局解决函数
            window.resolveIdReassignment = function (proceed) {
              document.body.removeChild(dialog);
              delete window.resolveIdReassignment;
              resolve(proceed);
            };
            document.body.appendChild(dialog);
            dialog.classList.add('show');
          }));
        case 1:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _showIdReassignmentDialog.apply(this, arguments);
}
function resolveNameConflictsOneByOne(_x10) {
  return _resolveNameConflictsOneByOne.apply(this, arguments);
} // 显示单个重名冲突确认对话框
function _resolveNameConflictsOneByOne() {
  _resolveNameConflictsOneByOne = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(nameConflicts) {
    var decisions, i, conflict, decision, j, _j;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          decisions = [];
          i = 0;
        case 2:
          if (!(i < nameConflicts.length)) {
            _context7.next = 19;
            break;
          }
          conflict = nameConflicts[i];
          _context7.next = 6;
          return showSingleNameConflictDialog(conflict, i + 1, nameConflicts.length);
        case 6:
          decision = _context7.sent;
          if (!(decision.action === 'cancel')) {
            _context7.next = 9;
            break;
          }
          return _context7.abrupt("return", {
            cancelled: true,
            decisions: []
          });
        case 9:
          if (!(decision.action === 'skip_all')) {
            _context7.next = 12;
            break;
          }
          // 跳过所有剩余的重名配方
          for (j = i; j < nameConflicts.length; j++) {
            decisions.push({
              filename: nameConflicts[j].filename,
              action: 'skip'
            });
          }
          return _context7.abrupt("break", 19);
        case 12:
          if (!(decision.action === 'overwrite_all')) {
            _context7.next = 15;
            break;
          }
          // 覆盖所有剩余的重名配方
          for (_j = i; _j < nameConflicts.length; _j++) {
            decisions.push({
              filename: nameConflicts[_j].filename,
              action: 'overwrite'
            });
          }
          return _context7.abrupt("break", 19);
        case 15:
          decisions.push({
            filename: conflict.filename,
            action: decision.action
          });
        case 16:
          i++;
          _context7.next = 2;
          break;
        case 19:
          return _context7.abrupt("return", {
            cancelled: false,
            decisions: decisions
          });
        case 20:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _resolveNameConflictsOneByOne.apply(this, arguments);
}
function showSingleNameConflictDialog(_x11, _x12, _x13) {
  return _showSingleNameConflictDialog.apply(this, arguments);
} // 生成单个重名冲突信息HTML
function _showSingleNameConflictDialog() {
  _showSingleNameConflictDialog = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(conflict, current, total) {
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", new Promise(function (resolve) {
            var dialog = document.createElement('div');
            dialog.className = 'modal-overlay';
            dialog.innerHTML = "\n            <div class=\"modal-content conflict-dialog\">\n                <div class=\"modal-header\">\n                    <h3>\u914D\u65B9\u91CD\u540D\u786E\u8BA4 (".concat(current, "/").concat(total, ")</h3>\n                    <button class=\"close-modal\" onclick=\"resolveSingleNameConflict('cancel')\">&times;</button>\n                </div>\n                <div class=\"modal-body\">\n                    <p class=\"conflict-message\">\u53D1\u73B0\u914D\u65B9\u91CD\u540D\u51B2\u7A81\uFF0C\u8BF7\u9009\u62E9\u5904\u7406\u65B9\u5F0F\uFF1A</p>\n                    <div class=\"conflict-list\">\n                        ").concat(generateSingleNameConflictInfo(conflict), "\n                    </div>\n                </div>\n                <div class=\"modal-footer\">\n                    <button class=\"btn btn-secondary\" onclick=\"resolveSingleNameConflict('cancel')\">\u53D6\u6D88\u5BFC\u5165</button>\n                    <button class=\"btn btn-warning\" onclick=\"resolveSingleNameConflict('skip')\">\u8DF3\u8FC7\u6B64\u914D\u65B9</button>\n                    <button class=\"btn btn-danger\" onclick=\"resolveSingleNameConflict('overwrite')\">\u8986\u76D6\u6B64\u914D\u65B9</button>\n                    ").concat(total > 1 && current < total ? "\n                        <hr style=\"margin: 10px 0;\">\n                        <button class=\"btn btn-warning btn-sm\" onclick=\"resolveSingleNameConflict('skip_all')\">\u8DF3\u8FC7\u6240\u6709\u5269\u4F59</button>\n                        <button class=\"btn btn-danger btn-sm\" onclick=\"resolveSingleNameConflict('overwrite_all')\">\u8986\u76D6\u6240\u6709\u5269\u4F59</button>\n                    " : '', "\n                </div>\n            </div>\n        ");

            // 添加全局解决函数
            window.resolveSingleNameConflict = function (action) {
              document.body.removeChild(dialog);
              delete window.resolveSingleNameConflict;
              resolve({
                action: action
              });
            };
            document.body.appendChild(dialog);
            dialog.classList.add('show');
          }));
        case 1:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _showSingleNameConflictDialog.apply(this, arguments);
}
function generateSingleNameConflictInfo(conflict) {
  return "\n        <div class=\"conflict-item\">\n            <div class=\"conflict-info\">\n                <strong>\u6587\u4EF6\uFF1A".concat(conflict.filename, "</strong>\n            </div>\n            <div class=\"conflict-details\">\n                <span class=\"conflict-type\">\u51B2\u7A81\u7C7B\u578B\uFF1A\u914D\u65B9\u540D\u79F0\u91CD\u590D</span>\n                <div class=\"conflict-comparison\">\n                    <div class=\"usb-recipe\">\n                        <span class=\"label\">U\u76D8\u914D\u65B9\uFF1A</span>\n                        <span class=\"recipe-name\">").concat(conflict.usbRecipeName, "</span>\n                        <span class=\"recipe-id\">(ID: ").concat(conflict.usbRecipeId || '无', ")</span>\n                    </div>\n                    <div class=\"local-recipe\">\n                        <span class=\"label\">\u672C\u5730\u914D\u65B9\uFF1A</span>\n                        <span class=\"recipe-name\">").concat(conflict.localRecipeName, "</span>\n                        <span class=\"recipe-id\">(ID: ").concat(conflict.localRecipeId || '无', ")</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ");
}

// 生成配方号重新分配列表HTML
function generateIdReassignmentList(idReassignments) {
  return idReassignments.map(function (reassignment) {
    return "\n            <div class=\"conflict-item\">\n                <div class=\"conflict-info\">\n                    <strong>\u6587\u4EF6\uFF1A".concat(reassignment.filename, "</strong>\n                </div>\n                <div class=\"conflict-details\">\n                    <span class=\"conflict-type\">\u914D\u65B9\uFF1A").concat(reassignment.recipeName, "</span>\n                    <div class=\"conflict-comparison\">\n                        <div class=\"usb-recipe\">\n                            <span class=\"label\">\u539F\u914D\u65B9\u53F7\uFF1A</span>\n                            <span class=\"recipe-id\">").concat(reassignment.originalId, "</span>\n                        </div>\n                        <div class=\"local-recipe\">\n                            <span class=\"label\">\u65B0\u914D\u65B9\u53F7\uFF1A</span>\n                            <span class=\"recipe-id\">").concat(reassignment.newId, "</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ");
  }).join('');
}

// 显示配方名冲突对话框（用于保存配方时）
function showNameConflictDialog(_x14) {
  return _showNameConflictDialog.apply(this, arguments);
} // 显示ID冲突对话框（用于保存配方时）
function _showNameConflictDialog() {
  _showNameConflictDialog = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(recipeName) {
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          return _context9.abrupt("return", new Promise(function (resolve) {
            // 创建模态对话框
            var dialog = document.createElement('div');
            dialog.className = 'modal-overlay';
            dialog.innerHTML = "\n            <div class=\"modal-content conflict-dialog\">\n                <div class=\"modal-header\">\n                    <h3>\u914D\u65B9\u540D\u79F0\u51B2\u7A81</h3>\n                </div>\n                <div class=\"modal-body\">\n                    <div class=\"conflict-info\">\n                        <p><strong>\u914D\u65B9\u540D\u79F0 \"".concat(recipeName, "\" \u5DF2\u5B58\u5728</strong></p>\n                        <p>\u7EE7\u7EED\u4FDD\u5B58\u5C06\u8986\u76D6\u73B0\u6709\u7684\u914D\u65B9\u6587\u4EF6\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u7EE7\u7EED\uFF1F</p>\n                    </div>\n                </div>\n                <div class=\"modal-footer\">\n                    <button class=\"btn btn-secondary\" id=\"cancel-save\">\u53D6\u6D88\u4FDD\u5B58</button>\n                    <button class=\"btn btn-danger\" id=\"overwrite-recipe\">\u8986\u76D6\u73B0\u6709\u914D\u65B9</button>\n                </div>\n            </div>\n        ");
            document.body.appendChild(dialog);
            dialog.classList.add('show');

            // 绑定事件
            var cancelBtn = dialog.querySelector('#cancel-save');
            var overwriteBtn = dialog.querySelector('#overwrite-recipe');
            var cleanup = function cleanup() {
              document.body.removeChild(dialog);
            };
            cancelBtn.onclick = function () {
              cleanup();
              resolve({
                cancelled: true
              });
            };
            overwriteBtn.onclick = function () {
              cleanup();
              resolve({
                cancelled: false
              });
            };

            // ESC键关闭
            var _handleEsc = function handleEsc(event) {
              if (event.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', _handleEsc);
                resolve({
                  cancelled: true
                });
              }
            };
            document.addEventListener('keydown', _handleEsc);
          }));
        case 1:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _showNameConflictDialog.apply(this, arguments);
}
function showIdConflictDialog(_x15) {
  return _showIdConflictDialog.apply(this, arguments);
} // 关闭导入对话框
function _showIdConflictDialog() {
  _showIdConflictDialog = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(conflictData) {
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          return _context10.abrupt("return", new Promise(function (resolve) {
            // 创建模态对话框
            var dialog = document.createElement('div');
            dialog.className = 'modal-overlay';
            dialog.innerHTML = "\n            <div class=\"modal-content conflict-dialog\">\n                <div class=\"modal-header\">\n                    <h3>\u914D\u65B9\u7F16\u53F7\u51B2\u7A81</h3>\n                </div>\n                <div class=\"modal-body\">\n                    <div class=\"conflict-info\">\n                        <p><strong>\u914D\u65B9\u7F16\u53F7 ".concat(conflictData.original_id, " \u5DF2\u88AB\u914D\u65B9 \"").concat(conflictData.conflicting_recipe_name, "\" \u4F7F\u7528</strong></p>\n                        <p>\u7CFB\u7EDF\u5EFA\u8BAE\u4F7F\u7528\u65B0\u7684\u914D\u65B9\u7F16\u53F7\uFF1A<strong>").concat(conflictData.suggested_id, "</strong></p>\n                    </div>\n                </div>\n                <div class=\"modal-footer\">\n                    <button class=\"btn btn-secondary\" id=\"cancel-save\">\u53D6\u6D88\u4FDD\u5B58</button>\n                    <button class=\"btn btn-primary\" id=\"use-new-id\">\u4F7F\u7528\u65B0\u7F16\u53F7 ").concat(conflictData.suggested_id, "</button>\n                </div>\n            </div>\n        ");
            document.body.appendChild(dialog);
            dialog.classList.add('show');

            // 绑定事件
            var cancelBtn = dialog.querySelector('#cancel-save');
            var useNewIdBtn = dialog.querySelector('#use-new-id');
            var cleanup = function cleanup() {
              document.body.removeChild(dialog);
            };
            cancelBtn.onclick = function () {
              cleanup();
              resolve({
                cancelled: true
              });
            };
            useNewIdBtn.onclick = function () {
              cleanup();
              resolve({
                cancelled: false,
                useNewId: true,
                newId: conflictData.suggested_id
              });
            };

            // ESC键关闭
            var _handleEsc2 = function handleEsc(event) {
              if (event.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', _handleEsc2);
                resolve({
                  cancelled: true
                });
              }
            };
            document.addEventListener('keydown', _handleEsc2);
          }));
        case 1:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _showIdConflictDialog.apply(this, arguments);
}
function closeImportDialog() {
  var dialog = document.querySelector('.modal-overlay');
  if (dialog) {
    dialog.classList.remove('show');
    setTimeout(function () {
      document.body.removeChild(dialog);
    }, 300);
  }
}

// 更新全选状态
function updateSelectAllState() {
  var selectAllCheckbox = document.getElementById('select-all-recipes');
  var allRecipeCheckboxes = document.querySelectorAll('.recipe-checkbox');
  var checkedRecipeCheckboxes = document.querySelectorAll('.recipe-checkbox:checked');
  if (selectAllCheckbox) {
    if (checkedRecipeCheckboxes.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedRecipeCheckboxes.length === allRecipeCheckboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }
}
