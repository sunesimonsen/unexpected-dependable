export default {
  name: "unexpected-dependable",
  installInto: function (expect) {
    expect.addType({
      name: "dependable-subscribable",
      base: "wrapperObject",
      identify: function (value) {
        return value && ["observable", "computed"].includes(value.kind);
      },
      unwrap: function (subscribable) {
        return subscribable();
      },
      prefix: function (output, value) {
        return output.code(value.kind).code("(");
      },
      suffix: function (output, value) {
        if (value.id) {
          output.code(", { id: '").jsString(value.id).code("' }");
        }
        output.code(")");
        return output;
      },
    });

    expect.addType({
      name: "dependable-observable",
      base: "dependable-subscribable",
      identify: function (value) {
        return value && value.kind === "observable";
      },
      prefix: function (output) {
        return output.code("observable(");
      },
    });

    expect.addType({
      name: "dependable-computed",
      base: "dependable-subscribable",
      identify: function (value) {
        return value && value.kind === "computed";
      },
      prefix: function (output) {
        return output.code("computed(");
      },
    });
  },
};
