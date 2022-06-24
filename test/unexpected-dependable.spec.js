import { observable, computed } from "@dependable/state";
import unexpected from "unexpected";
import unexpectedDependable from "../lib/unexpected-dependable.js";

const expect = unexpected.clone().use(unexpectedDependable);

describe("unexpected-knockout", () => {
  expect.output.preferredWidth = 150;

  describe("to equal", () => {
    it("succeeds when the subject and the argument are observables with equal values", function () {
      expect(observable(42), "to equal", observable(42));

      expect(
        observable({ foo: 42, bar: 24 }),
        "to equal",
        observable({ foo: 42, bar: 24 })
      );

      expect(
        observable(observable(42)),
        "to equal",
        observable(observable(42))
      );
      expect(
        observable(observable(42)),
        "not to equal",
        observable(observable(24))
      );

      expect(
        observable({
          foo: observable(42),
        }),
        "to equal",
        observable({
          foo: observable(42),
        })
      );

      expect(
        computed(() => 42),
        "to equal",
        computed(() => 42)
      );

      expect(
        computed(() => computed(() => 42)),
        "to equal",
        computed(() => computed(() => 42))
      );
    });

    it("fails when the subject and the argument are not equal", () => {
      expect(
        () => {
          expect(
            computed(() => computed(() => 42)),
            "to equal",
            computed(() => computed(() => 24))
          );
        },
        "to throw",
        "expected computed(computed(42)) to equal computed(computed(24))\n" +
          "\n" +
          "computed(computed(\n" +
          "  42 // should equal 24\n" +
          "))"
      );

      expect(
        () => {
          expect(
            observable(observable(42)),
            "to equal",
            observable(observable(24))
          );
        },
        "to throw",
        "expected observable(observable(42)) to equal observable(observable(24))\n" +
          "\n" +
          "observable(observable(\n" +
          "  42 // should equal 24\n" +
          "))"
      );
    });

    it("handles circular structures", () => {
      const x = observable();
      x({ foo: x });
      const y = observable();
      y({ foo: y });

      expect(
        () => {
          expect(x, "to equal", y);
        },
        "to throw",
        "Cannot compare circular structures"
      );
    });
  });

  describe("not to equal", () => {
    it("succeeds when the subject and argument the are observables with values that are not equal", () => {
      expect(observable(42), "not to equal", observable(24));
      expect(
        observable({ foo: 42, bar: 23 }),
        "not to equal",
        observable({ foo: 42, bar: 24 })
      );
      expect(observable({ foo: 42, bar: 23 }), "not to equal", 42);

      expect(
        observable({
          foo: observable(42),
        }),
        "not to equal",
        observable({
          foo: observable(24),
        })
      );

      expect(
        observable({
          foo: observable(42),
        }),
        "not to equal",
        observable({
          bar: observable(42),
        })
      );

      expect(
        computed(() => 42),
        "not to equal",
        computed(() => 24)
      );

      expect(
        computed(() => computed(() => 42)),
        "not to equal",
        computed(() => computed(() => 24))
      );

      expect(
        computed(() => computed(() => 42)),
        "not to equal",
        computed(() => observable(() => 42))
      );
    });

    it("succeeds when the subject is observable and the arguments is not observable", () => {
      expect(observable(42), "not to equal", 24);
    });

    it("succeeds when the subject is not observable and the arguments is observable", () => {
      expect(42, "not to equal", observable(24));
    });

    it("fails when the subject and the argument are equal", () => {
      expect(
        () => {
          expect(
            computed(() => computed(() => 42)),
            "not to equal",
            computed(() => computed(() => 42))
          );
        },
        "to throw",
        "expected computed(computed(42)) not to equal computed(computed(42))"
      );

      expect(
        () => {
          expect(
            observable(observable(42)),
            "not to equal",
            observable(observable(42))
          );
        },
        "to throw",
        "expected observable(observable(42)) not to equal observable(observable(42))"
      );
    });
  });

  describe("to have properties", () => {
    it("succeeds if all the properties in the given object has an equal value in the subject", () => {
      // This is just an example of how things compose
      expect(
        {
          foo: observable(42),
          bar: observable(42),
          baz: 42,
        },
        "to have properties",
        {
          foo: observable(42),
          baz: 42,
        }
      );
    });
  });

  it.only("provides custom inspection for observables", () => {
    expect(
      () => {
        expect(observable(42), "to equal", observable(24));
      },
      "to throw",
      "expected observable(42) to equal observable(24)\n" +
        "\n" +
        "observable(\n" +
        "  42 // should equal 24\n" +
        ")"
    );
  });

  describe("to be observable", () => {
    it("succeeds if subject is a Knockout observable", () => {
      expect(observable(42), "to be observable");
    });

    it("succeeds if the subject is a Knockout computed observables", () => {
      expect(
        computed(() => 42),
        "to be observable"
      );
    });

    it("fails if the subject is not a Knockout observable", () => {
      expect(
        () => {
          expect(42, "to be observable");
        },
        "to throw",
        "expected 42 to be observable"
      );
    });
  });

  describe("not to be observable", () => {
    it("succeeds if subject is not a Knockout observable", () => {
      expect(42, "not to be observable");
    });

    it("fails if the subject is a Knockout observable", () => {
      expect(
        () => {
          expect(observable(42), "not to be observable");
        },
        "to throw",
        "expected observable(42) not to be observable"
      );

      expect(
        () => {
          expect(
            computed(() => 42),
            "not to be observable"
          );
        },
        "to throw",
        "expected computed(42) not to be observable"
      );
    });
  });

  describe("to be computed", () => {
    it("succeeds if subject is a Knockout computed observable", () => {
      expect(
        computed(() => 42),
        "to be computed"
      );
    });

    it("fails if the subject is not a Knockout computed observable", () => {
      expect(
        () => {
          expect(42, "to be computed");
        },
        "to throw",
        "expected 42 to be computed"
      );

      expect(
        () => {
          expect(observable(42), "to be computed");
        },
        "to throw",
        "expected observable(42) to be computed"
      );
    });
  });

  describe("not to be computed", () => {
    it("succeeds if subject is not a Knockout computed observable", () => {
      expect(42, "not to be computed");
      expect(observable(42), "not to be computed");
    });

    it("fails if the subject is a Knockout computed observable", () => {
      expect(
        () => {
          expect(
            computed(() => 42),
            "not to be computed"
          );
        },
        "to throw",
        "expected computed(42) not to be computed"
      );
    });
  });
});
