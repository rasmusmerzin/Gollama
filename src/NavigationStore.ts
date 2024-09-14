export class NavigationStore extends EventTarget {
  static instance: NavigationStore | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new NavigationStore();
    this.instance.load();
    return this.instance;
  }

  open = true;

  set(open: boolean) {
    this.open = open;
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  load() {
    this.open = !!localStorage.getItem("chat_list");
  }

  save() {
    if (this.open) localStorage.setItem("chat_list", "true");
    else localStorage.removeItem("chat_list");
  }
}
