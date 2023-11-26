import { Colors } from "~/application/enums/shared/Colors";

export function getFrom700To800(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "from-gray-700 to-gray-800";
    case Colors.SLATE:
      return "from-slate-700 to-slate-800";
    case Colors.GRAY:
      return "from-gray-700 to-gray-800";
    case Colors.NEUTRAL:
      return "from-neutral-700 to-neutral-800";
    case Colors.STONE:
      return "from-stone-700 to-stone-800";
    case Colors.RED:
      return "from-red-700 to-red-800";
    case Colors.ORANGE:
      return "from-orange-700 to-orange-800";
    case Colors.AMBER:
      return "from-amber-700 to-amber-800";
    case Colors.YELLOW:
      return "from-yellow-700 to-yellow-800";
    case Colors.LIME:
      return "from-lime-700 to-lime-800";
    case Colors.GREEN:
      return "from-green-700 to-green-800";
    case Colors.EMERALD:
      return "from-emerald-700 to-emerald-800";
    case Colors.TEAL:
      return "from-teal-700 to-teal-800";
    case Colors.CYAN:
      return "from-cyan-700 to-cyan-800";
    case Colors.SKY:
      return "from-sky-700 to-sky-800";
    case Colors.BLUE:
      return "from-blue-700 to-blue-800";
    case Colors.INDIGO:
      return "from-indigo-700 to-indigo-800";
    case Colors.VIOLET:
      return "from-violet-700 to-violet-800";
    case Colors.PURPLE:
      return "from-purple-700 to-purple-800";
    case Colors.FUCHSIA:
      return "from-fuchsia-700 to-fuchsia-800";
    case Colors.PINK:
      return "from-pink-700 to-pink-800";
    case Colors.ROSE:
      return "from-rose-700 to-rose-800";
  }
}

export default {
  getFrom700To800,
};
