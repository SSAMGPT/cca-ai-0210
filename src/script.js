gsap.registerPlugin(Observer, ScrambleTextPlugin);

let sections = document.querySelectorAll("section"),
  images = document.querySelectorAll(".bg"),
  headings = gsap.utils.toArray(".section-heading"),
  outerWrappers = gsap.utils.toArray(".outer"),
  innerWrappers = gsap.utils.toArray(".inner"),
  splitHeadings = Array.from(sections).map((section, i) => {
    if (i === 5 || i === 7) return null; // Skip SplitText for 6th and 8th sections
    let heading = section.querySelector(".section-heading");
    if (!heading) return null;
    return new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text" });
  }),
  currentIndex = -1,
  wrap = gsap.utils.wrap(0, sections.length),
  animating,
  subStep = 0, // Track click steps for 47% section
  inputBuffer = ""; // Buffer for numeric navigation

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function gotoSection(index, direction) {
  animating = true;
  let fromTop = direction === -1,
    dFactor = fromTop ? -1 : 1,
    tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => animating = false
    });
  if (currentIndex >= 0) {
    // The first time this function runs, current is -1
    gsap.set(sections[currentIndex], { zIndex: 0 });
    tl.to(images[currentIndex], { yPercent: -15 * dFactor })
      .set(sections[currentIndex], { autoAlpha: 0 });
  }
  gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
  tl.fromTo([outerWrappers[index], innerWrappers[index]], {
    yPercent: i => i ? -100 * dFactor : 100 * dFactor
  }, {
    yPercent: 0
  }, 0)
    .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0); // Removed chained text animation to handle conditional logic

  // Conditional Animation Logic
  if (index === 0) {
    // Section 1 (Index 0): Enhanced Pop-in + Shake Animation
    let bubble = document.querySelector(".chat-bubble");
    if (bubble) {
      // 1. Pop-in using the main timeline for sync
      tl.fromTo(bubble,
        { autoAlpha: 0, scale: 0, rotation: -20 },
        { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" },
        0.5
      );

      // 2. Trigger the 'loud' shake after popping in
      tl.call(() => {
        bubble.classList.remove("loud");
        void bubble.offsetWidth; // Force reflow
        bubble.classList.add("loud");
      }, null, 1.2);
    }

    // SplitText Animation for "샬롬."
    if (splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars, {
        autoAlpha: 0,
        yPercent: 150 * dFactor
      }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "power2",
        stagger: { each: 0.02, from: "random" }
      }, 0.2);
    }

  } else if (index === 1) {
    // Section 2 (Index 1): Episode Section with Icon Animation
    let icon = document.querySelector(".episode-icon");
    tl.fromTo(icon, { autoAlpha: 0, scale: 0, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 15, duration: 1, ease: "back.out(1.7)" }, 0.5);

    // SplitText Animation for "에피소드 하나"
    if (splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars, {
        autoAlpha: 0,
        yPercent: 150 * dFactor
      }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "power2",
        stagger: { each: 0.02, from: "random" }
      }, 0.2);
    }

  } else if (index === 2) {
    // Section 3 (Index 2): 47% Section with Counting only initially
    subStep = 0;
    gsap.set(".third .desc-line", { autoAlpha: 0 }); // Hide text initially

    let heading = headings[index];
    heading.textContent = "0%";
    heading.style.color = "#FFFFFF";
    let countObj = { val: 0 };

    // Snappy fade in
    tl.fromTo(heading, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, 0.2);

    tl.to(countObj, {
      val: 47,
      duration: 2.5,
      ease: "power4.out",
      onUpdate: () => {
        heading.textContent = Math.floor(countObj.val) + "%";
      }
    }, 0.3)
      .to(heading, { color: "#FF9500", duration: 0.6 }, "-=0.6");

    // Show typing indicator stably via timeline
    tl.set(".third .typing-indicator", { display: "flex" }, "+=0.1");
    tl.fromTo(".third .typing-indicator", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "+=0.1");

  } else if (index === 3) {
    // Section 4 (Index 3): Inji Section with Icon Animation
    let icon = document.querySelector(".brain-icon");
    tl.fromTo(icon, { autoAlpha: 0, scale: 0, rotation: 10 }, { autoAlpha: 1, scale: 1, rotation: -10, duration: 1, ease: "back.out(1.7)" }, 0.5);

    // SplitText Animation for "인지의 외주화"
    if (splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars, {
        autoAlpha: 0,
        yPercent: 150 * dFactor
      }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "power2",
        stagger: { each: 0.02, from: "random" }
      }, 0.2);
    }

  } else if (index === 4) {
    // Section 5 (Index 4): Taxonomy Section with Icon Animation
    let icon = document.querySelector(".arrow-icon");
    tl.fromTo(icon, { autoAlpha: 0, scale: 0, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: -15, duration: 1, ease: "back.out(1.7)" }, 0.5);

    // SplitText Animation for "벤자민 블룸의 택소노미"
    if (splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars, {
        autoAlpha: 0,
        yPercent: 150 * dFactor
      }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "power2",
        stagger: { each: 0.02, from: "random" }
      }, 0.2);
    }

  } else if (index === 5) {
    // Section 6 (Index 5): Students survey with Title Scramble
    subStep = 0;
    gsap.set(".sixth .desc-line", { autoAlpha: 0 });

    let heading = headings[index];
    let originalTitle = heading.textContent.trim();

    // Fade in and Scramble the title
    tl.fromTo(heading, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, 0.2);
    tl.to(heading, {
      duration: 2,
      scrambleText: {
        text: originalTitle,
        chars: "0123456789!@#$%^&*",
        revealDelay: 0.3,
        speed: 0.4
      }
    }, 0.3);

    // ALSO Scramble the intro line together with the title
    let introLine = document.querySelector(".sixth .intro .desc-line");
    if (introLine) {
      let originalIntro = introLine.textContent.trim();
      tl.set(introLine, { autoAlpha: 1 }, 1.0);
      tl.to(introLine, {
        duration: 1.5,
        scrambleText: {
          text: originalIntro,
          chars: "0123456789!@#$%^&*",
          revealDelay: 0.2,
          speed: 0.4
        }
      }, 1.0);
    }

    // Show typing indicator stably via timeline
    tl.set(".sixth .typing-indicator", { display: "flex" }, "+=0.1");
    tl.fromTo(".sixth .typing-indicator", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "+=0.1");

  } else if (index === 6) {
    // Section 7 (Index 6): Thinking Section with Icon Animation
    let icon = document.querySelector(".thinking-icon");
    tl.fromTo(icon, { autoAlpha: 0, scale: 0, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 10, duration: 1, ease: "back.out(1.7)" }, 0.5);

    // Default falling text for the heading
    if (splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars, {
        autoAlpha: 0,
        yPercent: 150 * dFactor
      }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "power2",
        stagger: {
          each: 0.02,
          from: "random"
        }
      }, 0.2);
    }

  } else if (index === 7) {
    // Section 8 (Index 7): Teachers' cases with Title Scramble
    subStep = 0;
    gsap.set(".eighth .desc-line", { autoAlpha: 0 });

    let heading = headings[index];
    let originalTitle = heading.textContent.trim();

    // Scramble the title
    tl.fromTo(heading, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, 0.2);
    tl.to(heading, {
      duration: 2,
      scrambleText: {
        text: originalTitle,
        chars: "0123456789!@#$%^&*",
        revealDelay: 0.3,
        speed: 0.4
      }
    }, 0.3);

    // ALSO Scramble the intro line together with the title
    let introLine = document.querySelector(".eighth .intro .desc-line");
    let originalIntro = introLine.textContent.trim();
    tl.set(introLine, { autoAlpha: 1 }, 1.0);
    tl.to(introLine, {
      duration: 1.5,
      scrambleText: {
        text: originalIntro,
        chars: "0123456789!@#$%^&*",
        revealDelay: 0.2,
        speed: 0.4
      }
    }, 1.0);

    // Show typing indicator stably via timeline
    tl.set(".eighth .typing-indicator", { display: "flex" }, "+=0.1");
    tl.fromTo(".eighth .typing-indicator", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "+=0.1");

  } else if (index === 8) {
    // Section 9 (Index 8): School Reality with Chat UI
    subStep = 3; // Auto-handled, disable click interaction
    let ti = document.querySelector(".ninth .typing-indicator");
    gsap.killTweensOf(".ninth .chat-bubble");
    gsap.killTweensOf(".ninth .typing-indicator");
    gsap.set(".ninth .desc-group", { display: "none" });
    gsap.set(ti, { autoAlpha: 0, display: "none" });

    // Independent chat timeline starting after the main transition
    tl.call(() => {
      let chatTl = gsap.timeline();

      // Bubble 1
      chatTl.call(() => {
        ti.classList.remove("on-right");
        ti.classList.add("on-left");
      });
      chatTl.set(ti, { display: "flex", autoAlpha: 0 });
      chatTl.to(ti, { autoAlpha: 1, x: 0, duration: 0.5 });
      chatTl.to({}, { duration: 3 }); // Typing...
      chatTl.to(ti, { autoAlpha: 0, duration: 0.3 });
      chatTl.call(() => revealBubble(1, ".ninth"));

      // Bubble 2
      chatTl.to({}, { duration: 1.0 }); // Wait before next typing
      chatTl.call(() => {
        ti.classList.remove("on-left");
        ti.classList.add("on-right");
      });
      chatTl.to(ti, { autoAlpha: 1, duration: 0.5 });
      chatTl.to({}, { duration: 3 }); // Typing...
      chatTl.to(ti, { autoAlpha: 0, duration: 0.3 });
      chatTl.call(() => revealBubble(2, ".ninth"));

      // Bubble 3
      chatTl.to({}, { duration: 1.0 });
      chatTl.call(() => {
        ti.classList.remove("on-right");
        ti.classList.add("on-left");
      });
      chatTl.to(ti, { autoAlpha: 1, duration: 0.5 });
      chatTl.to({}, { duration: 3 }); // Typing...
      chatTl.to(ti, { autoAlpha: 0, duration: 0.3 });
      chatTl.call(() => revealBubble(3, ".ninth"));

      // Final Lingering Indicator (Blue/On-Right)
      chatTl.to({}, { duration: 1.5 });
      chatTl.call(() => {
        ti.classList.remove("on-left");
        ti.classList.add("on-right"); // Make it Blue
      });
      chatTl.to(ti, { autoAlpha: 1, duration: 0.8 }); // Leave it visible
    }, null, 1.0);

  } else if (index === 10) {
    // Section 11 (Index 10): Warming Up Workshop (Visioning)
    subStep = 0;
    let introBubble = document.querySelector(".tenth .intro-bubble .chat-bubble");
    let heading = document.querySelector(".tenth .section-heading");
    let qrCode = document.querySelector(".tenth .qr-code");

    if (qrCode) {
      gsap.set(qrCode, { autoAlpha: 0 }); // Hidden initially, revealed on click
    }

    if (introBubble) {
      tl.fromTo(introBubble,
        { autoAlpha: 0, scale: 0, rotation: -10 },
        { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" },
        0.5
      );
      tl.call(() => {
        if (introBubble) {
          introBubble.classList.remove("loud");
          void introBubble.offsetWidth;
          introBubble.classList.add("loud");
        }
      }, null, 1.2);
    }

    if (heading && splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars,
        { autoAlpha: 0, yPercent: 100 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
          stagger: { each: 0.02, from: "random" }
        },
        1.0
      );
    }
  } else if (index === 12) {
    // Section 13 (Index 12): Faith Keywords
    subStep = 0;
    let kwBubbles = gsap.utils.toArray(".keywords-faith-section .faith-keyword");
    let subTags = gsap.utils.toArray(".keywords-faith-section .sub-tag");
    let finalTitle = document.querySelector(".keywords-faith-section .final-title");

    // Reset states
    gsap.set(subTags, { autoAlpha: 0, scale: 0 });
    gsap.set(finalTitle, { autoAlpha: 0, y: -20, display: "none" });

    if (kwBubbles.length > 0) {
      tl.fromTo(kwBubbles,
        { autoAlpha: 0, scale: 0.5, y: 30 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(2)",
          stagger: 0.15
        },
        0.8
      );
    }
  } else if (index === 13) {
    // Section 14 (Index 13): Warming Up Workshop (Compass)
    subStep = 0;
    let introBubble = document.querySelector(".compass-section .intro-bubble .chat-bubble");
    let heading = document.querySelector(".compass-section .section-heading");
    let qrCode = document.querySelector(".compass-section .qr-code");

    if (qrCode) {
      gsap.set(qrCode, { autoAlpha: 0 }); // Hidden initially, revealed on click
    }

    if (introBubble) {
      tl.fromTo(introBubble,
        { autoAlpha: 0, scale: 0, rotation: -10 },
        { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" },
        0.5
      );
      tl.call(() => {
        if (introBubble) {
          introBubble.classList.remove("loud");
          void introBubble.offsetWidth;
          introBubble.classList.add("loud");
        }
      }, null, 1.2);
    }
    if (heading && splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars,
        { autoAlpha: 0, yPercent: 150 * dFactor },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2",
          stagger: { each: 0.02, from: "random" }
        },
        0.7
      );
    }
  } else if (index === 14) {
    // Section 15 (Index 14): Warming Up Workshop (Guiding)
    subStep = 0;
    let introBubble = document.querySelector(".guiding-section .intro-bubble .chat-bubble");
    let heading = document.querySelector(".guiding-section .section-heading");

    if (introBubble) {
      tl.fromTo(introBubble,
        { autoAlpha: 0, scale: 0, rotation: -10 },
        { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" },
        0.5
      );
      tl.call(() => {
        if (introBubble) {
          introBubble.classList.remove("loud");
          void introBubble.offsetWidth;
          introBubble.classList.add("loud");
        }
      }, null, 1.2);
    }
    if (heading && splitHeadings[index]) {
      tl.fromTo(splitHeadings[index].chars,
        { autoAlpha: 0, yPercent: 150 * dFactor },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2",
          stagger: { each: 0.02, from: "random" }
        },
        0.7
      );
    }

    let qrCode = document.querySelector(".guiding-section .qr-code");
    if (qrCode) {
      gsap.set(qrCode, { autoAlpha: 0 }); // Hidden initially, revealed on click
    }

  } else if (splitHeadings[index]) {
    // All other sections: Default Falling Text Animation
    tl.fromTo(splitHeadings[index].chars, {
      autoAlpha: 0,
      yPercent: 150 * dFactor
    }, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1,
      ease: "power2",
      stagger: {
        each: 0.02,
        from: "random"
      }
    }, 0.2);
  }

  currentIndex = index;
  sessionStorage.setItem("gsapSectionIndex", index); // Save current index to session storage
}

