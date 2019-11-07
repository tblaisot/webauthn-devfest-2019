function hideElement(e) {
  e.style.opacity = 0;
}

function setTextContent(e, t) {
  e.textContent = t;
}

function showElement(e) {
  e.style.opacity = 1;
}

const TRANSLATE_REGEX = /translate\(\s*([^\s,\)]+)[ ,]+([^\s,\)]+)/;

const SHOW_HIDE_ENUM = {hide: Symbol(), show: Symbol()};

class SvgAnimator {
  constructor(svgElement) {
    this.svg = svgElement;

    this.elements = {
      dot: svgElement.getElementById("Data-Dot"),
      lineRight: svgElement.getElementById("Line-Right"),
      lineLeft: svgElement.getElementById("Line-Left"),
      textRight: [
        svgElement.getElementById("Text-Right-1"),
        svgElement.getElementById("Text-Right-2"),
        svgElement.getElementById("Text-Right-3")
      ],
      textLeft: [
        svgElement.getElementById("Text-Left-1"),
        svgElement.getElementById("Text-Left-2"),
        svgElement.getElementById("Text-Left-3")
      ],
      check: svgElement.getElementById("Check"),
      countdown: svgElement.querySelector("#Countdown tspan"),
      touchCircles: svgElement.getElementById("Touch-Circles")
    };

    this.states = ANIMATIONS;

    hideElement(this.elements.check);

    this.elements.textRight.forEach(e => setTextContent(e, " "));
    this.elements.textLeft.forEach(e => setTextContent(e, " "));

    hideElement(this.elements.countdown);
    hideElement(this.elements.touchCircles);
    hideElement(this.elements.dot);

    this.checkY = (e => {
      const t = e.getAttribute("transform");
      const capturedGroups = TRANSLATE_REGEX.exec(t);
      return capturedGroups
        ? {x: parseFloat(capturedGroups[1]), y: parseFloat(capturedGroups[2])}
        : {x: 0, y: 0};
    })(this.elements.check).y;
  }

  async trigger(animationName) {
    const animations = this.states[animationName];
    if (!animations) throw new Error(`Unknown state ${animationName}`);
    for (const animation of animations) await this.run(animation);
  }

  async run(animation) {
    const animationsPromises = [];

    if (animation.dot) {
      showElement(this.elements.dot);
      animationsPromises.push(
        anime(
          Object.assign(
            {
              targets: this.elements.dot,
              duration: 1000,
              easing: "easeOutQuad"
            },
            animation.dot
          )
        )
          .finished
          .then(() => hideElement(this.elements.dot))
      );
    }

    if (
      animation.check) {
      animationsPromises.push(
        anime(
          Object.assign(
            {
              targets: this.elements.check,
              translateY: this.checkY,
              duration: 0,
              easing: "linear"
            },
            animation.check
          )
        )
          .finished
      )

    }
    if (animation.textRight) {
      let lines = animation.textRight.split("\n");
      lines.length = 3;
      lines = lines.map(e => e || " ");
      for (let e = 0; e < lines.length; ++e)
        setTextContent(this.elements.textRight[e], lines[e]);
    }

    if (animation.textLeft) {
      let lines = animation.textLeft.split("\n");
      lines.length = 3;
      lines = lines.map(e => e || " ");
      for (let e = 0; e < lines.length; ++e)
        setTextContent(this.elements.textLeft[e], lines[e]);
    }

    if (animation.touchCircles) {
      animation.touchCircles === SHOW_HIDE_ENUM.show
        ? showElement(this.elements.touchCircles)
        : hideElement(this.elements.touchCircles);
    }

    if (animation.countdown === SHOW_HIDE_ENUM.hide) {

      hideElement(this.elements.countdown);
      clearInterval(this.countdownInterval);

    } else if (

      "number" == typeof animation.countdown &&
      animation.countdown > 0

    ) {
      let t = animation.countdown;
      showElement(this.elements.countdown);

      setTextContent(this.elements.countdown, t);

      (this.countdownInterval = setInterval(() => {

        --t;
        setTextContent(this.elements.countdown, t);

        if (t === 0) {
          hideElement(this.elements.countdown);
          clearInterval(this.countdownInterval);
        }
      }, 1000));
    }

    if (animation.wait) {
      animationsPromises.push(new Promise(t => setTimeout(t, animation.wait)))
    }

    return Promise.all(animationsPromises);
  }

  reset() {
    const original = this.svg.parentElement.parentElement.innerHTML;
    this.svg.parentElement.parentElement.innerHTML = original;
  }

  static
  get symbols() {
    return SHOW_HIDE_ENUM;
  }

  static
  get offsets() {
    return {
      dot: {leftStart: 0, leftEnd: 216.5, rightStart: 335, rightEnd: 551.5},
      check: {center: 388, left: {x: 30, y: 56}, right: 730}
    };
  }
}

let m = 15;

