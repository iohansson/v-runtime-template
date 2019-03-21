const defineDescriptor = (src, dest, name) => {
  if (!dest.hasOwnProperty(name)) {
    const descriptor = Object.getOwnPropertyDescriptor(src, name);
    Object.defineProperty(dest, name, descriptor);
  }
};

const merge = objs => {
  const res = {};
  objs.forEach(obj => {
    obj &&
      Object.getOwnPropertyNames(obj).forEach(name =>
        defineDescriptor(obj, res, name)
      );
  });
  return res;
};

const buildFromProps = (obj, props) => {
  const res = {};
  props.forEach(prop => defineDescriptor(obj, res, prop));
  return res;
};

export default {
  props: {
    template: String
  },
  render(h) {
    if (this.template) {
      const { $data = {}, $props = {}, $options = {} } = this.$parent;

      let passthrough = {$data:{}, $props:{}, components:{}, computed:{}, methods:{}};
      const optionKeys = [];

      //build new objects by removing keys if already exists (e.g. created by mixins)
      Object.keys($data).forEach(e => {if(typeof this.$data[e]==='undefined') passthrough.$data[e] = $data[e];} );
      Object.keys($props).forEach(e => {if(typeof this.$props[e]==='undefined') passthrough.$props[e] = $props[e];} );
      Object.keys($options).forEach((optionName) => {
        console.log('processing option', optionName);
        const option = $options[optionName];
        console.log('option value', option);
        if (typeof passthrough[optionName] === 'undefined') passthrough[optionName] = {};
        if (!optionKeys.includes(optionName)) optionKeys.push(optionName);
        Object.keys(option).forEach((e) => {
          if (typeof this.$options[optionName] === 'undefined' || typeof this.$options[optionName][e] === 'undefined') {
            passthrough[optionName][e] = option[e];
          }
        });
      });

      const methodKeys = Object.keys(passthrough.methods || {});
      const dataKeys = Object.keys(passthrough.$data || {});
      const propKeys = Object.keys(passthrough.$props || {});
      const allKeys = dataKeys.concat(propKeys).concat(methodKeys);
      const methodsFromProps = buildFromProps(this.$parent, methodKeys);
      const props = merge([passthrough.$data, passthrough.$props, methodsFromProps]);

      const dynamic = {
        template: this.template || "<div></div>",
        props: allKeys,
      };

      optionKeys.forEach(key => dynamic[key] = passthrough[key]);

      return h(dynamic, {
        props
      });
    }
  }
};
