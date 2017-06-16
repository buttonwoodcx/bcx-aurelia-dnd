define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      this.router = router;

      config.title = 'bcx-aurelia-dnd examples';

      config.map([{
        route: 'tutorial/overview.md', name: 'overview',
        title: 'Overview',
        nav: true,
        settings: { section: 'tutorial' },
        moduleId: 'show-tutorial'
      }, {
        route: 'tutorial/source-and-target.md', name: 'source-and-target',
        title: 'Source and Target',
        nav: true,
        settings: { section: 'tutorial' },
        moduleId: 'show-tutorial'
      }, {
        route: 'tutorial/testing.md', name: 'testing',
        title: 'Testing',
        nav: true,
        settings: { section: 'tutorial' },
        moduleId: 'show-tutorial'
      }, {
        route: 'simple', name: 'simple',
        title: 'Move object',
        nav: true,
        settings: { section: 'examples' },
        moduleId: 'simple-move/index'
      }, {
        route: 'simple-move-hover-no-preview', name: 'simple-move-hover-no-preview',
        title: 'Move object, no preview, use dndHover',
        nav: true,
        settings: { section: 'examples' },
        moduleId: 'simple-move-hover-no-preview/index'
      }, {
        route: 'move-plus-add', name: 'move-plus-add',
        title: 'Move object, add object, customize preview',
        nav: true,
        settings: { section: 'examples' },
        moduleId: 'move-plus-add/index'
      }, {
        route: 'draw', name: 'draw',
        title: 'Draw object',
        nav: true,
        settings: { section: 'examples' },
        moduleId: 'draw/index'
      }, {
        route: '',
        redirect: 'tutorial/overview.md'
      }]);
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('show-tutorial',['exports', 'aurelia-router'], function (exports, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ShowTutorial = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ShowTutorial = exports.ShowTutorial = function () {
    function ShowTutorial() {
      _classCallCheck(this, ShowTutorial);
    }

    ShowTutorial.prototype.activate = function activate(params, routeConfig) {
      this.filename = routeConfig.route;
    };

    ShowTutorial.prototype.determineActivationStrategy = function determineActivationStrategy() {
      return _aureliaRouter.activationStrategy.replace;
    };

    return ShowTutorial;
  }();
});
define('draw/canvas-container',['exports', 'aurelia-framework', 'bcx-aurelia-dnd', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _bcxAureliaDnd, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CanvasContainer = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var CanvasContainer = exports.CanvasContainer = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function CanvasContainer(dndService, ea) {
      _classCallCheck(this, CanvasContainer);

      this.lines = [];

      this.dndService = dndService;
      this.ea = ea;
    }

    CanvasContainer.prototype.attached = function attached() {
      var _this = this;

      this.dndService.addSource(this, { noPreview: true });
      this.dndService.addTarget(this);
      this.subscribers = [this.ea.subscribe('dnd:willStart', function () {
        return _this.resetDrawingLine();
      }), this.ea.subscribe('dnd:didEnd', function () {
        return _this.resetDrawingLine();
      })];
    };

    CanvasContainer.prototype.detached = function detached() {
      this.dndService.removeSource(this);
      this.dndService.removeTarget(this);
      this.subscribers.forEach(function (s) {
        return s.dispose();
      });
    };

    CanvasContainer.prototype.resetDrawingLine = function resetDrawingLine() {
      this.drawingLine = null;
    };

    CanvasContainer.prototype.dndModel = function dndModel() {
      return { type: 'drawLine' };
    };

    CanvasContainer.prototype.dndCanDrop = function dndCanDrop(model) {
      return model.type === 'drawLine';
    };

    CanvasContainer.prototype.dndHover = function dndHover(location) {
      var mouseStartPointPageOffset = location.mouseStartPointPageOffset,
          targetElementPageOffset = location.targetElementPageOffset,
          mouseEndPointOffsetInTargetElement = location.mouseEndPointOffsetInTargetElement;


      var from = {
        x: mouseStartPointPageOffset.x - targetElementPageOffset.x,
        y: mouseStartPointPageOffset.y - targetElementPageOffset.y
      };

      this.drawingLine = { from: from, to: mouseEndPointOffsetInTargetElement };
    };

    CanvasContainer.prototype.dndDrop = function dndDrop() {
      if (this.drawingLine) {
        this.lines.push(this.drawingLine);
      }
    };

    return CanvasContainer;
  }()) || _class);
});
define('draw/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Index = exports.Index = function Index() {
    _classCallCheck(this, Index);

    this.sourceFilenames = ['src/draw/canvas-container.js', 'src/draw/canvas-container.html'];
  };
});
define('move-plus-add/add-box',['exports', 'aurelia-framework', 'bcx-aurelia-dnd', 'jquery'], function (exports, _aureliaFramework, _bcxAureliaDnd, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AddBox = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AddBox = exports.AddBox = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService), _dec(_class = function () {
    function AddBox(dndService) {
      _classCallCheck(this, AddBox);

      this.dndService = dndService;
    }

    AddBox.prototype.attached = function attached() {
      this.dndService.addSource(this);
    };

    AddBox.prototype.detached = function detached() {
      this.dndService.removeSource(this);
    };

    AddBox.prototype.dndModel = function dndModel() {
      return {
        type: 'addItem'
      };
    };

    AddBox.prototype.dndPreview = function dndPreview() {
      var jq = (0, _jquery2.default)('\n      <div class="example-box">new box</div>\n    ');


      return jq.get(0);
    };

    return AddBox;
  }()) || _class);
});
define('move-plus-add/add-money',['exports', 'aurelia-framework', 'bcx-aurelia-dnd', 'jquery'], function (exports, _aureliaFramework, _bcxAureliaDnd, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AddMoney = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AddMoney = exports.AddMoney = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService), _dec(_class = function () {
    function AddMoney(dndService) {
      _classCallCheck(this, AddMoney);

      this.dndService = dndService;
    }

    AddMoney.prototype.attached = function attached() {
      this.dndService.addSource(this, { centerPreviewToMousePosition: true, hideCursor: true });
    };

    AddMoney.prototype.detached = function detached() {
      this.dndService.removeSource(this);
    };

    AddMoney.prototype.dndModel = function dndModel() {
      return {
        type: 'addDollar'
      };
    };

    AddMoney.prototype.dndPreview = function dndPreview() {
      var jq = (0, _jquery2.default)('\n      <div class="dollar"></div>\n    ');

      return jq.get(0);
    };

    return AddMoney;
  }()) || _class);
});
define('move-plus-add/box',['exports', 'aurelia-framework', 'bcx-aurelia-dnd'], function (exports, _aureliaFramework, _bcxAureliaDnd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Box = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var Box = exports.Box = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService), _dec2 = (0, _aureliaFramework.computedFrom)('item', 'item.x', 'item.y'), _dec3 = (0, _aureliaFramework.computedFrom)('dnd', 'dnd.model', 'dnd.isProcessing', 'dnd.canDrop', 'dnd.isHoveringShallowly'), _dec(_class = (_class2 = function () {
    function Box(dndService) {
      _classCallCheck(this, Box);

      _initDefineProp(this, 'item', _descriptor, this);

      this.dndService = dndService;
    }

    Box.prototype.attached = function attached() {
      this.dndService.addSource(this, { noPreview: true });
      this.dndService.addTarget(this);
    };

    Box.prototype.detached = function detached() {
      this.dndService.removeSource(this);
      this.dndService.removeTarget(this);
    };

    Box.prototype.dndModel = function dndModel() {
      return {
        type: 'moveItem',
        id: this.item.id
      };
    };

    Box.prototype.dndCanDrop = function dndCanDrop(model) {
      return model.type === 'addDollar';
    };

    Box.prototype.dndDrop = function dndDrop() {
      var type = this.dnd.model.type;


      if (type === 'addDollar') {
        this.item.dollars += 1;
      }
    };

    _createClass(Box, [{
      key: 'positionCss',
      get: function get() {
        var x = this.item && this.item.x || 0;
        var y = this.item && this.item.y || 0;

        return {
          left: x + 'px',
          top: y + 'px'
        };
      }
    }, {
      key: 'dndCss',
      get: function get() {
        if (!this.dnd) return '';
        var _dnd = this.dnd,
            model = _dnd.model,
            isProcessing = _dnd.isProcessing,
            canDrop = _dnd.canDrop,
            isHoveringShallowly = _dnd.isHoveringShallowly;

        if (!isProcessing) return '';

        if (model.type === 'moveItem') return '';
        var css = '';
        if (canDrop) {
          css += 'can-drop';
        } else {
          css += 'can-not-drop';
        }
        if (isHoveringShallowly) css += ' shallow-hover';
        return css;
      }
    }]);

    return Box;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'item', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, 'positionCss', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'positionCss'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'dndCss', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'dndCss'), _class2.prototype)), _class2)) || _class);
});
define('move-plus-add/container',['exports', 'aurelia-framework', 'bcx-aurelia-dnd', 'aurelia-event-aggregator', 'lodash'], function (exports, _aureliaFramework, _bcxAureliaDnd, _aureliaEventAggregator, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Container = undefined;

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

  var Container = exports.Container = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService, _aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.computedFrom)('items', 'intention'), _dec3 = (0, _aureliaFramework.computedFrom)('dnd', 'dnd.model', 'dnd.isProcessing', 'dnd.canDrop', 'dnd.isHoveringShallowly'), _dec(_class = (_class2 = function () {
    function Container(dndService, ea) {
      _classCallCheck(this, Container);

      this.items = [{ id: '0', dollars: 1, x: 20, y: 20 }, { id: '1', dollars: 1, x: 50, y: 200 }, { id: '2', dollars: 1, x: 200, y: 100 }];

      this.dndService = dndService;
      this.ea = ea;
    }

    Container.prototype.attached = function attached() {
      var _this = this;

      this.dndService.addTarget(this);
      this.subscribers = [this.ea.subscribe('dnd:willStart', function () {
        return _this.resetIntention();
      }), this.ea.subscribe('dnd:didEnd', function () {
        return _this.resetIntention();
      })];
    };

    Container.prototype.detached = function detached() {
      this.dndService.removeTarget(this);
      this.subscribers.forEach(function (s) {
        return s.dispose();
      });
    };

    Container.prototype.dndCanDrop = function dndCanDrop(model) {
      return model.type === 'moveItem' || model.type === 'addItem';
    };

    Container.prototype.dndDrop = function dndDrop(location) {
      var _dnd$model = this.dnd.model,
          type = _dnd$model.type,
          id = _dnd$model.id;

      var newLoc = location.previewElementOffsetInTargetElement;

      if (type === 'moveItem') {
        var idx = _lodash2.default.findIndex(this.items, { id: id });
        if (idx < 0) return;

        var newItem = _extends({}, this.items[idx], newLoc);

        this.items.splice(idx, 1);
        this.items.push(newItem);
      } else if (type === 'addItem') {
        this.items.push(_extends({
          id: '' + this.items.length,
          dollars: 1
        }, newLoc));
      }
    };

    Container.prototype.dndHover = function dndHover(location) {
      var _dnd$model2 = this.dnd.model,
          type = _dnd$model2.type,
          id = _dnd$model2.id;

      var newLoc = location.previewElementOffsetInTargetElement;

      if (type === 'moveItem') {
        var item = _lodash2.default.find(this.items, { id: id });
        if (!item) return;

        this.intention = { id: id, x: newLoc.x, y: newLoc.y };
      }
    };

    Container.prototype.resetIntention = function resetIntention() {
      this.intention = null;
    };

    _createClass(Container, [{
      key: 'patchedItems',
      get: function get() {
        var items = this.items,
            intention = this.intention;

        if (!intention) return items;

        var patched = _lodash2.default.reject(items, { id: intention.id });
        var item = _lodash2.default.find(this.items, { id: intention.id });

        if (item) {
          patched.push(_extends({}, item, { x: intention.x, y: intention.y }));
        }

        return patched;
      }
    }, {
      key: 'dndCss',
      get: function get() {
        if (!this.dnd) return '';
        var _dnd = this.dnd,
            model = _dnd.model,
            isProcessing = _dnd.isProcessing,
            canDrop = _dnd.canDrop,
            isHoveringShallowly = _dnd.isHoveringShallowly;

        if (!isProcessing) return '';

        if (model.type === 'moveItem') return '';
        var css = '';
        if (canDrop) {
          css += 'can-drop';
        } else {
          css += 'can-not-drop';
        }
        if (isHoveringShallowly) css += ' shallow-hover';
        return css;
      }
    }]);

    return Container;
  }(), (_applyDecoratedDescriptor(_class2.prototype, 'patchedItems', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'patchedItems'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'dndCss', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'dndCss'), _class2.prototype)), _class2)) || _class);
});
define('move-plus-add/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Index = exports.Index = function Index() {
    _classCallCheck(this, Index);

    this.sourceFilenames = ['src/move-plus-add/container.js', 'src/move-plus-add/container.html', 'src/move-plus-add/container.css', 'src/move-plus-add/target-effect.css', 'src/move-plus-add/box.js', 'src/move-plus-add/box.html', 'src/move-plus-add/box.css', 'src/move-plus-add/add-box.js', 'src/move-plus-add/add-box.html', 'src/move-plus-add/add-source.css', 'src/move-plus-add/add-money.js', 'src/move-plus-add/add-money.html'];
  };
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./elements/display-source', './elements/display-sources', './elements/mark-down', './elements/show-mark-down-file', './value-converters/nav-section']);
  }
});
define('simple-move/box',['exports', 'aurelia-framework', 'bcx-aurelia-dnd'], function (exports, _aureliaFramework, _bcxAureliaDnd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Box = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var Box = exports.Box = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService), _dec2 = (0, _aureliaFramework.computedFrom)('item', 'item.x', 'item.y'), _dec3 = (0, _aureliaFramework.computedFrom)('dndService.isProcessing', 'dndService.model'), _dec(_class = (_class2 = function () {
    function Box(dndService) {
      _classCallCheck(this, Box);

      _initDefineProp(this, 'item', _descriptor, this);

      this.dndService = dndService;
    }

    Box.prototype.attached = function attached() {
      this.dndService.addSource(this);
    };

    Box.prototype.detached = function detached() {
      this.dndService.removeSource(this);
    };

    Box.prototype.dndModel = function dndModel() {
      return {
        type: 'moveItem',
        item: this.item
      };
    };

    _createClass(Box, [{
      key: 'positionCss',
      get: function get() {
        var x = this.item && this.item.x || 0;
        var y = this.item && this.item.y || 0;

        return {
          left: x + 'px',
          top: y + 'px'
        };
      }
    }, {
      key: 'draggingMe',
      get: function get() {
        return this.dndService.isProcessing && this.dndService.model.item === this.item;
      }
    }]);

    return Box;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'item', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, 'positionCss', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'positionCss'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'draggingMe', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'draggingMe'), _class2.prototype)), _class2)) || _class);
});
define('simple-move/container',['exports', 'aurelia-framework', 'bcx-aurelia-dnd'], function (exports, _aureliaFramework, _bcxAureliaDnd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Container = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Container = exports.Container = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService), _dec(_class = function () {
    function Container(dndService) {
      _classCallCheck(this, Container);

      this.items = [{ name: 'A', x: 20, y: 20 }, { name: 'B', x: 50, y: 200 }, { name: 'C', x: 200, y: 100 }];

      this.dndService = dndService;
    }

    Container.prototype.attached = function attached() {
      this.dndService.addTarget(this);
    };

    Container.prototype.detached = function detached() {
      this.dndService.removeTarget(this);
    };

    Container.prototype.dndCanDrop = function dndCanDrop(model) {
      return model.type === 'moveItem';
    };

    Container.prototype.dndDrop = function dndDrop(location) {
      var item = this.dnd.model.item;

      var newLoc = location.previewElementOffsetInTargetElement;
      item.x = newLoc.x;
      item.y = newLoc.y;

      var idx = this.items.indexOf(item);
      if (idx >= 0) {
        this.items.splice(idx, 1);
        this.items.push(item);
      }
    };

    return Container;
  }()) || _class);
});
define('simple-move/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Index = exports.Index = function Index() {
    _classCallCheck(this, Index);

    this.sourceFilenames = ['src/simple-move/container.js', 'src/simple-move/container.html', 'src/simple-move/container.css', 'src/simple-move/box.js', 'src/simple-move/box.html', 'src/simple-move/box.css'];
  };
});
define('simple-move-hover-no-preview/box',['exports', 'aurelia-framework', 'bcx-aurelia-dnd'], function (exports, _aureliaFramework, _bcxAureliaDnd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Box = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor;

  var Box = exports.Box = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService), _dec2 = (0, _aureliaFramework.computedFrom)('item', 'item.x', 'item.y'), _dec(_class = (_class2 = function () {
    function Box(dndService) {
      _classCallCheck(this, Box);

      _initDefineProp(this, 'item', _descriptor, this);

      this.dndService = dndService;
    }

    Box.prototype.attached = function attached() {
      this.dndService.addSource(this, { noPreview: true });
    };

    Box.prototype.detached = function detached() {
      this.dndService.removeSource(this);
    };

    Box.prototype.dndModel = function dndModel() {
      return {
        type: 'moveItem',
        id: this.item.id
      };
    };

    _createClass(Box, [{
      key: 'positionCss',
      get: function get() {
        var x = this.item && this.item.x || 0;
        var y = this.item && this.item.y || 0;

        return {
          left: x + 'px',
          top: y + 'px'
        };
      }
    }]);

    return Box;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'item', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, 'positionCss', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'positionCss'), _class2.prototype)), _class2)) || _class);
});
define('simple-move-hover-no-preview/container',['exports', 'aurelia-framework', 'bcx-aurelia-dnd', 'aurelia-event-aggregator', 'lodash'], function (exports, _aureliaFramework, _bcxAureliaDnd, _aureliaEventAggregator, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Container = undefined;

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _dec2, _class, _desc, _value, _class2;

  var Container = exports.Container = (_dec = (0, _aureliaFramework.inject)(_bcxAureliaDnd.DndService, _aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.computedFrom)('items', 'intention'), _dec(_class = (_class2 = function () {
    function Container(dndService, ea) {
      _classCallCheck(this, Container);

      this.items = [{ id: 'a', name: 'A', x: 20, y: 20 }, { id: 'b', name: 'B', x: 50, y: 200 }, { id: 'c', name: 'C', x: 200, y: 100 }];

      this.dndService = dndService;
      this.ea = ea;
    }

    Container.prototype.attached = function attached() {
      var _this = this;

      this.dndService.addTarget(this);
      this.subscribers = [this.ea.subscribe('dnd:willStart', function () {
        return _this.resetIntention();
      }), this.ea.subscribe('dnd:didEnd', function () {
        return _this.resetIntention();
      })];
    };

    Container.prototype.detached = function detached() {
      this.dndService.removeTarget(this);
      this.subscribers.forEach(function (s) {
        return s.dispose();
      });
    };

    Container.prototype.dndCanDrop = function dndCanDrop(model) {
      return model.type === 'moveItem';
    };

    Container.prototype.dndDrop = function dndDrop(location) {
      var id = this.dnd.model.id;

      var newLoc = location.previewElementOffsetInTargetElement;

      var idx = _lodash2.default.findIndex(this.items, { id: id });
      if (idx < 0) return;

      var newItem = _extends({}, this.items[idx], newLoc);

      this.items.splice(idx, 1);
      this.items.push(newItem);
    };

    Container.prototype.dndHover = function dndHover(location) {
      var id = this.dnd.model.id;

      var newLoc = location.previewElementOffsetInTargetElement;

      var item = _lodash2.default.find(this.items, { id: id });
      if (!item) return;

      this.intention = { id: id, x: newLoc.x, y: newLoc.y };
    };

    Container.prototype.resetIntention = function resetIntention() {
      this.intention = null;
    };

    _createClass(Container, [{
      key: 'patchedItems',
      get: function get() {
        var items = this.items,
            intention = this.intention;

        if (!intention) return items;

        var patched = _lodash2.default.reject(items, { id: intention.id });
        var item = _lodash2.default.find(this.items, { id: intention.id });

        if (item) {
          patched.push(_extends({}, item, { x: intention.x, y: intention.y }));
        }

        return patched;
      }
    }]);

    return Container;
  }(), (_applyDecoratedDescriptor(_class2.prototype, 'patchedItems', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'patchedItems'), _class2.prototype)), _class2)) || _class);
});
define('simple-move-hover-no-preview/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Index = exports.Index = function Index() {
    _classCallCheck(this, Index);

    this.sourceFilenames = ['src/simple-move-hover-no-preview/container.js', 'src/simple-move-hover-no-preview/container.html', 'src/simple-move-hover-no-preview/container.css', 'src/simple-move-hover-no-preview/box.js', 'src/simple-move-hover-no-preview/box.html', 'src/simple-move-hover-no-preview/box.css'];
  };
});
define('resources/elements/display-source',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DisplaySource = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var DisplaySource = exports.DisplaySource = (_class = function () {
    function DisplaySource() {
      _classCallCheck(this, DisplaySource);

      _initDefineProp(this, 'filename', _descriptor, this);
    }

    DisplaySource.prototype.bind = function bind() {
      this.reloadContent();
    };

    DisplaySource.prototype.filenameChanged = function filenameChanged() {
      this.reloadContent();
    };

    DisplaySource.prototype.reloadContent = function reloadContent() {
      var _this = this;

      this.fileContent = null;
      require(['text!../' + this.filename], function (content) {
        return _this.fileContent = content;
      });
    };

    return DisplaySource;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'filename', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('resources/elements/display-sources',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DisplaySources = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var DisplaySources = exports.DisplaySources = (_class = function () {
    function DisplaySources() {
      _classCallCheck(this, DisplaySources);

      _initDefineProp(this, 'filenames', _descriptor, this);
    }

    DisplaySources.prototype.bind = function bind() {
      if (this.filenames && this.filenames.length) {
        this.selected = this.filenames[0];
      }
    };

    return DisplaySources;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'filenames', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('resources/elements/mark-down',['exports', 'aurelia-framework', 'showdown'], function (exports, _aureliaFramework, _showdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MarkDown = undefined;

  var _showdown2 = _interopRequireDefault(_showdown);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var MarkDown = exports.MarkDown = (_class = function () {
    function MarkDown() {
      _classCallCheck(this, MarkDown);

      _initDefineProp(this, 'value', _descriptor, this);

      this.converter = new _showdown2.default.Converter();
    }

    MarkDown.prototype.valueChanged = function valueChanged(newValue, oldValue) {
      this.html = this.converter.makeHtml(newValue);
    };

    return MarkDown;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'value', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('resources/elements/show-mark-down-file',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ShowMarkDownFile = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var ShowMarkDownFile = exports.ShowMarkDownFile = (_class = function () {
    function ShowMarkDownFile() {
      _classCallCheck(this, ShowMarkDownFile);

      _initDefineProp(this, 'filename', _descriptor, this);

      this.markdown = '';
    }

    ShowMarkDownFile.prototype.bind = function bind() {
      this.reloadContent(this.filename);
    };

    ShowMarkDownFile.prototype.filenameChanged = function filenameChanged(newFilename) {
      this.reloadContent(newFilename);
    };

    ShowMarkDownFile.prototype.reloadContent = function reloadContent(filename) {
      var _this = this;

      this.markdown = '';
      require(['text!' + filename], function (content) {
        return _this.markdown = content;
      });
    };

    return ShowMarkDownFile;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'filename', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('resources/value-converters/nav-section',['exports', 'lodash'], function (exports, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NavSectionValueConverter = undefined;

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NavSectionValueConverter = exports.NavSectionValueConverter = function () {
    function NavSectionValueConverter() {
      _classCallCheck(this, NavSectionValueConverter);
    }

    NavSectionValueConverter.prototype.toView = function toView(navs, section) {
      return _lodash2.default.filter(navs, function (n) {
        return _lodash2.default.get(n, 'settings.section') === section;
      });
    };

    return NavSectionValueConverter;
  }();
});
define('text!app.css', ['module'], function(module) { module.exports = "html, body {\n  height :100%;\n  font-family: Helvetica, Arial;\n}\n\nbody {\n  position: relative;\n  min-width: 750px;\n}\n\n.doc-navigation {\n  box-sizing: border-box;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 150px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  background-color: #eee;\n  padding: 5px;\n}\n\n.doc-navigation .title {\n  text-align: center;\n  font-weight: bold;\n  margin-top: 10px;\n}\n\n.doc-navigation a.remote-link,\n.doc-navigation a.remote-link:visited {\n  display: block;\n  text-decoration: none;\n  color: black;\n  padding: 2px;\n  padding-left: 10px;\n  font-size: 0.7rem;\n  margin: 4px 0;\n}\n\n\na.link {\n  display: block;\n  text-decoration: none;\n  font-size: 0.8rem;\n}\n\na.link, a.link:visited {\n  display: block;\n  color: black;\n  padding: 5px;\n  padding-left: 10px;\n  margin: 8px 0;\n}\n\n.doc-navigation a.remote-link:hover,\na.link:hover {\n  text-decoration: underline;\n}\n\na.link.active {\n  background-color: #555;\n  color: white;\n}\n\n.doc-content {\n  position: absolute;\n  top: 0;\n  left: 150px;\n  bottom: 0;\n  right: 0;\n  padding: 10px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.doc-demo {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 400px;\n  padding: 10px;\n  box-sizing: border-box;\n}\n\n.doc-source-code {\n  position: absolute;\n  top: 400px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border-top: 2px solid #eee;\n  box-sizing: border-box;\n}\n\n.doc-source-code select {\n  margin: 5px 0 0 5px;\n}\n\n.doc-source-code display-source {\n  display: block;\n  position: absolute;\n  top: 30px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 5px;\n}\n\ndisplay-source pre {\n  font-size: 0.9rem;\n}"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"normalize.css\"></require>\n  <require from=\"./app.css\"></require>\n\n  <div class=\"doc-navigation\">\n    <div class=\"title\">bcx-aurelia-dnd</div>\n\n    <a href=\"https://github.com/buttonwoodcx/bcx-aurelia-dnd\" class=\"remote-link\">» GitHub Repository</a>\n\n    <h4><em>Tutorial</em></h4>\n\n    <a\n      repeat.for=\"row of router.navigation | navSection:'tutorial'\"\n      class=\"link ${row.isActive ? 'active' : ''}\"\n      href.bind=\"row.href\"\n    >${row.title}</a>\n\n    <h4><em>Examples</em></h4>\n\n    <a\n      repeat.for=\"row of router.navigation | navSection:'examples'\"\n      class=\"link ${row.isActive ? 'active' : ''}\"\n      href.bind=\"row.href\"\n    >${row.title}</a>\n  </div>\n\n  <div class=\"doc-content\">\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!normalize.css', ['module'], function(module) { module.exports = "/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: sans-serif; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}"; });
define('text!show-tutorial.html', ['module'], function(module) { module.exports = "<template>\n  <show-mark-down-file filename.bind=\"filename\"></show-mark-down-file>\n</template>"; });
define('text!draw/canvas-container.html', ['module'], function(module) { module.exports = "<template>\n  <p>Draw lines in canvas</p>\n\n  <svg ref=\"dndElement\" width=\"300\" height=\"300\">\n    <rect\n      x=\"0\" y=\"0\" width=\"300\" height=\"300\" stroke=\"#555\" stroke-width=\"1\"\n      fill=\"transparent\"\n    ></rect>\n\n    <line\n      repeat.for=\"line of lines\"\n      x1.bind=\"line.from.x\"\n      y1.bind=\"line.from.y\"\n      x2.bind=\"line.to.x\"\n      y2.bind=\"line.to.y\"\n      stroke=\"#333\"\n    ></line>\n\n    <line\n      if.bind=\"drawingLine\"\n      x1.bind=\"drawingLine.from.x\"\n      y1.bind=\"drawingLine.from.y\"\n      x2.bind=\"drawingLine.to.x\"\n      y2.bind=\"drawingLine.to.y\"\n      stroke=\"blue\"\n    ></line>\n  </svg>\n</template>\n"; });
define('text!move-plus-add/add-source.css', ['module'], function(module) { module.exports = ".example-add-source {\n  display: inline-block;\n  border: 1px solid #555;\n  box-sizing: border-box;\n  padding: 5px;\n  cursor: pointer;\n}\n\n.dollar {\n  display: block;\n  font-size: 2rem;\n  font-weight: bold;\n  width: auto;\n  height: auto;\n}\n\n.dollar:before {\n  content: '$';\n}\n\n/* overwrite default style of dnd preview */\n.bcx-dnd-preview.dollar {\n  opacity: 1;\n  box-shadow: none;\n}\n"; });
define('text!draw/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./canvas-container\"></require>\n\n  <div class=\"doc-demo\">\n    <canvas-container></canvas-container>\n  </div>\n  <div class=\"doc-source-code\">\n    <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n  </div>\n</template>\n"; });
define('text!move-plus-add/box.css', ['module'], function(module) { module.exports = ".example-box {\n  position: absolute;\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 80px;\n  height: 40px;\n  border: 1px dotted #555;\n  padding: 0.5rem;\n  background: white;\n}"; });
define('text!move-plus-add/container.css', ['module'], function(module) { module.exports = ".example-container {\n  position: relative;\n  box-sizing: border-box;\n  width: 300px;\n  height: 300px;\n  border: 1px solid #555;\n  overflow: hidden;\n}"; });
define('text!move-plus-add/add-box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./add-source.css\"></require>\n  <div ref=\"dndElement\" class=\"example-add-source\">\n    Add Box\n  </div>\n</template>"; });
define('text!move-plus-add/target-effect.css', ['module'], function(module) { module.exports = ".can-drop, .example-box.can-drop {\n  background-color: lightgreen;\n}\n\n.can-drop.shallow-hover {\n  outline: 3px solid green;\n}\n\n.can-not-drop, .example-box.can-not-drop {\n  background-color: lightgrey;\n}"; });
define('text!move-plus-add/add-money.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./add-source.css\"></require>\n  <div ref=\"dndElement\" class=\"example-add-source\">\n    Add money\n  </div>\n</template>\n"; });
define('text!simple-move/box.css', ['module'], function(module) { module.exports = ".example-box {\n  position: absolute;\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 80px;\n  height: 40px;\n  border: 1px dotted #555;\n  background: white;\n}"; });
define('text!move-plus-add/box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./box.css\"></require>\n  <require from=\"./target-effect.css\"></require>\n\n  <div\n    ref=\"dndElement\"\n    class=\"example-box ${dndCss}\"\n    style.bind=\"positionCss\"\n  >\n    $${item.dollars}\n  </div>\n</template>"; });
define('text!simple-move/container.css', ['module'], function(module) { module.exports = ".example-container {\n  position: relative;\n  box-sizing: border-box;\n  width: 300px;\n  height: 300px;\n  border: 1px solid #555;\n  overflow: hidden;\n}"; });
define('text!move-plus-add/container.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container.css\"></require>\n  <require from=\"./target-effect.css\"></require>\n  <require from=\"./box\"></require>\n  <require from=\"./add-box\"></require>\n  <require from=\"./add-money\"></require>\n\n  <add-box></add-box>\n  <add-money></add-money>\n  <br><br>\n\n  <div ref=\"dndElement\" class=\"example-container ${dndCss}\">\n    <box repeat.for=\"item of patchedItems\" item.bind=\"item\"></box>\n  </div>\n</template>\n"; });
define('text!simple-move-hover-no-preview/box.css', ['module'], function(module) { module.exports = ".example-box {\n  position: absolute;\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 80px;\n  height: 40px;\n  border: 1px dotted #555;\n  background: white;\n}"; });
define('text!move-plus-add/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container\"></require>\n\n  <div class=\"doc-demo\">\n    <container></container>\n  </div>\n  <div class=\"doc-source-code\">\n    <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n  </div>\n</template>\n"; });
define('text!simple-move-hover-no-preview/container.css', ['module'], function(module) { module.exports = ".example-container {\n  position: relative;\n  box-sizing: border-box;\n  width: 300px;\n  height: 300px;\n  border: 1px solid #555;\n  overflow: hidden;\n}"; });
define('text!simple-move/box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./box.css\"></require>\n\n  <div\n    ref=\"dndElement\"\n    class=\"example-box\"\n    style.bind=\"positionCss\"\n    show.bind=\"!draggingMe\"\n  >\n    ${item.name}\n  </div>\n</template>"; });
define('text!simple-move/container.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container.css\"></require>\n  <require from=\"./box\"></require>\n\n  <div ref=\"dndElement\" class=\"example-container\">\n    <box repeat.for=\"item of items\" item.bind=\"item\"></box>\n  </div>\n</template>\n"; });
define('text!simple-move/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container\"></require>\n\n  <div class=\"doc-demo\">\n    <container></container>\n  </div>\n  <div class=\"doc-source-code\">\n    <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n  </div>\n</template>\n"; });
define('text!simple-move-hover-no-preview/box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./box.css\"></require>\n\n  <div\n    ref=\"dndElement\"\n    class=\"example-box\"\n    style.bind=\"positionCss\"\n  >\n    ${item.name}\n  </div>\n</template>"; });
define('text!simple-move-hover-no-preview/container.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container.css\"></require>\n  <require from=\"./box\"></require>\n\n  <div ref=\"dndElement\" class=\"example-container\">\n    <box repeat.for=\"item of patchedItems\" item.bind=\"item\"></box>\n  </div>\n</template>\n"; });
define('text!simple-move-hover-no-preview/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container\"></require>\n\n  <div class=\"doc-demo\">\n    <container></container>\n  </div>\n  <div class=\"doc-source-code\">\n    <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n  </div>\n</template>\n"; });
define('text!resources/elements/display-source.html', ['module'], function(module) { module.exports = "<template>\n  <pre>${fileContent}</pre>\n</template>\n"; });
define('text!resources/elements/display-sources.html', ['module'], function(module) { module.exports = "<template>\n  <select  value.bind=\"selected\">\n    <option repeat.for=\"filename of filenames\" model.bind=\"filename\">${filename}</option>\n  </select>\n  <display-source if.bind=\"selected\" filename.bind=\"selected\"></display-source>\n</template>\n"; });
define('text!resources/elements/mark-down.html', ['module'], function(module) { module.exports = "<template>\n  <div innerhtml.bind=\"html | sanitizeHTML\"></div>\n</template>"; });
define('text!resources/elements/show-mark-down-file.html', ['module'], function(module) { module.exports = "<template>\n  <mark-down value.bind=\"markdown\"></mark-down>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map