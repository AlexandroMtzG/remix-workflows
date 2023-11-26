import { Colors } from "~/application/enums/shared/Colors";

function getBorder500(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "border-gray-500";
    case Colors.SLATE:
      return "border-slate-500";
    case Colors.GRAY:
      return "border-gray-500";
    case Colors.NEUTRAL:
      return "border-neutral-500";
    case Colors.STONE:
      return "border-stone-500";
    case Colors.RED:
      return "border-red-500";
    case Colors.ORANGE:
      return "border-orange-500";
    case Colors.AMBER:
      return "border-amber-500";
    case Colors.YELLOW:
      return "border-yellow-500";
    case Colors.LIME:
      return "border-lime-500";
    case Colors.GREEN:
      return "border-green-500";
    case Colors.EMERALD:
      return "border-emerald-500";
    case Colors.TEAL:
      return "border-teal-500";
    case Colors.CYAN:
      return "border-cyan-500";
    case Colors.SKY:
      return "border-sky-500";
    case Colors.BLUE:
      return "border-blue-500";
    case Colors.INDIGO:
      return "border-indigo-500";
    case Colors.VIOLET:
      return "border-violet-500";
    case Colors.PURPLE:
      return "border-purple-500";
    case Colors.FUCHSIA:
      return "border-fuchsia-500";
    case Colors.PINK:
      return "border-pink-500";
    case Colors.ROSE:
      return "border-rose-500";
  }
}

export default {
  getBorder500,
};
