export type Theme = "system" | "dark" | "light";
export type Layout = "cozy" | "wide";
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
  layout: Layout = "cozy";
  color: Color = Color.Gray;

  setColor(color: Color) {
    this.color = color;
    this.touch();
  }
  setLayout(layout: Layout) {
    this.layout = layout;
    this.touch();
  }
  setTheme(theme: Theme) {
    this.theme = theme;
    this.touch();
  }
  setNavigationOpen(open: boolean) {
    this.navigation_open = open;
    this.touch();
  }
  toggleNavigationOpen() {
    this.navigation_open = !this.navigation_open;
    this.touch();
  }

  touch() {
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
