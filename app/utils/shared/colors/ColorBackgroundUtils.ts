import { Colors } from "~/application/enums/shared/Colors";

function getBg700(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "bg-gray-700";
    case Colors.SLATE:
      return "bg-slate-700";
    case Colors.GRAY:
      return "bg-gray-700";
    case Colors.NEUTRAL:
      return "bg-neutral-700";
    case Colors.STONE:
      return "bg-stone-700";
    case Colors.RED:
      return "bg-red-700";
    case Colors.ORANGE:
      return "bg-orange-700";
    case Colors.AMBER:
      return "bg-amber-700";
    case Colors.YELLOW:
      return "bg-yellow-700";
    case Colors.LIME:
      return "bg-lime-700";
    case Colors.GREEN:
      return "bg-green-700";
    case Colors.EMERALD:
      return "bg-emerald-700";
    case Colors.TEAL:
      return "bg-teal-700";
    case Colors.CYAN:
      return "bg-cyan-700";
    case Colors.SKY:
      return "bg-sky-700";
    case Colors.BLUE:
      return "bg-blue-700";
    case Colors.INDIGO:
      return "bg-indigo-700";
    case Colors.VIOLET:
      return "bg-violet-700";
    case Colors.PURPLE:
      return "bg-purple-700";
    case Colors.FUCHSIA:
      return "bg-fuchsia-700";
    case Colors.PINK:
      return "bg-pink-700";
    case Colors.ROSE:
      return "bg-rose-700";
  }
}

function getBg800(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "bg-gray-800";
    case Colors.SLATE:
      return "bg-slate-800";
    case Colors.GRAY:
      return "bg-gray-800";
    case Colors.NEUTRAL:
      return "bg-neutral-800";
    case Colors.STONE:
      return "bg-stone-800";
    case Colors.RED:
      return "bg-red-800";
    case Colors.ORANGE:
      return "bg-orange-800";
    case Colors.AMBER:
      return "bg-amber-800";
    case Colors.YELLOW:
      return "bg-yellow-800";
    case Colors.LIME:
      return "bg-lime-800";
    case Colors.GREEN:
      return "bg-green-800";
    case Colors.EMERALD:
      return "bg-emerald-800";
    case Colors.TEAL:
      return "bg-teal-800";
    case Colors.CYAN:
      return "bg-cyan-800";
    case Colors.SKY:
      return "bg-sky-800";
    case Colors.BLUE:
      return "bg-blue-800";
    case Colors.INDIGO:
      return "bg-indigo-800";
    case Colors.VIOLET:
      return "bg-violet-800";
    case Colors.PURPLE:
      return "bg-purple-800";
    case Colors.FUCHSIA:
      return "bg-fuchsia-800";
    case Colors.PINK:
      return "bg-pink-800";
    case Colors.ROSE:
      return "bg-rose-800";
  }
}

export default {
  getBg700,
  getBg800,
};
