import { Colors } from "~/application/enums/shared/Colors";

function getText600(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "focus-within:text-gray-600";
    case Colors.SLATE:
      return "focus-within:text-slate-600";
    case Colors.GRAY:
      return "focus-within:text-gray-600";
    case Colors.NEUTRAL:
      return "focus-within:text-neutral-600";
    case Colors.STONE:
      return "focus-within:text-stone-600";
    case Colors.RED:
      return "focus-within:text-red-600";
    case Colors.ORANGE:
      return "focus-within:text-orange-600";
    case Colors.AMBER:
      return "focus-within:text-amber-600";
    case Colors.YELLOW:
      return "focus-within:text-yellow-600";
    case Colors.LIME:
      return "focus-within:text-lime-600";
    case Colors.GREEN:
      return "focus-within:text-green-600";
    case Colors.EMERALD:
      return "focus-within:text-emerald-600";
    case Colors.TEAL:
      return "focus-within:text-teal-600";
    case Colors.CYAN:
      return "focus-within:text-cyan-600";
    case Colors.SKY:
      return "focus-within:text-sky-600";
    case Colors.BLUE:
      return "focus-within:text-blue-600";
    case Colors.INDIGO:
      return "focus-within:text-indigo-600";
    case Colors.VIOLET:
      return "focus-within:text-violet-600";
    case Colors.PURPLE:
      return "focus-within:text-purple-600";
    case Colors.FUCHSIA:
      return "focus-within:text-fuchsia-600";
    case Colors.PINK:
      return "focus-within:text-pink-600";
    case Colors.ROSE:
      return "focus-within:text-rose-600";
  }
}

export default {
  getText600,
};
