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
        route: '', name: 'simple',
        title: 'Move object',
        nav: true,
        moduleId: 'simple-move/index'
      }, {
        route: 'simple-move-hover-no-preview', name: 'simple-move-hover-no-preview',
        title: 'Move object, no preview, use dndHover',
        nav: true,
        moduleId: 'simple-move-hover-no-preview/index'
      }, {
        route: 'move-plus-add', name: 'move-plus-add',
        title: 'Move object, add object, customize preview',
        nav: true,
        moduleId: 'move-plus-add/index'
      }, {
        route: 'draw', name: 'draw',
        title: 'Draw in canvas',
        nav: true,
        moduleId: 'draw/index'
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
define('main',['exports', './environment', 'bootstrap'], function (exports, _environment) {
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

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
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

    this.sourceFilenames = ['src/draw/canvas-container.js', 'src/draw/canvas-container.html', 'src/draw/canvas-container.css'];
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
      this.dndService.addSource(this);
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
      var jq = (0, _jquery2.default)('\n      <div class="example-box">A dollar!</div>\n    ');
      jq.css('width', 'auto');
      jq.css('height', 'auto');

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

        this.items.splice(idx, 1, newItem);
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

        return _lodash2.default.map(items, function (item) {
          if (item.id === intention.id) {
            return _extends({}, item, { x: intention.x, y: intention.y });
          }
          return item;
        });
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
    config.globalResources(['./elements/display-source', './elements/display-sources']);
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

      this.items = [{ name: 'A', x: 20, y: 20 }, { name: 'B', x: 50, y: 300 }, { name: 'C', x: 300, y: 100 }];

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

      this.items = [{ id: 'a', name: 'A', x: 20, y: 20 }, { id: 'b', name: 'B', x: 50, y: 300 }, { id: 'c', name: 'C', x: 300, y: 100 }];

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

      this.items.splice(idx, 1, newItem);
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

        return _lodash2.default.map(items, function (item) {
          if (item.id === intention.id) {
            return _extends({}, item, { x: intention.x, y: intention.y });
          }
          return item;
        });
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"col-xs-12 col-md-3\">\n        <div class=\"list-group\">\n          <a\n            repeat.for=\"row of router.navigation\"\n            class=\"list-group-item ${row.isActive ? 'active' : ''}\"\n            href.bind=\"row.href\"\n          >${row.title}</a>\n        </div>\n      </div>\n      <div class=\"col-xs-12 col-md-9\">\n        <router-view></router-view>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!draw/canvas-container.css', ['module'], function(module) { module.exports = ".svg-canvas {\n  position: relative;\n  pointer-events: none;\n}"; });
define('text!draw/canvas-container.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./canvas-container\"></require>\n\n  <p>Draw lines in canvas</p>\n\n  <svg class=\"svg-canvas\" ref=\"dndElement\" width=\"400\" height=\"400\">\n    <rect\n      x=\"0\" y=\"0\" width=\"400\" height=\"400\" stroke=\"#555\" stroke-width=\"1\"\n      fill=\"transparent\"\n    ></rect>\n    <line\n      repeat.for=\"line of lines\"\n      x1.bind=\"line.from.x\"\n      y1.bind=\"line.from.y\"\n      x2.bind=\"line.to.x\"\n      y2.bind=\"line.to.y\"\n      stroke=\"#333\"\n    ></line>\n\n    <line\n      if.bind=\"drawingLine\"\n      x1.bind=\"drawingLine.from.x\"\n      y1.bind=\"drawingLine.from.y\"\n      x2.bind=\"drawingLine.to.x\"\n      y2.bind=\"drawingLine.to.y\"\n      stroke=\"blue\"\n    ></line>\n  </svg>\n</template>\n"; });
define('text!move-plus-add/add-source.css', ['module'], function(module) { module.exports = ".example-add-source {\n  display: inline-block;\n  border: 1px solid #555;\n  box-sizing: border-box;\n}"; });
define('text!draw/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./canvas-container\"></require>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-lg-6\">\n      <canvas-container></canvas-container>\n    </div>\n    <div class=\"col-xs-12 col-lg-6\">\n      <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n    </div>\n  </div>\n</template>\n"; });
define('text!move-plus-add/box.css', ['module'], function(module) { module.exports = ".example-box {\n  position: absolute;\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 80px;\n  height: 40px;\n  border: 1px dotted #555;\n  padding: 0.5rem;\n}"; });
define('text!move-plus-add/add-box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./add-source.css\"></require>\n  <div ref=\"dndElement\" class=\"example-add-source\">\n    Add Box\n  </div>\n</template>"; });
define('text!move-plus-add/container.css', ['module'], function(module) { module.exports = ".example-container {\n  position: relative;\n  box-sizing: border-box;\n  width: 400px;\n  height: 400px;\n  border: 1px solid #555;\n  overflow: hidden;\n}"; });
define('text!move-plus-add/add-money.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./add-source.css\"></require>\n  <div ref=\"dndElement\" class=\"example-add-source\">\n    Add money\n  </div>\n</template>\n"; });
define('text!move-plus-add/target-effect.css', ['module'], function(module) { module.exports = ".can-drop {\n  background-color: lightgreen;\n}\n\n.can-drop.shallow-hover {\n  outline: 3px solid green;\n}\n\n.can-not-drop {\n  background-color: lightgrey;\n}"; });
define('text!move-plus-add/box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./box.css\"></require>\n  <require from=\"./target-effect.css\"></require>\n\n  <div\n    ref=\"dndElement\"\n    class=\"example-box ${dndCss}\"\n    style.bind=\"positionCss\"\n  >\n    $${item.dollars}\n  </div>\n</template>"; });
define('text!simple-move/box.css', ['module'], function(module) { module.exports = ".example-box {\n  position: absolute;\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 80px;\n  height: 40px;\n  border: 1px dotted #555;\n  background: white;\n}"; });
define('text!move-plus-add/container.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container.css\"></require>\n  <require from=\"./target-effect.css\"></require>\n  <require from=\"./box\"></require>\n  <require from=\"./add-box\"></require>\n  <require from=\"./add-money\"></require>\n\n  <add-box></add-box>\n  <add-money></add-money>\n  <br><br>\n\n  <div ref=\"dndElement\" class=\"example-container ${dndCss}\">\n    <box repeat.for=\"item of patchedItems\" item.bind=\"item\"></box>\n  </div>\n</template>\n"; });
define('text!simple-move/container.css', ['module'], function(module) { module.exports = ".example-container {\n  position: relative;\n  box-sizing: border-box;\n  width: 400px;\n  height: 400px;\n  border: 1px solid #555;\n  overflow: hidden;\n}"; });
define('text!move-plus-add/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container\"></require>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-lg-6\">\n      <container></container>\n    </div>\n    <div class=\"col-xs-12 col-lg-6\">\n      <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n    </div>\n  </div>\n</template>\n"; });
define('text!simple-move-hover-no-preview/box.css', ['module'], function(module) { module.exports = ".example-box {\n  position: absolute;\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 80px;\n  height: 40px;\n  border: 1px dotted #555;\n  background: white;\n}"; });
define('text!simple-move/box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./box.css\"></require>\n\n  <div\n    ref=\"dndElement\"\n    class=\"example-box\"\n    style.bind=\"positionCss\"\n    show.bind=\"!draggingMe\"\n  >\n    ${item.name}\n  </div>\n</template>"; });
define('text!simple-move-hover-no-preview/container.css', ['module'], function(module) { module.exports = ".example-container {\n  position: relative;\n  box-sizing: border-box;\n  width: 400px;\n  height: 400px;\n  border: 1px solid #555;\n  overflow: hidden;\n}"; });
define('text!simple-move/container.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container.css\"></require>\n  <require from=\"./box\"></require>\n\n  <div ref=\"dndElement\" class=\"example-container\">\n    <box repeat.for=\"item of items\" item.bind=\"item\"></box>\n  </div>\n</template>\n"; });
define('text!simple-move/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container\"></require>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-lg-6\">\n      <container></container>\n    </div>\n    <div class=\"col-xs-12 col-lg-6\">\n      <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n    </div>\n  </div>\n</template>\n"; });
define('text!simple-move-hover-no-preview/box.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./box.css\"></require>\n\n  <div\n    ref=\"dndElement\"\n    class=\"example-box\"\n    style.bind=\"positionCss\"\n  >\n    ${item.name}\n  </div>\n</template>"; });
define('text!simple-move-hover-no-preview/container.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container.css\"></require>\n  <require from=\"./box\"></require>\n\n  <div ref=\"dndElement\" class=\"example-container\">\n    <box repeat.for=\"item of patchedItems\" item.bind=\"item\"></box>\n  </div>\n</template>\n"; });
define('text!simple-move-hover-no-preview/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./container\"></require>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-lg-6\">\n      <container></container>\n    </div>\n    <div class=\"col-xs-12 col-lg-6\">\n      <display-sources filenames.bind=\"sourceFilenames\"></display-sources>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/elements/display-source.html', ['module'], function(module) { module.exports = "<template>\n  <pre>${fileContent}</pre>\n</template>\n"; });
define('text!resources/elements/display-sources.html', ['module'], function(module) { module.exports = "<template>\n  <form>\n    <div class=\"form-group\">\n      <select class=\"form-control\" value.bind=\"selected\">\n        <option repeat.for=\"filename of filenames\" model.bind=\"filename\">${filename}</option>\n      </select>\n    </div>\n  </form>\n  <display-source if.bind=\"selected\" filename.bind=\"selected\"></display-source>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map