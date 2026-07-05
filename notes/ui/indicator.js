// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: AGPL-3.0-only

import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export const Indicator = GObject.registerClass(
  {
    GTypeName: 'NotesIndicator',
  },
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(0.5, _('Notes'), false);

      this._label = new St.Label({
        text: _('Notes'),
        y_align: Clutter.ActorAlign.CENTER,
      });

      this.add_child(this._label);
    }
  },
);
