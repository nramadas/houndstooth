export type Listener<S> = (s: S) => void;

export type Unsubscriber = () => void;

export type Channels<S> = { [id: number]: Listener<S> };

export type Bus<S> = { 
  peek: () => S;
  set: (s: S) => void;
  listen: (l: Listener<S>) => Unsubscriber;
};

/**
 * A simple data bus.
 */
const makeBus = function<S>(initial: S): Bus<S> {
  const channels: Channels<S> = {};
  let nextAvailableId = 0;
  let state = initial;

  return {
    peek: () => state,
    set: (s) => {
      state = s;
      for (const id in channels) {
        channels[id](state);
      }
    },
    listen: (listener) => {
      const id = nextAvailableId++;
      channels[id] = listener;
      
      return () => {
        delete channels[id];
      };
    },
  };
};

export default makeBus;
