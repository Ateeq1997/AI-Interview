import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import toast from 'react-hot-toast';

import {
  AddOn,
  Difficulty,
  Duration,
  InterviewConfig,
  InterviewType,
} from '../types';
import { loadConfig, saveConfig } from '../utils/localStorage';

// ─── State & Actions ─────────────────────────────────────────────────────────

interface ConfigState {
  config: InterviewConfig;
  expired: boolean;
}

type ConfigAction =
  | { type: 'SET_TYPE'; payload: InterviewType }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'SET_DURATION'; payload: Duration }
  | { type: 'ADD_TOPIC'; payload: string }
  | { type: 'REMOVE_TOPIC'; payload: string }
  | { type: 'TOGGLE_ADDON'; payload: AddOn }
  | { type: 'RESTORE'; payload: InterviewConfig }
  | { type: 'MARK_EXPIRED' }
  | { type: 'DISMISS_EXPIRED' };

const DEFAULT_CONFIG: InterviewConfig = {
  interviewType: null,
  difficulty: null,
  topics: [],
  duration: 30,
  addOns: [],
};

function reducer(state: ConfigState, action: ConfigAction): ConfigState {
  const c = state.config;

  switch (action.type) {
    case 'SET_TYPE': {
      let duration = c.duration;
      if (action.payload === 'Mixed' && duration === 15) {
        duration = 30;
      }
      return { ...state, config: { ...c, interviewType: action.payload, duration } };
    }

    case 'SET_DIFFICULTY': {
      const d = action.payload;
      let { interviewType, addOns } = c;
      if ((d === 'Junior' || d === 'Mid') && interviewType === 'System Design') {
        interviewType = null;
      }
      if (d === 'Junior' && addOns.includes('Expert Review')) {
        addOns = addOns.filter((a) => a !== 'Expert Review');
      }
      return { ...state, config: { ...c, difficulty: d, interviewType, addOns } };
    }

    case 'SET_DURATION': {
      let { addOns } = c;
      if (action.payload === 15 && addOns.includes('Expert Review')) {
        addOns = addOns.filter((a) => a !== 'Expert Review');
      }
      return { ...state, config: { ...c, duration: action.payload, addOns } };
    }

    case 'ADD_TOPIC': {
      if (c.topics.length >= 5) return state;
      if (c.topics.includes(action.payload)) return state;
      return { ...state, config: { ...c, topics: [...c.topics, action.payload] } };
    }

    case 'REMOVE_TOPIC':
      return { ...state, config: { ...c, topics: c.topics.filter((t) => t !== action.payload) } };

    case 'TOGGLE_ADDON': {
      const has = c.addOns.includes(action.payload);
      const addOns = has
        ? c.addOns.filter((a) => a !== action.payload)
        : [...c.addOns, action.payload];
      return { ...state, config: { ...c, addOns } };
    }

    case 'RESTORE':
      return { config: action.payload, expired: false };

    case 'MARK_EXPIRED':
      return { config: DEFAULT_CONFIG, expired: true };

    case 'DISMISS_EXPIRED':
      return { ...state, expired: false };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ConfigContextValue {
  config: InterviewConfig;
  expired: boolean;
  setType: (t: InterviewType) => void;
  setDifficulty: (d: Difficulty) => void;
  setDuration: (d: Duration) => void;
  addTopic: (t: string) => void;
  removeTopic: (t: string) => void;
  toggleAddOn: (a: AddOn) => void;
  dismissExpired: () => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { config: DEFAULT_CONFIG, expired: false });

  // Restore on mount
  useEffect(() => {
    const { config, expired } = loadConfig();
    if (expired) {
      dispatch({ type: 'MARK_EXPIRED' });
    } else if (config) {
      dispatch({ type: 'RESTORE', payload: config });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change (skip during initial expired state)
  useEffect(() => {
    if (!state.expired) {
      saveConfig(state.config);
    }
  }, [state.config, state.expired]);

  // ─── Side-effect toasts ──────────────────────────────────────────────────
  const prevConfig = useRef<InterviewConfig>(state.config);

  useEffect(() => {
    const prev = prevConfig.current;
    const curr = state.config;

    // Rule 2: Mixed auto-switched duration
    if (
      curr.interviewType === 'Mixed' &&
      prev.interviewType !== 'Mixed' &&
      prev.duration === 15 &&
      curr.duration === 30
    ) {
      toast('Mixed interviews require at least 30 minutes.', { icon: 'ℹ️' });
    }

    // Rule 1: System Design was deselected due to difficulty change
    if (
      prev.interviewType === 'System Design' &&
      curr.interviewType === null &&
      curr.difficulty !== null &&
      (curr.difficulty === 'Junior' || curr.difficulty === 'Mid')
    ) {
      toast('System Design is not available for Junior or Mid difficulty.', { icon: '⚠️' });
    }

    // Rule 3: Expert Review auto-unchecked (duration → 15 min)
    if (
      curr.duration === 15 &&
      prev.duration !== 15 &&
      prev.addOns.includes('Expert Review') &&
      !curr.addOns.includes('Expert Review')
    ) {
      toast('Expert Review requires at least 30 minutes — it has been removed.', { icon: '⚠️' });
    }

    // Rule 4: Expert Review auto-unchecked (difficulty → Junior)
    if (
      curr.difficulty === 'Junior' &&
      prev.difficulty !== 'Junior' &&
      prev.addOns.includes('Expert Review') &&
      !curr.addOns.includes('Expert Review')
    ) {
      toast('Expert Review is not available for Junior difficulty — it has been removed.', { icon: '⚠️' });
    }

    prevConfig.current = curr;
  }, [state.config]);

  const setType = useCallback((t: InterviewType) => dispatch({ type: 'SET_TYPE', payload: t }), []);
  const setDifficulty = useCallback((d: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', payload: d }), []);
  const setDuration = useCallback((d: Duration) => dispatch({ type: 'SET_DURATION', payload: d }), []);
  const addTopic = useCallback((t: string) => dispatch({ type: 'ADD_TOPIC', payload: t }), []);
  const removeTopic = useCallback((t: string) => dispatch({ type: 'REMOVE_TOPIC', payload: t }), []);
  const toggleAddOn = useCallback((a: AddOn) => dispatch({ type: 'TOGGLE_ADDON', payload: a }), []);
  const dismissExpired = useCallback(() => dispatch({ type: 'DISMISS_EXPIRED' }), []);

  return (
    <ConfigContext.Provider
      value={{
        config: state.config,
        expired: state.expired,
        setType,
        setDifficulty,
        setDuration,
        addTopic,
        removeTopic,
        toggleAddOn,
        dismissExpired,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