function handleBack() {
  if (animating) return;

  if (subStep > 0) {
    const sectionClass = "." + sections[currentIndex].className.split(" ")[0];
    hideGroup(subStep, sectionClass);

    // Special handling for typing indicator reappearance
    if (currentIndex === 2 || currentIndex === 5 || currentIndex === 7) {
      gsap.killTweensOf(`${sectionClass} .typing-indicator`);
      gsap.set(`${sectionClass} .typing-indicator`, { display: "flex", autoAlpha: 1 });
    }

    subStep--;
  } else if (currentIndex > 0) {
    gotoSection(currentIndex - 1, -1);
  }
}

function handleNext() {
  if (animating) return;
  // Always try to click first. Click handles both sub-steps and section transitions.
  if (currentIndex < sections.length - 1 || (currentIndex === 12 && subStep < 2)) {
    window.dispatchEvent(new Event('click'));
  }
}

function hideGroup(num, sectionClass) {
  let group = document.querySelector(`${sectionClass} .group-${num}`);
  if (group) {
    gsap.set(group, { display: "none" });
    let lines = group.querySelectorAll(".desc-line");
    gsap.set(lines, { autoAlpha: 0 });
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") handleBack();
  if (e.key === "ArrowDown") handleNext();

  // Numeric Navigation (1-based index)
  if (e.key >= "0" && e.key <= "9") {
    inputBuffer += e.key;
    // Clear buffer after 2 seconds of inactivity
    clearTimeout(window.navTimer);
    window.navTimer = setTimeout(() => { inputBuffer = ""; }, 2000);
  } else if (e.key === "Enter" && inputBuffer.length > 0) {
    let targetIdx = parseInt(inputBuffer) - 1;
    if (targetIdx >= 0 && targetIdx < sections.length) {
      gotoSection(targetIdx, targetIdx > currentIndex ? 1 : -1);
    }
    inputBuffer = "";
    clearTimeout(window.navTimer);
  } else if (e.key !== "Enter") {
    // Any other non-numeric key (except Enter) clears the buffer
    inputBuffer = "";
  }
});

Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  onDown: () => !animating && handleBack(),
  onUp: () => !animating && currentIndex < sections.length - 1 && gotoSection(currentIndex + 1, 1),
  tolerance: 10,
  preventDefault: true
});

