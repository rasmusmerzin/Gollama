export type Theme = "system" | "dark" | "light";

export class SettingsStore extends EventTarget {
  static instance: SettingsStore | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new SettingsStore();
    this.instance.load();
    return this.instance;
  }

  navigation_open = true;
  theme: Theme = "system";

  setTheme(theme: Theme) {
    this.theme = theme;
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  toggleNavigationOpen() {
    this.navigation_open = !this.navigation_open;
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  load() {
    const data = localStorage.getItem("settings");
    if (!data) return;
    try {
      Object.assign(this, JSON.parse(data));
    } catch (error) {
      console.error(error);
    }
  }

  save() {
    localStorage.setItem("settings", JSON.stringify(this));
  }
}
