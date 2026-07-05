// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

export const PREFERENCES_KEYS = {
  NOTES_FOLDER: 'set-notes-folder',
  NOTES_LIMIT: 'set-notes-limit',
  PANEL_POSITION: 'set-panel-position',
};

export const MIN_PANEL_POSITION = 0;
export const MAX_PANEL_POSITION = 4;

export const DEBOUNCE_MS = 300;

export const MIN_NOTES_LIMIT = 1;
export const MAX_NOTES_LIMIT = 10;

export const RECENT_NOTES_PATHS = [
  '.local/share/org.gnome.TextEditor/recently-used.xbel',
  '.local/share/recently-used.xbel',
];

export const TEXT_EDITOR_APP_PATH = '.local/share/org.gnome.TextEditor';

export const NOTE_FILE_EXTENSION = '.txt';
