import ButtonPrimary from "./ButtonPrimary";
import { forwardRef, MouseEventHandler, ReactNode, Ref, useImperativeHandle, useState } from "react";
import clsx from "clsx";
import { useNavigation } from "@remix-run/react";

export interface RefLoadingButton {
  start: () => void;
  stop: () => void;
}

interface Props {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  to?: string;
  actionName?: string;
  isLoading?: boolean;
}

const LoadingButton = ({ className, type = "button", children, disabled, onClick, to, actionName, isLoading }: Props, ref: Ref<RefLoadingButton>) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }));

  function start() {
    setLoading(true);
  }
  function stop() {
    setLoading(false);
  }
  const submitting = navigation.state === "submitting";

  function checkIsLoading() {
    if (isLoading) {
      return true;
    }
    const loadingOrSubmitting = loading || submitting;
    if (actionName) {
      return loadingOrSubmitting && navigation.state === "submitting" && navigation.formData.get("action") === actionName;
    }
    return loadingOrSubmitting;
  }

  return (
    <ButtonPrimary
      disabled={disabled || checkIsLoading()}
      className={clsx(className, "relative justify-center", checkIsLoading() && "base-spinner cursor-not-allowed")}
      type={type}
      onClick={onClick}
      to={to}
    >
      {children}
    </ButtonPrimary>
  );
};

export default forwardRef(LoadingButton);
