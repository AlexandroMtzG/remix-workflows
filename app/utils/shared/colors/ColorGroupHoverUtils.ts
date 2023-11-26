import { Colors } from "~/application/enums/shared/Colors";

function getText700(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "group-hover:text-gray-700";
    case Colors.SLATE:
      return "group-hover:text-slate-700";
    case Colors.GRAY:
      return "group-hover:text-gray-700";
    case Colors.NEUTRAL:
      return "group-hover:text-neutral-700";
    case Colors.STONE:
      return "group-hover:text-stone-700";
    case Colors.RED:
      return "group-hover:text-red-700";
    case Colors.ORANGE:
      return "group-hover:text-orange-700";
    case Colors.AMBER:
      return "group-hover:text-amber-700";
    case Colors.YELLOW:
      return "group-hover:text-yellow-700";
    case Colors.LIME:
      return "group-hover:text-lime-700";
    case Colors.GREEN:
      return "group-hover:text-green-700";
    case Colors.EMERALD:
      return "group-hover:text-emerald-700";
    case Colors.TEAL:
      return "group-hover:text-teal-700";
    case Colors.CYAN:
      return "group-hover:text-cyan-700";
    case Colors.SKY:
      return "group-hover:text-sky-700";
    case Colors.BLUE:
      return "group-hover:text-blue-700";
    case Colors.INDIGO:
      return "group-hover:text-indigo-700";
    case Colors.VIOLET:
      return "group-hover:text-violet-700";
    case Colors.PURPLE:
      return "group-hover:text-purple-700";
    case Colors.FUCHSIA:
      return "group-hover:text-fuchsia-700";
    case Colors.PINK:
      return "group-hover:text-pink-700";
    case Colors.ROSE:
      return "group-hover:text-rose-700";
  }
}

export default {
  getText700,
};
