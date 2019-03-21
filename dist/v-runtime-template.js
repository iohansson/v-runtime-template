/**
 * v-runtime-template v1.6.3
 * (c) 2019 Alex J <alexjovermorales@gmail.com>
 * @license MIT
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VRuntimeTemplate = factory());
}(this, (function () { 'use strict';

var defineDescriptor = function (src, dest, name) {
  if (!dest.hasOwnProperty(name)) {
    var descriptor = Object.getOwnPropertyDescriptor(src, name);
    Object.defineProperty(dest, name, descriptor);
  }
};

var merge = function (objs) {
  var res = {};
  objs.forEach(function (obj) {
    obj &&
      Object.getOwnPropertyNames(obj).forEach(function (name) { return defineDescriptor(obj, res, name); }
      );
  });
  return res;
};

var buildFromProps = function (obj, props) {
  var res = {};
  props.forEach(function (prop) { return defineDescriptor(obj, res, prop); });
  return res;
};

var index = {
  props: {
    template: String
  },
  render: function render(h) {
    var this$1 = this;

    if (this.template) {
      var ref = this.$parent;
      var $data = ref.$data; if ( $data === void 0 ) $data = {};
      var $props = ref.$props; if ( $props === void 0 ) $props = {};
      var $options = ref.$options; if ( $options === void 0 ) $options = {};

      var passthrough = {$data:{}, $props:{}, components:{}, computed:{}, methods:{}};
      var optionKeys = [];

      //build new objects by removing keys if already exists (e.g. created by mixins)
      Object.keys($data).forEach(function (e) {if(typeof this$1.$data[e]==='undefined') { passthrough.$data[e] = $data[e]; }} );
      Object.keys($props).forEach(function (e) {if(typeof this$1.$props[e]==='undefined') { passthrough.$props[e] = $props[e]; }} );
      Object.keys($options).forEach(function (optionName) {
        if (optionName[0] === '_' || optionName.includes('props')) { return; } // filter internal values and props
        var option = $options[optionName];
        if (typeof option !== 'object' || Array.isArray(option) || option === null) { return; } // filter non-objects

        if (typeof passthrough[optionName] === 'undefined') { passthrough[optionName] = {}; }
        if (!optionKeys.includes(optionName)) { optionKeys.push(optionName); }
        Object.keys(option).forEach(function (e) {
          if (typeof this$1.$options[optionName] === 'undefined' || typeof this$1.$options[optionName][e] === 'undefined') {
            passthrough[optionName][e] = option[e];
          }
        });
      });

      var methodKeys = Object.keys(passthrough.methods || {});
      var dataKeys = Object.keys(passthrough.$data || {});
      var propKeys = Object.keys(passthrough.$props || {});
      var allKeys = dataKeys.concat(propKeys).concat(methodKeys);
      var methodsFromProps = buildFromProps(this.$parent, methodKeys);
      var props = merge([passthrough.$data, passthrough.$props, methodsFromProps]);

      var dynamic = {
        template: this.template || "<div></div>",
        props: allKeys,
      };

      optionKeys.forEach(function (key) { return dynamic[key] = passthrough[key]; });

      return h(dynamic, {
        props: props
      });
    }
  }
};

return index;

})));
