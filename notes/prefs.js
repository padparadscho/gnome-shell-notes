// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import {
  MAX_NOTES_LIMIT,
  MAX_PANEL_POSITION,
  MIN_NOTES_LIMIT,
  MIN_PANEL_POSITION,
  PREFERENCES_KEYS,
} from './constants.js';

export default class NotesPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    const page = new Adw.PreferencesPage();
    window.add(page);

    page.add(this._buildNotesFolderGroup(settings, window));
    page.add(this._buildNotesLimitGroup(settings));
    page.add(this._buildPanelPositionGroup(settings));
  }

  _buildNotesFolderGroup(settings, window) {
    const notesFolderGroup = new Adw.PreferencesGroup({
      title: 'Notes Folder',
      description: 'Folder where new notes are created.',
    });

    const notesFolderRow = new Adw.EntryRow({ title: 'Path' });
    notesFolderRow.set_text(settings.get_string(PREFERENCES_KEYS.NOTES_FOLDER));

    notesFolderRow.connect('notify::text', () => {
      settings.set_string(
        PREFERENCES_KEYS.NOTES_FOLDER,
        notesFolderRow.get_text().trim(),
      );
    });

    const selectFolderButton = new Gtk.Button({
      icon_name: 'folder-open-symbolic',
      tooltip_text: 'Browse',
      css_classes: ['flat'],
      valign: Gtk.Align.CENTER,
    });

    selectFolderButton.connect('clicked', () => {
      const fileChooser = Gtk.FileChooserNative.new(
        'Select Notes Folder',
        window,
        Gtk.FileChooserAction.SELECT_FOLDER,
        '_Open',
        '_Cancel',
      );

      fileChooser.connect('response', (dialog, response) => {
        if (response !== Gtk.ResponseType.ACCEPT) return;
        const file = dialog.get_file();
        if (!file) return;
        const path = file.get_path();
        if (!path) return;

        notesFolderRow.set_text(path);
        settings.set_string(PREFERENCES_KEYS.NOTES_FOLDER, path);
      });

      fileChooser.show();
    });

    notesFolderRow.add_suffix(selectFolderButton);
    notesFolderGroup.add(notesFolderRow);
    return notesFolderGroup;
  }

  _buildNotesLimitGroup(settings) {
    const notesLimitGroup = new Adw.PreferencesGroup({
      title: 'Display',
      description: 'Number of recent notes shown in the menu.',
    });

    const notesLimitRow = new Adw.SpinRow({
      title: 'Notes Limit',
      adjustment: new Gtk.Adjustment({
        lower: MIN_NOTES_LIMIT,
        upper: MAX_NOTES_LIMIT,
        step_increment: 1,
      }),
    });
    settings.bind(
      PREFERENCES_KEYS.NOTES_LIMIT,
      notesLimitRow,
      'value',
      Gio.SettingsBindFlags.DEFAULT,
    );

    notesLimitGroup.add(notesLimitRow);
    return notesLimitGroup;
  }

  _buildPanelPositionGroup(settings) {
    const panelPositionGroup = new Adw.PreferencesGroup({
      title: 'Panel Position',
      description: 'Position of the indicator in the top panel.',
    });

    const panelPositionRow = new Adw.SpinRow({
      title: 'Position',
      adjustment: new Gtk.Adjustment({
        lower: MIN_PANEL_POSITION,
        upper: MAX_PANEL_POSITION,
        step_increment: 1,
      }),
    });
    settings.bind(
      PREFERENCES_KEYS.PANEL_POSITION,
      panelPositionRow,
      'value',
      Gio.SettingsBindFlags.DEFAULT,
    );

    panelPositionGroup.add(panelPositionRow);
    return panelPositionGroup;
  }
}
