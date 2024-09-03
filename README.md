![Screenshot](./screenshot.png)

# Gollama

A GUI front-end for [Ollama](https://ollama.com) made with [Electron](https://www.electronjs.org).

## Building the Application

Make sure you have `nodejs`, `npm` and `ollama` installed.

Clone the project with `git` and inside the repository run `npm install` and `npm run make`.

The `make` script will output distributables in `./out/make/` directory.

## Installing Distributables

On Fedora install the `.rpm` package with

```bash
sudo rpm -i out/make/rpm/x64/Gollama-0.0.1-1.x86_64.rpm
```

On Debian install the `.deb` package with

```bash
sudo dpkg -i out/make/deb/x64/gollama_0.0.1_amd64.deb
```

> Note: architecture and version may be different.
