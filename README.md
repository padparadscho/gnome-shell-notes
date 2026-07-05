# Notes

GNOME Shell extension for quick creation and access to recent notes from GNOME Text Editor.

## Install

Download the latest release from the [releases page](https://github.com/padparadscho/gnome-shell-notes/releases)

```sh
# Extract
unzip -q notes@padparadscho.com.zip -d ~/.local/share/gnome-shell/extensions/notes@padparadscho.com/

# Compile
glib-compile-schemas ~/.local/share/gnome-shell/extensions/notes@padparadscho.com/schemas/

# Enable
gnome-extensions enable notes@padparadscho.com
```

> [!NOTE]
> On Wayland, log out and log back in.
> On X11, press `Alt + F2`, type `r`, and hit `Enter`.

## License

This project is licensed under the [AGPL-3.0](/LICENSE) license.
