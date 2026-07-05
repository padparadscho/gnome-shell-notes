// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

import Gio from 'gi://Gio';

import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import { getNotesFolder } from '../utils.js';
import { newNoteDialog } from './dialog.js';
import { NotesList } from './notesList.js';

export class NotesMenu extends PopupMenu.PopupMenuSection {
  constructor(settings, actions) {
    super();

    this._settings = settings;
    this._actions = actions;

    this._notesList = new NotesList();
    this.addMenuItem(this._notesList);
    this._addActions();
  }

  update(notes) {
    this._notesList.update(notes);
  }

  _addActions() {
    this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this.addMenuItem(this._createNewNoteItem());
    this.addMenuItem(this._createViewAllNotesItem());
    this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this.addMenuItem(this._createSettingsItem());
  }

  _createNewNoteItem() {
    const item = new PopupMenu.PopupImageMenuItem(
      _('New Note'),
      'document-new-symbolic',
      {},
    );

    item.connect('activate', () => {
      const dialog = newNoteDialog(this._settings);
      dialog.open(global.get_current_time());
    });

    return item;
  }

  _createViewAllNotesItem() {
    const item = new PopupMenu.PopupImageMenuItem(
      _('View All Notes'),
      'docviewer-app-symbolic',
      {},
    );

    item.connect('activate', () => {
      const target = getNotesFolder(this._settings);
      Gio.AppInfo.launch_default_for_uri(
        Gio.File.new_for_path(target).get_uri(),
        null,
      );
    });

    return item;
  }

  _createSettingsItem() {
    const item = new PopupMenu.PopupImageMenuItem(
      _('Settings'),
      'system-settings-symbolic',
      {},
    );

    item.connect('activate', () => this._actions.openPreferences?.());

    return item;
  }
}
