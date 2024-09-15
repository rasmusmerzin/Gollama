export type Theme = "system" | "dark" | "light";
export type Layout = "normal" | "dense";
export enum Color {
  Gray = "#888",
  Blue = "#08c",
  Orange = "#e30",
  Green = "#4b5",
  Pink = "#f28",
}

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
  layout: Layout = "normal";
  color: Color = Color.Gray;

  setColor(color: Color) {
    this.color = color;
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  setLayout(layout: Layout) {
    this.layout = layout;
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  setNavigationOpen(open: boolean) {
    this.navigation_open = open;
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
