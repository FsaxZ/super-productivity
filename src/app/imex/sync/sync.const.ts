import { initialProjectState } from '../../features/project/store/project.reducer';
import { initialTaskState } from '../../features/tasks/store/task.reducer';
import { initialTagState } from '../../features/tag/store/tag.reducer';
import { initialSimpleCounterState } from '../../features/simple-counter/store/simple-counter.reducer';
import { createEmptyEntity } from '../../util/create-empty-entity';
import { TaskArchive } from '../../features/tasks/task.model';
import { initialTaskRepeatCfgState } from '../../features/task-repeat-cfg/store/task-repeat-cfg.reducer';
import { initialMetricState } from '../../features/metric/store/metric.reducer';
import { initialImprovementState } from '../../features/metric/improvement/store/improvement.reducer';
import { initialObstructionState } from '../../features/metric/obstruction/store/obstruction.reducer';
import { AppBaseData } from './sync.model';
import { initialNoteState } from '../../features/note/store/note.reducer';
import { initialGlobalConfigState } from '../../features/config/store/global-config.reducer';
import { MODEL_VERSION } from '../../core/model-version';
import { MODEL_VERSION_KEY } from '../../app.constants';

export const SYNC_INITIAL_SYNC_TRIGGER = 'INITIAL_SYNC_TRIGGER';
export const SYNC_DEFAULT_AUDIT_TIME = 10000;

export const SYNC_ACTIVITY_AFTER_SOMETHING_ELSE_THROTTLE_TIME = 1000 * 60;
export const SYNC_BEFORE_GOING_TO_SLEEP_THROTTLE_TIME = 1000 * 60 * 5;

export const SYNC_BEFORE_CLOSE_ID = 'SYNC_BEFORE_CLOSE_ID';
export const SYNC_MIN_INTERVAL = 5000;

export const DEFAULT_APP_BASE_DATA: AppBaseData = {
  project: initialProjectState,
  archivedProjects: {},
  globalConfig: initialGlobalConfigState,
  reminders: [],

  task: initialTaskState,
  tag: initialTagState,
  simpleCounter: initialSimpleCounterState,
  taskArchive: {
    ...(createEmptyEntity() as TaskArchive),
    [MODEL_VERSION_KEY]: MODEL_VERSION.TASK_ARCHIVE,
  },
  taskRepeatCfg: initialTaskRepeatCfgState,
  note: initialNoteState,

  // metric
  metric: initialMetricState,
  improvement: initialImprovementState,
  obstruction: initialObstructionState,
};

export const GLOBAL_CONFIG_LOCAL_ONLY_FIELDS: string[][] = [
  ['misc', 'isDarkMode'],
  ['sync', 'localFileSync', 'syncFilePath'],
  ['sync', 'webDav', 'password'],
  ['sync', 'dropboxSync', 'accessToken'],
  // NOTE: googleDriveSync uses localStorage SUP_GOOGLE_SESSION instead
  // ['sync', 'googleDriveSync', 'authCode'],
];

// NOTE: they should never be changed
export const PREPEND_STR_ENCRYPTION = 'SP_ENC_';
export const PREPEND_STR_COMPRESSION = 'SP_CPR_';
