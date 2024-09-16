export type Theme = "system" | "dark" | "light";
export type Layout = "cozy" | "wide";
export enum Color {
  Gray = "gray",
  Red = "red",
  Green = "green",
  Yellow = "yellow",
  Blue = "blue",
  Magenta = "magenta",
  Cyan = "cyan",
}

export class PreferencesStore extends EventTarget {
  static instance: PreferencesStore | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new PreferencesStore();
    this.instance.load();
    return this.instance;
  }

  navigation_open = true;
  theme: Theme = "system";
  layout: Layout = "cozy";
  color: Color = Color.Cyan;

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
    const data = localStorage.getItem("preferences");
    if (!data) return;
    try {
      Object.assign(this, JSON.parse(data));
    } catch (error) {
      console.error(error);
    }
  }

  save() {
    localStorage.setItem("preferences", JSON.stringify(this));
  }
}
