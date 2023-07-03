import { createContext, PropsWithChildren, useContext } from "react";
import { toast } from "react-toastify";
import Alert from "@/components/blocks/Alert";

type Callback = () => void;

function info(content: string, callback?: Callback) {
  let cb = {};
  if (callback != undefined) {
    cb = {
      onClose: () => callback(),
    };
  }
  toast.info(content, cb);
}

function warn(content: string, callback?: Callback) {
  let cb = {};
  if (callback != undefined) {
    cb = {
      onClose: () => callback(),
    };
  }
  toast.warn(content, cb);
}

function error(content: string, callback?: Callback) {
  let cb = {};
  if (callback != undefined) {
    cb = {
      onClose: () => callback(),
    };
  }
  toast.error(content, cb);
}

function success(content: string, callback?: Callback) {
  let cb = {};
  if (callback != undefined) {
    cb = {
      onClose: () => callback(),
    };
  }
  toast.success(content, cb);
}

interface INotificationContextProps {
  infoNotify: (content: string, callback?: Callback) => void;
  warnNotify: (content: string, callback?: Callback) => void;
  errorNotify: (content: string, callback?: Callback) => void;
  successNotify: (content: string, callback?: Callback) => void;
}

const defaults = {
  infoNotify: info,
  warnNotify: warn,
  errorNotify: error,
  successNotify: success,
};

export const NotificationContext =
  createContext<INotificationContextProps>(defaults);

export const NotificationContextProvider = (props: PropsWithChildren) => {
  return (
    <NotificationContext.Provider
      value={{
        infoNotify: info,
        warnNotify: warn,
        errorNotify: error,
        successNotify: success,
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  return useContext(NotificationContext);
}