// Retrieve saved index from session storage, default to 0 if not found
let savedIndex = parseInt(sessionStorage.getItem("gsapSectionIndex"));
if (isNaN(savedIndex)) savedIndex = 0;

gotoSection(savedIndex, 1);

// original: https://codepen.io/BrianCross/pen/PoWapLP
// horizontal version: https://codepen.io/GreenSock/pen/xxWdeMK

// Click interaction for page 3 (index 2) and page 6 (index 5)
window.addEventListener("click", () => {
  if (animating) return;

  let stepHandled = false;

  if (currentIndex === 2) {
    if (subStep < 2) {
      gsap.killTweensOf(".third .typing-indicator");
      gsap.set(".third .typing-indicator", { autoAlpha: 0, display: "none" });
      subStep++;
      revealGroup(subStep, ".third");
      if (subStep < 2) {
        gsap.set(".third .typing-indicator", { display: "flex" });
        gsap.to(".third .typing-indicator", { autoAlpha: 1, duration: 0.5, delay: 2.2 });
      }
      stepHandled = true;
    }
  } else if (currentIndex === 5) {
    if (subStep < 1) {
      gsap.killTweensOf(".sixth .typing-indicator");
      gsap.set(".sixth .typing-indicator", { autoAlpha: 0, display: "none" });
      subStep++;
      revealGroup(subStep, ".sixth");
      stepHandled = true;
    }
  } else if (currentIndex === 7) {
    if (subStep < 4) {
      gsap.killTweensOf(".eighth .typing-indicator");
      gsap.set(".eighth .typing-indicator", { autoAlpha: 0, display: "none" });
      subStep++;
      revealGroup(subStep, ".eighth");
      if (subStep < 4) {
        gsap.set(".eighth .typing-indicator", { display: "flex" });
        gsap.to(".eighth .typing-indicator", { autoAlpha: 1, duration: 0.5, delay: 2.2 });
      }
      stepHandled = true;
    }
  } else if (currentIndex === 10) {
    let qrCode = document.querySelector(".tenth .qr-code");
    if (qrCode && subStep === 0) {
      gsap.fromTo(qrCode,
        { autoAlpha: 0, scale: 0.5, y: 50 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(2)", pointerEvents: "auto" }
      );
      subStep = 1;
      stepHandled = true;
    }
  } else if (currentIndex === 14) {
    let qrCode = document.querySelector(".guiding-section .qr-code");
    if (qrCode && subStep === 0) {
      gsap.fromTo(qrCode,
        { autoAlpha: 0, scale: 0.5, y: 50 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(2)", pointerEvents: "auto" }
      );
      subStep = 1;
      stepHandled = true;
    }
  } else if (currentIndex === 13) {
    let qrCode = document.querySelector(".compass-section .qr-code");
    if (qrCode && subStep === 0) {
      gsap.fromTo(qrCode,
        { autoAlpha: 0, scale: 0.5, y: 50 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(2)", pointerEvents: "auto" }
      );
      subStep = 1;
      stepHandled = true;
    }
  } else if (currentIndex === 12) {
    if (subStep === 0) {
      let subTags = gsap.utils.toArray(".keywords-faith-section .sub-tag");
      if (subTags.length > 0) {
        gsap.fromTo(subTags,
          { autoAlpha: 0, scale: 0, rotation: 15 },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.1, onComplete: () => { subStep = 1; } }
        );
        stepHandled = true;
      }
    } else if (subStep === 1) {
      let finalTitle = document.querySelector(".keywords-faith-section .final-title");
      if (finalTitle) {
        gsap.set(finalTitle, { display: "block", autoAlpha: 1 });
        gsap.from(finalTitle, { height: 0, marginBottom: 0, duration: 1.0, ease: "power3.inOut" });
        let split = new SplitText(finalTitle, { type: "chars" });
        gsap.fromTo(split.chars, { autoAlpha: 0, y: -50 }, { autoAlpha: 1, y: 0, duration: 1, ease: "back.out(1.7)", stagger: 0.05, onComplete: () => { subStep = 2; } });
        stepHandled = true;
      }
    }
  }

  // Next page logic
  if (!stepHandled && currentIndex < sections.length - 1) {
    gotoSection(currentIndex + 1, 1);
  }
});

function revealBubble(num, sectionClass) {
  let group = document.querySelector(`${sectionClass} .group-${num}`);
  if (group) {
    gsap.set(group, { display: "flex" });
    let bubble = group.querySelector(".chat-bubble");
    gsap.fromTo(bubble,
      { autoAlpha: 0, scale: 0.5, y: 20 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
    );
  }
}

function revealGroup(num, sectionClass) {
  let group = document.querySelector(`${sectionClass} .group-${num}`);
  if (group) gsap.set(group, { display: "flex" });

  let lines = document.querySelectorAll(`${sectionClass} .group-${num} .desc-line`);
  lines.forEach((line, i) => {
    let originalText = line.textContent.trim();
    gsap.set(line, { autoAlpha: 1 });
    gsap.to(line, {
      duration: 1.5,
      scrambleText: {
        text: originalText,
        chars: "0123456789!@#$%^&*",
        revealDelay: 0.1,
        speed: 0.4
      },
      delay: i * 0.3
    });
  });
}

// Click interaction for first section bubble
document.querySelector(".chat-bubble")?.addEventListener("click", function (e) {
  e.stopPropagation();
  this.classList.remove("loud");
  void this.offsetWidth; // Trigger reflow
  this.classList.add("loud");
});
