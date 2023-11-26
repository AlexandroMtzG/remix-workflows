import { Colors } from "~/application/enums/shared/Colors";

function getText400(itemColor: Colors): string {
  switch (itemColor) {
    case Colors.UNDEFINED:
      return "placeholder:text-gray-400";
    case Colors.SLATE:
      return "placeholder:text-slate-400";
    case Colors.GRAY:
      return "placeholder:text-gray-400";
    case Colors.NEUTRAL:
      return "placeholder:text-neutral-400";
    case Colors.STONE:
      return "placeholder:text-stone-400";
    case Colors.RED:
      return "placeholder:text-red-400";
    case Colors.ORANGE:
      return "placeholder:text-orange-400";
    case Colors.AMBER:
      return "placeholder:text-amber-400";
    case Colors.YELLOW:
      return "placeholder:text-yellow-400";
    case Colors.LIME:
      return "placeholder:text-lime-400";
    case Colors.GREEN:
      return "placeholder:text-green-400";
    case Colors.EMERALD:
      return "placeholder:text-emerald-400";
    case Colors.TEAL:
      return "placeholder:text-teal-400";
    case Colors.CYAN:
      return "placeholder:text-cyan-400";
    case Colors.SKY:
      return "placeholder:text-sky-400";
    case Colors.BLUE:
      return "placeholder:text-blue-400";
    case Colors.INDIGO:
      return "placeholder:text-indigo-400";
    case Colors.VIOLET:
      return "placeholder:text-violet-400";
    case Colors.PURPLE:
      return "placeholder:text-purple-400";
    case Colors.FUCHSIA:
      return "placeholder:text-fuchsia-400";
    case Colors.PINK:
      return "placeholder:text-pink-400";
    case Colors.ROSE:
      return "placeholder:text-rose-400";
  }
}

export default {
  getText400,
};
