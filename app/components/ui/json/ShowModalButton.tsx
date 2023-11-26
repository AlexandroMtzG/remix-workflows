import clsx from "clsx";
import { ReactNode, useState } from "react";
import Modal from "../modals/Modal";

export default function ShowModalButton({ title, children }: { title: ReactNode; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex space-x-2">
        <button type="button" disabled={!children} onClick={() => setOpen(true)} className={clsx(!!children && "hover:underline")}>
          {title}
        </button>
      </div>

      <Modal className="sm:max-w-md" open={open} setOpen={setOpen}>
        {children}
      </Modal>
    </>
  );
}
