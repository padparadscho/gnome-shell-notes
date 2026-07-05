// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { PREFERENCES_KEYS, RECENT_NOTES_PATHS } from './constants.js';

export function getNotesFolder(settings) {
  const path = settings.get_string(PREFERENCES_KEYS.NOTES_FOLDER).trim();
  if (!path) return GLib.get_home_dir();

  const folder = Gio.File.new_for_path(path);
  return folder.query_exists(null) ? path : GLib.get_home_dir();
}

function findNotesFile() {
  const home = GLib.get_home_dir();
  const paths = RECENT_NOTES_PATHS.map((path) =>
    GLib.build_filenamev([home, path]),
  );

  const filePath = paths.find((path) =>
    Gio.File.new_for_path(path).query_exists(null),
  );

  return filePath;
}

function readNotesFile(filePath) {
  const bookmark = new GLib.BookmarkFile();

  try {
    bookmark.load_from_file(filePath);
  } catch {
    return [];
  }

  return bookmark
    .get_uris()
    .filter((uri) => uri.startsWith('file://'))
    .filter((uri) => {
      try {
        return bookmark.get_applications(uri).includes('gnome-text-editor');
      } catch {
        return false;
      }
    })
    .map((uri) => {
      const path = decodeURIComponent(uri.slice(7));
      let time = 0;

      try {
        const dateTime = bookmark.get_modified_date_time(uri);
        if (dateTime) time = dateTime.to_unix();
      } catch {
        // timestamp stays 0
      }

      return { path, name: GLib.path_get_basename(path), time };
    })
    .sort((a, b) => b.time - a.time);
}

export function getRecentNotes() {
  const filePath = findNotesFile();
  if (!filePath) return [];

  return readNotesFile(filePath);
}
