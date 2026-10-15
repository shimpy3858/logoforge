import type { Colors } from "../logo";
import { Opts } from "./shared";
import { CLASSIC } from "./classic";
import { lamp } from "./scenes/lamp";
import { rainyPeacock } from "./scenes/peacock";
import { sunrise } from "./scenes/sunrise";
import { hungryDog } from "./scenes/dog";
import { chai } from "./scenes/chai";
import { diya } from "./scenes/diya";
import { lighthouse } from "./scenes/lighthouse";
import { balloon } from "./scenes/balloon";
import { rocket } from "./scenes/rocket";
import { fireworks } from "./scenes/fireworks";
import { fireflies } from "./scenes/fireflies";
import { train } from "./scenes/train";
import { paperPlane } from "./scenes/plane";

export type IntroCat = "Classic" | "Story scenes" | "Text effects";
export const INTRO_CATS: { id: IntroCat; label: string; hint: string }[] = [
  { id: "Story scenes", label: "Story scenes", hint: "Short animated movie scenes. The brand name is the payoff at the end." },
  { id: "Classic", label: "Classic", hint: "Logo reveals built around your icon." },
  { id: "Text effects", label: "Text effects", hint: "Typography-first animations for the name." },
];

export type IntroStyle =
  | "peacock" | "orbit" | "carousel" | "particles" | "slide" | "flip" | "ripple" | "wipe" | "draw" | "cube" | "curtain" | "iris"
  | "typewriter" | "neon" | "glitch" | "bounce" | "spotlight"
  | "lamp" | "rainpeacock" | "sunrise" | "dog" | "chai" | "diya" | "lighthouse" | "balloon" | "rocket" | "fireworks" | "fireflies" | "train" | "plane";

type Def = { id: IntroStyle; cat: IntroCat; label: string; hint: string; make: (o: Opts) => string };
const classic = (id: IntroStyle) => CLASSIC[id];
const DEFS: Def[] = [
  // ---- story scenes
  { id: "lamp", cat: "Story scenes", label: "Lamp pull", hint: "Someone pulls a lamp cord in a dark room; dust drifts in the beam and the name is lit", make: lamp },
  { id: "rainpeacock", cat: "Story scenes", label: "Rainy peacock", hint: "Rain, ripples and lightning; a peacock dances and opens its fan", make: rainyPeacock },
  { id: "sunrise", cat: "Story scenes", label: "Sunrise", hint: "The sun rises over mountains, the sky turns blue, orange, gold, birds cross", make: sunrise },
  { id: "dog", cat: "Story scenes", label: "Hungry dog", hint: "A dog trots in, finds its bowl, a heart pops, it eats", make: hungryDog },
  { id: "chai", cat: "Story scenes", label: "Chai pour", hint: "Chai is poured from a kettle; the steam curls up into the name", make: chai },
  { id: "diya", cat: "Story scenes", label: "Diya lighting", hint: "A match lights an oil lamp; golden glow spreads and the name appears", make: diya },
  { id: "lighthouse", cat: "Story scenes", label: "Lighthouse", hint: "A beam sweeps the night sea, a boat passes, the beam reveals the name", make: lighthouse },
  { id: "balloon", cat: "Story scenes", label: "Hot air balloon", hint: "A balloon rises through clouds at sunrise, the name follows", make: balloon },
  { id: "rocket", cat: "Story scenes", label: "Rocket launch", hint: "Countdown, ignition, smoke, liftoff; the name emerges from the trail", make: rocket },
  { id: "fireworks", cat: "Story scenes", label: "Fireworks", hint: "Fireworks over a skyline; the last burst blooms into the name", make: fireworks },
  { id: "fireflies", cat: "Story scenes", label: "Fireflies", hint: "Fireflies drift in a night forest and settle into the letters", make: fireflies },
  { id: "train", cat: "Story scenes", label: "Station arrival", hint: "A steam train pulls into a dusk station; the name lights up on the board", make: train },
  { id: "plane", cat: "Story scenes", label: "Paper plane", hint: "A paper plane glides through clouds and its trail writes the name", make: paperPlane },
  // ---- classic
  { id: "peacock", cat: "Classic", label: "Peacock reveal", hint: "Feathers open like a fan, then the name appears below", make: classic("peacock") },
  { id: "orbit", cat: "Classic", label: "Orbit & pop", hint: "Icons circle around, pop, and the name appears in the middle", make: classic("orbit") },
  { id: "carousel", cat: "Classic", label: "3D ring drop", hint: "A ring of logo cards drops in, spins and bursts open", make: classic("carousel") },
  { id: "particles", cat: "Classic", label: "Particle gather", hint: "Dots fly in and form the logo with a shockwave", make: classic("particles") },
  { id: "slide", cat: "Classic", label: "Split slide", hint: "Icon slides from the left, name from the right", make: classic("slide") },
  { id: "flip", cat: "Classic", label: "3D tile flip", hint: "An app tile spins in 3D and lands", make: classic("flip") },
  { id: "ripple", cat: "Classic", label: "Ripple waves", hint: "Water-like rings expand around the icon", make: classic("ripple") },
  { id: "wipe", cat: "Classic", label: "Colour wipe", hint: "Bold colour bars sweep the screen, then the name", make: classic("wipe") },
  { id: "draw", cat: "Classic", label: "Line draw", hint: "The icon draws itself, then fills with colour", make: classic("draw") },
  { id: "cube", cat: "Classic", label: "Spinning cube", hint: "A cube of icons spins and settles", make: classic("cube") },
  { id: "curtain", cat: "Classic", label: "Stage curtain", hint: "Curtains open to reveal the logo", make: classic("curtain") },
  { id: "iris", cat: "Classic", label: "Iris reveal", hint: "A colour circle opens up from the centre", make: classic("iris") },
  // ---- text effects
  { id: "typewriter", cat: "Text effects", label: "Typewriter", hint: "The name is typed out letter by letter with a blinking cursor", make: classic("typewriter") },
  { id: "neon", cat: "Text effects", label: "Neon sign", hint: "A glowing neon sign flickers on", make: classic("neon") },
  { id: "glitch", cat: "Text effects", label: "Glitch", hint: "Digital glitch with colour-split slices", make: classic("glitch") },
  { id: "bounce", cat: "Text effects", label: "Letter bounce", hint: "Every letter drops in and bounces into place", make: classic("bounce") },
  { id: "spotlight", cat: "Text effects", label: "Spotlight", hint: "A stage light swings across and lights the name", make: classic("spotlight") },
];

export const INTRO_STYLES: { id: IntroStyle; cat: IntroCat; label: string; hint: string }[] = DEFS.map(({ id, cat, label, hint }) => ({ id, cat, label, hint }));
const MAKERS = Object.fromEntries(DEFS.map((d) => [d.id, d.make])) as Record<string, (o: Opts) => string>;

export type IntroOpts = { style: IntroStyle; brand: string; tagline: string; colors: Colors; icon: string; font?: string };
export function buildIntro(o: IntroOpts): string {
  return (MAKERS[o.style] || MAKERS.lamp)(o);
}
