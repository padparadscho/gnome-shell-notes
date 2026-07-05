// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';

import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import { getNotesFolder } from '../utils.js';
import { NOTE_FILE_EXTENSION } from '../constants.js';

export function newNoteDialog(settings) {
  const dialog = new ModalDialog.ModalDialog({
    styleClass: 'notes-dialog-content',
  });

  dialog.contentLayout.add_child(
    new St.Label({
      text: _('New Note'),
      style_class: 'notes-dialog-title',
      x_expand: true,
    }),
  );

  const entry = new St.Entry({
    hint_text: _('Note name…'),
    can_focus: true,
  });
  dialog.contentLayout.add_child(entry);

  dialog.setButtons([
    {
      label: _('Cancel'),
      action: () => dialog.close(global.get_current_time()),
    },
    {
      label: _('Create'),
      isDefault: true,
      action: () => {
        const noteName = entry.get_text().trim();
        if (!noteName) return;

        const notesFolder = getNotesFolder(settings);
        const noteFile = Gio.File.new_for_path(
          GLib.build_filenamev([
            notesFolder,
            `${noteName}${NOTE_FILE_EXTENSION}`,
          ]),
        );

        try {
          noteFile.create(Gio.FileCreateFlags.NONE, null);
        } catch {
          dialog.close(global.get_current_time());
          return;
        }

        dialog.close(global.get_current_time());
        Gio.AppInfo.launch_default_for_uri(noteFile.get_uri(), null);
      },
    },
  ]);

  dialog.setInitialKeyFocus(entry);
  return dialog;
}
