import { Cards as CardsData } from "./data.js";
import Lenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  gsap.registerPlugin(ScrollTrigger);

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const StickySection = document.querySelector(".sticky");

  const countes = document.querySelector(".countes");
  countes.innerHTML = "";

  const CardsCon = document.querySelector(".cards");
  CardsCon.innerHTML = "";

  CardsData.forEach((c, i) => {
    const card = document.createElement("div");
    card.classList.add("card", c.type);
    card.setAttribute("type", c.type);
    card.setAttribute("idx", i);
    if (c.type == "fill") {
      countes.innerHTML += `
            <div class="count">
                <p>${i + 1 < 10 ? "0" + (i + 1) : i + 1}</p>
            </div>
    `;
      card.innerHTML = `
              <div class="img">
                  <img src="${c.img}" alt="CARD IMAGE">
              </div>
              <p>${c.title}</p>
      `;
    }
    CardsCon.appendChild(card);
  });

  let Radius = innerWidth * 2;
  let ThetaDiffrence = 25;
  let StartTheta = 60;

  const ThetaEquation = (currentTheta, ThetaDiffrence, i) => {
    return (currentTheta + 360 - ThetaDiffrence * i) % 360;
  };

  const cards = Array.from(document.querySelectorAll(".card")).reverse();

  const { sin, cos, PI } = Math;
  const UpdateCards = () => {
    cards.forEach((card, i) => {
      const { width } = card.getBoundingClientRect();
      const Theta = (ThetaEquation(StartTheta, ThetaDiffrence, i) * PI) / 180;
      const x = cos(Theta) * Radius + innerWidth / 2 - width / 2;
      const y = sin(Theta) * Radius + Radius + innerHeight / 3;
      const Rotation = Theta + PI / 2;
      gsap.set(card, {
        x,
        y,
        rotate: (Rotation * 180) / PI,
        duration: 0.03,
      });
    });
  };
  UpdateCards();
  ScrollTrigger.create({
    trigger: StickySection,
    start: "top top",
    end: `+=${innerHeight * CardsData.length * 0.4}px`,
    pin: true,
    onUpdate: (self) => {
      const prog = self.progress;
      const newTheta = 60 - prog * (ThetaDiffrence * CardsData.length);
      StartTheta = newTheta;
      UpdateCards();
    },
  });

  const IntersectionAPI = new IntersectionObserver(
    (info) => {
      if (info[0].isIntersecting) {
        const { target } = info[0];
        const type = target.getAttribute("type");
        if (type == "empty") return;
        const idx = Number(target.getAttribute("idx"));
        gsap.to('.countes .count',{
          y:`-${idx * 20}px`
        })
      }
    },
    {
      root: null,
      threshold: 0.2,
    }
  );

  cards.forEach((card) => {
    IntersectionAPI.observe(card);
  });

  window.addEventListener("resize", (e) => {
    if (innerWidth < 500) {
      Radius = 1700;
    } else if (innerWidth < 800) {
      Radius = 2000;
    } else if (innerWidth < 1200) {
      Radius = 2500;
    }
    UpdateCards();
  });
});
