// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {
  DEBOUNCE_MS,
  MAX_NOTES_LIMIT,
  MAX_PANEL_POSITION,
  MIN_NOTES_LIMIT,
  MIN_PANEL_POSITION,
  PREFERENCES_KEYS,
  TEXT_EDITOR_APP_PATH,
} from './constants.js';
import { getRecentNotes } from './utils.js';
import { Indicator } from './ui/indicator.js';
import { NotesMenu } from './ui/menu.js';

export default class NotesExtension extends Extension {
  enable() {
    this._settings = this.getSettings();
    this._timeout = null;
    this._monitor = null;
    this._signals = [];

    this._indicator = new Indicator();
    this._menu = new NotesMenu(this._settings, {
      openPreferences: () => this.openPreferences(),
    });
    this._indicator.menu.addMenuItem(this._menu);
    Main.panel.addToStatusArea(
      this.uuid,
      this._indicator,
      this._getPanelPosition(),
      'left',
    );

    this._connectSettings();
    this._setupMonitor();
    this._scan();
  }

  disable() {
    for (const id of this._signals) {
      if (id) this._settings.disconnect(id);
    }
    this._signals = [];

    if (this._monitor) {
      this._monitor.cancel();
      this._monitor = null;
    }

    if (this._timeout) {
      GLib.Source.remove(this._timeout);
      this._timeout = null;
    }

    this._indicator?.destroy();
    this._indicator = null;
    this._menu?.destroy();
    this._menu = null;
    this._settings = null;
    this._notes = null;
  }

  _getPanelPosition() {
    const position = this._settings.get_int(PREFERENCES_KEYS.PANEL_POSITION);
    return Math.max(MIN_PANEL_POSITION, Math.min(MAX_PANEL_POSITION, position));
  }

  _connectSettings() {
    this._signals.push(
      this._settings.connect(`changed::${PREFERENCES_KEYS.NOTES_LIMIT}`, () =>
        this._scan(),
      ),
    );
    this._signals.push(
      this._settings.connect(
        `changed::${PREFERENCES_KEYS.PANEL_POSITION}`,
        () => this._onPanelPositionChanged(),
      ),
    );
  }

  _onPanelPositionChanged() {
    Main.panel._addToPanelBox(
      this.uuid,
      this._indicator,
      this._getPanelPosition(),
      Main.panel._leftBox,
    );
  }

  _setupMonitor() {
    const monitorDir = Gio.File.new_for_path(
      GLib.build_filenamev([GLib.get_home_dir(), TEXT_EDITOR_APP_PATH]),
    );
    if (!monitorDir.query_exists(null)) return;

    this._monitor = monitorDir.monitor(Gio.FileMonitorFlags.NONE, null);
    this._monitor.connect('changed', () => this._scheduleScan());
  }

  _scheduleScan() {
    if (this._timeout) GLib.Source.remove(this._timeout);

    this._timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, DEBOUNCE_MS, () => {
      this._timeout = null;
      this._scan();
      return GLib.SOURCE_REMOVE;
    });
  }

  _scan() {
    const limit = Math.max(
      MIN_NOTES_LIMIT,
      Math.min(
        MAX_NOTES_LIMIT,
        this._settings.get_int(PREFERENCES_KEYS.NOTES_LIMIT),
      ),
    );

    this._notes = getRecentNotes().slice(0, limit);
    this._menu.update(this._notes);
  }
}
