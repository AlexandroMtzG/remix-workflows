import { Colors } from "~/application/enums/shared/Colors";

function getRing600(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "focus:ring-gray-600";
    case Colors.SLATE:
      return "focus:ring-slate-600";
    case Colors.GRAY:
      return "focus:ring-gray-600";
    case Colors.NEUTRAL:
      return "focus:ring-neutral-600";
    case Colors.STONE:
      return "focus:ring-stone-600";
    case Colors.RED:
      return "focus:ring-red-600";
    case Colors.ORANGE:
      return "focus:ring-orange-600";
    case Colors.AMBER:
      return "focus:ring-amber-600";
    case Colors.YELLOW:
      return "focus:ring-yellow-600";
    case Colors.LIME:
      return "focus:ring-lime-600";
    case Colors.GREEN:
      return "focus:ring-green-600";
    case Colors.EMERALD:
      return "focus:ring-emerald-600";
    case Colors.TEAL:
      return "focus:ring-teal-600";
    case Colors.CYAN:
      return "focus:ring-cyan-600";
    case Colors.SKY:
      return "focus:ring-sky-600";
    case Colors.BLUE:
      return "focus:ring-blue-600";
    case Colors.INDIGO:
      return "focus:ring-indigo-600";
    case Colors.VIOLET:
      return "focus:ring-violet-600";
    case Colors.PURPLE:
      return "focus:ring-purple-600";
    case Colors.FUCHSIA:
      return "focus:ring-fuchsia-600";
    case Colors.PINK:
      return "focus:ring-pink-600";
    case Colors.ROSE:
      return "focus:ring-rose-600";
  }
}

function getText600(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "focus:text-gray-600";
    case Colors.SLATE:
      return "focus:text-slate-600";
    case Colors.GRAY:
      return "focus:text-gray-600";
    case Colors.NEUTRAL:
      return "focus:text-neutral-600";
    case Colors.STONE:
      return "focus:text-stone-600";
    case Colors.RED:
      return "focus:text-red-600";
    case Colors.ORANGE:
      return "focus:text-orange-600";
    case Colors.AMBER:
      return "focus:text-amber-600";
    case Colors.YELLOW:
      return "focus:text-yellow-600";
    case Colors.LIME:
      return "focus:text-lime-600";
    case Colors.GREEN:
      return "focus:text-green-600";
    case Colors.EMERALD:
      return "focus:text-emerald-600";
    case Colors.TEAL:
      return "focus:text-teal-600";
    case Colors.CYAN:
      return "focus:text-cyan-600";
    case Colors.SKY:
      return "focus:text-sky-600";
    case Colors.BLUE:
      return "focus:text-blue-600";
    case Colors.INDIGO:
      return "focus:text-indigo-600";
    case Colors.VIOLET:
      return "focus:text-violet-600";
    case Colors.PURPLE:
      return "focus:text-purple-600";
    case Colors.FUCHSIA:
      return "focus:text-fuchsia-600";
    case Colors.PINK:
      return "focus:text-pink-600";
    case Colors.ROSE:
      return "focus:text-rose-600";
  }
}

function getPlaceholder600(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "focus:placeholder-gray-600";
    case Colors.SLATE:
      return "focus:placeholder-slate-600";
    case Colors.GRAY:
      return "focus:placeholder-gray-600";
    case Colors.NEUTRAL:
      return "focus:placeholder-neutral-600";
    case Colors.STONE:
      return "focus:placeholder-stone-600";
    case Colors.RED:
      return "focus:placeholder-red-600";
    case Colors.ORANGE:
      return "focus:placeholder-orange-600";
    case Colors.AMBER:
      return "focus:placeholder-amber-600";
    case Colors.YELLOW:
      return "focus:placeholder-yellow-600";
    case Colors.LIME:
      return "focus:placeholder-lime-600";
    case Colors.GREEN:
      return "focus:placeholder-green-600";
    case Colors.EMERALD:
      return "focus:placeholder-emerald-600";
    case Colors.TEAL:
      return "focus:placeholder-teal-600";
    case Colors.CYAN:
      return "focus:placeholder-cyan-600";
    case Colors.SKY:
      return "focus:placeholder-sky-600";
    case Colors.BLUE:
      return "focus:placeholder-blue-600";
    case Colors.INDIGO:
      return "focus:placeholder-indigo-600";
    case Colors.VIOLET:
      return "focus:placeholder-violet-600";
    case Colors.PURPLE:
      return "focus:placeholder-purple-600";
    case Colors.FUCHSIA:
      return "focus:placeholder-fuchsia-600";
    case Colors.PINK:
      return "focus:placeholder-pink-600";
    case Colors.ROSE:
      return "focus:placeholder-rose-600";
  }
}

export default {
  getRing600,
  getText600,
  getPlaceholder600,
};