const
  ANIMATIONS = {
    "browser-ask-relying-party-for-registration-challenge": [
      {
        check: {
          translateX: SvgAnimator.offsets.check.center,
          opacity: 1
        },
        textRight: " "
      },
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightStart,
            SvgAnimator.offsets.dot.rightEnd
          ]
        },
        textRight: "USERNAME"
      },
      {
        check: {
          translateX: SvgAnimator.offsets.check.right,
          opacity: 1
        }
      }
    ],
    "relying-party-answer-registration-challenge": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightEnd,
            SvgAnimator.offsets.dot.rightStart
          ]
        },
        textRight: "CHALLENGE"
      },
      {
        check: {
          translateX: SvgAnimator.offsets.check.center,
          opacity: 1
        }
      }
    ],
    "browser-ask-authenticator-to-solve-registration-challenge": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.leftEnd,
            SvgAnimator.offsets.dot.leftStart
          ]
        },
        textRight: " ",
        textLeft: "CHALLENGE"
      },
      {
        check: {
          translateX: SvgAnimator.offsets.check.left.x,
          translateY: SvgAnimator.offsets.check.left.y
        },
      }
    ],
    "authenticator-push-button-to-resolve-registration-challenge": [
      {
        countdown: m,
        touchCircles: SvgAnimator.symbols.show,
        textLeft: " "
      }
    ],
    "authenticator-answer-registration-challenge-solution": [
      {
        countdown: SvgAnimator.symbols.hide,
        touchCircles: SvgAnimator.symbols.hide,
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.leftStart,
            SvgAnimator.offsets.dot.leftEnd
          ]
        },
        textLeft: "- SIGNATURE\n- PUBLIC KEY\n- RAW ID"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.center, opacity: 1}
      }
    ],
    "browser-send-registration-challenge-solution-to-relying-party": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightStart,
            SvgAnimator.offsets.dot.rightEnd
          ]
        },
        textLeft: " ",
        textRight: "- CHALLENGE + SIGNATURE\n- PUBLIC KEY\n- RAW ID"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.right, opacity: 1}
      }
    ],
    "relying-party-confirm-registration-to-browser": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightEnd,
            SvgAnimator.offsets.dot.rightStart
          ]
        },
        textRight: "VALIDATED"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.center, opacity: 1}
      },
      {
        check: {
          translateX: SvgAnimator.offsets.check.center,
          opacity: 1
        }
      }
    ],

    "browser-ask-relying-party-for-login-challenge": [
      {
        check: {translateX: SvgAnimator.offsets.check.center, opacity: 1},
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightStart,
            SvgAnimator.offsets.dot.rightEnd
          ]
        },
        textRight: "USERNAME"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.right},
      }
    ],
    "relying-party-anwser-login-challenge": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightEnd,
            SvgAnimator.offsets.dot.rightStart
          ]
        },
        textRight: "- RAWID\n- CHALLENGE"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.center}
      }
    ],
    "browser-ask-authenticator-to-solve-login-challenge": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.leftEnd,
            SvgAnimator.offsets.dot.leftStart
          ]
        },

        textRight: " ",
        textLeft: "- RAWID\n- CHALLENGE"
      },
      {
        check: {
          translateX: SvgAnimator.offsets.check.left.x,
          translateY: SvgAnimator.offsets.check.left.y
        }
      }
    ],
    "authenticator-push-button-to-resolve-login-challenge": [
      {
        countdown: m, touchCircles: SvgAnimator.symbols.show,
        textLeft: " "
      }
    ],
    "authenticator-answer-login-challenge-solution": [
      {
        countdown: SvgAnimator.symbols.hide,
        touchCircles: SvgAnimator.symbols.hide,
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.leftStart,
            SvgAnimator.offsets.dot.leftEnd
          ]
        },
        textLeft: "- CHALLENGE + SIGNATURE\n- RAWID"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.center, opacity: 1}
      }
    ],
    "browser-send-login-challenge-solution-to-relying-party": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightStart,
            SvgAnimator.offsets.dot.rightEnd
          ]
        },

        textLeft: " ",
        textRight: "- CHALLENGE + SIGNATURE\n- RAWID"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.right, opacity: 1},
        textRight: " "
      }
    ],
    "relying-party-confirm-login-to-browser": [
      {
        dot: {
          translateX: [
            SvgAnimator.offsets.dot.rightEnd,
            SvgAnimator.offsets.dot.rightStart
          ]
        },
        textRight: "VALIDATED"
      },
      {
        check: {translateX: SvgAnimator.offsets.check.center, opacity: 1}
      }
    ]
  };

const ANIMATION_ORDER_REGISTRATION = [
  "browser-ask-relying-party-for-registration-challenge",
  "relying-party-answer-registration-challenge",
  "browser-ask-authenticator-to-solve-registration-challenge",
  "authenticator-push-button-to-resolve-registration-challenge",
  "authenticator-answer-registration-challenge-solution",
  "browser-send-registration-challenge-solution-to-relying-party",
  "relying-party-confirm-registration-to-browser",
];
const ANIMATION_ORDER_LOGIN = [
  "browser-ask-relying-party-for-login-challenge",
  "relying-party-anwser-login-challenge",
  "browser-ask-authenticator-to-solve-login-challenge",
  "authenticator-push-button-to-resolve-login-challenge",
  "authenticator-answer-login-challenge-solution",
  "browser-send-login-challenge-solution-to-relying-party",
  "relying-party-confirm-login-to-browser"
]
