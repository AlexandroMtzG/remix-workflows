import { Colors } from "~/application/enums/shared/Colors";

function getRing800(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "ring-gray-800";
    case Colors.SLATE:
      return "ring-slate-800";
    case Colors.GRAY:
      return "ring-gray-800";
    case Colors.NEUTRAL:
      return "ring-neutral-800";
    case Colors.STONE:
      return "ring-stone-800";
    case Colors.RED:
      return "ring-red-800";
    case Colors.ORANGE:
      return "ring-orange-800";
    case Colors.AMBER:
      return "ring-amber-800";
    case Colors.YELLOW:
      return "ring-yellow-800";
    case Colors.LIME:
      return "ring-lime-800";
    case Colors.GREEN:
      return "ring-green-800";
    case Colors.EMERALD:
      return "ring-emerald-800";
    case Colors.TEAL:
      return "ring-teal-800";
    case Colors.CYAN:
      return "ring-cyan-800";
    case Colors.SKY:
      return "ring-sky-800";
    case Colors.BLUE:
      return "ring-blue-800";
    case Colors.INDIGO:
      return "ring-indigo-800";
    case Colors.VIOLET:
      return "ring-violet-800";
    case Colors.PURPLE:
      return "ring-purple-800";
    case Colors.FUCHSIA:
      return "ring-fuchsia-800";
    case Colors.PINK:
      return "ring-pink-800";
    case Colors.ROSE:
      return "ring-rose-800";
  }
}

export default {
  getRing800,
};
