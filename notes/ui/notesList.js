// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import Pango from 'gi://Pango';
import St from 'gi://St';

import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

export class NotesList extends PopupMenu.PopupMenuSection {
  update(notes) {
    this.removeAll();

    if (notes.length === 0) {
      this.addMenuItem(
        new PopupMenu.PopupMenuItem(_('No recent notes'), {
          reactive: false,
          can_focus: false,
        }),
      );
      return;
    }

    for (const note of notes) this.addMenuItem(this._createNoteItem(note));
  }

  _createNoteItem(note) {
    const item = new PopupMenu.PopupBaseMenuItem({
      reactive: true,
      can_focus: true,
    });

    const extension = note.path.match(/\.[^/.]+$/)?.[0] || '';

    item.add_child(
      new St.Label({
        text: extension,
        style_class: 'notes-extension-badge',
        y_align: Clutter.ActorAlign.CENTER,
      }),
    );

    const label = new St.Label({
      text: note.name.replace(/\.[^/.]+$/, ''),
      x_expand: true,
      y_align: Clutter.ActorAlign.CENTER,
    });
    label.clutter_text.single_line_mode = true;
    label.clutter_text.ellipsize = Pango.EllipsizeMode.END;
    item.add_child(label);

    item.connect('activate', () => {
      try {
        Gio.AppInfo.launch_default_for_uri(
          Gio.File.new_for_path(note.path).get_uri(),
          null,
        );
      } catch {
        // silently ignore
      }
    });

    return item;
  }
}
