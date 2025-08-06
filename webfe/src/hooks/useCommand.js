import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommands,
  postCommand,
  setCommands,
  setCommand,
} from "../lib/features/commands";
import { useCallback, useEffect } from "react";
import { useDevice } from "./useDevice";

export const useCommand = () => {
  const dispatch = useDispatch();
  const { commands, command, currentPage, totalPages, loading, error, filter } =
    useSelector((state) => state.command);
  const { device } = useDevice();

  const fetchCommandsCallback = useCallback(
    ({ skip = 0, take = 10, filter = "", deviceId }) => {
      dispatch(fetchCommands({ skip, take, filter, deviceId }));
    },
    [dispatch]
  );

  const _postCommand = useCallback(
    (commandPayload) => {
      if (!device?.id) return;

      return dispatch(postCommand({ deviceId: device?.id, ...commandPayload }));
    },
    [dispatch, device?.id]
  );
  const setCommandsCallback = useCallback(
    (command) => dispatch(setCommands(command)),
    [dispatch]
  );
  const setCommandCallback = useCallback(
    (command) => dispatch(setCommand(command)),
    [dispatch]
  );
  return {
    commands,
    command,
    currentPage,
    totalPages,
    fetchCommands: fetchCommandsCallback,
    setCommands: setCommandsCallback,
    setCommand: setCommandCallback,
    postCommand: _postCommand,
    loading,
    error,
  };
};
