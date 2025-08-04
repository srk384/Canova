import { useRef } from "react";
import { debounce } from "lodash";

export function useDebouncedCallback(callback, delay = 400) {
  const debounced = useRef(
    debounce((...args) => callback(...args), delay)
  ).current;

  return debounced;
}
